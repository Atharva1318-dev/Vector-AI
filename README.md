# VectorAI - AI Career Coach 🚀

![Banner Placeholder](link_to_banner_image_here)

## 🌟 Introduction

Welcome to **VectorAI**! This is my first major project built using the **Next.js** framework. As a 3rd-year Computer Engineering student who previously worked with the MERN stack, I wanted to challenge myself to learn modern full-stack practices, server-side rendering, and AI integration.

VectorAI is a comprehensive career coaching platform designed to help students and professionals navigate their career paths. It leverages the power of **Google's Gemini AI** to provide personalized resume feedback, technical revision quizzes, and cover letter generation.

### 🔗 Live Demo
[**View Live Demo**](INSERT_YOUR_HOSTED_LINK_HERE)

### 📺 Walkthrough Video
[**Watch the Demo Video**](INSERT_YOUR_YOUTUBE_OR_DRIVE_LINK_HERE)

---

## 💡 What I Learned & Key Features

Building this project was a massive learning curve. Here is a breakdown of the features and the technical concepts I explored while implementing them:

### 1. 🤖 AI-Powered Resume Builder
* **The Feature:** Generates ATS-optimized resume content tailored to a specific industry and role. It renders the resume in Markdown and allows PDF downloads.
* **My Learning:** I learned how to prompt engineering with the **Gemini API** to get structured outputs. I also got hands-on experience with **React Hook Form** and **Zod** to manage complex forms and validation, ensuring the user input is clean before sending it to the AI.

### 2. 🧠 AI Mock Interview Quiz
* **The Feature:** Instead of a generic video call, I built a focused **10-question technical quiz** to help users revise concepts. The AI generates multiple-choice questions (MCQs) specific to the user's industry and skills (e.g., React, Node.js). It provides real-time scoring and detailed explanations for every answer.
* **My Learning:** This was a great exercise in "Prompt Engineering." I had to specifically instruct the AI to return data in a strict **JSON format** so my frontend could parse the questions, options, and correct answers without errors. I also learned how to visualize the quiz performance trends using **Recharts**.

### 3. 📝 Intelligent Cover Letter Generator
* **The Feature:** Takes a job description and user profile to generate a highly customized cover letter.
* **My Learning:** I explored how to parse text and context dynamically to create relevant content that matches a job description's tone.

### 4. 📊 Interactive Dashboard & Industry Insights
* **The Feature:** A dashboard showing market outlook, salary ranges, and top skills for the user's industry.
* **My Learning:** This was my introduction to **Inngest**. I learned about **Cron Jobs** and serverless background functions. Instead of manually updating data, I set up Inngest to fetch and update industry insights weekly automatically. It was fascinating to see how background jobs work in a serverless environment!

### 5. 🔐 Authentication & Database
* **The Feature:** Secure login/signup and data storage.
* **My Learning:** Coming from a raw MongoDB background, using **Clerk** for authentication felt like magic—it handled sessions and protected routes seamlessly. I also moved to a relational database using **PostgreSQL (NeonDB)** and **Prisma ORM**. Defining schemas in `schema.prisma` and understanding relations (like `User` to `Resume`) was a great upgrade from NoSQL.

### 6. 💳 Subscription System (Bonus Learning)
* **The Feature:** Integrated a payment gateway for Pro plans.
* **My Learning:** I integrated **Cashfree Payments** and learned how to handle **Webhooks**. Debugging webhook events to update the user's subscription status in the database was a challenging but rewarding experience.

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

I designed the database to be relational. You can find the full schema in `prisma/schema.prisma`. Here are the core models:

* **User**: Stores profile, subscription status, and relations to other models.
* **IndustryInsights**: Stores cached industry data (salary, growth rate) updated via Inngest.
* **Assessment**: Stores mock interview quiz results and scores.
* **Resume**: Stores the markdown content of the user's generated resume.
* **CoverLetter**: Stores generated cover letters.

---

*Made with ❤️ by Atharva.*

```

```
