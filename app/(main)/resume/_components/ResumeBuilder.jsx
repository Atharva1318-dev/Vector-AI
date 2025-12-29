"use client"

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Save, Download, Edit, Monitor, TriangleAlert, Loader2, MessageCircleWarning } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { resumeFormSchema } from "@/app/lib/schema";
import { saveResume, analyzeResumeATS } from "@/actions/resume";
import useFetch from "@/hooks/use-fetch";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import EntryForm from "./EntryForm";
import MDEditor from '@uiw/react-md-editor';
import { toast } from "sonner";
import { useUser } from "@clerk/nextjs";
import jsPDF from 'jspdf';

import html2canvas from 'html2canvas-pro';

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { TextGenerateEffect } from "../../../../components/ui/text-generate-effect";

import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogTrigger,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Label } from "@/components/ui/label";
import { coverLetterSchema } from "@/app/lib/schema";

import ATSResult from "./ATSResult";


gsap.registerPlugin(ScrollTrigger);

const ResumeBuilder = ({ initialContent, plan }) => {
    console.log(plan);
    const { user } = useUser();
    const containerRef = useRef(null);
    const titleRef = useRef(null);
    const sectionsRef = useRef([]);
    const [activeTab, setActiveTab] = useState("edit");
    const [resumeMode, setResumeMode] = useState("preview");
    const [previewContent, setPreviewContent] = useState(initialContent);
    const [downloading, setDownloading] = useState(false);

    const [atsDialogOpen, setAtsDialogOpen] = useState(false);

    const [atsAnalysis, setAtsAnalysis] = useState(null);
    const [showAtsResults, setShowAtsResults] = useState(false);

    const { control: atsControl, register: atsRegister, handleSubmit: handleAtsSubmit, formState: { errors: atsErrors }, reset: resetAts } = useForm({
        resolver: zodResolver(coverLetterSchema),
    });


    const { control, register, handleSubmit, watch, formState: { errors } } = useForm({
        resolver: zodResolver(resumeFormSchema),
        defaultValues: {
            contactInfo: {},
            summary: "",
            skills: "",
            experience: [],
            education: [],
            projects: [],
        }
    });
    const { loading: isSaving, fn: saveResumeFn, data: saveResult, error: saveError, } = useFetch(saveResume);
    const { loading: isAnalyzing, fn: analyzeAtsFn, data: atsResult, error: atsError } = useFetch(analyzeResumeATS);

    useGSAP(() => {
        // Animate title
        gsap.from(titleRef.current, {
            opacity: 0,
            x: -50,
            duration: 0.6,
            ease: "power3.out"
        });

        // Animate form sections with stagger
        gsap.from(sectionsRef.current, {
            opacity: 0,
            y: 40,
            duration: 0.6,
            stagger: 0.1,
            ease: "power3.out",
            scrollTrigger: {
                trigger: containerRef.current,
                start: "top 75%",
                once: true
            }
        });

        // Add hover animations to cards
        sectionsRef.current.forEach((section) => {
            if (section) {
                section.addEventListener("mouseenter", () => {
                    gsap.to(section, {
                        y: -4,
                        duration: 0.3,
                        ease: "power2.out"
                    });
                });
                section.addEventListener("mouseleave", () => {
                    gsap.to(section, {
                        y: 0,
                        duration: 0.3,
                        ease: "power2.out"
                    });
                });
            }
        });
    }, { scope: containerRef });

    const onSubmit = async () => {
        try {
            await saveResumeFn(previewContent);
        } catch (error) {
            console.error("Error saving", error);
        }
    }

    const handleAtsAnalysis = async (data) => {
        try {
            const analysisData = {
                resumeContent: previewContent,
                companyName: data.companyName,
                jobTitle: data.jobTitle,
                jobDescription: data.jobDescription,
            };

            await analyzeAtsFn(analysisData);
        } catch (error) {
            console.error("Error analyzing resume", error);
            toast.error("Failed to analyze resume");
        }
    };

    useEffect(() => {
        if (saveResult && !isSaving) {
            toast.success("Resume saved successfully!");
        }
        if (saveError) {
            toast.error("Error saving the resume");
        }
    }, [saveResult, saveError, isSaving]);

    useEffect(() => {
        if (atsResult && !isAnalyzing) {
            setAtsAnalysis(atsResult);
            setAtsDialogOpen(false);
            setShowAtsResults(true);
            setActiveTab("ats");
            resetAts();
            toast.success("ATS analysis completed!");
        }
        if (atsError) {
            toast.error("Error analyzing the resume");
        }
    }, [atsResult, atsError, isAnalyzing, resetAts]);

    const formValues = watch();

    useEffect(() => {
        if (initialContent) setActiveTab("markdown");
    }, [initialContent]);

    useEffect(() => {
        if (activeTab == "edit") {
            const newContent = convertToMarkdownContent();
            setPreviewContent(newContent ? newContent : initialContent);
        }
    }, [formValues, activeTab]);

    const generatePdf = () => {
        const element = document.getElementById("resume-pdf");
        if (!element) return;

        element.style.background = "#fff";
        element.style.color = "#222";
        element.style.padding = "50px"

        html2canvas(element, {
            backgroundColor: "#fff",
            useCORS: true,
        }).then(async (canvas) => {
            const imgData = canvas.toDataURL("image/png");
            console.log(imgData);
            const pdf = new jsPDF();
            const pdfWidth = 210;
            const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
            pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
            pdf.save(`${user.fullName}_Resume.pdf`);
            setDownloading(false);
        })
    };

    const entriesToMarkdown = (entries, type) => {
        if (!entries?.length) return "";

        return (
            `## ${type}\n\n` +
            entries
                .map((entry) => {
                    const dateRange = entry.current ? `${entry.startDate} - Present` : `${entry.startDate} - ${entry.endDate}`;
                    return `### ${entry.title} @ ${entry.organization}\n${dateRange}\n\n${entry.description}`;
                }).join("\n\n")
        );
    }

    const convertToMarkdownContent = () => {
        const { contactInfo, summary, skills, experience, education, projects } = formValues;

        const parts = [];
        if (contactInfo.email) parts.push(`✉ ${contactInfo.email}`);
        if (contactInfo.mobile) parts.push(`📞 ${contactInfo.mobile}`);
        if (contactInfo.linkedin) parts.push(`💼 [LinkedIn](${contactInfo.linkedin})`);
        if (contactInfo.twitter) parts.push(`𝕏 [Twitter](${contactInfo.twitter})`);

        return [
            parts.length > 0 ? (`## <div align="center"><h2>${user.fullName}</h2></div>\n\n<div align="center">\n\n${parts.join(" | ")}\n\n</div>`) : (""),
            summary && `## Professional Summary\n\n${summary}`,
            skills && `## Skills\n\n${skills}`,
            entriesToMarkdown(experience, "Work Experience"),
            entriesToMarkdown(education, "Education"),
            entriesToMarkdown(projects, "Projects"),
        ]
            .filter(Boolean)
            .join("\n\n");
    };

    return (
        <div ref={containerRef}>
            <div className="flex flex-col md:flex-row justify-between items-center gap-2 mb-8">
                <div className="absolute top-0 left-0 w-full h-[300px] bg-purple-900/10 blur-[120px] pointer-events-none -z-10" />
                <div className="flex flex-row items-center">
                    <h1 ref={titleRef} className="mr-4 text-4xl md:text-5xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">
                        Resume Builder
                    </h1>
                    <Image src="/resume.png" height={70} width={60} alt="resume-icon"></Image>
                </div>
                <div className="space-x-2 flex flex-row items-center">
                    <Button onClick={onSubmit} disabled={isSaving}>
                        {isSaving ? <><Loader2 className="h-4 w-4 animate-spin mr-1" />Saving...</> : <><Save className="h-4 w-4" />
                            Save</>}
                    </Button>
                    <Button variant="destructive" onClick={generatePdf} disabled={downloading}>
                        {downloading ? <><Loader2 className="h-4 w-4 animate-spin mr-1" />Downloading...</> : <><Download className="h-4 w-4" />
                            PDF</>}
                    </Button>

                    {plan == 'PRO' ?
                        <>
                            <Dialog open={atsDialogOpen} onOpenChange={setAtsDialogOpen}>
                                <DialogTrigger asChild>
                                    <Button>
                                        <Image src="/score.png" alt="logo" width={6} height={6} className="h-6 md:h-6 w-auto" />
                                        ATS
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="sm:max-w-[500px]">
                                    <DialogHeader>
                                        <DialogTitle>ATS Resume Analysis</DialogTitle>
                                        <DialogDescription>
                                            Enter job details to analyze how well your resume matches the position
                                        </DialogDescription>
                                    </DialogHeader>
                                    <form onSubmit={handleAtsSubmit(handleAtsAnalysis)} className="space-y-4">
                                        <div className="space-y-2">
                                            <Label className="text-md font-medium">Company Name</Label>
                                            <Input {...atsRegister("companyName")}
                                                placeholder="Enter company name"
                                                error={atsErrors.companyName} />
                                            {atsErrors.companyName && (<p className="text-sm text-red-500">{atsErrors.companyName.message}</p>)}
                                        </div>

                                        <div className="space-y-2">
                                            <Label className="text-md font-medium">Job Title</Label>
                                            <Input {...atsRegister("jobTitle")}
                                                placeholder="Enter Job Title"
                                                error={atsErrors.jobTitle} />
                                            {atsErrors.jobTitle && (<p className="text-sm text-red-500">{atsErrors.jobTitle.message}</p>)}
                                        </div>

                                        <div className="space-y-2">
                                            <Label className="text-md font-medium">Job Description</Label>
                                            <Textarea
                                                placeholder="Paste the job description here"
                                                className="h-32"
                                                {...atsRegister("jobDescription")}
                                                error={atsErrors.jobDescription}
                                            />
                                            {atsErrors.jobDescription && (
                                                <p className="text-sm text-red-500">
                                                    {atsErrors.jobDescription.message}
                                                </p>
                                            )}
                                        </div>

                                        <DialogFooter>
                                            <DialogClose asChild>
                                                <Button type="button" variant="outline">Cancel</Button>
                                            </DialogClose>
                                            <Button type="submit" disabled={isAnalyzing}>
                                                {isAnalyzing ? (
                                                    <>
                                                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                                        Analyzing...
                                                    </>
                                                ) : (
                                                    "Analyze Resume"
                                                )}
                                            </Button>
                                        </DialogFooter>
                                    </form>
                                </DialogContent>
                            </Dialog>
                        </> :
                        <>
                            <AlertDialog>
                                <AlertDialogTrigger asChild>
                                    <Button>
                                        <Image src="/score.png" alt="logo" width={6} height={6} className="h-6 md:h-6 w-auto" />
                                        ATS
                                    </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                        <AlertDialogTitle className="flex flex-row items-center justify-start">
                                            <MessageCircleWarning className="mr-1 h-5 w-5" />
                                            Upgrage to PRO, to access this feature.
                                        </AlertDialogTitle>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                        <Link href="/subscription"><AlertDialogAction>Continue</AlertDialogAction></Link>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                        </>
                    }





                </div>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList>
                    <TabsTrigger value="edit">Edit</TabsTrigger>
                    <TabsTrigger value="markdown">Markdown</TabsTrigger>
                    {showAtsResults && <TabsTrigger value="ats">ATS Analysis</TabsTrigger>}
                </TabsList>
                <TabsContent value="edit">
                    <Card>
                        <CardHeader>
                            <CardTitle></CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form className="space-y-6">
                                <div className="space-y-4">
                                    <h3 className="text-lg font-medium">Contact Information</h3>
                                    <div ref={el => sectionsRef.current[0] = el} className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 border rounded-lg bg-muted/50 transition-colors">
                                        <div className="space-y-2">
                                            <label className="text-md font-medium">Email</label>
                                            <Input {...register("contactInfo.email")}
                                                type="email"
                                                placeholder="your@gmail.com"
                                                error={errors.contactInfo?.email} />
                                            {errors.contactInfo?.email && (<p className="text-sm text-red-500">{errors.contactInfo.email.message}</p>)}
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-md font-medium">Mobile</label>
                                            <Input {...register("contactInfo.mobile")}
                                                type="tel"
                                                placeholder="+91882120923"
                                                error={errors.contactInfo?.mobile} />
                                            {errors.contactInfo?.mobile && (<p className="text-sm text-red-500">{errors.contactInfo.mobile.message}</p>)}
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-md font-medium">LinkedIn</label>
                                            <Input {...register("contactInfo.linkedin")}
                                                type="url"
                                                placeholder="https://linkedin.com/in/your-profile"
                                                error={errors.contactInfo?.linkedin} />
                                            {errors.contactInfo?.linkedin && (<p className="text-sm text-red-500">{errors.contactInfo.linkedin.message}</p>)}
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-md font-medium">Twitter/X Profile</label>
                                            <Input {...register("contactInfo.twitter")}
                                                type="url"
                                                placeholder="https://twitter.com/your-handle"
                                                error={errors.contactInfo?.twitter} />
                                            {errors.contactInfo?.twitter && (<p className="text-sm text-red-500">{errors.contactInfo.twitter.message}</p>)}
                                        </div>
                                    </div>

                                    <hr />

                                    <div ref={el => sectionsRef.current[1] = el} className="space-y-4">
                                        <h3 className="text-lg font-medium">Professional Summary</h3>
                                        <Controller
                                            control={control}
                                            name="summary"
                                            render={({ field }) => (
                                                <Textarea
                                                    {...field}
                                                    className="h-32"
                                                    placeholder="Write a compelling professional summary..."
                                                    error={errors.summary}
                                                />
                                            )}
                                        />

                                        {errors.summary && (
                                            <p className="text-sm text-red-500">{errors.summary.message}</p>
                                        )}
                                    </div>
                                    <hr />
                                    <div ref={el => sectionsRef.current[2] = el} className="space-y-4">
                                        <h3 className="text-lg font-medium">Skills</h3>
                                        <Controller
                                            control={control}
                                            name="skills"
                                            render={({ field }) => (
                                                <Textarea
                                                    {...field}
                                                    className="h-32"
                                                    placeholder="List your skills..."
                                                    error={errors.skills}
                                                />
                                            )}
                                        />

                                        {errors.skills && (
                                            <p className="text-sm text-red-500">{errors.skills.message}</p>
                                        )}
                                    </div>
                                    <hr />
                                    <div ref={el => sectionsRef.current[3] = el} className="space-y-4">
                                        <h3 className="text-lg font-medium">Work Experience</h3>
                                        <Controller
                                            control={control}
                                            name="experience"
                                            render={({ field }) => (
                                                <EntryForm type="Experience"
                                                    entries={field.value}
                                                    onChange={field.onChange} />
                                            )}
                                        />

                                        {errors.experience && (
                                            <p className="text-sm text-red-500">{errors.experience.message}</p>
                                        )}
                                    </div>
                                    <hr />
                                    <div ref={el => sectionsRef.current[4] = el} className="space-y-4">
                                        <h3 className="text-lg font-medium">Education</h3>
                                        <Controller
                                            control={control}
                                            name="education"
                                            render={({ field }) => (
                                                <EntryForm type="Education"
                                                    entries={field.value}
                                                    onChange={field.onChange} />
                                            )}
                                        />

                                        {errors.education && (
                                            <p className="text-sm text-red-500">{errors.education.message}</p>
                                        )}
                                    </div>
                                    <hr />
                                    <div ref={el => sectionsRef.current[5] = el} className="space-y-4">
                                        <h3 className="text-lg font-medium">Projects</h3>
                                        <Controller
                                            control={control}
                                            name="projects"
                                            render={({ field }) => (
                                                <EntryForm type="Project"
                                                    entries={field.value}
                                                    onChange={field.onChange} />
                                            )}
                                        />

                                        {errors.projects && (
                                            <p className="text-sm text-red-500">{errors.projects.message}</p>
                                        )}
                                    </div>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </TabsContent>
                <TabsContent value="markdown">
                    <Button variant="link" type="button" className="mb-2" onClick={() => {
                        resumeMode == "preview" ? setResumeMode("edit") : setResumeMode("preview")
                    }}>
                        {
                            resumeMode == "preview" ? <><Edit className="h-4 w-4" />
                                Edit Resume</> : <><Monitor className="h-4 w-4" />Show Preview</>
                        }
                    </Button>


                    {resumeMode != "preview" && (
                        <Alert className="mb-4">
                            <TriangleAlert className="h-3 w-3 text-yellow-500" />
                            <AlertDescription>
                                <p className="text-yellow-500">You will loose edited markdown if you update the form data.</p>
                            </AlertDescription>
                        </Alert>
                    )}
                    <div className="border rounded-lg">
                        <MDEditor
                            value={previewContent}
                            onChange={setPreviewContent}
                            height={800}
                            preview={resumeMode}
                        />
                    </div>
                    <br /><br />
                    {/* <div className="hidden"> */}
                    <div id="resume-pdf">
                        <MDEditor.Markdown
                            source={previewContent}
                            style={{
                                background: "white",
                                color: "black",
                            }}
                        />
                    </div>
                    {/* </div> */}
                </TabsContent>
                <TabsContent value="ats">
                    {isAnalyzing ? (
                        <div className="flex items-center justify-center p-12">
                            <Loader2 className="h-8 w-8 animate-spin" />
                            <span className="ml-2">Analyzing your resume...</span>
                        </div>
                    ) : (
                        atsAnalysis && <ATSResult analysis={atsAnalysis} />
                    )}
                </TabsContent>
            </Tabs>
        </div >
    )
}

export default ResumeBuilder;