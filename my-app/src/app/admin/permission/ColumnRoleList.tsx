interface Column {
    id: 'Id' | 'Name' | 'Action'
    label: string
    sortable: boolean
    width?: string
    minWidth?: number
    maxWidth?: string
    align?: 'left' | 'center' | 'right'
    format?: (value: number) => string
}
export const Columns: readonly Column[] = [
    {
        id: 'Id',
        label: 'COMMON.TABLE.COMMON.ID',
        align: 'center',
        format: (value: number) => value.toString(),
        width: '5%',
        minWidth: 50,
        maxWidth: '200px',
        sortable: false
    },
    {
        id: 'Name',
        label: 'COMMON.TABLE.PERMISSION.ROLE.NAME',
        align: 'left',
        width: '30%',
        maxWidth: '200px',
        sortable: true
    },
    {
        id: 'Action',
        label: 'COMMON.TABLE.COMMON.ACTION',
        width: '5%',
        align: 'center',
        sortable: false
    }
]
