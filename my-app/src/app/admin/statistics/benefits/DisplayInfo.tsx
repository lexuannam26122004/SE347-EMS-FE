'use client'

import { Box, Paper, Typography } from '@mui/material'
import { TrendingDown, TrendingUp } from '@mui/icons-material'
import { useTranslation } from 'react-i18next'
import { useGetTotalBenefitAndEmployeeByMonthAndYearQuery } from '@/services/BenefitService'

interface Get {
    TotalBenefit: number
    BenefitPercent: number
    TotalEmployee: number
    EmployeeBenefitPercent: number
}

function Page() {
    const { t } = useTranslation('common')
    //const totalReward = 29
    //const rewardPercent = 25.5
    //const totalDis = 12
    // //const disPercent = -20.5
    // const totalBenefit = 100
    // const benefitPercent = -1.5
    // const totalEmployeeBenefit = 20
    // const employeeBenefitPercent = 200
    const totalInsurance = 67
    const insurancePercent = 100
    const month = new Date().getMonth() + 1
    const year = new Date().getFullYear()

    const { data: responsedata } = useGetTotalBenefitAndEmployeeByMonthAndYearQuery({
        year: year,
        month: month
    })
    const data = responsedata?.Data as Get

    return (
        <Box
            sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                gap: '24px',
                //height: '190px',
                flexDirection: 'column'
            }}
        >
            <Paper
                sx={{
                    width: 'calc(100%)',
                    backgroundImage: 'url(/images/Subtract_orange.svg)',
                    backgroundColor: 'var(--background-color-after)',
                    backgroundSize: 'cover',
                    borderRadius: '38px',
                    backgroundPosition: 'right center',
                    height: '100%',
                    boxShadow: 'var(--box-shadow-paper)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    padding: '24px',
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
                        backgroundImage: 'url(/images/benefittotal.png)',
                        backgroundSize: '50% auto',
                        backgroundRepeat: 'no-repeat',
                        backgroundPosition: 'right -10px bottom -20px',
                        right: '24px',
                        bottom: '24px',
                        width: '60%',
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
                    {t('COMMON.INSURANCE_BENEFIT.SUMMARY_BENEFIT')}
                </Typography>
                <Typography
                    sx={{
                        color: 'var(--reward-title-color)',
                        fontSize: '35px',
                        mt: '10px',
                        fontWeight: 'bold'
                    }}
                >
                    {data?.TotalBenefit}
                </Typography>
                <Box
                    sx={{
                        mt: '10px',
                        color: '#4f4f4f', //!(!rewardPercent || rewardPercent >= 0) ? '#F93C65' : '#00B69B',
                        fontSize: '15px',
                        fontWeight: 'bold',
                        display: 'flex',
                        alignItems: 'center'
                    }}
                >
                    {data?.BenefitPercent !== null &&
                        (!(!data?.BenefitPercent || data?.BenefitPercent >= 0) ? (
                            <TrendingDown style={{ marginRight: '6px' }} />
                        ) : (
                            <TrendingUp style={{ marginRight: '6px' }} />
                        ))}
                    {data?.BenefitPercent !== null ? data?.BenefitPercent + '%' : t('COMMON.DASHBOARD.NO_CHANGE')}
                    <Typography
                        sx={{
                            ml: '6px',
                            color: '#4f4f4f',
                            fontSize: '16px'
                        }}
                    >
                        {t('COMMON.INSURANCE_BENEFIT.LAST_MONTH')}
                    </Typography>
                </Box>
            </Paper>
            <Paper
                sx={{
                    width: 'calc(100%)',
                    backgroundImage: 'url(/images/Subtract_green.svg)',
                    backgroundColor: 'var(--background-color-after)',
                    backgroundSize: 'cover',
                    borderRadius: '38px',
                    boxShadow: 'var(--box-shadow-paper)',
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
                        backgroundImage: 'url(/images/Human-Resources.png)',
                        backgroundSize: 'contain', // Đảm bảo hình hiển thị đầy đủ và tỷ lệ gốc
                        backgroundRepeat: 'no-repeat',
                        backgroundPosition: 'right -10px bottom -20px',
                        right: '24px',
                        bottom: '24px',
                        width: '60%',
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
                    {t('COMMON.INSURANCE_BENEFIT.SUMMARY_EMPLOYEE_BENEFIT')}
                </Typography>
                <Typography
                    sx={{
                        color: 'var(--reward-title-color)',
                        fontSize: '35px',
                        mt: '10px',
                        fontWeight: 'bold'
                    }}
                >
                    {data?.TotalEmployee}
                </Typography>
                <Box
                    sx={{
                        mt: '10px',
                        color: '#4f4f4f', //!(!rewardPercent || rewardPercent >= 0) ? '#F93C65' : '#00B69B',
                        fontSize: '15px',
                        fontWeight: 'bold',
                        display: 'flex',
                        alignItems: 'center'
                    }}
                >
                    {data?.EmployeeBenefitPercent !== null &&
                        (!(!data?.EmployeeBenefitPercent || data?.EmployeeBenefitPercent >= 0) ? (
                            <TrendingDown style={{ marginRight: '6px' }} />
                        ) : (
                            <TrendingUp style={{ marginRight: '6px' }} />
                        ))}
                    {data?.EmployeeBenefitPercent !== null
                        ? data?.EmployeeBenefitPercent + '%'
                        : t('COMMON.DASHBOARD.NO_CHANGE')}
                    <Typography
                        sx={{
                            ml: '6px',
                            color: '#4f4f4f',
                            fontSize: '16px'
                        }}
                    >
                        {t('COMMON.INSURANCE_BENEFIT.LAST_MONTH')}
                    </Typography>
                </Box>
            </Paper>
            <Paper
                sx={{
                    width: 'calc(100%)',
                    backgroundImage: 'url(/images/Subtract_red.svg)',
                    backgroundColor: 'var(--background-color-after)',
                    backgroundSize: 'cover',
                    borderRadius: '38px',
                    boxShadow: 'var(--box-shadow-paper)',
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
                        backgroundImage: 'url(/images/insurance.png)',
                        backgroundSize: 'contain', // Đảm bảo hình hiển thị đầy đủ và tỷ lệ gốc
                        backgroundRepeat: 'no-repeat',
                        backgroundPosition: 'right -10px bottom -20px',
                        right: '24px',
                        bottom: '24px',
                        width: '60%',
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
                    {t('COMMON.INSURANCE_BENEFIT.SUMMARY_EMPLOYEE_INSURANCE_IS_ACTIVE')}
                </Typography>
                <Typography
                    sx={{
                        color: 'var(--reward-title-color)',
                        fontSize: '35px',
                        mt: '10px',
                        fontWeight: 'bold'
                    }}
                >
                    {totalInsurance}
                </Typography>
                <Box
                    sx={{
                        mt: '10px',
                        color: '#4f4f4f', //!(!rewardPercent || rewardPercent >= 0) ? '#F93C65' : '#00B69B',
                        fontSize: '15px',
                        fontWeight: 'bold',
                        display: 'flex',
                        alignItems: 'center'
                    }}
                >
                    {insurancePercent !== null &&
                        (!(!insurancePercent || insurancePercent >= 0) ? (
                            <TrendingDown style={{ marginRight: '6px' }} />
                        ) : (
                            <TrendingUp style={{ marginRight: '6px' }} />
                        ))}
                    {insurancePercent !== null ? insurancePercent + '%' : t('COMMON.DASHBOARD.NO_CHANGE')}
                    <Typography
                        sx={{
                            ml: '6px',
                            color: '#4f4f4f',
                            fontSize: '16px'
                        }}
                    >
                        {t('COMMON.INSURANCE_BENEFIT.LAST_MONTH')}
                    </Typography>
                </Box>
            </Paper>
        </Box>
    )
}

export default Page
