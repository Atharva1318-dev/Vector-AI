import React from 'react'
import PricingCard from './_components/PricingCard'

const SubscriptionPage = () => {
    return (
        <div className="w-full min-h-screen py-6 md:py-15 px-4">
            {/* 1. Ambient Background Glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[280px] bg-purple-900/20 blur-[110px] rounded-full pointer-events-none -z-10" />

            {/* 2. Header Section */}
            <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
                <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">
                    Accelerate Your Growth
                </h1>
                <p className="text-neutral-400 text-lg md:text-xl">
                    Choose the plan that fits your career trajectory. Unlock the full power of Vector AI.
                </p>
            </div>

            <PricingCard />
        </div>
    )
}

export default SubscriptionPage