function columnKey(column) {
  return String(column?.id || column?.field || column?.key || '').trim().toLowerCase()
}

function columnLabel(column) {
  return String(column?.label || column?.headerName || column?.name || column?.title || '').trim().toLowerCase()
}

export function isActionColumn(column) {
  const key = columnKey(column)
  const label = columnLabel(column)
  return key === 'action' || key === 'actions' || label === 'action' || label === 'actions'
}

export function actionFirstColumns(columns) {
  if (!Array.isArray(columns)) return columns
  const index = columns.findIndex(isActionColumn)
  if (index <= 0) return columns
  const next = columns.slice()
  const [action] = next.splice(index, 1)
  next.unshift(action)
  return next
}
