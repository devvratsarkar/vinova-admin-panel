import moment from 'moment'

export function optometristAccount(response) {
  return response?.data?.userData || response?.data || {}
}

export function paymentRequired(response) {
  const account = optometristAccount(response)
  return account.payment_required === true && account.payment_completed !== true
}

export function planRenewDue(user) {
  const raw = user?.plan_expiry_date || user?.membership?.plan_expiry_date || user?.plan?.plan_expiry_date
  if (!raw) return false
  const parsed = moment(String(raw).trim(), ['D MMM YYYY', 'DD MMM YYYY', moment.ISO_8601], true)
  const expiry = parsed.isValid() ? parsed : moment(raw)
  if (!expiry.isValid()) return false
  return expiry.clone().startOf('day').diff(moment().startOf('day'), 'months', true) <= 2
}

const OPEN_WHEN_UNPAID = [
  '/optometrist-dashboard/overview',
  '/optometrist-dashboard/profile',
  '/optometrist-dashboard/memberships-plans',
  '/profile',
  '/change-password',
]

export function paymentPageAllowed(path) {
  const current = String(path || '').replace(/\/$/, '') || '/'
  return OPEN_WHEN_UNPAID.some((item) => current === item || current.endsWith(item))
}

export function paymentLink(body) {
  const data = body?.data
  if (typeof data === 'string') return data
  return data?.payment?.payment_url || data?.payment_url || data?.url || data?.redirect_url || data?.link || body?.url || ''
}

export function openPaymentLink(url) {
  let meta = document.querySelector('meta[name="referrer"]')
  if (!meta) {
    meta = document.createElement('meta')
    meta.name = 'referrer'
    document.head.appendChild(meta)
  }
  meta.content = 'no-referrer'

  const anchor = document.createElement('a')
  anchor.href = url
  anchor.rel = 'noreferrer'
  anchor.target = '_self'
  anchor.style.display = 'none'
  document.body.appendChild(anchor)
  anchor.click()
  document.body.removeChild(anchor)
}
