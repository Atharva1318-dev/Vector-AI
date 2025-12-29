//This basically acts as form validator

import { z } from "zod";

export const onboardingSchema = z.object({
    industry: z.string({
        required_error: "Please select an industry",
    }),
    subIndustry: z.string({
        required_error: "Please select a specalization",
    }),
    bio: z.string().max(500).optional(),
    experience: z
        .string()
        .transform((val) => parseInt(val, 10))
        .pipe(
            z
                .number()
                .min(0, "Experience must be atleast 0 years")
                .max(50, "Experience cannot exceed 50 years")
        ),
    skills: z.string().transform((val) =>
        val ? val
            .split(",")
            .map((skill) => skill.trim())
            .filter(Boolean)
            : undefined
    ),
});

export const contactSchema = z.object({
    email: z.string().email("Invalid email address"),
    mobile: z.string().optional(),
    linkedin: z.string().optional(),
    twitter: z.string().optional(),
});

// in refine what we are doing is that
// agar ye experience humara current experience bhi nahi hai aur humne uske liye end-date bhi nahi daali hai, that's not allowed
// either it should be your current work-experience or enter the end date else we throw an error
export const entrySchema = z.object({
    title: z.string().min(1, "Title is required"),
    organization: z.string().min(1, "Organization is required"),
    startDate: z.string().min(1, "Start date is required"),
    endDate: z.string().optional(),
    description: z.string().min(1, "Description is required"),
    current: z.boolean().default(false),
})
    .refine((data) => {
        if (!data.current && !data.endDate) {
            return false; //if neither this is your current,nor the end Date is entered then throw an error
        }
        return true;
    },
        {
            message: "End data is required unless this is your current position",
            path: ["endDate"],
        });

export const resumeFormSchema = z.object({
    contactInfo: contactSchema,
    summary: z.string().min(1, "Professional summary is required"),
    skills: z.string().min(1, "Skills are required"),
    experience: z.array(entrySchema),
    education: z.array(entrySchema),
    projects: z.array(entrySchema),
});

export const coverLetterSchema = z.object({
    companyName: z.string().min(1, "Company Name is required"),
    jobTitle: z.string().min(1, "Job Title is required"),
    jobDescription: z.string().min(1, "Job description is required"),
});