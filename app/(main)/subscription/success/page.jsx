"use client"

import React from 'react'

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

const PaymentSuccessPage = () => {

    const router = useRouter();

    useEffect(() => {
        // Auto-redirect after 3 seconds
        const timer = setTimeout(() => {
            router.push("/dashboard");
        }, 1000);
        return () => clearTimeout(timer);
    }, [router]);

    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="text-center space-y-4">
                <h1 className="text-3xl font-bold">Payment Successful 🎉</h1>
                <p>Your PRO plan is activated.</p>
                <p className="text-sm text-gray-400">Redirecting to dashboard...</p>
            </div>
            <Button onClick={() => router.push("/dashboard")}>Go to Dashboard</Button>
        </div >
    )
}

export default PaymentSuccessPage;