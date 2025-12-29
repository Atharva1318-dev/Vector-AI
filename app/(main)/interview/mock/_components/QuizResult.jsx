"use client"

import { Progress } from "@/components/ui/progress"
import React, { useEffect } from "react";
import { Trophy, XCircle, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label"
import { BarLoader } from "react-spinners";

const QuizResult = ({ resultData, onStartNew, hideStartNew = false }) => {
    if (!resultData) return null;
    console.log("In quizResult:", resultData);
    return (
        <div>
            <h1 className="flex items-center gap-2 text-3xl gradient gradient-title">
                <Trophy className="h-5 w-5 text-yellow-400" />
                Quiz Results
            </h1>

            <Card>
                <CardContent className="space-y-2">
                    <div className="text-center space-y-2">
                        <h3>{resultData.quizScore.toFixed(1)}%</h3>
                        <Progress value={resultData.quizScore} className="w-full" />
                    </div>

                    {resultData.improvementTip && <div>
                        <p className="font-medium">Tip: </p>
                        <p className="text-muted-foreground">{resultData.improvementTip}</p>
                    </div>}

                    <div className="space-y-2">
                        <h3>
                            Overview
                        </h3>
                        {resultData.questions.map((q, idx) => {
                            return (
                                <div className="border rounded-lg p-3 space-y-3" key={idx}>
                                    <div className="flex items-start justify-between gap-2">
                                        <p>{q.question}</p>
                                        {q.isCorrect ? (<CheckCircle2 className="h-5 w-5 text-green-400" />) : (<XCircle className="h-5 w-5 text-red-500" />)}
                                    </div>

                                    <div>
                                        <p>Your answer was: {q.userAnswer}</p>
                                        {!q.isCorrect && <p>Correct answer is:{q.correctAnswer}</p>}
                                    </div>

                                    <div className="mt-1 p-1 bg-muted rounded-lg"><p className="font-medium">Explaination:</p><p className="text-muted-foreground">{q.explaination}</p></div>
                                </div>
                            )
                        })}
                    </div>
                </CardContent>

                {!hideStartNew && (
                    <CardFooter>
                        <Button onClick={onStartNew} className="w-full">Start New Quiz</Button>
                    </CardFooter>
                )}
            </Card>
        </div>
    )
}

export default QuizResult;