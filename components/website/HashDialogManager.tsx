'use client'

import { useEffect } from 'react'

/** Legacy modal ids on /resources-old; CMS modals use class `dialog-with-form`. */
const LEGACY_DIALOGS_WITH_FORMS = new Set([
  'governance-1',
  'tallgrass-case-study',
  'mcp-access',
  'guide-1',
  'guide-2',
  'guide-3',
  'qet',
  'low-carbon-qet',
  'ethanol-qet',
  'ccs-qet',
  'sol-qet',
  'rng-qet',
  'transport-distances',
  'dynamic-allocation-pipeline',
  'qet-elec',
])

function dialogUsesFormBackdrop(dialog: HTMLDialogElement | null): boolean {
  if (!dialog) return false
  return dialog.classList.contains('dialog-with-form') || LEGACY_DIALOGS_WITH_FORMS.has(dialog.id)
}

const RECAPTCHA_ABOVE_FORM_DIALOG_Z = '10050'

const LEGACY_TAB_HASHES = new Set([
  'news',
  'news-insights',
  'governance',
  'methodologies',
  'guides',
  'casestudies',
  'case-studies',
])

function readTabHashSet(): Set<string> {
  const set = new Set(LEGACY_TAB_HASHES)
  const raw = resourcesTabsRootEl()?.getAttribute('data-tab-hashes')
  if (!raw) return set
  try {
    const parsed = JSON.parse(raw) as Record<string, string | undefined>
    Object.keys(parsed).forEach((key) => {
      if (key) set.add(key.toLowerCase())
    })
  } catch {
    /* keep legacy set */
  }
  return set
}

const isUserLoggedIn = () =>
  typeof document !== 'undefined' &&
  document.cookie.split('; ').some((c) => c.startsWith('earn_auth=authenticated'))

const toggleAuthVisibility = (loggedIn: boolean) => {
  const map: Record<string, boolean> = {
    'non-auth-text': loggedIn,
    'auth-text': !loggedIn,
    'download-pdf': !loggedIn,
    'auth-only-content': !loggedIn,
    'create-account': loggedIn,
    login: loggedIn,
    'non-auth-only-content': loggedIn,
  }
  Object.entries(map).forEach(([cls, hide]) => {
    Array.from(document.getElementsByClassName(cls)).forEach((el) => {
      el.classList.toggle('hidden', hide)
    })
  })
}

const boostRecaptchaZ = () => {
  if (typeof document === 'undefined') return
  document.querySelectorAll<HTMLElement>('.grecaptcha-badge').forEach((el) => {
    el.style.setProperty('z-index', RECAPTCHA_ABOVE_FORM_DIALOG_Z, 'important')
  })
  document
    .querySelectorAll<HTMLIFrameElement>(
      'iframe[src*="recaptcha"], iframe[src*="google.com/recaptcha"], iframe[title*="reCAPTCHA"], iframe[title*="recaptcha"]',
    )
    .forEach((el) => el.style.setProperty('z-index', RECAPTCHA_ABOVE_FORM_DIALOG_Z, 'important'))
}

const addBackdrop = (dialogId: string, onClose: (id: string) => void) => {
  if (document.getElementById('dialog-form-backdrop')) return
  const backdrop = document.createElement('div')
  backdrop.id = 'dialog-form-backdrop'
  backdrop.setAttribute('aria-hidden', 'true')
  backdrop.className = 'dialog-form-backdrop'
  backdrop.addEventListener('click', () => onClose(dialogId))
  document.body.appendChild(backdrop)
}

const removeBackdrop = () => document.getElementById('dialog-form-backdrop')?.remove()

function resourcesTabsRootEl(): HTMLElement | null {
  return (
    document.getElementById('resources-tabs') ??
    // Back-compat: older builds had a typo
    document.getElementById('reosurces-section')
  )
}

function currentResourcesTab(): string | null {
  const root = resourcesTabsRootEl()
  const active = root?.getAttribute('data-active')?.trim()
  if (!active) return null
  if (active === 'news-insights') return 'news'
  const tabEl = document.getElementById(`${active}-tab`)
  const hash = tabEl?.getAttribute('data-tab-hash')
  if (hash) return hash
  if (active === 'case-studies') return 'casestudies'
  return active
}

