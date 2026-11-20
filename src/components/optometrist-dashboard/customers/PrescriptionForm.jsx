import toast from 'react-hot-toast'
import {
  useAddOptometristPrescriptionMutation,
  useReuploadOptometristPrescriptionMutation,
  useUpdateOptometristPrescriptionMutation,
  useUploadOptometristPrescriptionMutation,
} from '../../../redux/features/optometristAPIEndPoint'
import AddPrescriptionModal from './AddPrescriptionModal'

function toApiDate(value) {
  const [year, month, day] = String(value || '').slice(0, 10).split('-')
  return day && month && year ? `${day}/${month}/${year}` : value
}

function saved(response) {
  const body = response?.data
  return body?.success === true || body?.http_status_code === 200 || body?.http_status_code === 201
}

export default function PrescriptionForm({ show, mode, customer, prescription, onClose, onSaved }) {
  const [addPrescription, { isLoading: isAdding }] = useAddOptometristPrescriptionMutation()
  const [uploadPrescription, { isLoading: isUploading }] = useUploadOptometristPrescriptionMutation()
  const [updatePrescription, { isLoading: isUpdating }] = useUpdateOptometristPrescriptionMutation()
  const [reuploadPrescription, { isLoading: isReuploading }] = useReuploadOptometristPrescriptionMutation()
  const isSaving = isAdding || isUploading || isUpdating || isReuploading

  const save = async (vals) => {
    try {
      if (vals.source === 'uploaded') {
        const formData = new FormData()
        formData.append('customer_id', vals.customer_id)
        formData.append('date_of_prescription', vals.issued_at)
        formData.append('valid_until', vals.valid_until)
        formData.append('file', vals.file)
        formData.append('notes', vals.notes || '')
        const response = vals.id
          ? await reuploadPrescription({ id: vals.id, formData })
          : await uploadPrescription(formData)
        if (!saved(response)) return
        toast.success(response?.data?.message || (vals.id ? 'Prescription reuploaded' : 'Prescription uploaded'))
        onSaved?.()
        onClose()
        return
      }
      const payload = {
        customer_id: vals.customer_id,
        date_of_prescription: toApiDate(vals.issued_at),
        valid_until: toApiDate(vals.valid_until),
        doctor_name: vals.doctor_name,
        notes: vals.notes || '',
        manual: {
          prescription: {
            right_eye_od: vals.right_eye_od,
            left_eye_os: vals.left_eye_os,
            add: vals.add || '',
          },
          pupillary_distance: {
            option: 'pdVal',
            number_of_values: vals.countPd,
            values: {
              pd_value_1: vals.pd_value_1,
              ...(vals.countPd === '2' ? { pd_value_2: vals.pd_value_2 } : {}),
            },
          },
        },
      }
      const response = vals.id
        ? await updatePrescription({ id: vals.id, ...payload })
        : await addPrescription(payload)
      if (!saved(response)) return
      toast.success(response?.data?.message || (vals.id ? 'Prescription updated' : 'Prescription saved'))
      onSaved?.()
      onClose()
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <AddPrescriptionModal
      key={`${mode}-${prescription?._id || prescription?.id || 'new'}-${show ? 'open' : 'closed'}`}
      show={show}
      mode={mode}
      customer={customer}
      prescription={prescription}
      isSaving={isSaving}
      onClose={onClose}
      onSubmit={save}
    />
  )
}
