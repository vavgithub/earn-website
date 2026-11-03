import { LinkText } from '@/components/home/LinkText'
import { urlForImage } from '@/sanity/lib/image'
import { normalizeResourceModalLayout, useMethodologyCardImage } from '@/lib/resourceModalLayout'
import type { ResourceItemRecord } from '@/types/resources'

type Props = {
  item: ResourceItemRecord
}

export function ResourceCard({ item }: Props) {
  const modalId = item.modalIdValue
  const imageUrl = item.cardImage?.asset ? urlForImage(item.cardImage)?.url() : null
  const layout = normalizeResourceModalLayout(item.modalLayout, item.hubspotFormKind)
  const isMethodologyLayout = useMethodologyCardImage(layout)
  const cardClassName =
    'group flex min-w-0 flex-col gap-6 border-b border-earn-slate pb-[60px] sm:flex-row lg:gap-9'
  const cardContent = (
    <>
      <div
        className={
          isMethodologyLayout
            ? 'w-34.5 h-44.75 shrink-0'
            : 'flex-shrink-0 w-[138px] h-[180px]'
        }
      >
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={item.cardImageAlt || item.cardTitle}
            className={
              isMethodologyLayout
                ? 'block h-full w-full object-cover'
                : 'block h-[180px] w-[138px] object-cover'
            }
          />
        ) : null}
      </div>
      <div className="flex min-w-0 flex-col">
        <div className="flex flex-col gap-4 lg:gap-6 text-left">
          <h3
            className={`font-outfit font-medium text-earn-white ${
              isMethodologyLayout ? 'text-lg leading-6' : 'text-resource-title'
            }`}
          >
            {item.cardTitle}
          </h3>
          <p className="text-earn-gray-400 text-sm md:text-base font-normal font-inter">
            {item.cardExcerpt}
          </p>
        </div>
        <div className="mt-4 inline-flex h-9 items-center justify-center self-start rounded-full border border-earn-gray-400 px-5 text-base text-earn-orange lg:mt-6">
          {isMethodologyLayout ? (
            <LinkText>{item.cardCtaLabel || 'Preview'}</LinkText>
          ) : (
            item.cardCtaLabel || 'Preview >'
          )}
        </div>
      </div>
    </>
  )

  if (item.externalUrl) {
    return (
      <a
        href={item.externalUrl}
        target="_blank"
        rel="noreferrer"
        className={cardClassName}
      >
        {cardContent}
      </a>
    )
  }

  return (
    <div
      data-modal-hash={modalId}
      className={`${cardClassName} cursor-pointer`}
    >
      {cardContent}
    </div>
  )
}
