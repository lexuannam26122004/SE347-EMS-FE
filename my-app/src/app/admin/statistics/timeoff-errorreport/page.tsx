'use client'
import React from 'react'
import Chart from './Chart'
import { Box } from '@mui/material'
import DisplayInfo from './DisplayInfo'
import MyPieChart from './MyPieChart'
import ErrorReport from './ErrorReport'
import LeaveApplication from './LeaveApplication'

const App: React.FC = () => {
    return (
        <Box sx={{ height: '100%' }}>
            <Box
                sx={{
                    display: 'grid',
                    gridTemplateColumns: 'calc(100% / 3 - 16px) calc(100% / 3 * 2 - 8px)',
                    gap: '24px',
                    height: '40%',
                    marginTop: '-24px'
                }}
            >
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        height: '100%',
                        gap: '24px'
                    }}
                >
                    <DisplayInfo />
                </Box>

                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        height: '100%',
                        gap: '24px'
                    }}
                >
                    <Chart />
                </Box>
            </Box>

            <Box
                sx={{
                    display: 'grid',
                    gridTemplateColumns: 'calc(100% / 3 * 2 - 8px) calc(100% / 3 - 16px)',
                    gap: '24px',
                    height: '100%',
                    marginBottom: '24px'
                }}
            >
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        height: '100%'
                    }}
                >
                    <MyPieChart />
                </Box>

                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        height: '100%', // Ensure the second column takes full height
                        gap: '24px', // Ensure the components inside the column have 24px gap
                        marginTop: '24px'
                    }}
                >
                    <LeaveApplication />
                </Box>
            </Box>
            <ErrorReport />
        </Box>
    )
}

export default App
