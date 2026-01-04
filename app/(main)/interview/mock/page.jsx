import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Quiz from "./_components/Quiz";

function MockInterviewPage() {
    return (
        <div className="flex flex-col space-y-2 mx-1">
            <Link href="/interview">
                <Button variant="link" className="gap-2 pl-0">
                    <ArrowLeft className="h-4 w-4" />
                    Back
                </Button>
            </Link>

            <div>
                <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">Mock Interview</h1>
                <p className="text-muted-foreground">
                    Test your knowledge with industry-specific questions
                </p>
            </div>

            <Quiz />
        </div >
    );
}

export default MockInterviewPage;