function parseResourcesHash(raw: string): { tabHash: string | null; modalId: string | null } {
  const cleaned = raw.replace(/^#/, '').trim()
  if (!cleaned) return { tabHash: null, modalId: null }
  const split = cleaned.split(/[:/]{1}|--/).filter(Boolean)
  const first = (split[0] ?? '').trim().toLowerCase()
  const second = (split[1] ?? '').trim()
  const tabHashes = readTabHashSet()
  const tabHash = tabHashes.has(first) ? first : null
  const modalId = second ? second : tabHash ? null : cleaned
  return { tabHash, modalId }
}

function setUrlAfterModalClose() {
  const { tabHash } = parseResourcesHash(window.location.hash)
  if (tabHash) {
    history.replaceState(null, '', `${window.location.pathname}#${tabHash}`)
  } else {
    history.replaceState(null, '', window.location.pathname)
  }
}

function scrollToModalOpener(modalId: string) {
  // Prefer scrolling to the card / button that opened the modal.
  // This stays stable even if the dialog element itself lives elsewhere in the DOM.
  const opener = document.querySelector<HTMLElement>(`[data-modal-hash="${CSS.escape(modalId)}"]`)
  if (opener) {
    opener.scrollIntoView({ behavior: 'smooth', block: 'center' })
    return
  }
  // Fallback: scroll the dialog element into view (usually not necessary, but safe).
  const dialog = document.getElementById(modalId)
  dialog?.scrollIntoView({ behavior: 'smooth', block: 'center' })
}

function scrollToResourcesTabs() {
  const root = resourcesTabsRootEl()
  if (!root) return
  root.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

/**
 * Manages hash-driven `<dialog>` modals on the Resources page (and any other page that uses them).
 *
 *  - Opens a dialog when the URL hash matches a dialog id.
 *  - Adds a custom backdrop for form dialogs (which use `dialog.show()` rather than `showModal()`).
 *  - Toggles auth-aware visibility (`.auth-text`, `.non-auth-text`, etc.).
 *  - Rewrites `.create-account` / `.login` href to include a return URL.
 *  - Boosts reCAPTCHA z-index so HubSpot challenges render above the dialog.
 *
 * Replaces `public/assets/js/modal.js`.
 */
export function HashDialogManager() {
  useEffect(() => {
    const closeDialog = (hash: string) => {
      const dialog = document.getElementById(hash) as HTMLDialogElement | null
      if (dialogUsesFormBackdrop(dialog)) removeBackdrop()
      dialog?.close()
      setUrlAfterModalClose()
    }

    const handleHashModal = () => {
      const { tabHash, modalId } = parseResourcesHash(window.location.hash)

      // If the hash is a tab deep-link (or tab+modal), do not treat it as a dialog id.
      // The tab switching + scrolling is handled by `ResourcesTabs`.
      const dialogKey = modalId
      const dialog = dialogKey ? (document.getElementById(dialogKey) as HTMLDialogElement | null) : null

      toggleAuthVisibility(isUserLoggedIn())

      document.querySelectorAll<HTMLDialogElement>('dialog[open]').forEach((d) => {
        if (d !== dialog) d.close()
      })
      removeBackdrop()

      if (dialog?.tagName === 'DIALOG') {
        // For combined deep links (#tab:modal), ensure we scroll past featured content
        // to the tab strip and then to the specific card before opening.
        const openDialog = () => {
          if (dialogUsesFormBackdrop(dialog)) {
            dialog.show()
            dialog.style.zIndex = '10000'
            addBackdrop(dialogKey!, closeDialog)
            boostRecaptchaZ()
            requestAnimationFrame(boostRecaptchaZ)
          } else {
            dialog.showModal()
          }
        }

        if (tabHash && dialogKey) {
          requestAnimationFrame(() => {
            scrollToResourcesTabs()
            // Wait 2 frames so the tab switch + layout settle, then scroll to the card.
            requestAnimationFrame(() => requestAnimationFrame(() => scrollToModalOpener(dialogKey)))
            // Open the modal reliably even if layout is still shifting.
            window.setTimeout(() => {
              openDialog()
              // If something prevented opening, retry once.
              window.setTimeout(() => {
                if (!dialog.open) openDialog()
              }, 300)
            }, 0)
          })
        } else if (dialogKey) {
          requestAnimationFrame(() => requestAnimationFrame(() => scrollToModalOpener(dialogKey)))
          openDialog()
        } else {
          openDialog()
        }
      }
    }

    const dialogs = Array.from(document.querySelectorAll<HTMLDialogElement>('dialog'))
    const dialogHandlers: { dialog: HTMLDialogElement; click: (e: MouseEvent) => void; close?: () => void; closeBtn?: HTMLElement; closeBtnHandler?: () => void }[] = []

    dialogs.forEach((dialog) => {
      const click = (e: MouseEvent) => {
        if (e.target === dialog) {
          if (dialogUsesFormBackdrop(dialog)) removeBackdrop()
          dialog.close()
          setUrlAfterModalClose()
        }
      }
      dialog.addEventListener('click', click)

      const closeBtn = dialog.querySelector<HTMLElement>('[data-close]')
      const closeBtnHandler = () => {
        if (dialogUsesFormBackdrop(dialog)) removeBackdrop()
        dialog.close()
        setUrlAfterModalClose()
      }
      closeBtn?.addEventListener('click', closeBtnHandler)

      let close: (() => void) | undefined
      if (dialogUsesFormBackdrop(dialog)) {
        close = () => removeBackdrop()
        dialog.addEventListener('close', close)
      }

      dialogHandlers.push({ dialog, click, close, closeBtn: closeBtn ?? undefined, closeBtnHandler })
    })

    const baseUrl = window.location.origin
    const loginUrl = process.env.NEXT_PUBLIC_APP_LOGIN_URL?.trim()
    const registerUrl = process.env.NEXT_PUBLIC_APP_REGISTER_URL?.trim()
    document.querySelectorAll<HTMLAnchorElement>('.create-account, .login').forEach((link) => {
      const path = link.dataset.id || ''
      const isLogin = link.classList.contains('login')
      const appUrl = isLogin ? loginUrl : registerUrl
      if (!appUrl) return
      const joiner = appUrl.includes('?') ? '&' : '?'
      link.href = `${appUrl}${joiner}returnUrl=${encodeURIComponent(`${baseUrl}/resources#${path}`)}`
    })

    let scheduled = false
    const scheduleBoost = () => {
      if (scheduled) return
      scheduled = true
      requestAnimationFrame(() => {
        scheduled = false
        boostRecaptchaZ()
      })
    }
    const obs = new MutationObserver(scheduleBoost)
    obs.observe(document.documentElement, { childList: true, subtree: true })

    const onDocumentClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null
      if (!target) return

      const opener = target.closest<HTMLElement>('[data-modal-hash]')
      if (opener) {
        e.preventDefault()
        const hash = opener.getAttribute('data-modal-hash') || ''
        if (!hash) return

        // Prefer a combined deep link: #<tab>:<modalId>
        // This keeps tab state and still opens the modal.
        const tab = currentResourcesTab()
    const combined = tab ? `${tab}:${hash}` : hash

        if (window.location.hash.replace('#', '') === combined || window.location.hash.replace('#', '') === hash) {
          handleHashModal()
        } else {
          window.location.hash = combined
        }
        return
      }

      const closer = target.closest<HTMLElement>('[data-close-modal]')
      if (closer) {
        e.preventDefault()
        const explicitId = closer.getAttribute('data-close-modal')
        const dialog = (explicitId
          ? (document.getElementById(explicitId) as HTMLDialogElement | null)
          : closer.closest('dialog')) as HTMLDialogElement | null
        if (dialog) {
          if (dialogUsesFormBackdrop(dialog)) {
            removeBackdrop()
          }
          dialog.close()
          setUrlAfterModalClose()
        }
      }
    }
    document.addEventListener('click', onDocumentClick)

    window.addEventListener('hashchange', handleHashModal)
    handleHashModal()

    return () => {
      window.removeEventListener('hashchange', handleHashModal)
      document.removeEventListener('click', onDocumentClick)
      obs.disconnect()
      dialogHandlers.forEach(({ dialog, click, close, closeBtn, closeBtnHandler }) => {
        dialog.removeEventListener('click', click)
        if (close) dialog.removeEventListener('close', close)
        if (closeBtn && closeBtnHandler) closeBtn.removeEventListener('click', closeBtnHandler)
      })
      removeBackdrop()
    }
  }, [])

  return null
}
