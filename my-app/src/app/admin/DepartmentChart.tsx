// components/DepartmentChart.js
import React from 'react'
import ReactECharts from 'echarts-for-react'
import { IDepartmentGetAllDashboard } from '@/models/Department'
import { Paper, Typography } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { useTheme } from 'next-themes'
import Loading from '@/components/Loading'
import { useGetEmployeeCountByDepartmentQuery } from '@/services/AspNetUserService'

const DepartmentChart = () => {
    const { data, isFetching } = useGetEmployeeCountByDepartmentQuery()
    const { t } = useTranslation('common')
    const { theme } = useTheme()

    const departments = data?.Data as IDepartmentGetAllDashboard[]

    const chartData =
        departments?.map(department => ({
            value: department.Count, // Tạo số ngẫu nhiên từ 0 đến 99
            name: department.Department
        })) || []

    if (isFetching) {
        return <Loading />
    }

    const option = {
        tooltip: {
            trigger: 'item',
            backgroundColor: theme === 'light' ? 'rgba(250, 250, 250, 0.98)' : 'rgba(20, 26, 25, 0.98)',
            textStyle: {
                color: theme === 'light' ? '#000000' : '#ffffff'
            }
        },
        legend: {
            orient: 'horizontal',
            left: 'left', // Đặt chú thích bên trái
            top: 'bottom',
            itemGap: 14, // Thêm khoảng cách giữa các mục chú thích
            textStyle: {
                color: theme === 'light' ? 'black' : '#fff',
                fontFamily: 'Arial, sans-serif'
            },
            selectedMode: false // Tắt tính năng ẩn màu khi nhấn vào chú thích
        },
        series: [
            {
                name: t('COMMON.DASHBOARD.DEPARTMENT'),
                type: 'pie',
                radius: '70%',
                center: ['50%', '40%'], // Điều chỉnh vị trí của biểu đồ tròn
                data: chartData,
                emphasis: {
                    itemStyle: {
                        shadowBlur: 10,
                        shadowOffsetX: 0,
                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                    }
                },
                label: {
                    show: false // Ẩn nhãn tên phòng ban quanh biểu đồ
                },
                labelLine: {
                    show: false // Ẩn đường chỉ ra
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
            <Typography
                sx={{
                    fontSize: '18px',
                    fontWeight: 'bold',
                    color: 'var(--text-color)'
                }}
            >
                {t('COMMON.DASHBOARD.MEMBER_COUNT_OF_DEPT')}
            </Typography>
            <ReactECharts option={option} style={{ height: '400px', width: '100%' }} />
        </Paper>
    )
}

export default DepartmentChart
