import { useMemo } from 'react'
import Box from '@mui/material/Box'
import { DataGrid } from '@mui/x-data-grid'
import { actionFirstColumns } from './actionFirstColumns'

function toGridColumns(columns, data) {
  return actionFirstColumns(columns).map((column) => {
    const sized = column.width != null
    return {
      field: column.id,
      headerName: column.label ?? '',
      type: column.type || (column.numeric ? 'number' : 'string'),
      sortable: column.sortable !== false,
      filterable: column.filterable !== false,
      width: sized ? column.width : undefined,
      minWidth: column.minWidth ?? (sized ? column.width : 90),
      flex: sized ? undefined : (column.flex ?? 1),
      align: column.align || 'left',
      headerAlign: column.align || 'left',
      valueGetter: (_value, row) => {
        if (column.valueGetter) return column.valueGetter(row)
        if (column.field) return row?.[column.field]
        const direct = row?.[column.id]
        if (direct == null || typeof direct === 'object') return undefined
        return direct
      },
      renderCell: (params) => {
        const index = data.indexOf(params.row)
        const value = column.render
          ? column.render(params.row, index < 0 ? 0 : index)
          : params.row?.[column.field]
        const hasStyle = column.sx || column.numeric || column.nowrap
        if (!hasStyle) return value
        return (
          <Box
            component="span"
            sx={{
              fontVariantNumeric: column.numeric ? 'tabular-nums' : undefined,
              whiteSpace: column.nowrap ? 'nowrap' : undefined,
              ...column.sx,
            }}
          >
            {value}
          </Box>
        )
      },
    }
  })
}

export default function MuiDataTable({
  columns,
  data = [],
  getRowKey,
  compact = true,
  emptyLabel = 'No records',
  ...gridProps
}) {
  const gridColumns = useMemo(() => toGridColumns(columns, data), [columns, data])
  const headerHeight = 44

  return (
    <Box className="sa-scroll" sx={{ width: '100%' }}>
      <DataGrid
        autoHeight
        columnHeaderHeight={gridProps.columnHeaderHeight ?? headerHeight}
        localeText={{ noRowsLabel: emptyLabel }}
        {...gridProps}
        disableColumnMenu
        pageSizeOptions={[10, 25, 50]}
        initialState={{
          ...gridProps.initialState,
          columns: {
            ...gridProps.initialState?.columns,
            dimensions: {
              ...gridProps.initialState?.columns?.dimensions,
              ...(gridProps.checkboxSelection ? { __check__: { width: 56, minWidth: 56, maxWidth: 56 } } : {}),
            },
          },
          pagination: {
            paginationModel: {
              page: 0,
              pageSize: 10,
              ...gridProps.initialState?.pagination?.paginationModel,
            },
          },
        }}
        rows={data}
        columns={gridColumns}
        getRowId={(row) => (getRowKey ? getRowKey(row) : row.id)}
        className={`sa-table${compact ? ' sa-table-compact' : ''}`}
        sx={{
          width: '100%',
          minWidth: '0 !important',
          maxWidth: '100%',
          border: 0,
          fontFamily: 'inherit',
          color: 'inherit',
          backgroundColor: 'transparent',
          '--DataGrid-containerBackground': '#f6f8fc',
          '& .MuiDataGrid-columnHeaders': {
            backgroundColor: '#f6f8fc',
            // borderBottom: '1px solid #e7ebf3',
          },
          '& .MuiDataGrid-columnHeader': {
            paddingLeft: '14px',
            paddingRight: '14px',
            backgroundColor: '#f6f8fc',
            '&:focus, &:focus-within': {
              outline: 'none',
            },
            '&:hover': {
              backgroundColor: '#eef2f8',
            },
          },
          '& .MuiDataGrid-columnHeaderTitleContainer': {
            overflow: 'hidden',
          },
          '& .MuiDataGrid-columnHeaderTitle': {
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            color: '#1e2768',
          },
          '& .MuiDataGrid-columnHeader--sorted .MuiDataGrid-columnHeaderTitle': {
            color: '#1e2768',
          },
          '& .MuiDataGrid-columnHeader--sorted .MuiDataGrid-sortIcon': {
            color: '#1e2768',
          },
          '& .MuiDataGrid-columnSeparator': {
            opacity: 0,
          },
          '& .MuiDataGrid-columnHeader:hover .MuiDataGrid-columnSeparator': {
            opacity: 1,
            color: '#c5cedd',
          },
          '& .MuiDataGrid-cell': {
            padding: '0 14px',
            borderBottom: '1px solid #f6f8fb',
            fontSize: '0.84rem',
            lineHeight: 1.4,
            display: 'flex',
            alignItems: 'center',
          },
          '& .MuiDataGrid-columnHeaderCheckbox, & .MuiDataGrid-cellCheckbox': {
            padding: '0 !important',
            justifyContent: 'center',
          },
          '& .MuiDataGrid-columnHeaderCheckbox .MuiCheckbox-root, & .MuiDataGrid-cellCheckbox .MuiCheckbox-root': {
            padding: '6px',
          },
          '& .MuiDataGrid-cellEmpty': {
            padding: '0 !important',
            border: 0,
            minWidth: 0,
          },
          '& .MuiDataGrid-cell[data-field="action"], & .MuiDataGrid-cell[data-field="actions"]': {
            justifyContent: 'center',
            paddingLeft: '8px',
            paddingRight: '8px',
            overflow: 'visible',
          },
          '& .MuiDataGrid-columnHeader[data-field="action"], & .MuiDataGrid-columnHeader[data-field="actions"]': {
            paddingLeft: '8px',
            paddingRight: '8px',
          },
          '& .MuiDataGrid-columnHeader[data-field="action"] .MuiDataGrid-columnHeaderTitleContainer, & .MuiDataGrid-columnHeader[data-field="actions"] .MuiDataGrid-columnHeaderTitleContainer': {
            justifyContent: 'center',
          },
          '& .MuiDataGrid-row:last-of-type .MuiDataGrid-cell': {
            borderBottom: 0,
          },
          '& .MuiDataGrid-row:not(.Mui-selected):hover': {
            backgroundColor: '#fafbfe',
          },
          '& .MuiDataGrid-footerContainer': {
            borderTop: '1px solid #f1f4f9',
            width: '100%',
            overflow: 'visible',
          },
          '& .MuiTablePagination-toolbar': {
            width: '100%',
            boxSizing: 'border-box',
          },
          '& .MuiTablePagination-selectLabel': {
            display: 'block !important',
          },
          '& .MuiTablePagination-input': {
            display: 'inline-flex !important',
          },
          '& .MuiTablePagination-select': {
            paddingLeft: '4px !important',
            paddingRight: '24px !important',
          },
          '& .MuiDataGrid-overlay': {
            backgroundColor: 'transparent',
            color: '#64748b',
            fontSize: '0.84rem',
          },
          ...gridProps.sx,
        }}
      />
    </Box>
  )
}
