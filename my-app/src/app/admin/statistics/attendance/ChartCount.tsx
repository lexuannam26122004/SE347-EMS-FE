import { MenuItem, FormControl, Select, Box, Paper, Typography, SelectChangeEvent } from '@mui/material'
import ReactECharts from 'echarts-for-react'
import { useTheme } from 'next-themes'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { InputLabel } from '@mui/material'

export default function Chart() {
    const { t } = useTranslation('common')
    const { theme } = useTheme()
    const [type, setType] = useState(0)

    const handleTypeChange = (event: SelectChangeEvent<number>) => {
        setType(event.target.value as number)
    }

    const option = {
        animation: true, // Bật hiệu ứng chuyển tiếp
        animationDuration: 700, // Thời gian chuyển tiếp (ms)
        tooltip: {
            trigger: 'axis',
            backgroundColor: theme === 'light' ? 'rgba(250, 250, 250, 0.98)' : 'rgba(20, 26, 25, 0.98)',
            borderColor: theme === 'light' ? 'rgba(250, 250, 250, 0.98)' : 'rgba(20, 26, 25, 0.98)',
            textStyle: {
                color: theme === 'light' ? '#000000' : '#ffffff',
                fontFamily: 'Arial, sans-serif'
            }
        },
        dataset: {
            source: [
                ['department', t('COMMON.ATTENDANCE.JOIN'), t('COMMON.ATTENDANCE.STATUS_ABSENT')], // Cột đầu tiên là danh mục, sau đó là các giá trị
                ['Human Resources', 5, 2],
                ['Finance', 24, 5],
                ['IT Services', 17, 8],
                ['Marketing', 20, 2],
                ['Sales', 5, 3],
                ['Operations', 20, 4],
                ['Customer Support', 14, 6]
            ]
        },
        calculable: true,
        grid: {
            top: '2%',
            left: '0%',
            right: '10%',
            bottom: '4%',
            containLabel: true
        },
        xAxis: {
            name: 'Số lượng',
            type: 'value',
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
            }
        },
        yAxis: {
            type: 'category',
            axisLine: {
                show: false // Ẩn đường trục y
            },
            axisTick: {
                show: false // Ẩn đánh dấu trục y
            },
            axisLabel: {
                fontSize: '13px',
                fontFamily: 'Arial, sans-serif'
            },
            splitLine: {
                show: false // Ẩn đường chia lưới
            }
        },
        series: [
            {
                type: 'bar',
                name: t('COMMON.ATTENDANCE.JOIN'),
                encode: {
                    x: t('COMMON.ATTENDANCE.JOIN'), // Giá trị cột "tham gia"
                    y: 'product' // Danh mục
                },
                itemStyle: {
                    color: theme === 'dark' ? '#007867' : '#007867'
                }
            },
            {
                type: 'bar',
                name: t('COMMON.ATTENDANCE.STATUS_ABSENT'),
                encode: {
                    x: t('COMMON.ATTENDANCE.STATUS_ABSENT'), // Giá trị cột "vắng mặt"
                    y: 'product' // Danh mục
                },
                itemStyle: {
                    color: theme === 'dark' ? '#15393c' : '#c2dfdb'
                }
            }
        ]
    }

    return (
        <Paper
            sx={{
                width: '100%',
                padding: '24px 24px 15px',
                overflow: 'hidden',
                boxShadow: 'var(--box-shadow-paper)',
                borderRadius: '15px',
                backgroundColor: 'var(--background-item)'
            }}
        >
            <Box
                sx={{
                    display: 'flex',
                    mb: '10px',
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
                        {t('COMMON.ATTENDANCE.BY_DEPARTMENT')}
                    </Typography>
                </Box>
                <FormControl
                    sx={{
                        width: '140px',
                        mb: 'auto',
                        '& fieldset': {
                            borderRadius: '8px',
                            borderColor: 'var(--border-color)' // Viền mặc định
                        },
                        '& .MuiOutlinedInput-root:hover fieldset': {
                            borderColor: 'var(--hover-field-color)' // Màu hover khi không lỗi
                        },
                        '& .MuiOutlinedInput-root.Mui-error:hover fieldset': {
                            borderColor: 'var(--error-color)' // Màu hover khi lỗi
                        },
                        '& .MuiOutlinedInput-root.Mui-error fieldset': {
                            borderColor: 'var(--error-color)' // Màu viền khi lỗi
                        },
                        '& .MuiOutlinedInput-root.Mui-focused fieldset': {
                            borderColor: 'var(--selected-field-color)' // Màu viền khi focus
                        },
                        '& .MuiOutlinedInput-root.Mui-error.Mui-focused fieldset': {
                            borderColor: 'var(--error-color)' // Màu viền khi lỗi và focus
                        },
                        '& .MuiInputLabel-root': {
                            color: 'var(--text-label-color)' // Label mặc định
                        },
                        '& .MuiInputLabel-root.Mui-focused': {
                            color: 'var(--selected-field-color)' // Label khi focus
                        },
                        '& .MuiInputLabel-root.Mui-error': {
                            color: 'var(--error-color)' // Label khi lỗi
                        }
                    }}
                >
                    <InputLabel id='select-label'>{t('COMMON.STAT_NOTIFY.BY')}</InputLabel>
                    <Select
                        label={t('COMMON.STAT_NOTIFY.BY')}
                        defaultValue={1}
                        value={type}
                        onChange={handleTypeChange}
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
                                padding: '9.5px 14px'
                            }
                        }}
                        MenuProps={{
                            PaperProps: {
                                elevation: 0,
                                sx: {
                                    width: '140px',
                                    mt: '4px',
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
                        <MenuItem
                            value={0}
                            sx={{
                                borderRadius: '6px'
                            }}
                        >
                            {t('COMMON.USER.THIS_WEEK')}
                        </MenuItem>

                        <MenuItem
                            value={1}
                            sx={{
                                borderRadius: '6px',
                                mt: '3px'
                            }}
                        >
                            {t('COMMON.USER.THIS_MONTH')}
                        </MenuItem>

                        <MenuItem
                            value={2}
                            sx={{
                                borderRadius: '6px',
                                mt: '3px'
                            }}
                        >
                            {t('COMMON.USER.THIS_YEAR')}
                        </MenuItem>
                    </Select>
                </FormControl>
            </Box>
            <ReactECharts option={option} style={{ height: 450 }} />
        </Paper>
    )
}
