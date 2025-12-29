import { getResume } from "@/actions/resume";
import ResumeBuilder from "./_components/ResumeBuilder"
import { checkUser } from "@/lib/checkUser";

const ResumePage = async () => {
    // First we fetch any existing resume
    const resume = await getResume();
    const userData = await checkUser();


    return (
        <div className="container mx-auto py-4">
            <ResumeBuilder initialContent={resume?.content} plan={userData?.plan} />
        </div>


    )
};

export default ResumePage;