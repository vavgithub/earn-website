import { createColoredPortableComponents } from '@/lib/createColoredPortableText'
import type { TextColorValue } from '@/lib/cmsTextColor'
import type { TextSizeValue } from '@/lib/cmsTextSize'

/** Intro below section heading on light page backgrounds. */
export const blockSectionIntroPortableComponents = createColoredPortableComponents({
  bodyColor: 'blackGreen',
})

export function getBlockSectionIntroPortableComponents(
  color: TextColorValue = 'blackGreen',
  size: TextSizeValue = 'md',
  linkColor: TextColorValue = 'green',
  linksOpenInNewTab = false,
) {
  return createColoredPortableComponents({
    bodyColor: color,
    bodySize: size,
    linkColor,
    linksOpenInNewTab,
  })
}
