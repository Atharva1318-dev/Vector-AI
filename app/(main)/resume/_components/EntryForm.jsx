"use client"

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { entrySchema } from "@/app/lib/schema";
import {
    Card,
    CardAction,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { PlusCircle, StarsIcon, Loader2, X } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import useFetch from "@/hooks/use-fetch";
import { improveResumeWithAI } from "@/actions/resume";
import { toast } from "sonner";
import { format, parse } from "date-fns";

const EntryForm = ({ type, entries, onChange }) => {

    const [isAddingNew, setIsAddingNew] = useState(false);

    const { register, handleSubmit: handleValidation, watch, formState: { errors }, setValue, reset } = useForm({
        resolver: zodResolver(entrySchema),
        defaultValues: {
            title: "",
            organization: "",
            startDate: "",
            endDate: "",
            description: "",
            current: false,
        }
    });

    const { loading: improving, fn: improvingWithAI, data: improvedContent, error: improveError } = useFetch(improveResumeWithAI);


    useEffect(() => {
        if (improvedContent && !improving) {
            setValue("description", improvedContent);
            toast.success("Description enhanced successfully with AI");
        }
        if (improveError) {
            toast.error(improveError.error || "Failed to enhance the description");
        }
    }, [improvedContent, improveError, improving, setValue]);

    const formatDisplayDate = (dateString) => {
        if (!dateString) return "";
        const date = parse(dateString, "yyyy-mm", new Date());
        return format(date, "MMM yyyy");
    }

    const handleAdd = handleValidation((data) => {

        const formattedEntry = {
            ...data,
            startDate: formatDisplayDate(data.startDate),
            endDate: data.current ? "" : formatDisplayDate(data.endDate),
        };
        console.log(formattedEntry);
        onChange([...entries, formattedEntry]);
        console.log(entries);


        console.log(entries);
        reset(); //to reset the form
        setIsAddingNew(false);
    });

    const handleImproveDescription = async () => {
        const description = watch("description");
        if (!description) {
            toast.error("Please enter a description first");
            return;
        }
        await improvingWithAI({ current: description, type: type.toLowerCase() }) //type can be either the 'education' part or 'project' or 'experience'
    }

    const handleDelete = (i) => {
        const newEntries = entries.filter((e, idx) => i != idx);
        onChange(newEntries);
    }

    const current = watch("current"); //we are watching the "current" input field because if current checkbox is checked so that means user wont enter enddate, so we will have to disable the end-date field

    return <div className="space-y-4">
        <div className="space-y-4">
            {entries.map((e, idx) => {
                return <Card key={idx}>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-xl font-light">{e.title} @ {e.organization}</CardTitle>
                        <Button variant="outline" size="icon" onClick={() => { handleDelete(idx) }}
                        ><X className="h-2 w-2" /></Button>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-muted-foreground">{e.startDate} - {e.current ? "Present" : `${e.endDate}`}</p>
                        <p className="mt-2 text-sm">{e.description}</p>
                    </CardContent>
                </Card>
            })}
        </div>

        {isAddingNew && (
            <Card>
                <CardHeader>
                    <CardTitle>Add {type}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-2">
                            <Input {...register("title")}
                                placeholder="Title/Position"
                                error={errors.title} />
                            {errors.title && (<p className="text-sm text-red-500">{errors.title.message}</p>)}
                        </div>

                        <div className="space-y-2">
                            <Input {...register("organization")}
                                placeholder="Organization/Company"
                                error={errors.organization} />
                            {errors.organization && (<p className="text-sm text-red-500">{errors.organization.message}</p>)}
                        </div>

                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Input {...register("startDate")}
                                placeholder="start-date"
                                type="month"
                                error={errors.startDate} />
                            {errors.startDate && (<p className="text-sm text-red-500">{errors.startDate.message}</p>)}
                        </div>

                        <div className="space-y-2">
                            <Input {...register("endDate")}
                                type="month"
                                placeholder="end-date"
                                disabled={current}
                                error={errors.endDate} />
                            {errors.endDate && (<p className="text-sm text-red-500">{errors.endDate.message}</p>)}
                        </div>


                        <div className="flex items-center space-x-2">
                            <input
                                type="checkbox"
                                id="current"
                                {...register("current")}
                                onChange={(e) => {
                                    setValue("current", e.target.checked);
                                    if (e.target.checked) {
                                        setValue("endDate", "");
                                    }
                                }} />

                            <label htmlFor="current">Current {type}</label>
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Textarea
                            placeholder={`Description of your ${type.toLowerCase()}`}
                            className="h-28"
                            {...register("description")}
                            error={errors.description}
                        />

                        {errors.description && (
                            <p className="text-sm text-red-500">
                                {errors.description.message}
                            </p>
                        )}
                    </div>

                    {/* {!watch("description") }  means when we have not written any description and still we are trying to click enhance, so when desc is empty disable the button*/}
                    <Button type="button" onClick={handleImproveDescription} disabled={improving || !watch("description")} className="text-sm h-8" variant="outline">
                        {improving ? <><Loader2 className="animate-spin h-4 w-4 mr-2" />Enhancing....</> : <><StarsIcon className="h-4 w-4 mr-1" />Enhance with AI</>}
                    </Button>
                </CardContent>
                <CardFooter className="flex justify-end space-x-2">
                    <Button type="button" variant="outline" onClick={() => { reset(); setIsAddingNew(false); }}>Cancel</Button>
                    <Button type="button" variant="outline" onClick={handleAdd}><PlusCircle className="h-4 w-4 mr-1" />Add Entry</Button>
                </CardFooter>
            </Card>
        )}

        {!isAddingNew && (
            <Button className="w-full" variant="outline" onClick={() => setIsAddingNew(true)}>
                <PlusCircle className="h-4 w-4 mr-2" />
                Add {type}
            </Button>
        )}

    </div>
};

export default EntryForm;