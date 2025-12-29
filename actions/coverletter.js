"use server"
import { db } from "@/lib/prisma";
import { auth } from '@clerk/nextjs/server'
import { GoogleGenerativeAI } from "@google/generative-ai";
import { revalidatePath } from "next/cache";
import { isProUser } from "./subscription";
import { PLAN_LIMITS } from "@/lib/subscriptionLimit";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash-lite",
});

export async function generateCoverLetter(data) {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    const user = await db.user.findUnique({
        where: { clerkUserId: userId },
    });

    if (!user) throw new Error("User not found");

    const isPro = await isProUser();

    if ((isPro && user.requestsToday >= PLAN_LIMITS.PRO.requestsPerDay) || (user.requestsToday >= PLAN_LIMITS.FREE.requestsPerDay)) throw new Error("Daily limit reached, please try again later.");

    try {
        const prompt = `
You are an experienced human career coach and professional cover letter writer.
Write in a natural, authentic, human tone — the letter should NOT sound AI-generated.

Write a tailored cover letter for the role of **${data.jobTitle}** at **${data.companyName}**.

### Candidate Information
- Industry: ${user.industry}
- Years of Experience: ${user.experience}
- Skills: ${user.skills?.join(", ")}
- Professional Background: ${user.bio}

### Job Description
${data.jobDescription}

### Writing Guidelines (Very Important)
- Write in **first person**
- Sound confident, thoughtful, and genuine
- Avoid clichés like “I am excited to apply,” “dynamic professional,” “passionate about,” etc.
- Avoid buzzwords, filler phrases, and corporate jargon
- Vary sentence length and structure (short + long sentences)
- Keep the tone professional but slightly conversational
- Make it feel written by a real person, not a template

### Content Requirements
- Clearly connect the candidate’s experience and skills to the job requirements
- Demonstrate understanding of the role and company expectations
- Include **realistic examples of work or impact**, inferred only from the provided background  
  ⚠️ Do NOT invent companies, numbers, awards, or tools not mentioned
- Keep the total length between **300–400 words**

### Required Structure
1. **Opening Paragraph**
   - Direct and engaging opening (avoid generic openings)
   - Mention the role and company naturally

2. **Body Paragraph(s)**
   - Explain relevant experience and skills
   - Relate past work to the responsibilities in the job description
   - Include 1–2 concrete contributions or outcomes

3. **Closing Paragraph**
   - Reaffirm interest without exaggeration
   - Express readiness for next steps in a polite, natural way

### Formatting
- Use proper business cover letter formatting
- Output in **Markdown**
- Use paragraphs only (no bullet points in the final letter)
- End with a professional sign-off (e.g., *Sincerely*)

Only output the final cover letter. Do not include explanations or notes.
`;
        const result = model.generateContent(prompt);
        const response = (await result).response;
        const content = response.text().trim();

        const coverLetter = await db.coverLetter.create({
            data: {
                userId: user.id,
                content: content,
                jobDescription: data.jobDescription,
                companyName: data.companyName,
                jobTitle: data.jobTitle
            }
        });

        const newUser = await db.user.update({
            where: {
                clerkUserId: userId
            },
            data: {
                requestsToday: user.requestsToday + 1,
            }
        });

        return coverLetter;
    } catch (error) {
        console.error("Error generating cover letter", error);
        throw new Error("Failed to generate the cover letter");
    }
}

export async function getCoverLetter(id) {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    const user = await db.user.findUnique({
        where: { clerkUserId: userId },
    });

    if (!user) throw new Error("User not found");

    try {
        const coverLetter = await db.coverLetter.findUnique({
            where: {
                id: id,
            },
        });

        return coverLetter;
    } catch (error) {
        console.error("Error fetching coverLetter", error);
        throw new Error("Failed to fetch the cover letter");
    }
}

export async function getCoverLetters() {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    const user = await db.user.findUnique({
        where: { clerkUserId: userId },
    });

    if (!user) throw new Error("User not found");

    try {
        const coverLetters = await db.coverLetter.findMany({
            where: {
                userId: user.id,
            },
        });

        return coverLetters;
    } catch (error) {
        console.error("Error fetching cover letters", error);
        throw new Error("Failed to fetch cover letters");
    }
}

export async function deleteCoverLetter(id) {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    const user = await db.user.findUnique({
        where: { clerkUserId: userId },
    });

    if (!user) throw new Error("User not found");

    try {
        const coverLetter = await db.coverLetter.delete({
            where: {
                id: id,
            },
        });
        revalidatePath("/ai-cover-letter");
        return coverLetter;
    } catch (error) {
        console.error("Error deleting cover letter", error);
        throw new Error("Failed to delete cover letter");
    }
}