'use client'

import { useEffect } from 'react'

const LEGACY_TABS = ['governance', 'methodologies', 'guides', 'case-studies'] as const
const NEWS_TAB = 'news-insights' as const

type TabId = string

type ParsedResourcesHash = {
  tab: TabId | null
  modalId: string | null
}

const LEGACY_HASH_TO_TAB: Record<string, TabId> = {
  news: NEWS_TAB,
  governance: 'governance',
  methodologies: 'methodologies',
  guides: 'guides',
  casestudies: 'case-studies',
  'news-insights': NEWS_TAB,
  'case-studies': 'case-studies',
}

const LEGACY_TAB_TO_HASH: Record<string, string> = {
  [NEWS_TAB]: 'news',
  governance: 'governance',
  methodologies: 'methodologies',
  guides: 'guides',
  'case-studies': 'casestudies',
}

function parseResourcesHash(raw: string): ParsedResourcesHash {
  const cleaned = raw.replace(/^#/, '').trim()
  if (!cleaned) return { tab: null, modalId: null }

  const split = cleaned.split(/[:/]{1}|--/).filter(Boolean)
  const first = (split[0] ?? '').trim().toLowerCase()
  const second = (split[1] ?? '').trim()

  const modalId = second ? second : null
  if (!second && cleaned && !LEGACY_HASH_TO_TAB[first]) {
    return { tab: null, modalId: cleaned }
  }

  return { tab: null, modalId }
}

function resourcesTabsRootEl(): HTMLElement | null {
  return (
    document.getElementById('resources-tabs') ??
    document.getElementById('reosurces-section')
  )
}

function readHashToTabMap(): Record<string, TabId> {
  const root = resourcesTabsRootEl()
  const raw = root?.getAttribute('data-tab-hashes')
  if (raw) {
    try {
      const parsed = JSON.parse(raw) as Record<string, string | undefined>
      const map: Record<string, TabId> = { ...LEGACY_HASH_TO_TAB }
      for (const [hash, tabKey] of Object.entries(parsed)) {
        if (hash && tabKey) map[hash.toLowerCase()] = tabKey
      }
      return map
    } catch {
      /* use legacy map */
    }
  }
  return { ...LEGACY_HASH_TO_TAB }
}

function readTabToHashMap(hashToTab: Record<string, TabId>): Record<string, string> {
  const tabToHash: Record<string, string> = { ...LEGACY_TAB_TO_HASH }
  for (const [hash, tabKey] of Object.entries(hashToTab)) {
    tabToHash[tabKey] = hash
  }
  return tabToHash
}

function tabIdsForPage(): TabId[] {
  const root = resourcesTabsRootEl()
  if (!root) return [...LEGACY_TABS]

  const ids: TabId[] = []
  const newsTab = document.getElementById('news-insights-tab')
  if (newsTab) ids.push(NEWS_TAB)

  root.querySelectorAll<HTMLElement>('[id$="-tab"]').forEach((el) => {
    const id = el.id.replace(/-tab$/, '')
    if (id && id !== 'grow-div' && id !== 'resources-tabs' && id !== NEWS_TAB) {
      ids.push(id)
    }
  })

  if (ids.length > (newsTab ? 1 : 0)) return ids
  return newsTab ? [NEWS_TAB, ...LEGACY_TABS] : [...LEGACY_TABS]
}

function getTabChrome(tabEl: HTMLElement | null) {
  return {
    padding: tabEl?.dataset.tabPadding ?? 'pl-4 pr-4 md:pl-6 md:pr-6',
    activeBorders: tabEl?.dataset.tabActiveBorders ?? 'border-t border-r border-l',
    growWhenActive: tabEl?.dataset.tabGrowActive ?? 'border-b',
  }
}

function scrollToResourcesTabs() {
  const delays = [0, 60, 180] as const
  delays.forEach((ms, idx) => {
    window.setTimeout(() => {
      const target = resourcesTabsRootEl()
      if (!target) return
      target.scrollIntoView({ behavior: idx === 0 ? 'auto' : 'smooth', block: 'start' })
    }, ms)
  })
}

/**
 * Wires the Resources tab strip + panel visibility.
 * Supports CMS-driven tabs via data attributes on each tab button.
 */
export function ResourcesTabs() {
  useEffect(() => {
    const growDiv = document.getElementById('grow-div')
    if (!growDiv) return

    let hashToTab = readHashToTabMap()
    let tabToHash = readTabToHashMap(hashToTab)

    const resolveTabFromHash = (raw: string): ParsedResourcesHash => {
      const base = parseResourcesHash(raw)
      const cleaned = raw.replace(/^#/, '').trim()
      const split = cleaned.split(/[:/]{1}|--/).filter(Boolean)
      const first = (split[0] ?? '').trim().toLowerCase()
      const tab = hashToTab[first] ?? null
      if (tab) return { tab, modalId: base.modalId }
      return base
    }

    const applyHash = (opts?: { forceScroll?: boolean }) => {
      const { tab, modalId } = resolveTabFromHash(window.location.hash)
      if (!tab) return
      switchTab(tab)
      if (!modalId && (opts?.forceScroll ?? true)) {
        requestAnimationFrame(() => scrollToResourcesTabs())
      }
    }

    const switchTab = (activeId: TabId) => {
      hashToTab = readHashToTabMap()
      tabToHash = readTabToHashMap(hashToTab)
      const tabs = tabIdsForPage()

      const lastTabId = tabs[tabs.length - 1]
      const penultimateTabId = tabs.length >= 2 ? tabs[tabs.length - 2] : null

      tabs.forEach((id) => {
        const tab = document.getElementById(`${id}-tab`)
        const span = tab?.querySelector('span') as HTMLElement | null
        const content = document.getElementById(`${id}-content`)
        const isActive = id === activeId
        if (!tab) return

        const chrome = getTabChrome(tab)
        const base =
          'tab-button flex shrink-0 items-center gap-1 h-14 md:h-20 bg-[#E9E9D7] text-[14px] md:text-2xl font-inter font-normal cursor-pointer border-[#141D19]'
        let borderClass = isActive ? chrome.activeBorders : 'border-b'

        // When the last tab is selected, the tab before it needs a right edge (legacy case-studies/guides rule).
        if (!isActive && activeId === lastTabId && penultimateTabId && id === penultimateTabId) {
          borderClass = 'border-b border-r'
        }

        tab.className = `${base} ${chrome.padding} ${borderClass}`
        if (span) span.style.color = isActive ? '#141D19' : '#7A7E70'
        if (content) content.classList.toggle('hidden', !isActive)
      })

      const activeTabEl = document.getElementById(`${activeId}-tab`)
      const growActive = getTabChrome(activeTabEl).growWhenActive
      const growDefault = growDiv.dataset.growDefault ?? 'border-b'
      growDiv.className = `grow ${isActiveLastTab(activeId, tabs) ? growActive : growDefault} border-[#141D19] bg-[#E9E9D7]`

      const section = resourcesTabsRootEl()
      if (section) section.setAttribute('data-active', activeId)
    }

    function isActiveLastTab(activeId: TabId, tabs: TabId[]) {
      return activeId === tabs[tabs.length - 1]
    }

    const initialTabFromHash = (): TabId => {
      const { tab } = resolveTabFromHash(window.location.hash)
      if (tab) return tab
      const tabs = tabIdsForPage()
      return tabs[0] ?? 'governance'
    }

    const handlers: { el: HTMLElement; handler: () => void }[] = []
    tabIdsForPage().forEach((id) => {
      const tab = document.getElementById(`${id}-tab`)
      if (!tab) return
      const handler = () => {
        const hash = tabToHash[id] ?? id
        history.replaceState(null, '', `${window.location.pathname}#${hash}`)
        switchTab(id)
      }
      tab.addEventListener('click', handler)
      handlers.push({ el: tab, handler })
    })

    switchTab(initialTabFromHash())
    if (window.location.hash) {
      const { modalId } = resolveTabFromHash(window.location.hash)
      if (!modalId) {
        requestAnimationFrame(() => scrollToResourcesTabs())
      }
    }

    const onHashChange = () => applyHash()
    window.addEventListener('hashchange', onHashChange)

    const onDocClick = (e: MouseEvent) => {
      const t = e.target as HTMLElement | null
      if (!t) return
      const a = t.closest('a') as HTMLAnchorElement | null
      if (!a) return
      const href = a.getAttribute('href') || ''
      if (!href.includes('#')) return
      if (window.location.pathname !== '/resources') return

      const lastFrag = href.split('#').filter(Boolean).pop()
      if (!lastFrag) return
      const hashPart = `#${lastFrag}`

      e.preventDefault()
      if (window.location.hash === hashPart) {
        applyHash({ forceScroll: true })
      } else {
        window.location.hash = hashPart
      }
    }
    document.addEventListener('click', onDocClick)

    return () => {
      handlers.forEach(({ el, handler }) => el.removeEventListener('click', handler))
      window.removeEventListener('hashchange', onHashChange)
      document.removeEventListener('click', onDocClick)
    }
  }, [])

  return null
}
