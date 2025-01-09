'use client'
import React from 'react'
import ReactECharts from 'echarts-for-react'
import { Paper, Typography } from '@mui/material'
import { useTheme } from 'next-themes'
import { useGetTotalBySexQuery } from '@/services/SalaryService'
import { useTranslation } from 'react-i18next'
import Loading from '@/components/Loading'
interface TotalBySex {
    male: number
    female: number
    other: number
}
export default function TotalBySex() {
    const { t } = useTranslation()
    const { theme } = useTheme()
    const { data, isLoading, isError } = useGetTotalBySexQuery()

    const totalData = data?.Data as TotalBySex

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
                    justifyContent: 'center',
                    boxShadow: 'var(--box-shadow-paper)'
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
            orient: 'vertical',
            left: 'left',
            textStyle: {
                color: theme === 'light' ? 'black' : '#fff',
                fontFamily: 'Arial, sans-serif'
            }
        },
        series: [
            {
                name: 'Access From',
                type: 'pie',
                radius: '60%',
                data: [
                    {
                        value: totalData?.male,
                        name: t('COMMON.SALARY.MALE'),
                        itemStyle: {
                            color: '#00a76f'
                        }
                    },
                    {
                        value: totalData?.female,
                        name: t('COMMON.SALARY.FEMALE'),
                        itemStyle: {
                            color: '#ffab00'
                        }
                    },
                    {
                        value: totalData?.other,
                        name: t('COMMON.SALARY.OTHER'),
                        itemStyle: {
                            color: '#FF6699'
                        }
                    }
                ],
                emphasis: {
                    itemStyle: {
                        shadowBlur: 10,
                        shadowOffsetX: 0,
                        shadowColor: 'rgba(0, 0, 0, 0.5)'
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
                padding: '20px',
                backgroundColor: 'var(--background-item)',
                borderRadius: '15px',
                height: '100%'
            }}
        >
            <Typography fontSize={'20px'} fontWeight={'bold'} color='var(--text-color)'>
                {t('COMMON.SALARY.SALARY_ANALYSIS_BY_GENDER')}
            </Typography>
            <ReactECharts option={option} style={{ width: '100%', height: '260px', marginTop: '20px' }}></ReactECharts>
        </Paper>
    )
}
