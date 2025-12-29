import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import CoverLetterForm from "../_components/CoverLetterForm";

function CreateCoverLetter() {


    return (
        <div className="space-y-5">
            <div className="space-y-2">
                <Link href="/ai-cover-letter"><Button variant="link"><ArrowLeft className="h-4 w-4 mr-1" />Back to CoverLetters</Button></Link>
                <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-transparent bg-clip-text bg-linear-to-r from-indigo-400 via-purple-400 to-pink-400">Create Cover Letter</h1>
                <p className="text-sm text-muted-foreground">Generate a tailored cover letter for your job application</p>
            </div>
            <CoverLetterForm />
        </div>
    );
}

export default CreateCoverLetter;