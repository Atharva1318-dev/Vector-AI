"use client"

import { Progress } from "@/components/ui/progress"
import React, { useEffect, useRef } from "react";
import { Trophy, XCircle, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label"
import { BarLoader } from "react-spinners";
import gsap from "gsap";

const QuizResult = ({ resultData, onStartNew, hideStartNew = false }) => {
    const titleRef = useRef(null);
    const scoreCardRef = useRef(null);
    const questionItemsRef = useRef([]);
    const buttonRef = useRef(null);

    useEffect(() => {
        if (!resultData) return;

        // Animate title
        if (titleRef.current) {
            gsap.fromTo(
                titleRef.current,
                { opacity: 0, y: -20 },
                { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" }
            );
        }

        // Animate score card
        if (scoreCardRef.current) {
            gsap.fromTo(
                scoreCardRef.current,
                { opacity: 0, scale: 0.9 },
                { opacity: 1, scale: 1, duration: 0.6, ease: "back.out", delay: 0.2 }
            );

            // Animate progress bar fill
            gsap.fromTo(
                ".quiz-progress-bar",
                { width: "0%" },
                { width: `${resultData.quizScore}%`, duration: 1.2, ease: "power2.out", delay: 0.5 }
            );
        }

        // Animate question items with stagger
        if (questionItemsRef.current.length > 0) {
            gsap.fromTo(
                questionItemsRef.current,
                { opacity: 0, y: 20, x: -10 },
                {
                    opacity: 1,
                    y: 0,
                    x: 0,
                    duration: 0.5,
                    stagger: 0.12,
                    ease: "power2.out",
                    delay: 0.8
                }
            );
        }

        // Animate button
        if (buttonRef.current && !hideStartNew) {
            gsap.fromTo(
                buttonRef.current,
                { opacity: 0, y: 20 },
                { opacity: 1, y: 0, duration: 0.6, ease: "power2.out", delay: 1.2 }
            );
        }
    }, [resultData, hideStartNew]);

    // Hover animation for question items
    const handleQuestionHover = (e) => {
        gsap.to(e.currentTarget, {
            backgroundColor: "rgba(255, 255, 255, 0.08)",
            boxShadow: "0 10px 20px -5px rgba(0, 0, 0, 0.2)",
            duration: 0.3,
            ease: "power2.out"
        });
    };

    const handleQuestionHoverOut = (e) => {
        gsap.to(e.currentTarget, {
            backgroundColor: "rgba(255, 255, 255, 0)",
            boxShadow: "0 0px 0px 0px rgba(0, 0, 0, 0)",
            duration: 0.3,
            ease: "power2.out"
        });
    };

    if (!resultData) return null;

    return (
        <div className="space-y-6">
            <h1
                ref={titleRef}
                className="flex items-center gap-2 text-3xl gradient gradient-title"
            >
                <Trophy className="h-5 w-5 text-yellow-400" />
                Quiz Results
            </h1>

            <Card ref={scoreCardRef}>
                <CardContent className="space-y-6 pt-6">
                    <div className="text-center space-y-4">
                        <div className="text-5xl font-bold text-transparent bg-clip-text bg-linear-to-r from-indigo-400 via-purple-400 to-pink-400">
                            {resultData.quizScore.toFixed(1)}%
                        </div>
                        <Progress
                            value={resultData.quizScore}
                            className="w-full h-3 quiz-progress-bar"
                        />
                    </div>

                    {resultData.improvementTip && (
                        <div className="p-4 bg-muted/50 rounded-lg border border-muted-foreground/20">
                            <p className="font-medium text-sm">💡 Improvement Tip: </p>
                            <p className="text-muted-foreground text-sm mt-1">{resultData.improvementTip}</p>
                        </div>
                    )}

                    <div className="space-y-3">
                        <h3 className="text-lg font-semibold">Overview</h3>
                        {resultData.questions.map((q, idx) => {
                            return (
                                <div
                                    ref={(el) => {
                                        if (el) questionItemsRef.current[idx] = el;
                                    }}
                                    className="border border-muted-foreground/20 rounded-lg p-4 space-y-3 cursor-default transition-all"
                                    key={idx}
                                    onMouseEnter={handleQuestionHover}
                                    onMouseLeave={handleQuestionHoverOut}
                                >
                                    <div className="flex items-start justify-between gap-2">
                                        <p className="font-medium">{q.question}</p>
                                        {q.isCorrect ? (
                                            <CheckCircle2 className="h-5 w-5 text-green-400 shrink-0 animate-bounce" />
                                        ) : (
                                            <XCircle className="h-5 w-5 text-red-500 shrink-0" />
                                        )}
                                    </div>

                                    <div className="space-y-2 text-sm">
                                        <div className={`p-2 rounded ${q.isCorrect ? 'bg-green-500/10 border border-green-500/30' : 'bg-red-500/10 border border-red-500/30'}`}>
                                            <p className="font-medium">Your answer:</p>
                                            <p>{q.userAnswer}</p>
                                        </div>
                                        {!q.isCorrect && (
                                            <div className="p-2 rounded bg-blue-500/10 border border-blue-500/30">
                                                <p className="font-medium">Correct answer:</p>
                                                <p>{q.answer}</p>
                                            </div>
                                        )}
                                    </div>

                                    <div className="mt-2 p-3 bg-muted/50 rounded-lg border border-muted-foreground/10">
                                        <p className="font-medium text-sm mb-1">Explanation:</p>
                                        <p className="text-muted-foreground text-sm">{q.explanation}</p>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </CardContent>

                {!hideStartNew && (
                    <CardFooter ref={buttonRef}>
                        <Button onClick={onStartNew} className="w-full">Start New Quiz</Button>
                    </CardFooter>
                )}
            </Card>
        </div>
    )
}

export default QuizResult;