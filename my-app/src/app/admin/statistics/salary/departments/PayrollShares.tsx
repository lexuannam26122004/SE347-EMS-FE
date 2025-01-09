'use client'
import React, { useEffect, useState } from 'react'
import ReactECharts from 'echarts-for-react'
import { Paper, Typography } from '@mui/material'
import { useTheme } from 'next-themes'
import { useGetGrossTotalByDepartmentsQuery } from '@/services/SalaryService'
import Loading from '@/components/Loading'
import { useTranslation } from 'react-i18next'
export default function PayrollShares() {
    const { t } = useTranslation()
    const { theme } = useTheme()
    const [chartData, setChartData] = useState<{ [key: string]: number }>({})
    const [loading, setLoading] = useState(true)
    const { data, isLoading, error } = useGetGrossTotalByDepartmentsQuery()
    useEffect(() => {
        if (data) {
            setChartData(data.Data.salaryPercent) // Giả sử dữ liệu trả về có cấu trúc như bạn đã định nghĩa
            setLoading(false)
        }
    }, [data])

    if (isLoading || loading) {
        return <Loading />
    }
    if (error) {
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

    const chartDataArray = Object.entries(chartData).map(([name, value]) => ({
        value,
        name
    }))
    const option = {
        tooltip: {
            trigger: 'item'
        },
        legend: {
            top: '5%',
            left: 'center',
            textStyle: {
                color: theme === 'light' ? 'black' : '#fff',
                fontFamily: 'Arial, sans-serif'
            }
        },
        series: [
            {
                name: 'Access From',
                type: 'pie',
                radius: ['40%', '70%'],
                center: ['50%', '60%'],
                avoidLabelOverlap: false,
                itemStyle: {
                    borderRadius: 10,
                    borderWidth: 2
                },
                label: {
                    show: false,
                    position: 'center'
                },
                emphasis: {
                    label: {
                        show: true,
                        fontSize: 40,
                        fontWeight: 'bold'
                    }
                },
                labelLine: {
                    show: true
                },
                data: chartDataArray
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
                height: '100%',
                boxShadow: 'var(--box-shadow-paper)'
            }}
        >
            <Typography fontSize={'20px'} fontWeight={'bold'} color='var(--text-color)'>
                {t('COMMON.SALARY.PAYROLL_SHARES_BY_DEPARTMENTS')}
            </Typography>
            <ReactECharts option={option} style={{ width: '100%', height: '400px', marginTop: '5px' }}></ReactECharts>
        </Paper>
    )
}
