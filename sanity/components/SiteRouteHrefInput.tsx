'use client'

import type { CSSProperties } from 'react'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { set, type StringInputProps, useClient } from 'sanity'
import { Box, Button, Card, Flex, Spinner, Stack, Text, TextInput } from '@sanity/ui'
import { apiVersion } from '../env'
import {
  STATIC_SITE_ROUTES,
  fetchSanitySiteRouteChoices,
  mergeRouteChoices,
  normalizeSiteRouteHref,
  type SiteRouteChoice,
} from '../lib/siteRoutesCatalog'

const LIST_MAX = 120

function filterChoices(choices: SiteRouteChoice[], query: string): SiteRouteChoice[] {
  const q = query.trim().toLowerCase()
  if (!q) return choices.slice(0, LIST_MAX)
  return choices
    .filter(
      (c) =>
        c.href.toLowerCase().includes(q) ||
        c.title.toLowerCase().includes(q) ||
        c.group.toLowerCase().includes(q),
    )
    .slice(0, LIST_MAX)
}

const optionButtonCss: CSSProperties = {
  width: '100%',
  textAlign: 'left',
  display: 'block',
  cursor: 'pointer',
  border: 'none',
  background: 'transparent',
  padding: '10px 12px',
  borderRadius: 4,
}

/**
 * URL field: type or paste any URL, or open **Browse routes** for a searchable dropdown
 * (refreshed from Sanity each time you open it, so deleted posts/pages drop off the list).
 */
export function SiteRouteHrefInput(props: StringInputProps) {
  const { value, onChange, readOnly } = props
  const client = useClient({ apiVersion })
  const rootRef = useRef<HTMLDivElement | null>(null)

  const [choices, setChoices] = useState<SiteRouteChoice[]>(STATIC_SITE_ROUTES)
  const [loading, setLoading] = useState(false)
  const [draft, setDraft] = useState(typeof value === 'string' ? value : '')
  const [open, setOpen] = useState(false)
  const [dropdownQuery, setDropdownQuery] = useState('')

  useEffect(() => {
    setDraft(typeof value === 'string' ? value : '')
  }, [value])

  const loadChoices = useCallback(async () => {
    setLoading(true)
    try {
      const dynamic = await fetchSanitySiteRouteChoices(client)
      setChoices(mergeRouteChoices(STATIC_SITE_ROUTES, dynamic))
    } catch {
      setChoices(STATIC_SITE_ROUTES)
    } finally {
      setLoading(false)
    }
  }, [client])

  const toggleBrowse = useCallback(() => {
    setOpen((prev) => {
      const next = !prev
      if (next) {
        setDropdownQuery('')
        void loadChoices()
      }
      return next
    })
  }, [loadChoices])

  useEffect(() => {
    if (!open) return
    const onDocMouseDown = (ev: MouseEvent) => {
      const el = rootRef.current
      if (!el || !(ev.target instanceof Node) || el.contains(ev.target)) return
      setOpen(false)
    }
    document.addEventListener('mousedown', onDocMouseDown)
    return () => document.removeEventListener('mousedown', onDocMouseDown)
  }, [open])

  const filtered = useMemo(() => filterChoices(choices, dropdownQuery), [choices, dropdownQuery])

  const applyHref = useCallback(
    (href: string) => {
      const v = normalizeSiteRouteHref(href)
      onChange(set(v))
      setDraft(v)
      setOpen(false)
    },
    [onChange],
  )

  return (
    <Stack space={3} style={{ width: '100%', maxWidth: '100%' }}>
      <Box ref={rootRef} style={{ position: 'relative', width: '100%' }}>
        <Flex gap={2} align="stretch" style={{ width: '100%', justifyContent: 'flex-start' }}>
          <Box flex={1} style={{ minWidth: 0 }}>
            <TextInput
              value={draft}
              onChange={(e) => setDraft(e.currentTarget.value)}
              onBlur={() => {
                const v = normalizeSiteRouteHref(draft)
                if (v !== (typeof value === 'string' ? normalizeSiteRouteHref(value) : '')) {
                  onChange(set(v))
                  setDraft(v)
                }
              }}
              readOnly={readOnly}
              placeholder="/about or https://…"
            />
          </Box>
          <Button
            text={open ? 'Close' : 'Browse routes'}
            mode="default"
            tone="default"
            disabled={readOnly}
            onClick={toggleBrowse}
            style={{ flexShrink: 0, alignSelf: 'stretch' }}
          />
        </Flex>

        {open ? (
          <Card
            padding={2}
            radius={2}
            shadow={3}
            tone="default"
            style={{
              position: 'absolute',
              left: 0,
              right: 0,
              top: '100%',
              marginTop: 6,
              zIndex: 20,
              maxHeight: 360,
              display: 'flex',
              flexDirection: 'column',
              textAlign: 'left',
            }}
          >
            <Stack space={2} style={{ minHeight: 0, textAlign: 'left', width: '100%' }}>
              <TextInput
                value={dropdownQuery}
                onChange={(e) => setDropdownQuery(e.currentTarget.value)}
                placeholder="Type to filter routes…"
                readOnly={readOnly}
                autoFocus
              />
              <Flex align="center" gap={2} style={{ justifyContent: 'flex-start' }}>
                <Text size={1} weight="semibold">
                  Choose a route
                </Text>
                {loading ? <Spinner muted /> : null}
              </Flex>
              <Box
                style={{
                  overflowY: 'auto',
                  maxHeight: 260,
                  borderTop: '1px solid rgba(0,0,0,0.08)',
                }}
              >
                {filtered.length === 0 ? (
                  <Box padding={3}>
                    <Text muted size={1} align="left">
                      No matches. Adjust the filter or close and type a URL in the field above.
                    </Text>
                  </Box>
                ) : (
                  <Stack space={0}>
                    {filtered.map((c) => (
                      <button
                        key={c.href}
                        type="button"
                        disabled={readOnly}
                        onClick={() => applyHref(c.href)}
                        style={optionButtonCss}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = 'rgba(0,0,0,0.06)'
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = 'transparent'
                        }}
                      >
                        <Stack space={1} style={{ textAlign: 'left', width: '100%' }}>
                          <Text size={1} weight="medium" align="left">
                            {c.group}: {c.title}
                          </Text>
                          <Text muted size={0} align="left">
                            {c.href}
                          </Text>
                        </Stack>
                      </button>
                    ))}
                  </Stack>
                )}
              </Box>
              <Text muted size={0} align="left">
                List reloads from Sanity whenever you open this panel — article URLs use /resources/.
                Deleted posts/pages drop off automatically.
              </Text>
            </Stack>
          </Card>
        ) : null}
      </Box>

      <Box style={{ alignSelf: 'flex-start' }}>
        <Button
          text="Apply typed URL"
          mode="bleed"
          tone="primary"
          disabled={readOnly || !draft.trim()}
          onClick={() => applyHref(draft.trim())}
        />
      </Box>
    </Stack>
  )
}
