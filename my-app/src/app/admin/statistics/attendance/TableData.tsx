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
import { ClipboardCheck } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ITimekeeping } from '@/models/Timekeeping'

interface IGetAll extends ITimekeeping {
    AvatarPath: string
    FullName: string
    Department?: string
}

interface IProps {
    attendanceData: IGetAll[]
    type?: number
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

function TableErrorReport({ attendanceData }: IProps) {
    const { t } = useTranslation('common')
    // const router = useRouter()
    // const [selected, setSelected] = useState<number[]>([])
    // const [openDialog, setOpenDialog] = useState(false)
    // const [selectedRow, setSelectedRow] = useState<number | null>(null)
    const [order, setOrder] = useState<'asc' | 'desc'>('asc')
    const [orderBy, setOrderBy] = useState<string>('')
    // const [selectedConfig, setSelectedConfig] = useState<IGetAllSysConfiguration | null>(null)
    //const [openModal, setOpenModal] = useState(false)

    // const handleClickDetail = (config: IGetAllSysConfiguration) => {
    //     setSelectedConfig(config)
    //     setOpenModal(true)
    // }

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
                                    {t('COMMON.ATTENDANCE.CHECK_IN_&_OUT')}
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
                                {t('COMMON.ATTENDANCE.TOTAL_HOURS')}
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
                    {attendanceData &&
                        attendanceData.map((row, index: number) => (
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
                                                {row.UserId}
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
                                        {formatDate(row.Date.toString())}
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
                                        {row.CheckInTime} - {row.CheckOutTime}
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
                                        {(row.TotalHours * 60).toFixed(2) + ' ' + t('COMMON.ATTENDANCE.MINUTES')}
                                    </Typography>
                                </TableCell>
                                <TableCell
                                    sx={{
                                        borderStyle: 'dashed',
                                        borderColor: 'var(--border-color)',
                                        padding: '11px'
                                    }}
                                >
                                    {row.IsValid === false ? (
                                        <Box
                                            sx={{
                                                borderRadius: '8px',
                                                padding: '5px 10px',
                                                display: 'flex',
                                                minWidth: '100px',
                                                justifyContent: 'center',
                                                backgroundColor: 'var(--bg-danger-color)'
                                            }}
                                        >
                                            <Typography
                                                sx={{
                                                    fontSize: '15px',
                                                    overflow: 'hidden',
                                                    color: 'var(--text-danger-color)',
                                                    width: 'auto',
                                                    fontWeight: 'bold',
                                                    display: 'inline-block',
                                                    textOverflow: 'ellipsis',
                                                    whiteSpace: 'nowrap'
                                                }}
                                            >
                                                {t('COMMON.ATTENDANCE.STATUS_INVALID')}
                                            </Typography>
                                        </Box>
                                    ) : row.CheckInTime > '08:00:00' ? (
                                        row.CheckOutTime < '17:00' ? (
                                            <Box>
                                                <Box
                                                    sx={{
                                                        borderRadius: '8px',
                                                        padding: '5px 10px',
                                                        display: 'flex',
                                                        minWidth: '100px',
                                                        justifyContent: 'center',
                                                        backgroundColor: 'var(--bg-warning-color)'
                                                    }}
                                                >
                                                    <Typography
                                                        sx={{
                                                            fontSize: '15px',
                                                            overflow: 'hidden',
                                                            color: 'var(--text-warning-color)',
                                                            width: 'auto',
                                                            fontWeight: 'bold',
                                                            display: 'inline-block',
                                                            textOverflow: 'ellipsis',
                                                            whiteSpace: 'nowrap'
                                                        }}
                                                    >
                                                        {t('COMMON.ATTENDANCE.STATUS_LATE')}
                                                    </Typography>
                                                </Box>

                                                <Box
                                                    sx={{
                                                        mt: '10px',
                                                        borderRadius: '8px',
                                                        padding: '5px 10px',
                                                        display: 'flex',
                                                        minWidth: '100px',
                                                        justifyContent: 'center',
                                                        backgroundColor: 'var(--bg-closed-color)'
                                                    }}
                                                >
                                                    <Typography
                                                        sx={{
                                                            fontSize: '15px',
                                                            overflow: 'hidden',
                                                            color: 'var(--text-closed-color)',
                                                            width: 'auto',
                                                            fontWeight: 'bold',
                                                            display: 'inline-block',
                                                            textOverflow: 'ellipsis',
                                                            whiteSpace: 'nowrap'
                                                        }}
                                                    >
                                                        {t('COMMON.ATTENDANCE.STATUS_EARLY')}
                                                    </Typography>
                                                </Box>
                                            </Box>
                                        ) : (
                                            <Box
                                                sx={{
                                                    borderRadius: '8px',
                                                    padding: '5px 10px',
                                                    display: 'flex',
                                                    minWidth: '100px',
                                                    justifyContent: 'center',
                                                    backgroundColor: 'var(--bg-warning-color)'
                                                }}
                                            >
                                                <Typography
                                                    sx={{
                                                        fontSize: '15px',
                                                        overflow: 'hidden',
                                                        color: 'var(--text-warning-color)',
                                                        width: 'auto',
                                                        fontWeight: 'bold',
                                                        display: 'inline-block',
                                                        textOverflow: 'ellipsis',
                                                        whiteSpace: 'nowrap'
                                                    }}
                                                >
                                                    {t('COMMON.ATTENDANCE.STATUS_LATE')}
                                                </Typography>
                                            </Box>
                                        )
                                    ) : row.CheckOutTime < '17:00' ? (
                                        <Box
                                            sx={{
                                                borderRadius: '8px',
                                                padding: '5px 10px',
                                                display: 'flex',
                                                minWidth: '100px',
                                                justifyContent: 'center',
                                                backgroundColor: 'var(--bg-closed-color)'
                                            }}
                                        >
                                            <Typography
                                                sx={{
                                                    fontSize: '15px',
                                                    overflow: 'hidden',
                                                    color: 'var(--text-closed-color)',
                                                    width: 'auto',
                                                    fontWeight: 'bold',
                                                    display: 'inline-block',
                                                    textOverflow: 'ellipsis',
                                                    whiteSpace: 'nowrap'
                                                }}
                                            >
                                                {t('COMMON.ATTENDANCE.STATUS_EARLY')}
                                            </Typography>
                                        </Box>
                                    ) : (
                                        <Box
                                            sx={{
                                                borderRadius: '8px',
                                                padding: '5px 10px',
                                                display: 'flex',
                                                minWidth: '100px',
                                                justifyContent: 'center',
                                                backgroundColor: 'var(--bg-success-color)'
                                            }}
                                        >
                                            <Typography
                                                sx={{
                                                    fontSize: '15px',
                                                    overflow: 'hidden',
                                                    color: 'var(--text-success-color)',
                                                    width: 'auto',
                                                    fontWeight: 'bold',
                                                    display: 'inline-block',
                                                    textOverflow: 'ellipsis',
                                                    whiteSpace: 'nowrap'
                                                }}
                                            >
                                                {t('COMMON.ATTENDANCE.STATUS_ON_TIME')}
                                            </Typography>
                                        </Box>
                                    )}
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
