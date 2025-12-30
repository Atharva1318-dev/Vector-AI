import { db } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { Cashfree } from "@/lib/cashfree";

export async function POST(req) {
    try {
        const rawBody = await req.text();
        const signature = req.headers.get("x-webhook-signature");
        const timestamp = req.headers.get("x-webhook-timestamp");

        if (!signature || !timestamp) {
            return NextResponse.json({ error: "Missing headers" }, { status: 400 });
        }

        // 1. Verify Signature
        try {
            // This verification works for both PG and Subscription webhooks if using the same App ID/Secret
            Cashfree.PGVerifyWebhookSignature(signature, rawBody, timestamp);
        } catch (err) {
            console.error("Signature Verification Failed:", err.message);
            return NextResponse.json({ error: "Invalid signature" }, { status: 403 });
        }

        // 2. Parse Payload
        const payload = JSON.parse(rawBody);
        const eventType = payload.type;
        const data = payload.data;
        const subscriptionId = data.subscription_id;

        if (!subscriptionId) {
            return NextResponse.json({ received: true });
        }

        // 3. Handle Events
        if (
            eventType === "SUBSCRIPTION_PAYMENT_SUCCESS" ||
            (eventType === "SUBSCRIPTION_STATUS_CHANGE" && data.subscription_status === "ACTIVE")
        ) {
            // Determine end date
            const endDate = data.next_payment_on
                ? new Date(data.next_payment_on)
                : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

            await db.user.updateMany({
                where: { cashfreeSubscriptionId: subscriptionId },
                data: {
                    plan: "PRO",
                    subscriptionStatus: "ACTIVE",
                    currentPeriodEnd: endDate,
                },
            });
        }

        if (
            eventType === "SUBSCRIPTION_CANCELLED" ||
            eventType === "SUBSCRIPTION_PAYMENT_FAILED"
        ) {
            await db.user.updateMany({
                where: { cashfreeSubscriptionId: subscriptionId },
                data: {
                    plan: "FREE",
                    subscriptionStatus: "INACTIVE",
                },
            });
        }

        return NextResponse.json({ received: true });

    } catch (error) {
        console.error("Webhook Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}