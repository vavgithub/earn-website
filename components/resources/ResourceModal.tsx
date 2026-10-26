import { urlForImage } from '@/sanity/lib/image'
import { ResourceModalPortableText } from '@/lib/resourceModalPortableText'
import { parseNestedRichTextRow } from '@/lib/nestedRichTextRow'
import { textColorStyle } from '@/lib/cmsTextColor'
import {
  isCaseStudyModalLayout,
  isGuidesModalLayout,
  isMethodologyModalLayout,
  normalizeResourceModalLayout,
} from '@/lib/resourceModalLayout'
import { resolveResourceTableOfContents } from '@/lib/parseResourceTableOfContents'
import type { ResourceItemRecord } from '@/types/resources'

function ModalCloseButton() {
  return (
    <button
      type="button"
      data-close-modal=""
      className="focus:outline-none opacity-80 hover:opacity-100 cursor-pointer"
    >
      <svg width={20} height={20} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M15 5L5 15"
          stroke="#99A1AF"
          strokeWidth="1.66667"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M5 5L15 15"
          stroke="#99A1AF"
          strokeWidth="1.66667"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  )
}

function ModalDocumentHeader() {
  return (
    <div className="flex px-6 items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="flex flex-col">
          <h3 className="text-xl font-mokoko text-[#142d21]">Document Preview</h3>
          <p className="font-inter text-base text-[#6a7282]">Limited preview available</p>
        </div>
      </div>
      <ModalCloseButton />
    </div>
  )
}

function ModalTableOfContents({
  entries,
}: {
  entries: { label: string; page?: string }[]
}) {
  if (!entries?.length) return null
  return (
    <div className="px-4 sm:px-16">
      <div className="border-t border-[#D1D5DC] py-[60px]">
        <h3 className="font-mokoko text-[20px] md:text-[26px] font-regular text-[#141d19] leading-[1.2]">
          Contents
        </h3>
        <ol className="font-inter text-sm text-[#292929] list-decimal list-inside flex flex-col gap-3 mt-6">
          {entries.map((entry, i) => (
            <li
              key={`${entry.label}-${i}`}
              className="grid grid-cols-[1fr_auto]"
            >
              <span>{entry.label}</span>
              {entry.page ? <span className="text-right">{entry.page}</span> : null}
            </li>
          ))}
        </ol>
      </div>
    </div>
  )
}

