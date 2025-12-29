"use client"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import HeroSection from "@/components/Hero"
import { features } from "@/data/features"
import { howItWorks } from "@/data/howItWorks"
import { faqs } from "@/data/faqs"
import { Card, CardContent } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { BackgroundRippleEffect } from "@/components/ui/background-ripple-effect"

import { GlowingEffect } from "@/components/ui/glowing-effect";


import { ArrowRight } from "lucide-react"
// In next.js we have 2 types of components
// 1. Server components which run on the server and not on the browser Think of them like: Express backend + React UI combined.
// Server Components = React running on the server (no state, no events)
// 2. Client components = These run in the browser (same as traditional React components)., they can use the hooks, handle events change UI dynamically, just like our normal react components





export default function Home() {
  return (
    <div>
      <HeroSection />

      {/* Features */}
      <section className="w-full py-16 md:py-24 lg:py-30">
        <div className="container mx-auto px-4 md:px-6">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-center mb-4 text-balance">
            Powerful Features for Your Career Growth
          </h2>
          <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
            Everything you need to accelerate your professional development
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="border-2 hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 rounded-2xl bg-card/50 backdrop-blur-sm"
              >
                <GlowingEffect
                  blur={0}
                  borderWidth={2.95}
                  spread={80}
                  glow={true}
                  disabled={false}
                  proximity={60}
                  inactiveZone={0.01}
                />
                <CardContent className="pt-6 pb-6 text-center flex flex-col items-center">
                  <div className="flex flex-col items-center justify-center space-y-3">
                    <div className="w-15 h-15 rounded-lg bg-primary/10 flex items-center justify-center">
                      {feature.icon}
                    </div>
                    <h3 className="text-xl font-bold">{feature.title}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">{feature.description}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="w-full py-16 md:py-24 lg:py-30 bg-neutral-950 relative overflow-hidden">
        {/* Background Gradients for ambiance */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-purple-900/10 blur-[100px] rounded-full pointer-events-none" />

        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-balance bg-clip-text text-transparent bg-gradient-to-b from-white to-white/60">
              How It Works
            </h2>
            <p className="text-muted-foreground text-lg">
              Four simple steps to accelerate your career growth
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {howItWorks.map((item, index) => (
              <div
                key={index}
                className="group relative p-6 rounded-3xl border border-white/10 bg-white/5 hover:bg-white/10 transition-all duration-300 hover:-translate-y-1 overflow-hidden"
              >
                {/* Large Background Number */}
                <div className="absolute -right-6 -bottom-8 text-9xl font-bold text-white/[0.03] group-hover:text-white/[0.08] transition-colors duration-300 select-none z-0">
                  {index + 1}
                </div>

                <div className="relative z-10 flex flex-col items-start space-y-4">
                  {/* Icon Container */}
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-600/20 to-blue-600/20 border border-white/10 flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform duration-300">
                    {/* Cloning the icon to force size consistency if needed, or just rendering it */}
                    <div className="text-purple-400">
                      {item.icon}
                    </div>
                  </div>

                  {/* Text Content */}
                  <div>
                    <h3 className="font-bold text-xl text-white mb-2">
                      {item.title}
                    </h3>
                    <p className="text-neutral-400 text-sm leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="w-full py-16 md:py-24 lg:py-30">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-balance">Frequently Asked Questions</h2>
            <p className="text-muted-foreground text-lg">Find answers to common questions about our platform</p>
          </div>

          <div className="max-w-3xl mx-auto">
            <Accordion type="single" collapsible className="w-full space-y-4">
              {faqs.map((faq, index) => (
                <AccordionItem
                  key={index}
                  value={`item-${index}`}
                  className="border-2 rounded-2xl px-6 bg-card/50 backdrop-blur-sm hover:border-primary/30 transition-colors duration-300"
                >
                  <AccordionTrigger className="text-left hover:no-underline py-5 font-semibold">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground pb-5 leading-relaxed">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="w-full py-16 md:py-20 px-4 md:px-6">
        <div className="container mx-auto">
          <div className="relative rounded-3xl overflow-hidden border border-white/20 bg-neutral-950 shadow-2xl">
            <BackgroundRippleEffect interactive={true} />
            {/* 2. Ambient Purple/Pink Glow (Matches the 'AI Career Coach' vibe) */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-[800px] bg-purple-900/20 blur-[100px] rounded-full pointer-events-none" />

            <div className="relative z-10 py-20 px-6 md:px-12 flex flex-col items-center justify-center space-y-6 text-center max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl md:text-5xl text-balance">
                Ready to <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">Accelerate</span> Your Career?
              </h2>

              <p className="mx-auto max-w-[600px] text-neutral-400 text-lg md:text-xl leading-relaxed">
                Join thousands of professionals who are advancing their careers with AI-powered guidance.
              </p>

              <Link href="/dashboard" passHref>
                <Button
                  size="lg"
                  className="h-12 px-8 mt-6 rounded-full font-semibold text-base bg-white text-black hover:bg-gray-200 shadow-[0_0_20px_rgba(255,255,255,0.3)] border-0 animate-bounce"
                >
                  Start Your Journey Today <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
