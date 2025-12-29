"use client"

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { format } from "date-fns";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { useRouter } from "next/navigation";
import QuizResult from "./QuizResult";

const QuizList = ({ assessments }) => {
    const [selectedQuiz, setSelectedQuiz] = useState(null);
    const router = useRouter();
    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle className="gradient gradient-title textl-2xl md:text-3xl">Recent Quizzes</CardTitle>
                    <CardDescription>Review your past quiz performance</CardDescription>
                </div>
                <Button onClick={() => router.push("/interview/mock")}>Start New Quiz</Button>
            </CardHeader>
            <CardContent>
                <div className="space-y-3">
                    {assessments.map((e, i) => {
                        return (
                            <Card key={i} className="cursor-pointer hover:bg-muted/50 transition-colors" onClick={() => { setSelectedQuiz(e) }}>
                                <CardHeader>
                                    <CardTitle>Quiz {i + 1}</CardTitle>
                                    <CardDescription className="flex items-center justify-between w-full">
                                        <div>Score: {e.quizScore.toFixed(2)}%</div>
                                        <div>{format(new Date(e.createdAt), "dd MMMM yyyy, HH:mm")}</div>
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-sm text-muted-foreground">{e.improvementTip ? "Improvement Tip: " + e.improvementTip : "Good job! you scored full."}</p>
                                </CardContent>
                            </Card>
                        )
                    })}


                    <Dialog open={!!selectedQuiz} onOpenChange={() => setSelectedQuiz(null)}>
                        <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto">
                            <DialogHeader>
                                <DialogTitle></DialogTitle>
                            </DialogHeader>
                            <QuizResult resultData={selectedQuiz} hideStartNew />
                        </DialogContent>
                    </Dialog>
                </div>
            </CardContent>
        </Card>
    )
}

export default QuizList;