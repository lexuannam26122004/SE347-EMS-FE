'use client'
import { formatDate } from '@/utils/formatDate'
import {
    Box,
    Typography,
    Tooltip,
    TableRow,
    TableBody,
    Table,
    TableCell,
    TableHead,
    TableContainer,
    TableSortLabel,
    Avatar
} from '@mui/material'
import { EyeIcon } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useRouter } from 'next/navigation'
import DetailError from './DetailError'

function getStatusBgColor(status: string): string {
    if (status === '3') {
        return 'var(--bg-danger-color)'
    } else if (status === '0') {
        return 'var(--bg-warning-color)'
    } else if (status === '2') {
        return 'var(--bg-success-color)'
    } else {
        return 'var(--bg-closed-color)'
    }
}

function getStatusTextColor(status: string): string {
    if (status === '3') {
        return 'var(--text-danger-color)'
    } else if (status === '0') {
        return 'var(--text-warning-color)'
    } else if (status === '2') {
        return 'var(--text-success-color)'
    } else {
        return 'var(--text-closed-color)'
    }
}

// function getStatusBgColor1(status: string): string {
//     if (status === 'Rejected') {
//         return 'var(--bg-danger-color1)'
//     } else if (status === 'Pending') {
//         return 'var(--bg-warning-color1)'
//     } else if (status === 'Resolved') {
//         return 'var(--bg-success-color1)'
//     } else {
//         return 'var(--bg-closed-color1)'
//     }
// }

// function getStatusTextColor1(status: string): string {
//     if (status === 'Rejected') {
//         return 'var(--text-danger-color1)'
//     } else if (status === 'Pending') {
//         return 'var(--text-warning-color1)'
//     } else if (status === 'Resolved') {
//         return 'var(--text-success-color1)'
//     } else {
//         return 'var(--text-closed-color1)'
//     }
// }

interface IGetAllErrorReport {
    Id: number | null
    ReportedBy: string | null
    ReportedDate: Date
    Type: number | null
    TypeId: string | null
    Description: string | null
    Status: string | null
    ResolvedBy: string | null
    ResolvedDate: Date | null
    ResolutionDetails: string | null
    ReportedFullName: string | null
    ReportedId: string | null
    ReportedAvatarPath: string | null
    ResolvedFullName: string | null
    ResolvedId: string | null
    ResolvedAvatarPath: string | null
}

interface IProps {
    errorsData: IGetAllErrorReport[]
    totalRecords: number
    type: number

    onSort: (property: string) => void
}

