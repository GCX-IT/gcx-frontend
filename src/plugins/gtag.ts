/** GA4 measurement ID for gcx.com.gh */
export const GA_MEASUREMENT_ID = 'G-XLTZ3GRN4X'

export function initGoogleAnalytics(): void {
  if (!import.meta.env.PROD || typeof window === 'undefined') return

  window.dataLayer = window.dataLayer ?? []
  window.gtag = function gtag(...args: unknown[]) {
    window.dataLayer!.push(args)
  }
  window.gtag('js', new Date())
  window.gtag('config', GA_MEASUREMENT_ID, { send_page_view: false })

  const script = document.createElement('script')
  script.async = true
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`
  document.head.appendChild(script)
}

export function trackGaPageView(path: string): void {
  if (typeof window.gtag !== 'function') return
  window.gtag('config', GA_MEASUREMENT_ID, { page_path: path })
}
