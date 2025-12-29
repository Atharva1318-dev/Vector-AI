"use server"
import { db } from "@/lib/prisma";
import { auth } from '@clerk/nextjs/server'
import { revalidatePath } from "next/cache";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { isProUser } from "./subscription";
import { PLAN_LIMITS } from "@/lib/subscriptionLimit";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({
  model: "gemini-2.5-flash",
});

export async function saveResume(content) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
  });

  if (!user) throw new Error("User not found");

  try {
    //upsert means if resume already hai toh toh update karo, if it's not there only then create
    const resume = await db.resume.upsert({
      where: {
        userId: user.id,
      },
      update: {
        content,
      },
      create: {
        userId: user.id,
        content,
      }
    });
    // revalidatePath manually refreshes a page’s cached content, 
    // keeping static pages with dynamic data up-to-date without redeployment.
    revalidatePath("/resume");
    return resume;
  } catch (error) {
    console.error("Error saving resume", error);
    throw new Error("Failed to save the resume");
  }
}


export async function getResume() {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
  });

  if (!user) throw new Error("User not found");

  try {
    const resume = await db.resume.findUnique({
      where: {
        userId: user.id,
      },
    });

    return resume;
  } catch (error) {
    console.error("Error fetching resume", error);
    throw new Error("Failed to fetch the resume");
  }
}

export async function improveResumeWithAI({ currentContent, type }) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
  });

  if (!user) throw new Error("User not found");

  const isPro = await isProUser();

  if ((isPro && user.requestsToday >= PLAN_LIMITS.PRO.requestsPerDay) || (user.requestsToday >= PLAN_LIMITS.FREE.requestsPerDay)) throw new Error("Daily limit reached, please try again later.");

  const prompt = `
    As an expert resume writer, improve the following ${type} description for a ${user.industry} professional.
    Make it more impactful, quantifiable, and aligned with industry standards.
    Current content: "${currentContent}"

    Requirements:
    1. Use action verbs
    2. Include metrics and results where possible
    3. Highlight relevant technical skills
    4. Keep it concise but detailed
    5. Focus on achievements over responsibilities
    6. Use industry-specific keywords
    
    Format the response as a single paragraph without any additional text or explanations.
  `;

  try {
    const result = await model.generateContent(prompt);
    const response = result.response;
    const improvedContent = response.text().trim();

    const newUser = db.user.update({
      where: {
        clerkUserId: userId
      },
      data: {
        requestsToday: user.requestsToday + 1,
      }
    });

    return improvedContent;

  } catch (error) {
    console.error("Error in improving resume content", error);
    throw new Error("Failed to improve the resume content");
  }
}

export async function analyzeResumeATS({ resumeContent, companyName, jobTitle, jobDescription }) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
  });

  if (!user) throw new Error("User not found");

  const res = await isProUser();
  if (!res) throw new Error("Upgrade to Pro, to access this feature.");

  if (user.requestsToday >= PLAN_LIMITS.PRO.requestsPerDay) throw new Error("Daily limit reached, please try again later.");

  const prompt = `
    You are an expert ATS (Applicant Tracking System) analyzer and resume consultant. 
    Analyze the following resume against the job description and provide detailed feedback.

    Company: ${companyName}
    Job Title: ${jobTitle}
    Job Description: ${jobDescription}

    Resume Content:
    ${resumeContent}

    Provide a comprehensive analysis in the following JSON format (respond ONLY with valid JSON, no markdown formatting):
    {
      "overallScore": <number between 0-100>,
      "totalIssues": <number of issues found>,
      "categories": {
        "toneAndStyle": {
          "score": <number between 0-100>,
          "status": "<Good Start|Strong|Needs work>",
          "feedback": "<brief feedback>",
          "tips": ["<tip1>", "<tip2>", "<tip3>"]
        },
        "content": {
          "score": <number between 0-100>,
          "status": "<Good Start|Strong|Needs work>",
          "feedback": "<brief feedback>",
          "tips": ["<tip1>", "<tip2>", "<tip3>"]
        },
        "structure": {
          "score": <number between 0-100>,
          "status": "<Good Start|Strong|Needs work>",
          "feedback": "<brief feedback>",
          "tips": ["<tip1>", "<tip2>", "<tip3>"]
        },
        "skills": {
          "score": <number between 0-100>,
          "status": "<Good Start|Strong|Needs work>",
          "feedback": "<brief feedback>",
          "tips": ["<tip1>", "<tip2>", "<tip3>"]
        }
      },
      "atsCompatibility": {
        "isReadable": <boolean>,
        "hasRelevantKeywords": <boolean>,
        "hasSkillsSection": <boolean>,
        "feedback": "<brief feedback about ATS compatibility>"
      },
      "keywordMatches": {
        "matched": ["<keyword1>", "<keyword2>"],
        "missing": ["<keyword1>", "<keyword2>"]
      },
      "improvements": [
        {
          "category": "<category name>",
          "priority": "<High|Medium|Low>",
          "suggestion": "<specific improvement suggestion>"
        }
      ]
    }

    Scoring Guidelines:
    - Tone & Style: Professional language, action verbs, quantifiable achievements
    - Content: Relevance to job description, clarity, impact statements
    - Structure: Clear sections, proper formatting, logical flow
    - Skills: Relevant technical/soft skills, keyword optimization

    Be specific and actionable in your feedback.
  `;

  try {
    const result = await model.generateContent(prompt);
    const response = result.response;
    const analysisText = response.text().trim();

    // Remove markdown code blocks if present
    const cleanedText = analysisText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();

    const analysis = JSON.parse(cleanedText);
    console.log(analysis);
    const newUser = db.user.update({
      where: {
        clerkUserId: userId
      },
      data: {
        requestsToday: user.requestsToday + 1,
      }
    });
    return analysis;

  } catch (error) {
    console.error("Error in ATS analysis", error);
    throw new Error("Failed to analyze the resume");
  }
}