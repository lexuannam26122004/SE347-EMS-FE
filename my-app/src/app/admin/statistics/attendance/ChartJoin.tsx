// components/Chart.js
import React from 'react'
import ReactECharts from 'echarts-for-react'
import { Box, Divider, Paper, Typography } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { useTheme } from 'next-themes'
import { useGetTodayAttendanceSummaryQuery } from '@/services/TimekeepingService'
import Loading from '@/components/Loading'
//import { useGetEmployeeAttendanceQuery } from '@/services/AspNetUserService' // API mới để lấy dữ liệu tham gia

const Chart = () => {
    //const { data } = useGetEmployeeAttendanceQuery() // API trả về số lượng nhân viên đã đi làm và chưa đi làm
    const { t } = useTranslation('common')
    const { theme } = useTheme()
    const currentDate = new Date()

    const { data: dataResponse, isLoading } = useGetTodayAttendanceSummaryQuery(currentDate.toISOString().split('T')[0])

    const present = dataResponse?.Data?.CheckedIn || 0
    const absent = dataResponse?.Data?.Absent || 0
    const presentPercent = dataResponse?.Data?.AttendanceRate || 0
    const absentRate = dataResponse?.Data?.AbsentRate || 0

    const chartData = [
        { value: present, name: t('COMMON.ATTENDANCE.JOIN') },
        { value: absent, name: t('COMMON.ATTENDANCE.STATUS_ABSENT') }
    ]

    const percent = dataResponse?.Data?.AttendanceRateChange || 0

    const option = {
        animation: true, // Bật hiệu ứng chuyển tiếp
        animationDuration: 700, // Thời gian chuyển tiếp (ms)
        tooltip: {
            backgroundColor: theme === 'light' ? 'rgba(250, 250, 250, 0.98)' : 'rgba(20, 26, 25, 0.98)',
            borderColor: theme === 'light' ? 'rgba(250, 250, 250, 0.98)' : 'rgba(20, 26, 25, 0.98)',
            textStyle: {
                color: theme === 'light' ? '#000000' : '#ffffff',
                fontFamily: 'Arial, sans-serif'
            }
        },
        legend: {
            show: true,
            orient: 'horizontal',
            left: 'center',
            top: 'bottom',
            itemGap: 14,
            textStyle: {
                color: theme === 'light' ? 'black' : '#fff',
                fontSize: '13px',
                fontFamily: 'Arial, sans-serif'
            },
            selectedMode: false
        },
        series: [
            {
                type: 'pie',
                radius: '80%',
                center: ['50%', '46%'],

                data: chartData.map((item, index) => ({
                    ...item,
                    itemStyle: {
                        color: index === 0 ? '#1ebb7d' : '#fd7d5f'
                    }
                })),
                emphasis: {
                    itemStyle: {
                        shadowBlur: 10,
                        shadowOffsetX: 0,
                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                    }
                },
                label: {
                    show: false,
                    position: 'inside',
                    fontSize: 14,
                    fontWeight: 'bold',
                    color: theme === 'light' ? '#000' : '#fff'
                },
                labelLine: {
                    show: false
                }
            }
        ]
    }

    if (isLoading) {
        return <Loading />
    }

    return (
        <Paper
            elevation={0}
            sx={{
                width: '100%',
                padding: '24px',
                backgroundColor: 'var(--background-item)',
                borderRadius: '15px',
                display: 'flex',
                flexDirection: 'column',
                height: '100%'
            }}
        >
            <Box>
                <Typography
                    sx={{
                        fontSize: '18px',
                        fontWeight: 'bold',
                        color: 'var(--text-color)'
                    }}
                >
                    {t('COMMON.ATTENDANCE.MEMBER_ATTENDANCE')}
                </Typography>
                <Typography
                    sx={{
                        fontSize: '14px',
                        mt: '4px',
                        color: theme === 'dark' ? '#919EAB' : '#637381'
                    }}
                >
                    {t('COMMON.ATTENDANCE.ATTENDANCE_PERCENT', {
                        status: percent >= 0 ? t('COMMON.STAT_NOTIFY.INCREASED') : t('COMMON.STAT_NOTIFY.DECREASED'),
                        x: percent
                    })}
                </Typography>
                <ReactECharts option={option} style={{ height: '326px', width: '100%' }} />
            </Box>

            <Divider
                sx={{
                    margin: '20px -24px 24px',
                    borderStyle: 'dashed',
                    borderColor: 'var(--divider-color)'
                }}
            />

            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: '24px',
                    flex: 1
                }}
            >
                <Box
                    sx={{
                        backgroundColor: 'var(--bg-item-attendance)',
                        padding: '12px 20px',
                        borderRadius: '15px',
                        width: 'calc(100% / 2)'
                    }}
                >
                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            gap: '10px'
                        }}
                    >
                        <Typography
                            sx={{
                                fontWeight: 'bold',
                                color: 'var(--text-color)',
                                fontSize: '28px'
                            }}
                        >
                            {present}
                        </Typography>

                        <Box
                            sx={{
                                padding: '3px 10px',
                                borderRadius: '8px',
                                background: '#1ebb7d',
                                fontWeight: 'bold',
                                color: 'white'
                            }}
                        >
                            {presentPercent}%
                        </Box>
                    </Box>
                    <Typography
                        sx={{
                            color: 'var(--text-color)',
                            fontSize: '16px',
                            textAlign: 'center'
                        }}
                    >
                        {t('COMMON.ATTENDANCE.JOIN')}
                    </Typography>
                </Box>
                <Box
                    sx={{
                        backgroundColor: 'var(--bg-item-attendance)',
                        padding: '12px 20px',
                        borderRadius: '15px',
                        width: 'calc(100% / 2)'
                    }}
                >
                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            gap: '10px'
                        }}
                    >
                        <Typography
                            sx={{
                                fontWeight: 'bold',
                                color: 'var(--text-color)',
                                fontSize: '28px'
                            }}
                        >
                            {absent}
                        </Typography>

                        <Box
                            sx={{
                                padding: '3px 10px',
                                borderRadius: '8px',
                                background: '#fd7d5f',
                                fontWeight: 'bold',
                                color: 'white'
                            }}
                        >
                            {absentRate}%
                        </Box>
                    </Box>
                    <Typography
                        sx={{
                            color: 'var(--text-color)',
                            fontSize: '16px',
                            textAlign: 'center'
                        }}
                    >
                        {t('COMMON.ATTENDANCE.STATUS_ABSENT')}
                    </Typography>
                </Box>
            </Box>
        </Paper>
    )
}

export default Chart
