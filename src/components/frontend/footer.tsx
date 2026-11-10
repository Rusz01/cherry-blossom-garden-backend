
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import {
    SiFacebook,
    SiInstagram,
    SiTiktok,
} from "react-icons/si";

import DrawLine from "@/components/frontend/motion/drawLine";
import Reveal from "@/components/frontend/motion/reveal";
import StaggerReveal, { StaggerItem } from "@/components/frontend/motion/staggerReveal";
import Container from "@/components/frontend/ui/container";
import Eyebrow from "@/components/frontend/ui/eyebrow";
import TextLink from "@/components/frontend/ui/textLink";

const exploreLinks = [
    { label: "Home", href: "/" },
    { label: "Gallery", href: "/gallery" },
    { label: "About Us", href: "/about" },
];

const experienceLinks = [
    { label: "Menu", href: "/menu" },
    { label: "Kids & Family", href: "/kids-play" },
    { label: "Experiences", href: "/experiences" },
    { label: "Reserve a Table", href: "/reservation" },
    { label: "Private Celebrations", href: "/reservation" },
];

const socialLinks = [
    {
        label: "Facebook",
        href: "https://www.facebook.com/YOUR_PAGE",
        icon: SiFacebook,
    },
    {
        label: "Instagram",
        href: "https://www.instagram.com/YOUR_USERNAME",
        icon: SiInstagram,
    },
    {
        label: "TikTok",
        href: "https://www.tiktok.com/@YOUR_USERNAME",
        icon: SiTiktok,
    },
];

