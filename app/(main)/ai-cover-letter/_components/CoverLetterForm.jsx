"use client"

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, StarsIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { coverLetterSchema } from "@/app/lib/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import useFetch from "@/hooks/use-fetch";
import { generateCoverLetter } from "@/actions/coverletter";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const CoverLetterForm = ({ }) => {
    const router = useRouter();

    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: zodResolver(coverLetterSchema),
    });

    const { loading: isGenerating, data: coverLetterData, fn: generateLetterFn, error } = useFetch(generateCoverLetter);

    useEffect(() => {
        if (coverLetterData) {
            toast.success("Cover letter generated successfully");
            router.push(`/ai-cover-letter/${coverLetterData.id}`);
        }
        if (error) {
            toast.error("Error generating cover letter");
            console.log(error);
        }
    }, [coverLetterData]);

    const onSubmit = handleSubmit((data) => {
        generateLetterFn(data);
    });


    return (
        <div className="space-y-4">
            <Card>
                <CardHeader>
                    <CardTitle className="text-xl font-semibold">Job Details</CardTitle>
                    <CardDescription>Provide information about the position you are applying for.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-3">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div className="space-y-2">
                                <Label className="text-md font-medium">Company Name</Label>
                                <Input {...register("companyName")}
                                    placeholder="Enter company name"
                                    error={errors.companyName} />
                                {errors.companyName && (<p className="text-sm text-red-500">{errors.companyName.message}</p>)}
                            </div>

                            <div className="space-y-2">
                                <Label className="text-md font-medium">Job Title</Label>
                                <Input {...register("jobTitle")}
                                    placeholder="Enter Job Title"
                                    error={errors.jobTitle} />
                                {errors.jobTitle && (<p className="text-sm text-red-500">{errors.jobTitle.message}</p>)}
                            </div>
                        </div>

                        <div className="space-y-3">
                            <Label className="text-md font-medium">Job Description</Label>
                            <Textarea
                                placeholder="Paste the job description here"
                                className="h-28"
                                {...register("jobDescription")}
                                error={errors.jobDescription}
                            />

                            {errors.jobDescription && (
                                <p className="text-sm text-red-500">
                                    {errors.jobDescription.message}
                                </p>
                            )}
                        </div>
                    </div>
                </CardContent>
                <CardFooter>
                    <Button className="mx-auto" onClick={onSubmit} disabled={isGenerating}>
                        {isGenerating ? <><Loader2 className="h-4 w-4 mr-1 animate-spin" />Generating...</> : <>                    <StarsIcon size="small" className="h-4 w-4 mr-1" />
                            Generate Cover Letter</>}
                    </Button>
                </CardFooter>
            </Card>
        </div>
    )
};

export default CoverLetterForm;