"use server";
import { db } from "@/lib/prisma";
import { auth } from '@clerk/nextjs/server'
import { success } from "zod";
import { generateAIInsights } from "./dashboard";

export async function updateUser(data) {
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
        // First find if the provided industry in the onboarding page form exists
        // If the industry does not exists, for now create it with default value but later on we will handle it with AI to generate
        // And finally update the user

        //So for this 3 api calls we will use transaction in prisma is used when we want to run more than 1 queries at once together, and if any of them fails then dont proceed, thats why it is like a transaction

        const result = await db.$transaction(
            async (tx) => {
                // First find if the provided industry in the onboarding page form exists
                let industryInsight = await tx.industryInsights.findUnique({
                    where: {
                        industry: data.industry,
                    }
                });

                // If the industry does not exists, for now create it with default value but later on we will handle it with AI to generate
                if (!industryInsight) {
                    const insights = await generateAIInsights(data.industry);

                    industryInsight = await db.industryInsights.create({
                        data: {
                            industry: data.industry,
                            ...insights,
                            nextUpdate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
                        },
                    });
                }

                // update the user
                const updatedUser = await tx.user.update({
                    where: {
                        id: user.id,
                    },
                    data: {
                        industry: data.industry,
                        experience: data.experience,
                        bio: data.bio,
                        skills: data.skills,
                    }
                });

                return { updatedUser, industryInsight };
            }, {
            timeout: 33000, // it will try for this much time after this error will be thrown
        }
        );

        return { success: true, ...result };
    } catch (error) {
        console.log("Error in updating user and industry: ", error.message);
        throw new Error("Failed to update profile", error.message);
    }
}

export async function getUserOnboardingStatus() {
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
        //console.log("Checking onboarding status for userId:", userId);
        //console.log("User data fetched:", user);
        const user = await db.user.findUnique({
            where: {
                clerkUserId: userId,
            },
            select: {
                industry: true, // this means only return the industry field, nothing else.
            },
        });

        // So this above user can have = 
        //1. If user exists:
        // { industry: "Tech" }
        //2. If user exists but industry not set yet:
        // { industry: null }
        //3. If user does NOT exist:
        // null
        console.log("Onboarding status:", !!user?.industry);
        return {
            isOnboarded: !!user?.industry, //? means optional chaining if user exists only then check .industry else not
        }
        //Double !! converts any non null undefined value to true, so basically if onboarded then true will be returned else false
    } catch (error) {
        console.log("Error checking the onboarding status", error);
        // throw new Error("Failed to check onboarding status");
    }
}