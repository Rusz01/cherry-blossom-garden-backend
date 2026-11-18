"use client";

import { useMemo } from 'react';
import { useLivePreview } from '@payloadcms/live-preview-react';
import { RichText } from '@payloadcms/richtext-lexical/react';
import { normalizePrivacyPolicy, type PrivacyPolicyContent } from '@/lib/privacy-policy/defaults';

import Link from "next/link";
import {
    ArrowUpRight,
    ArrowUp,
    ChevronDown,
    ShieldCheck,
    LockKeyhole,
    Mail,
} from "lucide-react";

import Navbar from "@/components/frontend/navbar";
import DrawLine from "@/components/frontend/motion/drawLine";
import Reveal from "@/components/frontend/motion/reveal";
import RiseText from "@/components/frontend/motion/riseText";
import StaggerReveal, { StaggerItem } from "@/components/frontend/motion/staggerReveal";
import FloatingBackToTop from "@/components/frontend/privacy/floatingBackToTop";
import PolicyContents from "@/components/frontend/privacy/policyContents";
import ReadingProgress from "@/components/frontend/privacy/readingProgress";
import styles from "@/app/(frontend)/privacy-policy/privacyPolicy.module.css";

type Props = { initialData: PrivacyPolicyContent; serverURL: string }

export default function PrivacyPolicyView({ initialData, serverURL }: Props) {
    const { data } = useLivePreview<PrivacyPolicyContent>({
        initialData, serverURL, depth: 0,
    });
    const content = useMemo(() => normalizePrivacyPolicy(data), [data]);
    const sections = useMemo(() => content.sections.map((section) => ({
        id: section.anchor,
        title: section.title,
        eyebrow: section.eyebrow,
        content: (
            <>
                <RichText data={section.body} />
                {section.anchor === 'contact' && (
                    <>
                        <div className={styles.contactDetails}>
                            <strong>{content.contact.businessName}</strong>
                            {content.contact.privacyEmail && (
                                <a href={`mailto:${content.contact.privacyEmail}`}>
                                    {content.contact.privacyEmail}
                                </a>
                            )}
                            {content.contact.businessAddress && <p>{content.contact.businessAddress}</p>}
                        </div>
                        <Link href={content.contact.buttonHref} className={styles.inlineLink}>
                            {content.contact.buttonLabel}
                            <ArrowUpRight size={15} aria-hidden="true" />
                        </Link>
                    </>
                )}
            </>
        ),
    })), [content.sections, content.contact]);
    const lastUpdated = content.hero.lastUpdated;

    return (
        <div
            id="privacy-top"
            className={styles.page}
        >
            <a href="#privacy-content" className={styles.skipLink}>
                Skip to privacy policy
            </a>

            <ReadingProgress />

            <Navbar />

            <main id="privacy-content">
                {/* PAGE HEADER — NO IMAGES */}
                <header className={styles.pageHeader}>
                    <div className={styles.headerInner}>
                        <div className={styles.eyebrow}>
                            <span className="cbg-draw" style={{ animationDelay: "0.1s" }} />
                            <p className="cbg-enter cbg-delay-1">{content.hero.eyebrow}</p>
                        </div>

                        <h1 className={styles.pageTitle}>
                            <RiseText text={content.hero.titleMain} delay={0.2} />{" "}
                            <em><RiseText text={content.hero.titleAccent} delay={0.32} /></em>
                        </h1>

                        <p className={`${styles.headerDescription} cbg-enter`} style={{ animationDelay: "0.5s" }}>
                            {content.hero.description}
                        </p>

                        <div className={`${styles.headerMeta} cbg-enter`} style={{ animationDelay: "0.62s" }}>
                            <span>Last updated: {lastUpdated}</span>
                            <span className={`${styles.metaSeparator} cbg-draw`} style={{ animationDelay: "0.8s" }} />
                            <span>{content.hero.metaLabel}</span>
                        </div>
                    </div>

                    <div
                        className={`${styles.headerNumber} cbg-enter-fade`}
                        style={{ animationDelay: "0.8s" }}
                        aria-hidden="true"
                    >
                        {content.hero.documentNumber}
                    </div>
                </header>

                {/* PRIVACY AT A GLANCE */}
                <section
                    className={styles.atGlance}
                    aria-labelledby="glance-heading"
                >
                    <Reveal intensity="subtle" className={styles.glanceHeading}>
                        <p className={styles.smallLabel}>
                            {content.glance.eyebrow}
                        </p>
                        <h2 id="glance-heading">
                            {content.glance.titleMain} <em>{content.glance.titleAccent}</em>
                        </h2>
                    </Reveal>

                    <StaggerReveal className={styles.glanceGrid} interval={0.12}>
                        <StaggerItem intensity="subtle" className={styles.glanceItem}>
                            <ShieldCheck
                                size={29}
                                strokeWidth={1.3}
                                aria-hidden="true"
                            />
                            <h3>{content.glance.firstTitle}</h3>
                            <p>
                                {content.glance.firstText}
                            </p>
                        </StaggerItem>

                        <StaggerItem intensity="subtle" className={styles.glanceItem}>
                            <LockKeyhole
                                size={29}
                                strokeWidth={1.3}
                                aria-hidden="true"
                            />
                            <h3>{content.glance.secondTitle}</h3>
                            <p>
                                {content.glance.secondText}
                            </p>
                        </StaggerItem>

                        <StaggerItem intensity="subtle" className={styles.glanceItem}>
                            <Mail
                                size={29}
                                strokeWidth={1.3}
                                aria-hidden="true"
                            />
                            <h3>{content.glance.thirdTitle}</h3>
                            <p>
                                {content.glance.thirdText}
                            </p>
                        </StaggerItem>
                    </StaggerReveal>
                </section>

                {/* MOBILE CONTENTS */}
                <div className={styles.mobileContents}>
                    <details>
                        <summary>
                            <span>Jump to a section</span>
                            <ChevronDown
                                size={18}
                                strokeWidth={1.5}
                                aria-hidden="true"
                            />
                        </summary>

                        <nav aria-label="Mobile privacy policy contents">
                            {sections.map((section, index) => (
                                <a
                                    key={section.id}
                                    href={`#${section.id}`}
                                >
                  <span>
                    {String(index + 1).padStart(2, "0")}
                  </span>
                                    {section.title}
                                </a>
                            ))}
                        </nav>
                    </details>
                </div>

                {/* CONTENT + STICKY SIDEBAR */}
                <div className={styles.mainLayout}>

                    <aside className={styles.sidebar}>
                        <div className={styles.sidebarInner}>
                            <p className={styles.sidebarEyebrow}>
                                Contents
                            </p>

                            <PolicyContents
                                sections={sections.map(({ id, title }) => ({ id, title }))}
                            />

                            <div className={styles.sidebarContact}>
                                <p>{content.contact.sidebarQuestion}</p>
                                <Link href={content.contact.buttonHref}>
                                    {content.contact.sidebarButtonLabel}
                                    <ArrowUpRight
                                        size={15}
                                        aria-hidden="true"
                                    />
                                </Link>
                            </div>
                        </div>
                    </aside>

                    {/* POLICY DOCUMENT */}
                    <article className={styles.document}>
                        {sections.map((section, index) => (
                            <section
                                key={section.id}
                                id={section.id}
                                className={styles.policySection}
                                aria-labelledby={`${section.id}-heading`}
                            >
                                {/* Only the heading block moves; the policy text never does. */}
                                <Reveal intensity="subtle" amount={0.6}>
                                <div className={styles.sectionTop}>
                  <span className={styles.sectionNumber}>
                    {String(index + 1).padStart(2, "0")}
                  </span>

                                    <DrawLine className={styles.sectionRule} delay={0.15} />

                                    <span className={styles.sectionEyebrow}>
                    {section.eyebrow}
                  </span>
                                </div>

                                <h2 id={`${section.id}-heading`}>
                                    {section.title}
                                </h2>
                                </Reveal>

                                <div className={styles.sectionBody}>
                                    {section.content}
                                </div>

                                <a
                                    href="#privacy-top"
                                    className={styles.backToTop}
                                >
                                    Back to top
                                    <ArrowUp
                                        size={13}
                                        aria-hidden="true"
                                    />
                                </a>
                            </section>
                        ))}
                    </article>
                </div>

                {/* END OF POLICY */}
                <div className={styles.endNote}>
                    <Reveal className={styles.endNoteInner}>
                        <p className={styles.smallLabel}>
                            {content.closing.eyebrow}
                        </p>
                        <h2>
                            {content.closing.titleMain} <em>{content.closing.titleAccent}</em>
                        </h2>
                        <p>
                            {content.closing.description}
                        </p>

                        <Link href={content.closing.buttonHref}>
                            {content.closing.buttonLabel}
                            <ArrowUpRight size={17} aria-hidden="true" />
                        </Link>
                    </Reveal>
                </div>
            </main>

            <FloatingBackToTop />
        </div>
    );
}
