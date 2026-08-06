'use client'

import { useEffect, useRef, useState } from 'react'

import { cn } from '@/lib/utils'

/**
 * Révèle son contenu quand il entre dans le viewport.
 * `delay` permet d'échelonner plusieurs éléments d'une même rangée.
 */
export function Reveal({
  children,
  delay = 0,
  as: Tag = 'div',
  className,
}: {
  children: React.ReactNode
  delay?: number
  as?: 'div' | 'section' | 'li' | 'span'
  className?: string
}) {
  const ref = useRef<HTMLElement | null>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    if (typeof IntersectionObserver === 'undefined') {
      setVisible(true)
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          observer.disconnect()
        }
      },
      { rootMargin: '0px 0px -12% 0px', threshold: 0.1 },
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <Tag
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ref={ref as any}
      data-visible={visible}
      style={{ '--reveal-delay': `${delay}ms` } as React.CSSProperties}
      className={cn('reveal', className)}
    >
      {children}
    </Tag>
  )
}
