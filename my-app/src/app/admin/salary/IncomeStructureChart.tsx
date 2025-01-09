import React from 'react'
import ReactECharts from 'echarts-for-react'
import { Paper, Typography } from '@mui/material'
import { useTheme } from 'next-themes'
import { useGetIncomeStructureQuery } from '@/services/SalaryService'
import { useTranslation } from 'react-i18next'
import Loading from '@/components/Loading'

interface IncomeStructure {
    baseSalary: number
    reward: number
    PITax: number
    birthday: number
}

const IncomeStructureChart = () => {
    const { t } = useTranslation()
    const { theme } = useTheme()
    const { data, isLoading, isError } = useGetIncomeStructureQuery()

    const totalData = data?.Data as IncomeStructure

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
    const option = {
        tooltip: {
            trigger: 'item'
        },
        legend: {
            top: '5%',
            left: 'center',
            textStyle: {
                color: theme === 'light' ? '#000000' : '#ffffff'
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
                    borderRadius: 10
                    // borderColor: '#fff',
                    // borderWidth: 2
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
                    { value: totalData?.baseSalary, name: t('COMMON.SALARY.BASIC_SALARY') },
                    { value: totalData?.PITax, name: t('COMMON.SALARY.PI_TAX') },
                    { value: totalData?.reward, name: t('COMMON.SALARY.REWARD') },
                    { value: totalData?.birthday, name: t('COMMON.SALARY.BIRTHDAY') }
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
                backgroundColor: 'var(--background-item)',
                borderRadius: '15px',
                height: '100%'
            }}
        >
            <Typography fontSize={'24px'} fontWeight={'bold'} color='var(--text-color)'>
                {t('COMMON.SALARY.INCOME_STRUCTURE')}
            </Typography>
            <ReactECharts option={option} style={{ width: '100%', height: '320px', marginTop: '10px' }}></ReactECharts>
        </Paper>
    )
}
export default IncomeStructureChart
