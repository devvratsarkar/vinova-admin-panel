export const base = import.meta.env.BASE_URL || '/'

export function compact(amount) {
  const abs = Math.abs(Number(amount) || 0)
  // if (abs >= 1e9) return `${(abs / 1e9).toFixed(2).replace(/\.00$/, '')}B`
  // if (abs >= 1e6) return `${(abs / 1e6).toFixed(1).replace(/\.0$/, '')}M`
  return Math.round(abs).toLocaleString('en-US')
}

export function axisMoney(value) {
  const abs = Math.abs(Number(value) || 0)
  if (abs >= 1e9) return `${(abs / 1e9).toFixed(1)}B`
  if (abs >= 1e6) return `${(abs / 1e6).toFixed(0)}M`
  return Math.round(abs).toLocaleString('en-US')
}

export function toman(amount) {
  return `${Number(amount || 0).toLocaleString('en-US')} Rials`
}

export function share(part, total) {
  if (!total) return '0%'
  return `${((Number(part) / Number(total)) * 100).toFixed(1)}%`
}

export function statusCount(status, label) {
  return status.find((item) => item.label === label)?.value ?? 0
}

export function orderAmount(order) {
  if (order.currency) return `${order.currency} ${Number(order.amount).toLocaleString('en-US')}`
  return toman(order.amount)
}

export function initials(name) {
  return name
    .replace(/^Dr\.\s*/, '')
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase()
}

export function avatarStyle(name) {
  const hue = (name.charCodeAt(0) * 37 + name.length * 13) % 360
  return { background: `hsl(${hue} 45% 93%)`, color: `hsl(${hue} 40% 28%)` }
}
