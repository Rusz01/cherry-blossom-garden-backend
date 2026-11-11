import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Flower2, UsersRound } from "lucide-react";

import DrawLine from "@/components/frontend/motion/drawLine";
import ImageReveal from "@/components/frontend/motion/imageReveal";
import ParallaxMedia from "@/components/frontend/motion/parallaxMedia";
import StaggerReveal, { StaggerItem } from "@/components/frontend/motion/staggerReveal";
import styles from "./ourStorySection.module.css";

// One photography asset reused with different crops.
const STORY_IMAGE = "/assets/garden-ambience.png";
const BLOSSOM_IMAGE = "/assets/story-blossom.png";

/*
 * Motion: each block plays once as it arrives — label and hairlines draw,
 * heading lifts, paragraphs follow with a short, quiet rise. Story photographs
 * open with a curtain and drift slightly with scroll inside their frames.
 * Long text never moves word by word.
 */

export default function OurStorySection() {
    return (
        <section
            id="our-story"
            className={styles.section}
            aria-labelledby="our-story-heading"
        >
            {/* DECORATIVE CHERRY BLOSSOMS */}
            <div
                className={`${styles.topBlossom} ${styles.blossomLeft}`}
                aria-hidden="true"
            >
                <div className="cbg-sway absolute inset-0">
                    <Image
                        src={BLOSSOM_IMAGE}
                        alt=""
                        fill
                        sizes="340px"
                        className={styles.blossomImage}
                    />
                </div>
            </div>

            <div
                className={`${styles.topBlossom} ${styles.blossomRight}`}
                aria-hidden="true"
            >
                <div className="cbg-sway absolute inset-0" style={{ animationDelay: "-4s" }}>
                    <Image
                        src={BLOSSOM_IMAGE}
                        alt=""
                        fill
                        sizes="340px"
                        className={styles.blossomImage}
                    />
                </div>
            </div>

            {/* ========================================
          INTRODUCTION
      ======================================== */}
            <StaggerReveal className={styles.introduction} interval={0.12}>
                <StaggerItem className={styles.centerEyebrow} direction="none">
                    <DrawLine origin="right" delay={0.1} />
                    <p>Our Story</p>
                    <DrawLine origin="left" delay={0.1} />
                </StaggerItem>

                <StaggerItem>
                    <h2
                        id="our-story-heading"
                        className={styles.mainHeading}
                    >
                        <span>A PLACE WHERE</span>
                        <span className={styles.highlight}>
              NATURE BRINGS PEOPLE TOGETHER
            </span>
                    </h2>
                </StaggerItem>

                <StaggerItem
                    className={styles.flowerDivider}
                    direction="none"
                >
                    <DrawLine origin="right" delay={0.15} />
                    <Flower2 size={16} strokeWidth={1.2} aria-hidden="true" />
                    <DrawLine origin="left" delay={0.15} />
                </StaggerItem>

                <StaggerItem
                    as="p"
                    intensity="subtle"
                    className={styles.introDescription}
                >
                    Cherry Blossom Garden was born from a simple belief —
                    that food tastes better when it&apos;s shared, and
                    that the beauty of nature has the power to bring
                    people closer. We created a space where exceptional
                    cuisine, thoughtful hospitality and the timeless
                    beauty of cherry blossoms come together.
                </StaggerItem>
            </StaggerReveal>

            {/* ========================================
          OUR STORY CONTENT
      ======================================== */}
            <div className={styles.storyContainer}>

                {/* SECTION 01 — BEGINNING */}
                <div className={styles.storyRow}>
                    <div
                        className={`${styles.imageFrame} ${styles.frameLeft}`}
                    >
                        <div className={styles.imageInner}>
                            <ImageReveal fill direction="right">
                                <ParallaxMedia fill strength={0.06}>
                                    <Image
                                        src={STORY_IMAGE}
                                        alt="Warm garden dining atmosphere with elegant tables and greenery"
                                        fill
                                        sizes="(max-width: 900px) 100vw, 45vw"
                                        className={`${styles.storyImage} ${styles.imageFirst}`}
                                    />
                                </ParallaxMedia>
                            </ImageReveal>
                        </div>
                    </div>

                    <StaggerReveal className={styles.storyContent} delay={0.2} interval={0.1}>
                        <StaggerItem className={styles.eyebrow} direction="none">
                            <DrawLine delay={0.1} />
                            <p>The Beginning</p>
                        </StaggerItem>

                        <StaggerItem>
                            <h3 className={styles.storyHeading}>
                                ROOTED IN A DREAM
                            </h3>
                        </StaggerItem>

                        <div className={styles.paragraphs}>
                            <StaggerItem as="p" intensity="subtle">
                                Cherry Blossom Garden began with a vision
                                to create a dining destination that feels
                                like an escape. A place where the elegance
                                of Asian culture, the warmth of genuine
                                hospitality, and the beauty of seasonal
                                living exist in harmony.
                            </StaggerItem>

                            <StaggerItem as="p" intensity="subtle">
                                What started as an idea around a shared
                                table has grown into a vibrant garden
                                restaurant, welcoming a community who
                                share our love for good food, meaningful
                                moments and extraordinary surroundings.
                            </StaggerItem>
                        </div>

                        <DrawLine className={styles.smallDivider} delay={0.5} />
                    </StaggerReveal>
                </div>

                {/* SECTION 02 — NATURE */}
                <div
                    className={`${styles.storyRow} ${styles.secondRow}`}
                >
                    <StaggerReveal className={styles.storyContent} interval={0.1}>
                        <StaggerItem className={styles.eyebrow} direction="none">
                            <DrawLine delay={0.1} />
                            <p>Inspired By Nature</p>
                        </StaggerItem>

                        <StaggerItem>
                            <h3 className={styles.storyHeading}>
                                THE BEAUTY
                                <br />
                                <span className={styles.highlight}>
                  IN EVERY SEASON
                </span>
                            </h3>
                        </StaggerItem>

                        <div className={styles.paragraphs}>
                            <StaggerItem as="p" intensity="subtle">
                                Cherry blossoms remind us to slow down,
                                to be present, and to appreciate the beauty
                                in each moment. Their fleeting nature
                                inspires our seasonal menus, our evolving
                                space and the way we host — with intention,
                                grace and a deep respect for the rhythms
                                of nature.
                            </StaggerItem>

                            <StaggerItem as="p" intensity="subtle">
                                From fresh, seasonal ingredients to a
                                garden that transforms throughout the year,
                                nature is at the heart of everything we do.
                            </StaggerItem>
                        </div>
                    </StaggerReveal>

                    <div
                        className={`${styles.imageFrame} ${styles.frameRight}`}
                    >
                        <div className={styles.imageInner}>
                            <ImageReveal fill direction="left" delay={0.1}>
                                <ParallaxMedia fill strength={0.06}>
                                    <Image
                                        src={STORY_IMAGE}
                                        alt="Cherry Blossom Garden atmosphere inspired by nature"
                                        fill
                                        sizes="(max-width: 900px) 100vw, 45vw"
                                        className={`${styles.storyImage} ${styles.imageSecond}`}
                                    />
                                </ParallaxMedia>
                            </ImageReveal>
                        </div>
                    </div>
                </div>
            </div>

            {/* ========================================
          OUR VALUES
      ======================================== */}
            <div className={styles.valuesSection}>
                <StaggerReveal className={styles.valuesContainer} interval={0.16}>

                    <StaggerItem as="article" intensity="subtle" className={styles.valueItem}>
                        <UsersRound
                            className={styles.valueIcon}
                            size={56}
                            strokeWidth={1}
                            aria-hidden="true"
                        />

                        <div className={styles.valueText}>
                            <p className={styles.valueLabel}>
                                A Place For People
                            </p>

                            <h3>
                                GOOD FOOD BRINGS
                                <br />
                                <span>GOOD COMPANY</span>
                            </h3>

                            <p className={styles.valueDescription}>
                                Whether it&apos;s a romantic dinner,
                                a family celebration, or a long-awaited
                                catch up with friends, Cherry Blossom
                                Garden is a place for connection.
                                We believe in the power of a shared
                                table — to create memories, spark new
                                stories, and bring people closer together.
                            </p>
                        </div>
                    </StaggerItem>

                    <StaggerItem as="article" intensity="subtle" className={styles.valueItem}>
                        <Flower2
                            className={styles.valueIcon}
                            size={56}
                            strokeWidth={1}
                            aria-hidden="true"
                        />

                        <div className={styles.valueText}>
                            <p className={styles.valueLabel}>
                                Our Promise
                            </p>

                            <h3>
                                EXCEPTIONAL FOOD.
                                <br />
                                <span>GENUINE HOSPITALITY.</span>
                            </h3>

                            <p className={styles.valueDescription}>
                                We are committed to creating an experience
                                that lingers long after the last bite.
                                From the flavours on your plate to the
                                details in our garden, our promise is
                                simple: exceptional food, genuine
                                hospitality, and a place that always
                                feels like home.
                            </p>
                        </div>
                    </StaggerItem>

                </StaggerReveal>
            </div>

            {/* ========================================
          CLOSING QUOTE AND RESERVATION CTA
      ======================================== */}
            <div className={styles.closingSection}>
                <div
                    className={styles.closingBlossom}
                    aria-hidden="true"
                >
                    <div className="cbg-sway absolute inset-0" style={{ animationDelay: "-2s" }}>
                        <Image
                            src={BLOSSOM_IMAGE}
                            alt=""
                            fill
                            sizes="450px"
                            className={styles.blossomImage}
                        />
                    </div>
                </div>

                <StaggerReveal className={styles.closingContainer} interval={0.12}>
                    <div className={styles.quoteContent}>
                        <StaggerItem direction="none">
              <span
                  className={styles.quoteMark}
                  aria-hidden="true"
              >
                &ldquo;
              </span>
                        </StaggerItem>

                        <StaggerItem intensity="subtle">
                            <blockquote>
                                Good food, beautiful surroundings
                                <br className={styles.desktopBreak} />
                                and the people who make it special.
                            </blockquote>
                        </StaggerItem>

                        <DrawLine className={styles.quoteSeparator} origin="center" delay={0.35} />

                        <StaggerItem as="p" direction="none">
                            Cherry Blossom Garden
                        </StaggerItem>
                    </div>

                    <StaggerItem intensity="subtle">
                        <Link
                            href="/reservation"
                            className={styles.reservationButton}
                        >
                            <span className={styles.reservationLabel}>
                                Reserve a Table
                            </span>
                            <ArrowUpRight
                                size={16}
                                strokeWidth={1.5}
                                aria-hidden="true"
                                className={styles.reservationIcon}
                            />
                        </Link>
                    </StaggerItem>
                </StaggerReveal>
            </div>
        </section>
    );
}
