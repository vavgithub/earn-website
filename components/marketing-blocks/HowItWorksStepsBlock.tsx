import Link from 'next/link'
import type { CSSProperties } from 'react'
import { PortableText, type PortableTextBlock } from '@portabletext/react'
import { getHowItWorksStepsPortableComponents } from '@/components/blocks/howItWorksStepsPortableText'
import {
  LinkRuleChevron,
  linkRuleAnchorClassName,
  linkRuleWrapperClassName,
} from '@/components/ui/Button'
import { TEXT_COLOR_HEX, textColorStyle, type TextColorValue } from '@/lib/cmsTextColor'
import { textSizeBodyClass, type TextSizeValue } from '@/lib/cmsTextSize'
import styles from './HowItWorksStepsBlock.module.css'
import type { NestedRichTextRowSettings } from '@/lib/nestedRichTextRow'
import { parseBlockContentAlignment, type BlockContentAlignment } from '@/lib/blockContentAlignment'

export type HowItWorksStep = {
  title: string
  content: PortableTextBlock[]
} & NestedRichTextRowSettings

export type HowItWorksFooterLink = {
  label: string
  href: string
}

type HowItWorksStepsBlockProps = {
  heading: string
  headingColor?: TextColorValue
  intro?: string
  introColor?: TextColorValue
  introTextSize?: TextSizeValue
  steps: HowItWorksStep[]
  footerLink?: HowItWorksFooterLink | null
  alignment?: BlockContentAlignment
  markerColor?: TextColorValue
  markerSize?: TextSizeValue
}

const MARKER_SIZE_CLASS: Record<TextSizeValue, string> = {
  '60': styles.size60,
  '52': styles.size52,
  '48': styles.size48,
  '40': styles.size40,
  '36': styles.size36,
  '32': styles.size32,
  '28': styles.size28,
  lg: styles.sizeLg,
  md: styles.sizeMd,
  sm: styles.sizeSm,
  '18': styles.size18,
  '14': styles.size14,
  xs: styles.sizeXs,
}

const MARKER_DIAMETER: Record<TextSizeValue, string> = {
  '60': '9.375rem',
  '52': '8.125rem',
  '48': '7.5rem',
  '40': '6.25rem',
  '36': '5.625rem',
  '32': '5rem',
  '28': '4.375rem',
  lg: '3.75rem',
  md: '3.125rem',
  sm: '2.5rem',
  '18': '2.8125rem',
  '14': '2.1875rem',
  xs: '1.875rem',
}

function numberOnFill(fill: string): string {
  const hex = fill.slice(1)
  const red = Number.parseInt(hex.slice(0, 2), 16)
  const green = Number.parseInt(hex.slice(2, 4), 16)
  const blue = Number.parseInt(hex.slice(4, 6), 16)
  const luminance = (0.2126 * red + 0.7152 * green + 0.0722 * blue) / 255
  return luminance > 0.55 ? TEXT_COLOR_HEX.darkSlate : TEXT_COLOR_HEX.offWhite
}

export function HowItWorksStepsBlock({
  heading,
  headingColor = 'yellow',
  intro,
  introColor = 'offWhite',
  introTextSize = 'md',
  steps,
  footerLink,
  alignment = 'left',
  markerColor,
  markerSize,
}: HowItWorksStepsBlockProps) {
  const isCenter = parseBlockContentAlignment(alignment) === 'center'
  const headingAlign = isCenter ? 'text-center' : 'text-left'
  const markerStyle: CSSProperties | undefined = markerColor
    ? {
        backgroundColor: TEXT_COLOR_HEX[markerColor],
        color: numberOnFill(TEXT_COLOR_HEX[markerColor]),
      }
    : undefined
  const bodyIndent = isCenter ? '' : markerSize ? styles.aligned : 'pl-[76px]'
  const rootStyle: CSSProperties | undefined = markerSize
    ? ({ ['--step-marker']: MARKER_DIAMETER[markerSize] } as CSSProperties)
    : undefined

  return (
    <div style={rootStyle}>
      <h2
        className={`m-0 pb-12 font-plex-sans text-[32px] font-medium leading-10 ${headingAlign}`}
        style={textColorStyle(headingColor, 'yellow')}
      >
        {heading}
      </h2>

      <div className="flex flex-col gap-6">
        {intro?.trim() ? (
          <p
            className={`m-0 font-inter font-normal ${textSizeBodyClass(introTextSize, 'md')}`}
            style={textColorStyle(introColor, 'offWhite')}
          >
            {intro}
          </p>
        ) : null}

        <ol className="m-0 flex list-none flex-col p-0">
          {steps.map((step, index) => {
            const stepComponents = getHowItWorksStepsPortableComponents(
              step.textSize,
              step.linkColor,
              step.linksOpenInNewTab,
            )
            const isLastStep = index === steps.length - 1
            return (
              <li
                key={index}
                className={`flex flex-col gap-2.5 ${isLastStep ? '' : 'mb-12'}`}
              >
                <div className="flex items-center gap-4">
                  <span
                    className={`flex shrink-0 items-center justify-center rounded-full font-plex-sans font-normal ${
                      markerSize
                        ? `${styles.sized} ${MARKER_SIZE_CLASS[markerSize]}`
                        : 'h-[60px] w-[60px] text-2xl leading-[26px]'
                    } ${markerColor ? '' : 'bg-earn-orange text-earn-work'}`}
                    style={markerStyle}
                    aria-hidden
                  >
                    {index + 1}
                  </span>
                  <h3 className="m-0 font-plex-sans text-[26px] font-medium leading-8 text-inherit">
                    {step.title}
                  </h3>
                </div>
                <div
                  className={`font-inter [&>*:last-child]:mb-0 ${bodyIndent}`}
                  style={textColorStyle(step.textColor, 'offWhite')}
                >
                  <PortableText value={step.content} components={stepComponents} />
                </div>
              </li>
            )
          })}
        </ol>

        {footerLink?.label && footerLink.href ? (
          <div className={`pt-6 ${isCenter ? 'text-center' : bodyIndent}`}>
            <div className={linkRuleWrapperClassName}>
              <Link href={footerLink.href} className={linkRuleAnchorClassName}>
                {footerLink.label}
                <LinkRuleChevron />
              </Link>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  )
}
