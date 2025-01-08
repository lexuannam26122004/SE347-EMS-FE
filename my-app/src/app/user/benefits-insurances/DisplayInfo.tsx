import { TrendingUp } from '@mui/icons-material'
//import formatNumberWithUnit from '@/utils/formatNumberWithUnit'
import { useTranslation } from 'react-i18next'
import { Divider, Paper, Typography } from '@mui/material'
import { Box } from '@mui/material'
import { TrendingDown } from 'lucide-react'
//import Loading from '@/components/Loading'

function DisplayInfo() {
    const { t } = useTranslation('common')
    const totalBenefit = 10
    const benefitPercent = 11.11
    const totalBenefitMoney = '5.600.000 VNĐ'
    const benefitMoneyPercent = 236

    const totalInsurance = 3
    const insurancePercent = 0
    const totalInsuranceMoney = '1.800.000 VNĐ'
    const insuranceMoneyPercent = 0

    return (
        <Box
            sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: '24px',
                padding: '5px 5px 5px 5px'
            }}
        >
            <Paper
                elevation={0}
                sx={{
                    flex: 1,
                    backgroundImage: 'linear-gradient(135deg, #ffcece, #ffcece)',
                    backgroundSize: 'cover',
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'center',
                    borderRadius: '15px',
                    padding: '20px 22px'
                }}
            >
                <Typography
                    sx={{
                        color: '#7a0000',
                        fontWeight: 'bold',
                        fontSize: '24px',
                        //border: '2px solid black',
                        //marginRight: '57px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}
                >
                    {t('Phúc lợi')}
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box sx={{ width: '100%', display: 'flex', flexDirection: 'row' }}>
                        <Box
                            sx={{
                                width: 'calc(100% /2)'
                                //border: '2px solid black'
                            }}
                        >
                            <Box
                                sx={{
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    flexDirection: 'column'
                                }}
                            >
                                <Typography
                                    sx={{
                                        color: '#7a0000',
                                        fontWeight: 'bold',
                                        fontSize: '16px'
                                        //border: '2px solid black'
                                    }}
                                >
                                    {t('Tổng số phúc lợi')}
                                </Typography>
                                <Typography
                                    sx={{
                                        color: '#7a0000',
                                        fontSize: '30px',
                                        //mt: '10px',
                                        fontWeight: 'bold'
                                        //border: '2px solid black'
                                    }}
                                >
                                    {totalBenefit}
                                </Typography>
                                <Box
                                    sx={{
                                        mt: '10px',
                                        color: benefitPercent != null && benefitPercent < 0 ? '#F93C65' : '#00B69B',
                                        fontSize: '14px',
                                        fontWeight: 'bold',
                                        display: 'flex',
                                        alignItems: 'center'
                                    }}
                                >
                                    {benefitPercent != null &&
                                        (benefitPercent < 0 ? (
                                            <TrendingDown style={{ marginRight: '6px' }} />
                                        ) : (
                                            <TrendingUp style={{ marginRight: '6px' }} />
                                        ))}
                                    {benefitPercent !== null ? benefitPercent + '%' : t('COMMON.DASHBOARD.NO_CHANGE')}
                                    <Typography
                                        sx={{
                                            ml: '6px',
                                            color: '#7a0000',
                                            fontSize: '16px'
                                        }}
                                    >
                                        {t('COMMON.DASHBOARD.DOWN_FROM_LAST_MONTH')}
                                    </Typography>
                                </Box>
                            </Box>
                        </Box>
                        <Divider
                            orientation='vertical'
                            //style={{ borderColor: 'black' }}
                            flexItem
                            sx={{ borderWidth: '2px' }}
                        />
                        <Box
                            sx={{
                                width: 'calc(100% /2)'
                                //border: '2px solid black'
                            }}
                        >
                            <Box
                                sx={{
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    flexDirection: 'column'
                                }}
                            >
                                <Typography
                                    sx={{
                                        color: '#7a0000',
                                        fontWeight: 'bold',
                                        fontSize: '16px'
                                        // border: '2px solid black'
                                    }}
                                >
                                    {t('Tổng số tiền nhận được')}
                                </Typography>
                                <Typography
                                    sx={{
                                        color: '#7a0000',
                                        fontSize: '30px',
                                        //mt: '10px',
                                        fontWeight: 'bold'
                                        // border: '2px solid black'
                                    }}
                                >
                                    {totalBenefitMoney}
                                </Typography>
                                <Box
                                    sx={{
                                        mt: '10px',
                                        color:
                                            benefitMoneyPercent != null && benefitMoneyPercent < 0
                                                ? '#F93C65'
                                                : '#00B69B',
                                        fontSize: '14px',
                                        fontWeight: 'bold',
                                        display: 'flex',
                                        alignItems: 'center'
                                    }}
                                >
                                    {benefitMoneyPercent != null &&
                                        (benefitMoneyPercent < 0 ? (
                                            <TrendingDown style={{ marginRight: '6px' }} />
                                        ) : (
                                            <TrendingUp style={{ marginRight: '6px' }} />
                                        ))}
                                    {benefitMoneyPercent !== null
                                        ? benefitMoneyPercent + '%'
                                        : t('COMMON.DASHBOARD.NO_CHANGE')}
                                    <Typography
                                        sx={{
                                            ml: '6px',
                                            color: '#7a0000',
                                            fontSize: '16px'
                                        }}
                                    >
                                        {t('COMMON.DASHBOARD.DOWN_FROM_LAST_MONTH')}
                                    </Typography>
                                </Box>
                            </Box>
                        </Box>
                    </Box>
                </Box>
            </Paper>
            <Paper
                elevation={0}
                sx={{
                    flex: 1,
                    backgroundImage: 'linear-gradient(135deg, #fff3ce, #fff3ce)',
                    backgroundSize: 'cover',
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'center',
                    borderRadius: '15px',
                    padding: '20px 22px'
                }}
            >
                <Typography
                    sx={{
                        color: '#7a0000',
                        fontWeight: 'bold',
                        fontSize: '24px',
                        //border: '2px solid black',
                        //marginRight: '57px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}
                >
                    {t('Bảo hiểm')}
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box sx={{ width: '100%', display: 'flex', flexDirection: 'row' }}>
                        <Box
                            sx={{
                                width: 'calc(100% /2)'
                                // border: '2px solid black'
                            }}
                        >
                            <Box
                                sx={{
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    flexDirection: 'column'
                                }}
                            >
                                <Typography
                                    sx={{
                                        color: '#7a0000',
                                        fontWeight: 'bold',
                                        fontSize: '16px'
                                        // border: '2px solid black'
                                    }}
                                >
                                    {t('Tổng số bảo hiểm')}
                                </Typography>
                                <Typography
                                    sx={{
                                        color: '#7a0000',
                                        fontSize: '30px',
                                        //mt: '10px',
                                        fontWeight: 'bold'
                                        // border: '2px solid black'
                                    }}
                                >
                                    {totalInsurance}
                                </Typography>
                                <Box
                                    sx={{
                                        mt: '10px',
                                        color: insurancePercent != null && insurancePercent < 0 ? '#F93C65' : '#00B69B',
                                        fontSize: '14px',
                                        fontWeight: 'bold',
                                        display: 'flex',
                                        alignItems: 'center'
                                    }}
                                >
                                    {insurancePercent != null &&
                                        (insurancePercent < 0 ? (
                                            <TrendingDown style={{ marginRight: '6px' }} />
                                        ) : (
                                            <TrendingUp style={{ marginRight: '6px' }} />
                                        ))}
                                    {insurancePercent !== null
                                        ? insurancePercent + '%'
                                        : t('COMMON.DASHBOARD.NO_CHANGE')}
                                    <Typography
                                        sx={{
                                            ml: '6px',
                                            color: '#7a0000',
                                            fontSize: '16px'
                                        }}
                                    >
                                        {t('COMMON.DASHBOARD.DOWN_FROM_LAST_MONTH')}
                                    </Typography>
                                </Box>
                            </Box>
                        </Box>
                        <Divider
                            orientation='vertical'
                            //style={{ borderColor: 'black' }}
                            flexItem
                            sx={{ borderWidth: '2px' }}
                        />
                        <Box
                            sx={{
                                width: 'calc(100% /2)'
                                // border: '2px solid black'
                            }}
                        >
                            <Box
                                sx={{
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    flexDirection: 'column'
                                }}
                            >
                                <Typography
                                    sx={{
                                        color: '#7a0000',
                                        fontWeight: 'bold',
                                        fontSize: '16px'
                                        //border: '2px solid black'
                                    }}
                                >
                                    {t('Tổng số tiền phải đóng')}
                                </Typography>
                                <Typography
                                    sx={{
                                        color: '#7a0000',
                                        fontSize: '30px',
                                        //mt: '10px',
                                        fontWeight: 'bold'
                                        //border: '2px solid black'
                                    }}
                                >
                                    {totalInsuranceMoney}
                                </Typography>
                                <Box
                                    sx={{
                                        mt: '10px',
                                        color:
                                            insuranceMoneyPercent != null && insuranceMoneyPercent < 0
                                                ? '#F93C65'
                                                : '#00B69B',
                                        fontSize: '14px',
                                        fontWeight: 'bold',
                                        display: 'flex',
                                        alignItems: 'center'
                                    }}
                                >
                                    {insuranceMoneyPercent != null &&
                                        (insuranceMoneyPercent < 0 ? (
                                            <TrendingDown style={{ marginRight: '6px' }} />
                                        ) : (
                                            <TrendingUp style={{ marginRight: '6px' }} />
                                        ))}
                                    {insuranceMoneyPercent !== null
                                        ? insuranceMoneyPercent + '%'
                                        : t('COMMON.DASHBOARD.NO_CHANGE')}
                                    <Typography
                                        sx={{
                                            ml: '6px',
                                            color: '#7a0000',
                                            fontSize: '16px'
                                        }}
                                    >
                                        {t('COMMON.DASHBOARD.DOWN_FROM_LAST_MONTH')}
                                    </Typography>
                                </Box>
                            </Box>
                        </Box>
                    </Box>
                </Box>
            </Paper>
        </Box>
    )
}
export default DisplayInfo
