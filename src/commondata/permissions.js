const FULL_ACCESS = new Set(["SuperAdmin", "Admin"])

export function normalizePermissions(value) {
  if (value == null || value === "") return null
  let data = value
  if (typeof data === "string") {
    try {
      data = JSON.parse(data)
    } catch {
      return null
    }
  }
  if (Array.isArray(data)) {
    const map = {}
    data.forEach((item) => {
      const name = item?.name || item?.model
      const list = item?.permissions || item?.Permission
      if (name && Array.isArray(list)) map[name] = list
    })
    return Object.keys(map).length ? JSON.stringify(map) : null
  }
  if (typeof data === "object") return JSON.stringify(data)
  return null
}

export function readPermissions(value) {
  const raw = normalizePermissions(value)
  if (!raw) return {}
  try {
    const parsed = JSON.parse(raw)
    return parsed && typeof parsed === "object" && !Array.isArray(parsed) ? parsed : {}
  } catch {
    return {}
  }
}

const ALSO = {
  add: ["create"],
  create: ["add"],
  "add-trash": ["delete"],
  "soft-delete": ["delete"],
  trash: ["delete"],
  "view-trash": ["delete"],
  "restore-trash": ["delete"],
  restore: ["delete"],
  "srestore-trash": ["delete"],
  "delete-trash": ["delete"],
}

const MODEL_ALIASES = {
  carrier: ["shipping"],
  shippingzone: ["shipping"],
  withdrawl: ["withdrawal", "affiliate"],
  affiliatecoupon: ["affiliate"],
}

function listForName(permissions, name) {
  if (Array.isArray(permissions[name])) return permissions[name]
  const key = Object.keys(permissions).find((item) => item.toLowerCase() === String(name).toLowerCase())
  return key && Array.isArray(permissions[key]) ? permissions[key] : null
}

function permissionList(permissions, model) {
  if (!permissions || typeof permissions !== "object" || !model) return null
  const names = [model, ...(MODEL_ALIASES[String(model).toLowerCase()] || [])]
  for (const name of names) {
    const list = listForName(permissions, name)
    if (list) return list
  }
  return null
}

export function hasPermission(role, permissions, model, action) {
  if (FULL_ACCESS.has(role)) return true
  const list = permissionList(permissions, model)
  if (!list) return false
  if (list.includes(action)) return true
  if (action === "view" && ["add", "create", "edit", "delete", "export"].some((name) => list.includes(name))) return true
  return (ALSO[action] || []).some((name) => list.includes(name))
}

export function allow(model, action) {
  if (typeof localStorage === "undefined") return false
  return hasPermission(
    localStorage.getItem("role"),
    readPermissions(localStorage.getItem("permissions")),
    model,
    action,
  )
}

export function isFullAccess(role, country) {
  if (role === "Admin") return true
  return role === "SuperAdmin" && Boolean(country) && country !== "null"
}
