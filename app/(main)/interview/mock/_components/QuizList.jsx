"use client"

import React, { useEffect, useState, useRef } from "react";
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
import gsap from "gsap";

const QuizList = ({ assessments }) => {
    const [selectedQuiz, setSelectedQuiz] = useState(null);
    const router = useRouter();
    const quizItemsRef = useRef([]);
    const headerRef = useRef(null);
    const buttonRef = useRef(null);

    useEffect(() => {
        // Animate header
        if (headerRef.current) {
            gsap.fromTo(
                headerRef.current,
                { opacity: 0, x: -20 },
                { opacity: 1, x: 0, duration: 0.6, ease: "power2.out" }
            );
        }

        // Animate button
        if (buttonRef.current) {
            gsap.fromTo(
                buttonRef.current,
                { opacity: 0, scale: 0.9 },
                { opacity: 1, scale: 1, duration: 0.6, ease: "back.out", delay: 0.2 }
            );
        }

        // Animate quiz items with stagger
        if (quizItemsRef.current.length > 0) {
            gsap.fromTo(
                quizItemsRef.current,
                { opacity: 0, y: 15, x: -10 },
                {
                    opacity: 1,
                    y: 0,
                    x: 0,
                    duration: 0.5,
                    stagger: 0.1,
                    ease: "power2.out",
                    delay: 0.3
                }
            );
        }
    }, [assessments]);

    // Hover animation for quiz items
    const handleQuizHover = (e) => {
        gsap.to(e.currentTarget, {
            x: 8,
            backgroundColor: "rgba(255, 255, 255, 0.08)",
            boxShadow: "0 10px 20px -5px rgba(0, 0, 0, 0.2)",
            duration: 0.3,
            ease: "power2.out"
        });
    };

    const handleQuizHoverOut = (e) => {
        gsap.to(e.currentTarget, {
            x: 0,
            backgroundColor: "rgba(255, 255, 255, 0)",
            boxShadow: "0 0px 0px 0px rgba(0, 0, 0, 0)",
            duration: 0.3,
            ease: "power2.out"
        });
    };

    return (
        <Card>
            <CardHeader
                ref={headerRef}
                className="flex flex-row items-center justify-between"
            >
                <div>
                    <CardTitle className="gradient gradient-title textl-2xl md:text-3xl">Recent Quizzes</CardTitle>
                    <CardDescription>Review your past quiz performance</CardDescription>
                </div>
                <Button
                    ref={buttonRef}
                    onClick={() => router.push("/interview/mock")}
                    className="hover:shadow-lg transition-shadow"
                >
                    Start New Quiz
                </Button>
            </CardHeader>
            <CardContent>
                <div className="space-y-3">
                    {assessments && assessments.map((e, i) => {
                        return (
                            <Card
                                key={i}
                                ref={(el) => {
                                    if (el) quizItemsRef.current[i] = el;
                                }}
                                className="cursor-pointer hover:bg-muted/50 transition-colors"
                                onClick={() => { setSelectedQuiz(e) }}
                                onMouseEnter={handleQuizHover}
                                onMouseLeave={handleQuizHoverOut}
                            >
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

                    <Dialog open={!!selectedQuiz} onOpenChange={() => {
                        // Animate dialog closing
                        gsap.to(".quiz-result-dialog", {
                            opacity: 0,
                            scale: 0.95,
                            duration: 0.2,
                            onComplete: () => setSelectedQuiz(null)
                        });
                    }}>
                        <DialogContent className="quiz-result-dialog max-w-3xl max-h-[85vh] overflow-y-auto">
                            <DialogHeader>
                                <DialogTitle></DialogTitle>
                            </DialogHeader>
                            {selectedQuiz && <QuizResult resultData={selectedQuiz} hideStartNew />}
                        </DialogContent>
                    </Dialog>
                </div>
            </CardContent>
        </Card>
    )
}

export default QuizList;