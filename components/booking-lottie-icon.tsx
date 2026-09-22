'use client'

import { Lottie } from 'lottie-react'

type BookingLottieIconProps = {
  tone?: 'forest' | 'gold' | 'success'
  className?: string
}

const tones = {
  forest: [0.086, 0.22, 0.118],
  gold: [0.773, 0.627, 0.349],
  success: [0.063, 0.451, 0.263],
} as const

function createPulseAnimation(color: readonly number[]) {
  return {
    v: '5.7.4',
    fr: 30,
    ip: 0,
    op: 60,
    w: 96,
    h: 96,
    nm: 'MBIYO booking status',
    ddd: 0,
    assets: [],
    layers: [
      {
        ddd: 0,
        ind: 1,
        ty: 4,
        nm: 'Booking pulse',
        sr: 1,
        ks: {
          o: { a: 1, k: [{ t: 0, s: [20] }, { t: 30, s: [90] }, { t: 60, s: [20] }] },
          r: { a: 0, k: 0 },
          p: { a: 0, k: [48, 48, 0] },
          a: { a: 0, k: [0, 0, 0] },
          s: { a: 1, k: [{ t: 0, s: [80, 80, 100] }, { t: 30, s: [112, 112, 100] }, { t: 60, s: [80, 80, 100] }] },
        },
        shapes: [
          { ty: 'el', d: 1, s: { a: 0, k: [68, 68] }, p: { a: 0, k: [0, 0] }, nm: 'Outer ring' },
          { ty: 'fl', c: { a: 0, k: [...color, 1] }, o: { a: 0, k: 100 }, r: 1, bm: 0, nm: 'Fill' },
          { ty: 'tr', p: { a: 0, k: [0, 0] }, a: { a: 0, k: [0, 0] }, s: { a: 0, k: [100, 100] }, r: { a: 0, k: 0 }, o: { a: 0, k: 100 }, sk: { a: 0, k: 0 }, sa: { a: 0, k: 0 }, nm: 'Transform' },
        ],
        ip: 0,
        op: 60,
        st: 0,
        bm: 0,
      },
    ],
  }
}

export function BookingLottieIcon({ tone = 'forest', className }: BookingLottieIconProps) {
  return (
    <Lottie
      src={createPulseAnimation(tones[tone])}
      loop
      aria-hidden="true"
      className={className}
    />
  )
}
