import React from 'react'
import ReactECharts from 'echarts-for-react'
import { Paper, Typography } from '@mui/material'
import { useTheme } from 'next-themes'
import { useGetSalaryByLevelQuery } from '@/services/SalaryService'
import { ISalaryByLevel } from '@/models/salary'
import { useTranslation } from 'react-i18next'
import Loading from '@/components/Loading'

const EmployeeSalaryChart = () => {
    const { t } = useTranslation('common')
    const { data, isLoading, isError } = useGetSalaryByLevelQuery()
    const { theme } = useTheme()
    const levels = data?.Data as ISalaryByLevel

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
            trigger: 'axis',
            axisPointer: {
                type: 'shadow'
            }
        },
        legend: {
            textStyle: {
                color: theme === 'light' ? 'black' : '#fff',
                fontFamily: 'Arial, sans-serif'
            },
            itemStyle: { color: 'green' }
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '10%',
            containLabel: true
        },
        xAxis: {
            type: 'value',
            boundaryGap: [0, 0.01],
            name: t('COMMON.SALARY.NUMBER_OF_EMPLOYEES'), // Tên cho trục x
            nameLocation: 'middle', // Vị trí tên
            nameGap: 30,
            position: 'bottom'
        },
        yAxis: {
            type: 'category',
            data: [
                t('COMMON.SALARY.UNDER10'),
                t('COMMON.SALARY.BETWEEN10AND20'),
                t('COMMON.SALARY.BETWEEN20AND30'),
                t('COMMON.SALARY.BETWEEN30AND40'),
                t('COMMON.SALARY.GREATER40')
            ], // Cập nhật dữ liệu cho yAxis
            name: t('COMMON.SALARY.SALARY_LEVEL'), // Tên cho trục y
            nameLocation: 'end', // Vị trí tên
            nameGap: 20,
            position: 'left'
        },
        series: [
            {
                name: `${levels?.period}`,
                type: 'bar',
                data: [
                    levels?.under10,
                    levels?.between10and20,
                    levels?.between20and30,
                    levels?.between30and40,
                    levels?.greaterThan40
                ],
                itemStyle: {
                    color: function (params: { dataIndex: number; value: number; seriesIndex: number; name: string }) {
                        const colors = ['#4caf50', '#66bb6a', '#81c784', '#a5d6a7', '#c8e6c9'] // Mảng màu xanh lá cây
                        return colors[params.dataIndex % colors.length] // Lấy màu theo chỉ số dữ liệu
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
                padding: '24px',
                backgroundColor: 'var(--background-item)',
                borderRadius: '15px',
                height: '100%'
            }}
        >
            <Typography fontSize={'24px'} fontWeight={'bold'} color='var(--text-color)'>
                {t('COMMON.SALARY.EMPLOYEE_SALARY_ANALYSIS')}
            </Typography>
            <ReactECharts option={option} style={{ width: '100%', height: '320px', marginTop: '10px' }}></ReactECharts>
        </Paper>
    )
}

export default EmployeeSalaryChart
