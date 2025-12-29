import { db } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(Request) {
    const payload = await Request.json();

    const event = payload.type;
    const subscriptionId = payload.data?.subscription_id;

    if (!subscriptionId) return NextResponse.json({ ok: true });

    if (event === "SUBSCRIPTION.ACTIVE") {
        await db.user.update({
            where: { cashfreeSubscriptionId: subscriptionId },
            data: {
                plan: "PRO",
                subscriptionStatus: "ACTIVE",
                currentPeriodEnd: new Date(payload.data.next_billing_date),
            },
        });
    }

    if (event === "SUBSCRIPTION.CANCELLED") {
        await db.user.update({
            where: { cashfreeSubscriptionId: subscriptionId },
            data: {
                plan: "FREE",
                subscriptionStatus: "ACTIVE",
            },
        });
    }

    return NextResponse.json({ received: true });
}
