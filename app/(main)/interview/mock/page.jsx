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
                    Back to Interview Prep
                </Button>
            </Link>

            <div>
                <h1 className="text-5xl font-semibold gradient gradient-title">Mock Interview</h1>
                <p className="text-muted-foreground">
                    Test your knowledge with industry-specific questions
                </p>
            </div>

            <Quiz />
        </div>
    );
}

export default MockInterviewPage;