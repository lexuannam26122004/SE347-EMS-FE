'use client'
import React, { useState, useEffect } from 'react'
import ReactECharts from 'echarts-for-react'
import { Box, MenuItem, FormControl, Select, Paper, Typography, SelectChangeEvent } from '@mui/material'
import { useTheme } from 'next-themes'
import Loading from '@/components/Loading'
import { useGetPayrollOfDepartmentOvertimeQuery } from '@/services/SalaryService'
import { useTranslation } from 'react-i18next'

interface SalaryData {
    [department: string]: { Key: string; Value: number }[]
}

export default function PayrollShares() {
    const { t } = useTranslation()
    const { theme } = useTheme()
    const [loading, setLoading] = useState(true)
    const currentYear = new Date().getFullYear()
    const [selectedYear, setSelectedYear] = useState<number>(currentYear)

    const [option, setOption] = useState<any>(null)
    const queryParams = {
        year: typeof selectedYear === 'number' ? selectedYear.toString() : new Date().getFullYear().toString()
    }

    const { data, isLoading } = useGetPayrollOfDepartmentOvertimeQuery(queryParams) as {
        data: { Data: SalaryData }
        error: any
        isLoading: boolean
    }

    const handleYearChange = (event: SelectChangeEvent<number>) => {
        setSelectedYear(event.target.value as number)
    }
    useEffect(() => {
        if (!data?.Data) return

        const selectedData = data.Data

        // Extract categories (months) from the first department's data
        const categories = Object.values(selectedData)[0]?.map(item => item.Key) || []
        // Create series for the chart
        const series = Object.keys(selectedData).map(department => ({
            name: department,
            type: 'line',
            data: selectedData[department].map(item => item.Value)
        }))

        setOption({
            tooltip: {
                trigger: 'axis'
            },
            legend: {
                data: Object.keys(selectedData),
                textStyle: {
                    color: theme === 'light' ? 'black' : '#fff',
                    fontFamily: 'Arial, sans-serif'
                }
            },
            grid: {
                left: '5%',
                right: '4%',
                bottom: '0%',
                top: '25%',
                containLabel: true
            },
            toolbox: {
                feature: {
                    saveAsImage: {}
                }
            },
            xAxis: {
                type: 'category',
                boundaryGap: false,
                data: categories,
                axisLabel: {
                    textStyle: {
                        color: theme === 'light' ? 'black' : '#fff',
                        fontFamily: 'Arial, sans-serif'
                    }
                }
            },
            yAxis: {
                type: 'value'
            },
            axisLabel: {
                formatter: function (value: number) {
                    if (value >= 1e9) {
                        return (value / 1e9).toFixed(0) + 'B' // "B" cho tỷ
                    } else if (value >= 1e6) {
                        return (value / 1e6).toFixed(0) + 'M' // "M" cho triệu
                    } else if (value >= 1e3) {
                        return (value / 1e3).toFixed(0) + 'K' // "K" cho nghìn
                    } else {
                        return value // Trả về giá trị bình thường nếu nhỏ hơn 1000
                    }
                }
            },
            series: series,
            textStyle: {
                color: theme === 'light' ? 'black' : '#fff',
                fontFamily: 'Arial, sans-serif'
            }
        })

        setLoading(false)
    }, [data, theme])
    if (loading || isLoading) {
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
                height: '100%',
                boxShadow: 'var(--box-shadow-paper)'
            }}
        >
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'space-between'
                }}
            >
                <Typography fontSize={'20px'} fontWeight={'bold'} color='var(--text-color)'>
                    {t('COMMON.SALARY.PAYROLL_OF_DEPARTMENTS_OVERTIME')}
                </Typography>
                <FormControl sx={{ width: '150px' }}>
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
                        {[...Array(currentYear - 2021)].map((_, index) => {
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
            {option ? (
                <ReactECharts option={option} style={{ width: '100%', height: '380px', marginTop: '10px' }} />
            ) : null}
        </Paper>
    )
}
