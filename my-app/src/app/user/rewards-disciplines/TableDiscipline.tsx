'use client'
import { formatDate } from '@/utils/formatDate'
import { formatNumberToMoney } from '@/utils/formatNumberWithUnit'
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
    TableSortLabel
} from '@mui/material'
import { EyeIcon } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import Loading from '@/components/Loading'
import { authSelector } from '@/redux/slices/authSlice'
import { useSelector } from 'react-redux'
import { IFilterReward } from '@/models/Reward'
import DetailModal from '@/app/admin/discipline/DetailModal'

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

interface IGetAllDiscipline {
    Id: number
    FullName: string
    AvatarPath: string
    EmployeeId: string
    Department: string
    Date: string
    Money?: number
    Reason: string
    Note: string
    IsPenalized: boolean
}

interface IProps {
    disciplinesData: IGetAllDiscipline[]
    setFilter: React.Dispatch<React.SetStateAction<IFilterReward>>
    refetch: () => void
}

function TableErrorReport({ disciplinesData, setFilter }: IProps) {
    const { t } = useTranslation('common')
    const [order, setOrder] = useState<'asc' | 'desc'>('asc')
    const [orderBy, setOrderBy] = useState<string>('')
    const [selectedDiscipline, setSelectedDiscipline] = useState<IGetAllDiscipline | null>(null)
    const [openModal, setOpenModal] = useState(false)

    const handleClickDetail = (discipline: IGetAllDiscipline) => {
        setSelectedDiscipline(discipline)
        setOpenModal(true)
    }
    const handleSort = (property: string) => {
        setFilter(prev => ({
            ...prev,
            sortBy: property,
            isDescending: orderBy === property && order === 'asc' ? true : false
        }))
        if (orderBy === property) {
            setOrder(order === 'asc' ? 'desc' : 'asc')
        } else {
            setOrder('asc')
        }
        setOrderBy(property)
    }

    const menuLeft = useSelector(authSelector)

    if (menuLeft === null || Object.keys(menuLeft).length === 0) {
        return <Loading />
    }

    return (
        <>
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
                                    active={'Date' === orderBy}
                                    direction={orderBy === 'Date' ? order : 'asc'}
                                    onClick={() => handleSort('Date')}
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
                                        {t('COMMON.REWARD_DISCIPLINE.DATE')}
                                    </Typography>
                                </TableSortLabel>
                            </TableCell>

                            <TableCell sx={{ borderColor: 'var(--border-color)' }}>
                                <TableSortLabel
                                    active={'Reason' === orderBy}
                                    direction={orderBy === 'Reason' ? order : 'asc'}
                                    onClick={() => handleSort('Reason')}
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
                                            maxWidth: '400px',
                                            fontSize: '16px',
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                            whiteSpace: 'nowrap'
                                        }}
                                    >
                                        {t('COMMON.REWARD_DISCIPLINE.REASON')}
                                    </Typography>
                                </TableSortLabel>
                            </TableCell>

                            <TableCell sx={{ borderColor: 'var(--border-color)' }}>
                                <TableSortLabel
                                    active={'Reason' === orderBy}
                                    direction={orderBy === 'Reason' ? order : 'asc'}
                                    onClick={() => handleSort('Reason')}
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
                                        {t('COMMON.REWARD_DISCIPLINE.NOTE')}
                                    </Typography>
                                </TableSortLabel>
                            </TableCell>

                            <TableCell sx={{ borderColor: 'var(--border-color)' }}>
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
                                    {t('COMMON.REWARD_DISCIPLINE.MONEY_REWARD')}
                                </Typography>
                            </TableCell>

                            <TableCell sx={{ borderColor: 'var(--border-color)', maxWidth: '150px' }}>
                                <Typography
                                    sx={{
                                        fontWeight: 'bold',
                                        color: 'var(--text-color)',
                                        fontSize: '16px',
                                        maxWidth: '150px',
                                        margin: 'auto',
                                        textAlign: 'center',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        whiteSpace: 'nowrap'
                                    }}
                                >
                                    {t('COMMON.ERROR_REPORT.STATUS')}
                                </Typography>
                            </TableCell>

                            <TableCell sx={{ borderColor: 'var(--border-color)', padding: '16px 50px' }}>
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
                        {disciplinesData &&
                            disciplinesData.map((row: IGetAllDiscipline, index: number) => (
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
                                            borderStyle: 'dashed',
                                            borderColor: 'var(--border-color)'
                                        }}
                                    >
                                        <Typography
                                            sx={{
                                                color: 'var(--text-color)',
                                                fontSize: '16px',
                                                maxWidth: '280px',
                                                textAlign: 'center',
                                                padding: '0 12px',
                                                margin: 'auto',
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis',
                                                whiteSpace: 'nowrap'
                                            }}
                                        >
                                            {formatDate(row.Date)}
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
                                                whiteSpace: 'nowrap'
                                            }}
                                        >
                                            {row.Reason}
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
                                                maxWidth: '600px',
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis',
                                                whiteSpace: 'nowrap'
                                            }}
                                        >
                                            {row.Note}
                                        </Typography>
                                    </TableCell>

                                    <TableCell
                                        sx={{
                                            borderStyle: 'dashed',
                                            borderColor: 'var(--border-color)'
                                        }}
                                    >
                                        <Box
                                            sx={{
                                                color: 'var(--text-color)',
                                                fontSize: '16px',
                                                maxWidth: '280px',
                                                fontStyle: 'italic',
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis',
                                                whiteSpace: 'nowrap'
                                            }}
                                        >
                                            {row.Money && formatNumberToMoney(row.Money)}
                                        </Box>
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
                                                maxWidth: '150px',
                                                margin: 'auto',
                                                display: 'flex',
                                                minWidth: '150px',
                                                justifyContent: 'center',
                                                backgroundColor: getStatusBgColor(row.IsPenalized)
                                            }}
                                        >
                                            <Typography
                                                sx={{
                                                    fontSize: '15px',
                                                    overflow: 'hidden',
                                                    color: getStatusTextColor(row.IsPenalized),
                                                    width: 'auto',
                                                    alignItems: 'center',
                                                    fontWeight: 'bold',
                                                    display: 'inline-block',
                                                    textOverflow: 'ellipsis',
                                                    whiteSpace: 'nowrap'
                                                }}
                                            >
                                                {row.IsPenalized ? 'Đã xử lý' : 'Chưa xử lý'}
                                            </Typography>
                                        </Box>
                                    </TableCell>

                                    <TableCell
                                        sx={{
                                            padding: '0px 30px 0px',
                                            borderColor: 'var(--border-color)',
                                            width: '146px',
                                            borderStyle: 'dashed'
                                        }}
                                    >
                                        <Box display='flex' alignItems='center' justifyContent='center' gap='10px'>
                                            <Tooltip title={t('COMMON.BUTTON.VIEW_DETAIL')}>
                                                <Box
                                                    display='flex'
                                                    alignItems='center'
                                                    justifyContent='center'
                                                    sx={{
                                                        cursor: 'pointer',
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
            </TableContainer>

            {selectedDiscipline && (
                <DetailModal
                    handleToggle={() => setOpenModal(false)}
                    open={openModal}
                    discipline={selectedDiscipline}
                />
            )}
        </>
    )
}

export default TableErrorReport
