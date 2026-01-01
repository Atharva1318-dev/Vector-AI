"use client"

import { Progress } from "@/components/ui/progress"
import React, { useEffect, useState, useRef } from "react";
import { toast } from "sonner";
import { Trophy, Brain } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { LineChart, XAxis, YAxis, CartesianGrid, Tooltip, Line, ResponsiveContainer } from 'recharts';
import { BarLoader } from "react-spinners";
import { format } from "date-fns";
import QuizResult from "./QuizResult";
import { useRouter } from "next/navigation";
import gsap from "gsap";

import QuizList from "./QuizList";

const QuizStats = ({ formattedData, totalQuestions, avgScore, latestScore }) => {
    const [selectedQuiz, setSelectedQuiz] = useState(null);
    const router = useRouter();
    const statsCardsRef = useRef([]);
    const chartCardRef = useRef(null);

    useEffect(() => {
        // Animate stat cards with stagger
        if (statsCardsRef.current.length > 0) {
            gsap.fromTo(
                statsCardsRef.current,
                { opacity: 0, y: 20, scale: 0.95 },
                {
                    opacity: 1,
                    y: 0,
                    scale: 1,
                    duration: 0.9,
                    stagger: 0.25,
                    ease: "back.out"
                }
            );
        }

        // Animate chart card
        if (chartCardRef.current) {
            gsap.fromTo(
                chartCardRef.current,
                { opacity: 0, y: 30 },
                {
                    opacity: 1,
                    y: 0,
                    duration: 0.9,
                    ease: "power2.out",
                    delay: 0.5
                }
            );
        }
    }, []);

    // Hover animation for cards
    const handleCardHover = (e) => {
        gsap.to(e.currentTarget, {
            y: -5,
            boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.3)",
            duration: 0.3,
            ease: "power2.out"
        });
    };

    const handleCardHoverOut = (e) => {
        gsap.to(e.currentTarget, {
            y: 0,
            boxShadow: "0 0px 0px 0px rgba(0, 0, 0, 0)",
            duration: 0.3,
            ease: "power2.out"
        });
    };

    return (
        <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Average Score */}
                <Card
                    ref={(el) => {
                        if (el) statsCardsRef.current[0] = el;
                    }}
                    className="border-white/10 bg-white/5 backdrop-blur-sm hover:bg-white/10 transition-colors cursor-pointer"
                    onMouseEnter={handleCardHover}
                    onMouseLeave={handleCardHoverOut}
                >
                    <CardHeader className="flex flex-row items-center justify-between space-y-0">
                        <CardTitle className="text-xl">
                            Average Score
                        </CardTitle>
                        <Trophy className="h-5 w-6" />
                    </CardHeader>
                    <CardContent>
                        <h2 className="text-3xl font-bold stats-number">{avgScore.toFixed(2)}%</h2>
                        <p className="text-sm text-muted-foreground">
                            Across all assessments
                        </p>
                    </CardContent>
                </Card>

                {/*Questions Practiced */}
                <Card
                    ref={(el) => {
                        if (el) statsCardsRef.current[1] = el;
                    }}
                    className="border-white/10 bg-white/5 backdrop-blur-sm hover:bg-white/10 transition-colors cursor-pointer"
                    onMouseEnter={handleCardHover}
                    onMouseLeave={handleCardHoverOut}
                >
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle className="text-xl">
                            Questions Solved
                        </CardTitle>
                        <Brain className="h-5 w-5 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <h2 className="text-3xl font-bold stats-number">{totalQuestions}</h2>
                        <p className="text-sm text-muted-foreground">
                            Total Questions
                        </p>
                    </CardContent>
                </Card>

                {/* Latest Score */}
                <Card
                    ref={(el) => {
                        if (el) statsCardsRef.current[2] = el;
                    }}
                    className="border-white/10 bg-white/5 backdrop-blur-sm hover:bg-white/10 transition-colors cursor-pointer"
                    onMouseEnter={handleCardHover}
                    onMouseLeave={handleCardHoverOut}
                >
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle className="text-xl">
                            Last Attempted Quiz Score
                        </CardTitle>
                        <Brain className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <h2 className="text-3xl font-bold stats-number">{latestScore.toFixed(2)}%</h2>
                        <p className="text-sm text-muted-foreground">
                            Most recent score
                        </p>
                    </CardContent>
                </Card>
            </div>

            <Card ref={chartCardRef}>
                <CardHeader>
                    <CardTitle className="text-lg">
                        Your Performance Trend
                    </CardTitle>
                    <CardDescription>
                        Your Quiz scores over time
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="h-130 mx-auto chart-container">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart
                                data={formattedData}
                            >
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="date" />
                                <YAxis domain={[0, 100]} />
                                <Tooltip content={({ active, payload }) => {
                                    if (active && payload && payload.length > 0) {
                                        return (
                                            <div className="bg-background border rounded-lg p-1 shadow-md animate-in fade-in zoom-in-90">
                                                <p className="font-medium">Score: {payload[0].value}%</p>
                                                <p className="text-xs">{payload[0].payload.date}</p>
                                            </div>
                                        )
                                    }
                                    return null;
                                }} />
                                <Line type="monotone" dataKey="score" stroke="#8884d8" strokeWidth={2} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </CardContent>
            </Card >
        </div >
    )
}

export default QuizStats;