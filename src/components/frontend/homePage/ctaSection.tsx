'use client'

import { useHomeContent } from './HomeContentProvider'
import { imageSrc } from '@/lib/homepage/defaults'

import Image from 'next/image'
import { ArrowRight } from 'lucide-react'

import ImageReveal from '@/components/frontend/motion/imageReveal'
import StaggerReveal, { StaggerItem } from '@/components/frontend/motion/staggerReveal'
import { buttonClass } from '@/components/frontend/ui/button'
import Eyebrow from '@/components/frontend/ui/eyebrow'

export default function CTASection() {
  const { journal } = useHomeContent()
  return (
    <section className="relative isolate overflow-hidden border-y border-champagne/20 bg-midnight">
      {/* Background image — fades up and settles as the section arrives */}
      <ImageReveal fill mask={false}>
        <Image
          src={imageSrc(journal.image, '/assets/garden-ambience.png')}
          alt=""
          fill
          sizes="100vw"
          className="object-cover object-center opacity-20"
        />
      </ImageReveal>

      {/* Dark cinematic overlay */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-midnight via-midnight/95 to-midnight/75" />

      {/* Subtle decorative glow */}
      <div className="cbg-drift pointer-events-none absolute -right-32 top-0 h-80 w-80 rounded-full bg-blossom/5 blur-[100px]" />

      <div className="relative z-10 mx-auto grid w-full max-w-[1500px] items-center gap-10 px-6 py-14 sm:px-10 lg:grid-cols-2 lg:gap-20 lg:px-16 lg:py-16 xl:px-20">
        {/* LEFT CONTENT */}
        <StaggerReveal className="max-w-[550px]" interval={0.12}>
          {/* Eyebrow */}
          <StaggerItem intensity="subtle">
            <Eyebrow line className="mb-4">
              {journal.eyebrow}
            </Eyebrow>
          </StaggerItem>

          {/* Heading */}
          <StaggerItem>
            <h2 className="font-cormorant text-[43px] font-normal leading-[0.98] tracking-[-0.02em] text-ivory sm:text-[50px] lg:text-[55px]">
              {journal.title1}{' '}
              <span className="font-allura text-[1.15em] text-blossom">{journal.titleAccent}</span>
              <br />
              {journal.title2}
            </h2>
          </StaggerItem>

          {/* Description */}
          <StaggerItem
            as="p"
            intensity="subtle"
            className="mt-5 max-w-[450px] font-inter text-[12px] leading-[1.85] text-ivory/65 sm:text-[13px]"
          >
            {journal.description}
          </StaggerItem>
        </StaggerReveal>

        {/* RIGHT CONTENT — follows the heading */}
        <StaggerReveal className="w-full max-w-[520px] lg:ml-auto" delay={0.3} interval={0.1}>
          <StaggerItem
            as="p"
            intensity="subtle"
            className="mb-4 font-inter text-[11px] font-medium text-ivory/80"
          >
            {journal.prompt}
          </StaggerItem>

          {/* Design-only email subscription (no backend yet: nothing is submitted) */}
          <StaggerItem className="flex flex-col gap-3 sm:flex-row sm:gap-0">
            {/* A blossom line draws under the field while it has focus. */}
            <div className="group/field relative min-w-0 flex-1">
              <input
                type="email"
                aria-label="Email address for newsletter"
                placeholder={journal.placeholder}
                autoComplete="email"
                className="h-[54px] w-full border border-ivory/25 bg-midnight/50 px-5 font-inter text-[12px] text-ivory outline-none transition-colors duration-300 placeholder:text-ivory/40 placeholder:transition-colors hover:border-ivory/40 focus:border-blossom focus:bg-midnight/80 focus:placeholder:text-ivory/25 sm:border-r-0"
              />

              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-0 bottom-0 h-px origin-left scale-x-0 bg-blossom transition-transform duration-500 group-focus-within/field:scale-x-100"
              />
            </div>

            <button type="button" className={buttonClass('primary', 'h-[54px]')}>
              {journal.buttonLabel}
              <ArrowRight
                aria-hidden="true"
                size={17}
                strokeWidth={1.5}
                className="transition-transform duration-300 group-hover:translate-x-1 group-active:translate-x-2"
              />
            </button>
          </StaggerItem>

          {/* Privacy note */}
          <StaggerItem
            as="p"
            intensity="subtle"
            className="mt-4 font-inter text-[10px] leading-[1.8] text-ivory/40"
          >
            {journal.privacy}
          </StaggerItem>

          {/* Decorative detail */}
          <StaggerItem intensity="subtle" direction="none" className="mt-7 flex items-center gap-4">
            <span className="h-px w-9 bg-champagne/45" />

            <span className="font-inter text-[9px] uppercase tracking-[0.2em] text-ivory/35">
              {journal.footer}
            </span>
          </StaggerItem>
        </StaggerReveal>
      </div>
    </section>
  )
}
