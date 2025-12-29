import { db } from "../prisma";
import { inngest } from "./client";

import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash",
});

// Now here we will write the function to fetch the industry insights every weekend by calling geminiApi getIndustryInsights function which we created
// Understand CRON as a command to an operating system or server for a job that is to be executed at a specified time.
// In our case we want our job(function to getIndustryInsights) to be executed weekly, so accordingly we will write the cron expression
// { cron: "0 0 * * 0" } 1st 0 is for minutes at 0(means midnight 12) 2nd 0 is for hours(midnight) 3rd place is for day of month so * means any/all days 4th place is for month so * means any/all month 5th place is for the day of the week and 0 means sunday
// so basically this cron means we to perform this job every Sunday at midnight
export const generateIndustryInsights = inngest.createFunction(
    { id: "Generate Industry Insights" },
    // { name: "Generate Industry Insights" },
    { cron: "0 0 * * 0" },

    // Now the callback function
    async ({ step }) => {
        // First step is to fetch all the industries from database
        // Fetch industries is the name which we gave to this step
        const industries = await step.run("Fetch industries", async () => {
            return await db.industryInsights.findMany({
                select: { industry: true },
            });
        });
        // Now for each industry
        for (const { industry } of industries) {
            const prompt = `Analyze the current state of the ${industry} industry and provide insights in ONLY the following JSON format without any additional notes or explanations:
          {
            "salaryRanges": [
              { "role": "string", "min": number, "max": number, "median": number, "location": "string" }
            ],
            "growthRate": number,
            "demandLevel": "HIGH" | "MEDIUM" | "LOW",
            "topSkills": ["skill1", "skill2"],
            "marketOutlook": "POSITIVE" | "NEUTRAL" | "NEGATIVE",
            "keyTrends": ["trend1", "trend2"],
            "recommendationSkills": ["skill1", "skill2"]
          }
          
          IMPORTANT: Return ONLY the JSON. No additional text, notes, or markdown formatting.
          Include at least 5 common roles for salary ranges.
          Growth rate should be a percentage.
          Include at least 5 skills and trends.
        `;
            // Inngest provides direct functions to make AI api calls

            // This calls `generateInsights` with the given arguments, adding AI observability,
            // metrics, datasets, and monitoring to your calls.
            const res = await step.ai.wrap("using-gemini-ai", async (p) => { return await model.generateContent(p); }, prompt);
            const text = res.response.candidates[0].content.parts[0].text || "";
            const cleanedText = text.replace(/```(?:json)?\n?/g, "").trim();
            const insights = JSON.parse(cleanedText);

            // Now next step is to update these insights into the db
            await step.run(`Updating ${industry} the db with new insights`, async () => {
                await db.industryInsights.update({
                    where: { industry },
                    data: {
                        ...insights,
                        nextUpdate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
                    },
                });
            })
        }
    }
);

export const resetRequestsPerDay = inngest.createFunction(
    { id: "Reset Per Day Request Limit" },
    // { name: "Reset Per Day Request Limit" },
    {
        cron: "0 0 * * *"
    },

    // Now the callback function
    async ({ step }) => {
        // Reset requests for each user
        await step.run("Reset requests for all users", async () => {
            await db.user.updateMany({
                data: {
                    requestsToday: 0,
                    lastRequestReset: new Date(),
                },
            });
        });
    }
);