import React from "react";
import Image from "next/image";
import { format } from "date-fns";
import { getAssessments } from "@/actions/interview";
import QuizStats from "./mock/_components/QuizStats";
import QuizList from "./mock/_components/QuizList";

async function InterviewPage() {
    const assessmentsData = await getAssessments();
    console.log(assessmentsData);
    let questions = 0;
    let correct = 0;
    let latestScore = 0;
    let formattedData = [];

    assessmentsData?.forEach((ass, idx) => {
        questions += ass.questions.length;
        ass.questions.forEach((q) => {
            if (q.isCorrect) {
                correct++;
            }
        })
    });

    assessmentsData[0]?.questions.forEach((q) => {
        if (q.isCorrect) {
            latestScore++;
        }
    });


    if (assessmentsData) {
        formattedData = assessmentsData.map((ass) => (
            {
                date: format(new Date(ass.createdAt), "MMM dd"),
                score: ass.quizScore,
            }
        ))
    }

    return (
        <div className="space-y-6">
            <div className="absolute top-0 left-0 w-full h-[300px] bg-purple-900/10 blur-[120px] pointer-events-none -z-10" />
            <div className="flex flex-row items-center">
                <h1 className="mr-4 text-4xl md:text-5xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">
                    Interview Preparation
                </h1>
                <Image src="/online-quiz.png" alt="quiz-icon" height={70} width={60}></Image>
            </div>
            <div className="space-y-6">
                <QuizStats formattedData={formattedData} totalQuestions={questions} avgScore={(correct / questions) * 100} latestScore={latestScore} />
                <QuizList assessments={assessmentsData} />
            </div>
        </div >
    );
}

export default InterviewPage;