'use client'
import { Box } from '@mui/material'
import React from 'react'
import DisplayInfo from './DisplayInfo'
import PayrollReport from './PayrollReport'
import GrossTotal from './GrossTotal'
import GrossTotalByAreas from './departments/GrossTotal'
import SpecialInfo from './SpecialInfo'
import PayrollShares from './departments/PayrollShares'
import PayrollOvertime from './departments/PayrollOvertime'
import SalaryTablePage from './SalaryTable'
//import SalaryTablePage from './SalaryTable'

export default function SalaryStatistic() {
    return (
        <Box>
            <Box width='100%'>
                <DisplayInfo />
            </Box>
            <Box sx={{ width: '100%', marginTop: '24px' }}>
                <SpecialInfo />
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'stretch', marginTop: '24px', gap: '24px' }}>
                <Box sx={{ width: 'calc(100% / 4 * 3 - 30px)' }}>
                    <PayrollReport />
                </Box>
                <Box sx={{ width: 'calc(100% / 4 + 30px)' }}>
                    <GrossTotal />
                </Box>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'stretch', marginTop: '24px', gap: '24px' }}>
                <Box sx={{ width: 'calc(100% / 3)' }}>
                    <GrossTotalByAreas />
                </Box>
                <Box sx={{ width: 'calc(100% / 3)' }}>
                    <PayrollShares />
                </Box>
                <Box sx={{ width: 'calc(100% / 3)' }}>
                    <PayrollOvertime />
                </Box>
            </Box>
            <Box sx={{ width: '100%', marginTop: '24px' }}>
                <SalaryTablePage />
            </Box>
        </Box>
    )
}
