'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

import type { ShowcaseSlide } from '@/lib/explore/defaults'

import Image from 'next/image'
import Link from 'next/link'
import { ArrowDownRight, ArrowLeft, ArrowRight, Pause, Play } from 'lucide-react'
import { AnimatePresence, m, stagger, useInView, type Variants } from 'motion/react'

import PointerParallax from '@/components/frontend/motion/pointerParallax'
import { usePrefersReducedMotion } from '@/hooks/frontend/usePrefersReducedMotion'
import { ease } from '@/lib/frontend/motion/tokens'
import styles from './GroundFloorShowcase.module.css'

type GroundFloorShowcaseProps = {
  experiences: ShowcaseSlide[]
  title: string

  serialLabel: string
  imageSignature: string
  imageLabel: string

  sideLabel: string
  sideYear: string

  nextLabel: string
  dragHint: string
}

const formatNumber = (value: number) => String(value).padStart(2, '0')

const AUTOPLAY_DELAY = 7000

/*
 * Motion responsibilities
 * - CSS (data-active / data-direction): background crossfade, featured image
 *   mask + zoom, preview card, tone colours, progress and controls.
 * - Motion: only the copy. The old copy exits, then the new copy enters line
 *   by line from the travel direction. mode="wait" means rapid clicks skip
 *   straight to the latest slide instead of queueing animations.
 * - Autoplay has one clock: the active progress step's CSS fill. When it
 *   completes the next slide plays; holding pauses the fill.
 */
const copyVariants: Variants = {
  enter: {},
  center: { transition: { delayChildren: stagger(0.07, { startDelay: 0.12 }) } },
  exit: { transition: { delayChildren: stagger(0.025) } },
}

const lineVariants: Variants = {
  enter: (direction: number) => ({ opacity: 0, x: direction * 34 }),
  center: { opacity: 1, x: 0, transition: { duration: 0.75, ease: ease.out } },
  exit: { opacity: 0, y: -10, transition: { duration: 0.22, ease: ease.inOut } },
}

