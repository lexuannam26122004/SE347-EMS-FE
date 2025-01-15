'use client'
import { Paper, Box, Avatar, Typography } from '@mui/material'
import { Mail, MapPinHouse, NotepadText, RefreshCw, Smartphone } from 'lucide-react'
import React, { useEffect } from 'react'
import SalaryCompare from './SalaryCompare'
import SalaryCycle from './SalaryCycle'
import { useTranslation } from 'react-i18next'
import { useGetMeInfoQuery } from '@/services/UserSalaryService'

interface info {
    AvatarPath: string
    FullName: string
    RoleName: string[]
    DepartmentName: string
    PhoneNumber: string
    Email: string
    Address: string
    StartDateWork: string
    PayrollCycle: number
    Birthday: string
}

export default function EmployeeSalary() {
    const { t } = useTranslation()

    const { data: infoData, refetch } = useGetMeInfoQuery()
    const myData = infoData?.Data as info

    useEffect(() => {
        refetch()
    }, [infoData])

    return (
        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: '30px' }}>
            <Paper
                elevation={1}
                sx={{
                    width: 'calc(100% / 3)',
                    borderRadius: '30px',
                    padding: '35px',
                    backgroundColor: 'var(--attendance-bg1)',
                    position: 'fixed'
                }}
            >
                <Box>
                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'center',
                            flexDirection: 'column',
                            alignItems: 'center'
                        }}
                    >
                        <Avatar
                            src={
                                myData?.AvatarPath ||
                                'https://api-prod-minimal-v620.pages.dev/assets/images/avatar/avatar-3.webp'
                            }
                            sx={{
                                width: '120px',
                                height: '120px'
                            }}
                        />
                        <Typography
                            sx={{
                                fontSize: '20px',
                                fontWeight: 'bold',
                                color: 'var(--text-color)',
                                marginTop: '10px'
                            }}
                        >
                            {myData?.FullName}
                        </Typography>
                        <Typography
                            sx={{
                                fontSize: '14px',

                                color: 'var(--text-color)'
                            }}
                        >
                            {myData?.RoleName.join(', ')}
                        </Typography>
                        <Typography
                            sx={{
                                fontSize: '14px',

                                color: 'var(--text-color)'
                            }}
                        >
                            {myData?.DepartmentName}
                        </Typography>
                    </Box>
                    <Box sx={{ marginRight: '20px', marginTop: '10px', gap: '15px' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Smartphone size={'24px'} color='orange'></Smartphone>
                            <Typography fontSize={'14px'} color='var(--text-color)' style={{ marginLeft: '10px' }}>
                                {myData?.PhoneNumber}
                            </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', marginTop: '10px' }}>
                            <Mail size={'24px'} color='blue'></Mail>
                            <Typography fontSize={'14px'} color='var(--text-color)' style={{ marginLeft: '10px' }}>
                                {myData?.Email}
                            </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', marginTop: '10px' }}>
                            <MapPinHouse size={'24px'} color='green'></MapPinHouse>
                            <Typography fontSize={'14px'} color='var(--text-color)' style={{ marginLeft: '10px' }}>
                                {myData?.Address}
                            </Typography>
                        </Box>
                    </Box>
                    <Box>
                        <Box
                            sx={{
                                display: 'flex',
                                flex: 1,
                                backgroundColor: 'var(--attendance-bg2)',
                                alignItems: 'center',
                                padding: '20px 24px',
                                borderRadius: '20px',
                                mt: '20px'
                            }}
                        >
                            <Box
                                sx={{
                                    mr: '20px',
                                    width: '55px',
                                    height: '55px',
                                    borderRadius: '50%',
                                    display: 'flex',
                                    color: 'var(--text-color)',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    backgroundColor: 'var(--attendance-bg3)'
                                }}
                            >
                                <NotepadText size={28} />
                            </Box>
                            <Box>
                                <Typography sx={{ fontSize: '20px', fontWeight: 'bold', color: 'var(--text-color)' }}>
                                    {myData?.StartDateWork}
                                </Typography>
                                <Typography sx={{ fontSize: '15px', mt: '5px', color: 'var(--text-color)' }}>
                                    {t('COMMON.EMPLOYEE.STARTDATEWORK')}
                                </Typography>
                            </Box>
                        </Box>
                        <Box
                            sx={{
                                display: 'flex',
                                flex: 1,
                                backgroundColor: 'var(--attendance-bg2)',
                                alignItems: 'center',
                                padding: '20px 24px',
                                borderRadius: '20px',
                                mt: '20px'
                            }}
                        >
                            <Box
                                sx={{
                                    mr: '20px',
                                    width: '55px',
                                    height: '55px',
                                    borderRadius: '50%',
                                    display: 'flex',
                                    color: 'var(--text-color)',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    backgroundColor: 'var(--attendance-bg3)'
                                }}
                            >
                                <RefreshCw size={28} />
                            </Box>
                            <Box>
                                <Typography sx={{ fontSize: '20px', fontWeight: 'bold', color: 'var(--text-color)' }}>
                                    {myData?.PayrollCycle}
                                </Typography>
                                <Typography sx={{ fontSize: '15px', mt: '5px', color: 'var(--text-color)' }}>
                                    {t('COMMON.SALARY.CYCLE')}
                                </Typography>
                            </Box>
                        </Box>
                    </Box>
                </Box>
            </Paper>
            <Paper
                elevation={1}
                sx={{
                    width: 'calc(100% / 3 * 2 - 50px)',
                    borderRadius: '30px',
                    marginLeft: 'auto',
                    backgroundColor: 'var(--attendance-bg1)'
                }}
            >
                <Box sx={{ padding: '25px' }}>
                    <SalaryCompare />
                </Box>

                <SalaryCycle />
            </Paper>
        </Box>
    )
}