export default function Footer() {
    const year = new Date().getFullYear();

    return (
        <footer className="relative overflow-hidden bg-[#0a0b0d] text-ivory">
            {/* Fine gold separator — draws outward from the centre */}
            <Reveal direction="none">
                <DrawLine
                    origin="center"
                    className="h-px w-full bg-gradient-to-r from-transparent via-champagne/35 to-transparent"
                />
            </Reveal>

            <Container className="pt-16 lg:pt-20">
                {/* MAIN FOOTER */}
                {/* Columns enter one after another as the footer arrives. */}
                <StaggerReveal
                    className="grid gap-12 pb-14 sm:grid-cols-2 lg:grid-cols-[1.5fr_0.8fr_0.8fr_1fr] lg:gap-10 lg:pb-20"
                    interval={0.1}
                    amount={0.1}
                >

                    {/* BRAND */}
                    <StaggerItem intensity="subtle" className="max-w-[350px] sm:col-span-2 lg:col-span-1">
                        <Link
                            href="/"
                            aria-label="Cherry Blossom Garden homepage"
                            className="group/logo focus-ring inline-flex"
                        >
                            <Image
                                src="/Cherry-Blossom-Garden-Logo.png"
                                alt="Cherry Blossom Garden"
                                width={190}
                                height={75}
                                className="h-auto w-[165px] object-contain transition-[scale,filter] duration-500 ease-brand group-hover/logo:scale-[1.03] group-hover/logo:brightness-110"
                            />
                        </Link>

                        <p className="mt-6 max-w-[310px] font-inter text-[13px] leading-[1.9] text-ivory/55">
                            A garden of flavours, beautiful spaces and
                            unforgettable moments. Where thoughtful hospitality
                            and meaningful celebrations come together.
                        </p>

                        <p className="mt-6 font-allura text-[30px] leading-none text-blossom">
                            Where beautiful moments bloom.
                        </p>

                        {/* SOCIAL MEDIA */}
                        <div className="mt-9">
                            <div className="mb-5 flex items-center gap-4">
        <span className="font-inter text-[9px] font-medium uppercase tracking-[0.25em] text-ivory/60">
            Follow The Garden
        </span>
                                <DrawLine className="h-px w-10 bg-champagne/35" delay={0.3} />
                            </div>

                            <div className="flex flex-wrap items-center gap-3">
                                {socialLinks.map((social) => {
                                    const Icon = social.icon;

                                    return (
                                        <a
                                            key={social.label}
                                            href={social.href}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            aria-label={`Visit Cherry Blossom Garden on ${social.label}`}
                                            title={social.label}
                                            className="
                        group relative isolate flex h-11 w-11
                        items-center justify-center
                        overflow-hidden
                        border border-champagne/25
                        bg-ivory/[0.025]
                        text-ivory/65
                        transition-[translate,border-color,color,box-shadow] duration-500 ease-brand
                        before:absolute before:inset-0 before:-z-10 before:origin-bottom before:scale-y-0
                        before:bg-blossom/15 before:transition-transform before:duration-500 before:ease-brand
                        hover:-translate-y-1
                        hover:border-blossom/70
                        hover:text-blossom
                        hover:shadow-[0_8px_28px_rgba(212,135,143,0.12)]
                        hover:before:scale-y-100
                        focus-visible:border-blossom/70
                        focus-visible:text-blossom
                        focus-visible:before:scale-y-100
                        active:scale-95
                        focus-ring
                        motion-reduce:transform-none
                    "
                                        >
                                            <Icon
                                                size={18}
                                                aria-hidden="true"
                                                className="
                            relative z-10
                            transition-transform duration-500
                            group-hover:scale-110
                            motion-reduce:transform-none
                        "
                                            />
                                        </a>
                                    );
                                })}
                            </div>
                        </div>
                    </StaggerItem>

                    {/* EXPLORE */}
                    <FooterLinks
                        title="Links"
                        label="Footer navigation"
                        links={exploreLinks}
                    />

                    {/* EXPERIENCES */}
                    <FooterLinks
                        title="Discover"
                        label="Experience links"
                        links={experienceLinks}
                    />

                    {/* GET IN TOUCH */}
                    <StaggerItem intensity="subtle">
                        <Eyebrow as="h3" className="mb-7">Connect With Us</Eyebrow>

                        <h4 className="max-w-[250px] font-cormorant text-[30px] font-normal leading-[1.08] text-ivory">
                            Let&apos;s Make
                            <br />
                            Memories Together.
                        </h4>

                        <p className="mt-4 max-w-[250px] font-inter text-[12px] leading-[1.8] text-ivory/55">
                            Planning a visit or a special occasion? We&apos;d
                            love to hear from you.
                        </p>

                        <TextLink href="/reservation" className="mt-6">
                            Get in Touch
                        </TextLink>
                    </StaggerItem>
                </StaggerReveal>

                {/* BOTTOM DIVIDER — draws outward from the centre */}
                <Reveal direction="none">
                    <DrawLine
                        origin="center"
                        className="h-px w-full bg-gradient-to-r from-champagne/25 via-ivory/10 to-champagne/25"
                    />
                </Reveal>

                {/* COPYRIGHT AND ARTHANOVA CREDIT */}
                {/* Last row on every page: reveal as soon as any of it shows. */}
                <Reveal
                    intensity="subtle"
                    delay={0.2}
                    amount={0.1}
                    className="flex flex-col items-center justify-between gap-6 py-7 text-center md:flex-row md:text-left"
                >

                    <p className="font-inter text-[10px] tracking-[0.05em] text-ivory/60">
                        © {year} Cherry Blossom Garden. All rights reserved.{" "}
                        <Link
                            href="/privacy-policy"
                            className="text-blossom underline underline-offset-4 transition-colors duration-300 hover:text-ivory"
                        >
                            Privacy Policy
                        </Link>
                        .
                    </p>

                    <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 md:justify-end">
                        <span className="font-inter text-[10px] tracking-[0.04em] text-ivory/60">
                            Designed &amp; Developed by
                        </span>

                        <Link
                            href="https://arthanovastudio.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="Visit Arthanova Studio"
                            className="group inline-flex items-center gap-2 transition-opacity duration-300 hover:opacity-70"
                        >
                            <Image
                                src="https://arthanovastudio.com/api/media/file/Secondary%20Logo%20White-No%20BG.png"
                                alt="Arthanova Studio"
                                width={125}
                                height={40}
                                unoptimized
                                className="h-auto w-[110px] object-contain"
                            />

                            <ArrowUpRight
                                size={13}
                                strokeWidth={1.5}
                                className="text-ivory/60 transition-colors group-hover:text-blossom"
                            />
                        </Link>
                    </div>
                </Reveal>
            </Container>
        </footer>
    );
}

function FooterLinks({
                         title,
                         label,
                         links,
                     }: {
    title: string;
    label: string;
    links: { label: string; href: string }[];
}) {
    return (
        <StaggerItem intensity="subtle">
            <Eyebrow as="h3" className="mb-7">{title}</Eyebrow>

            <nav aria-label={label}>
                <ul className="space-y-4">
                    {links.map((link) => (
                        <li key={link.label}>
                            <Link
                                href={link.href}
                                className="group focus-ring inline-flex items-center gap-2 font-inter text-[12px] text-ivory/60 transition-colors duration-300 hover:text-ivory focus-visible:text-ivory"
                            >
                                <span className="cbg-underline pb-0.5">{link.label}</span>
                                <ArrowUpRight
                                    aria-hidden="true"
                                    size={12}
                                    className="opacity-0 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:opacity-100 group-focus-visible:opacity-100"
                                />
                            </Link>
                        </li>
                    ))}
                </ul>
            </nav>
        </StaggerItem>
    );
}
