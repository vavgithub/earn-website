'use client'

import { HubSpotFormEmbed } from '@/components/website/HubSpotFormEmbed'
import { textColorStyle, type TextColorValue } from '@/lib/cmsTextColor'
import { textSizeBodyClass, type TextSizeValue } from '@/lib/cmsTextSize'
import { eyebrowTextClassName, eyebrowTextStyle } from '@/lib/eyebrowTypography'
import { parseBlockContentAlignment, type BlockContentAlignment } from '@/lib/blockContentAlignment'

export type HubSpotFormBlockProps = {
  eyebrow?: string
  eyebrowColor?: TextColorValue
  heading?: string
  headingColor?: TextColorValue
  description?: string
  descriptionColor?: TextColorValue
  descriptionTextSize?: TextSizeValue
  portalId: string
  formId: string
  region?: string
  alignment?: BlockContentAlignment
}

export function HubSpotFormBlock({
  eyebrow,
  eyebrowColor = 'coral',
  heading,
  headingColor = 'offWhite',
  description,
  descriptionColor = 'offWhite',
  descriptionTextSize = 'md',
  portalId,
  formId,
  region = 'na1',
  alignment = 'left',
}: HubSpotFormBlockProps) {
  const hasEyebrowOrHeading = Boolean(eyebrow?.trim() || heading?.trim())
  const isCenter = parseBlockContentAlignment(alignment) === 'center'
  const copyColumnClass = isCenter
    ? 'flex min-w-0 flex-1 flex-col items-center text-center'
    : 'flex min-w-0 flex-1 flex-col items-start text-left'

  return (
    <div className="flex flex-col items-stretch gap-[60px] lg:flex-row lg:items-start">
      <div className={copyColumnClass}>
        {hasEyebrowOrHeading ? (
          <div className="w-full max-w-[592px] pb-12">
            {eyebrow?.trim() ? (
              <p
                className={eyebrowTextClassName(eyebrowColor, { extra: 'pb-2' })}
                style={eyebrowTextStyle(eyebrowColor).style}
              >
                {eyebrow}
              </p>
            ) : null}
            {heading?.trim() ? (
              <h2
                className="m-0 font-mokoko text-[36px] font-normal leading-[42px] md:text-[48px] md:leading-[52px]"
                style={textColorStyle(headingColor, 'offWhite')}
              >
                {heading}
              </h2>
            ) : null}
          </div>
        ) : null}
        {description?.trim() ? (
          <p
            className={`m-0 max-w-[592px] font-inter font-normal ${textSizeBodyClass(descriptionTextSize, 'md')}`}
            style={textColorStyle(descriptionColor, 'offWhite')}
          >
            {description}
          </p>
        ) : null}
      </div>

      <div className="flex min-w-0 flex-1 flex-col pt-0 lg:pt-11">
        <HubSpotFormEmbed
          portalId={portalId}
          formId={formId}
          region={region}
          lazy
          className="w-full"
        />
      </div>
    </div>
  )
}
