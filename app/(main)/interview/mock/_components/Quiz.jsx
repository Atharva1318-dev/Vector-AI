"use client"

import { Progress } from "@/components/ui/progress"
import React, { useEffect, useRef } from "react";
import { useState } from "react";
import useFetch from "@/hooks/use-fetch";
import { generateQuiz } from "@/actions/interview";
import { saveQuizResults } from "@/actions/interview";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { BarLoader } from "react-spinners";

import QuizResult from "./QuizResult";
import gsap from "gsap";

const Quiz = ({ }) => {

    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [answers, setAnswers] = useState([]);
    const [showExplaination, setShowExplaination] = useState(false);

    const { loading: generatingQuiz, fn: generateQuizFn, data: quizData, } = useFetch(generateQuiz);
    const { loading: savingQuiz, fn: saveQuizResult, data: quizResultData, setData: setQuizResultData } = useFetch(saveQuizResults);

    const questionCardRef = useRef(null);
    const optionsRef = useRef(null);
    const explanationRef = useRef(null);

    useEffect(() => {
        if (quizData) {
            setAnswers(new Array(quizData.length).fill(null));
        }
    }, [quizData]);

    // Animate question and options when question changes
    useEffect(() => {
        if (questionCardRef.current) {
            gsap.fromTo(
                questionCardRef.current,
                { opacity: 0, y: 20 },
                { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" }
            );
        }

        if (optionsRef.current) {
            gsap.fromTo(
                optionsRef.current,
                { opacity: 0, y: 15 },
                { opacity: 1, y: 0, duration: 0.6, ease: "power2.out", delay: 0.1 }
            );
        }

        setShowExplaination(false);
    }, [currentQuestion]);

    // Animate explanation when shown
    useEffect(() => {
        if (showExplaination && explanationRef.current) {
            gsap.fromTo(
                explanationRef.current,
                { opacity: 0, scale: 0.95, y: 10 },
                { opacity: 1, scale: 1, y: 0, duration: 0.4, ease: "back.out" }
            );
        }
    }, [showExplaination]);

    const handleAnswer = (answer) => {
        const newAnswers = [...answers];
        newAnswers[currentQuestion] = answer;
        setAnswers(newAnswers);
    }

    const handleCurrentQuestion = () => {
        if (currentQuestion < quizData.length - 1) {
            // Animate out before changing question
            gsap.to(questionCardRef.current, {
                opacity: 0,
                y: -20,
                duration: 0.3,
                ease: "power2.in",
                onComplete: () => {
                    setCurrentQuestion(currentQuestion + 1);
                    setShowExplaination(false);
                }
            });
        } else {
            finishQuiz();
        }
    }

    const calculateScore = () => {
        let correct = 0;
        answers.forEach((ans, idx) => {
            if (ans === quizData[idx].correctAnswer) {
                correct++;
            }
        });
        const score = (correct / quizData.length) * 100;
        return score;
    }

    const finishQuiz = async () => {
        const score = calculateScore();
        console.log("Score is: ", score);
        try {
            await saveQuizResult(quizData, answers, score);
            toast.success("Quiz completed!");
        } catch (error) {
            toast.error(error.message || "Failed to save quiz results");
        }
    }

    if (generatingQuiz) {
        return <BarLoader className="mt-4" width={"100%"} color="gray" />;
    }

    const startNewQuiz = () => {
        setCurrentQuestion(0);
        setAnswers([]);
        setShowExplaination(false);
        setQuizResultData(null);
        generateQuizFn();
    }

    if (quizResultData) {
        return (
            <div>
                <QuizResult resultData={quizResultData} onStartNew={startNewQuiz} />
            </div>
        )
    }

    if (!quizData) {
        return (
            <Card className="mx-1 quiz-start-card">
                <CardHeader>
                    <CardTitle>Ready to start your Quiz?</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground">
                        This quiz contains 10 questions specific to your industry and
                        skills. Take your time and choose the best answer for each question.
                    </p>
                </CardContent>
                <CardFooter>
                    <Button onClick={generateQuizFn} className="w-full">
                        Start Quiz
                    </Button>
                </CardFooter>
            </Card>
        );
    }

    const question = quizData[currentQuestion];

    return (
        <Card className="mx-2 quiz-card" ref={questionCardRef}>
            <CardHeader>
                <CardTitle>
                    <div className="flex items-center justify-between">
                        <span>Question {currentQuestion + 1} of {quizData.length}</span>
                    </div>
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
                <p className="text-lg font-medium">
                    {question.question}
                </p>
                <hr />
                <div ref={optionsRef}>
                    <RadioGroup className="space-y-1" onValueChange={handleAnswer} value={answers[currentQuestion] || ""}>
                        {question.options.map((opt, index) => (
                            <div
                                className="flex items-center space-x-2 p-2 rounded hover:bg-muted/50 transition-colors cursor-pointer"
                                key={index}
                            >
                                <RadioGroupItem value={opt} id={`option-${index}`} />
                                <Label htmlFor={`option-${index}`} className="cursor-pointer">{opt}</Label>
                            </div>
                        ))}
                    </RadioGroup>
                </div>

                {showExplaination && (
                    <div
                        ref={explanationRef}
                        className="mt-1 p-2 bg-muted rounded-lg border border-muted-foreground/20"
                    >
                        <p className="font-medium mb-1">Explanation:</p>
                        <p className="text-muted-foreground">{question.explanation}</p>
                    </div>
                )}
            </CardContent>
            <CardFooter className="flex gap-2">
                {!showExplaination && (
                    <Button
                        variant="outline"
                        onClick={() => setShowExplaination(true)}
                        disabled={!answers[currentQuestion]}
                    >
                        Explanation
                    </Button>
                )}
                {savingQuiz && <BarLoader className="mt-4" width={"100%"} color="gray" />}
                <Button
                    variant="outline"
                    onClick={handleCurrentQuestion}
                    disabled={!answers[currentQuestion] || savingQuiz}
                >
                    {currentQuestion < quizData.length - 1 ? "Next" : "Submit"}
                </Button>
            </CardFooter>
        </Card>
    )
}

export default Quiz;