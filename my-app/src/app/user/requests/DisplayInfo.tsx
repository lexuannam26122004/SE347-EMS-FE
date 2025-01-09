'use client'

import { Box, Paper, Typography } from '@mui/material'
import { TrendingDown, TrendingUp } from '@mui/icons-material'
import { useTranslation } from 'react-i18next'
import Loading from '@/components/Loading'
import { useCountTimeOffsInMonthUserQuery } from '@/services/UserTimeOffService'
import { useGetCountErrorReportsInMonthUserQuery } from '@/services/UserErrorReportService'

interface ITimeOffStats {
    CurrentMonthCount: number
    PreviousMonthCount: number
    PercentageIncrease: number
}

function Page() {
    const { t } = useTranslation('common')

    const date = new Date()
    const month = date.getMonth() + 1
    const year = date.getFullYear()
    const { data: responseTimeOff, isLoading: isLoadingTimeOff } = useCountTimeOffsInMonthUserQuery({
        Month: month,
        Year: year
    })
    const { data: responseErrorReport, isLoading: isLoadingErrorReport } = useGetCountErrorReportsInMonthUserQuery({
        Month: month,
        Year: year
    })

    const dataTimeOff = responseTimeOff?.Data as ITimeOffStats
    const dataErrorReport = responseErrorReport?.Data as ITimeOffStats

    const newEmployeesCount = dataTimeOff?.CurrentMonthCount
    const newEmployeesPercent = dataTimeOff?.PercentageIncrease

    const currentEmployeesCount = dataErrorReport?.CurrentMonthCount
    const currentEmployeesPercent = dataErrorReport?.PercentageIncrease

    const Count = dataTimeOff?.PreviousMonthCount + dataErrorReport?.PreviousMonthCount
    const resignedEmployeesCount = dataTimeOff?.CurrentMonthCount + dataErrorReport?.CurrentMonthCount
    const resignedEmployeesPercent = Count === 0 ? null : ((resignedEmployeesCount - Count) / Count) * 100

    if (isLoadingTimeOff || isLoadingErrorReport) {
        return <Loading />
    }

    return (
        <Box
            sx={{
                padding: '20px',
                //boxShadow: 'var(--box-shadow-paper)',
                borderRadius: '30px',
                //backgroundColor: 'var(--attendance-bg1)',
                //borderRadius: '12px',
                overflow: 'hidden',
                height: '100%',
                //border: '1px solid #e0e0e0',
                width: '100%'
            }}
        >
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    gap: '24px',
                    height: '190px',
                    marginBottom: '24px'
                }}
            >
                <Paper
                    sx={{
                        width: '100%',
                        backgroundImage: 'url(/images/Subtract_green.svg)',
                        backgroundColor: 'var(--background-color-after)',
                        backgroundSize: 'cover',
                        borderRadius: '38px',
                        backgroundPosition: 'left center',
                        height: '100%',
                        padding: '24px',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        position: 'relative'
                    }}
                >
                    <Box
                        sx={{
                            position: 'absolute',
                            backgroundImage: 'url(/images/group_1.svg)',
                            backgroundSize: 'auto 50%',
                            backgroundRepeat: 'no-repeat',
                            left: '24px',
                            top: '24px',
                            width: 'calc(100% - 50px)',
                            height: '100%'
                        }}
                    ></Box>
                    <Box
                        sx={{
                            position: 'absolute',
                            backgroundImage: 'url(/images/off.png)',
                            backgroundSize: 'contain', // Đảm bảo hình hiển thị đầy đủ và tỷ lệ gốc
                            backgroundRepeat: 'no-repeat',
                            backgroundPosition: 'right 0px bottom 0px',
                            right: '24px',
                            bottom: '24px',
                            width: '36%',
                            height: '60%'
                        }}
                    ></Box>
                    <Typography
                        sx={{
                            fontSize: '20px',
                            fontWeight: 'bold',
                            color: 'var(--reward-title-color)'
                        }}
                    >
                        {t('Tổng số đơn nghỉ phép')}
                    </Typography>
                    <Typography
                        sx={{
                            color: 'var(--reward-title-color)',
                            fontSize: '35px',
                            mt: '10px',
                            fontWeight: 'bold'
                        }}
                    >
                        {newEmployeesCount}
                    </Typography>
                    <Box
                        sx={{
                            mt: '10px',
                            color: '#4f4f4f', //!(!newEmployeesPercent || newEmployeesPercent >= 0) ? '#F93C65' : '#00B69B',
                            fontSize: '15px',
                            fontWeight: 'bold',
                            display: 'flex',
                            alignItems: 'center'
                        }}
                    >
                        {newEmployeesPercent !== null &&
                            (!(!newEmployeesPercent || newEmployeesPercent >= 0) ? (
                                <TrendingDown style={{ marginRight: '6px' }} />
                            ) : (
                                <TrendingUp style={{ marginRight: '6px' }} />
                            ))}
                        {newEmployeesPercent !== null ? newEmployeesPercent + '%' : t('COMMON.DASHBOARD.NO_CHANGE')}
                        <Typography
                            sx={{
                                ml: '6px',
                                color: '#4f4f4f',
                                fontSize: '16px'
                            }}
                        >
                            {t('COMMON.REWARD_DISCIPLINE.LAST_MONTH')}
                        </Typography>
                    </Box>
                </Paper>
            </Box>

            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    gap: '24px',
                    height: '190px'
                }}
            >
                <Paper
                    sx={{
                        width: '100%',
                        backgroundImage: 'url(/images/Subtract_orange.svg)',
                        backgroundColor: 'var(--background-color-after)',
                        backgroundSize: 'cover',
                        borderRadius: '38px',
                        backgroundPosition: 'left center',
                        height: '100%',
                        padding: '24px',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        position: 'relative'
                    }}
                >
                    <Box
                        sx={{
                            position: 'absolute',
                            backgroundImage: 'url(/images/group_1.svg)',
                            backgroundSize: 'auto 50%',
                            backgroundRepeat: 'no-repeat',
                            left: '24px',
                            top: '24px',
                            width: 'calc(100% - 50px)',
                            height: '100%'
                        }}
                    ></Box>
                    <Box
                        sx={{
                            position: 'absolute',
                            backgroundImage: 'url(/images/error.png)',
                            backgroundSize: 'contain', // Đảm bảo hình hiển thị đầy đủ và tỷ lệ gốc
                            backgroundRepeat: 'no-repeat',
                            backgroundPosition: 'right 0px bottom 0px',
                            right: '24px',
                            bottom: '24px',
                            width: '36%',
                            height: '60%'
                        }}
                    ></Box>
                    <Typography
                        sx={{
                            fontSize: '20px',
                            fontWeight: 'bold',
                            color: 'var(--reward-title-color)'
                        }}
                    >
                        {t('Tổng số đơn báo cáo lỗi')}
                    </Typography>
                    <Typography
                        sx={{
                            color: 'var(--reward-title-color)',
                            fontSize: '35px',
                            mt: '10px',
                            fontWeight: 'bold'
                        }}
                    >
                        {currentEmployeesCount}
                    </Typography>
                    <Box
                        sx={{
                            mt: '10px',
                            color: '#4f4f4f',
                            fontSize: '15px',
                            fontWeight: 'bold',
                            display: 'flex',
                            alignItems: 'center'
                        }}
                    >
                        {currentEmployeesPercent !== null &&
                            (!(!currentEmployeesPercent || currentEmployeesPercent >= 0) ? (
                                <TrendingDown style={{ marginRight: '6px' }} />
                            ) : (
                                <TrendingUp style={{ marginRight: '6px' }} />
                            ))}
                        {currentEmployeesPercent !== null
                            ? currentEmployeesPercent + '%'
                            : t('COMMON.DASHBOARD.NO_CHANGE')}
                        <Typography
                            sx={{
                                ml: '6px',
                                color: '#4f4f4f',
                                fontSize: '16px'
                            }}
                        >
                            {t('COMMON.REWARD_DISCIPLINE.LAST_MONTH')}
                        </Typography>
                    </Box>
                </Paper>
            </Box>

            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    gap: '24px',
                    height: '190px',
                    marginTop: '24px'
                }}
            >
                <Paper
                    sx={{
                        width: '100%',
                        backgroundImage: 'url(/images/Subtract_red.svg)',
                        backgroundColor: 'var(--background-color-after)',
                        backgroundSize: 'cover',
                        borderRadius: '38px',
                        backgroundPosition: 'left center',
                        height: '100%',
                        padding: '24px',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        position: 'relative'
                    }}
                >
                    <Box
                        sx={{
                            position: 'absolute',
                            backgroundImage: 'url(/images/group_2.svg)',
                            backgroundSize: 'auto 50%',
                            backgroundRepeat: 'no-repeat',
                            left: '24px',
                            top: '24px',
                            width: 'calc(100% - 50px)',
                            height: '100%'
                        }}
                    ></Box>

                    <Box
                        sx={{
                            position: 'absolute',
                            backgroundImage: 'url(/images/request.png)',
                            backgroundSize: 'contain', // Đảm bảo hình hiển thị đầy đủ và tỷ lệ gốc
                            backgroundRepeat: 'no-repeat',
                            backgroundPosition: 'right 0px bottom 0px',
                            right: '24px',
                            bottom: '24px',
                            width: '36%',
                            height: '60%'
                        }}
                    ></Box>

                    <Typography
                        sx={{
                            fontSize: '20px',
                            fontWeight: 'bold',
                            color: 'var(--reward-title-color)'
                        }}
                    >
                        {t('Tổng số yêu cầu')}
                    </Typography>
                    <Typography
                        sx={{
                            color: 'var(--reward-title-color)',
                            fontSize: '35px',
                            mt: '10px',
                            fontWeight: 'bold'
                        }}
                    >
                        {resignedEmployeesCount}
                    </Typography>
                    <Box
                        sx={{
                            mt: '10px',
                            color: '#4f4f4f', //!(!newEmployeesPercent || newEmployeesPercent >= 0) ? '#F93C65' : '#00B69B',
                            fontSize: '15px',
                            fontWeight: 'bold',
                            display: 'flex',
                            alignItems: 'center'
                        }}
                    >
                        {resignedEmployeesPercent !== null &&
                            (!(!resignedEmployeesPercent || resignedEmployeesPercent >= 0) ? (
                                <TrendingDown style={{ marginRight: '6px' }} />
                            ) : (
                                <TrendingUp style={{ marginRight: '6px' }} />
                            ))}
                        {resignedEmployeesPercent !== null
                            ? resignedEmployeesPercent + '%'
                            : t('COMMON.DASHBOARD.NO_CHANGE')}
                        <Typography
                            sx={{
                                ml: '6px',
                                color: '#4f4f4f',
                                fontSize: '16px'
                            }}
                        >
                            {t('COMMON.REWARD_DISCIPLINE.LAST_MONTH')}
                        </Typography>
                    </Box>
                </Paper>
            </Box>
        </Box>
    )
}

export default Page
