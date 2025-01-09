'use client'
import { Box, CircularProgress, Paper, Typography } from '@mui/material'
import { BadgeDollarSign } from 'lucide-react'
import React from 'react'
import TotalBySex from './TotalBySex'
import TotalByLevel from './TotalByLevel'
import { useGetTotalMaxMinQuery } from '@/services/SalaryService'
import { useTranslation } from 'react-i18next'

interface TotalMaxMin {
    maxUser: string
    max: number
    minUser: string
    min: number
}

export default function SpecialInfo() {
    const { t } = useTranslation()
    const { data, isLoading, isError } = useGetTotalMaxMinQuery()

    const totalData = data?.Data as TotalMaxMin

    let unit = ''

    const formatValue = value => {
        if (value >= 1e9) {
            unit = t('COMMON.SALARY.BILLION')
            return (value / 1e9).toFixed(2)
        } else if (value >= 1e6) {
            unit = t('COMMON.SALARY.MILLION')
            return (value / 1e6).toFixed(2)
        } else if (value >= 1e3) {
            unit = t('COMMON.SALARY.THOUSAND')
            return (value / 1e3).toFixed(2)
        } else {
            unit = t('COMMON.SALARY.VND')
            return value
        }
    }

    if (isLoading) {
        return (
            <Paper
                elevation={0}
                sx={{
                    width: '100%',
                    padding: '24px',
                    backgroundColor: 'var(--background-item)',
                    borderRadius: '15px',
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}
            >
                <CircularProgress /> {/* Hiển thị spinner khi đang tải */}
            </Paper>
        )
    }
    if (isError) {
        return (
            <Paper
                elevation={0}
                sx={{
                    width: '100%',
                    padding: '24px',
                    backgroundColor: 'var(--background-item)',
                    borderRadius: '15px',
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}
            >
                <Typography color='red'>Có lỗi xảy ra khi tải dữ liệu.</Typography> {/* Thông báo lỗi */}
            </Paper>
        )
    }
    return (
        <Box sx={{ width: '100%', justifyContent: 'center', alignItems: 'center', gap: '24px', display: 'flex' }}>
            <Box sx={{ flex: 1 }}>
                <Paper
                    elevation={0}
                    sx={{
                        backgroundImage: 'url(/images/Subtract_red.svg)',
                        backgroundColor: 'var(--background-color-after)',
                        backgroundSize: 'cover',
                        borderRadius: '38px',
                        width: '100%',
                        height: '100%',
                        padding: '24px',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        position: 'relative',
                        boxShadow: 'var(--box-shadow-paper)'
                    }}
                >
                    <Box width={'100%'}>
                        <Typography
                            sx={{
                                fontSize: '16px',
                                fontWeight: 'bold',
                                color: 'var(--reward-title-color)'
                            }}
                        >
                            {t('COMMON.SALARY.HIGHEST')}
                        </Typography>
                        <Box
                            sx={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center'
                            }}
                        >
                            <Typography
                                sx={{
                                    color: '#09090b',
                                    fontSize: '30px',
                                    margin: '10px 5px',
                                    fontWeight: 'bold'
                                }}
                            >
                                {totalData?.maxUser}
                            </Typography>
                        </Box>

                        <Box
                            sx={{
                                mt: '5px',
                                color: '#09090b', //!(!rewardPercent || rewardPercent >= 0) ? '#F93C65' : '#00B69B',
                                fontSize: '15px',
                                fontWeight: 'bold',
                                display: 'flex',
                                alignItems: 'center'
                            }}
                        >
                            <BadgeDollarSign color='green'></BadgeDollarSign>
                            <Typography
                                sx={{
                                    ml: '6px',
                                    color: '#09090b',
                                    fontSize: '16px'
                                }}
                            >
                                {formatValue(totalData?.max)}
                            </Typography>
                            <Typography
                                sx={{
                                    ml: '6px',
                                    color: '#09090b',
                                    fontSize: '16px'
                                }}
                            >
                                {unit}
                            </Typography>
                        </Box>
                    </Box>
                </Paper>
                <Paper
                    elevation={0}
                    sx={{
                        backgroundImage: 'url(/images/Subtract_blue.svg)',
                        backgroundColor: 'var(--background-color-after)',
                        backgroundSize: 'cover',
                        borderRadius: '38px',
                        backgroundPosition: 'left center',
                        height: '100%',
                        padding: '24px',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        position: 'relative',
                        marginTop: '24px'
                    }}
                >
                    <Box width={'100%'}>
                        <Typography
                            sx={{
                                fontSize: '16px',
                                fontWeight: 'bold',
                                color: 'var(--reward-title-color)'
                            }}
                        >
                            {t('COMMON.SALARY.LOWEST')}
                        </Typography>
                        <Box
                            sx={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center'
                            }}
                        >
                            <Typography
                                sx={{
                                    color: '#09090b',
                                    fontSize: '30px',
                                    margin: '10px 5px',
                                    fontWeight: 'bold'
                                }}
                            >
                                {totalData?.minUser}
                            </Typography>
                        </Box>

                        <Box
                            sx={{
                                mt: '5px',
                                color: '#09090b', //!(!rewardPercent || rewardPercent >= 0) ? '#F93C65' : '#00B69B',
                                fontSize: '15px',
                                fontWeight: 'bold',
                                display: 'flex',
                                alignItems: 'center'
                            }}
                        >
                            <BadgeDollarSign color='green'></BadgeDollarSign>
                            <Typography
                                sx={{
                                    ml: '6px',
                                    color: '#09090b',
                                    fontSize: '16px'
                                }}
                            >
                                {formatValue(totalData?.min)}
                            </Typography>
                            <Typography
                                sx={{
                                    ml: '6px',
                                    color: '#09090b',
                                    fontSize: '16px'
                                }}
                            >
                                {unit}
                            </Typography>
                        </Box>
                    </Box>
                </Paper>
            </Box>
            <Box sx={{ flex: 1 }}>
                <TotalBySex />
            </Box>
            <Box sx={{ flex: 1 }}>
                <TotalByLevel />
            </Box>
        </Box>
    )
}
