'use client'
import React from 'react'
import AgePieChart from './AgePieChart'
import GenderPieChart from './GenderPieChart'
import ChartEmployee from './ChartEmployee'
import { Box } from '@mui/material'
import DisplayInfo from './DisplayInfo'
import ContractExp from './ContractExp'
const App: React.FC = () => {
    return (
        <Box>
            <Box
                sx={{
                    display: 'grid',
                    gridTemplateColumns: 'calc(100% / 3 * 2 - 8px) calc(100% / 3 - 16px)',
                    gap: '24px',
                    marginBottom: '24px'
                }}
            >
                {/* Cột bên trái */}
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        height: '100%', // Đảm bảo chiều cao của cột được chia đều
                        gap: '24px'
                    }}
                >
                    <DisplayInfo />
                    <Box
                        sx={{
                            marginTop: '-24px'
                        }}
                    >
                        <ChartEmployee />
                    </Box>
                </Box>

                {/* Cột bên phải */}
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        height: '100%', // Đảm bảo chiều cao của cột được chia đều
                        gap: '24px'
                    }}
                >
                    <AgePieChart />
                    <GenderPieChart />
                </Box>
            </Box>
            <ContractExp />
        </Box>
    )
}

export default App
