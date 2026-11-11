import type { Metadata } from "next";
import type { ReactNode } from "react";
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
import styles from "./privacyPolicy.module.css";

export const metadata: Metadata = {
    title: "Privacy Policy | Cherry Blossom Garden",
    description:
        "Learn how Cherry Blossom Garden handles your personal information, reservations, enquiries, communications and privacy choices.",
    alternates: {
        canonical: "/privacy-policy",
    },
};

// IMPORTANT: Verify and complete before publishing.
// The GitHub repository does not establish the registered legal
// operator, privacy email address or business address.
const policyContact = {
    businessName: "Cherry Blossom Garden",
    privacyEmail: "",
    businessAddress: "",
};

const lastUpdated = "26 October 2026";

type PolicySection = {
    id: string;
    title: string;
    eyebrow: string;
    content: ReactNode;
};

const sections: PolicySection[] = [
    {
        id: "introduction",
        title: "Our Commitment to Your Privacy",
        eyebrow: "Our Promise",
        content: (
            <>
                <p>
                    At Cherry Blossom Garden, we believe great hospitality
                    extends beyond the dining experience. It also means
                    respecting your privacy and treating the information
                    you share with us responsibly.
                </p>
                <p>
                    This Privacy Policy explains what personal information
                    we collect, why we use it, how it may be shared, and
                    the choices available to you.
                </p>
                <p>
                    It applies to information collected through our
                    website, reservation enquiries, contact forms,
                    communications and other relevant interactions
                    with Cherry Blossom Garden.
                </p>
            </>
        ),
    },
    {
        id: "who-we-are",
        title: "Who We Are",
        eyebrow: "The Organisation",
        content: (
            <>
                <p>
                    Cherry Blossom Garden is a garden-inspired hospitality
                    destination offering dining, family experiences,
                    entertainment and spaces for special occasions.
                </p>
                <p>
                    For the personal information covered by this notice,
                    the business operating Cherry Blossom Garden is
                    responsible for explaining its handling of that
                    information and responding to privacy enquiries.
                </p>
                <p>
                    You can contact our team using the details in the
                    Contact Us section below.
                </p>
            </>
        ),
    },
    {
        id: "information-we-collect",
        title: "Information We Collect",
        eyebrow: "Your Information",
        content: (
            <>
                <p>
                    The information we receive depends on how you
                    interact with Cherry Blossom Garden.
                </p>

                <h3>Information you provide directly</h3>
                <ul>
                    <li>Your name and contact information.</li>
                    <li>Email address and telephone number.</li>
                    <li>
                        Requested reservation date, time and number of guests.
                    </li>
                    <li>
                        Preferred dining space, occasion and special requests.
                    </li>
                    <li>
                        Enquiry messages and correspondence with our team.
                    </li>
                    <li>
                        Newsletter preferences, if a subscription service
                        is made available.
                    </li>
                </ul>

                <h3>Technical information</h3>
                <p>
                    When you visit our website, technical information
                    such as your IP address, browser type, device details,
                    access times and website activity may be processed
                    by our hosting or security services.
                </p>
                <p>
                    We encourage you not to include unnecessary sensitive
                    personal information in general enquiry forms.
                </p>
            </>
        ),
    },
    {
        id: "how-we-use-information",
        title: "How We Use Your Information",
        eyebrow: "Purpose & Use",
        content: (
            <>
                <p>
                    We use relevant personal information to provide
                    our services and communicate with you.
                </p>
                <ul>
                    <li>
                        Receive and respond to reservation requests.
                    </li>
                    <li>
                        Contact you about booking availability or changes.
                    </li>
                    <li>
                        Respond to enquiries, feedback and requests.
                    </li>
                    <li>
                        Help arrange dining experiences and celebrations.
                    </li>
                    <li>
                        Maintain the functionality and security of our website.
                    </li>
                    <li>
                        Meet applicable legal, record-keeping and
                        regulatory requirements.
                    </li>
                    <li>
                        Send optional marketing communications where
                        permitted and appropriately authorised.
                    </li>
                </ul>
                <p>
                    We aim to use personal information only for the
                    purposes explained when it is collected or for
                    other compatible, lawful purposes.
                </p>
            </>
        ),
    },
    {
        id: "lawful-basis",
        title: "Our Reasons for Processing Data",
        eyebrow: "Legal Grounds",
        content: (
            <>
                <p>
                    Where applicable data protection law requires a
                    specific legal basis for processing, the basis
                    will depend on the activity involved.
                </p>
                <ul>
                    <li>
                        <strong>Taking steps to provide a service:</strong>{" "}
                        handling reservations and requests made by you.
                    </li>
                    <li>
                        <strong>Legitimate interests:</strong>{" "}
                        managing enquiries, maintaining security and
                        improving operations where permitted by law.
                    </li>
                    <li>
                        <strong>Legal obligations:</strong>{" "}
                        retaining or disclosing information where
                        applicable law requires it.
                    </li>
                    <li>
                        <strong>Consent:</strong>{" "}
                        activities such as optional marketing or
                        non-essential tracking where consent is required.
                    </li>
                </ul>
                <p>
                    Where we rely on your consent, you may withdraw it
                    at any time, without affecting processing that
                    took place before withdrawal.
                </p>
            </>
        ),
    },
    {
        id: "reservations",
        title: "Reservations & Enquiries",
        eyebrow: "Your Visit",
        content: (
            <>
                <p>
                    When you request a reservation, we ask for the
                    information needed to understand your visit,
                    including your preferred date, time, dining
                    experience, guest count and contact details.
                </p>
                <p>
                    If you contact us through our general enquiry form,
                    we ask for your name, email address and message.
                </p>
                <p>
                    This information is intended to help our team
                    respond to your request, communicate relevant
                    details and provide an appropriate guest experience.
                </p>
                <p>
                    Submitting a reservation request does not, by
                    itself, guarantee a confirmed booking. Please
                    refer to the confirmation communicated by our team.
                </p>
            </>
        ),
    },
    {
        id: "marketing",
        title: "Newsletters & Marketing",
        eyebrow: "Stay Connected",
        content: (
            <>
                <p>
                    If we offer an email newsletter and you choose
                    to subscribe, we may use your email address
                    to share updates about dining experiences,
                    seasonal menus, events and special occasions.
                </p>
                <p>
                    Where consent is required, promotional messages
                    will be sent only after obtaining appropriate
                    permission. You can stop receiving these
                    messages by using an unsubscribe option or
                    contacting us.
                </p>
                <p>
                    You do not need to subscribe to marketing
                    communications to make a reservation enquiry.
                </p>
            </>
        ),
    },
    {
        id: "cookies",
        title: "Cookies & Website Technologies",
        eyebrow: "Digital Experience",
        content: (
            <>
                <p>
                    Cookies and similar technologies can help
                    websites function, remember preferences,
                    maintain security and understand how
                    visitors use their services.
                </p>
                <p>
                    Our website or its service providers may use
                    technologies necessary for website operation
                    and security.
                </p>
                <p>
                    If optional analytics, advertising or other
                    non-essential tracking technologies are enabled,
                    we will explain their purposes and provide
                    consent choices where required by applicable law.
                </p>
                <p>
                    You may also control certain cookies through
                    your browser settings. Disabling essential
                    website functionality may affect your experience.
                </p>
            </>
        ),
    },
    {
        id: "data-sharing",
        title: "When We Share Information",
        eyebrow: "Trusted Services",
        content: (
            <>
                <p>
                    Providing our services may involve sharing
                    limited information with organisations that
                    help operate our website and hospitality services.
                </p>
                <p>Depending on the services in use, these may include:</p>
                <ul>
                    <li>Website hosting and technical support providers.</li>
                    <li>Reservation and communication service providers.</li>
                    <li>Email delivery and mailing-list services.</li>
                    <li>Security and operational technology providers.</li>
                    <li>
                        Authorities or professional advisers where
                        disclosure is lawfully required or justified.
                    </li>
                </ul>
                <p>
                    Information should be shared only where reasonably
                    necessary and subject to suitable safeguards.
                    We do not authorise third parties to use
                    information for unrelated purposes merely
                    because they provide a service to us.
                </p>
            </>
        ),
    },
    {
        id: "international-transfers",
        title: "International Data Processing",
        eyebrow: "Across Borders",
        content: (
            <>
                <p>
                    Some technology or communication providers
                    may process information in countries other
                    than the country where you live.
                </p>
                <p>
                    Where cross-border processing occurs, we aim
                    to apply appropriate contractual, technical
                    and legal protections required by applicable law.
                </p>
                <p>
                    You may contact us to request further
                    information about relevant international
                    processing arrangements.
                </p>
            </>
        ),
    },
    {
        id: "data-retention",
        title: "How Long We Keep Information",
        eyebrow: "Data Retention",
        content: (
            <>
                <p>
                    We aim not to keep personal information longer
                    than reasonably necessary for the purposes
                    for which it was collected.
                </p>
                <p>
                    Retention depends on the nature of the information,
                    the service requested, applicable legal obligations
                    and any need to resolve disputes or maintain
                    appropriate business records.
                </p>
                <p>
                    When information is no longer needed, it should
                    be securely deleted or anonymised, subject to
                    applicable retention requirements.
                </p>
            </>
        ),
    },
    {
        id: "data-security",
        title: "How We Protect Your Information",
        eyebrow: "Security & Care",
        content: (
            <>
                <p>
                    Protecting personal information is an important
                    part of maintaining the trust of our guests.
                </p>
                <p>
                    We aim to use reasonable organisational and
                    technical safeguards appropriate to the information
                    handled, including limiting access to people who
                    need information for legitimate operational purposes.
                </p>
                <p>
                    No website or electronic communication system
                    can guarantee absolute security. If you believe
                    your information has been compromised, please
                    contact us promptly.
                </p>
            </>
        ),
    },
    {
        id: "your-rights",
        title: "Your Privacy Rights & Choices",
        eyebrow: "Your Control",
        content: (
            <>
                <p>
                    Depending on the laws applicable to your
                    circumstances, you may have rights to:
                </p>
                <ul>
                    <li>Request access to your personal information.</li>
                    <li>Ask for inaccurate information to be corrected.</li>
                    <li>Request deletion of certain information.</li>
                    <li>Object to or restrict certain processing.</li>
                    <li>
                        Withdraw consent where processing depends on it.
                    </li>
                    <li>
                        Request a portable copy of eligible information.
                    </li>
                    <li>
                        Raise a concern with a relevant privacy authority.
                    </li>
                </ul>
                <p>
                    These rights are not absolute and may be subject
                    to applicable exceptions. We may need to verify
                    your identity before acting on a request.
                </p>
                <p>
                    You can submit a privacy-related enquiry through
                    our contact channel described below.
                </p>
            </>
        ),
    },
    {
        id: "children",
        title: "Children's Privacy",
        eyebrow: "Families & Children",
        content: (
            <>
                <p>
                    Cherry Blossom Garden welcomes families,
                    but our website is not intended to encourage
                    children to submit personal information
                    independently without appropriate permission.
                </p>
                <p>
                    If a parent or guardian believes a child has
                    supplied personal information inappropriately,
                    they may contact us to request a review.
                </p>
            </>
        ),
    },
    {
        id: "external-links",
        title: "Links to Other Websites",
        eyebrow: "External Services",
        content: (
            <>
                <p>
                    Our website may contain links to social media
                    platforms, partner websites and other
                    independently operated services.
                </p>
                <p>
                    These websites may have their own privacy policies
                    and practices. We encourage you to review
                    their notices before sharing information
                    directly with them.
                </p>
            </>
        ),
    },
    {
        id: "policy-updates",
        title: "Changes to This Privacy Policy",
        eyebrow: "Policy Updates",
        content: (
            <>
                <p>
                    We may update this Privacy Policy to reflect
                    changes in our services, technology, legal
                    requirements or information-handling practices.
                </p>
                <p>
                    The latest version will be made available
                    on this page with an updated revision date.
                    Where required, we will provide additional
                    notice of significant changes.
                </p>
            </>
        ),
    },
    {
        id: "contact",
        title: "Contact Us About Privacy",
        eyebrow: "Get in Touch",
        content: (
            <>
                <p>
                    If you have questions about this Privacy Policy,
                    want to understand how your information is handled,
                    or would like to make a privacy-related request,
                    please contact the team responsible for
                    Cherry Blossom Garden.
                </p>

                <div className={styles.contactDetails}>
                    <strong>{policyContact.businessName}</strong>

                    {policyContact.privacyEmail && (
                        <a href={`mailto:${policyContact.privacyEmail}`}>
                            {policyContact.privacyEmail}
                        </a>
                    )}

                    {policyContact.businessAddress && (
                        <p>{policyContact.businessAddress}</p>
                    )}
                </div>

                <Link
                    href="/reservation#contact"
                    className={styles.inlineLink}
                >
                    Send a privacy enquiry
                    <ArrowUpRight size={15} aria-hidden="true" />
                </Link>
            </>
        ),
    },
];

