import { HubSpotForm } from '@/components/website/HubSpotForm'
import { resolveHubspotFormConfig } from '@/lib/resourceHubspotConfig'
import type { ResourceHubSpotSettingsRecord, ResourceItemRecord } from '@/types/resources'

type Props = {
  items?: ResourceItemRecord[]
  hubspotSettings?: ResourceHubSpotSettingsRecord | null
}

/**
 * HubSpot embeds for resource modals — form IDs from Studio settings (with code fallback).
 * Hidden routing fields: methodology + guide only (not governance or case study).
 */
export function ResourcesHubSpotForms({ items = [], hubspotSettings }: Props) {
  const cmsForms = items.filter(
    (item) => item.hubspotFormKind && item.hubspotFormKind !== 'none' && item.modalIdValue,
  )

  if (cmsForms.length === 0) {
    return null
  }

  return (
    <>
      {cmsForms.map((item) => {
        const modalId = item.modalIdValue
        const kind = item.hubspotFormKind!
        const config = resolveHubspotFormConfig(kind, hubspotSettings, item.hubspotFormId)
        if (!config) return null

        let target = `#hubspot-form-${modalId}`
        if (kind === 'governance') target = '#hubspot-form-governance'
        if (kind === 'tallgrass') target = '#hubspot-form-tallgrass'
        if (kind === 'methodology') target = `#hubspot-form-methodology-${modalId}`

        const hiddenFields: { names: string[]; value: string }[] = []
        if (kind === 'methodology' && item.hubspotSource && item.hubspotTitle) {
          hiddenFields.push(
            { names: ['methodologysource', 'MethodologySource'], value: item.hubspotSource },
            { names: ['methodologytitle', 'MethodologyTitle'], value: item.hubspotTitle },
          )
        }
        if (kind === 'guide' && item.hubspotSource && item.hubspotTitle) {
          hiddenFields.push(
            { names: ['guidesource', 'GuideSource'], value: item.hubspotSource },
            { names: ['guidetitle', 'GuideTitle'], value: item.hubspotTitle },
          )
        }

        return (
          <HubSpotForm
            key={modalId}
            portalId={config.portalId}
            formId={config.formId}
            target={target}
            requireHash={modalId}
            hiddenFields={hiddenFields.length ? hiddenFields : undefined}
          />
        )
      })}
    </>
  )
}
