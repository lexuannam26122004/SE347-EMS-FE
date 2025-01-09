import React, { useState } from 'react'

import { MenuItem, FormControl, Select, Box, Paper, Typography, SelectChangeEvent } from '@mui/material'
import { useTranslation } from 'react-i18next'
import ReactECharts from 'echarts-for-react'
import { useTheme } from 'next-themes'
import Loading from '@/components/Loading'
import { useGetCountErrorReportsByTypeAndYearQuery } from '@/services/ErrorReportService'

interface ICountErrorReportsByType {
    Type: string
    Count: number
}

const Chart: React.FC = () => {
    const currentYear = new Date().getFullYear()
    const [selectedYear, setSelectedYear] = useState(currentYear)
    const { t } = useTranslation('common')
    const { theme } = useTheme()

    const { data: response, isLoading } = useGetCountErrorReportsByTypeAndYearQuery(selectedYear)
    const data: ICountErrorReportsByType[] = Array.isArray(response?.Data) ? response.Data : []

    const handleYearChange = (event: SelectChangeEvent<number>) => {
        setSelectedYear(Number(event.target.value))
    }

    if (isLoading) {
        return <Loading />
    }

    const reportData = data.map(item => ({
        score: item.Count,
        amount: item.Count,
        type: t(item.Type)
    }))

    const maxScore = reportData.length > 0 ? Math.max(...reportData.map(item => item.score)) : 0

    const option = {
        textStyle: {
            color: theme === 'light' ? '#000000' : '#ffffff',
            fontFamily: 'Arial, sans-serif'
        },
        dataset: {
            source: [['score', 'amount', 'type'], ...reportData.map(item => [item.score, item.amount, item.type])]
        },
        grid: { containLabel: true, top: '10%', left: '2%', right: '10%', bottom: '3%' },
        xAxis: {},
        yAxis: { type: 'category' },
        visualMap: {
            orient: 'horizontal',
            left: 'center',
            top: '0%',
            min: 0,
            max: maxScore,
            text: [
                t('COMMON.TIMEOFF_ERROR.ERROR_STATISTICS_CHART_HIGH'),
                t('COMMON.TIMEOFF_ERROR.ERROR_STATISTICS_CHART_SHORT')
            ],
            textStyle: {
                color: theme === 'light' ? '#000000' : '#ffffff',
                fontFamily: 'Arial, sans-serif'
            },
            dimension: 0,
            inRange: {
                color: ['#e0f7fa', '#00796b']
            },
            itemHeight: '300'
        },
        tooltip: {
            trigger: 'item', // Trigger when hovering over an item
            formatter: function (params) {
                return `${params.value[2]}<br/>${params.value[1]}`
            },
            textStyle: {
                fontFamily: 'Arial, sans-serif'
            }
        },
        toolbox: {
            feature: {
                saveAsImage: {
                    show: true,
                    title: 'Save as Image',
                    pixelRatio: 2
                }
            }
        },
        legend: {
            textStyle: {
                color: theme === 'light' ? '#000000' : '#ffffff',
                fontFamily: 'Arial, sans-serif'
            }
        },
        series: [
            {
                type: 'bar',
                encode: {
                    x: 'amount',
                    y: 'type'
                },
                itemStyle: {
                    borderRadius: [0, 30, 30, 0]
                },
                emphasis: {
                    itemStyle: {
                        borderWidth: 2,
                        shadowBlur: 20,
                        shadowOffsetX: 5,
                        shadowOffsetY: 5,
                        shadowColor: 'var(--text-color)'
                    }
                }
            }
        ]
    }

    return (
        <Paper
            elevation={0}
            sx={{
                width: '100%',
                boxShadow: 'var(--box-shadow-paper)',
                mt: '24px',
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
                        {t('COMMON.TIMEOFF_ERROR.ERROR_STATISTICS_CHART')}
                    </Typography>
                </Box>
                <FormControl sx={{ width: '100px' }}>
                    <Select
                        value={selectedYear}
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
                        {[...Array(currentYear - 2022 + 1)].map((_, index) => {
                            const year = 2022 + index
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
            <ReactECharts option={option} style={{ height: 500 }} />
        </Paper>
    )
}

export default Chart
