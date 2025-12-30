"use server";

import { db } from "@/lib/prisma";
import { auth } from '@clerk/nextjs/server';

// 1. Define Plan Details
const PRO_PLAN = {
    planId: "PRO_MONTHLY_PLAN", // Use a consistent ID
    planName: "Pro Monthly Subscription",
    amount: 199,
    intervalType: "MONTH",
    intervals: 1,
    description: "Pro plan for Vector AI"
};

// Helper for Cashfree API calls (v2025-01-01)
const cashfreeRequest = async (endpoint, method = "GET", body = null) => {
    // 1. Determine URL based on Env
    const baseUrl = process.env.CASHFREE_ENV === "PROD"
        ? "https://api.cashfree.com/pg"
        : "https://sandbox.cashfree.com/pg";

    const headers = {
        "Content-Type": "application/json",
        "x-client-id": process.env.CASHFREE_APP_ID,
        "x-client-secret": process.env.CASHFREE_SECRET_KEY,
        "x-api-version": "2025-01-01", // Using the version from your docs
    };

    const config = {
        method,
        headers,
        body: body ? JSON.stringify(body) : null,
    };

    try {
        const response = await fetch(`${baseUrl}${endpoint}`, config);
        const data = await response.json();

        if (!response.ok) {
            console.error("Cashfree API Error:", data);
            throw new Error(data.message || `API request failed: ${response.statusText}`);
        }
        return data;
    } catch (error) {
        console.error("Cashfree Request Failed:", error);
        throw error;
    }
};

export async function getUserSubscription() {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    const user = await db.user.findUnique({
        where: { clerkUserId: userId },
        select: {
            plan: true,
            subscriptionStatus: true,
            currentPeriodEnd: true,
        },
    });

    if (!user) {
        throw new Error("User not found");
    }

    return user;
}

export async function isProUser() {
    const { userId } = await auth();
    if (!userId) return false;

    const user = await db.user.findUnique({
        where: { clerkUserId: userId },
        select: {
            plan: true,
            subscriptionStatus: true,
            currentPeriodEnd: true, // Optional: Check if expired
        },
    });

    if (!user) return false;

    // Check status and if period hasn't passed (optional robustness)
    const isValid = user.plan === "PRO" &&
        user.subscriptionStatus === "ACTIVE" &&
        (user.currentPeriodEnd ? new Date(user.currentPeriodEnd) > new Date() : true);

    return isValid;
}

export async function createProSubscription() {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    const user = await db.user.findUnique({
        where: { clerkUserId: userId },
    });

    if (!user) throw new Error("User not found");

    // 2. Ensure Plan Exists (Idempotent check)
    // We try to fetch the plan. If it fails (404), we create it.
    try {
        await cashfreeRequest(`/plans/${PRO_PLAN.planId}`);
    } catch (error) {
        console.log("Plan not found, creating new plan...");
        await cashfreeRequest("/plans", "POST", {
            plan_id: PRO_PLAN.planId,
            plan_name: PRO_PLAN.planName,
            plan_type: "PERIODIC",
            plan_currency: "INR",
            plan_recurring_amount: PRO_PLAN.amount,
            plan_max_amount: PRO_PLAN.amount,
            plan_intervals: PRO_PLAN.intervals,
            plan_interval_type: PRO_PLAN.intervalType,
            plan_note: PRO_PLAN.description,
        });
    }

    // 3. Create Subscription Session
    try {
        // Unique ID for this subscription attempt
        const subscriptionId = `SUB-${user.id}-${Date.now()}`;

        const payload = {
            subscription_id: subscriptionId,
            plan_id: PRO_PLAN.planId,
            customer_details: {
                customer_name: user.name || "Vector AI User",
                customer_email: user.email,
                customer_phone: user.phone || "9999999999", // Required field
                customer_id: user.id,
            },
            return_url: `${process.env.NEXT_PUBLIC_APP_URL}/subscription/success`,
            subscription_note: "Vector AI Pro Subscription",
        };

        const response = await cashfreeRequest("/subscriptions", "POST", payload);

        // 4. Save to DB
        await db.user.update({
            where: { id: user.id },
            data: {
                cashfreeSubscriptionId: response.subscription_id,
                cashfreeCustomerId: user.id,
            },
        });

        // 5. Return Session ID to Frontend
        return {
            subscriptionSessionId: response.subscription_session_id,
            subscriptionId: response.subscription_id
        };

    } catch (error) {
        console.error("Error creating subscription:", error.message);
        throw new Error("Failed to create subscription");
    }
}