function TableErrorReport({ errorsData, totalRecords, type, onSort }: IProps) {
    const { t } = useTranslation('common')
    const router = useRouter()
    const [selected, setSelected] = useState<number[]>([])
    const [openDialog, setOpenDialog] = useState(false)
    const [selectedRow, setSelectedRow] = useState<number | null>(null)
    const [order, setOrder] = useState<'asc' | 'desc'>('asc')
    const [orderBy, setOrderBy] = useState<string>('')
    // const [selectedConfig, setSelectedConfig] = useState<IGetAllSysConfiguration | null>(null)
    const [openModal, setOpenModal] = useState(false)
    const [selectedConfig, setSelectedConfig] = useState<IGetAllErrorReport | null>(null)
    // const handleClickDetail = (config: IGetAllSysConfiguration) => {
    //     setSelectedConfig(config)
    //     setOpenModal(true)
    // }

    const handleClickDetail = (config: IGetAllErrorReport) => {
        setSelectedConfig(config)
        setOpenModal(true)
    }

    useEffect(() => {}, [
        totalRecords,
        type,
        selected,
        openDialog,
        selectedRow,
        order,
        orderBy,
        openModal,
        router,
        t,
        setSelected,
        setOpenDialog,
        setSelectedRow,
        setOrder,
        setOrderBy,
        setOpenModal
    ])

    const handleSort = (property: string) => {
        onSort(property)
        if (orderBy === property) {
            setOrder(order === 'asc' ? 'desc' : 'asc')
        } else {
            setOrder('asc')
        }
        setOrderBy(property)
    }

    return (
        <TableContainer
            sx={{
                scrollbarGutter: 'stable',
                paddingLeft: '7px',
                height: '303px',
                '&::-webkit-scrollbar': {
                    width: '7px',
                    height: '7px'
                },
                '&::-webkit-scrollbar-thumb': {
                    backgroundColor: 'var(--scrollbar-color)',
                    borderRadius: '10px'
                }
            }}
        >
            <Table stickyHeader>
                <TableHead>
                    <TableRow
                        sx={{
                            backgroundColor: 'var(--header-table-dashboard) !important', // Đặt !important để ưu tiên
                            '& th': {
                                backgroundColor: 'var(--header-table-dashboard) !important' // Áp dụng cho các ô
                            },
                            '&:last-child td, &:last-child th': {
                                border: 'none'
                            }
                        }}
                    >
                        <TableCell sx={{ borderColor: 'var(--border-color)' }}>
                            <TableSortLabel
                                active={'Type' === orderBy}
                                direction={orderBy === 'Type' ? order : 'asc'}
                                onClick={() => handleSort('Type')}
                                sx={{
                                    '& .MuiTableSortLabel-icon': {
                                        color: 'var(--text-color) !important'
                                    },
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center'
                                }}
                            >
                                <Typography
                                    sx={{
                                        fontWeight: 'bold',
                                        color: 'var(--text-color)',
                                        fontSize: '16px',
                                        textAlign: 'center',
                                        //maxWidth: '280px',
                                        overflow: 'hidden',
                                        ml: '8px',
                                        textOverflow: 'ellipsis',
                                        whiteSpace: 'nowrap'
                                    }}
                                >
                                    {t('COMMON.ERROR_REPORT.TYPE')}
                                </Typography>
                            </TableSortLabel>
                        </TableCell>

                        <TableCell sx={{ borderColor: 'var(--border-color)' }}>
                            <TableSortLabel
                                active={'ReportedDate' === orderBy}
                                direction={orderBy === 'ReportedDate' ? order : 'asc'}
                                onClick={() => handleSort('ReportedDate')}
                                sx={{
                                    '& .MuiTableSortLabel-icon': {
                                        color: 'var(--text-color) !important'
                                    }
                                }}
                            >
                                <Typography
                                    sx={{
                                        fontWeight: 'bold',
                                        color: 'var(--text-color)',
                                        //maxWidth: '400px',
                                        fontSize: '16px',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        whiteSpace: 'nowrap'
                                    }}
                                >
                                    {t('COMMON.ERROR_REPORT.REPORTED_DATE')}
                                </Typography>
                            </TableSortLabel>
                        </TableCell>

                        <TableCell sx={{ borderColor: 'var(--border-color)' }}>
                            <Typography
                                sx={{
                                    fontWeight: 'bold',
                                    color: 'var(--text-color)',
                                    fontSize: '16px',
                                    textAlign: 'center',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    whiteSpace: 'nowrap'
                                }}
                            >
                                {t('COMMON.ERROR_REPORT.STATUS')}
                            </Typography>
                        </TableCell>

                        {type >= 3 && (
                            <TableCell sx={{ borderColor: 'var(--border-color)' }}>
                                <TableSortLabel
                                    active={'FullNameResolved' === orderBy}
                                    direction={orderBy === 'FullNameResolved' ? order : 'asc'}
                                    onClick={() => handleSort('FullNameResolved')}
                                    sx={{
                                        '& .MuiTableSortLabel-icon': {
                                            color: 'var(--text-color) !important'
                                        }
                                    }}
                                >
                                    <Typography
                                        sx={{
                                            fontWeight: 'bold',
                                            color: 'var(--text-color)',
                                            fontSize: '16px',
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                            whiteSpace: 'nowrap'
                                        }}
                                    >
                                        {t('COMMON.ERROR_REPORT.FULL_NAME_RESOLVED')}
                                    </Typography>
                                </TableSortLabel>
                            </TableCell>
                        )}

                        {type >= 3 && (
                            <TableCell sx={{ borderColor: 'var(--border-color)' }}>
                                <TableSortLabel
                                    active={'ResolvedDate' === orderBy}
                                    direction={orderBy === 'ResolvedDate' ? order : 'asc'}
                                    onClick={() => handleSort('ResolvedDate')}
                                    sx={{
                                        '& .MuiTableSortLabel-icon': {
                                            color: 'var(--text-color) !important'
                                        }
                                    }}
                                >
                                    <Typography
                                        sx={{
                                            fontWeight: 'bold',
                                            color: 'var(--text-color)',
                                            fontSize: '16px',
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                            whiteSpace: 'nowrap'
                                        }}
                                    >
                                        {t('COMMON.ERROR_REPORT.RESOLVED_DATE')}
                                    </Typography>
                                </TableSortLabel>
                            </TableCell>
                        )}

                        <TableCell sx={{ borderColor: 'var(--border-color)', padding: '16px 24px' }}>
                            <Typography
                                sx={{
                                    fontWeight: 'bold',
                                    color: 'var(--text-color)',
                                    fontSize: '16px',
                                    overflow: 'hidden',
                                    textAlign: 'center',
                                    //maxWidth: '280px',
                                    textOverflow: 'ellipsis',
                                    whiteSpace: 'nowrap'
                                }}
                            >
                                {t('COMMON.ERROR_REPORT.ACTION')}
                            </Typography>
                        </TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {errorsData &&
                        errorsData.map((row: IGetAllErrorReport, index: number) => (
                            <TableRow
                                key={index}
                                sx={{
                                    '&:last-child td, &:last-child th': {
                                        border: 'none'
                                    }
                                }}
                            >
                                <TableCell sx={{ borderColor: 'var(--border-color)' }}>
                                    <Box
                                        sx={{
                                            color: getStatusBgColor(row?.Status),
                                            fontSize: '15px',
                                            overflow: 'hidden',
                                            borderRadius: '8px',
                                            border: '1px dashed var(--border-color)',
                                            display: 'flex',
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            padding: '5px',
                                            //maxWidth: '280px',
                                            textOverflow: 'ellipsis',
                                            whiteSpace: 'nowrap'
                                        }}
                                    >
                                        {t(String(row?.Type))}
                                    </Box>
                                </TableCell>

                                <TableCell sx={{ borderColor: 'var(--border-color)' }}>
                                    <Typography
                                        sx={{
                                            color: 'var(--text-color)',
                                            fontSize: '16px',
                                            //maxWidth: '280px',
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                            whiteSpace: 'nowrap'
                                        }}
                                    >
                                        {formatDate(row?.ReportedDate?.toString())}
                                    </Typography>
                                </TableCell>

                                <TableCell sx={{ borderColor: 'var(--border-color)', padding: '11px' }}>
                                    <Box
                                        sx={{
                                            borderRadius: '8px',
                                            padding: '5px',
                                            display: 'flex',
                                            //minWidth: '100px',
                                            justifyContent: 'center',
                                            backgroundColor: getStatusBgColor(row?.Status)
                                        }}
                                    >
                                        <Typography
                                            sx={{
                                                fontSize: '15px',
                                                overflow: 'hidden',
                                                color: getStatusTextColor(row?.Status),
                                                width: 'auto',
                                                fontWeight: 'bold',
                                                display: 'inline-block',
                                                textOverflow: 'ellipsis',
                                                whiteSpace: 'nowrap'
                                            }}
                                        >
                                            {row?.Status === '1'
                                                ? 'In Progress'
                                                : row?.Status === '2'
                                                  ? 'Resolved'
                                                  : row?.Status === '3'
                                                    ? 'Rejected'
                                                    : 'Pending'}
                                        </Typography>
                                    </Box>
                                </TableCell>

                                {type >= 3 && (
                                    <TableCell sx={{ borderColor: 'var(--border-color)', padding: '0 16px' }}>
                                        <Box
                                            sx={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '14px'
                                            }}
                                        >
                                            <Avatar
                                                src={
                                                    row?.ResolvedAvatarPath ||
                                                    'https://localhost:44381/avatars/aa1678f0-75b0-48d2-ae98-50871178e9bd.jfif'
                                                }
                                            />

                                            <Box>
                                                <Typography
                                                    sx={{
                                                        color: 'var(--text-color)',
                                                        fontSize: '16px',
                                                        //maxWidth: '260px',
                                                        overflow: 'hidden',
                                                        textOverflow: 'ellipsis',
                                                        whiteSpace: 'nowrap'
                                                    }}
                                                >
                                                    {row?.ResolvedFullName}
                                                </Typography>
                                                <Typography
                                                    sx={{
                                                        color: 'var(--created-date-color)',
                                                        fontSize: '16px',
                                                        overflow: 'hidden',
                                                        textOverflow: 'ellipsis',
                                                        whiteSpace: 'nowrap'
                                                    }}
                                                >
                                                    {row?.ResolvedId}
                                                </Typography>
                                            </Box>
                                        </Box>
                                    </TableCell>
                                )}

                                {type >= 3 && (
                                    <TableCell sx={{ borderColor: 'var(--border-color)' }}>
                                        <Typography
                                            sx={{
                                                color: 'var(--text-color)',
                                                fontSize: '16px',
                                                //maxWidth: '280px',
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis',
                                                whiteSpace: 'nowrap'
                                            }}
                                        >
                                            {formatDate(row?.ResolvedDate?.toString())}
                                        </Typography>
                                    </TableCell>
                                )}

                                <TableCell
                                    sx={{
                                        padding: '16px 24px',
                                        borderColor: 'var(--border-color)',
                                        //width: '146px',
                                        cursor: 'pointer'
                                    }}
                                >
                                    <Box
                                        display='flex'
                                        alignItems='center'
                                        justifyContent='center'
                                        sx={{
                                            cursor: 'pointer'
                                        }}
                                    >
                                        <Tooltip title={t('COMMON.BUTTON.VIEW_DETAIL')}>
                                            <Box
                                                display='flex'
                                                alignItems='center'
                                                justifyContent='center'
                                                sx={{
                                                    color: '#00d100',
                                                    borderRadius: '50%',
                                                    width: '42px',
                                                    height: '42px',
                                                    '&:hover': {
                                                        backgroundColor: 'var(--hover-color)'
                                                    }
                                                }}
                                                onClick={() => handleClickDetail(row)}
                                            >
                                                <EyeIcon />
                                            </Box>
                                        </Tooltip>
                                    </Box>
                                </TableCell>
                            </TableRow>
                        ))}
                </TableBody>
            </Table>
            {selectedConfig && (
                <DetailError handleToggle={() => setOpenModal(false)} open={openModal} configuration={selectedConfig} />
            )}
        </TableContainer>
    )
}

export default TableErrorReport
