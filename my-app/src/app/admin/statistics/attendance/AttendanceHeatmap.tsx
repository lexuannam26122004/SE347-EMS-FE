'use client'

import { useTheme } from 'next-themes'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import ReactECharts from 'echarts-for-react'
import { Box, FormControlLabel, Paper, Switch, Typography } from '@mui/material'
import { styled } from '@mui/material/styles'
import { SwitchProps } from '@mui/material/Switch'

const data = [
    // Thứ 2 (Mon)
    [0, 0, 5],
    [0, 1, 30],
    [0, 2, 12],
    [0, 3, 8],
    [0, 4, 45],
    [0, 5, 50],
    [0, 6, 40],
    // Thứ 3 (Tue)
    [1, 0, 6],
    [1, 1, 35],
    [1, 2, 42],
    [1, 3, 9],
    [1, 4, 48],
    [1, 5, 33],
    [1, 6, 10],
    // Thứ 4 (Wed)
    [2, 0, 7],
    [2, 1, 32],
    [2, 2, 46],
    [2, 3, 15],
    [2, 4, 43],
    [2, 5, 52],
    [2, 6, 8],
    // Thứ 5 (Thu)
    [3, 0, 8],
    [3, 1, 37],
    [3, 2, 44],
    [3, 3, 14],
    [3, 4, 41],
    [3, 5, 39],
    [3, 6, 11],
    // Thứ 6 (Fri)
    [4, 0, 9],
    [4, 1, 34],
    [4, 2, 47],
    [4, 3, 13],
    [4, 4, 53],
    [4, 5, 39],
    [4, 6, 12],
    // Thứ 7 (Sat)
    [5, 0, 18],
    [5, 1, 36],
    [5, 2, 32],
    [5, 3, 16],
    [5, 4, 40],
    [5, 5, 45],
    [5, 6, 2],
    // Chủ Nhật (Sun)
    [6, 0, 0],
    [6, 1, 0],
    [6, 2, 0],
    [6, 3, 0],
    [6, 4, 0],
    [6, 5, 0],
    [6, 6, 0]
]

const IOSSwitch = styled((props: SwitchProps) => (
    <Switch focusVisibleClassName='.Mui-focusVisible' disableRipple {...props} />
))(({ theme }) => ({
    width: 40,
    height: 24,
    padding: 0,
    '& .MuiSwitch-switchBase': {
        padding: 0,
        margin: 2,
        transitionDuration: '300ms',
        '&.Mui-checked': {
            transform: 'translateX(16px)',
            color: '#fff',
            '& + .MuiSwitch-track': {
                backgroundColor: '#65C466',
                opacity: 1,
                border: 0,
                ...theme.applyStyles('dark', {
                    backgroundColor: '#2ECA45'
                })
            },
            '&.Mui-disabled + .MuiSwitch-track': {
                opacity: 0.5
            }
        },
        '&.Mui-focusVisible .MuiSwitch-thumb': {
            color: '#33cf4d',
            border: '6px solid #fff'
        },
        '&.Mui-disabled .MuiSwitch-thumb': {
            color: theme.palette.grey[100],
            ...theme.applyStyles('dark', {
                color: theme.palette.grey[600]
            })
        },
        '&.Mui-disabled + .MuiSwitch-track': {
            opacity: 0.7,
            ...theme.applyStyles('dark', {
                opacity: 0.3
            })
        }
    },
    '& .MuiSwitch-thumb': {
        boxSizing: 'border-box',
        width: 20,
        height: 20
    },
    '& .MuiSwitch-track': {
        borderRadius: 26 / 2,
        backgroundColor: 'var(--background-switch)',
        opacity: 1,
        transition: theme.transitions.create(['background-color'], {
            duration: 500
        }),
        ...theme.applyStyles('dark', {
            backgroundColor: '#39393D'
        })
    }
}))

