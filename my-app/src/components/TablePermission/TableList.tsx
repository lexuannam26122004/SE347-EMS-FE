import { Fragment, memo } from 'react'
import { ITablePermission } from '@/models/TablePermissionModel'
import CustomTableRow from './TableRowList'

interface Props {
    data: any
    level?: number
}

const TableList = memo(({ data, level = 0 }: Props) => {
    return (
        <Fragment>
            {data.map((item: ITablePermission) => (
                <CustomTableRow data={item} key={item.Id} level={level} />
            ))}
        </Fragment>
    )
})

TableList.displayName = 'TableList'

export default TableList
