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

// 2. Helper for Cashfree API calls
const getCashfreeBaseUrl = () => {
    return process.env.CASHFREE_ENV === "PROD"
        ? "https://api.cashfree.com/api/v2"
        : "https://test.cashfree.com/api/v2";
};

const cashfreeRequest = async (endpoint, method = "GET", body = null) => {
    const baseUrl = getCashfreeBaseUrl();
    const headers = {
        "Content-Type": "application/json",
        "x-client-id": process.env.CASHFREE_APP_ID,
        "x-client-secret": process.env.CASHFREE_SECRET_KEY,
        "x-api-version": "2022-09-01", // Stable Subscription API version
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

    if (!user) {
        throw new Error("User not found");
    }

    // 1. Ensure the Plan Exists in Cashfree
    try {
        await cashfreeRequest(`/subscription-plans/${PRO_PLAN.planId}`);
        // If successful, plan exists.
    } catch (error) {
        // If plan not found (usually 404), create it
        console.log("Plan not found, creating new plan...");
        try {
            await cashfreeRequest("/subscription-plans", "POST", {
                planId: PRO_PLAN.planId,
                planName: PRO_PLAN.planName,
                type: "PERIODIC",
                maxCycles: 0, // Infinite
                amount: PRO_PLAN.amount,
                intervalType: PRO_PLAN.intervalType,
                intervals: PRO_PLAN.intervals,
                description: PRO_PLAN.description,
            });
        } catch (createError) {
            // If it fails because it already exists (race condition), ignore.
            console.error("Error creating plan:", createError);
        }
    }

    // 2. Create the Subscription
    try {
        // Generate a unique subscription ID
        const subscriptionId = `SUB-${user.id}-${Date.now()}`;

        const subscriptionPayload = {
            subscriptionId: subscriptionId,
            planId: PRO_PLAN.planId,
            customerName: user.name || "Vector AI User",
            customerEmail: user.email,
            customerPhone: user.phone || "9999999999", // Required field
            returnUrl: `${process.env.NEXT_PUBLIC_APP_URL}/subscription/success`,
            // Optional: subscriptionExpiry, authorizationDetails, etc.
        };

        const subscriptionResponse = await cashfreeRequest("/subscriptions", "POST", subscriptionPayload);

        // 3. Save reference in Database
        await db.user.update({
            where: { id: user.id },
            data: {
                cashfreeSubscriptionId: subscriptionResponse.subReferenceId || subscriptionId,
                cashfreeCustomerId: user.id, // Store local user ID as customer ref if needed
            },
        });

        // 4. Return the Auth Link
        return subscriptionResponse.authLink;

    } catch (error) {
        console.error("Error in creating subscription:", error.message);
        throw new Error("Failed to create subscription: " + error.message);
    }
}