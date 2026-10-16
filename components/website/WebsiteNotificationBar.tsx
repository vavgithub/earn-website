'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { PortableText, type PortableTextBlock } from '@portabletext/react'
import { getNotificationBarPortableComponents } from '@/lib/notificationBarPortableText'
import { textColorStyle, type TextColorValue } from '@/lib/cmsTextColor'
import { parseLinksOpenInNewTab } from '@/lib/portableTextLink'
import { parseTextSize, type TextSizeValue } from '@/lib/cmsTextSize'
import {
  blockPaddingClassName,
  parseBlockPadding,
  type BlockPaddingValue,
} from '@/lib/blockPadding'
import { sectionBackgroundStyle } from '@/lib/sectionBackground'

const DISMISS_KEY = 'earn-notification-bar-dismissed'

export type WebsiteNotificationBarProps = {
  enabled?: boolean
  message?: PortableTextBlock[] | null
  textSize?: unknown
  textColor?: TextColorValue
  linkColor?: TextColorValue
  linksOpenInNewTab?: unknown
  paddingTop?: unknown
  paddingBottom?: unknown
  background?: unknown
}

function setNotificationBarHeight(px: number) {
  document.documentElement.style.setProperty('--notification-bar-height', `${px}px`)
}

export function WebsiteNotificationBar({
  enabled = false,
  message,
  textSize,
  textColor = 'offWhite',
  linkColor = 'offWhite',
  linksOpenInNewTab,
  paddingTop,
  paddingBottom,
  background,
}: WebsiteNotificationBarProps) {
  const barRef = useRef<HTMLDivElement>(null)
  const [sessionChecked, setSessionChecked] = useState(false)
  const [dismissed, setDismissed] = useState(false)

  const hasMessage = Array.isArray(message) && message.length > 0
  const shouldShow = enabled && hasMessage && sessionChecked && !dismissed

  useEffect(() => {
    setDismissed(sessionStorage.getItem(DISMISS_KEY) === '1')
    setSessionChecked(true)
  }, [])

  const measure = useCallback(() => {
    if (!shouldShow || !barRef.current) {
      setNotificationBarHeight(0)
      return
    }
    setNotificationBarHeight(barRef.current.offsetHeight)
  }, [shouldShow])

  useEffect(() => {
    measure()
    if (!shouldShow) return

    const el = barRef.current
    if (!el || typeof ResizeObserver === 'undefined') return

    const observer = new ResizeObserver(measure)
    observer.observe(el)
    window.addEventListener('resize', measure)
    return () => {
      observer.disconnect()
      window.removeEventListener('resize', measure)
    }
  }, [measure, shouldShow])

  useEffect(() => {
    if (!shouldShow) setNotificationBarHeight(0)
  }, [shouldShow])

  const handleDismiss = () => {
    sessionStorage.setItem(DISMISS_KEY, '1')
    setDismissed(true)
    setNotificationBarHeight(0)
  }

  if (!enabled || !hasMessage) return null
  if (!shouldShow) return null

  const padding = blockPaddingClassName({
    top: parseBlockPadding(paddingTop) ?? ('sm' as BlockPaddingValue),
    bottom: parseBlockPadding(paddingBottom) ?? ('sm' as BlockPaddingValue),
  })

  const size = parseTextSize(textSize, 'xs')
  const openInNewTab = parseLinksOpenInNewTab(linksOpenInNewTab)
  const closeStyle = textColorStyle(textColor, 'offWhite')

  return (
    <div
      ref={barRef}
      className="notification-bar-pinned w-full"
      style={sectionBackgroundStyle(background, 'coral')}
      role="region"
      aria-label="Site notification"
    >
      <div
        className={`relative mx-auto w-full max-w-content px-5 md:px-10 lg:px-[100px] ${padding}`}
      >
        <div className="px-12 text-center md:px-14">
          <PortableText
            value={message}
            components={getNotificationBarPortableComponents({
              textSize: size,
              textColor,
              linkColor,
              linksOpenInNewTab: openInNewTab,
            })}
          />
        </div>
        <button
          type="button"
          onClick={handleDismiss}
          className="absolute bottom-[4px] right-5 rounded-xl px-2 py-1.5 font-inter text-[10px] font-medium leading-[10px] md:right-10 lg:right-[100px]"
          style={{
            backgroundColor: 'rgba(71, 71, 71, 0.4)',
            ...closeStyle,
          }}
        >
          Close
        </button>
      </div>
    </div>
  )
}
