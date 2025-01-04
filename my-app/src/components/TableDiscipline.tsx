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

interface IGetAllReward {
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
    disciplineData: IGetAllReward[]
    totalRecords: number
    type: number
}

const avatars = [
    'https://api-prod-minimal-v620.pages.dev/assets/images/avatar/avatar-1.webp',
    'https://api-prod-minimal-v620.pages.dev/assets/images/avatar/avatar-2.webp',
    'https://api-prod-minimal-v620.pages.dev/assets/images/avatar/avatar-3.webp',
    'https://api-prod-minimal-v620.pages.dev/assets/images/avatar/avatar-4.webp',
    'https://api-prod-minimal-v620.pages.dev/assets/images/avatar/avatar-5.webp',
    'https://api-prod-minimal-v620.pages.dev/assets/images/avatar/avatar-6.webp',
    'https://api-prod-minimal-v620.pages.dev/assets/images/avatar/avatar-7.webp',
    'https://api-prod-minimal-v620.pages.dev/assets/images/avatar/avatar-8.webp',
    'https://api-prod-minimal-v620.pages.dev/assets/images/avatar/avatar-9.webp',
    'https://api-prod-minimal-v620.pages.dev/assets/images/avatar/avatar-10.webp',
    'https://api-prod-minimal-v620.pages.dev/assets/images/avatar/avatar-11.webp',
    'https://api-prod-minimal-v620.pages.dev/assets/images/avatar/avatar-12.webp',
    'https://api-prod-minimal-v620.pages.dev/assets/images/avatar/avatar-13.webp',
    'https://api-prod-minimal-v620.pages.dev/assets/images/avatar/avatar-14.webp',
    'https://api-prod-minimal-v620.pages.dev/assets/images/avatar/avatar-15.webp',
    'https://api-prod-minimal-v620.pages.dev/assets/images/avatar/avatar-16.webp',
    'https://api-prod-minimal-v620.pages.dev/assets/images/avatar/avatar-17.webp',
    'https://api-prod-minimal-v620.pages.dev/assets/images/avatar/avatar-18.webp',
    'https://api-prod-minimal-v620.pages.dev/assets/images/avatar/avatar-19.webp'
]

function TableErrorReport({ disciplineData, totalRecords, type }: IProps) {
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
        type,
        selected,
        openDialog,
        selectedRow,
        order,
        orderBy,
        openModal,
        router,
        t,
        disciplineData,
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
                                active={'FullName' === orderBy}
                                direction={orderBy === 'FullName' ? order : 'asc'}
                                onClick={() => handleSort('FullName')}
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
                                    {t('COMMON.REWARD_DISCIPLINE.FULLNAME')}
                                </Typography>
                            </TableSortLabel>
                        </TableCell>

                        <TableCell sx={{ borderColor: 'var(--border-color)' }}>
                            <TableSortLabel
                                active={'Department' === orderBy}
                                direction={orderBy === 'Department' ? order : 'asc'}
                                onClick={() => handleSort('Department')}
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
                                    {t('COMMON.REWARD_DISCIPLINE.DEPARTMENT')}
                                </Typography>
                            </TableSortLabel>
                        </TableCell>

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
                                {t('COMMON.REWARD_DISCIPLINE.MONEY_DISCIPLINE')}
                            </Typography>
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
                    {disciplineData &&
                        disciplineData.map((row: IGetAllReward, index: number) => (
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
                                                avatars[row.Id] ||
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
                                                {row.FullName}
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
                                                {row.EmployeeId}
                                            </Typography>
                                        </Box>
                                    </Box>
                                </TableCell>

                                <TableCell sx={{ borderColor: 'var(--border-color)', borderStyle: 'dashed' }}>
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
                                        {row.Department}
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
                                            display: 'flex',
                                            minWidth: '100px',
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
                                                fontWeight: 'bold',
                                                display: 'inline-block',
                                                textOverflow: 'ellipsis',
                                                whiteSpace: 'nowrap'
                                            }}
                                        >
                                            {row.IsPenalized
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
