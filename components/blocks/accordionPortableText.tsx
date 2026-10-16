import { createColoredPortableComponents } from '@/lib/createColoredPortableText'
import type { TextColorValue } from '@/lib/cmsTextColor'
import type { TextSizeValue } from '@/lib/cmsTextSize'
import type { PortableTextComponents } from '@portabletext/react'

/** Intro copy on accordion section (dark beige #5B5F53). */
export const accordionIntroPortableComponents = createColoredPortableComponents({
  bodyColor: 'offWhite',
  linkClassName: 'underline decoration-[#FDFDFB]/50 underline-offset-2',
})

export function getAccordionIntroPortableComponents(
  color: TextColorValue = 'offWhite',
  size: TextSizeValue = 'md',
  linkColor: TextColorValue = 'offWhite',
  linksOpenInNewTab = false,
): PortableTextComponents {
  return createColoredPortableComponents({
    bodyColor: color,
    bodySize: size,
    linkColor,
    linksOpenInNewTab,
  })
}
