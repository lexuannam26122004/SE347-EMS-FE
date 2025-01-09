'use client'

import { Box } from '@mui/material'
import DisplayInfo from './DisplayInfo'
import ChartBenefit from './ChartBenefit'
import ChartInsurance from './ChartInsurance'
import WelfareApplication from './welfareapplication'

function Page() {
    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: '24px'
            }}
        >
            <Box
                sx={{
                    display: 'grid',
                    gridTemplateColumns: 'calc(100% / 3 - 8px) calc(100% / 3 * 2 - 16px)', // 2 phần và 1 phần tương ứng
                    gap: '24px' // Khoảng cách giữa các phần
                }}
            >
                <DisplayInfo />
                <ChartBenefit />
            </Box>
            <Box
                sx={{
                    display: 'grid',
                    gridTemplateColumns: 'calc(100% / 3 * 2 - 8px) calc(100% / 3  - 16px)', // 2 phần và 1 phần tương ứng
                    gap: '24px' // Khoảng cách giữa các phần
                }}
            >
                <Box sx={{ boxShadow: 'var(--box-shadow-paper)', borderRadius: '15px', overflow: 'hidden' }}>
                    <ChartInsurance />
                </Box>

                <Box
                    sx={{
                        boxShadow: 'var(--box-shadow-paper)',
                        borderRadius: '15px',
                        overflow: 'hidden'
                    }}
                >
                    <WelfareApplication />
                </Box>
            </Box>
        </Box>
    )
}

export default Page
