'use client'
import Loading from '@/components/Loading'
import { useGetDisplayInfoQuery } from '@/services/SalaryService'
import {
    Paper,
    Typography,
    Box,
    LinearProgress,
    LinearProgressProps,
    styled,
    linearProgressClasses,
    Tooltip
} from '@mui/material'
import { BadgeHelp } from 'lucide-react'
import React from 'react'
import { useTranslation } from 'react-i18next'

function LinearProgressWithLabel(props: LinearProgressProps & { value: number }) {
    return (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Box sx={{ width: '100%', mr: 1 }}>
                <BorderLinearProgress variant='determinate' {...props} />
            </Box>
            <Box sx={{ minWidth: 35 }}>
                <Typography variant='body2' sx={{ color: 'black' }}>{`${props.value}%`}</Typography>
            </Box>
        </Box>
    )
}

const BorderLinearProgress = styled(LinearProgress)(({ theme }) => ({
    height: 10,
    borderRadius: 5,
    [`&.${linearProgressClasses.colorPrimary}`]: {
        backgroundColor: theme.palette.grey[200],
        ...theme.applyStyles('dark', {
            backgroundColor: theme.palette.grey[800]
        })
    },
    [`& .${linearProgressClasses.bar}`]: {
        borderRadius: 5,
        backgroundColor: '#1a90ff',
        ...theme.applyStyles('dark', {
            backgroundColor: '#308fe8'
        })
    }
}))

