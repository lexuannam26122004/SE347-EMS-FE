'use client'

import React from 'react'
import { ITimekeeping } from '@/models/Timekeeping'
import { Box, Typography } from '@mui/material'
import { Clock } from 'lucide-react'
import { formatDate } from '@/utils/formatDate'
import { useTranslation } from 'react-i18next'

interface DataGridProps {
    data: ITimekeeping[]
}

function convertTimeFormat(time: string): string {
    // Tách chuỗi thời gian thành giờ, phút và giây
    if (!time) return 'N/A'

    const [hours = 0, minutes = 0, seconds = 0] = time?.split(':').map(part => Math.floor(Number(part))) || [0, 0, 0]

    // Format từng phần thành chuỗi 2 chữ số
    const formattedHours = String(hours).padStart(2, '0')
    const formattedMinutes = String(minutes).padStart(2, '0')
    const formattedSeconds = String(seconds).padStart(2, '0')

    // Kết quả format thành hh:mm:ss
    return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`
}

function DataGrid(props: DataGridProps) {
    const { t } = useTranslation('common')
    const { data } = props

    return (
        <Box
            sx={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '30px',
                maxHeight: '540px',
                height: 'auto',
                padding: '0 28px 0 35px',
                scrollbarGutter: 'stable',
                '&::-webkit-scrollbar': {
                    width: '7px',
                    height: '7px'
                },
                '&::-webkit-scrollbar-thumb': {
                    backgroundColor: 'var(--scrollbar-color)',
                    borderRadius: '10px'
                },
                overflowY: 'auto'
            }}
        >
            {data.map((row, index) => (
                <Box
                    key={index}
                    sx={{
                        backgroundColor: 'var(--attendance-bg2)',
                        padding: '24px',
                        borderRadius: '20px'
                    }}
                >
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Box
                            sx={{
                                display: 'flex',
                                gap: '15px',
                                color: 'var(--text-color)',
                                alignItems: 'center',
                                fontSize: '16px',
                                fontWeight: 'bold'
                            }}
                        >
                            <Clock size={20} />
                            {formatDate(row.Date.toString())}
                            {/* <Typography
                                sx={{
                                    color: '#1eff9c',
                                    fontSize: '16px',
                                    width: '88px',
                                    padding: '3.5px 10px',
                                    borderRadius: '10px',
                                    border: '1px solid var(--border-color)',
                                    fontWeight: 'bold',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    whiteSpace: 'nowrap'
                                }}
                            >
                                {convertTimeFormat(row.WorkingHours)}
                            </Typography> */}
                        </Box>
                        <Box>
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
                        </Box>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', marginTop: '25px' }}>
                        <Box>
                            <Typography sx={{ fontSize: '14px', color: 'var(--sub-title-color)' }}>
                                {t('COMMON.USER.CHECK_IN_TIME')}
                            </Typography>
                            <Typography sx={{ mt: '5px', fontSize: '16px', color: '#ffbc42', fontWeight: 'bold' }}>
                                {convertTimeFormat(row.CheckInTime)}
                            </Typography>
                        </Box>
                        <Box>
                            <Typography sx={{ fontSize: '14px', color: 'var(--sub-title-color)' }}>
                                {t('COMMON.USER.CHECK_OUT_TIME')}
                            </Typography>
                            <Typography sx={{ mt: '5px', fontSize: '16px', color: '#ff7373', fontWeight: 'bold' }}>
                                {convertTimeFormat(row.CheckOutTime)}
                            </Typography>
                        </Box>
                        {/* <Box>
                            <Typography sx={{ fontSize: '14px', color: 'var(--sub-title-color)' }}>
                                {t('COMMON.USER.OVERTIME')}
                            </Typography>
                            <Typography
                                sx={{
                                    mt: '5px',
                                    color: '#2ef2d2',
                                    fontSize: '16px',
                                    fontStyle: 'italic',
                                    fontWeight: 'bold'
                                }}
                            >
                                {convertTimeFormat(row.Overtime)}
                            </Typography>
                        </Box> */}
                    </Box>
                </Box>
            ))}
        </Box>
    )
}

export default DataGrid
