'use client'

import { Box, Paper, Typography } from '@mui/material'
import { useTranslation } from 'react-i18next'
import ReactECharts from 'echarts-for-react'
import { useTheme } from 'next-themes'

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

const colors = ['#00a76f', '#00b8d9', '#ff5630', '#f83696', '#ffab00', '#b863f0']

function Page() {
    const { t } = useTranslation('common')
    const onTime = 73
    const early = 15
    const late = 5
    const timeOff = 10
    const absent = 2
    const invalid = 1
    const onTimePercent = 10
    const earlyPercent = 5
    const latePercent = -20
    const timeOffPercent = -25
    const absentPercent = 100
    const invalidPercent = -50
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
                        width: 'calc(100% / 3)',
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
                            {t('COMMON.ATTENDANCE.ON_TIME')}
                        </Typography>
                        <Typography
                            sx={{
                                color: '#09090b',
                                fontSize: '34px',
                                margin: '10px 5px',
                                fontWeight: 'bold'
                            }}
                        >
                            {onTime}
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
                            {onTimePercent !== null &&
                                (!(!onTimePercent || onTimePercent >= 0) ? (
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
                            {onTimePercent !== null ? onTimePercent + '%' : t('COMMON.DASHBOARD.NO_CHANGE')}
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
                        border: '1px solid #00b8d9',
                        width: 'calc(100% / 3)',
                        height: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        backgroundColor: '#effdff',
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
                            {t('COMMON.ATTENDANCE.EARLY')}
                        </Typography>
                        <Typography
                            sx={{
                                color: '#09090b',
                                fontSize: '34px',
                                margin: '10px 5px',
                                fontWeight: 'bold'
                            }}
                        >
                            {early}
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
                            {earlyPercent !== null &&
                                (!(!earlyPercent || earlyPercent >= 0) ? (
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
                            {earlyPercent !== null ? earlyPercent + '%' : t('COMMON.DASHBOARD.NO_CHANGE')}
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
                            option={getOption(dataSet.Early, colors[1])}
                            style={{ width: '100%', height: '100%' }}
                        />
                    </Box>
                </Paper>

                <Paper
                    elevation={0}
                    sx={{
                        border: '1px solid #ff5630',
                        width: 'calc(100% / 3)',
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
                            {t('COMMON.ATTENDANCE.LATE')}
                        </Typography>
                        <Typography
                            sx={{
                                color: '#09090b',
                                fontSize: '34px',
                                margin: '10px 5px',
                                fontWeight: 'bold'
                            }}
                        >
                            {late}
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
                            {latePercent !== null &&
                                (!(!latePercent || latePercent >= 0) ? (
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
                            {latePercent !== null ? latePercent + '%' : t('COMMON.DASHBOARD.NO_CHANGE')}
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
            </Box>

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
                        border: '1px solid #f83696',
                        width: 'calc(100% / 3)',
                        height: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        backgroundColor: '#fff4fa',
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
                            {t('COMMON.ATTENDANCE.LEAVE')}
                        </Typography>
                        <Typography
                            sx={{
                                color: '#09090b',
                                fontSize: '34px',
                                margin: '10px 5px',
                                fontWeight: 'bold'
                            }}
                        >
                            {timeOff}
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
                            {timeOffPercent !== null &&
                                (!(!timeOffPercent || timeOffPercent >= 0) ? (
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
                            {timeOffPercent !== null ? timeOffPercent + '%' : t('COMMON.DASHBOARD.NO_CHANGE')}
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
                            option={getOption(dataSet.Leave, colors[3])}
                            style={{ width: '100%', height: '100%' }}
                        />
                    </Box>
                </Paper>

                <Paper
                    elevation={0}
                    sx={{
                        border: '1px solid #ffab00',
                        width: 'calc(100% / 3)',
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
                            {t('COMMON.ATTENDANCE.ABSENT')}
                        </Typography>
                        <Typography
                            sx={{
                                color: '#09090b',
                                fontSize: '34px',
                                margin: '10px 5px',
                                fontWeight: 'bold'
                            }}
                        >
                            {absent}
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
                            {absentPercent !== null &&
                                (!(!absentPercent || absentPercent >= 0) ? (
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
                            {absentPercent !== null ? absentPercent + '%' : t('COMMON.DASHBOARD.NO_CHANGE')}
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
                        border: '1px solid #b863f0',
                        width: 'calc(100% / 3)',
                        height: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        backgroundColor: '#fbf6ff',
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
                            {t('COMMON.ATTENDANCE.INVALID')}
                        </Typography>
                        <Typography
                            sx={{
                                color: '#09090b',
                                fontSize: '34px',
                                margin: '10px 5px',
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
                            option={getOption(dataSet.Invalid, colors[5])}
                            style={{ width: '100%', height: '100%' }}
                        />
                    </Box>
                </Paper>
            </Box>
        </Box>
    )
}

export default Page
