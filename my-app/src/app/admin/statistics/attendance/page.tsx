'use client'

import React from 'react'
import { Box } from '@mui/material'
import DisplayInfo from './DisplayInfo'
import TableAttendance from './TableAttendance'
import AttendanceHeatmap from './AttendanceHeatmap'
import ChartCount from './ChartCount'
import ChartJoin from './ChartJoin'

const Page = () => {
    return (
        <Box>
            <Box width='100%'>
                <DisplayInfo />
            </Box>

            <Box
                sx={{
                    mt: '24px',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'stretch',
                    gap: '24px'
                }}
            >
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        width: 'calc(100% / 3 * 2 - 8px)'
                    }}
                >
                    <ChartCount />
                </Box>
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        boxShadow: 'var(--box-shadow-paper)',
                        borderRadius: '15px',
                        width: 'calc(100% / 3 - 16px)'
                    }}
                >
                    <ChartJoin />
                </Box>
            </Box>

            <AttendanceHeatmap />

            <TableAttendance />
        </Box>
    )
}

export default Page