interface DisplayInfo {
    grossTotal: number
    bGross: number
    grossPercent: number
    grossProgress: number
    netTotal: number
    bTotal: number
    netPercent: number
    netProgress: number
    netPerPerson: number
    basicTotal: number
    bBasic: number
    basicPercent: number
    basicProgress: number
    basicPerPerson: number
}
export default function DisplayInfo() {
    const { t } = useTranslation()
    const { data: responseData, isLoading, isError } = useGetDisplayInfoQuery()
    const data = responseData?.Data as DisplayInfo
    const isBGrossNegative = data?.bGross < 0
    const isNet = data?.bTotal < 0
    const isBasic = data?.bBasic < 0
    if (isLoading) {
        return <Loading />
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
    const formatValue = value => {
        if (value >= 1e9) {
            return (value / 1e9).toFixed(1) + ' ' + t('COMMON.SALARY.BILLION')
        } else if (value >= 1e6) {
            return (value / 1e6).toFixed(1) + ' ' + t('COMMON.SALARY.MILLION')
        } else if (value >= 1e3) {
            return (value / 1e3).toFixed(1) + ' ' + t('COMMON.SALARY.THOUSAND')
        } else {
            return value + ' ' + t('COMMON.SALARY.VND')
        }
    }
    return (
        <Box
            sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                gap: '24px',
                flexDirection: 'column'
            }}
        >
            <Box
                sx={{
                    width: '100%',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    gap: '24px'
                }}
            >
                <Paper
                    elevation={0}
                    sx={{
                        border: '1px solid #00a76f',
                        width: 'calc(100% / 3)',
                        height: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        backgroundColor: '#eefff9',
                        justifyContent: 'space-between',
                        borderRadius: '15px',
                        padding: '24px',
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
                            {t('COMMON.SALARY.GROSS_PAYROLL_TOTAL')}
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
                                    fontSize: '34px',
                                    margin: '10px 5px',
                                    fontWeight: 'bold'
                                }}
                            >
                                {formatValue(data?.grossTotal)}
                            </Typography>
                            <Box
                                sx={{
                                    position: 'absolute',
                                    right: '30px',
                                    display: 'flex',
                                    alignItems: 'center'
                                }}
                            >
                                {isBGrossNegative ? (
                                    <>
                                        <Tooltip
                                            title={
                                                t('COMMON.SALARY.DECREASE') +
                                                Math.abs(data?.grossPercent).toFixed(2) +
                                                '%' +
                                                t('COMMON.SALARY.COMPARE')
                                            }
                                        >
                                            <BadgeHelp color='#33FF33' style={{ marginLeft: '10px' }}></BadgeHelp>
                                        </Tooltip>
                                    </>
                                ) : (
                                    <>
                                        <Tooltip
                                            title={
                                                t('COMMON.SALARY.INCREASE') +
                                                Math.abs(data?.grossPercent).toFixed(2) +
                                                '%' +
                                                t('COMMON.SALARY.COMPARE')
                                            }
                                        >
                                            <BadgeHelp color='#33FF33' style={{ marginLeft: '10px' }}></BadgeHelp>
                                        </Tooltip>
                                    </>
                                )}
                            </Box>
                        </Box>
                        <Box sx={{ width: '100%' }}>
                            <LinearProgressWithLabel value={data?.grossProgress} />
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
                            <Box sx={{ backgroundColor: '#1a90ff', width: 15, height: 15, borderRadius: '5px' }}></Box>
                            <Typography
                                sx={{
                                    ml: '6px',
                                    color: '#09090b',
                                    fontSize: '16px',
                                    mt: '5px'
                                }}
                            >
                                {formatValue(data?.netTotal) + t('COMMON.SALARY.TAKE_HOME')}
                            </Typography>
                        </Box>
                    </Box>

                    {/* <Box sx={{ width: '60px', height: '40px', position: 'absolute', right: '24px' }}>
                    <ReactECharts
                        option={getOption(dataSet.OnTime, colors[0])}
                        style={{ width: '100%', height: '100%' }}
                    />
                </Box> */}
                </Paper>
                <Paper
                    elevation={0}
                    sx={{
                        border: '1px solid #FF6699',
                        width: 'calc(100% / 3)',
                        height: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        backgroundColor: '#FFCCCC',
                        justifyContent: 'space-between',
                        borderRadius: '15px',
                        padding: '24px',
                        position: 'relative'
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
                            {t('COMMON.SALARY.NET_PAYROLL_TOTAL')}
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
                                    fontSize: '34px',
                                    margin: '10px 5px',
                                    fontWeight: 'bold'
                                }}
                            >
                                {formatValue(data?.netTotal)}
                            </Typography>
                            <Box
                                sx={{
                                    position: 'absolute',
                                    right: '30px',
                                    display: 'flex',
                                    alignItems: 'center'
                                }}
                            >
                                {isNet ? (
                                    <>
                                        <Tooltip
                                            title={
                                                t('COMMON.SALARY.DECREASE') +
                                                Math.abs(data?.netPercent).toFixed(2) +
                                                '%' +
                                                t('COMMON.SALARY.COMPARE')
                                            }
                                        >
                                            <BadgeHelp color='#33FF33' style={{ marginLeft: '10px' }}></BadgeHelp>
                                        </Tooltip>
                                    </>
                                ) : (
                                    <>
                                        <Tooltip
                                            title={
                                                t('COMMON.SALARY.INCREASE') +
                                                Math.abs(data?.netPercent).toFixed(2) +
                                                '%' +
                                                t('COMMON.SALARY.COMPARE')
                                            }
                                        >
                                            <BadgeHelp color='#33FF33' style={{ marginLeft: '10px' }}></BadgeHelp>
                                        </Tooltip>
                                    </>
                                )}
                            </Box>
                        </Box>
                        <Box sx={{ width: '100%' }}>
                            <LinearProgressWithLabel value={data?.netProgress} />
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
                            <Box sx={{ backgroundColor: '#1a90ff', width: 15, height: 15, borderRadius: '5px' }}></Box>
                            <Typography
                                sx={{
                                    ml: '6px',
                                    color: '#09090b',
                                    fontSize: '16px',
                                    mt: '5px'
                                }}
                            >
                                Net RPE {formatValue(data?.netPerPerson)}
                            </Typography>
                        </Box>
                    </Box>

                    {/* <Box sx={{ width: '60px', height: '40px', position: 'absolute', right: '24px' }}>
                    <ReactECharts
                        option={getOption(dataSet.OnTime, colors[0])}
                        style={{ width: '100%', height: '100%' }}
                    />
                </Box> */}
                </Paper>
                <Paper
                    elevation={0}
                    sx={{
                        border: '1px solid #FFCC33',
                        width: 'calc(100% / 3)',
                        height: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        backgroundColor: '#FFFFCC',
                        justifyContent: 'space-between',
                        borderRadius: '15px',
                        padding: '24px',
                        position: 'relative'
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
                            {t('COMMON.SALARY.TOTAL_BASIC')}
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
                                    fontSize: '34px',
                                    margin: '10px 5px',
                                    fontWeight: 'bold'
                                }}
                            >
                                {formatValue(data?.basicTotal)}
                            </Typography>
                            <Box
                                sx={{
                                    position: 'absolute',
                                    right: '30px',
                                    display: 'flex',
                                    alignItems: 'center'
                                }}
                            >
                                {isBasic ? (
                                    <>
                                        <Tooltip
                                            title={
                                                t('COMMON.SALARY.DECREASE') +
                                                Math.abs(data?.basicPercent).toFixed(2) +
                                                '%' +
                                                t('COMMON.SALARY.COMPARE')
                                            }
                                        >
                                            <BadgeHelp color='#33FF33' style={{ marginLeft: '10px' }}></BadgeHelp>
                                        </Tooltip>
                                    </>
                                ) : (
                                    <>
                                        <Tooltip
                                            title={
                                                t('COMMON.SALARY.INCREASE') +
                                                Math.abs(data?.basicPercent).toFixed(2) +
                                                '%' +
                                                t('COMMON.SALARY.COMPARE')
                                            }
                                        >
                                            <BadgeHelp color='#33FF33' style={{ marginLeft: '10px' }}></BadgeHelp>
                                        </Tooltip>
                                    </>
                                )}
                            </Box>
                        </Box>
                        <Box sx={{ width: '100%' }}>
                            <LinearProgressWithLabel value={data?.basicProgress} />
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
                            <Box sx={{ backgroundColor: '#1a90ff', width: 15, height: 15, borderRadius: '5px' }}></Box>
                            <Typography
                                sx={{
                                    ml: '6px',
                                    color: '#09090b',
                                    fontSize: '16px',
                                    mt: '5px'
                                }}
                            >
                                Basic Salary RPE {formatValue(data?.basicPerPerson)}
                            </Typography>
                        </Box>
                    </Box>

                    {/* <Box sx={{ width: '60px', height: '40px', position: 'absolute', right: '24px' }}>
                    <ReactECharts
                        option={getOption(dataSet.OnTime, colors[0])}
                        style={{ width: '100%', height: '100%' }}
                    />
                </Box> */}
                </Paper>
            </Box>
        </Box>
    )
}
