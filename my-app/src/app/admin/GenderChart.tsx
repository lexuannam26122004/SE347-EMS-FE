import React from 'react'
import ReactECharts from 'echarts-for-react'
import { Box, Paper } from '@mui/material'

const EmployeeGenderChart = () => {
    const option = {
        title: {
            text: 'Sale by category',
            left: 'center',
            top: '5%',
            textStyle: {
                fontSize: 16,
                fontWeight: 'bold',
                fontFamily: 'Arial, sans-serif'
            }
        },
        radar: {
            indicator: [
                { name: 'Mens', max: 25 },
                { name: 'Womens', max: 25 },
                { name: 'Kids', max: 25 }
            ],
            splitNumber: 5,
            shape: 'circle',
            axisLine: {
                lineStyle: {
                    color: '#999'
                }
            },
            splitLine: {
                lineStyle: {
                    color: ['#999']
                }
            },
            splitArea: {
                areaStyle: {
                    color: ['#222', '#333']
                }
            }
        },
        series: [
            {
                type: 'radar',
                data: [
                    {
                        value: [20, 15, 10],
                        name: 'Sales',
                        itemStyle: {
                            color: '#0078D7' // Màu xanh dương cho vùng
                        },
                        areaStyle: {
                            opacity: 0.6
                        }
                    }
                ]
            }
        ]
    }

    return (
        <Box sx={{ mt: '17px' }}>
            <Paper
                sx={{
                    width: '100%',
                    overflow: 'hidden',
                    borderRadius: '10px',
                    backgroundColor: '#0d1117' // Màu nền tối
                }}
            >
                <ReactECharts option={option} style={{ height: 400 }} />
            </Paper>
        </Box>
    )
}

export default EmployeeGenderChart
