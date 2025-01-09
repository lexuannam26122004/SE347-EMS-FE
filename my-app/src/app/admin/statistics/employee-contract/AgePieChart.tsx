'use client'
import React from 'react'
import ReactECharts from 'echarts-for-react'
import { Box, Paper, Typography } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { useTheme } from 'next-themes'
import { useGetEmployeeCountByAgeQuery } from '@/services/AspNetUserService'
import { IUserByAgeGetAllDashboard } from '@/models/AspNetUser'
import Loading from '@/components/Loading'

const AgePieChart: React.FC = () => {
    const { t } = useTranslation('common')
    const { theme } = useTheme()

    const { data, isLoading } = useGetEmployeeCountByAgeQuery()
    const ages = data?.Data as IUserByAgeGetAllDashboard

    if (isLoading) {
        return <Loading />
    }

    const option = {
        textStyle: {
            color: theme === 'light' ? '#000000' : '#ffffff',
            fontFamily: 'Arial, sans-serif'
        },
        legend: {
            top: 'bottom',
            textStyle: {
                color: theme === 'light' ? '#000000' : '#ffffff',
                fontFamily: 'Arial, sans-serif'
            }
        },
        tooltip: {
            trigger: 'item',
            formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        toolbox: {
            show: true,
            feature: {
                mark: { show: true },
                dataView: { show: true, readOnly: false },
                restore: { show: true },
                saveAsImage: { show: true }
            }
        },
        series: [
            {
                name: 'Nightingale Chart',
                type: 'pie',
                roseType: 'area',
                itemStyle: {
                    borderRadius: 8
                },
                label: {
                    show: false
                },
                data: [
                    { value: ages?.Between0And18, name: '0-18' },
                    { value: ages?.Between19And35, name: '19-35' },
                    { value: ages?.Between36And50, name: '36-50' },
                    { value: ages?.Between51And65, name: '51-65' },
                    { value: ages?.GreaterThan65, name: '66+' }
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
                    {t('COMMON.DASHBOARD.AGE_OF_EMPLOYEE')}
                </Typography>
            </Box>
            <ReactECharts option={option} style={{ height: '400px', width: '100%' }} />
        </Paper>
    )
}

export default AgePieChart
