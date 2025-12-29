"use server";
import { db } from "@/lib/prisma";
import { auth } from '@clerk/nextjs/server';
import { Cashfree } from "@/lib/cashfree";


export async function getUserSubscription() {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    const user = await db.user.findUnique(
        {
            where: { clerkUserId: userId, }

        }
    )

    if (!user) {
        throw new Error("User not found");
    }

    try {
        const user = await db.user.findUnique({
            where: { clerkUserId: userId },
            select: {
                plan: true,
                subscriptionStatus: true,
            },
        });

        return user;
    } catch (error) {
        console.log("Error in getting subscription status: ", error.message);
        throw new Error("Failed to get user subscription status", error.message);
    }
}

export async function isProUser() {
    const user = await getUserSubscription();
    return user?.plan === "PRO" && user?.subscriptionStatus === "ACTIVE";
}


export async function createProSubscription() {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    const user = await db.user.findUnique(
        {
            where: { clerkUserId: userId, }

        }
    )

    if (!user) {
        throw new Error("User not found");
    }

    try {
        // This logic will get implemented only for the first time because the user is not yet created on cashfree(because from db we wont get any cashfreeId it will be empty)
        let customerId = user.cashfreeCustomerId;
        if (!customerId) {
            const customer = await Cashfree.PGCreateCustomer({
                customer_id: `user_${user.id}`,
                customer_email: user.email,
                customer_phone: "999999999",
                customer_name: user.name ?? "User",
            });

            customerId = customer.data.customer_id;

            // Now the customer is created on cashfree and we have the cashfreeId now so update it in db as well
            await db.user.update({
                where: { id: user.id },
                data: {
                    cashfreeCustomerId: customerId, // reuse field
                },
            });

        }
    } catch (error) {
        console.log("Error in creating cashfree customer: ", error.message);
        throw new Error("Failed to create cashfree customer", error.message);
    }

    try {
        // Create subscription
        const subscription = await Cashfree.PGCreateSubscription({
            subscription_id: `sub_${user.id}_${Date.now()}`,
            customer_id: customerId,
            plan_id: "pro_monthly", // create this in Cashfree dashboard
            subscription_amount: 199,
            subscription_currency: "INR",
            subscription_period: "MONTH",
            subscription_interval: 1,
            return_url: `${process.env.NEXT_PUBLIC_APP_URL}/subscription/success`,
        });

        // Save subscription id
        await db.user.update({
            where: { id: user.id },
            data: {
                cashfreeSubscriptionId: subscription.data.subscription_id,
            },
        });

        return subscription.data.payment_link;
    } catch (error) {
        console.log("Error in creating subscription: ", error.message);
        throw new Error("Failed to create subscription", error.message);
    }


}