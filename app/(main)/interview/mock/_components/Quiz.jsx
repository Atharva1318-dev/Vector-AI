"use client"

import { Progress } from "@/components/ui/progress"
import React, { useEffect } from "react";
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

const Quiz = ({ }) => {

    const [currentQuestion, setCurrentQuestion] = useState(0); //starting from the 0th index question, basically this state var will contain the index of the question and not the actual question
    const [answers, setAnswers] = useState([]);
    const [showExplaination, setShowExplaination] = useState(false);

    const { loading: generatingQuiz, fn: generateQuizFn, data: quizData, } = useFetch(generateQuiz);

    const { loading: savingQuiz, fn: saveQuizResult, data: quizResultData, setData: setQuizResultData } = useFetch(saveQuizResults);

    useEffect(() => {
        if (quizData) {
            setAnswers(new Array(quizData.length).fill(null));
        }
    }, [quizData]);

    const handleAnswer = (answer) => {
        const newAnswers = [...answers]; // baki questions ke answers as it is rakho, and fir currentQuestion ka answer joh parameter mai answer aya hai voh set kardo
        newAnswers[currentQuestion] = answer;
        setAnswers(newAnswers);
    }

    const handleCurrentQuestion = () => {
        if (currentQuestion < quizData.length - 1) {
            setCurrentQuestion(currentQuestion + 1);
            setShowExplaination(false);
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
        return score;    // we will show the percentage
    }


    const finishQuiz = async () => {
        // First calculating the score
        const score = calculateScore();
        console.log("Score is: ", score);
        try {
            await saveQuizResult(quizData, answers, score);
            toast.success("Quiz completed!");
        } catch (error) {
            toast.error(error.message || "Failed to save quiz results");
        }
        //saveQuizResult();
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
        console.log(quizResultData);
        return (
            <div>
                <QuizResult resultData={quizResultData} onStartNew={startNewQuiz} />
            </div>
        )
    }


    if (!quizData) {
        return (
            <Card className="mx-1">
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
    if (question) {
        console.log(question);
    }

    return (
        <Card className="mx-2">
            <CardHeader>
                <CardTitle>Question {currentQuestion + 1} of {quizData.length}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
                <p className="text-lg font-medium">
                    {question.question} {/* as we know that it is array of objects,each element is an object, so in each object we are accessing the question, that's why question.question */}
                </p>
                <hr />
                <RadioGroup className="space-y-1" onValueChange={handleAnswer} value={answers[currentQuestion]}>
                    {question.options.map((opt, index) => (
                        <div className="flex items-center space-x-2" key={index}>
                            <RadioGroupItem value={opt} id={`option-${index}`} />
                            <Label htmlFor={`option-${index}`}>{opt}</Label>
                        </div>
                    ))}
                </RadioGroup>

                {showExplaination && <div className="mt-1 p-2 bg-muted rounded-lg"><p className="font-medium">Explaination:</p><p className="text-muted-foreground">{question.explanation}</p></div>}
            </CardContent>
            <CardFooter>
                {!showExplaination && <Button variant="outline" onClick={() => setShowExplaination(true)} disabled={!answers[currentQuestion]}>
                    Explaination
                </Button>}
                {savingQuiz && <BarLoader className="mt-4" width={"100%"} color="gray" />}
                <Button variant="outline" onClick={handleCurrentQuestion} disabled={!answers[currentQuestion] || savingQuiz}>
                    {currentQuestion < quizData.length - 1 ? "Next" : "Submit"}
                </Button>
            </CardFooter>
        </Card>
    )
}

export default Quiz;