import { getCoverLetter } from "@/actions/coverletter";
import React from "react";
import CoverLetterPreview from "../_components/CoverLetterPreview";

async function CoverLetter({ params }) {
    const { id } = await params;
    const coverLetter = await getCoverLetter(id);
    return (
        <div>
            <CoverLetterPreview coverLetter={coverLetter?.content} />
        </div>
    );
}

export default CoverLetter;