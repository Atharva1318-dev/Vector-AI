import Image from "next/image";
import React, { Suspense } from "react";
import { GridLoader } from "react-spinners";
import { TextGenerateEffect } from "@/components/ui/text-generate-effect";

const Layout = ({ children }) => {
    return (
        <div className="px-5 md:px-12 pb-12 mt-20 md:mt-24 relative">

            {/* Ambient Background Glow for the Header */}
            <div className="absolute top-0 left-0 w-full h-[300px] bg-purple-900/10 blur-[120px] pointer-events-none -z-10" />

            {/* Header Section */}
            <div className="flex items-center justify-between mb-6">
                <div className="space-y-1">
                    {/* Applied the purple/pink gradient to the title */}
                    <div className="flex flex-row items-center">
                        <h1 className="mr-3 text-4xl md:text-5xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">
                            Industry Insights
                        </h1>
                        <Image src="/insight (3).png" alt="insight" height={70} width={60}></Image>
                    </div>
                    <TextGenerateEffect words="Real-time market analysis, salary trends, and skills demand." />
                </div>
            </div>

            {/* Content Area */}
            <Suspense fallback={
                <div className="flex h-[60vh] items-center justify-center w-full">
                    <div className="flex flex-col items-center gap-4 text-neutral-400">
                        {/* Changed loader color to match the theme */}
                        <GridLoader color="#a855f7" size={15} margin={4} />
                        <p className="text-sm font-light animate-pulse">Analyzing market data...</p>
                    </div>
                </div>
            }>
                {children}
            </Suspense>
        </div>
    );
}

export default Layout;