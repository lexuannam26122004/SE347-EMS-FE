import React from 'react'
import ReactECharts from 'echarts-for-react'
import { Paper, Typography } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { useTheme } from 'next-themes'
import { useGetTotalIncomeOverTimeQuery } from '@/services/SalaryService'
import { TotalIncome } from '@/models/salary'
import Loading from '@/components/Loading'

function TotalIncomeChart() {
    const { t } = useTranslation('common')
    const { theme } = useTheme()
    const { data, isLoading, isError } = useGetTotalIncomeOverTimeQuery()

    const totalData = data?.Data as TotalIncome[]

    if (isLoading) {
        return <Loading />
    }
    if (isError) {
        return (
            <Paper
                elevation={0}
                sx={{
                    width: '100%',
                    padding: '24px',
                    backgroundColor: 'var(--background-item)',
                    borderRadius: '15px',
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}
            >
                <Typography color='red'>Có lỗi xảy ra khi tải dữ liệu.</Typography> {/* Thông báo lỗi */}
            </Paper>
        )
    }

    const period = totalData?.[0]?.payrollPeriod
    const year = period ? period.split('-')[1] : null

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
            data: [
                year ? t('COMMON.SALARY.TOTAL_INCOME') + year.toString() : t('COMMON.SALARY.TOTAL_INCOME'),
                year ? t('COMMON.SALARY.TOTAL') + year.toString() : t('COMMON.SALARY.TOTAL')
            ],
            textStyle: {
                color: theme === 'light' ? '#000000' : '#ffffff'
            },
            itemGap: 30,
            formatter: (name: string) => {
                //const year = name.split(' ')[1] // Lấy năm từ tên
                const total = '1.23k' // Thay đổi giá trị tổng theo năm
                return `${name} (${t('COMMON.DASHBOARD.SUM')}: ${total})` // Thay đổi cách hiển thị
            }
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
        },
        xAxis: {
            type: 'category',
            boundaryGap: false,

            axisLine: {
                lineStyle: {
                    color: theme === 'dark' ? '#919EAB' : '#637381'
                }
            },
            splitLine: {
                lineStyle: {
                    type: 'dashed',
                    color: theme === 'light' ? '#e9ecee' : '#333d47' // Màu sắc của đường chia
                }
            },
            data: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
        },
        yAxis: {
            type: 'value',
            axisLine: {
                lineStyle: {
                    color: theme === 'dark' ? '#919EAB' : '#637381'
                }
            },
            splitLine: {
                lineStyle: {
                    type: 'dashed',
                    color: theme === 'light' ? '#e9ecee' : '#333d47' // Màu sắc của đường chia
                }
            },
            axisLabel: {
                formatter: function (value: number) {
                    if (value >= 1e9) {
                        return (value / 1e9).toFixed(1) + 'B' // "B" cho tỷ
                    } else if (value >= 1e6) {
                        return (value / 1e6).toFixed(1) + 'M' // "M" cho triệu
                    } else if (value >= 1e3) {
                        return (value / 1e3).toFixed(1) + 'K' // "K" cho nghìn
                    } else {
                        return value // Trả về giá trị bình thường nếu nhỏ hơn 1000
                    }
                }
            }
        },
        series: [
            {
                name: year ? t('COMMON.SALARY.TOTAL_INCOME') + year.toString() : t('COMMON.SALARY.TOTAL_INCOME'),
                type: 'line',
                data: totalData ? totalData.map(item => item.TotalIncome) : [],
                smooth: true,
                symbol: 'circle', // Hiển thị biểu tượng tròn
                symbolSize: 8, // Kích thước biểu tượng
                showSymbol: false,
                areaStyle: {
                    opacity: 0.2,
                    color: {
                        type: 'linear',
                        x: 0,
                        y: 0,
                        x2: 0,
                        y2: 1,
                        colorStops: [
                            {
                                offset: 0,
                                color: 'rgba(102,187,106,0.6)'
                            },
                            {
                                offset: 1,
                                color: 'rgba(102,187,106,0.1)'
                            }
                        ]
                    }
                },
                lineStyle: { color: '#00a76f', width: 2 },
                itemStyle: {
                    color: '#00a76f'
                }
            },
            {
                name: year ? t('COMMON.SALARY.TOTAL') + year.toString() : t('COMMON.SALARY.TOTAL'),
                type: 'line',
                data: totalData ? totalData.map(item => item.TotalSalary) : [],
                smooth: true,
                symbol: 'circle', // Hiển thị biểu tượng tròn
                symbolSize: 8, // Kích thước biểu tượng
                showSymbol: false,
                areaStyle: {
                    opacity: 0.2,
                    color: {
                        type: 'linear',
                        x: 0,
                        y: 0,
                        x2: 0,
                        y2: 1,
                        colorStops: [
                            {
                                offset: 0,
                                color: 'rgba(255,167,38,0.6)'
                            },
                            {
                                offset: 1,
                                color: 'rgba(255,167,38,0.1)'
                            }
                        ]
                    }
                },
                lineStyle: { color: '#ffab00', width: 2 },
                itemStyle: {
                    color: '#ffab00'
                }
            }
        ]
    }
    return (
        <Paper
            elevation={0}
            sx={{
                width: '100%',
                padding: '24px',
                backgroundColor: 'var(--background-item)',
                borderRadius: '15px',
                height: '100%'
            }}
        >
            <Typography fontSize={'24px'} fontWeight={'bold'} color='var(--text-color)'>
                {t('COMMON.SALARY.TOTAL_INCOME_OVERTIME')}
            </Typography>
            <ReactECharts option={option} style={{ width: '100%', height: '314px', marginTop: '10px' }}></ReactECharts>
        </Paper>
    )
}
export default TotalIncomeChart
