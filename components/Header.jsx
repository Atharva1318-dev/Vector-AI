"use client";

import React, { useRef, useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
    LayoutDashboard,
    ChevronDown,
    Sparkles,
    Menu,
    X,
    MessageCircleQuestionMark
} from "lucide-react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { cn } from "@/lib/utils";
import {
    SignInButton,
    SignedIn,
    SignedOut,
    UserButton,
} from "@clerk/nextjs";
import { Button } from "./ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import { Badge } from "@/components/ui/badge";
import useFetch from "@/hooks/use-fetch";

import { Space_Grotesk } from "next/font/google";
// import { checkUser } from "@/lib/checkUser";

const spaceGrotesk = Space_Grotesk({
    subsets: ["latin"],
    weight: ["700"] // Bold weight for the logo
});


const SHADOW =
    "0 0 24px rgba(34,42,53,.06),0 1px 1px rgba(0,0,0,.05),0 0 0 1px rgba(34,42,53,.04),0 0 4px rgba(34,42,53,.08),0 16px 68px rgba(47,48,55,.05),0 1px 0 rgba(255,255,255,.1) inset";

const NAV_LINKS = [
    { href: "/dashboard", label: "Industry insights", imgSrc: "/dashboard.png" },
    { href: "/resume", label: "Build Resume", imgSrc: "/resume.png" },
    { href: "/interview", label: "Interview Prep", imgSrc: "/online-quiz.png" },
    { href: "/ai-cover-letter", label: "Build cover letter", imgSrc: "/cover-letter.png" },
];


const navAnimation = (el, visible, extra = {}) =>
    gsap.to(el, {
        backdropFilter: visible ? "blur(10px)" : "none",
        boxShadow: visible ? SHADOW : "none",
        width: visible ? "48%" : "100%",
        y: visible ? 20 : 0,
        duration: 1.1,
        ease: "power2.out",
        ...extra,
    });






