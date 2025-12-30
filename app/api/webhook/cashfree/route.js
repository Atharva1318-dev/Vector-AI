import { db } from "@/lib/prisma";
import { NextResponse } from "next/server";
import crypto from "crypto";

export async function POST(req) {
    try {

        const rawBody = await req.text();
        const signature = req.headers.get("x-webhook-signature");
        const timestamp = req.headers.get("x-webhook-timestamp");

        // 2. Manual Verification (Standard Node.js - No SDK needed)
        // This ensures the request is actually from Cashfree
        if (signature && timestamp) {
            const secretKey = process.env.CASHFREE_SECRET_KEY;
            const data = timestamp + rawBody;

            const generatedSignature = crypto
                .createHmac("sha256", secretKey)
                .update(data)
                .digest("base64");

            if (generatedSignature !== signature) {
                return NextResponse.json({ error: "Invalid signature" }, { status: 403 });
            }
        }

        // 3. Parse Data
        const payload = JSON.parse(rawBody);
        const event = payload.type;
        const data = payload.data;

        // Support both old and new API ID fields just in case
        const subscriptionId = data.subscription_id || data.subscriptionReferenceId;

        if (!subscriptionId) {
            return NextResponse.json({ ok: true });
        }

        // 4. Handle Events (Updated for 2025-01-01 API)
        const isSuccess =
            event === "SUBSCRIPTION_PAYMENT_SUCCESS" ||
            event === "SUBSCRIPTION.ACTIVE" || // Keep old event for safety
            (event === "SUBSCRIPTION_STATUS_CHANGE" && data.subscription_status === "ACTIVE");

        if (isSuccess) {
            // Determine end date
            const nextPaymentDate = data.next_payment_on || data.nextPaymentOn;
            const currentPeriodEnd = nextPaymentDate
                ? new Date(nextPaymentDate)
                : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // Default 30 days

            await db.user.updateMany({
                where: { cashfreeSubscriptionId: subscriptionId },
                data: {
                    plan: "PRO",
                    subscriptionStatus: "ACTIVE",
                    currentPeriodEnd: currentPeriodEnd,
                },
            });
        }

        const isFailure =
            event === "SUBSCRIPTION_PAYMENT_FAILED" ||
            event === "SUBSCRIPTION_CANCELLED" ||
            event === "SUBSCRIPTION.CANCELLED" || // Keep old event for safety
            (event === "SUBSCRIPTION_STATUS_CHANGE" &&
                ["CANCELLED", "EXPIRED", "COMPLETED"].includes(data.subscription_status));

        if (isFailure) {
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