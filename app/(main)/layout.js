
const MainLayout = ({ children }) => {
    // here first we will check if user is onboarded or not, if not redirect to onboarding page first, unless onboarding is not done it cannot access resume build,cover letter and all etc.
    return (
        <div className="container mx-auto mt-8 mb-14">{children}</div>
    )
}

export default MainLayout;