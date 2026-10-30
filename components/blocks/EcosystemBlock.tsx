import { EcosystemSection } from '@/components/home/EcosystemSection'
import type { EcosystemCard, EcosystemSlide } from '@/components/home/ecosystemData'
import { areaStyle, clean, imageUrl } from '@/components/blocks/homeBlockValue'

type CardDoc = {
  title?: string
  body?: string
  linkLabel?: string
  linkUrl?: string
  openInNewTab?: boolean
}
type GroupDoc = { heading?: string; cards?: CardDoc[] }
type SlideDoc = {
  part?: string
  image?: unknown
  tone?: string
  title?: string
  body?: string
  linkLabel?: string
  linkUrl?: string
  openInNewTab?: boolean
  leadTitle?: string
  leadBody?: string
  leadLinkLabel?: string
  leadLinkUrl?: string
  leadOpenInNewTab?: boolean
  groups?: GroupDoc[]
  trailingTitle?: string
  trailingBody?: string
  trailingLinkLabel?: string
  trailingLinkUrl?: string
  trailingOpenInNewTab?: boolean
}

export default function EcosystemBlock({ block }: { block: Record<string, unknown> }) {
  const slides = Array.isArray(block.slides) ? (block.slides as SlideDoc[]) : []
  const mapped = slides.flatMap((slide): EcosystemSlide[] => {
    const title = clean(slide.title)
    if (!title) return []
    const part = clean(slide.part)
    const id = part === 'midstream' || part === 'demand' ? part : 'production'
    const item: EcosystemSlide = {
      id,
      image: imageUrl(slide.image, 1400) || '',
      tone: clean(slide.tone) === 'mid' ? 'mid' : 'soft',
      title,
      body: clean(slide.body),
      cta: clean(slide.linkLabel),
      groups: (slide.groups ?? []).map((group) => ({
        heading: clean(group.heading),
        cards: (group.cards ?? []).flatMap((card): EcosystemCard[] => {
          const cardTitle = clean(card.title)
          if (!cardTitle) return []
          const next: EcosystemCard = { title: cardTitle, body: clean(card.body) }
          const label = clean(card.linkLabel)
          const href = clean(card.linkUrl)
          if (label) next.linkLabel = label
          if (href) next.href = href
          if (card.openInNewTab) next.openInNewTab = true
          return [next]
        }),
      })),
    }
    const ctaHref = clean(slide.linkUrl)
    if (ctaHref) item.ctaHref = ctaHref
    if (slide.openInNewTab) item.ctaOpen = true
    if (clean(slide.leadTitle)) {
      item.lead = { title: clean(slide.leadTitle), body: clean(slide.leadBody) }
      const label = clean(slide.leadLinkLabel)
      const href = clean(slide.leadLinkUrl)
      if (label) item.lead.linkLabel = label
      if (href) item.lead.href = href
      if (slide.leadOpenInNewTab) item.lead.openInNewTab = true
    }
    if (clean(slide.trailingTitle)) {
      item.trailing = { title: clean(slide.trailingTitle), body: clean(slide.trailingBody) }
      const label = clean(slide.trailingLinkLabel)
      const href = clean(slide.trailingLinkUrl)
      if (label) item.trailing.linkLabel = label
      if (href) item.trailing.href = href
      if (slide.trailingOpenInNewTab) item.trailing.openInNewTab = true
    }
    return [item]
  })

  return (
    <EcosystemSection
      eyebrow={clean(block.eyebrow)}
      heading={clean(block.heading)}
      slides={mapped}
      appearance={areaStyle(block)}
    />
  )
}
