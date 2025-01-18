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
import { ClipboardCheck, Clock } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ITimekeeping } from '@/models/Timekeeping'
import { TextField, Dialog, DialogTitle, Switch, DialogContent } from '@mui/material'

interface IGetAll extends ITimekeeping {
    AvatarPath: string
    FullName: string
    Department?: string
    EmployeeId: string
}

interface IProps {
    attendanceData: IGetAll[]
    type?: number
    handleSort?: (property: string) => void
    order?: 'asc' | 'desc'
    orderBy?: string
}

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

function TableErrorReport({ attendanceData, handleSort, order, orderBy }: IProps) {
    const { t } = useTranslation('common')
    // const router = useRouter()
    // const [selected, setSelected] = useState<number[]>([])
    // const [openDialog, setOpenDialog] = useState(false)
    // const [selectedRow, setSelectedRow] = useState<number | null>(null)
    const [selectedAttend, setSelectedAttend] = useState(null)
    //const [openModal, setOpenModal] = useState(false)

    // const handleClickDetail = (config: IGetAllSysConfiguration) => {
    //     setSelectedConfig(config)
    //     setOpenModal(true)
    // }

    return (
        <>
            <TableContainer
                sx={{
                    scrollbarGutter: 'stable',
                    paddingLeft: '7px',
                    maxHeight: '700px',
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
                                    active={'department' === orderBy}
                                    direction={orderBy === 'department' ? order : 'asc'}
                                    onClick={() => handleSort('department')}
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
                                <Typography
                                    sx={{
                                        fontWeight: 'bold',
                                        color: 'var(--text-color)',
                                        maxWidth: '400px',
                                        textAlign: 'center',
                                        fontSize: '16px',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        whiteSpace: 'nowrap'
                                    }}
                                >
                                    {t('COMMON.ATTENDANCE.CHECK_IN_&_OUT')}
                                </Typography>
                            </TableCell>

                            <TableCell sx={{ borderColor: 'var(--border-color)' }}>
                                <Typography
                                    sx={{
                                        fontWeight: 'bold',
                                        color: 'var(--text-color)',
                                        fontSize: '16px',
                                        padding: '0 30px 0 20px',
                                        textAlign: 'center',
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
                                                    row.AvatarPath ||
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
                                                padding: '0px 20px',
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
                                            padding: '16px 30px',
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
                                            padding: '16px 30px',
                                            borderColor: 'var(--border-color)'
                                        }}
                                    >
                                        <Typography
                                            sx={{
                                                color: '#00ec84',
                                                fontSize: '16px',
                                                minWidth: '88px',
                                                textAlign: 'center',
                                                padding: '6px 5px',
                                                borderRadius: '10px',
                                                border: '1px solid var(--border-color)',
                                                fontWeight: 'bold',
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis',
                                                whiteSpace: 'nowrap'
                                            }}
                                        >
                                            {(row.TotalHours * 60).toFixed(0)} {t('COMMON.USER.MINUTES')}
                                        </Typography>
                                    </TableCell>

                                    <TableCell
                                        sx={{
                                            borderStyle: 'dashed',
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
                                                    onClick={() => setSelectedAttend(row)}
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

            <Dialog
                open={selectedAttend !== null}
                sx={{
                    '& .MuiDialog-container': {
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center'
                    },
                    '& .MuiDialog-paper': {
                        backgroundColor: 'var(--background-dialog)',
                        width: '600px',
                        margin: 0,
                        borderRadius: '16px',
                        maxWidth: 'none',
                        maxHeight: '88vh'
                    }
                }}
                onClose={() => setSelectedAttend(null)}
            >
                {selectedAttend && (
                    <>
                        {' '}
                        <DialogTitle
                            sx={{
                                padding: '24px',
                                fontSize: '18px',
                                fontWeight: 'bold',
                                color: 'var(--text-color)',
                                backgroundColor: 'var(--header-dialog)'
                            }}
                        >
                            {'Chi tiết chấm công nhân viên'}
                        </DialogTitle>
                        <DialogContent
                            sx={{
                                mt: '18px',
                                pr: '17px',
                                pb: '24px',
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
                            <TableContainer>
                                <Table>
                                    <TableBody>
                                        {[
                                            { label: 'Tên nhân viên', value: selectedAttend.FullName },
                                            { label: 'Mã nhân viên', value: selectedAttend.EmployeeId },
                                            { label: 'Ngày', value: selectedAttend.Date },
                                            { label: 'Giờ vào', value: selectedAttend.CheckInTime },
                                            { label: 'Giờ ra', value: selectedAttend.CheckOutTime },
                                            {
                                                label: 'Tổng số giờ',
                                                value: selectedAttend.TotalHours * 60 + ' ' + t('COMMON.USER.MINUTES')
                                            },
                                            { label: 'Trạng thái', value: selectedAttend.CreateBy }
                                        ].map((item, index) => (
                                            <TableRow key={index}>
                                                <TableCell
                                                    sx={{
                                                        fontSize: '16px',
                                                        fontWeight: 'bold',
                                                        whiteSpace: 'nowrap',
                                                        color: 'var(--text-color)',
                                                        borderBottom: 'none',
                                                        padding: '8px'
                                                    }}
                                                >
                                                    {item.label}:
                                                </TableCell>
                                                {item.label === 'Tổng số giờ' ? (
                                                    <TableCell
                                                        sx={{
                                                            color: '#00ec84',
                                                            fontSize: '16px',
                                                            borderBottom: 'none',
                                                            fontWeight: 'bold',
                                                            overflow: 'hidden',
                                                            textOverflow: 'ellipsis',
                                                            whiteSpace: 'nowrap',
                                                            padding: '8px'
                                                        }}
                                                    >
                                                        {item.value}
                                                    </TableCell>
                                                ) : item.label === 'Ngày' ? (
                                                    <TableCell
                                                        sx={{
                                                            color: 'var(--text-color)',
                                                            fontSize: '16px',
                                                            borderBottom: 'none',
                                                            padding: '8px'
                                                        }}
                                                    >
                                                        {formatDate(item.value.toString())}
                                                    </TableCell>
                                                ) : item.label === 'Giờ vào' ? (
                                                    <TableCell
                                                        sx={{
                                                            color: '#ffbc42',
                                                            fontWeight: 'bold',
                                                            fontSize: '16px',
                                                            borderBottom: 'none',
                                                            padding: '8px'
                                                        }}
                                                    >
                                                        {convertTimeFormat(item.value)}
                                                    </TableCell>
                                                ) : item.label === 'Giờ ra' ? (
                                                    <TableCell
                                                        sx={{
                                                            color: '#ff7373',
                                                            fontWeight: 'bold',
                                                            fontSize: '16px',
                                                            borderBottom: 'none',
                                                            padding: '8px'
                                                        }}
                                                    >
                                                        {convertTimeFormat(item.value)}
                                                    </TableCell>
                                                ) : item.label === 'Trạng thái' ? (
                                                    <TableCell
                                                        sx={{
                                                            borderBottom: 'none',
                                                            padding: '8px'
                                                        }}
                                                    >
                                                        {selectedAttend.Status === false ? (
                                                            <Box
                                                                sx={{
                                                                    borderRadius: '8px',
                                                                    padding: '5px 10px',
                                                                    display: 'flex',
                                                                    width: '140px',
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
                                                        ) : selectedAttend.CheckInTime > '08:00:00' ? (
                                                            selectedAttend.CheckOutTime < '17:00' ? (
                                                                <Box>
                                                                    <Box
                                                                        sx={{
                                                                            borderRadius: '8px',
                                                                            padding: '5px 10px',
                                                                            display: 'flex',
                                                                            width: '140px',
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
                                                                            width: '140px',
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
                                                                        width: '140px',
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
                                                        ) : selectedAttend.CheckOutTime < '17:00' ? (
                                                            <Box
                                                                sx={{
                                                                    borderRadius: '8px',
                                                                    padding: '5px 10px',
                                                                    display: 'flex',
                                                                    width: '140px',
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
                                                                    width: '140px',
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
                                                ) : (
                                                    <TableCell
                                                        sx={{
                                                            color: 'var(--text-color)',
                                                            fontSize: '16px',
                                                            borderBottom: 'none',
                                                            padding: '8px'
                                                        }}
                                                    >
                                                        {item.value}
                                                    </TableCell>
                                                )}
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </DialogContent>
                    </>
                )}
            </Dialog>
        </>
    )
}

export default TableErrorReport
