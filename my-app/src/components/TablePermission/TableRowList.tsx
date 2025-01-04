import { TableCell, TableRow, Typography } from '@mui/material'
import deepEqual from 'deep-equal'
import { Fragment, memo, useMemo } from 'react'
import { IFunctions, ITablePermission } from '@/models/TablePermissionModel'
import CustomListTable from './TableList'
import CustomTableCellCheckbox from './TableCellCheckbox'
import TableCellLabel from './TableCellLabel'

interface Props {
    data: ITablePermission
    level?: number
}

const keyNames: (keyof IFunctions)[] = [
    'IsAllowAll',
    'IsAllowView',
    'IsAllowEdit',
    'IsAllowCreate',
    'IsAllowPrint',
    'IsAllowDelete'
]

function TableRowList({ data, level = 0 }: Props) {
    const isCheckBox = useMemo(() => {
        if (data.ParentId) {
            return true
        } else {
            return false
        }
    }, [data.ParentId])

    return (
        <>
            <TableRow
                key={data.Name}
                sx={{
                    background: !isCheckBox
                        ? 'var(--header-color-table)' //'rgb(83 173 247 / 10%)'
                        : 'var(--background-color)'
                }}
            >
                <TableCell component='th' scope='row' sx={{ color: 'var(--text-color)' }}>
                    <Typography sx={{ paddingLeft: 6 * level }}>{data.Name}</Typography>
                </TableCell>

                {data.PathTo.includes('statistics') ? (
                    <>
                        <Fragment>
                            <TableCell
                                size='small'
                                align='center'
                                sx={{
                                    maxWidth: 100,
                                    minWidth: 100,
                                    paddingLeft: 1,
                                    paddingRight: 1
                                }}
                            ></TableCell>
                        </Fragment>
                        {data.Name === 'Statistics' ? (
                            <TableCellLabel id={Number(data.Id || 0)} keyName={'IsAllowView'} />
                        ) : (
                            <Fragment key={'IsAllowView'}>
                                <CustomTableCellCheckbox
                                    id={Number(data.Id || 0)}
                                    checked={data.Function?.['IsAllowView'] || false}
                                    keyName={'IsAllowView'}
                                />
                            </Fragment>
                        )}
                        <Fragment>
                            <TableCell
                                size='small'
                                align='center'
                                sx={{
                                    maxWidth: 100,
                                    minWidth: 100,
                                    paddingLeft: 1,
                                    paddingRight: 1
                                }}
                            ></TableCell>
                        </Fragment>
                        <Fragment>
                            <TableCell
                                size='small'
                                align='center'
                                sx={{
                                    maxWidth: 100,
                                    minWidth: 100,
                                    paddingLeft: 1,
                                    paddingRight: 1
                                }}
                            ></TableCell>
                        </Fragment>
                        <Fragment>
                            <TableCell
                                size='small'
                                align='center'
                                sx={{
                                    maxWidth: 100,
                                    minWidth: 100,
                                    paddingLeft: 1,
                                    paddingRight: 1
                                }}
                            ></TableCell>
                        </Fragment>
                        <Fragment>
                            <TableCell
                                size='small'
                                align='center'
                                sx={{
                                    maxWidth: 100,
                                    minWidth: 100,
                                    paddingLeft: 1,
                                    paddingRight: 1
                                }}
                            ></TableCell>
                        </Fragment>
                    </>
                ) : (
                    keyNames.map(item => (
                        <Fragment key={item}>
                            {isCheckBox ? (
                                <CustomTableCellCheckbox
                                    id={Number(data.Id || 0)}
                                    checked={data.Function?.[item] || false}
                                    keyName={item}
                                />
                            ) : (
                                <TableCellLabel id={Number(data.Id || 0)} keyName={item} />
                            )}
                        </Fragment>
                    ))
                )}
            </TableRow>

            <CustomListTable data={data?.Children || []} level={level + 1} />
        </>
    )
}

export default memo(TableRowList, (prevProps: Props, currentProps: Props) => {
    return deepEqual(prevProps.data, currentProps.data)
})
