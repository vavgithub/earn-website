import Link from 'next/link'
import { PortableText, type PortableTextBlock } from '@portabletext/react'
import { getHowItWorksStepsPortableComponents } from '@/components/blocks/howItWorksStepsPortableText'
import {
  LinkRuleChevron,
  linkRuleAnchorClassName,
  linkRuleWrapperClassName,
} from '@/components/ui/Button'
import { textColorStyle, type TextColorValue } from '@/lib/cmsTextColor'
import { textSizeBodyClass, type TextSizeValue } from '@/lib/cmsTextSize'
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
}: HowItWorksStepsBlockProps) {
  const isCenter = parseBlockContentAlignment(alignment) === 'center'
  const headingAlign = isCenter ? 'text-center' : 'text-left'

  return (
    <div>
      <h2
        className={`m-0 pb-12 font-mokoko text-[32px] font-medium leading-10 ${headingAlign}`}
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
                    className="flex h-[60px] w-[60px] shrink-0 items-center justify-center rounded-full bg-brand-red font-mokoko text-2xl font-normal leading-[26px] text-[#FDFDFB]"
                    aria-hidden
                  >
                    {index + 1}
                  </span>
                  <h3 className="m-0 font-mokoko text-[26px] font-medium leading-8 text-inherit">
                    {step.title}
                  </h3>
                </div>
                <div
                  className={`font-inter [&>*:last-child]:mb-0 ${isCenter ? '' : 'pl-[76px]'}`}
                  style={textColorStyle(step.textColor, 'offWhite')}
                >
                  <PortableText value={step.content} components={stepComponents} />
                </div>
              </li>
            )
          })}
        </ol>

        {footerLink?.label && footerLink.href ? (
          <div className={`pt-6 ${isCenter ? 'text-center' : 'pl-[76px]'}`}>
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
