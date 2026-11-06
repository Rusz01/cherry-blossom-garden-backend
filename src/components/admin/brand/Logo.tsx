/* eslint-disable @next/next/no-img-element -- admin graphics render outside next/image's loader context */
import React from 'react'

/**
 * Full Arthanova Studio wordmark, used on the login and authentication screens.
 * Both variants are rendered and CSS shows the right one for the active theme,
 * so the official artwork is never recoloured.
 */
export const Logo: React.FC = () => (
  <span className="arth-logo">
    <img
      className="arth-logo__img arth-logo__img--light"
      src="/brand/arthanova-logo.png"
      alt="Arthanova Studio"
      width={1393}
      height={342}
    />
    <img
      className="arth-logo__img arth-logo__img--dark"
      src="/brand/arthanova-logo-white.png"
      alt=""
      aria-hidden="true"
      width={1390}
      height={328}
    />
  </span>
)
