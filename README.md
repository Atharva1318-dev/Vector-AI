# VectorAI - AI Career Coach 🚀

## 🌟 Introduction

Welcome to **VectorAI**! This is my first major project built using the **Next.js** framework. I had previously worked with the MERN stack, I wanted to explore modern full-stack practices, server-side rendering, and AI integration.

VectorAI is a comprehensive career coaching platform designed to help students and professionals navigate their career paths. It leverages the power of **Google's Gemini AI** to provide personalized resume feedback, technical revision quizzes, and cover letter generation.

### 🔗 Live Demo
[**View Live Demo**](https://vector-ai-pi.vercel.app/)

### 📺 Walkthrough Video
[**Watch the Demo Video**](INSERT_YOUR_YOUTUBE_OR_DRIVE_LINK_HERE)

---

## 💡 What I Learned & Key Features

Building this project was a massive learning curve, and I tried to pack in as many new technologies as I could to see how they work together. Here is a breakdown of what I built and what I figured out along the way:

### 1. 🤖 AI-Powered Resume Builder
I wanted to build a tool that actually helps you write better resumes, not just format them. This feature generates ATS-optimized content tailored to a specific industry and role, renders it in Markdown, and lets you download it as a PDF. On the frontend, I used **React Hook Form** and **Zod** to handle the complex form validation it ensures the data sent to the AI is always clean.

### 2. 🧠 AI Mock Interview Quiz
Instead of a generic video call, I built a focused **10-question technical quiz** to help users revise their concepts. The AI generates multiple-choice questions (MCQs) specific to the user's tech stack (like React or Node.js) and gives real-time scoring. I learned how to use **Recharts** to visualize performance trends over time, which looks really professional on the dashboard.

### 3. 📝 Intelligent Cover Letter Generator
Writing cover letters is tedious, so I automated it. This tool takes a job description and your profile to generate a highly customized cover letter. I learned a lot about how to parse text and context dynamically to create content that matches the tone of a specific job description, making the AI feel much more "human."

### 4. 📊 Interactive Dashboard & Industry Insights
The dashboard shows real-time market outlooks, salary ranges, and top skills for different industries. This was my introduction to **Inngest** and background jobs. Instead of manually updating data, I set up Inngest to run **Cron Jobs** that fetch and update industry insights every week automatically. It was fascinating to see how serverless background functions work—it feels like having a separate robot doing chores for your app!

### 5. 🔐 Authentication & Database
Coming from a raw MongoDB background, using **Clerk** for authentication felt like magic—it handled sessions and protected routes seamlessly without me writing a ton of boilerplate. For the database, I switched to a relational model using **PostgreSQL (via NeonDB)** and **Prisma ORM**. Defining schemas in `schema.prisma` and understanding relations (like connecting a `User` to their `Resume`) gave me a much better grasp of how structured data should be handled compared to NoSQL.

### 6. 💳 Subscription System
I wanted to try implementing a real-world payment flow, so I integrated **Cashfree Payments** for the Pro plan. The biggest learning here was handling **Webhooks**. I had to figure out how to listen for payment events securely and update the user's subscription status in the database automatically. Debugging those webhooks was challenging, but seeing it work for the first time was super satisfying.

---

## 🛠️ Tech Stack

* **Framework:** Next.js 14 (App Router)
* **Language:** JavaScript / JSX
* **Styling:** Tailwind CSS, Shadcn UI (for accessible components), Lucide React (icons)
* **Database:** PostgreSQL (via NeonDB)
* **ORM:** Prisma
* **Authentication:** Clerk
* **AI Engine:** Google Gemini API
* **Background Jobs:** Inngest
* **Forms:** React Hook Form + Zod
* **Payments:** Cashfree

---

## ⚙️ Getting Started

If you want to run this project locally to explore the code, follow these steps:

### 1. Clone the Repository
```bash
git clone [https://github.com/YOUR_USERNAME/vector-ai.git](https://github.com/YOUR_USERNAME/vector-ai.git)
cd vector-ai

```

### 2. Install Dependencies

```bash
npm install

```

### 3. Set Up Environment Variables

Create a `.env` file in the root directory and add the following keys:

```env
# Database (NeonDB)
DATABASE_URL="your_postgresql_connection_string"

# Authentication (Clerk)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="your_clerk_publishable_key"
CLERK_SECRET_KEY="your_clerk_secret_key"
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up

# AI (Google Gemini)
GEMINI_API_KEY="your_gemini_api_key"

# Background Jobs (Inngest)
INNGEST_EVENT_KEY="your_inngest_event_key"
INNGEST_SIGNING_KEY="your_inngest_signing_key"

# Payments (Cashfree - Optional if just testing UI)
CASHFREE_APP_ID="your_app_id"
CASHFREE_SECRET_KEY="your_secret_key"

# App Base URL
NEXT_PUBLIC_APP_URL="http://localhost:3000"

```

### 4. Setup Database

Push the Prisma schema to your database:

```bash
npx prisma db push

```

### 5. Run the Application

```bash
npm run dev

```

Open [http://localhost:3000](https://www.google.com/search?q=http://localhost:3000) with your browser to see the result.

---

## 🗂️ Database Schema

I designed the database to be relational (SQL). You can find the full schema in `prisma/schema.prisma`. Here are the core models:

* **User**: Stores profile, subscription status, and relations to other models.
* **IndustryInsights**: Stores cached industry data (salary, growth rate) updated via Inngest.
* **Assessment**: Stores mock interview quiz results and scores.
* **Resume**: Stores the markdown content of the user's generated resume.
* **CoverLetter**: Stores generated cover letters.

---

*Made with ❤️ and a lot of coffee by Atharva.*
