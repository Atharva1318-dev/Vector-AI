"use client"

import React, { useRef } from "react";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Eye, Loader2, Trash } from "lucide-react";
import useFetch from "@/hooks/use-fetch";
import { deleteCoverLetter } from "@/actions/coverletter";
import { format } from "date-fns";
import Link from "next/link";
import { toast } from "sonner";
import { refresh } from "next/cache";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

function CoverLetters({ coverLetters }) {

    const cardRef = useRef(null);
    const containerRef = useRef(null);

    const { loading: isDeleting, error, fn: deleteFn, data: deletedLetter } = useFetch(deleteCoverLetter);
    const handleDelete = async (id) => {
        try {
            await deleteFn(id);
            if (deletedLetter && !isDeleting) {
                toast.success("Cover letter deleted successfully");
            }
            if (error) {
                toast.error("Failed to delete cover letter");
            }
        } catch (error) {
            console.error("Error deleting", error);
        }
    }

    useGSAP(() => {
        // Animate form sections with stagger
        gsap.from(cardRef.current, {
            opacity: 0,
            y: 40,
            duration: 0.9,
            stagger: 0.3,
            ease: "power3.out",
            scrollTrigger: {
                trigger: containerRef.current,
                start: "top 75%",
                once: true
            }
        });
    });

    return (
        <div ref={containerRef} className="space-y-4">
            {coverLetters.map((letter, idx) => {
                return (
                    <Card ref={cardRef} key={idx}>
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-purple-900/10 blur-[100px] rounded-full pointer-events-none" />
                        <CardHeader>
                            <CardTitle>{letter.jobTitle} at {letter.companyName}</CardTitle>
                            <CardDescription className="flex flex-row items-center justify-between">
                                <p>Created on {format(letter.createdAt, "MMMM dd, yyyy")}</p>
                                <div className="flex flex-row gap-2">
                                    <Link href={`/ai-cover-letter/${letter.id}`}>
                                        <Button type="button" size="icon" variant="outline"><Eye className="h-1 w-1" /></Button>
                                    </Link>
                                    <Button type="button" onClick={() => { handleDelete(letter.id) }} disabled={isDeleting} size="icon" variant="destructive">
                                        {isDeleting ? <Loader2 className="h-1 w-1 animate-spin" /> : <Trash className="h-1 w-1" />}
                                    </Button>
                                </div>
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="max-h-[95px] overflow-auto">
                            <p className="text-sm text-muted-foreground">{letter.jobDescription}</p>
                        </CardContent>
                    </Card>
                )
            })}
        </div>
    );
}

export default CoverLetters;