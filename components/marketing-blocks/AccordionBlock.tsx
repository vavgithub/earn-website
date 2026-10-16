'use client'

import { useId, useState, type CSSProperties } from 'react'
import { parseBlockContentAlignment, type BlockContentAlignment } from '@/lib/blockContentAlignment'
import type { PortableTextBlock } from '@portabletext/react'
import { BlockSectionHeader } from '@/components/blocks/BlockSectionHeader'
import { textColorStyle, type TextColorValue } from '@/lib/cmsTextColor'
import type { TextSizeValue } from '@/lib/cmsTextSize'

export type AccordionBlockItem = {
  question: string
  answer: string
}

type AccordionBlockProps = {
  heading?: string
  intro?: PortableTextBlock[]
  headingColor?: TextColorValue
  introColor?: TextColorValue
  introTextSize?: TextSizeValue
  introLinkColor?: TextColorValue
  introOnDark?: boolean
  questionColor?: TextColorValue
  alignment?: BlockContentAlignment
  items: AccordionBlockItem[]
  className?: string
}

function FaqChevron({ open, colorStyle }: { open: boolean; colorStyle: CSSProperties }) {
  return (
    <span
      className={`inline-flex h-7 w-7 shrink-0 items-center justify-center transition-transform duration-200 ease-out ${
        open ? '' : '-rotate-90'
      }`}
      style={colorStyle}
      aria-hidden
    >
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none" className="h-7 w-7">
        <path
          d="M6 11L14 19L22 11"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  )
}

export function AccordionBlock({
  heading,
  intro,
  headingColor = 'coral',
  introColor = 'offWhite',
  introTextSize = 'md',
  introLinkColor = 'offWhite',
  introOnDark = true,
  questionColor = 'lightGreen',
  alignment = 'left',
  items,
  className = '',
}: AccordionBlockProps) {
  const baseId = useId()
  const [openIndex, setOpenIndex] = useState<number | null>(items.length > 0 ? 0 : null)
  const questionStyle = textColorStyle(questionColor, 'lightGreen')
  const isCenter = parseBlockContentAlignment(alignment) === 'center'
  const questionRowClass = isCenter
    ? 'inline-flex w-full cursor-pointer items-center justify-center gap-1 border-0 bg-transparent p-0 text-center'
    : 'inline-flex w-full cursor-pointer items-center gap-1 border-0 bg-transparent p-0 text-left'

  return (
    <div className={className.trim()}>
      <BlockSectionHeader
        heading={heading}
        intro={intro}
        headingColor={headingColor}
        introColor={introColor}
        introTextSize={introTextSize}
        introLinkColor={introLinkColor}
        introOnDark={introOnDark}
        introMarginClass="mb-[60px]"
      />

      <ul className="m-0 flex list-none flex-col gap-[60px] p-0">
        {items.map((item, index) => {
          const isOpen = openIndex === index
          const panelId = `${baseId}-panel-${index}`
          const headerId = `${baseId}-header-${index}`
          const answer = (
            <p className="m-0 font-inter text-xl font-normal leading-8 text-inherit">
              {item.answer}
            </p>
          )

          return (
            <li key={index} className="flex flex-col gap-4">
              <h3 className="m-0">
                <button
                  type="button"
                  id={headerId}
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                  className={questionRowClass}
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                >
                  <FaqChevron open={isOpen} colorStyle={questionStyle} />
                  <span
                    className="min-w-0 flex-1 font-mokoko text-2xl font-medium leading-6"
                    style={questionStyle}
                  >
                    {item.question}
                  </span>
                </button>
              </h3>
              <div
                id={panelId}
                role="region"
                aria-labelledby={headerId}
                hidden={!isOpen}
                className={isOpen ? 'pl-7' : undefined}
              >
                {isOpen ? answer : null}
              </div>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
