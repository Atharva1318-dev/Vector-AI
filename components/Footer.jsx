"use client"
import Link from "next/link"
import Image from "next/image"
import { useRef } from "react"
import { useGSAP } from "@gsap/react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { TextHoverEffect } from "./ui/text-hover-effect";
import { Space_Grotesk } from "next/font/google";

const spaceGrotesk = Space_Grotesk({
    subsets: ["latin"],
    weight: ["700"] // Bold weight for the logo
});

gsap.registerPlugin(ScrollTrigger)

export function Footer() {
    const footerRef = useRef(null)
    const columnsRef = useRef([])
    const linksRef = useRef([])

    useGSAP(() => {
        // Animate footer columns from bottom with stagger
        gsap.from(columnsRef.current, {
            opacity: 0,
            y: 40,
            duration: 0.6,
            stagger: 0.1,
            ease: "power3.out",
            scrollTrigger: {
                trigger: footerRef.current,
                start: "top 80%",
                once: true
            }
        })

        // Animate links with hover effect
        linksRef.current.forEach((link) => {
            if (link) {
                link.addEventListener("mouseenter", () => {
                    gsap.to(link, {
                        x: 5,
                        color: "#ffffff",
                        duration: 0.3,
                        ease: "power2.out"
                    })
                })
                link.addEventListener("mouseleave", () => {
                    gsap.to(link, {
                        x: 0,
                        color: "var(--muted-foreground)",
                        duration: 0.3,
                        ease: "power2.out"
                    })
                })
            }
        })
    }, { scope: footerRef })

    return (
        <footer ref={footerRef} className="border-t-[0.75px] border-violet-800 rounded-t-xl bg-background py-12">
            <div className="container mx-auto px-4">
                <div className="grid gap-8 md:grid-cols-4">
                    <div ref={el => columnsRef.current[0] = el} className="space-y-4">
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
                        <p className="text-sm leading-relaxed text-muted-foreground">
                            Your AI-powered career coach for professional growth and success.
                        </p>
                    </div>
                    <div ref={el => columnsRef.current[1] = el}>
                        <h3 className="mb-4 text-sm font-semibold text-foreground">Product</h3>
                        <ul className="space-y-3 text-sm">
                            <li>
                                <Link
                                    href="#features"
                                    ref={el => linksRef.current.push(el)}
                                    className="text-muted-foreground transition-colors hover:text-foreground"
                                >
                                    Features
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="#how-it-works"
                                    ref={el => linksRef.current.push(el)}
                                    className="text-muted-foreground transition-colors hover:text-foreground"
                                >
                                    How It Works
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="#"
                                    ref={el => linksRef.current.push(el)}
                                    className="text-muted-foreground transition-colors hover:text-foreground"
                                >
                                    Pricing
                                </Link>
                            </li>
                        </ul>
                    </div>

                    <div ref={el => columnsRef.current[3] = el}>
                        <h3 className="mb-4 text-sm font-semibold text-foreground">Legal</h3>
                        <ul className="space-y-3 text-sm">
                            <li>
                                <Link
                                    href="#"
                                    ref={el => linksRef.current.push(el)}
                                    className="text-muted-foreground transition-colors hover:text-foreground"
                                >
                                    Privacy
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="#"
                                    ref={el => linksRef.current.push(el)}
                                    className="text-muted-foreground transition-colors hover:text-foreground"
                                >
                                    Terms
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="#"
                                    ref={el => linksRef.current.push(el)}
                                    className="text-muted-foreground transition-colors hover:text-foreground"
                                >
                                    Contact
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>
                <div className="mt-12 border-t border-border pt-8 text-center text-sm text-muted-foreground">
                    <TextHoverEffect text="Atharva Jadhav" />
                </div>
            </div>
        </footer>
    )
}