'use client'

import { Box } from '@mui/material'
import DisplayInfo from './DisplayInfo'
import NthTopUser from './NthTopUser'
import Chart from './Chart'
import ListDiscipline from './ListDiscipline'
import ListReward from './ListReward'

function Page() {
    return (
        <Box>
            <Box
                sx={{
                    display: 'grid',
                    gridTemplateColumns: 'calc(100% / 3 * 2 - 8px) calc(100% / 3 - 16px)', // 2 phần và 1 phần tương ứng
                    gap: '24px' // Khoảng cách giữa các phần
                }}
            >
                <Box width='100%'>
                    <DisplayInfo />
                    <Chart />
                </Box>
                <NthTopUser />
            </Box>
            <ListReward />
            <ListDiscipline />
        </Box>
    )
}

export default Page
