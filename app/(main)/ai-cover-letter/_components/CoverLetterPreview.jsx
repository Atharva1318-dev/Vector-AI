"use client"

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import MDEditor from '@uiw/react-md-editor';
import { useState } from "react";

const CoverLetterPreview = ({ coverLetter }) => {
    const [previewContent, setPreviewContent] = useState(coverLetter);

    return (
        <div className="space-y-4">
            <div className="space-y-5">
                <div className="space-y-2">
                    <Link href="/ai-cover-letter"><Button variant="link"><ArrowLeft className="h-4 w-4 mr-1" />Back to CoverLetters</Button></Link>
                    <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">Create Cover Letter</h1>
                    <p className="text-sm text-muted-foreground">Generate a tailored cover letter for your job application</p>
                </div>
                <div className="border rounded-lg">
                    <MDEditor
                        value={previewContent}
                        onChange={setPreviewContent}
                        height={600}
                    />
                </div>
            </div>
        </div>
    )
};

export default CoverLetterPreview;