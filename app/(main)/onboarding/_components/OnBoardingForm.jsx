"use client"
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { onboardingSchema } from "@/app/lib/schema";
import { useRouter } from "next/navigation";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardAction,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { updateUser } from "@/actions/user";
import useFetch from "@/hooks/use-fetch";
import { Loader2 } from "lucide-react";

import { toast } from "sonner";

function OnboardingForm({ industries }) {
    const [selectedIndustry, setSelectedIndustry] = useState(null);
    const router = useRouter();

    const { loading: updateLoading, fn: updateUserFn, data: updateProfileResult, } = useFetch(updateUser);

    const { register, handleSubmit, formState: { errors }, setValue, watch, } = useForm({
        resolver: zodResolver(onboardingSchema),
    });

    const watchIndustry = watch("industry"); // this means watch if the industry dropdown is selected or not when it will be selected only then show the sub industry dropdown

    const onSubmit = (values) => {
        //console.log(values);
        // Now here we have got all the form details which we want to store it in database, so our usual flow is like we will make a post/put request to basically update(CRUD), so we have the make the API call to update user
        // So to do it here we would have to do it in our traditional way using axios/fetch and then to manage loading,error,data states again and again across other components as well, so instead we will make a custom hook itself so that it can be re-used
        try {
            const formattedIndustry = `${values.industry}-${values.subIndustry.toLowerCase().replace(/ /g, "-")}`;
            //so for eg formattedIndustry would look like tech-software-development

            updateUserFn({ ...values, industry: formattedIndustry }); // pass all the values as it is just the industry field updated in our above format
        } catch (error) {
            console.log("Onboarding error:", error);
        }
    };

    useEffect(() => {
        if (updateProfileResult?.success && !updateLoading) {
            toast.success("Profile completed successfully");
            router.push("/dashboard"); // basically to redirect to dashboard page
            router.refresh();
        }
    }, [updateProfileResult, updateLoading]);
    return (
        <div className="flex items-center justify-center bg-background">
            <Card className="w-full max-w-lg mb-8 mx-2">
                <CardHeader>
                    <CardTitle className="text-2xl md:text-4xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">
                        Complete Your Profile
                    </CardTitle>
                    <CardDescription>
                        Select your industry to get personalized career insights and
                        recommendations.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="industry">Industry</Label>
                            <Select
                                onValueChange={(value) => {
                                    setValue("industry", value);
                                    setSelectedIndustry(
                                        industries.find((ind) => ind.id === value)
                                    );
                                    setValue("subIndustry", "");
                                }}
                            >
                                <SelectTrigger id="industry">
                                    <SelectValue placeholder="Select an industry" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectLabel>Industries</SelectLabel>
                                        {industries.map((ind) => (
                                            <SelectItem key={ind.id} value={ind.id}>
                                                {ind.name}
                                            </SelectItem>
                                        ))}
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                            {errors.industry && (
                                <p className="text-sm text-red-500">
                                    {errors.industry.message}
                                </p>
                            )}
                        </div>


                        {watchIndustry && <div className="space-y-2">
                            <Label htmlFor="subIndustry">Specalizations</Label>
                            <Select
                                onValueChange={(value) => {
                                    setValue("subIndustry", value);
                                }}
                            >
                                <SelectTrigger id="subIndustry">
                                    <SelectValue placeholder="Select a sub industry" />
                                </SelectTrigger>
                                <SelectContent>
                                    {selectedIndustry?.subIndustries.map((ind) => {
                                        return (
                                            <SelectItem value={ind} key={ind}>
                                                {ind}
                                            </SelectItem>
                                        );
                                    })}
                                </SelectContent>
                            </Select>
                            {errors.subIndustry && (
                                <p className="text-sm text-red-500">
                                    {errors.industry.message}
                                </p>
                            )}
                        </div>}


                        <div className="space-y-2">
                            <Label htmlFor="experience">Experience Years</Label>
                            <Input id="experience" type="number" min="0" max="50" placeholder="Enter your years of experience" {...register("experience")}></Input>

                            {errors.experience && (
                                <p className="text-sm text-red-500">
                                    {errors.industry.message}
                                </p>
                            )}
                        </div>


                        <div className="space-y-2">
                            <Label htmlFor="skills">Skills</Label>
                            <Input id="skills" placeholder="eg., Java, Python, C" {...register("skills")}></Input>
                            <p className="text-sm text-muted-foreground">
                                Enter comma separated skills
                            </p>

                            {errors.skills && (
                                <p className="text-sm text-red-500">
                                    {errors.industry.message}
                                </p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="bio">Bio</Label>
                            <Textarea id="bio"  {...register("bio")} className="h-22"></Textarea>


                            {errors.bio && (
                                <p className="text-sm text-red-500">
                                    {errors.industry.message}
                                </p>
                            )}
                        </div>

                        <Button type="submit" className="w-full" disabled={updateLoading}> {/*when loading is true disabled = true so the button will be disabled*/}
                            {updateLoading ? <><Loader2 className="mr-3 size-5 animate-spin" /> Completing....</> : "Complete Profile"}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}

export default OnboardingForm;