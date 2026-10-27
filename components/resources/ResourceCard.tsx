import { urlForImage } from '@/sanity/lib/image'
import { normalizeResourceModalLayout, useMethodologyCardImage } from '@/lib/resourceModalLayout'
import type { ResourceItemRecord } from '@/types/resources'

type Props = {
  item: ResourceItemRecord
  wideCard?: boolean
}

export function ResourceCard({ item, wideCard }: Props) {
  const modalId = item.modalIdValue
  const imageUrl = item.cardImage?.asset ? urlForImage(item.cardImage)?.url() : null
  const layout = normalizeResourceModalLayout(item.modalLayout, item.hubspotFormKind)
  const isMethodologyLayout = useMethodologyCardImage(layout)

  return (
    <div
      data-modal-hash={modalId}
      className={`group flex flex-col sm:flex-row gap-6 lg:gap-9 pb-[60px] md:pb-[10px] cursor-pointer${wideCard ? ' lg:min-w-[580px]' : ''}`}
    >
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
                ? 'block w-[110%] h-full object-cover sm:-ml-0.5'
                : 'block w-[138px] h-[180px] object-cover'
            }
          />
        ) : null}
      </div>
      <div className="flex flex-col">
        <div className="flex flex-col gap-4 lg:gap-6 text-left">
          <h3 className="group-hover:text-earn-gray-700 font-medium text-earn-work font-plex-sans text-base md:text-lg">
            {item.cardTitle}
          </h3>
          <p className="group-hover:text-earn-gray-700 text-sm md:text-[16px] font-normal font-inter">
            {item.cardExcerpt}
          </p>
        </div>
        <div className="text-sm md:text-base group-hover:text-earn-work text-brand-red hover:underline inline-flex items-center pt-4 lg:pt-6 justify-start">
          {item.cardCtaLabel || 'Preview >'}
        </div>
      </div>
    </div>
  )
}
