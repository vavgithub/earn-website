const HUBSPOT_SCRIPT_SRC = 'https://js.hsforms.net/forms/embed/v2.js'

let scriptPromise: Promise<void> | null = null

export const ensureHubSpotScript = (): Promise<void> => {
  if (typeof window === 'undefined') return Promise.resolve()
  if (window.hbspt?.forms) return Promise.resolve()
  if (scriptPromise) return scriptPromise

  scriptPromise = new Promise<void>((resolve) => {
    const existing = document.querySelector<HTMLScriptElement>(`script[src="${HUBSPOT_SCRIPT_SRC}"]`)
    if (existing) {
      const id = window.setInterval(() => {
        if (window.hbspt?.forms) {
          window.clearInterval(id)
          resolve()
        }
      }, 50)
      return
    }
    const script = document.createElement('script')
    script.src = HUBSPOT_SCRIPT_SRC
    script.async = true
    script.onload = () => {
      const id = window.setInterval(() => {
        if (window.hbspt?.forms) {
          window.clearInterval(id)
          resolve()
        }
      }, 50)
    }
    document.head.appendChild(script)
  })
  return scriptPromise
}

export const setHiddenInputByName = (
  formRoot: unknown,
  nameCandidates: string[],
  value: string,
) => {
  const root =
    formRoot && typeof formRoot === 'object' && 'jquery' in (formRoot as Record<string, unknown>)
      ? (formRoot as { 0: HTMLElement })[0]
      : (formRoot as HTMLElement | null)
  if (!root || !root.querySelector) return
  for (const name of nameCandidates) {
    const el = root.querySelector<HTMLInputElement>(`input[name="${name.replace(/"/g, '\\"')}"]`)
    if (el) {
      el.value = value
      return
    }
  }
}
