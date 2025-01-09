'use client'
import { Box } from '@mui/material'
import DepartmentInfo from './DepartmentInfo'
import DepartmentTable from './DepartmentTable'

function DepartmentPage() {
    return (
        <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <DepartmentInfo />
            <DepartmentTable />
        </Box>
    )
}

export default DepartmentPage
