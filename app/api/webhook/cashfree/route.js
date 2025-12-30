import { db } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { Cashfree } from "@/lib/cashfree"; // Import the initialized SDK

export async function POST(req) {
    try {
        // 1. Get raw body and headers
        const rawBody = await req.text();
        const signature = req.headers.get("x-webhook-signature");
        const timestamp = req.headers.get("x-webhook-timestamp");

        // 2. Verify Signature using the SDK
        if (!signature || !timestamp) {
            return NextResponse.json({ error: "Missing headers" }, { status: 400 });
        }

        try {
            // This throws an error if verification fails
            Cashfree.PGVerifyWebhookSignature(signature, rawBody, timestamp);
        } catch (err) {
            console.error("Signature Verification Failed:", err.message);
            return NextResponse.json({ error: "Invalid signature" }, { status: 403 });
        }

        // 3. Parse JSON and Handle Events
        const payload = JSON.parse(rawBody);
        const event = payload.type;
        const subscriptionId = payload.data?.subscriptionReferenceId;

        if (!subscriptionId) {
            return NextResponse.json({ message: "No subscription ID" }, { status: 200 });
        }

        // 4. Update User Status
        if (event === "SUBSCRIPTION.ACTIVATED" || event === "SUBSCRIPTION.ACTIVE") {
            await db.user.updateMany({
                where: { cashfreeSubscriptionId: subscriptionId },
                data: {
                    plan: "PRO",
                    subscriptionStatus: "ACTIVE",
                    currentPeriodEnd: payload.data.nextPaymentOn ? new Date(payload.data.nextPaymentOn) : undefined,
                },
            });
        }

        if (event === "SUBSCRIPTION.CANCELLED" || event === "SUBSCRIPTION.SUSPENDED") {
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