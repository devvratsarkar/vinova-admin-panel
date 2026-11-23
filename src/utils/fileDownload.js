import { useState } from 'react'
import { useDispatch } from 'react-redux'
import toast from 'react-hot-toast'
import { allow } from '../commondata/permissions'

export function csvRequest(url, params, filename) {
  return {
    url,
    params: { ...params, export: true },
    responseHandler: async (response) => {
      const type = response.headers.get('content-type') || ''
      if (!response.ok || type.includes('json')) return null
      return { blob: await response.blob(), filename }
    },
  }
}

function saveFile(blob, filename) {
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  link.remove()
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}

export function useCsvDownload(endpoint, successMessage) {
  const dispatch = useDispatch()
  const [exporting, setExporting] = useState(false)

  const download = async (args = {}) => {
    if (exporting) return
    setExporting(true)
    const request = dispatch(endpoint.initiate({ ...args, export: true }, { subscribe: false, forceRefetch: true }))
    try {
      const file = await request.unwrap()
      if (file?.blob instanceof Blob && file.blob.size) {
        saveFile(file.blob, file.filename || 'export.csv')
        toast.success(successMessage)
      }
    } catch (error) {
      console.error(error)
    } finally {
      request.unsubscribe?.()
      setExporting(false)
    }
  }

  return { download, exporting }
}

export function useExportAction(endpoint, model, successMessage) {
  const { download, exporting } = useCsvDownload(endpoint, successMessage)
  const onExport = allow(model, 'export')
    ? (query, skip) => {
      if (skip) return
      download(query || {})
    }
    : undefined
  return { onExport, exporting }
}

export function exportProps(action, query, skip) {
  if (!action?.onExport) return {}
  return {
    onExport: () => action.onExport(query, skip),
    exporting: action.exporting,
  }
}