function MethodologyFooter({ item }: { item: ResourceItemRecord }) {
  const modalId = item.modalIdValue
  const formTargetId = `hubspot-form-methodology-${modalId}`

  return (
    <div className="bg-brand-red">
      <div className="py-[60px] px-4 sm:px-16">
        <div className="non-auth-only-content text-center">
          <h3 className="font-mokoko text-[20px] md:text-[26px] font-regular text-[#FFFFFF] leading-[1.2] mb-[10px]">
            {item.footerHeading || 'Continue Reading'}
          </h3>
          {item.footerIntro ? (
            <p className="font-inter text-center text-base text-[#FFFFFF] font-normal mb-6">
              {item.footerIntro}
            </p>
          ) : null}
          {item.loginStepLabel ? (
            <p className="text-white text-center font-inter text-[16px] font-semibold leading-[20px] pb-1 mb-4 opacity-60 border-b border-[#EEA08E] max-w-[200px] mx-auto">
              {item.loginStepLabel}
            </p>
          ) : null}
          <p className="non-auth-text font-inter text-center text-base text-[#FFFFFF] font-semibold mb-6">
            {item.loginPrompt ||
              'Create an account or log in to access the full methodology document.'}
          </p>
          <div className="flex flex-wrap gap-4 justify-center mx-auto">
            <a
              href="#"
              data-id={modalId}
              target="_blank"
              className="create-account flex items-center justify-center h-9 bg-[#fdfdfb] text-[#142d21] hover:bg-[#ff7e6c] hover:text-[#fdfdfb] transition-colors duration-200 px-6 py-1 rounded-full"
            >
              Create an account
            </a>
            <a
              href="#"
              data-id={modalId}
              target="_blank"
              className="login flex items-center justify-center h-9 border border-[#fdfdfb] hover:border-[#ff7e6c] text-[#fdfdfb] px-6 py-1 rounded-full"
            >
              Log In
            </a>
          </div>
        </div>
        <div className="auth-only-content hidden">
          <div className="methodology-auth-form-step flex flex-col lg:flex-row gap-8 lg:gap-10 lg:items-start">
            <div className="w-full lg:max-w-[380px] flex-shrink-0">
              <h3 className="font-mokoko text-[20px] md:text-[26px] font-regular text-[#FFFFFF] leading-[1.2] mb-6">
                {item.footerHeading || 'Continue Reading'}
              </h3>
              {item.footerIntro ? (
                <p className="font-inter text-base text-[#FFFFFF] font-normal mb-4">
                  {item.footerIntro}
                </p>
              ) : null}
              {item.footerFormPrompt ? (
                <p className="font-inter text-base text-[#FFFFFF] font-normal">
                  {item.footerFormPrompt}
                </p>
              ) : null}
            </div>
            <div className="flex-1 min-w-0 w-full max-w-[600px] mx-auto lg:mx-0 rounded-md bg-black/20 backdrop-blur-sm border border-white/30 min-h-[470px] p-4 sm:p-6">
              <div id={formTargetId} className="w-full min-h-[420px]" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function StandardFormFooter({ item }: { item: ResourceItemRecord }) {
  const modalId = item.modalIdValue
  let formTargetId = `hubspot-form-${modalId}`
  if (item.hubspotFormKind === 'governance') formTargetId = 'hubspot-form-governance'
  if (item.hubspotFormKind === 'tallgrass') formTargetId = 'hubspot-form-tallgrass'
  if (item.hubspotFormKind === 'guide') formTargetId = `hubspot-form-${modalId}`

  const formWrapClass =
    item.hubspotFormKind === 'guide'
      ? 'w-[376px] max-w-full mx-auto lg:mx-0 p-4 sm:p-6'
      : item.hubspotFormKind === 'tallgrass'
        ? 'max-w-[600px]'
        : ''

  return (
    <div className="bg-brand-red py-[60px]">
      <div className="px-4 sm:px-16 flex flex-col lg:flex-row gap-3 md:gap-10">
        <div className="w-full h-full md:max-w-[380px] flex-shrink-0">
          <h3 className="font-mokoko text-[20px] md:text-[26px] font-regular text-[#FFFFFF] leading-[1.2] mb-6">
            {item.footerHeading || 'Continue Reading'}
          </h3>
          {item.footerIntro ? (
            <p className="font-inter text-base text-[#FFFFFF] font-normal mb-4">{item.footerIntro}</p>
          ) : null}
          {item.footerFormPrompt ? (
            <p className="font-inter text-base text-[#FFFFFF] font-normal mb-4">{item.footerFormPrompt}</p>
          ) : null}
        </div>
        <div className={formWrapClass || undefined}>
          <div id={formTargetId} className={formWrapClass ? 'w-full h-full' : undefined} />
        </div>
      </div>
    </div>
  )
}

function modalHeroIntroOptions(item: ResourceItemRecord) {
  return parseNestedRichTextRow(item as Record<string, unknown>, 'modalHeroIntro', {
    linkColor: 'yellow',
  })
}

function modalSectionIntroOptions(section: Record<string, unknown>) {
  return parseNestedRichTextRow(section, 'content', { linkColor: 'yellow' })
}

export function ResourceModal({ item }: { item: ResourceItemRecord }) {
  const modalId = item.modalIdValue
  const layout = normalizeResourceModalLayout(item.modalLayout, item.hubspotFormKind)
  const heroImageUrl = item.modalHeroImage?.asset ? urlForImage(item.modalHeroImage)?.url() : null
  const secondaryImageUrl = item.caseStudySecondaryImage?.asset
    ? urlForImage(item.caseStudySecondaryImage)?.url()
    : null
  const isCaseStudy = isCaseStudyModalLayout(layout)
  const isMethodology = isMethodologyModalLayout(layout) || Boolean(item.requiresLoginBeforeForm)
  const isGuides = isGuidesModalLayout(layout)
  const heroImageWide = layout === 'methodology'
  const tableOfContents = resolveResourceTableOfContents(item)

  return (
    <dialog
      id={modalId}
      className="dialog-with-form fixed inset-0 m-auto rounded-lg pt-4 w-[90vw] max-h-[80vh] max-w-[960px] hide-scrollbar backdrop:bg-black/40"
    >
      <ModalDocumentHeader />

      {isCaseStudy ? (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-9 px-4 sm:px-16 pt-[60px] pb-8 lg:pb-[60px]">
            <div className="order-2 lg:order-1">
              <h2 className="text-[#141D19] font-mokoko text-[26px] font-medium leading-[32px]">
                {item.modalHeroTitle}
              </h2>
              {item.modalHeroSubtitle ? (
                <p className="text-[#141D19] font-inter text-[24px] font-bold leading-[28px] mt-2">
                  {item.modalHeroSubtitle}
                </p>
              ) : null}
              {item.modalHeroIntro?.length ? (
                <div
                  className="font-inter text-[20px] font-normal leading-[28px] mt-4"
                  style={textColorStyle(modalHeroIntroOptions(item).textColor, 'darkSlate')}
                >
                  <ResourceModalPortableText
                    value={item.modalHeroIntro}
                    options={modalHeroIntroOptions(item)}
                  />
                </div>
              ) : null}
            </div>
            <div className="order-1 lg:order-2 overflow-hidden">
              {heroImageUrl ? (
                <img
                  src={heroImageUrl}
                  alt={item.modalHeroTitle}
                  className="block w-full h-full object-cover min-h-[300px]"
                />
              ) : null}
            </div>
          </div>
          {(secondaryImageUrl || item.caseStudySecondaryBody) && (
            <div className="px-4 sm:px-16 pb-[60px] flex flex-row gap-3 md:gap-10">
              {secondaryImageUrl ? (
                <div className="w-full h-full max-w-[120px] md:max-w-[380px] flex-shrink-0">
                  <img
                    src={secondaryImageUrl}
                    alt=""
                    className="block w-full h-full object-cover md:min-h-[300px]"
                  />
                </div>
              ) : null}
              {item.caseStudySecondaryBody ? (
                <div>
                  <p className="text-[#292929] font-inter text-base md:text-[20px] font-normal md:leading-[28px]">
                    {item.caseStudySecondaryBody}
                  </p>
                </div>
              ) : null}
            </div>
          )}
        </>
      ) : (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-y-[60px] md:gap-9 px-4 sm:px-16 py-[60px]">
            <div className="order-2 lg:order-1">
              <h2
                className={`font-mokoko text-[20px] md:text-[26px] text-[#141d19] leading-[1.2] mb-4 whitespace-pre-line${
                  isGuides && item.modalHeroEyebrow ? ' font-medium' : ' font-regular'
                }`}
              >
                {item.modalHeroTitle}
              </h2>
              {item.modalHeroEyebrow ? (
                <p className="text-[#141D19] font-Mokoko text-[16px] font-medium leading-[20px]">
                  {item.modalHeroEyebrow}
                </p>
              ) : null}
              {item.modalHeroSubtitle ? (
                <p className="font-inter mt-2 text-[#292929]">{item.modalHeroSubtitle}</p>
              ) : null}
              {item.modalHeroIntro?.length ? (
                <div
                  className="font-inter mt-6"
                  style={textColorStyle(modalHeroIntroOptions(item).textColor, 'darkSlate')}
                >
                  <ResourceModalPortableText
                    value={item.modalHeroIntro}
                    options={modalHeroIntroOptions(item)}
                  />
                </div>
              ) : null}
            </div>
            <div className={`order-1 lg:order-2${heroImageWide ? ' overflow-hidden' : ''}`}>
              {heroImageUrl ? (
                <img
                  src={heroImageUrl}
                  alt={item.modalHeroTitle}
                  className={
                    heroImageWide
                      ? 'block w-[110%] -ml-[2%] object-cover'
                      : 'w-full h-full object-cover'
                  }
                />
              ) : null}
            </div>
          </div>

          {item.modalSections?.map((section, i) =>
            section.heading || section.content?.length ? (
              <div key={i} className="px-4 sm:px-16 pb-[60px]">
                {section.heading ? (
                  <h3 className="font-mokoko text-[20px] md:text-[26px] font-regular text-[#141d19] leading-[1.2]">
                    {section.heading}
                  </h3>
                ) : null}
                <ResourceModalPortableText
                  value={section.content}
                  options={modalSectionIntroOptions(section as Record<string, unknown>)}
                />
              </div>
            ) : null,
          )}

          {tableOfContents.length ? <ModalTableOfContents entries={tableOfContents} /> : null}
        </>
      )}

      {isMethodology ? <MethodologyFooter item={item} /> : <StandardFormFooter item={item} />}
    </dialog>
  )
}
