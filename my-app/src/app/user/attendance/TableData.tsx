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
    TableSortLabel
} from '@mui/material'
import { ClipboardCheck, Clock } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ITimekeeping } from '@/models/Timekeeping'

// const avatars = [
//     'https://api-prod-minimal-v620.pages.dev/assets/images/avatar/avatar-1.webp',
//     'https://api-prod-minimal-v620.pages.dev/assets/images/avatar/avatar-2.webp',
//     'https://api-prod-minimal-v620.pages.dev/assets/images/avatar/avatar-3.webp',
//     'https://api-prod-minimal-v620.pages.dev/assets/images/avatar/avatar-4.webp',
//     'https://api-prod-minimal-v620.pages.dev/assets/images/avatar/avatar-5.webp',
//     'https://api-prod-minimal-v620.pages.dev/assets/images/avatar/avatar-6.webp',
//     'https://api-prod-minimal-v620.pages.dev/assets/images/avatar/avatar-7.webp',
//     'https://api-prod-minimal-v620.pages.dev/assets/images/avatar/avatar-8.webp',
//     'https://api-prod-minimal-v620.pages.dev/assets/images/avatar/avatar-9.webp',
//     'https://api-prod-minimal-v620.pages.dev/assets/images/avatar/avatar-10.webp',
//     'https://api-prod-minimal-v620.pages.dev/assets/images/avatar/avatar-11.webp',
//     'https://api-prod-minimal-v620.pages.dev/assets/images/avatar/avatar-12.webp',
//     'https://api-prod-minimal-v620.pages.dev/assets/images/avatar/avatar-13.webp',
//     'https://api-prod-minimal-v620.pages.dev/assets/images/avatar/avatar-14.webp',
//     'https://api-prod-minimal-v620.pages.dev/assets/images/avatar/avatar-15.webp',
//     'https://api-prod-minimal-v620.pages.dev/assets/images/avatar/avatar-16.webp',
//     'https://api-prod-minimal-v620.pages.dev/assets/images/avatar/avatar-17.webp',
//     'https://api-prod-minimal-v620.pages.dev/assets/images/avatar/avatar-18.webp',
//     'https://api-prod-minimal-v620.pages.dev/assets/images/avatar/avatar-19.webp'
// ]

function convertTimeFormat(time: string): string {
    if (!time) return 'N/A'
    // Tách chuỗi thời gian thành giờ, phút và giây
    const [hours = 0, minutes = 0, seconds = 0] = time?.split(':').map(part => Math.floor(Number(part))) || [0, 0, 0]

    // Format từng phần thành chuỗi 2 chữ số
    const formattedHours = String(hours).padStart(2, '0')
    const formattedMinutes = String(minutes).padStart(2, '0')
    const formattedSeconds = String(seconds).padStart(2, '0')

    // Kết quả format thành hh:mm:ss
    return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`
}

interface IGetAll extends ITimekeeping {
    AvatarPath: string
    FullName: string
    Department?: string
}

interface IProps {
    attendanceData: IGetAll[]
    type?: number
}

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
                maxHeight: '540px',
                height: 'auto',
                scrollbarGutter: 'stable',
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
                            backgroundColor: 'var(--header-table-dashboard) !important',
                            position: 'sticky', // Giữ cố định
                            top: 0, // Vị trí cố định ở trên cùng
                            zIndex: 2, // Ưu tiên header trên các phần tử khác
                            '&:last-child td, &:last-child th': {
                                border: 'none'
                            }
                        }}
                    >
                        <TableCell sx={{ borderColor: 'var(--border-color)', padding: '0 35px !important' }}>
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
                            <TableSortLabel
                                active={'hours' === orderBy}
                                direction={orderBy === 'hours' ? order : 'asc'}
                                onClick={() => handleSort('hours')}
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
                                    {t('COMMON.USER.WORKING_HOURS')}
                                </Typography>
                            </TableSortLabel>
                        </TableCell>

                        <TableCell sx={{ borderColor: 'var(--border-color)', width: '70px' }}>
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

                        <TableCell sx={{ borderColor: 'var(--border-color)', padding: '16px 35px' }}>
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
                                        borderStyle: 'dashed',
                                        padding: '0 35px !important',
                                        borderColor: 'var(--border-color)'
                                    }}
                                >
                                    <Typography
                                        sx={{
                                            color: 'var(--text-color)',
                                            fontSize: '16px',
                                            maxWidth: '280px',
                                            textAlign: 'center',
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
                                    <Box
                                        sx={{
                                            display: 'flex',
                                            gap: '15px',
                                            alignItems: 'center',
                                            justifyContent: 'left'
                                        }}
                                    >
                                        <Clock size={24} color='var(--text-color)' />
                                        <Box
                                            sx={{
                                                color: 'var(--text-color)',
                                                fontSize: '16px',
                                                maxWidth: '280px',
                                                display: 'flex',
                                                gap: '15px',
                                                alignItems: 'center',
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis',
                                                whiteSpace: 'nowrap'
                                            }}
                                        >
                                            <Box
                                                sx={{
                                                    color: '#ffbc42',
                                                    fontWeight: 'bold'
                                                }}
                                            >
                                                {convertTimeFormat(row.CheckInTime)}
                                            </Box>
                                            -
                                            <Box
                                                sx={{
                                                    color: '#ff7373',
                                                    fontWeight: 'bold'
                                                }}
                                            >
                                                {convertTimeFormat(row.CheckOutTime)}
                                            </Box>
                                        </Box>
                                    </Box>
                                </TableCell>

                                <TableCell
                                    sx={{
                                        borderStyle: 'dashed',
                                        borderColor: 'var(--border-color)'
                                    }}
                                >
                                    <Typography
                                        sx={{
                                            color: '#00ec84',
                                            fontSize: '16px',
                                            width: '88px',
                                            textAlign: 'center',
                                            padding: '8px 10px',
                                            borderRadius: '10px',
                                            border: '1px solid var(--border-color)',
                                            fontWeight: 'bold',
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                            whiteSpace: 'nowrap'
                                        }}
                                    >
                                        {row.TotalHours * 60} {t('COMMON.USER.MINUTES')}
                                    </Typography>
                                </TableCell>

                                <TableCell
                                    sx={{
                                        borderStyle: 'dashed',
                                        width: '70px',
                                        borderColor: 'var(--border-color)',
                                        padding: '11px'
                                    }}
                                >
                                    {row.Status === false ? (
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
