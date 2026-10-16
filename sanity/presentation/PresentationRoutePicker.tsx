'use client'

import type { CSSProperties } from 'react'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useClient } from 'sanity'
import { Box, Button, Card, Flex, Menu, MenuButton, Spinner, Stack, Text, TextInput } from '@sanity/ui'
import { ChevronDownIcon } from '@sanity/icons'
import { apiVersion } from '../env'
import {
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

type Props = {
  currentPath: string
  onSelect: (path: string) => void
}

/** Presentation “Pages” menu: CMS pages + resource articles only (no static Site routes). */
export function PresentationRoutePicker({ currentPath, onSelect }: Props) {
  const client = useClient({ apiVersion })
  const [choices, setChoices] = useState<SiteRouteChoice[]>([])
  const [loading, setLoading] = useState(false)
  const [query, setQuery] = useState('')
  const queryRef = useRef<HTMLInputElement | null>(null)

  const loadChoices = useCallback(async () => {
    setLoading(true)
    try {
      const dynamic = await fetchSanitySiteRouteChoices(client)
      setChoices(mergeRouteChoices([], dynamic))
    } catch {
      setChoices([])
    } finally {
      setLoading(false)
    }
  }, [client])

  useEffect(() => {
    void loadChoices()
  }, [loadChoices])

  const filtered = useMemo(() => filterChoices(choices, query), [choices, query])
  const normalizedCurrent = normalizeSiteRouteHref(currentPath)

  const pick = useCallback(
    (href: string) => {
      onSelect(normalizeSiteRouteHref(href))
    },
    [onSelect],
  )

  const openMenu = useCallback(() => {
    setQuery('')
    void loadChoices()
    window.setTimeout(() => queryRef.current?.focus(), 0)
  }, [loadChoices])

  return (
    <MenuButton
      id="presentation-route-picker"
      button={
        <Button
          fontSize={1}
          icon={ChevronDownIcon}
          mode="bleed"
          onClick={openMenu}
          padding={2}
          text="Pages"
          tone="default"
        />
      }
      popover={{
        animate: true,
        constrainSize: true,
        placement: 'bottom',
        portal: true,
        width: 360,
      }}
      menu={
        <Menu padding={0}>
          <Card padding={3}>
            <Stack space={3}>
              <Text size={1} weight="semibold">
                Go to page
              </Text>
              <TextInput
                ref={queryRef}
                value={query}
                onChange={(e) => setQuery(e.currentTarget.value)}
                placeholder="Filter routes…"
              />
              <Flex align="center" gap={2}>
                {loading ? <Spinner muted /> : null}
                <Text muted size={0}>
                  CMS pages and News & Insights articles from Sanity
                </Text>
              </Flex>
              <Box style={{ maxHeight: 320, overflowY: 'auto' }}>
                {filtered.length === 0 ? (
                  <Text muted size={1}>
                    No matches.
                  </Text>
                ) : (
                  <Stack space={0}>
                    {filtered.map((c) => {
                      const active = normalizeSiteRouteHref(c.href) === normalizedCurrent
                      return (
                        <button
                          key={c.href}
                          type="button"
                          onClick={() => pick(c.href)}
                          style={{
                            ...optionButtonCss,
                            background: active ? 'rgba(0,0,0,0.08)' : 'transparent',
                          }}
                        >
                          <Stack space={1}>
                            <Text size={1} weight="medium">
                              {c.group}: {c.title}
                            </Text>
                            <Text muted size={0}>
                              {c.href}
                            </Text>
                          </Stack>
                        </button>
                      )
                    })}
                  </Stack>
                )}
              </Box>
            </Stack>
          </Card>
        </Menu>
      }
    />
  )
}
