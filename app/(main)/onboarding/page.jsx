import { industries } from "@/data/industries";
import OnboardingForm from "./_components/OnBoardingForm";
import { getUserOnboardingStatus } from "@/actions/user";
import React from "react";
import { redirect } from "next/navigation";

async function OnboardingPage() {
    // Check if user is already onboarded
    const { isOnboarded } = await getUserOnboardingStatus();
    if (isOnboarded) {
        redirect("/dashboard");
    }
    return (
        <main className="mt-24"><OnboardingForm industries={industries} /></main>
    );
}

export default OnboardingPage;