export const Navbar = ({ children, className }) => {
    const [visible, setVisible] = useState(false);


    useEffect(() => {
        const onScroll = () => setVisible(window.scrollY > 100);
        window.addEventListener("scroll", onScroll);
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    return (
        <div className={cn("fixed inset-x-0 top-2 z-40", className)}>
            {React.Children.map(children, (c) =>
                React.isValidElement(c) ? React.cloneElement(c, { visible }) : c
            )}
        </div>
    );
};

export const NavBody = ({ children, visible, className }) => {
    const ref = useRef(null);

    useGSAP(() => navAnimation(ref.current, visible), [visible]);

    return (
        <div
            ref={ref}
            style={{ minWidth: "800px" }}
            className={cn(
                "relative z-50 mx-auto hidden max-w-8xl items-center justify-between rounded-full px-4 py-2 lg:flex backdrop-blur-lg",
                visible && "bg-white/80 dark:bg-neutral-950/80",
                className
            )}
        >
            {children}
        </div>
    );
};

export const MobileNav = ({ children, visible }) => {
    const ref = useRef(null);

    useGSAP(
        () =>
            navAnimation(ref.current, visible, {
                padding: visible ? "0 12px" : "0",
                borderRadius: visible ? "4px" : "2rem",
            }),
        [visible]
    );

    return (
        <div
            ref={ref}
            className={cn(
                "relative z-50 mx-auto flex w-full max-w-[calc(100vw-2rem)] flex-col px-0 py-2 lg:hidden",
                visible && "bg-white/80 dark:bg-neutral-950/80"
            )}
        >
            {children}
        </div>
    );
};


export const NavbarLogo = () => (
    <Link href="/" className="flex items-center gap-2 group cursor-pointer">
        <div className="relative w-11 h-11 z-100">
            <Image
                src="/careerPath.png"
                alt="Vector AI Logo"
                fill
                className="object-contain"
            />
        </div>

        <div className="flex flex-col -space-y-1">
            <span className={`text-2xl font-bold tracking-tight text-white ${spaceGrotesk.className}`}>
                VECTOR
            </span>
            <span className="text-sm font-medium tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
                AI
            </span>
        </div>
    </Link>
);

export const MobileNavToggle = ({ open, onClick }) =>
    open ? <X onClick={onClick} className="cursor-pointer" /> : <Menu onClick={onClick} className="cursor-pointer" />;


const HeaderContent = ({ plan }) => {
    const logoRef = useRef(null);
    const itemsRef = useRef([]);

    useGSAP(() => {
        gsap.from(logoRef.current, { opacity: 0, x: -30, duration: 0.6 });
        gsap.from(itemsRef.current, {
            opacity: 0,
            y: -20,
            stagger: 0.1,
            duration: 0.5,
        });

        itemsRef.current.forEach((el) => {
            el.onmouseenter = () => gsap.to(el, { y: -5, duration: 0.3 });
            el.onmouseleave = () => gsap.to(el, { y: 0, duration: 0.3 });
        });
    });

    return (
        <div className="flex w-full items-center justify-between shadow-2xl md:px-2">
            <div ref={logoRef}>
                <NavbarLogo />
            </div>

            {/* Desktop center */}
            <SignedIn>
                <div className="absolute left-1/2 hidden -translate-x-1/2 lg:flex gap-2 shadow-2xl">
                    <div ref={(el) => (itemsRef.current[0] = el)}>
                        <Link href="/dashboard">
                            <Button variant="ghost" size="sm" className="rounded-full text-md font-light">
                                <LayoutDashboard className="mr-[1px] h-4 w-4" />
                                Industry insights
                            </Button>
                        </Link>
                    </div>

                    <div ref={(el) => (itemsRef.current[1] = el)}>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm" className="rounded-full text-md font-light">
                                    <Sparkles className="mr-[1px] h-4 w-4" />
                                    Features
                                    <ChevronDown className="ml-1 h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="rounded-2xl">
                                {NAV_LINKS.slice(1).map(({ href, label, imgSrc }) => (
                                    <DropdownMenuItem key={href}>
                                        <Link href={href} className="flex items-center gap-2">
                                            {/* <Icon className="h-4 w-4" /> */}
                                            <Image src={imgSrc} height={22} alt={label} width={22}></Image>
                                            {label}
                                        </Link>
                                    </DropdownMenuItem>
                                ))}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>
            </SignedIn>

            {/* Right */}
            <div className="flex items-center gap-2">
                <SignedOut>
                    <SignInButton>
                        <Button variant="ghost" size="sm" className="rounded-full">
                            Sign In
                        </Button>
                    </SignInButton>
                </SignedOut>

                <SignedIn>
                    <div className="flex flex-row items-center justify-evenly">
                        {plan == 'PRO' ?
                            <>
                                <Badge variant="secondary" >{plan}</Badge>
                            </> :
                            <>
                                <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                        <Badge variant="secondary" className="cursor-pointer" >{plan}</Badge>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                        <AlertDialogHeader>
                                            <AlertDialogTitle className="flex flex-row items-center justify-start">
                                                <MessageCircleQuestionMark className="mr-1 h-5 w-5" />
                                                Upgrage to PRO
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
                        <UserButton afterSignOutUrl="/" />
                    </div>
                </SignedIn>
            </div >
        </div >
    );
};

export default function Header({ userData }) {
    const [open, setOpen] = useState(false);


    return (
        <Navbar className="top-2">
            <NavBody>
                <HeaderContent plan={userData?.plan} />
            </NavBody>

            <MobileNav>
                <div className="flex items-center justify-between">
                    <NavbarLogo />
                    <MobileNavToggle open={open} onClick={() => setOpen(!open)} />
                </div>

                {open && (
                    <div className="mt-3 py-5 px-3 flex flex-col gap-4 rounded-xl border-y-2 backdrop-blur-sm">
                        <SignedIn>
                            {NAV_LINKS.map(({ href, label, imgSrc }) => (
                                <Link
                                    key={href}
                                    href={href}
                                    onClick={() => setOpen(false)}
                                    className="flex items-center gap-2"
                                >
                                    {/* <Icon className="h-4 w-4" /> */}
                                    <Image src={imgSrc} height={19} width={19}></Image>
                                    {label}
                                </Link>
                            ))}
                        </SignedIn>

                        <SignedOut>
                            <SignInButton>
                                <Button variant="ghost" onClick={() => setOpen(false)}>
                                    Sign In
                                </Button>
                            </SignInButton>
                        </SignedOut>
                    </div>
                )}
            </MobileNav>
        </Navbar>
    );
}