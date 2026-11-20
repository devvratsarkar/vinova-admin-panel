import DataTable from 'react-data-table-component'
import { actionFirstColumns } from './actionFirstColumns'

export default function ActionFirstDataTable({ columns, ...props }) {
  return <DataTable columns={actionFirstColumns(columns)} {...props} />
}
