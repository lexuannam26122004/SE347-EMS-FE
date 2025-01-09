'use client'
import React from 'react'
import ReactECharts from 'echarts-for-react'
import { Box, CircularProgress, Paper, Typography } from '@mui/material'
import { useTheme } from 'next-themes'
import { useGetGrossTotalQuery } from '@/services/SalaryService'
import { useTranslation } from 'react-i18next'
interface IGrossTotal {
    netSalaries: number
    PITaxes: number
    ins: number
    netSalary: number
    PITax: number
    totalInsurance: number
}
export default function GrossTotal() {
    const { t } = useTranslation()
    const { theme } = useTheme()
    const { data, isLoading, isError } = useGetGrossTotalQuery()

    const grossData = data?.Data as IGrossTotal

    if (isLoading) {
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
                <CircularProgress /> {/* Hiển thị spinner khi đang tải */}
            </Paper>
        )
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
    const option = {
        tooltip: {
            trigger: 'item'
        },
        legend: {
            top: '5%',
            left: 'center',
            itemGap: 10,
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
                    show: false
                },
                data: [
                    {
                        value: grossData?.netSalary,
                        name: t('COMMON.SALARY.TOTAL_SALARY'),
                        itemStyle: {
                            color: '#ffab00'
                        }
                    },
                    {
                        value: grossData?.totalInsurance,
                        name: t('COMMON.SALARY.TOTAL_INSURANCE'),
                        itemStyle: {
                            color: '#00a76f'
                        }
                    },
                    {
                        value: grossData?.PITax,
                        name: t('COMMON.SALARY.TOTAL_PITAX'),
                        itemStyle: {
                            color: '#c23531'
                        }
                    }
                ]
            }
        ]
    }
    const formatCurrency = (value: number) => {
        if (value === null || value === undefined) return '0'

        const absValue = Math.abs(value)
        if (absValue >= 1e9) {
            return (value / 1e9).toFixed(2) + ' B' // Tỷ
        } else if (absValue >= 1e6) {
            return (value / 1e6).toFixed(2) + ' M' // Triệu
        } else if (absValue >= 1e3) {
            return (value / 1e3).toFixed(2) + ' K' // Triệu
        } else {
            return value.toString() // Giá trị gốc nếu nhỏ hơn triệu
        }
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
            <Typography fontSize={'24px'} fontWeight={'bold'} color='var(--text-color)'>
                {t('COMMON.SALARY.GROSS_TOTAL')}
            </Typography>
            <ReactECharts option={option} style={{ width: '100%', height: '315px', marginTop: '20px' }}></ReactECharts>
            <Box sx={{ marginTop: '15px', height: '70px' }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Box sx={{ width: 15, height: 15, borderRadius: 45, backgroundColor: '#ffab00' }}></Box>
                    <Typography sx={{ marginLeft: '10px', color: 'var(--text-color)' }}>
                        {t('COMMON.SALARY.TOTAL_SALARY')}
                    </Typography>
                    <Typography sx={{ marginLeft: 'auto', color: 'var(--text-color)' }}>
                        đ {formatCurrency(grossData?.netSalaries)}
                    </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Box sx={{ width: 15, height: 15, borderRadius: 45, backgroundColor: '#00a76f' }}></Box>
                    <Typography sx={{ marginLeft: '10px', color: 'var(--text-color)' }}>
                        {t('COMMON.SALARY.TOTAL_INSURANCE')}
                    </Typography>
                    <Typography sx={{ marginLeft: 'auto', color: 'var(--text-color)' }}>
                        đ {formatCurrency(grossData?.ins)}
                    </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Box sx={{ width: 15, height: 15, borderRadius: 45, backgroundColor: '#c23531' }}></Box>
                    <Typography sx={{ marginLeft: '10px', color: 'var(--text-color)' }}>
                        {t('COMMON.SALARY.TOTAL_PITAX')}
                    </Typography>
                    <Typography sx={{ marginLeft: 'auto', color: 'var(--text-color)' }}>
                        đ {formatCurrency(grossData?.PITaxes)}
                    </Typography>
                </Box>
            </Box>
        </Paper>
    )
}
