'use client'

import { Box, Paper, Typography } from '@mui/material'
import { useTranslation } from 'react-i18next'
import ReactECharts from 'echarts-for-react'
import { useTheme } from 'next-themes'
import { useStatsQuery } from '@/services/UserAttendanceService'

const getLastWeekDays = () => {
    const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    const currentDate = new Date()
    const currentDay = currentDate.getDay()

    const weekDays = []
    for (let i = 0; i < 7; i++) {
        const dayIndex = (currentDay + i) % 7
        weekDays.push(daysOfWeek[dayIndex])
    }
    return weekDays
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

const colors = ['#00a76f', '#00b8d9', '#ff5630', '#f83696', '#ffab00', '#b863f0']

function Page() {
    const { t } = useTranslation('common')

    const currentDate = new Date().toISOString().split('T')[0]

    const { data: responseStat } = useStatsQuery(currentDate)
    const stats = responseStat?.Data

    const countLogin = stats?.CountLogin
    const checkInTimeCurrent = convertTimeFormat(stats?.Attendance?.CheckInTime)
    const isValidCurrent = stats?.Attendance?.Status

    const timeIn = convertTimeFormat(stats?.TimeCheckIn)
    const invalid = stats?.CountInvalid
    const countLoginPercent = 20
    // const checkInTimePercent = 5
    const invalidPercent = -30
    const timeInPercent = 1
    const { theme } = useTheme()

    const getOption = (data: number[], color: string) => {
        return {
            animation: true,
            animationDuration: 700,
            tooltip: {
                trigger: 'axis',
                backgroundColor: theme === 'light' ? 'rgba(250, 250, 250, 0.98)' : 'rgba(20, 26, 25, 0.98)',
                borderColor: theme === 'light' ? 'rgba(250, 250, 250, 0.98)' : 'rgba(20, 26, 25, 0.98)',
                textStyle: {
                    color: theme === 'light' ? '#000000' : '#ffffff'
                },
                extraCssText: 'width: 100px; white-space: normal; word-wrap: break-word;' // Thêm CSS để thay đổi chiều rộng
            },
            title: {
                text: 'My Chart',
                show: false
            },
            xAxis: {
                type: 'category',
                data: getLastWeekDays(),
                axisLine: { show: false },
                axisTick: { show: false },
                axisLabel: { show: false }
            },
            yAxis: {
                type: 'value',
                axisLine: { show: false },
                axisTick: { show: false },
                axisLabel: { show: false },
                splitLine: { show: false }
            },
            series: [
                {
                    data: data, // Dữ liệu động
                    type: 'bar',
                    itemStyle: {
                        color: color,
                        borderRadius: [2.2, 2.2, 0, 0]
                    },
                    label: {
                        show: false
                    }
                }
            ],
            grid: {
                left: '0',
                right: '0',
                top: '0',
                bottom: '0'
            }
        }
    }

    const dataSet = {
        OnTime: [120, 110, 115, 130, 125, 140, 135], // Số người đi đúng giờ trong 7 ngày gần nhất
        Early: [15, 10, 12, 20, 18, 25, 22], // Số người đi sớm
        Late: [5, 7, 6, 4, 8, 3, 5], // Số người đi trễ
        Leave: [1, 4, 2, 3, 7, 6, 3], // Số người nghỉ phép
        Absent: [2, 3, 4, 5, 1, 2, 3], // Số người vắng mặt
        Invalid: [1, 2, 3, 1, 4, 5, 2] // Số không hợp lệ
    }

    return (
        <Box
            sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                gap: '24px',
                flexDirection: 'column'
            }}
        >
            <Box
                sx={{
                    width: '100%',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    gap: '24px'
                }}
            >
                <Paper
                    elevation={0}
                    sx={{
                        border: '1px solid #00a76f',
                        width: 'calc(100% / 4)',
                        height: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        backgroundColor: '#eefff9',
                        justifyContent: 'space-between',
                        borderRadius: '15px',
                        padding: '24px',
                        position: 'relative'
                    }}
                >
                    <Box>
                        <Typography
                            sx={{
                                fontSize: '16px',
                                fontWeight: 'bold',
                                color: '#637381'
                            }}
                        >
                            {t('COMMON.USER.LOGIN_COUNT')}
                        </Typography>
                        <Typography
                            sx={{
                                color: '#09090b',
                                fontSize: '34px',
                                margin: '2px 5px',
                                fontWeight: 'bold'
                            }}
                        >
                            {countLogin}
                        </Typography>
                        <Box
                            sx={{
                                mt: '5px',
                                color: '#09090b', //!(!rewardPercent || rewardPercent >= 0) ? '#F93C65' : '#00B69B',
                                fontSize: '15px',
                                fontWeight: 'bold',
                                display: 'flex',
                                alignItems: 'center'
                            }}
                        >
                            {countLoginPercent !== null &&
                                (!(!countLoginPercent || countLoginPercent >= 0) ? (
                                    <img
                                        src='/images/down.svg'
                                        style={{ marginRight: '6px', width: '26px', height: '26px' }}
                                    />
                                ) : (
                                    <img
                                        src='/images/up.svg'
                                        style={{ marginRight: '6px', width: '26px', height: '26px' }}
                                    />
                                ))}
                            {countLoginPercent !== null ? countLoginPercent + '%' : t('COMMON.DASHBOARD.NO_CHANGE')}
                            <Typography
                                sx={{
                                    ml: '6px',
                                    color: '#09090b',
                                    fontSize: '16px'
                                }}
                            >
                                {t('COMMON.ATTENDANCE.YESTERDAY')}
                            </Typography>
                        </Box>
                    </Box>

                    <Box sx={{ width: '60px', height: '40px', position: 'absolute', right: '24px' }}>
                        <ReactECharts
                            option={getOption(dataSet.OnTime, colors[0])}
                            style={{ width: '100%', height: '100%' }}
                        />
                    </Box>
                </Paper>

                <Paper
                    elevation={0}
                    sx={{
                        border: '1px solid #ffab00',
                        width: 'calc(100% / 4)',
                        height: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        backgroundColor: '#fffbf3',
                        justifyContent: 'space-between',
                        borderRadius: '15px',
                        padding: '24px',
                        position: 'relative'
                    }}
                >
                    <Box>
                        <Typography
                            sx={{
                                fontSize: '16px',
                                fontWeight: 'bold',
                                color: '#637381'
                            }}
                        >
                            {t('COMMON.USER.CHECK_IN_TIME')}
                        </Typography>
                        <Typography
                            sx={{
                                color: '#09090b',
                                fontSize: '34px',
                                margin: '2px 5px',
                                fontWeight: 'bold'
                            }}
                        >
                            {timeIn}
                        </Typography>
                        <Box
                            sx={{
                                mt: '5px',
                                color: '#09090b', //!(!rewardPercent || rewardPercent >= 0) ? '#F93C65' : '#00B69B',
                                fontSize: '15px',
                                fontWeight: 'bold',
                                display: 'flex',
                                alignItems: 'center'
                            }}
                        >
                            {timeInPercent !== null &&
                                (!(!timeInPercent || timeInPercent >= 0) ? (
                                    <img
                                        src='/images/down.svg'
                                        style={{ marginRight: '6px', width: '26px', height: '26px' }}
                                    />
                                ) : (
                                    <img
                                        src='/images/up.svg'
                                        style={{ marginRight: '6px', width: '26px', height: '26px' }}
                                    />
                                ))}
                            {timeInPercent > 0
                                ? t('COMMON.USER.EARLIER_THAN_YESTERDAY')
                                : t('COMMON.USER.LATER_THAN_YESTERDAY')}
                            <Typography
                                sx={{
                                    ml: '6px',
                                    color: '#09090b',
                                    fontSize: '16px'
                                }}
                            >
                                {t('COMMON.ATTENDANCE.YESTERDAY')}
                            </Typography>
                        </Box>
                    </Box>

                    <Box sx={{ width: '60px', height: '40px', position: 'absolute', right: '24px' }}>
                        <ReactECharts
                            option={getOption(dataSet.Absent, colors[4])}
                            style={{ width: '100%', height: '100%' }}
                        />
                    </Box>
                </Paper>

                <Paper
                    elevation={0}
                    sx={{
                        border: '1px solid #ff5630',
                        width: 'calc(100% / 4)',
                        height: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        backgroundColor: '#fff4f2',
                        justifyContent: 'space-between',
                        borderRadius: '15px',
                        padding: '24px',
                        position: 'relative'
                    }}
                >
                    <Box>
                        <Typography
                            sx={{
                                fontSize: '16px',
                                fontWeight: 'bold',
                                color: '#637381'
                            }}
                        >
                            {t('COMMON.USER.INVALID_ATTEMPTS')}
                        </Typography>
                        <Typography
                            sx={{
                                color: '#09090b',
                                fontSize: '34px',
                                margin: '2px 5px',
                                fontWeight: 'bold'
                            }}
                        >
                            {invalid}
                        </Typography>
                        <Box
                            sx={{
                                mt: '5px',
                                color: '#09090b', //!(!rewardPercent || rewardPercent >= 0) ? '#F93C65' : '#00B69B',
                                fontSize: '15px',
                                fontWeight: 'bold',
                                display: 'flex',
                                alignItems: 'center'
                            }}
                        >
                            {invalidPercent !== null &&
                                (!(!invalidPercent || invalidPercent >= 0) ? (
                                    <img
                                        src='/images/down.svg'
                                        style={{ marginRight: '6px', width: '26px', height: '26px' }}
                                    />
                                ) : (
                                    <img
                                        src='/images/up.svg'
                                        style={{ marginRight: '6px', width: '26px', height: '26px' }}
                                    />
                                ))}
                            {invalidPercent !== null ? invalidPercent + '%' : t('COMMON.DASHBOARD.NO_CHANGE')}
                            <Typography
                                sx={{
                                    ml: '6px',
                                    color: '#09090b',
                                    fontSize: '16px'
                                }}
                            >
                                {t('COMMON.ATTENDANCE.YESTERDAY')}
                            </Typography>
                        </Box>
                    </Box>

                    <Box sx={{ width: '60px', height: '40px', position: 'absolute', right: '24px' }}>
                        <ReactECharts
                            option={getOption(dataSet.Late, colors[2])}
                            style={{ width: '100%', height: '100%' }}
                        />
                    </Box>
                </Paper>

                <Paper
                    elevation={0}
                    sx={{
                        border: '1px solid #00b8d9',
                        width: 'calc(100% / 4)',
                        height: '158px',
                        backgroundColor: 'transparent',
                        borderRadius: '15px',
                        padding: '24px',
                        position: 'relative'
                    }}
                >
                    <Typography
                        sx={{
                            fontSize: '16px',
                            fontWeight: 'bold',
                            color: 'var(--text-color)'
                        }}
                    >
                        {t('COMMON.USER.CURRENT_STATUS')}
                    </Typography>
                    <Box sx={{ display: 'flex', flex: 1, mt: '12px', flexWrap: 'wrap', gap: '12px' }}>
                        {isValidCurrent === false && (
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
                        )}
                        {checkInTimeCurrent > '08:00' && (
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
                        )}
                        {checkInTimeCurrent <= '08:00' && (
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
                </Paper>
            </Box>
        </Box>
    )
}

export default Page
