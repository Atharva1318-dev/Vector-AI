"use server";

import { db } from "@/lib/prisma";
import { auth } from '@clerk/nextjs/server'

import { GoogleGenerativeAI } from "@google/generative-ai";
import { isProUser } from "./subscription";
import { PLAN_LIMITS } from "@/lib/subscriptionLimit";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash-lite",
});

// Generate the quiz and save the results of it

export async function generateQuiz() {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    const user = await db.user.findUnique({
        where: { clerkUserId: userId },
    });

    if (!user) throw new Error("User not found");

    const isPro = await isProUser();

    if ((isPro && user.requestsToday >= PLAN_LIMITS.PRO.requestsPerDay) || (user.requestsToday >= PLAN_LIMITS.FREE.requestsPerDay)) throw new Error("Daily limit reached, please try again later.");

    const prompt = `
    Generate 1 technical interview questions for a ${user.industry
        } professional${user.skills?.length ? ` with expertise in ${user.skills.join(", ")}` : ""
        }.
    
    Each question should be multiple choice with 4 options.
    
    Return the response in this JSON format only, no additional text:
    {
      "questions": [
        {
          "question": "string",
          "options": ["string", "string", "string", "string"],
          "correctAnswer": "string",
          "explanation": "string"
        }
      ]
    }
  `;

    try {

        const result = await model.generateContent(prompt);
        const response = result.response;
        // Now we have got the response now we need to fetch the text from it, we use the function response.text()
        const text = response.text();

        //Now clean the response removing anything additional we just want the json
        const cleanedText = text.replace(/```(?:json)?\n?/g, "").trim();

        const quiz = JSON.parse(cleanedText);

        return quiz.questions;
    } catch (error) {
        console.error("Error generating quiz: ", error);
        throw new Error("Failed to generate quiz questions");
    }
}

export async function saveQuizResults(questions, answers, score) {

    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    const user = await db.user.findUnique({
        where: { clerkUserId: userId },
    });

    if (!user) throw new Error("User not found");

    const questionResults = questions.map((q, index) => ({
        question: q.question,
        answer: q.correctAnswer,
        userAnswer: answers[index],
        isCorrect: q.correctAnswer === answers[index], //true or false
        explaination: q.explaination,
    }));

    const wrongAnswers = questionResults.filter((q) => !q.isCorrect); //as we know filter returns those for which the condition is true, so wherever q.isCorrect is false(wrong ans) we will '!' it and get that question
    let improvementTip = null;
    // now according to this wrong answer we will ask the improvement tip from gemini
    if (wrongAnswers.length > 0) {
        const wrongQuestionsText = wrongAnswers.map((q) => `Question: "${q.question}"\nCorrect Answer: "${q.answer}"\nUser Answer: "${q.userAnswer}"`).join("\n\n");


        const improvementPrompt = `
      The user got the following ${user.industry} technical interview questions wrong:

      ${wrongQuestionsText}

      Based on these mistakes, provide a concise, specific improvement tip.
      Focus on the knowledge gaps revealed by these wrong answers.
      Keep the response under 2 sentences and make it encouraging.
      Don't explicitly mention the mistakes, instead focus on what to learn/practice.
    `;

        try {
            const isPro = await isProUser();
            if ((isPro && user.requestsToday >= PLAN_LIMITS.PRO.requestsPerDay) || (user.requestsToday >= PLAN_LIMITS.FREE.requestsPerDay)) throw new Error("Daily limit reached, please try again later.");

            const result = await model.generateContent(improvementPrompt);
            const response = result.response;
            // Now we have got the response now we need to fetch the text from it, we use the function response.text()
            improvementTip = response.text().trim();

            const newUser = db.user.update({
                where: {
                    clerkUserId: userId
                },
                data: {
                    requestsToday: user.requestsToday + 1,
                }
            });
        } catch (error) {
            console.error("Error generating improvement tip: ", error);
            throw new Error("Failed to generate improvement tip.");
        }
    }

    try {
        const assessment = await db.assessment.create({
            data: {
                quizScore: score,
                questions: questionResults,
                category: "Technical",// category of the quiz
                improvementTip: improvementTip,

                user: {
                    connect: {
                        id: user.id,
                    },
                },
            }
        });

        return assessment;
    } catch (error) {
        console.error("Error saving quiz: ", error);
        throw new Error("Failed to save quiz results");
    }
}

export async function getAssessments() {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    const user = await db.user.findUnique({
        where: { clerkUserId: userId },
    });

    if (!user) throw new Error("User not found");

    try {
        const assessments = db.assessment.findMany({
            where: { userId: user.id, },
            orderBy: {
                createdAt: "asc",
            },
        });

        return assessments;
    } catch (error) {
        console.error("Error in getting assessments", error);
        throw new Error("Failed to get the assessments");
    }
}