'use client'

import { useCallback, useEffect, useMemo, useState, type CSSProperties } from 'react'
import { set, type ArrayOfObjectsInputProps } from 'sanity'
import { useClient } from 'sanity'
import { Box, Card, Checkbox, Flex, Stack, Text } from '@sanity/ui'
import { apiVersion } from '../env'
import { ensureUniqueSlugForType } from '../lib/ensureUniqueSlug'

type TagRow = { _id: string; title: string }

function newItemKey(): string {
  return [...crypto.getRandomValues(new Uint8Array(9))]
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
}

function slugifyTitle(title: string): string {
  const s = title
    .trim()
    .toLowerCase()
    .replace(/['']/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 80)
  return s || 'tag'
}

/**
 * Multi-select tags (checkboxes) + create new tag on this post.
 * Delete tags from Blog → Tags in the desk (not here).
 */
export function BlogTagsCheckboxInput(props: ArrayOfObjectsInputProps) {
  const { value, onChange, readOnly } = props
  const client = useClient({ apiVersion })
  const [tags, setTags] = useState<TagRow[]>([])
  const [loading, setLoading] = useState(true)
  const [newTitle, setNewTitle] = useState('')
  const [creating, setCreating] = useState(false)
  const [busy, setBusy] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)

  const reloadTags = useCallback(() => {
    return client
      .fetch<TagRow[]>(`*[_type == "blogTag"] | order(title asc) { _id, title }`)
      .then(setTags)
  }, [client])

  useEffect(() => {
    reloadTags().finally(() => setLoading(false))
  }, [reloadTags])

  const selectedIds = useMemo(() => {
    const rows = (value ?? []) as Array<{ _ref?: string }>
    return new Set(rows.map((r) => r._ref).filter(Boolean) as string[])
  }, [value])

  const commit = useCallback(
    (nextIds: Set<string>) => {
      const nextRefs = tags
        .filter((t) => nextIds.has(t._id))
        .map((t) => {
          const existing = (value as Array<{ _ref?: string; _key?: string }> | undefined)?.find(
            (v) => v._ref === t._id,
          )
          return {
            _type: 'reference' as const,
            _ref: t._id,
            _key: existing?._key ?? newItemKey(),
          }
        })
      onChange(set(nextRefs.length ? nextRefs : []))
    },
    [onChange, tags, value],
  )

  const ensureUniqueSlug = useCallback(
    async (base: string): Promise<string> => {
      return ensureUniqueSlugForType(client, {
        documentType: 'blogTag',
        baseSlug: base,
        maxLength: 96,
        excludeIds: [],
      })
    },
    [client],
  )

  const handleCreateTag = useCallback(async () => {
    const title = newTitle.trim()
    if (!title) {
      setFormError('Enter a tag name.')
      return
    }
    setFormError(null)
    setBusy(true)
    try {
      const baseSlug = slugifyTitle(title)
      const slug = await ensureUniqueSlug(baseSlug)
      const created = await client.create({
        _type: 'blogTag',
        title,
        slug: { _type: 'slug', current: slug },
      })
      await reloadTags()
      const next = new Set(selectedIds)
      next.add(created._id)
      commit(next)
      setNewTitle('')
      setCreating(false)
    } catch (e) {
      setFormError(e instanceof Error ? e.message : 'Could not create tag.')
    } finally {
      setBusy(false)
    }
  }, [newTitle, client, ensureUniqueSlug, reloadTags, selectedIds, commit])

  if (loading) {
    return (
      <Text muted size={1}>
        Loading tags…
      </Text>
    )
  }

  const btnStyle: CSSProperties = {
    font: 'inherit',
    cursor: readOnly || busy ? 'not-allowed' : 'pointer',
    padding: '6px 12px',
    borderRadius: 4,
    border: '1px solid var(--card-border-color, #ccc)',
    background: 'var(--card-bg-color, #fff)',
  }

  return (
    <Stack space={3}>
      <Text muted size={1}>
        <strong>On this post:</strong> check or uncheck tags. Unchecking only removes the tag here. To delete a tag site-wide, use <strong>Blog → Tags</strong> in the desk.
      </Text>

      {!readOnly && (
        <Stack space={2}>
          {!creating ? (
            <button
              type="button"
              disabled={busy}
              style={btnStyle}
              onClick={() => {
                setCreating(true)
                setFormError(null)
              }}
            >
              + New tag
            </button>
          ) : (
            <Card padding={3} radius={2} shadow={1} tone="transparent">
              <Stack space={3}>
                <Text size={1} weight="semibold">
                  New tag name
                </Text>
                <input
                  type="text"
                  value={newTitle}
                  disabled={busy}
                  onChange={(e) => setNewTitle(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault()
                      void handleCreateTag()
                    }
                  }}
                  placeholder="e.g. EU Methane Regulation"
                  style={{
                    width: '100%',
                    padding: '8px 10px',
                    borderRadius: 4,
                    border: '1px solid var(--input-border-color, #ccc)',
                    font: 'inherit',
                  }}
                />
                <Flex gap={2} wrap="wrap">
                  <button
                    type="button"
                    disabled={busy}
                    style={{ ...btnStyle, opacity: busy ? 0.6 : 1 }}
                    onClick={() => void handleCreateTag()}
                  >
                    Create & select
                  </button>
                  <button
                    type="button"
                    disabled={busy}
                    style={btnStyle}
                    onClick={() => {
                      setCreating(false)
                      setNewTitle('')
                      setFormError(null)
                    }}
                  >
                    Cancel
                  </button>
                </Flex>
              </Stack>
            </Card>
          )}
        </Stack>
      )}

      {formError && (
        <Text size={1} style={{ color: 'var(--sanity-color-icon-critical, #e00)' }}>
          {formError}
        </Text>
      )}

      {tags.length === 0 && !creating ? (
        <Text muted size={1}>
          No tags yet. Use <strong>+ New tag</strong> above.
        </Text>
      ) : (
        <Stack space={2}>
          {tags.map((t) => (
            <Card key={t._id} padding={3} radius={2} tone="transparent" shadow={1}>
              <Box
                as="label"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  cursor: readOnly || busy ? 'default' : 'pointer',
                }}
              >
                <Checkbox
                  checked={selectedIds.has(t._id)}
                  disabled={readOnly || busy}
                  onChange={(ev) => {
                    const next = new Set(selectedIds)
                    if (ev.currentTarget.checked) next.add(t._id)
                    else next.delete(t._id)
                    commit(next)
                  }}
                />
                <Text size={2}>{t.title}</Text>
              </Box>
            </Card>
          ))}
        </Stack>
      )}
    </Stack>
  )
}
