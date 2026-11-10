import Image from "next/image";

import ImageReveal from "@/components/frontend/motion/imageReveal";
import StaggerReveal, { StaggerItem } from "@/components/frontend/motion/staggerReveal";
import Eyebrow from "@/components/frontend/ui/eyebrow";
import TextLink from "@/components/frontend/ui/textLink";

export default function OurStory() {
    return (
        <section
            id="our-story"
            className="relative scroll-mt-6 overflow-hidden border-y border-champagne/50 bg-midnight"
        >
            <div className="grid min-h-[100vh] grid-cols-1 lg:grid-cols-[48%_52%]">

                {/* LEFT IMAGE — curtain opens towards the copy */}
                <ImageReveal
                    direction="right"
                    className="min-h-[500px] lg:min-h-[750px]"
                >
                    <Image
                        src="/assets/story-main.png"
                        alt="Cherry Blossom Garden dining experience"
                        fill
                        className="object-cover"
                        sizes="(max-width: 1024px) 100vw, 48vw"
                    />

                    {/* Subtle dark overlay */}
                    <div className="absolute inset-0 bg-black/10" />
                </ImageReveal>

                {/* RIGHT CONTENT */}
                <div className="relative flex items-center px-7 py-20 sm:px-12 lg:px-16 xl:px-20 2xl:px-24">
                    <StaggerReveal
                        className="relative z-10 max-w-[590px]"
                        delay={0.25}
                        interval={0.12}
                    >

                        {/* Eyebrow */}
                        <StaggerItem>
                            <Eyebrow className="mb-4">Our Story</Eyebrow>
                        </StaggerItem>

                        {/* Heading */}
                        <StaggerItem>
                            <h2 className="max-w-[570px] font-cormorant text-[42px] font-normal leading-[0.98] tracking-[-0.02em] text-ivory sm:text-5xl lg:text-[52px] xl:text-[58px]">
                                A Garden Rooted in
                                <br className="hidden sm:block" />
                                Elegance and Connection
                            </h2>
                        </StaggerItem>

                        {/* Copy */}
                        <div className="mt-8 max-w-[520px] space-y-5 font-inter text-[14px] leading-[1.8] text-ivory/65">
                            <StaggerItem as="p" intensity="subtle">
                                Cherry Blossom Garden celebrates generous hospitality,
                                beautifully presented food and memorable moments. Every
                                detail is designed to make gatherings feel special.
                            </StaggerItem>

                            <StaggerItem as="p" intensity="subtle">
                                More than a meal, it is a welcoming escape where every corner
                                gives guests something new to discover.
                            </StaggerItem>
                        </div>

                        {/* Link */}
                        <StaggerItem intensity="subtle">
                            <TextLink href="/about" className="mt-9">
                                Discover Our Story
                            </TextLink>
                        </StaggerItem>
                    </StaggerReveal>

                    {/* RIGHT CHERRY BLOSSOM DECORATION */}
                    <div className="pointer-events-none absolute bottom-0 -right-[250px] hidden h-[480px] w-[480px] lg:block xl:-right-[20px] xl:h-[540px] xl:w-[540px]">
                        <div className="cbg-sway absolute inset-0">
                            <Image
                                src="/assets/story-blossom.png"
                                alt=""
                                fill
                                className="object-contain object-bottom-right"
                                sizes="1080px"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile decorative blossom */}
            <div className="pointer-events-none absolute -bottom-12 -right-24 h-[280px] w-[280px] opacity-60 lg:hidden">
                <div className="cbg-sway absolute inset-0">
                    <Image
                        src="/assets/story-blossom.png"
                        alt=""
                        fill
                        className="object-contain object-bottom-right"
                        sizes="280px"
                    />
                </div>
            </div>
        </section>
    );
}
