"use client"

import { Progress } from "@/components/ui/progress"
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { Trophy, Brain } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { LineChart, XAxis, YAxis, CartesianGrid, Tooltip, Line, ResponsiveContainer } from 'recharts';
import { BarLoader } from "react-spinners";
import { format } from "date-fns";
import QuizResult from "./QuizResult";
import { useRouter } from "next/navigation";

import QuizList from "./QuizList";

const QuizStats = ({ formattedData, totalQuestions, avgScore, latestScore }) => {
    const [selectedQuiz, setSelectedQuiz] = useState(null);
    const router = useRouter();


    return (
        <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Average Score */}
                <Card className="border-white/10 bg-white/5 backdrop-blur-sm hover:bg-white/10 transition-colors">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0">
                        <CardTitle className="text-xl">
                            Average Score
                        </CardTitle>
                        <Trophy className="h-5 w-6" />
                    </CardHeader>
                    <CardContent>
                        <h2 className="text-3xl font-bold">{avgScore}%</h2>
                        <p className="text-sm text-muted-foreground">
                            Across all assessments
                        </p>
                    </CardContent>
                </Card>

                {/*Questions Practiced */}
                <Card className="border-white/10 bg-white/5 backdrop-blur-sm hover:bg-white/10 transition-colors">
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle className="text-xl">
                            Questions Solved
                        </CardTitle>
                        <Brain className="h-5 w-5 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <h2 className="text-3xl font-bold">{totalQuestions}</h2>
                        <p className="text-sm text-muted-foreground">
                            Total Questions
                        </p>
                    </CardContent>
                </Card>

                {/* Latest Score */}
                <Card className="border-white/10 bg-white/5 backdrop-blur-sm hover:bg-white/10 transition-colors">
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle className="text-xl">
                            Last Attempted Quiz Score
                        </CardTitle>
                        <Brain className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <h2 className="text-3xl font-bold">{latestScore}%</h2>
                        <p className="text-sm text-muted-foreground">
                            Most recent score
                        </p>
                    </CardContent>
                </Card>
            </div>


            <Card>
                <CardHeader>
                    <CardTitle className="text-lg">
                        Your Performance Trend
                    </CardTitle>
                    <CardDescription>
                        Your Quiz scores over time
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="h-[520px] mx-auto">
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
                                            <div className="bg-background border rounded-lg p-1 shadow-md">
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