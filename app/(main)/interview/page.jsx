"use client"

import React, { useEffect } from "react";
import Image from "next/image";
import { format } from "date-fns";
import { getAssessments } from "@/actions/interview";
import QuizStats from "./mock/_components/QuizStats";
import QuizList from "./mock/_components/QuizList";
import gsap from "gsap";

export default function InterviewPage() {
    const [assessmentsData, setAssessmentsData] = React.useState(null);
    const [loading, setLoading] = React.useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await getAssessments();
                setAssessmentsData(data);
            } catch (error) {
                console.error("Error fetching assessments:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        if (!loading && assessmentsData) {
            // Animate background gradient
            gsap.fromTo(
                ".bg-gradient",
                { opacity: 0 },
                { opacity: 1, duration: 0.8, ease: "power2.out" }
            );

            // Animate title
            gsap.fromTo(
                ".interview-title",
                { opacity: 0, y: 20 },
                { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" }
            );

            // Animate icon
            gsap.fromTo(
                ".interview-icon",
                { opacity: 0, scale: 0.8, rotationZ: -10 },
                { opacity: 1, scale: 1, rotationZ: 0, duration: 0.8, ease: "back.out", delay: 0.2 }
            );

            // Animate stats and list with stagger
            gsap.fromTo(
                ".interview-content > div",
                { opacity: 0, y: 30 },
                { opacity: 1, y: 0, duration: 0.7, stagger: 0.2, ease: "power2.out", delay: 0.4 }
            );
        }
    }, [loading, assessmentsData]);

    if (loading) {
        return <div className="h-screen flex items-center justify-center">Loading...</div>;
    }

    let questions = 0;
    let correct = 0;
    let latestScore = 0;
    let formattedData = [];

    assessmentsData?.forEach((ass) => {
        questions += ass.questions.length;
        ass.questions.forEach((q) => {
            if (q.isCorrect) {
                correct++;
            }
        });
    });

    assessmentsData?.[0]?.questions.forEach((q) => {
        if (q.isCorrect) {
            latestScore++;
        }
    });

    if (assessmentsData) {
        formattedData = assessmentsData.map((ass) => ({
            date: format(new Date(ass.createdAt), "MMM dd"),
            score: ass.quizScore,
        }));
    }

    return (
        <div className="space-y-6">
            <div className="bg-gradient absolute top-0 left-0 w-full h-75 bg-purple-900/10 blur-[120px] pointer-events-none -z-10" />
            <div className="flex flex-row items-center">
                <h1 className="interview-title mr-4 text-4xl md:text-5xl font-bold tracking-tight text-transparent bg-clip-text bg-linear-to-r from-indigo-400 via-purple-400 to-pink-400">
                    Interview Preparation
                </h1>
                <div className="interview-icon">
                    <Image src="/online-quiz.png" alt="quiz-icon" height={70} width={60} />
                </div>
            </div>
            <div className="interview-content space-y-6">
                <div>
                    <QuizStats formattedData={formattedData} totalQuestions={questions} avgScore={(correct / questions) * 100} latestScore={latestScore} />
                </div>
                <div>
                    <QuizList assessments={assessmentsData} />
                </div>
            </div>
        </div>
    );
}