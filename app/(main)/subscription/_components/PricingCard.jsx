"use client"
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Check } from "lucide-react";

import { createProSubscription } from "@/actions/subscription";

const pricingPlans = [
    {
        name: "FREE",
        price: "0",
        description: "Perfect for getting started with career acceleration.",
        features: [
            "Industry Trends & Insights",
            "1 Resume Optimization per month",
            "1 AI Mock Interview per month",
            "Basic Salary Insights",
        ],
        cta: "Get Started",
        popular: false,
    },
    {
        name: "PRO",
        price: "199",
        description: "Unlock full AI potential to land your dream job faster.",
        features: [
            "Everything in Free",
            "Unlimited Resume Optimizations",
            "Unlimited AI Cover Letters",
            "Unlimited Mock Interviews",
            "Real-time ATS Scoring",
            "Exclusive Job Market Analytics",
        ],
        cta: "Upgrade Now",
        popular: true, // This drives the highlighting logic
    },
];

const PricingCard = () => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl px-6 mx-auto">
            {pricingPlans.map((plan, index) => (
                <Card
                    key={index}
                    className={`relative flex flex-col border border-white/10 bg-white/5 backdrop-blur-sm transition-transform duration-300 hover:scale-[1.02] ${plan.popular
                        ? "border-purple-500/50 shadow-[0_0_30px_rgba(168,85,247,0.15)]"
                        : "hover:border-white/20"
                        }`}
                >
                    {/* Popular Badge */}
                    {plan.popular && (
                        <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-bold uppercase tracking-wider shadow-lg">
                            Most Popular
                        </div>
                    )}

                    <CardHeader className="pb-4">
                        <CardTitle className="text-2xl font-bold text-white">
                            {plan.name}
                        </CardTitle>
                        <CardDescription className="text-neutral-400 min-h-[40px]">
                            {plan.description}
                        </CardDescription>
                    </CardHeader>

                    <CardContent className="flex-grow space-y-6">
                        {/* Price Display */}
                        <div className="flex items-baseline gap-1">
                            <span className="text-4xl font-extrabold text-white">
                                ₹{plan.price}
                            </span>
                            <span className="text-neutral-400">/month</span>
                        </div>

                        {/* Features List */}
                        <ul className="space-y-3 text-neutral-300 text-sm">
                            {plan.features.map((feature, i) => (
                                <li key={i} className="flex items-center gap-3">
                                    <div className="p-1 rounded-full bg-purple-500/20 text-purple-400 shrink-0">
                                        <Check className="h-3 w-3" />
                                    </div>
                                    <span className="leading-tight">{feature}</span>
                                </li>
                            ))}
                        </ul>
                    </CardContent>

                    <CardFooter className="pt-4">
                        {plan.name == 'FREE' ?
                            <>
                                <Link href="/dashboard">
                                    <Button
                                        className={`w-full h-12 rounded-xl text-base font-semibold transition-all duration-300 ${plan.popular
                                            ? "bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white shadow-lg shadow-purple-500/25"
                                            : "bg-white text-black hover:bg-neutral-200"
                                            }`}
                                    >
                                        {plan.cta}
                                    </Button>
                                </Link>
                            </> :
                            <>
                                <Button
                                    className={`w-full h-12 rounded-xl text-base font-semibold transition-all duration-300 ${plan.popular
                                        ? "bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white shadow-lg shadow-purple-500/25"
                                        : "bg-white text-black hover:bg-neutral-200"
                                        }`}
                                    onClick={async () => {
                                        const paymentLink = await createProSubscription();
                                        window.location.href = paymentLink;
                                    }}
                                >
                                    {plan.cta}
                                </Button>
                            </>}
                    </CardFooter>
                </Card>
            ))}
        </div>
    )
}

export default PricingCard;