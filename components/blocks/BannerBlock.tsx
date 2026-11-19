import { stegaClean } from 'next-sanity'
import type { PortableTextBlock } from '@portabletext/react'
import { HeroSection, type HeroBannerButton } from '@/components/home/HeroSection'
import { colorOf, sizeOf } from '@/components/blocks/homeBlockValue'
import { parseSectionHeadingLevel } from '@/lib/cmsSectionHeadingLevel'
import { parseTextColor, TEXT_COLOR_HEX } from '@/lib/cmsTextColor'
import { parseBlockPadding } from '@/lib/blockPadding'
import { sectionBackgroundStyle } from '@/lib/sectionBackground'
import { SECTION_BACKGROUND_TOKENS, type SectionBackgroundValue } from '@/lib/sectionBackgroundTokens'
import { dataset, projectId } from '@/sanity/env'
import { urlForImage } from '@/sanity/lib/image'

const BUTTON_MODULE_SIZE: Record<string, string> = {
  'button-md': '1.125rem',
  'button-lg': '1.25rem',
  'button-xl': '1.5rem',
}

function buttonFontSize(value: unknown) {
  const key = clean(value)
  return BUTTON_MODULE_SIZE[key] ?? sizeOf(value)
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

function fileUrl(ref: string) {
  const match = ref.match(/^file-(.+)-([a-z0-9]+)$/i)
  if (!match || !projectId || !dataset) return undefined
  return `https://cdn.sanity.io/files/${projectId}/${dataset}/${match[1]}.${match[2]}`
}

function copyFill(value: unknown, opacity: number) {
  const key = stegaClean(typeof value === 'string' ? value : '') as SectionBackgroundValue
  const token = key ? SECTION_BACKGROUND_TOKENS[key] : undefined
  if (!token) return undefined
  const hex = token.hex
  const red = Number.parseInt(hex.slice(1, 3), 16)
  const green = Number.parseInt(hex.slice(3, 5), 16)
  const blue = Number.parseInt(hex.slice(5, 7), 16)
  return `rgb(${red} ${green} ${blue} / ${opacity})`
}

export default function BannerBlock({ block }: { block: Record<string, unknown> }) {
  const backgroundMode = clean(block.backgroundMode)
  const mode = backgroundMode === 'color' || backgroundMode === 'video' ? backgroundMode : 'image'
  const image = block.image as { asset?: unknown } | undefined
  const imageRef = (image?.asset as { _ref?: string } | undefined)?._ref ?? ''
  const imageBuilder = image?.asset ? urlForImage(image) : undefined
  const imageSrc = imageBuilder
    ? imageRef.endsWith('-svg')
      ? imageBuilder.url()
      : imageBuilder.width(1920).quality(70).url()
    : undefined
  const videoRef = ((block.video as { asset?: { _ref?: string } } | undefined)?.asset?._ref ?? '')
  const videoSrc = mode === 'video' ? fileUrl(videoRef) : undefined
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
      kind: buttonKind === 'textLink' ? 'textLink' : buttonKind === 'ghost' ? 'ghost' : 'button',
      fill: TEXT_COLOR_HEX[buttonColor],
      ink: LIGHT_FILLS.has(buttonColor) ? 'var(--color-earn-button-ink)' : 'var(--color-earn-paper)',
      size: buttonFontSize(block.buttonSize),
      openInNewTab: block.openInNewTab === true,
    }
  }

  const fontColor = parseTextColor(block.fontColor, 'offWhite')
  const align = clean(block.copyAlign)
  const bodyIsRich = Array.isArray(block.body)

  return (
    <HeroSection
      headingId={typeof block._key === "string" ? `banner-${block._key}` : "banner-heading"}
      heading={clean(block.heading)}
      headingLevel={parseSectionHeadingLevel(block.headingLevel, 'h1')}
      body={bodyIsRich ? undefined : clean(block.body)}
      richBody={bodyIsRich ? (block.body as PortableTextBlock[]) : undefined}
      showImage={mode === 'video' ? Boolean(videoSrc) : mode === 'image' && Boolean(imageSrc)}
      imageSrc={mode === 'image' ? imageSrc : undefined}
      videoSrc={videoSrc}
      imageAlt={clean(block.imageAlt)}
      backgroundColor={
        mode === 'color' ? sectionBackgroundStyle(block.sectionBackground, 'medCoolGrey').backgroundColor : undefined
      }
      imageFit={clean(block.imageFit) === 'noResize' ? 'none' : 'cover'}
      imagePosition={clean(block.imagePosition) || 'center'}
      copyOpacity={opacity}
      copyFill={copyFill(block.copyBackground, opacity)}
      copyAlign={align === 'center' || align === 'right' ? align : 'left'}
      fitContent={clean(block.heightMode) === 'content'}
      textColor={TEXT_COLOR_HEX[fontColor]}
      headingSize={fontSize === 'default' ? undefined : sizeOf(fontSize)}
      bodyColor={colorOf(block.bodyColor)}
      bodySize={sizeOf(block.bodySize)}
      button={button}
      paddingTop={paddingCss(block.paddingTop)}
      paddingBottom={paddingCss(block.paddingBottom)}
      copyPaddingTop={paddingCss(block.copyPaddingTop)}
      copyPaddingBottom={paddingCss(block.copyPaddingBottom)}
    />
  )
}
