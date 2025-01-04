'use client'

import { Box } from '@mui/material'
import DisplayInfo from './DisplayInfo'
import ContractExpPage from './ContractExp'
import ChartSalary from './ChartSalary'
import DepartmentChart from './DepartmentChart'
import LeaveApplication from './LeaveApplication'
import EmployeeCountChart from './EmployeeCountChart'
import AgeDistributionChart from './AgeChart'
import ErrorReport from './ErrorReport'

const AdminPage = () => {
    return (
        <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <DisplayInfo />

            <Box
                sx={{
                    width: 'calc(100%)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'stretch',
                    gap: '24px'
                }}
            >
                <Box
                    sx={{
                        width: 'calc(100% / 3)',
                        boxShadow: 'var(--box-shadow-paper)',
                        borderRadius: '15px',
                        overflow: 'hidden'
                    }}
                >
                    <DepartmentChart />
                </Box>
                <Box
                    sx={{
                        width: 'calc(100% / 3 * 2 + 24px)',
                        boxShadow: 'var(--box-shadow-paper)',
                        borderRadius: '15px',
                        overflow: 'hidden'
                    }}
                >
                    <ChartSalary />
                </Box>
            </Box>

            <Box
                sx={{
                    width: 'calc(100%)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'stretch',
                    gap: '24px'
                }}
            >
                <Box
                    sx={{
                        width: 'calc(100% / 3 * 2 + 24px)',
                        boxShadow: 'var(--box-shadow-paper)',
                        borderRadius: '15px',
                        overflow: 'hidden'
                    }}
                >
                    <EmployeeCountChart />
                </Box>
                <Box
                    sx={{
                        width: 'calc(100% / 3)',
                        boxShadow: 'var(--box-shadow-paper)',
                        borderRadius: '15px',
                        overflow: 'hidden'
                    }}
                >
                    <AgeDistributionChart />
                </Box>
            </Box>

            <Box
                sx={{
                    width: 'calc(100%)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'stretch',
                    gap: '24px'
                }}
            >
                <Box
                    sx={{
                        width: 'calc(100% / 3 * 2 + 24px)',
                        boxShadow: 'var(--box-shadow-paper)',
                        borderRadius: '15px',
                        overflow: 'hidden'
                    }}
                >
                    <ErrorReport />
                </Box>
                <Box
                    sx={{
                        width: 'calc(100% / 3)',
                        boxShadow: 'var(--box-shadow-paper)',
                        borderRadius: '15px',
                        overflow: 'hidden'
                    }}
                >
                    <LeaveApplication />
                </Box>
            </Box>

            <ContractExpPage />
        </Box>
    )
}

export default AdminPage