export default function GroundFloorShowcase({
  experiences,
  title,
  serialLabel,
  imageSignature,
  imageLabel,
  sideLabel,
  sideYear,
  nextLabel,
  dragHint,
}: GroundFloorShowcaseProps) {
  const [index, setIndex] = useState(0)
  // 1 = forward, -1 = back: which side new imagery and copy arrive from.
  const [direction, setDirection] = useState(1)
  // The slide that just left stays beneath the incoming one until covered.
  const [previous, setPrevious] = useState<number | null>(null)
  const [autoplay, setAutoplay] = useState(true)
  const [hovered, setHovered] = useState(false)
  const [focused, setFocused] = useState(false)
  const [touching, setTouching] = useState(false)
  const reducedMotion = usePrefersReducedMotion()

  const sectionRef = useRef<HTMLElement | null>(null)
  const inView = useInView(sectionRef, { amount: 0.3 })

  useEffect(() => {
    setIndex((current) => Math.min(current, experiences.length - 1))

    setPrevious(null)
  }, [experiences.length])

  const startX = useRef<number | null>(null)
  const startY = useRef<number | null>(null)

  const safeIndex = Math.min(index, experiences.length - 1)

  const active = experiences[safeIndex]

  const upcoming = experiences[(safeIndex + 1) % experiences.length]

  // Autoplay never runs with reduced motion; hover, focus, touch and
  // scrolling away only hold it.
  const playing = autoplay && !reducedMotion
  const held = hovered || focused || touching || !inView

  const goTo = useCallback(
    (delta: number) => {
      const next = (safeIndex + delta + experiences.length) % experiences.length

      setDirection(delta > 0 ? 1 : -1)
      setPrevious(safeIndex)
      setIndex(next)
    },
    [safeIndex, experiences.length],
  )

  const select = (target: number) => {
    const total = experiences.length

    let delta = target - safeIndex

    if (delta > total / 2) delta -= total
    if (delta < -total / 2) delta += total

    if (delta === 0) return

    setDirection(delta > 0 ? 1 : -1)
    setPrevious(safeIndex)
    setIndex(target)
  }

  return (
    <section
      id={active.anchor}
      ref={sectionRef}
      className={styles.showcase}
      data-tone={active.tone}
      data-direction={direction > 0 ? 'next' : 'previous'}
      data-changed={previous !== null}
      aria-roledescription="carousel"
      aria-label={title}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocusCapture={() => setFocused(true)}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
          setFocused(false)
        }
      }}
      onKeyDown={(event) => {
        if (event.key === 'ArrowRight') {
          event.preventDefault()
          goTo(1)
        } else if (event.key === 'ArrowLeft') {
          event.preventDefault()
          goTo(-1)
        }
      }}
      onTouchStart={(event) => {
        startX.current = event.touches[0]?.clientX ?? null
        startY.current = event.touches[0]?.clientY ?? null
        setTouching(true)
      }}
      onTouchCancel={() => {
        startX.current = null
        startY.current = null
        setTouching(false)
      }}
      onTouchEnd={(event) => {
        setTouching(false)
        if (startX.current === null || startY.current === null) return
        const dx = event.changedTouches[0].clientX - startX.current
        const dy = event.changedTouches[0].clientY - startY.current
        if (Math.abs(dx) > 55 && Math.abs(dx) > Math.abs(dy) * 1.4) {
          goTo(dx < 0 ? 1 : -1)
        }
        startX.current = null
        startY.current = null
      }}
    >
      {/* Full-bleed photography reaches behind the navbar and the whole showcase.
          Each image crossfades with the active experience. */}
      {/* Desktop pointer depth: the background drifts slightly. Overscanned
                so the drift never reveals an edge; z-index keeps it behind the
                canvas overlays. */}
      <PointerParallax className={styles.backgroundStack} distance={6}>
        {experiences.map((item, i) => (
          <div
            key={item.id}
            aria-hidden="true"
            className={styles.background}
            data-background={item.tone}
            data-active={i === index}
          >
            <Image
              src={item.image}
              alt=""
              fill
              priority={i === 0}
              sizes="100vw"
              style={{ objectPosition: item.imagePosition }}
              className={styles.backgroundPhoto}
            />
            <div className={styles.backgroundShade} />
          </div>
        ))}
      </PointerParallax>

      {/* The old copy exits, then the new copy enters line by line. */}
      <div className={`${styles.copyArea} cbg-enter`}>
        <AnimatePresence mode="wait" initial={false} custom={direction}>
          <m.div
            key={active.id}
            className={styles.copy}
            custom={direction}
            variants={copyVariants}
            initial="enter"
            animate="center"
            exit="exit"
          >
            <m.p className={styles.eyebrow} custom={direction} variants={lineVariants}>
              {active.eyebrow}
            </m.p>
            <m.h1
              className={`${styles.title} ${active.titleBottom.length > 11 ? styles.longTitle : ''}`}
              custom={direction}
              variants={lineVariants}
            >
              {active.titleTop}
              <span>{active.titleBottom}</span>
            </m.h1>
            <m.p className={styles.subtitle} custom={direction} variants={lineVariants}>
              {active.subtitle}
            </m.p>
            <m.p className={styles.description} custom={direction} variants={lineVariants}>
              {active.description}
            </m.p>
            <m.div custom={direction} variants={lineVariants}>
              <Link className={styles.cta} href={active.href}>
                {active.cta}
                <ArrowRight size={18} strokeWidth={1.35} aria-hidden="true" />
              </Link>
            </m.div>
          </m.div>
        </AnimatePresence>
      </div>

      <div className={styles.gallery}>
        {/* Decorative frame behind the main image */}
        <div className={styles.archHalo} aria-hidden="true" />

        {/* Main editorial photograph */}
        <div className={styles.featuredArch}>
          {/* Pointer depth inside the frame (desktop only). */}
          <PointerParallax className={styles.featuredStack} distance={10}>
            {experiences.map((item, i) => (
              <div
                key={item.id}
                className={styles.featuredImage}
                data-active={i === index}
                data-state={i === index ? 'active' : i === previous ? 'leaving' : 'idle'}
                aria-hidden={i !== index}
              >
                <Image
                  src={item.image}
                  alt={
                    i === index
                      ? `${item.titleTop} ${item.titleBottom} — Cherry Blossom Garden`
                      : ''
                  }
                  fill
                  priority={i === 0}
                  sizes="(max-width: 640px) 70vw, (max-width: 1023px) 50vw, 35vw"
                  style={{ objectPosition: item.imagePosition }}
                  className={styles.photo}
                />
              </div>
            ))}
          </PointerParallax>

          <div className={styles.archSheen} />

          <span className={styles.imageSerial}>
            {serialLabel}
            <span>
              <strong className={styles.rollWindow}>
                <span key={index} className={styles.roll}>
                  {formatNumber(index + 1)}
                </span>
              </strong>{' '}
              — {formatNumber(experiences.length)}
            </span>
          </span>

          <span className={styles.imageSignature}>{imageSignature}</span>
          <span className={styles.imageLabel}>{imageLabel}</span>
        </div>

        {/* Editorial vertical label */}
        <div className={styles.gallerySideLabel} aria-hidden="true">
          {sideLabel}
          <span />
          {sideYear}
        </div>

        {/* Next photograph */}
        <button
          type="button"
          className={styles.nextPreview}
          onClick={() => goTo(1)}
          aria-label={`Next: ${upcoming.titleTop} ${upcoming.titleBottom}`}
        >
          <Image
            key={upcoming.id}
            src={upcoming.image}
            alt=""
            fill
            sizes="(max-width: 640px) 35vw, 22vw"
            className={styles.previewPhoto}
          />

          <span className={styles.previewShade} />

          <span className={styles.previewTop}>
            <span className={styles.previewLine} />
            {nextLabel}
          </span>

          <span key={`info-${upcoming.id}`} className={styles.previewInfo}>
            <span className={styles.previewNumber}>
              {formatNumber(((index + 1) % experiences.length) + 1)}
              <span> / {formatNumber(experiences.length)}</span>
            </span>

            <span className={styles.previewTitle}>
              {upcoming.titleTop}
              <span>{upcoming.titleBottom}</span>
            </span>

            <span className={styles.previewArrow}>
              <ArrowDownRight size={18} strokeWidth={1.4} aria-hidden="true" />
            </span>
          </span>
        </button>
      </div>

      <div className={styles.bottomRail}>
        <div className={styles.progressCluster}>
          <span className={styles.progressCount}>
            <strong className={styles.rollWindow}>
              <b key={index} className={styles.roll}>
                {formatNumber(index + 1)}
              </b>
            </strong>
            <span> / {formatNumber(experiences.length)}</span>
          </span>

          <div
            className={styles.progressSteps}
            role="group"
            aria-label={`Choose ${title} experience`}
          >
            {experiences.map((item, i) => (
              <button
                key={item.id}
                type="button"
                className={styles.progressStep}
                data-active={i === index}
                data-playing={playing}
                aria-label={`Go to ${item.titleTop} ${item.titleBottom}`}
                aria-current={i === index ? 'true' : undefined}
                onClick={() => select(i)}
              >
                <span>
                  {i === index && playing ? (
                    <i
                      // Remounts per slide, restarting the countdown.
                      key={index}
                      aria-hidden="true"
                      className={styles.progressFill}
                      onAnimationEnd={() => goTo(1)}
                      style={{
                        animation: `cbgProgress ${AUTOPLAY_DELAY}ms linear forwards`,
                        animationPlayState: held ? 'paused' : 'running',
                      }}
                    />
                  ) : null}
                </span>
              </button>
            ))}
          </div>
        </div>

        <div className={styles.controls}>
          <span className={styles.dragHint}>{dragHint}</span>

          {!reducedMotion ? (
            <button
              type="button"
              onClick={() => setAutoplay((value) => !value)}
              className={styles.autoplayButton}
              aria-label={autoplay ? 'Pause automatic slides' : 'Play automatic slides'}
              title={autoplay ? 'Pause autoplay' : 'Resume autoplay'}
            >
              {autoplay ? (
                <Pause size={13} fill="currentColor" aria-hidden="true" />
              ) : (
                <Play size={13} fill="currentColor" aria-hidden="true" />
              )}
            </button>
          ) : null}

          <button
            type="button"
            onClick={() => goTo(-1)}
            className={styles.arrowButton}
            aria-label="Previous experience"
          >
            <ArrowLeft size={19} strokeWidth={1.4} aria-hidden="true" />
          </button>

          <button
            type="button"
            onClick={() => goTo(1)}
            className={`${styles.arrowButton} ${styles.arrowNext}`}
            aria-label="Next experience"
          >
            <ArrowRight size={19} strokeWidth={1.4} aria-hidden="true" />
          </button>
        </div>
      </div>

      {/* Silent while autoplaying, so screen readers aren't interrupted every slide. */}
      <div
        className={styles.announcement}
        aria-live={playing ? 'off' : 'polite'}
        aria-atomic="true"
      >
        {`Showing ${active.titleTop} ${active.titleBottom}, ${index + 1} of ${experiences.length}`}
      </div>
    </section>
  )
}
