import { stegaClean } from 'next-sanity'
import { HeroSection, type HeroBannerButton } from '@/components/home/HeroSection'
import { parseTextColor, TEXT_COLOR_HEX } from '@/lib/cmsTextColor'
import { parseBlockPadding } from '@/lib/blockPadding'
import { sectionBackgroundStyle } from '@/lib/sectionBackground'
import { urlForImage } from '@/sanity/lib/image'

const HEADING_SIZE: Record<string, string | undefined> = {
  default: undefined,
  lg: '1.5rem',
  md: '1.25rem',
  sm: '1rem',
  xs: '0.75rem',
}

const PADDING: Record<string, string> = {
  none: '0px',
  xs: '12px',
  sm: '24px',
  md: '48px',
  lg: '80px',
  xl: '160px',
  xxl: '200px',
}

const LIGHT_FILLS = new Set(['brightYellow', 'yellow', 'offWhite', 'lightGrey'])

function clean(value: unknown) {
  return stegaClean(typeof value === 'string' ? value : String(value ?? '')).trim()
}

function paddingCss(value: unknown) {
  const key = parseBlockPadding(value)
  return key ? PADDING[key] : undefined
}

export default function BannerBlock({ block }: { block: Record<string, unknown> }) {
  const backgroundMode = clean(block.backgroundMode) === 'color' ? 'color' : 'image'
  const image = block.image as { asset?: unknown } | undefined
  const imageRef = (image?.asset as { _ref?: string } | undefined)?._ref ?? ''
  const imageBuilder = image?.asset ? urlForImage(image) : undefined
  const imageSrc = imageBuilder
    ? imageRef.endsWith('-svg')
      ? imageBuilder.url()
      : imageBuilder.width(1920).quality(70).url()
    : undefined
  const fontSize = clean(block.fontSize) || 'default'
  const opacityRaw = typeof block.copyOpacity === 'number' ? block.copyOpacity : 40
  const opacity = Math.min(100, Math.max(0, opacityRaw)) / 100
  const buttonKind = clean(block.buttonKind)
  const buttonLabel = clean(block.buttonLabel)
  const buttonUrl = clean(block.buttonUrl)
  const buttonColor = parseTextColor(block.buttonColor, 'brightYellow')
  let button: HeroBannerButton | null = null
  if (buttonKind !== 'none' && buttonLabel && buttonUrl) {
    button = {
      label: buttonLabel,
      href: buttonUrl,
      kind: buttonKind === 'textLink' ? 'textLink' : 'button',
      fill: TEXT_COLOR_HEX[buttonColor],
      ink: LIGHT_FILLS.has(buttonColor) ? 'var(--color-earn-button-ink)' : 'var(--color-earn-paper)',
      openInNewTab: block.openInNewTab === true,
    }
  }

  const fontColor = parseTextColor(block.fontColor, 'offWhite')

  return (
    <HeroSection
      headingId={typeof block._key === "string" ? `banner-${block._key}` : "banner-heading"}
      heading={clean(block.heading)}
      body={clean(block.body)}
      showImage={backgroundMode === 'image' && Boolean(imageSrc)}
      imageSrc={imageSrc}
      imageAlt={clean(block.imageAlt)}
      backgroundColor={
        backgroundMode === 'color' ? sectionBackgroundStyle(block.sectionBackground, 'medCoolGrey').backgroundColor : undefined
      }
      imageFit={clean(block.imageFit) === 'noResize' ? 'none' : 'cover'}
      imagePosition={clean(block.imagePosition) || 'center'}
      copyOpacity={opacity}
      textColor={TEXT_COLOR_HEX[fontColor]}
      headingSize={HEADING_SIZE[fontSize]}
      button={button}
      paddingTop={paddingCss(block.paddingTop)}
      paddingBottom={paddingCss(block.paddingBottom)}
      copyPaddingTop={paddingCss(block.copyPaddingTop)}
      copyPaddingBottom={paddingCss(block.copyPaddingBottom)}
    />
  )
}
