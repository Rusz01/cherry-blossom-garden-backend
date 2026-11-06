/* eslint-disable @next/next/no-img-element -- admin graphics render outside next/image's loader context */
import React from 'react'

/** Compact Arthanova "A" mark used in the admin header. */
export const Icon: React.FC = () => (
  <span className="arth-icon">
    <img src="/brand/arthanova-mark-512.png" alt="Arthanova Studio" width={32} height={32} />
  </span>
)
