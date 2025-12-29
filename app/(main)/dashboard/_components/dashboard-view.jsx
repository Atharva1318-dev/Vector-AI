"use client"
import { LineChart, TrendingDown, TrendingUp, BriefcaseIcon, Brain, Zap, CheckCircle2 } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Badge } from "@/components/ui/badge";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress"
import React, { useRef } from "react";
import { format, formatDistanceToNow } from "date-fns";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const DashboardView = ({ insights }) => {
    const containerRef = useRef(null);
    const cardsRef = useRef([]);
    const chartRef = useRef(null);
    console.log(insights);

    useGSAP(() => {
        // Animate badge
        gsap.from(containerRef.current?.querySelector('[data-badge]'), {
            opacity: 0,
            y: -20,
            duration: 0.7,
            ease: "power3.out"
        });

        // Animate cards with stagger on scroll
        gsap.from(cardsRef.current, {
            opacity: 0,
            y: 40,
            duration: 0.8,
            stagger: 0.1,
            ease: "power3.out",
            scrollTrigger: {
                trigger: containerRef.current,
                start: "top 75%",
                once: true
            }
        });

        // Animate chart on scroll
        gsap.from(chartRef.current, {
            opacity: 0,
            y: 50,
            duration: 1,
            ease: "power3.out",
            scrollTrigger: {
                trigger: chartRef.current,
                start: "top 75%",
                once: true
            }
        });

        // Add hover animation to cards
        cardsRef.current.forEach((card) => {
            if (card) {
                card.addEventListener("mouseenter", () => {
                    gsap.to(card, {
                        y: -8,
                        boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.3)",
                        duration: 0.4,
                        ease: "power2.out"
                    });
                });
                card.addEventListener("mouseleave", () => {
                    gsap.to(card, {
                        y: 0,
                        boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)",
                        duration: 0.4,
                        ease: "power2.out"
                    });
                });
            }
        });
    }, { scope: containerRef });

    const salaryData = insights.salaryRanges.map((e) => ({
        name: e.role,
        min: e.min / 1000,
        max: e.max / 1000,
        median: e.median / 1000,
    }));

    const demandLevel = insights.demandLevel;
    const marketOutlook = insights.marketOutlook;

    const getDemandLevelColor = (demandLevel) => {
        switch (demandLevel.toLowerCase()) {
            case "high":
                return "bg-green-500";
            case "medium":
                return "bg-yellow-500";
            case "low":
                return "bg-red-500";
            default:
                return "bg-gray-500";
        }
    };

    const getMarketOutlookInfo = (marketOutlook) => {
        switch (marketOutlook.toLowerCase()) {
            case "positive":
                return { icon: TrendingUp, color: "text-green-500" };
            case "neutral":
                return { icon: LineChart, color: "text-yellow-500" };
            case "negative":
                return { icon: TrendingDown, color: "text-red-500" };
            default:
                return { icon: LineChartIcon, color: "text-gray-500" };
        }
    };

    const { icon: OutlookIcon, color: outlookColor } = getMarketOutlookInfo(marketOutlook);
    const demandLevelColor = getDemandLevelColor(demandLevel);

    const lastUpdatedDate = format(new Date(insights.lastUpdated), "dd/MM/yyyy");
    const nextUpdateDistance = formatDistanceToNow(
        new Date(insights.nextUpdate),
        { addSuffix: true }
    );

    return (
        <div ref={containerRef} className="space-y-5 relative">
            <h2 className="text-md md:text-lg text-muted-foreground">Your choosen industry: {insights.industry}</h2>
            {/* Ambient Background Glow */}
            <div className="absolute top-0 right-0 -z-10 w-96 h-96 bg-purple-900/10 blur-[100px] rounded-full pointer-events-none" />

            <div className="flex justify-between items-center mb-6">
                <Badge variant="outline" data-badge className="px-3 py-1 border-primary/20 bg-primary/5 text-primary">
                    Last updated: {lastUpdatedDate}
                </Badge>
            </div>

            {/* Top Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">

                {/* Market Outlook */}
                <Card ref={el => cardsRef.current[0] = el} className="border-white/10 bg-white/5 backdrop-blur-sm hover:bg-white/10 transition-colors">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Market Outlook</CardTitle>
                        <div className={`p-2 rounded-full bg-white/5 ${outlookColor}`}>
                            <OutlookIcon className="h-4 w-4" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className={`text-2xl font-bold ${outlookColor} mb-1`}>{marketOutlook}</div>
                        <p className="text-xs text-muted-foreground">Next update {nextUpdateDistance}</p>
                    </CardContent>
                </Card>

                {/* Demand Level */}
                <Card ref={el => cardsRef.current[1] = el} className="border-white/10 bg-white/5 backdrop-blur-sm hover:bg-white/10 transition-colors">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Demand Level</CardTitle>
                        <div className="p-2 rounded-full bg-white/5 text-purple-400">
                            <BriefcaseIcon className="h-4 w-4" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-white mb-3">{demandLevel}</div>
                        <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                            <div className={`h-full rounded-full ${demandLevelColor}`} style={{ width: "100%" }} />
                        </div>
                    </CardContent>
                </Card>

                {/* Top Skills (Spans 2 columns) */}
                <Card ref={el => cardsRef.current[2] = el} className="md:col-span-2 border-white/10 bg-white/5 backdrop-blur-sm hover:bg-white/10 transition-colors">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Top In-Demand Skills</CardTitle>
                        <div className="p-2 rounded-full bg-white/5 text-pink-400">
                            <Brain className="h-4 w-4" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-wrap gap-2">
                            {insights.topSkills.map((skill) => (
                                <Badge key={skill} variant="secondary" className="bg-primary/10 text-primary border-primary/20 hover:bg-primary/20 transition-colors py-1 px-2">
                                    {skill}
                                </Badge>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Salary Chart */}
            <Card ref={chartRef} className="border-white/10 bg-white/5 backdrop-blur-sm">
                <CardHeader>
                    <CardTitle className="text-lg font-bold text-white">Salary Ranges by Role</CardTitle>
                    <CardDescription className="text-neutral-400">Displaying minimum, median, and maximum salaries (in thousands)</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="h-[450px] w-full mt-4">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={salaryData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.1)" />
                                <XAxis
                                    dataKey="name"
                                    tick={{ fill: '#a3a3a3', fontSize: 12 }}
                                    tickLine={false}
                                    axisLine={{ stroke: 'rgba(255,255,255,0.1)' }}
                                />
                                <YAxis
                                    tick={{ fill: '#a3a3a3', fontSize: 12 }}
                                    tickLine={false}
                                    axisLine={{ stroke: 'rgba(255,255,255,0.1)' }}
                                    tickFormatter={(value) => `$${value}k`}
                                />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: '#0a0a0a',
                                        border: '1px solid rgba(255,255,255,0.1)',
                                        borderRadius: '8px',
                                        color: '#fff'
                                    }}
                                    itemStyle={{ color: '#e5e5e5' }}
                                    cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                                />
                                <Legend wrapperStyle={{ paddingTop: '20px' }} />
                                {/* Modern Color Palette */}
                                <Bar dataKey="min" name="Min Salary" fill="#64748b" radius={[4, 4, 0, 0]} />
                                <Bar dataKey="median" name="Median Salary" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                                <Bar dataKey="max" name="Max Salary" fill="#ec4899" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </CardContent>
            </Card>

            {/* Bottom Grid: Trends & Recommended Skills */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                {/* Industry Trends */}
                <Card ref={el => cardsRef.current[3] = el} className="border-white/10 bg-white/5 backdrop-blur-sm h-full">
                    <CardHeader>
                        <CardTitle className="text-lg font-bold text-white flex items-center gap-2">
                            <TrendingUp className="h-5 w-5 text-purple-400" />
                            Key Industry Trends
                        </CardTitle>
                        <CardDescription>Current trends shaping the future of your industry</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ul className="space-y-4">
                            {insights.keyTrends.map((trend, i) => (
                                <li key={i} className="flex items-start gap-3 p-2 rounded-lg hover:bg-white/5 transition-colors">
                                    <div className="mt-1 bg-purple-500/20 p-1.5 rounded-full">
                                        <Zap className="h-3 w-3 text-purple-400" />
                                    </div>
                                    <span className="text-sm text-neutral-300 leading-relaxed">{trend}</span>
                                </li>
                            ))}
                        </ul>
                    </CardContent>
                </Card>

                {/* Recommended Skills */}
                <Card ref={el => cardsRef.current[4] = el} className="border-white/10 bg-white/5 backdrop-blur-sm h-full">
                    <CardHeader>
                        <CardTitle className="text-lg font-bold text-white flex items-center gap-2">
                            <BriefcaseIcon className="h-5 w-5 text-pink-400" />
                            Recommended Skills
                        </CardTitle>
                        <CardDescription>Skills you should focus on to stay competitive</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-wrap gap-3">
                            {insights.recommendationSkills.map((skill, i) => (
                                <div key={i} className="flex items-center gap-2 bg-white/5 border border-white/5 px-3 py-2 rounded-lg text-sm text-neutral-300 hover:border-white/20 transition-colors">
                                    <CheckCircle2 className="h-4 w-4 text-green-400" />
                                    <span>{skill}</span>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

export default DashboardView;