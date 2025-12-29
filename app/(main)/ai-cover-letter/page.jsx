import React from "react";
import { getCoverLetters } from "@/actions/coverletter";
import CoverLetters from "./_components/CoverLetters";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

async function AiCoverLetterPage() {

    const coverLetters = await getCoverLetters();
    console.log(coverLetters);


    return (
        <div>
            <div className="space-y-5">
                <div className="absolute top-0 left-0 w-full h-[300px] bg-purple-900/10 blur-[120px] pointer-events-none -z-10" />
                <div className="flex flex-row items-center justify-between">
                    <div className="flex flex-row items-center">
                        <h1 className="mr-4 text-4xl md:text-5xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">
                            My Cover Letters
                        </h1>
                        <Image src="/cover-letter.png" alt="cover-letter" height={30} width={50}></Image>
                    </div>
                    <Link href="/ai-cover-letter/new">
                        <Button>
                            <Plus className="h-4 w-4" />
                            Create New
                        </Button>
                    </Link>
                </div>
                <CoverLetters coverLetters={coverLetters} />
            </div>
        </div >
    );
}

export default AiCoverLetterPage;