export default function PrivacyPolicyPage() {
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
                            <p className="cbg-enter cbg-delay-1">Cherry Blossom Garden / Legal</p>
                        </div>

                        <h1 className={styles.pageTitle}>
                            <RiseText text="Privacy" delay={0.2} />{" "}
                            <em><RiseText text="Policy." delay={0.32} /></em>
                        </h1>

                        <p className={`${styles.headerDescription} cbg-enter`} style={{ animationDelay: "0.5s" }}>
                            Your trust is part of our hospitality.
                            Discover how we treat your information
                            with care, transparency and respect.
                        </p>

                        <div className={`${styles.headerMeta} cbg-enter`} style={{ animationDelay: "0.62s" }}>
                            <span>Last updated: {lastUpdated}</span>
                            <span className={`${styles.metaSeparator} cbg-draw`} style={{ animationDelay: "0.8s" }} />
                            <span>Privacy & Data Protection</span>
                        </div>
                    </div>

                    <div
                        className={`${styles.headerNumber} cbg-enter-fade`}
                        style={{ animationDelay: "0.8s" }}
                        aria-hidden="true"
                    >
                        01 / LEGAL
                    </div>
                </header>

                {/* PRIVACY AT A GLANCE */}
                <section
                    className={styles.atGlance}
                    aria-labelledby="glance-heading"
                >
                    <Reveal intensity="subtle" className={styles.glanceHeading}>
                        <p className={styles.smallLabel}>
                            A Simple Promise
                        </p>
                        <h2 id="glance-heading">
                            Privacy, with <em>care.</em>
                        </h2>
                    </Reveal>

                    <StaggerReveal className={styles.glanceGrid} interval={0.12}>
                        <StaggerItem intensity="subtle" className={styles.glanceItem}>
                            <ShieldCheck
                                size={29}
                                strokeWidth={1.3}
                                aria-hidden="true"
                            />
                            <h3>Clear Purpose</h3>
                            <p>
                                We explain why information is requested
                                and how it may be used.
                            </p>
                        </StaggerItem>

                        <StaggerItem intensity="subtle" className={styles.glanceItem}>
                            <LockKeyhole
                                size={29}
                                strokeWidth={1.3}
                                aria-hidden="true"
                            />
                            <h3>Respectful Handling</h3>
                            <p>
                                Personal information should be protected
                                and handled responsibly.
                            </p>
                        </StaggerItem>

                        <StaggerItem intensity="subtle" className={styles.glanceItem}>
                            <Mail
                                size={29}
                                strokeWidth={1.3}
                                aria-hidden="true"
                            />
                            <h3>Your Choices</h3>
                            <p>
                                Ask questions, manage preferences
                                and make eligible privacy requests.
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
                                <p>Have a privacy question?</p>
                                <Link href="/reservation#contact">
                                    Get in touch
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
                            Cherry Blossom Garden
                        </p>
                        <h2>
                            Your trust means <em>everything.</em>
                        </h2>
                        <p>
                            Thank you for taking the time to understand
                            how your information is handled.
                        </p>

                        <Link href="/">
                            Return to Homepage
                            <ArrowUpRight size={17} aria-hidden="true" />
                        </Link>
                    </Reveal>
                </div>
            </main>

            <FloatingBackToTop />
        </div>
    );
}
