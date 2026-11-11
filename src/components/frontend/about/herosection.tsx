import Image from "next/image";

import ParallaxMedia from "@/components/frontend/motion/parallaxMedia";
import RiseText from "@/components/frontend/motion/riseText";
import styles from "./aboutHero.module.css";

const description =
    "A garden-led dining experience where thoughtful hospitality, seasonal flavour and beautiful celebrations come together.";

/*
 * Entrance (CSS, plays on first paint):
 *   0.00s photograph settles from a slight scale
 *   0.10s / 0.24s / 0.38s three midnight curtains lift off the three panels
 *   0.62s headline letters rise inside their lines (backgrounds never move,
 *         so the notch over the photograph holds its shape)
 *   1.05s / 1.20s supporting copy
 * The photograph is one image throughout: curtains, gaps and cutouts are
 * overlays, and parallax moves only the photograph beneath them.
 */

export default function AboutHeroSection() {
    return (
        <section
            className={styles.hero}
            aria-labelledby="about-hero-heading"
        >
            <div className={styles.stage}>
                {/* ONE CONTINUOUS IMAGE */}
                <div className={styles.visual}>
                    <ParallaxMedia fill strength={0.06}>
                        <Image
                            src="/assets/rooftop.png"
                            alt="Cherry Blossom Garden rooftop dining surrounded by greenery and beautiful garden details"
                            fill
                            priority
                            quality={90}
                            sizes="(max-width: 1099px) 100vw, 69vw"
                            className={styles.photo}
                        />
                    </ParallaxMedia>

                    {/* The gaps create the illusion of three images */}
                    <div aria-hidden="true">
            <span
                className={`${styles.imageGap} ${styles.gapOne}`}
            />
                        <span
                            className={`${styles.imageGap} ${styles.gapTwo}`}
                        />

                        {/* Different panel heights */}
                        <span className={styles.leftCutout} />
                        <span className={styles.rightCutout} />

                        {/* Entrance curtains, one per panel */}
                        <span className={`${styles.curtain} ${styles.curtainOne}`} />
                        <span className={`${styles.curtain} ${styles.curtainTwo}`} />
                        <span className={`${styles.curtain} ${styles.curtainThree}`} />
                    </div>
                </div>

                {/* LEFT DESCRIPTION */}
                <p className={styles.intro}>
                    {description}
                </p>

                {/* MAIN EDITORIAL HEADING */}
                <h1
                    id="about-hero-heading"
                    className={styles.headline}
                >
          <span className={styles.aboutLine}>
            <RiseText text="ABOUT" delay={0.62} />
          </span>

                    <span className={styles.brandLine}>
            <RiseText text="CHERRY" delay={0.72} />
            <span className={styles.brandSecond}>
              {" "}<RiseText text="BLOSSOM" delay={0.8} />
            </span>
          </span>

                    <span className={styles.gardenLine}>
            <RiseText text="GARDEN" delay={0.88} />
          </span>
                </h1>

                {/* RIGHT DESCRIPTION */}
                <p className={styles.rightNote}>
                    {description}
                </p>
            </div>
        </section>
    );
}
