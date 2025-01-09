'use client'

import React from 'react'
import ReactECharts from 'echarts-for-react'
import { Box, Paper, Typography } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { useTheme } from 'next-themes'
import Loading from '@/components/Loading'
import { useGetEmployeeCountByGenderQuery } from '@/services/AspNetUserService'

export interface IUserByGenderGetAllDashboard {
    Male: number
    Female: number
    Other: number
}

const GenderPieChart: React.FC = () => {
    const { t } = useTranslation('common')
    const { theme } = useTheme()

    const { data, isFetching } = useGetEmployeeCountByGenderQuery()
    const gender = data?.Data as IUserByGenderGetAllDashboard

    if (isFetching) {
        return <Loading />
    }

    const option = {
        textStyle: {
            color: theme === 'light' ? '#000000' : '#ffffff',
            fontFamily: 'Arial, sans-serif'
        },
        tooltip: {
            trigger: 'item',
            formatter: '{b}: {c} ({d}%)'
        },
        legend: {
            top: 'bottom',
            textStyle: {
                color: theme === 'light' ? '#000000' : '#ffffff',
                fontFamily: 'Arial, sans-serif'
            }
        },
        series: [
            {
                type: 'pie',
                radius: ['40%', '70%'],
                avoidLabelOverlap: false,
                padAngle: 5,
                itemStyle: {
                    borderRadius: 10
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
                    show: false
                },
                data: [
                    { value: gender?.Male, name: t('COMMON.EMPLOYEE-CONTRACT.GENDER_STATISTICS_MALE') },
                    { value: gender?.Female, name: t('COMMON.EMPLOYEE-CONTRACT.GENDER_STATISTICS_FEMALE') },
                    { value: gender?.Other, name: t('COMMON.EMPLOYEE-CONTRACT.GENDER_STATISTICS_OTHER') }
                ]
            }
        ]
    }
    return (
        <Paper
            elevation={0}
            sx={{
                width: '100%',
                padding: '24px',
                boxShadow: 'var(--box-shadow-paper)',
                backgroundColor: 'var(--background-item)',
                borderRadius: '15px',
                height: '100%'
            }}
        >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'top' }}>
                <Typography
                    sx={{
                        fontSize: '18px',
                        fontWeight: 'bold',
                        color: 'var(--text-color)'
                    }}
                >
                    {t('COMMON.EMPLOYEE-CONTRACT.GENDER_STATISTICS')}
                </Typography>
            </Box>
            <ReactECharts option={option} style={{ height: '450px', width: '100%', marginTop: '-50px' }} />
        </Paper>
    )
}

export default GenderPieChart
