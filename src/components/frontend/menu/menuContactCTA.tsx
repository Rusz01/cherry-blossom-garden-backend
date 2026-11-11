import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import ImageReveal from "@/components/frontend/motion/imageReveal";
import Reveal from "@/components/frontend/motion/reveal";
import Container from "@/components/frontend/ui/container";

/** "Something Special?" banner linking to the contact form. */
export default function MenuContactCTA() {
    return (
        <section aria-labelledby="menu-cta-heading" className="pb-20 lg:pb-28">
            <Container>
                <div className="relative isolate overflow-hidden rounded-2xl border border-champagne/25">
                    <ImageReveal fill mask={false} className="-z-20">
                        <Image
                            src="/assets/private-celebration.png"
                            alt=""
                            fill
                            sizes="(max-width: 1500px) 100vw, 1500px"
                            className="object-cover object-[60%_55%]"
                        />
                    </ImageReveal>
                    <div aria-hidden="true" className="absolute inset-0 -z-10 bg-gradient-to-r from-midnight/95 via-midnight/80 to-midnight/35" />

                    {/* Blossom spray on the left edge */}
                    <div aria-hidden="true" className="pointer-events-none absolute -bottom-14 -left-24 -z-10 h-52 w-52 rotate-[20deg] opacity-70">
                        <div className="cbg-sway absolute inset-0">
                            <Image src="/assets/story-blossom.png" alt="" fill sizes="256px" className="object-contain" />
                        </div>
                    </div>

                    <Reveal className="flex flex-col gap-8 px-7 py-10 sm:px-12 md:flex-row md:items-center md:justify-between lg:px-[11%] lg:py-12">
                        <div className="max-w-[540px]">
                            <h2 id="menu-cta-heading" className="font-cormorant text-[40px] font-normal leading-none text-ivory sm:text-[46px]">
                                Something Special?
                            </h2>
                            <p className="mt-4 font-inter text-[14px] leading-relaxed text-ivory/80">
                                Let us know about dietary requirements or special requests.
                                Our team is happy to help.
                            </p>
                        </div>

                        <Link
                            href="/reservation#contact"
                            className="group focus-ring inline-flex h-[52px] w-fit shrink-0 items-center gap-3 rounded-full bg-champagne px-8 font-inter text-[12px] font-semibold uppercase tracking-[0.14em] text-midnight transition-[background-color,scale] duration-300 hover:bg-ivory active:scale-[0.98]"
                        >
                            Contact us
                            <ArrowRight aria-hidden="true" size={16} className="transition-transform duration-300 group-hover:translate-x-1" />
                        </Link>
                    </Reveal>
                </div>
            </Container>
        </section>
    );
}
