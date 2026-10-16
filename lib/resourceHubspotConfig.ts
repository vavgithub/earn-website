import type { ResourceHubSpotSettingsRecord } from '@/types/resources'

/** Empty until the Earn HubSpot portal id is set in Studio. */
export const DEFAULT_HUBSPOT_PORTAL_ID = ''

export const DEFAULT_HUBSPOT_FORMS: Record<string, { formId: string }> = {}

const KIND_FIELD: Record<
  string,
  keyof Pick<
    ResourceHubSpotSettingsRecord,
    'governanceFormId' | 'methodologyFormId' | 'guideFormId' | 'caseStudyFormId' | 'mcpFormId'
  >
> = {
  governance: 'governanceFormId',
  methodology: 'methodologyFormId',
  guide: 'guideFormId',
  tallgrass: 'caseStudyFormId',
  mcp: 'mcpFormId',
}

function formIdFromSettings(
  kind: string,
  settings: ResourceHubSpotSettingsRecord | null | undefined,
): string | undefined {
  const field = KIND_FIELD[kind]
  const fromField = field ? settings?.[field]?.trim() : undefined
  if (fromField) return fromField

  const fromLegacy = settings?.forms?.find((f) => f.kind === kind)?.formId?.trim()
  if (fromLegacy) return fromLegacy

  return DEFAULT_HUBSPOT_FORMS[kind]?.formId
}

export function resolveHubspotFormConfig(
  kind: string | null | undefined,
  settings: ResourceHubSpotSettingsRecord | null | undefined,
  itemOverrideFormId?: string | null,
) {
  if (!kind || kind === 'none') return null

  const portalId = settings?.portalId?.trim() || DEFAULT_HUBSPOT_PORTAL_ID
  const formId = itemOverrideFormId?.trim() || formIdFromSettings(kind, settings)
  if (!portalId || !formId) return null

  return { portalId, formId }
}
