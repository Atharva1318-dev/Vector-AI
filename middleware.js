import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

const isProtectedRoute = createRouteMatcher([
    // .* means anything that comes after /dashboard is also included

    // createRouteMatcher is a Clerk helper function hai joh check karta hai ki currently jiss route par hum hai voh isme pass kiye gaye protected routes ka joh array hai unmese hai ki nahi.
    // 1. Accepts a list of route patterns You pass an array of paths
    // 2. Returns a function
    // This function checks: “Does the current request URL match any of these patterns ?”
    "/dashboard(.*)",
    "/resume(.*)",
    "/interview(.*)",
    "/ai-cover-letter(.*)",
    "/onboarding(.*)"
])

// auth is a special function provided by Clerk that lets you:
// get the current logged-in user
// check authentication
// redirect unauthenticated users
// get session info

export default clerkMiddleware(async (auth, req) => {
    const { userId } = await auth()

    if (!userId && isProtectedRoute(req)) {
        const { redirectToSignIn } = await auth();
        return redirectToSignIn();
    }

    return NextResponse.next();
});

export const config = {
    matcher: [
        // Skip Next.js internals and all static files, unless found in search params
        '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
        // Always run for API routes
        '/(api|trpc)(.*)',
    ],
};