const AttendanceHeatmap = () => {
    const { t } = useTranslation('common')
    const { theme } = useTheme()
    const [openLabel, setOpenLabel] = useState(false)

    const handleToggle = () => {
        setOpenLabel(prev => !prev)
    }

    const option = {
        tooltip: {
            position: 'top',
            backgroundColor: theme === 'light' ? 'rgba(250, 250, 250, 0.98)' : 'rgba(20, 26, 25, 0.98)',
            borderColor: theme === 'light' ? 'rgba(250, 250, 250, 0.98)' : 'rgba(20, 26, 25, 0.98)',
            textStyle: {
                color: theme === 'light' ? '#000000' : '#ffffff',
                fontFamily: 'Arial, sans-serif'
            }
        },
        legend: {
            data: [t('COMMON.REWARD_DISCIPLINE.DISCIPLINE'), t('COMMON.REWARD_DISCIPLINE.REWARD')],
            textStyle: {
                color: theme === 'light' ? '#000000' : '#ffffff',
                fontFamily: 'Arial, sans-serif'
            },
            itemGap: 30
        },
        grid: {
            left: '1%',
            right: '8%',
            bottom: '3%',
            containLabel: true
        },
        xAxis: {
            type: 'category',
            data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'], // Các ngày trong tuần
            axisLine: {
                show: false // Ẩn đường trục y
            },
            axisTick: {
                show: false // Ẩn đánh dấu trục y
            },
            axisLabel: {
                fontSize: '14px',
                fontFamily: 'Arial, sans-serif'
            },
            splitLine: {
                show: false // Ẩn đường chia lưới
            }
        },
        yAxis: {
            type: 'category',
            data: ['07:00', '09:00', '11:00', '13:00', '15:00', '17:00', '19:00'],
            axisLine: {
                show: false // Ẩn đường trục y
            },
            axisTick: {
                show: false // Ẩn đánh dấu trục y
            },
            axisLabel: {
                fontSize: '14px',
                fontFamily: 'Arial, sans-serif'
            },
            splitLine: {
                show: false // Ẩn đường chia lưới
            }
        },
        visualMap: {
            min: 0,
            max: 100, // Tùy vào giá trị số lượng nhân viên
            calculable: true,
            orient: 'vertical',
            left: 'right',
            top: 'center',
            textStyle: {
                color: theme === 'light' ? '#000000' : '#ffffff'
            },
            inRange: {
                color: ['#e0f7fa', '#00796b'] // Dải màu từ nhạt đến đậm
            }
        },
        series: [
            {
                name: 'Attendance',
                type: 'heatmap',
                data: data,
                itemStyle: {
                    borderRadius: 12,
                    borderWidth: 6, // Thêm đường viền để làm rõ khoảng cách giữa các ô
                    borderColor: theme === 'light' ? '#fff' : '#1c252e' // Màu viền
                },
                label: {
                    show: openLabel, // Hiển thị văn bản trong ô
                    fontFamily: 'Arial, sans-serif', // Font chữ
                    fontSize: 14, // Kích thước chữ
                    fontWeight: 'bold' // Độ đậm của chữ
                },
                emphasis: {
                    itemStyle: {
                        shadowBlur: 10,
                        shadowColor: 'rgba(0, 0, 0, 0.5)',
                        shadowOffsetX: 4, // Độ lệch bóng theo chiều X
                        shadowOffsetY: 4, // Độ lệch bóng theo chiều Y
                        // Không ảnh hưởng đến viền của các ô
                        borderWidth: 0 // Đảm bảo không làm mờ viền khi blur
                    }
                }
            }
        ]
    }

    return (
        <Paper
            sx={{
                width: '100%',
                mt: '24px',
                padding: '24px 24px 15px',
                overflow: 'hidden',
                boxShadow: 'var(--box-shadow-paper)',
                borderRadius: '20px',
                backgroundColor: 'var(--background-item)'
            }}
        >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography
                    sx={{
                        color: 'var(--text-color)',
                        fontWeight: 'bold',
                        fontSize: '18px',
                        display: 'flex',
                        alignItems: 'center'
                    }}
                >
                    {t('COMMON.ATTENDANCE.EMPLOYEE_ATTENDANCE_BY_TIME')}
                </Typography>
                <FormControlLabel
                    sx={{
                        '& .MuiFormControlLabel-label': {
                            color: 'var(--text-label-color)',
                            fontSize: '16px'
                        }
                    }}
                    control={<IOSSwitch sx={{ m: 1, mr: 2 }} onChange={handleToggle} checked={openLabel} />}
                    label={t('COMMON.ATTENDANCE.CELL_VALUE')}
                />
            </Box>
            <ReactECharts option={option} style={{ height: '500px', width: '100%' }} />
        </Paper>
    )
}

export default AttendanceHeatmap
