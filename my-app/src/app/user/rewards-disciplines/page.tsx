'use client'
import { Avatar, Box, Paper, Typography } from '@mui/material'
import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import Detail from './reward'
import Discipline from './disciplines'
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
export default function Page() {
    const { t } = useTranslation()
    const { data: infoData, refetch } = useGetMeInfoQuery()
    const myData = infoData?.Data as info

    useEffect(() => {
        refetch()
    }, [infoData])
    return (
        <Box>
            <Paper
                elevation={1}
                sx={{
                    width: '100%',
                    borderRadius: '30px',
                    padding: '35px',
                    backgroundColor: 'var(--attendance-bg1)'
                }}
            >
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'space-between'
                    }}
                >
                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            mb: '35px'
                        }}
                    >
                        <Box
                            sx={{
                                width: '5px',
                                height: '42px',
                                backgroundColor: '#4effca',
                                borderRadius: '4px',
                                mr: '14px'
                            }}
                        />
                        <Typography
                            sx={{
                                color: 'var(--text-color)',
                                fontSize: '21px',
                                fontWeight: 'bold'
                            }}
                        >
                            {t('COMMON.ATTENDANCE.DETAIL_EMPLOYEE')}
                        </Typography>
                    </Box>
                </Box>

                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '40px'
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

                    <Box>
                        <Typography
                            sx={{
                                fontSize: '20px',
                                fontWeight: 'bold',
                                color: 'var(--text-color)'
                            }}
                        >
                            {myData?.FullName}
                        </Typography>

                        <Box
                            sx={{
                                mt: '20px',
                                display: 'flex',
                                gap: '45px',
                                alignItems: 'center'
                            }}
                        >
                            <Box>
                                <Typography
                                    sx={{
                                        color: 'var(--sub-title-color)',
                                        fontSize: '15px'
                                    }}
                                >
                                    {t('COMMON.EMPLOYEE.ROLES')}
                                </Typography>
                                <Typography
                                    sx={{
                                        mt: '4px',
                                        color: 'var(--text-color)',
                                        fontSize: '17px'
                                    }}
                                >
                                    {myData?.RoleName.join(', ')}
                                </Typography>
                            </Box>
                            <Box>
                                <Typography
                                    sx={{
                                        color: 'var(--sub-title-color)',
                                        fontSize: '15px'
                                    }}
                                >
                                    {t('COMMON.EMPLOYEE.PHONENUMBER')}
                                </Typography>
                                <Typography
                                    sx={{
                                        mt: '4px',
                                        color: 'var(--text-color)',
                                        fontSize: '17px'
                                    }}
                                >
                                    {myData?.PhoneNumber}
                                </Typography>
                            </Box>
                            <Box>
                                <Typography
                                    sx={{
                                        color: 'var(--sub-title-color)',
                                        fontSize: '15px'
                                    }}
                                >
                                    {t('COMMON.EMPLOYEE.EMAIL')}
                                </Typography>
                                <Typography
                                    sx={{
                                        mt: '4px',
                                        color: 'var(--text-color)',
                                        fontSize: '17px'
                                    }}
                                >
                                    {myData?.Email}
                                </Typography>
                            </Box>
                            <Box>
                                <Typography
                                    sx={{
                                        color: 'var(--sub-title-color)',
                                        fontSize: '15px'
                                    }}
                                >
                                    {t('COMMON.EMPLOYEE.BIRTHDAY')}
                                </Typography>
                                <Typography
                                    sx={{
                                        mt: '4px',
                                        color: 'var(--text-color)',
                                        fontSize: '17px'
                                    }}
                                >
                                    {myData?.Birthday}
                                </Typography>
                            </Box>
                            <Box>
                                <Typography
                                    sx={{
                                        color: 'var(--sub-title-color)',
                                        fontSize: '15px'
                                    }}
                                >
                                    {t('COMMON.EMPLOYEE.DEPARTMENTNAME')}
                                </Typography>
                                <Typography
                                    sx={{
                                        mt: '4px',
                                        color: 'var(--text-color)',
                                        fontSize: '17px'
                                    }}
                                >
                                    {myData?.DepartmentName}
                                </Typography>
                            </Box>
                            <Box>
                                <Typography
                                    sx={{
                                        color: 'var(--sub-title-color)',
                                        fontSize: '15px'
                                    }}
                                >
                                    {t('COMMON.EMPLOYEE.STARTDATEWORK')}
                                </Typography>
                                <Typography
                                    sx={{
                                        mt: '4px',
                                        color: 'var(--text-color)',
                                        fontSize: '17px'
                                    }}
                                >
                                    {myData?.StartDateWork}
                                </Typography>
                            </Box>
                        </Box>
                    </Box>
                </Box>
            </Paper>
            <Box sx={{ marginTop: '30px' }}>
                <Detail />
            </Box>
            <Box sx={{ marginTop: '30px' }}>
                <Discipline />
            </Box>
        </Box>
    )
}
