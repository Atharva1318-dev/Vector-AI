"use client"
import Link from "next/link";
import { Button } from "@/components/ui/button"
import Image from "next/image";
import { useRef, useEffect } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ContainerScroll } from "@/components/ui/container-scroll-animation"; // Optional if you have Aceternity, otherwise standard div
import { ArrowRight, Sparkles, FileText, Bot, TrendingUp } from "lucide-react";

import { TextGenerateEffect } from "./ui/text-generate-effect";
import { HoverBorderGradient } from "./ui/hover-border-gradient";
import { BackgroundRippleEffect } from "@/components/ui/background-ripple-effect";

function Hero() {
    const sectionRef = useRef(null);
    const titleRef = useRef(null);
    // const descRef = useRef(null);
    const buttonRef = useRef(null);
    // Refs for the new visual elements
    const heroVisualRef = useRef(null);
    const floatingCard1Ref = useRef(null);
    const floatingCard2Ref = useRef(null);

    useGSAP(() => {
        const tl = gsap.timeline();

        // 1. Text Animation (Staggered fade up)
        tl.from(titleRef.current, {
            opacity: 0,
            y: 50,
            duration: 0.8,
            ease: "power3.out"
        }, 0)
            // .from(descRef.current, {
            //     opacity: 0,
            //     y: 30,
            //     duration: 0.6,
            //     ease: "power3.out"
            // }, 0.2)
            .from(buttonRef.current, {
                opacity: 0,
                y: 20,
                duration: 0.6,
                ease: "power3.out"
            }, 0.4);

        // 2. Hero Visual Animation (Scale up and fade in)
        tl.from(heroVisualRef.current, {
            opacity: 0,
            scale: 0.9,
            x: 50,
            duration: 1,
            ease: "power3.out"
        }, 0.3);

        // 3. Floating Cards Animation (Pop in)
        tl.from([floatingCard1Ref.current, floatingCard2Ref.current], {
            opacity: 0,
            y: 40,
            scale: 0.8,
            stagger: 0.2,
            duration: 0.8,
            ease: "back.out(1.7)"
        }, 0.8);

        // 4. Continuous Hover Effect for the Visuals
        gsap.to(heroVisualRef.current, {
            y: -15,
            duration: 4,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut"
        });

        // Floating cards moving slightly differently for depth
        gsap.to(floatingCard1Ref.current, {
            y: -20,
            x: -5,
            duration: 5,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut",
            delay: 1
        });

        gsap.to(floatingCard2Ref.current, {
            y: -10,
            x: 5,
            duration: 3.5,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut",
            delay: 0.5
        });

    }, { scope: sectionRef });

    const words = `Vector AI gives your career the right speed and direction. Navigate the optimal path to your dream job with AI-powered resume optimization, mock interviews, and real-time salary insights`;

    return (
        // PRESERVED: Your original background setup
        <section ref={sectionRef} className="relative min-h-[90vh] overflow-hidden grid-background pt-28 pb-16 md:pt-38 md:pb-28">
            <BackgroundRippleEffect rows={14} cols={30} interactive={true} />
            <div className="absolute inset-0 bg-mesh-gradient" />
            <div className="absolute right-[20%] top-[15%] h-[500px] w-[500px] rounded-full bg-indigo-600/20 blur-[120px] glow-indigo" />
            <div className="absolute bottom-[10%] left-[15%] h-[400px] w-[400px] rounded-full bg-purple-600/20 blur-[100px] glow-purple" />

            <div className="container relative mx-auto px-4 md:px-6">
                <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">

                    {/* LEFT SIDE: Text Content */}
                    <div className="flex flex-col gap-6 max-w-2xl order-2 lg:order-1">
                        <div ref={titleRef}>
                            <div className="flex items-center gap-2 mb-6">
                                <span className="px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-sm font-medium backdrop-blur-sm flex items-center gap-2">
                                    <Sparkles className="w-4 h-4" />
                                </span>
                            </div>

                            <h5 className="text-balance font-semibold leading-[1.1] tracking-tight text-white text-2xl md:text-6xl lg:text-7xl">
                                Your Personal <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 text-2xl md:text-6xl lg:text-7xl">
                                    AI Career Coach
                                </span>
                            </h5>
                        </div>


                        <TextGenerateEffect words={words} />


                        <div ref={buttonRef} className="flex flex-col gap-4 sm:flex-row sm:items-center mt-2">
                            <Link href="/dashboard">
                                <HoverBorderGradient
                                    containerClassName="rounded-full"
                                    as="button"
                                    className="dark:bg-black bg-white text-black dark:text-white flex items-center space-x-2 h-14"
                                >
                                    Get Started
                                    <ArrowRight className="ml-2 h-5 w-5" />
                                </HoverBorderGradient>
                            </Link>
                        </div>
                    </div>

                    {/* RIGHT SIDE: The "Image" (Dynamic UI Composition) */}
                    <div className="relative mx-auto w-full max-w-[600px] lg:max-w-none perspective-1000 order-1 lg:order-2">

                        {/* Main Dashboard Preview Card */}
                        <div ref={heroVisualRef} className="relative z-10 rounded-3xl border border-white/10 bg-slate-950/50 backdrop-blur-xl shadow-2xl shadow-indigo-500/10 overflow-hidden">
                            {/* Browser Header Mockup */}
                            <div className="flex items-center gap-2 px-4 py-3 border-b border-white/5 bg-white/5">
                                <div className="flex gap-1.5">
                                    <div className="w-3 h-3 rounded-full bg-red-500/50" />
                                    <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
                                    <div className="w-3 h-3 rounded-full bg-green-500/50" />
                                </div>
                                <div className="ml-4 h-6 w-1/3 rounded-full bg-white/5" />
                            </div>

                            {/* Dashboard Content Mockup */}
                            <div className="p-6 space-y-6">
                                {/* Header */}
                                <div className="flex justify-between items-center">
                                    <div className="space-y-2">
                                        <div className="h-6 w-32 rounded bg-indigo-500/20" />
                                        <div className="h-4 w-48 rounded bg-slate-800" />
                                    </div>
                                    <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500" />
                                </div>

                                {/* Main Chart Area */}
                                <div className="h-16 md:h-48 rounded-xl bg-slate-900/50 border border-white/5 p-4 relative overflow-hidden">
                                    <div className="absolute inset-0 bg-gradient-to-t from-indigo-500/10 to-transparent opacity-50" />
                                    <div className="flex items-end justify-between h-full gap-2 px-2 pb-[0.1px] md:pb-2">
                                        {[40, 65, 55, 85, 75, 95, 80].map((h, i) => (
                                            <div
                                                key={i}
                                                style={{ height: `${h}%` }}
                                                className="w-full rounded-t-sm bg-indigo-500/30 hover:bg-indigo-500/50 transition-colors"
                                            />
                                        ))}
                                    </div>
                                </div>

                                {/* Bottom stats */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="h-24 rounded-xl bg-slate-800/50 animate-pulse" />
                                    <div className="h-24 rounded-xl bg-slate-800/50 animate-pulse delay-75" />
                                </div>
                            </div>
                        </div>

                        {/* Floating Element 1: Resume Score */}
                        <div ref={floatingCard1Ref} className="absolute -top-12 -right-4 md:-right-12 z-20 bg-slate-900/90 border border-white/10 backdrop-blur-md p-2 md:p-4 rounded-2xl shadow-xl flex items-center gap-4 w-56 md:w-64">
                            <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center text-green-400">
                                <FileText className="w-6 h-6" />
                            </div>
                            <div>
                                <div className="text-xs text-slate-400 uppercase font-semibold tracking-wider">ATS Score</div>
                                <div className="text-xl font-bold text-white">92/100</div>
                            </div>
                        </div>

                        {/* Floating Element 2: Interview Bot */}
                        <div ref={floatingCard2Ref} className="absolute -bottom-8 -left-4 md:-left-12 z-30 bg-indigo-950/90 border border-indigo-500/30 backdrop-blur-md p-2 md:p-4 rounded-2xl shadow-2xl flex items-center gap-4 w-auto">
                            <div className="w-12 h-12 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-400 animate-pulse">
                                <Bot className="w-6 h-6" />
                            </div>
                            <div className="pr-4">
                                <div className="text-xs text-indigo-300 font-medium">Mock Interview</div>
                                <div className="text-sm font-bold text-white">"Great answer!"</div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </section>
    )
}

export default Hero;