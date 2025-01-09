'use client'

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
import { ClipboardCheck } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useRouter } from 'next/navigation'

function getStatusBgColor(status: boolean): string {
    if (status === false) {
        return 'var(--bg-warning-color)'
    } else {
        return 'var(--bg-success-color)'
    }
}

function getStatusTextColor(status: boolean): string {
    if (status === false) {
        return 'var(--text-warning-color)'
    } else {
        return 'var(--text-success-color)'
    }
}

// function getStatusBgColor1(status: boolean): string {
//     if (status === false) {
//         return 'var(--bg-warning-color1)'
//     } else {
//         return 'var(--bg-success-color1)'
//     }
// }

// function getStatusTextColor1(status: boolean): string {
//     if (status === false) {
//         return 'var(--text-warning-color1)'
//     } else {
//         return 'var(--text-success-color1)'
//     }
// }

interface IGetAllRules {
    Id: string
    Name: string
    SalaryCoefficident: number
    Description: string
    IsActive: boolean
}

interface IProps {
    rewardsData: IGetAllRules[]
    totalRecords: number
}

function TableErrorReport({ rewardsData, totalRecords }: IProps) {
    const { t } = useTranslation('common')
    const router = useRouter()
    const [selected, setSelected] = useState<number[]>([])
    const [openDialog, setOpenDialog] = useState(false)
    const [selectedRow, setSelectedRow] = useState<number | null>(null)
    const [order, setOrder] = useState<'asc' | 'desc'>('asc')
    const [orderBy, setOrderBy] = useState<string>('')
    // const [selectedConfig, setSelectedConfig] = useState<IGetAllSysConfiguration | null>(null)
    const [openModal, setOpenModal] = useState(false)

    // const handleClickDetail = (config: IGetAllSysConfiguration) => {
    //     setSelectedConfig(config)
    //     setOpenModal(true)
    // }

    useEffect(() => {}, [
        totalRecords,
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
            <Table>
                <TableHead>
                    <TableRow
                        sx={{
                            backgroundColor: 'var(--header-table-dashboard)',
                            '&:last-child td, &:last-child th': {
                                border: 'none'
                            }
                        }}
                    >
                        <TableCell sx={{ borderColor: 'var(--border-color)', padding: '16px 30px 16px 24px' }}>
                            <TableSortLabel
                                active={'Name' === orderBy}
                                direction={orderBy === 'Name' ? order : 'asc'}
                                onClick={() => handleSort('Name')}
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
                                        maxWidth: '300px',
                                        textOverflow: 'ellipsis',
                                        whiteSpace: 'nowrap'
                                    }}
                                >
                                    {t('Tên chức vụ')}
                                </Typography>
                            </TableSortLabel>
                        </TableCell>

                        <TableCell sx={{ borderColor: 'var(--border-color)' }}>
                            <TableSortLabel
                                active={'SalaryCoefficident' === orderBy}
                                direction={orderBy === 'SalaryCoefficident' ? order : 'asc'}
                                onClick={() => handleSort('SalaryCoefficident')}
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
                                        maxWidth: '100px',
                                        overflow: 'hidden',
                                        ml: '8px',
                                        textOverflow: 'ellipsis',
                                        whiteSpace: 'nowrap'
                                    }}
                                >
                                    {t('Hệ số lương')}
                                </Typography>
                            </TableSortLabel>
                        </TableCell>

                        <TableCell sx={{ borderColor: 'var(--border-color)' }}>
                            <TableSortLabel
                                active={'Description' === orderBy}
                                direction={orderBy === 'Description' ? order : 'asc'}
                                onClick={() => handleSort('Description')}
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
                                        maxWidth: '280px',
                                        overflow: 'hidden',
                                        ml: '8px',
                                        textOverflow: 'ellipsis',
                                        whiteSpace: 'nowrap'
                                    }}
                                >
                                    {t('Mô tả')}
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

                        <TableCell sx={{ borderColor: 'var(--border-color)', padding: '16px 24px' }}>
                            <Typography
                                sx={{
                                    fontWeight: 'bold',
                                    color: 'var(--text-color)',
                                    fontSize: '16px',
                                    overflow: 'hidden',
                                    textAlign: 'center',
                                    maxWidth: '280px',
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
                    {rewardsData &&
                        rewardsData.map((row: IGetAllRules, index: number) => (
                            <TableRow
                                key={index}
                                sx={{
                                    '&:last-child td, &:last-child th': {
                                        border: 'none'
                                    }
                                }}
                            >
                                <TableCell
                                    sx={{
                                        borderColor: 'var(--border-color)',
                                        borderStyle: 'dashed',
                                        padding: '16px 24px 16px 24px'
                                    }}
                                >
                                    <Box
                                        sx={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '14px'
                                        }}
                                    >
                                        <Avatar
                                            sx={{
                                                mt: '-2px'
                                            }}
                                            src={
                                                'https://localhost:44381/avatars/aa1678f0-75b0-48d2-ae98-50871178e9bd.jfif'
                                            }
                                        />

                                        <Box>
                                            <Typography
                                                sx={{
                                                    color: 'var(--text-color)',
                                                    fontSize: '16px',
                                                    maxWidth: '260px',
                                                    overflow: 'hidden',
                                                    textOverflow: 'ellipsis',
                                                    whiteSpace: 'nowrap'
                                                }}
                                            >
                                                {row.Name}
                                            </Typography>
                                            <Typography
                                                sx={{
                                                    color: 'var(--created-date-color)',
                                                    fontSize: '16px',
                                                    mt: '-0px',
                                                    overflow: 'hidden',
                                                    textOverflow: 'ellipsis',
                                                    whiteSpace: 'nowrap'
                                                }}
                                            >
                                                {row.Id}
                                            </Typography>
                                        </Box>
                                    </Box>
                                </TableCell>

                                <TableCell sx={{ borderColor: 'var(--border-color)', borderStyle: 'dashed' }}>
                                    <Typography
                                        sx={{
                                            color: 'var(--text-color)',
                                            fontSize: '16px',
                                            maxWidth: '100px',
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                            whiteSpace: 'nowrap',
                                            ml: '40px'
                                        }}
                                    >
                                        {row.SalaryCoefficident}
                                    </Typography>
                                </TableCell>

                                <TableCell
                                    sx={{
                                        borderStyle: 'dashed',
                                        borderColor: 'var(--border-color)'
                                    }}
                                >
                                    <Typography
                                        sx={{
                                            color: 'var(--text-color)',
                                            fontSize: '16px',
                                            maxWidth: '280px',
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                            whiteSpace: 'nowrap',
                                            ml: '100px'
                                        }}
                                    >
                                        {row.Description}
                                    </Typography>
                                </TableCell>

                                <TableCell
                                    sx={{
                                        borderStyle: 'dashed',
                                        borderColor: 'var(--border-color)',
                                        padding: '11px'
                                    }}
                                >
                                    <Box
                                        sx={{
                                            borderRadius: '8px',
                                            padding: '5px 10px',
                                            display: 'flex',
                                            minWidth: '100px',
                                            justifyContent: 'center',
                                            backgroundColor: getStatusBgColor(row.IsActive)
                                        }}
                                    >
                                        <Typography
                                            sx={{
                                                fontSize: '15px',
                                                overflow: 'hidden',
                                                color: getStatusTextColor(row.IsActive),
                                                width: 'auto',
                                                fontWeight: 'bold',
                                                display: 'inline-block',
                                                textOverflow: 'ellipsis',
                                                whiteSpace: 'nowrap'
                                            }}
                                        >
                                            {row.IsActive
                                                ? t('COMMON.REWARD_DISCIPLINE.PROCESSED')
                                                : t('COMMON.REWARD_DISCIPLINE.UNPROCESSED')}
                                        </Typography>
                                    </Box>
                                </TableCell>

                                <TableCell
                                    sx={{
                                        borderStyle: 'dashed',
                                        padding: '16px 24px',
                                        borderColor: 'var(--border-color)',
                                        width: '146px',
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
                                        <Tooltip title={t('COMMON.REWARD_DISCIPLINE.VIEW_DETAIL')}>
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
                                            >
                                                <ClipboardCheck />
                                            </Box>
                                        </Tooltip>
                                    </Box>
                                </TableCell>
                            </TableRow>
                        ))}
                </TableBody>
            </Table>
        </TableContainer>
    )
}

export default TableErrorReport
