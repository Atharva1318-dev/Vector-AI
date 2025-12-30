import { db } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { Cashfree } from "@/lib/cashfree";

export async function POST(req) {
    try {
        // 1. Get raw body and headers
        const rawBody = await req.text();
        const signature = req.headers.get("x-webhook-signature");
        const timestamp = req.headers.get("x-webhook-timestamp");

        // 2. Verify Signature using the SDK (YOUR WORKING CODE)
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

        // 3. Parse JSON and Handle Events (UPDATED FOR 2025 API)
        const payload = JSON.parse(rawBody);
        const event = payload.type;
        const data = payload.data; // New API puts data here

        // New API uses 'subscription_id', Old used 'subscriptionReferenceId'
        // We check both to be safe
        const subscriptionId = data.subscription_id || data.subscriptionReferenceId;

        if (!subscriptionId) {
            return NextResponse.json({ message: "No subscription ID" }, { status: 200 });
        }

        // 4. Update User Status
        // New API Events: SUBSCRIPTION_PAYMENT_SUCCESS or SUBSCRIPTION_STATUS_CHANGE
        if (
            event === "SUBSCRIPTION_PAYMENT_SUCCESS" ||
            (event === "SUBSCRIPTION_STATUS_CHANGE" && data.subscription_status === "ACTIVE")
        ) {
            // New API uses 'next_payment_on', old used 'nextPaymentOn'
            const nextPayment = data.next_payment_on || data.nextPaymentOn;

            await db.user.updateMany({
                where: { cashfreeSubscriptionId: subscriptionId },
                data: {
                    plan: "PRO",
                    subscriptionStatus: "ACTIVE",
                    currentPeriodEnd: nextPayment ? new Date(nextPayment) : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
                },
            });
        }

        // Handle Cancel/Failure
        if (
            event === "SUBSCRIPTION_PAYMENT_FAILED" ||
            event === "SUBSCRIPTION_CANCELLED" ||
            (event === "SUBSCRIPTION_STATUS_CHANGE" &&
                ["CANCELLED", "EXPIRED", "COMPLETED"].includes(data.subscription_status))
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