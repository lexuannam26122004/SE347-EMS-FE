import { MenuItem, FormControl, Select, Box, Paper, Typography, SelectChangeEvent } from '@mui/material'
import ReactECharts from 'echarts-for-react'
import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useStatsChartQuery } from '@/services/StatsRewardAndDisciplineService'

export default function Chart() {
    const { t } = useTranslation('common')
    const { theme } = useTheme()
    const currentYear = new Date().getFullYear()
    const [selectedYear, setSelectedYear] = useState(currentYear)

    const handleYearChange = (event: SelectChangeEvent<number>) => {
        setSelectedYear(event.target.value as number)
    }

    const { data: responseDate, isLoading } = useStatsChartQuery(selectedYear)

    const percent = responseDate?.Data?.Percent || 0
    const rewardData = responseDate?.Data?.ListReward || []
    const disciplineData = responseDate?.Data?.ListDiscipline || []

    const option = {
        animation: true, // Bật hiệu ứng chuyển tiếp
        animationDuration: 700, // Thời gian chuyển tiếp (ms)
        tooltip: {
            trigger: 'axis',
            backgroundColor: theme === 'light' ? 'rgba(250, 250, 250, 0.98)' : 'rgba(20, 26, 25, 0.98)',
            borderColor: theme === 'light' ? 'rgba(250, 250, 250, 0.98)' : 'rgba(20, 26, 25, 0.98)',
            textStyle: {
                color: theme === 'light' ? '#000000' : '#ffffff'
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
        toolbox: {
            show: true,
            feature: {
                magicType: { show: true, type: ['line', 'bar'] },
                saveAsImage: { show: true }
            }
        },
        grid: {
            left: '2%',
            right: '5.5%',
            bottom: '3%',
            containLabel: true
        },
        calculable: true,
        xAxis: [
            {
                type: 'category',
                boundaryGap: true, // Để cột không chạm vào nhau
                axisLine: {
                    lineStyle: {
                        color: theme === 'dark' ? '#919EAB' : '#637381'
                    }
                },
                splitLine: {
                    lineStyle: {
                        type: 'dashed',
                        color: theme === 'light' ? '#e9ecee' : '#333d47'
                    }
                },
                // prettier-ignore
                data: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
            }
        ],
        yAxis: [
            {
                axisLine: {
                    lineStyle: {
                        color: theme === 'dark' ? '#919EAB' : '#637381'
                    }
                },
                splitLine: {
                    lineStyle: {
                        type: 'dashed',
                        color: theme === 'light' ? '#e9ecee' : '#333d47'
                    }
                },
                type: 'value'
            }
        ],
        series: [
            {
                name: t('COMMON.REWARD_DISCIPLINE.DISCIPLINE'),
                type: 'bar',
                data: disciplineData,
                markPoint: {
                    data: [
                        { type: 'max', name: 'Max' },
                        { type: 'min', name: 'Min' }
                    ]
                },
                barWidth: '22%', // Điều chỉnh độ rộng của cột
                itemStyle: {
                    color: '#d24c2f',
                    borderRadius: [6, 6, 0, 0] // Bo tròn đỉnh cột
                },
                markLine: {
                    data: [{ type: 'average', name: 'Avg' }],
                    label: {
                        color: theme === 'light' ? '#000000' : '#ffffff',
                        fontSize: 11,
                        fontWeight: 'bold'
                    }
                }
            },
            {
                name: t('COMMON.REWARD_DISCIPLINE.REWARD'),
                type: 'bar',
                data: rewardData,
                barWidth: '22%', // Điều chỉnh độ rộng của cột
                itemStyle: {
                    color: '#00a76f',
                    borderRadius: [6, 6, 0, 0] // Bo tròn đỉnh cột
                },
                markPoint: {
                    data: [
                        { type: 'max', name: 'Max' },
                        { type: 'min', name: 'Min' }
                    ]
                },
                markLine: {
                    data: [{ type: 'average', name: 'Avg' }],
                    label: {
                        color: theme === 'light' ? '#000000' : '#ffffff',
                        fontSize: 11,
                        fontWeight: 'bold'
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
                boxShadow: 'var(--box-shadow-paper)',
                padding: '24px 24px 15px',
                overflow: 'hidden',
                borderRadius: '20px',
                backgroundColor: 'var(--background-item)'
            }}
        >
            <Box
                sx={{
                    display: 'flex',
                    mb: '24px',
                    justifyContent: 'space-between'
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
                        {t('COMMON.REWARD_DISCIPLINE.CHART_STATISTIC_REWARD_DISCIPLINE')}
                    </Typography>
                    <Typography
                        sx={{
                            fontSize: '14px',
                            mt: '4px',
                            color: theme === 'dark' ? '#919EAB' : '#637381'
                        }}
                    >
                        {t('COMMON.REWARD_DISCIPLINE.PERCENT_REWARD_DISCIPLINE_IN_YEAR')}
                        {' ' + percent + '% '}
                    </Typography>
                </Box>
                <FormControl sx={{ width: '90px' }}>
                    <Select
                        defaultValue={currentYear}
                        onChange={handleYearChange}
                        sx={{
                            '&:hover .MuiOutlinedInput-notchedOutline': {
                                borderColor: 'var(--border-color)'
                            },
                            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                border: '1px solid var(--border-color)' // Đặt border cho trạng thái focus
                            },
                            '& fieldset': {
                                borderRadius: '8px',
                                borderColor: 'var(--border-color)'
                            },
                            '& .MuiSelect-icon': {
                                color: 'var(--text-color)'
                            },
                            '& .MuiInputBase-input': {
                                color: 'var(--text-color)',
                                padding: '10px'
                            }
                        }}
                        MenuProps={{
                            PaperProps: {
                                elevation: 0,
                                sx: {
                                    width: '120px',
                                    mt: '2px',
                                    borderRadius: '8px',
                                    padding: '0 8px',
                                    backgroundImage:
                                        'url(data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIwIiBoZWlnaHQ9IjEyMCIgdmlld0JveD0iMCAwIDEyMCAxMjAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMjAiIGhlaWdodD0iMTIwIiBmaWxsPSJ1cmwoI3BhaW50MF9yYWRpYWxfMjc0OV8xNDUxODYpIiBmaWxsLW9wYWNpdHk9IjAuMTIiLz4KPGRlZnM+CjxyYWRpYWxHcmFkaWVudCBpZD0icGFpbnQwX3JhZGlhbF8yNzQ5XzE0NTE4NiIgY3g9IjAiIGN5PSIwIiByPSIxIiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSIgZ3JhZGllbnRUcmFuc2Zvcm09InRyYW5zbGF0ZSgxMjAgMS44MTgxMmUtMDUpIHJvdGF0ZSgtNDUpIHNjYWxlKDEyMy4yNSkiPgo8c3RvcCBzdG9wLWNvbG9yPSIjMDBCOEQ5Ii8+CjxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iIzAwQjhEOSIgc3RvcC1vcGFjaXR5PSIwIi8+CjwvcmFkaWFsR3JhZGllbnQ+CjwvZGVmcz4KPC9zdmc+Cg==), url(data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIwIiBoZWlnaHQ9IjEyMCIgdmlld0JveD0iMCAwIDEyMCAxMjAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMjAiIGhlaWdodD0iMTIwIiBmaWxsPSJ1cmwoI3BhaW50MF9yYWRpYWxfMjc0OV8xNDUxODcpIiBmaWxsLW9wYWNpdHk9IjAuMTIiLz4KPGRlZnM+CjxyYWRpYWxHcmFkaWVudCBpZD0icGFpbnQwX3JhZGlhbF8yNzQ5XzE0NTE4NyIgY3g9IjAiIGN5PSIwIiByPSIxIiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSIgZ3JhZGllbnRUcmFuc2Zvcm09InRyYW5zbGF0ZSgwIDEyMCkgcm90YXRlKDEzNSkgc2NhbGUoMTIzLjI1KSI+CjxzdG9wIHN0b3AtY29sb3I9IiNGRjU2MzAiLz4KPHN0b3Agb2Zmc2V0PSIxIiBzdG9wLWNvbG9yPSIjRkY1NjMwIiBzdG9wLW9wYWNpdHk9IjAiLz4KPC9yYWRpYWxHcmFkaWVudD4KPC9kZWZzPgo8L3N2Zz4K)',
                                    backgroundPosition: 'top right, bottom left',
                                    backgroundSize: '50%, 50%',
                                    backgroundRepeat: 'no-repeat',
                                    backdropFilter: 'blur(20px)',
                                    backgroundColor: 'var(--background-item)',
                                    color: 'var(--text-color)',
                                    border: '1px solid var(--border-color)',
                                    '& .MuiMenuItem-root': {
                                        '&:hover': { backgroundColor: 'var(--hover-color)' },
                                        '&.Mui-selected': {
                                            backgroundColor: 'var(--background-selected-item)',
                                            '&:hover': { backgroundColor: 'var(--hover-color)' }
                                        }
                                    }
                                }
                            },
                            anchorOrigin: {
                                vertical: 'bottom',
                                horizontal: 'right' // Căn chỉnh bên phải
                            },
                            transformOrigin: {
                                vertical: 'top',
                                horizontal: 'right' // Căn chỉnh bên phải
                            }
                        }}
                    >
                        {[...Array(currentYear - 2022)].map((_, index) => {
                            const year = currentYear - index
                            return (
                                <MenuItem
                                    key={year}
                                    value={year}
                                    sx={{
                                        borderRadius: '6px',
                                        '&:last-child': {
                                            mt: '3px'
                                        }
                                    }}
                                >
                                    {year}
                                </MenuItem>
                            )
                        })}
                    </Select>
                </FormControl>
            </Box>
            <ReactECharts option={option} style={{ height: 450 }} />
        </Paper>
    )
}
