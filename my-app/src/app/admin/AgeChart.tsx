import React from 'react'
import ReactECharts from 'echarts-for-react'
import { Box, Paper } from '@mui/material'
import { Typography } from '@mui/material'
import { useTheme } from 'next-themes'
import { useTranslation } from 'react-i18next'
import { useGetEmployeeCountByAgeQuery } from '@/services/AspNetUserService'
import { IUserByAgeGetAllDashboard } from '@/models/AspNetUser'
import Loading from '@/components/Loading'

const SaleByGenderChart = () => {
    const { t } = useTranslation('common')
    const { theme } = useTheme()
    const { data, isFetching } = useGetEmployeeCountByAgeQuery()
    const ages = data?.Data as IUserByAgeGetAllDashboard

    if (isFetching) {
        return <Loading />
    }

    const option = {
        title: {
            text: `${t('COMMON.DASHBOARD.SUM_EMPLOYEE')} ${ages?.LessThan32 + ages?.Between32And45 + ages?.GreaterThan45}`, // Hiển thị tổng số nhân viên
            left: 'center', // Căn giữa tiêu đề
            top: '42px',
            textStyle: {
                fontFamily: 'Arial',
                color: theme === 'light' ? '#000' : '#fff', // Màu chữ tùy theo chủ đề
                fontSize: 16, // Kích thước chữ
                fontWeight: 'bold' // Đậm
            }
        },
        tooltip: {
            trigger: 'item',
            backgroundColor: theme === 'light' ? 'rgba(250, 250, 250, 0.98)' : 'rgba(20, 26, 25, 0.98)',
            textStyle: {
                color: theme === 'light' ? '#000000' : '#ffffff'
            }
        },
        legend: {
            orient: 'vertical',
            left: 'center',
            top: 'bottom',
            itemGap: 10,
            textStyle: {
                color: theme === 'light' ? 'black' : '#fff',
                fontFamily: 'Arial, sans-serif'
            },
            formatter: (name: string) => {
                const percent =
                    '> 45' === name
                        ? ages?.GreaterThan45Percentage?.toFixed(2)
                        : name === '< 32'
                          ? ages?.LessThan32Percentage?.toFixed(2)
                          : ages?.Between32And45Percentage?.toFixed(2)
                const newName =
                    '> 45' === name
                        ? t('COMMON.DASHBOARD.SUM_EMPLOYEE_OVER_45')
                        : name === '< 32'
                          ? t('COMMON.DASHBOARD.SUM_EMPLOYEE_UNDER_32')
                          : t('COMMON.DASHBOARD.SUM_EMPLOYEE_32_TO_45')
                return `${newName}  (${percent}%)`
            },
            selectedMode: false
        },
        series: [
            {
                name: t('COMMON.DASHBOARD.AGE'),
                type: 'pie',
                radius: [30, '65%'],
                center: ['50%', '50%'],
                data: [
                    {
                        value: ages?.LessThan32,
                        name: '< 32',
                        itemStyle: {
                            color: '#00a76f'
                        }
                    },
                    {
                        value: ages?.Between32And45,
                        name: '32 - 45',
                        itemStyle: {
                            color: '#ffab00'
                        }
                    },
                    {
                        value: ages?.GreaterThan45,
                        name: '> 45',
                        itemStyle: {
                            color: '#c23531'
                        }
                    }
                ].sort(function (a, b) {
                    return a.value - b.value
                }),
                roseType: 'area',
                itemStyle: {
                    borderRadius: 8
                },
                label: {
                    show: false,
                    formatter: '{d}%',
                    position: 'inside',
                    color: '#dccfcf',
                    fontSize: 11
                },
                animationType: 'scale',
                animationEasing: 'elasticOut',
                animationDelay: function () {
                    return Math.random() * 200
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
                <img
                    src='/images/age-group.png'
                    style={{
                        height: '55px'
                    }}
                />
            </Box>
            <ReactECharts option={option} style={{ height: '422px', width: '100%', marginTop: '-50px' }} />
        </Paper>
    )
}

export default SaleByGenderChart
