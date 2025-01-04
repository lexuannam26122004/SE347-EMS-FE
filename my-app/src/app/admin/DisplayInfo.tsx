import { TrendingUp } from '@mui/icons-material'
import formatNumberWithUnit from '@/utils/formatNumberWithUnit'
import { useTranslation } from 'react-i18next'
import { Paper, Typography } from '@mui/material'
import { Box } from '@mui/material'
import { TrendingDown } from 'lucide-react'
import Loading from '@/components/Loading'
import { useGetEmployeeStatsByMonthAndYearQuery } from '@/services/EmploymentContractService'

interface IEmployeeStats {
    StartCount: number
    StartPercentChange: number
    EndCount: number
    EndPercentChange: number
}

function DisplayInfo() {
    const { t } = useTranslation('common')

    const date = new Date()
    const month = date.getMonth() + 1
    const year = date.getFullYear()
    const { data: response, isFetching } = useGetEmployeeStatsByMonthAndYearQuery({ Month: month, Year: year })

    const data = response?.Data as IEmployeeStats

    const totalEmployee = 105
    const employeePercent = 5.2
    const timeOff = 56
    const timeOffPercent = 10
    const totalEmployeeLayoff = data?.EndCount
    const layoffPercent = data?.EndPercentChange
    const newEmployees = data?.StartCount
    const newEmployeePercent = data?.StartPercentChange
    const laborCosts = 1200000000
    const laborCostsPercent = 14.47
    const promotions = 12
    const promotionPercent = 24

    if (isFetching) {
        return <Loading />
    }

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: '24px',
                overflowX: 'auto',
                '&::-webkit-scrollbar': {
                    width: '7px',
                    height: '7px',
                    backgroundColor: 'var(--background-after-color)'
                },
                '&::-webkit-scrollbar-thumb': {
                    backgroundColor: 'var(--scrollbar-color)',
                    borderRadius: '10px'
                },
                backgroundColor: 'var(--background-after-color)'
            }}
        >
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: '24px'
                }}
            >
                <Paper
                    elevation={0}
                    sx={{
                        flex: 1,
                        backgroundImage: 'linear-gradient(135deg, #ffdec9, #ffdec9)', // Từ cam nhạt (#FFE0B2) đến cam đậm (#FB8C00)
                        backgroundSize: 'cover',
                        backgroundRepeat: 'no-repeat',
                        backgroundPosition: 'center',
                        borderRadius: '15px',
                        padding: '20px 22px'
                    }}
                >
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Box>
                            <Typography
                                sx={{
                                    color: '#9e3c00',
                                    fontWeight: 'bold',
                                    fontSize: '16px'
                                }}
                            >
                                {t('COMMON.DASHBOARD.TOTAL_EMPLOYEES')}
                            </Typography>
                            <Typography
                                sx={{
                                    color: '#9e3c00',
                                    fontSize: '30px',
                                    mt: '10px',
                                    fontWeight: 'bold'
                                }}
                            >
                                {totalEmployee}
                            </Typography>
                        </Box>
                        <Box>
                            <img
                                src='/images/workforce.png'
                                style={{
                                    height: '55px'
                                }}
                            ></img>
                        </Box>
                    </Box>
                    <Box
                        sx={{
                            mt: '10px',
                            color: !(!employeePercent || employeePercent >= 0) ? '#F93C65' : '#00B69B',
                            fontSize: '14px',
                            fontWeight: 'bold',
                            display: 'flex',
                            alignItems: 'center'
                        }}
                    >
                        {employeePercent !== null &&
                            (!(!employeePercent || employeePercent >= 0) ? (
                                <TrendingDown style={{ marginRight: '6px' }} />
                            ) : (
                                <TrendingUp style={{ marginRight: '6px' }} />
                            ))}
                        {employeePercent !== null ? employeePercent + '%' : t('COMMON.DASHBOARD.NO_CHANGE')}
                        <Typography
                            sx={{
                                ml: '6px',
                                color: '#9e3c00',
                                fontSize: '16px'
                            }}
                        >
                            {t('COMMON.DASHBOARD.FROM_LAST_QUARTER')}
                        </Typography>
                    </Box>
                </Paper>
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
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Box>
                            <Typography
                                sx={{
                                    color: '#7a0000',
                                    fontWeight: 'bold',
                                    fontSize: '16px'
                                }}
                            >
                                {t('COMMON.DASHBOARD.TOTAL_TIME_OFF')}
                            </Typography>
                            <Typography
                                sx={{
                                    color: '#7a0000',
                                    fontSize: '30px',
                                    mt: '10px',
                                    fontWeight: 'bold'
                                }}
                            >
                                {timeOff}
                            </Typography>
                        </Box>
                        <Box>
                            <img
                                src='/images/day-off.png'
                                style={{
                                    marginTop: '-5px',
                                    height: '63px'
                                }}
                            ></img>
                        </Box>
                    </Box>
                    <Box
                        sx={{
                            mt: '10px',
                            color: timeOffPercent != null && timeOffPercent < 0 ? '#F93C65' : '#00B69B',
                            fontSize: '14px',
                            fontWeight: 'bold',
                            display: 'flex',
                            alignItems: 'center'
                        }}
                    >
                        {timeOffPercent != null &&
                            (timeOffPercent < 0 ? (
                                <TrendingDown style={{ marginRight: '6px' }} />
                            ) : (
                                <TrendingUp style={{ marginRight: '6px' }} />
                            ))}
                        {timeOffPercent !== null ? timeOffPercent + '%' : t('COMMON.DASHBOARD.NO_CHANGE')}
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
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Box>
                            <Typography
                                sx={{
                                    color: '#7A4100',
                                    fontWeight: 'bold',
                                    fontSize: '16px'
                                }}
                            >
                                {t('COMMON.DASHBOARD.TOTAL_NEW_EMPLOYEES')}
                            </Typography>
                            <Typography
                                sx={{
                                    color: '#7A4100',
                                    fontSize: '30px',
                                    mt: '10px',
                                    fontWeight: 'bold'
                                }}
                            >
                                {newEmployees}
                            </Typography>
                        </Box>
                        <Box>
                            <img
                                src='/images/new-employee.png'
                                style={{
                                    height: '55px'
                                }}
                            ></img>
                        </Box>
                    </Box>
                    <Box
                        sx={{
                            mt: '10px',
                            color: !(!newEmployeePercent || newEmployeePercent >= 0) ? '#F93C65' : '#00B69B',
                            fontSize: '14px',
                            fontWeight: 'bold',
                            display: 'flex',
                            alignItems: 'center'
                        }}
                    >
                        {newEmployeePercent !== null &&
                            (!(!newEmployeePercent || newEmployeePercent >= 0) ? (
                                <TrendingDown style={{ marginRight: '6px' }} />
                            ) : (
                                <TrendingUp style={{ marginRight: '6px' }} />
                            ))}
                        {newEmployeePercent !== null ? newEmployeePercent + '%' : t('COMMON.DASHBOARD.NO_CHANGE')}
                        <Typography
                            sx={{
                                ml: '6px',
                                color: '#7A4100',
                                fontSize: '16px'
                            }}
                        >
                            {t('COMMON.DASHBOARD.UP_FROM_LAST_MONTH')}
                        </Typography>
                    </Box>
                </Paper>
            </Box>

            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: '24px'
                }}
            >
                <Paper
                    elevation={0}
                    sx={{
                        flex: 1,
                        backgroundImage: 'linear-gradient(135deg, #d7e2ff, #d7e2ff)',
                        backgroundSize: 'cover',
                        backgroundRepeat: 'no-repeat',
                        backgroundPosition: 'center',
                        borderRadius: '15px',
                        padding: '20px 22px'
                    }}
                >
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Box>
                            <Typography
                                sx={{
                                    color: '#0e2d80',
                                    fontWeight: 'bold',
                                    fontSize: '16px'
                                }}
                            >
                                {t('COMMON.DASHBOARD.TOTAL_LAYOFF_EMPLOYEES')}
                            </Typography>
                            <Typography
                                sx={{
                                    color: '#0e2d80',
                                    fontSize: '30px',
                                    mt: '10px',
                                    fontWeight: 'bold'
                                }}
                            >
                                {totalEmployeeLayoff}
                            </Typography>
                        </Box>
                        <Box>
                            <img
                                src='/images/business.png'
                                style={{
                                    height: '59px'
                                }}
                            ></img>
                        </Box>
                    </Box>
                    <Box
                        sx={{
                            mt: '10px',
                            color: layoffPercent && layoffPercent < 0 ? '#F93C65' : '#00B69B',
                            fontSize: '16px',
                            fontWeight: 'bold',
                            display: 'flex',
                            alignItems: 'center'
                        }}
                    >
                        {layoffPercent !== null &&
                            (layoffPercent && layoffPercent < 0 ? (
                                <TrendingDown style={{ marginRight: '6px' }} />
                            ) : (
                                <TrendingUp style={{ marginRight: '6px' }} />
                            ))}
                        {layoffPercent !== null ? layoffPercent + '%' : t('COMMON.DASHBOARD.NO_CHANGE')}
                        <Typography
                            sx={{
                                ml: '6px',
                                color: '#0e2d80',
                                fontSize: '16px'
                            }}
                        >
                            {t('COMMON.DASHBOARD.DOWN_FROM_LAST_MONTH')}
                        </Typography>
                    </Box>
                </Paper>
                <Paper
                    elevation={0}
                    sx={{
                        flex: 1,
                        backgroundImage: 'linear-gradient(135deg, #C8FAD6, #C8FAD6)',
                        backgroundSize: 'cover',
                        backgroundRepeat: 'no-repeat',
                        backgroundPosition: 'center',
                        borderRadius: '15px',
                        padding: '20px 22px'
                    }}
                >
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Box>
                            <Typography
                                sx={{
                                    color: '#004b50',
                                    fontWeight: 'bold',
                                    fontSize: '16px'
                                }}
                            >
                                {t('COMMON.DASHBOARD.LABOR_COSTS')}
                            </Typography>
                            <Typography
                                sx={{
                                    color: '#004b50',
                                    fontSize: '30px',
                                    mt: '10px',
                                    fontWeight: 'bold'
                                }}
                            >
                                {formatNumberWithUnit(laborCosts)}
                            </Typography>
                        </Box>
                        <Box>
                            <img
                                src='/images/money-bag.png'
                                style={{
                                    height: '55px'
                                }}
                            ></img>
                        </Box>
                    </Box>
                    <Box
                        sx={{
                            mt: '10px',
                            color: laborCostsPercent && laborCostsPercent < 0 ? '#F93C65' : '#00B69B',
                            fontSize: '14px',
                            fontWeight: 'bold',
                            display: 'flex',
                            alignItems: 'center'
                        }}
                    >
                        {laborCostsPercent !== null &&
                            (laborCostsPercent && laborCostsPercent < 0 ? (
                                <TrendingDown style={{ marginRight: '6px' }} />
                            ) : (
                                <TrendingUp style={{ marginRight: '6px' }} />
                            ))}
                        {laborCostsPercent !== null ? laborCostsPercent + '%' : t('COMMON.DASHBOARD.NO_CHANGE')}
                        <Typography
                            sx={{
                                ml: '6px',
                                color: '#004b50',
                                fontSize: '16px'
                            }}
                        >
                            {t('COMMON.DASHBOARD.DOWN_FROM_LAST_MONTH')}
                        </Typography>
                    </Box>
                </Paper>
                <Paper
                    elevation={0}
                    sx={{
                        flex: 1,
                        backgroundImage: 'linear-gradient(135deg, #d5f8ff, #d5f8ff)',
                        backgroundSize: 'cover',
                        backgroundRepeat: 'no-repeat',
                        backgroundPosition: 'center',
                        borderRadius: '15px',
                        padding: '20px 22px'
                    }}
                >
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Box>
                            <Typography
                                sx={{
                                    color: '#00626b',
                                    fontWeight: 'bold',
                                    fontSize: '16px'
                                }}
                            >
                                {t('COMMON.DASHBOARD.INTERNAL_PROMOTIONS')}
                            </Typography>
                            <Typography
                                sx={{
                                    color: '#00626b',
                                    fontSize: '30px',
                                    mt: '10px',
                                    fontWeight: 'bold'
                                }}
                            >
                                {promotions}
                            </Typography>
                        </Box>
                        <Box>
                            <img
                                src='/images/promotion.png'
                                style={{
                                    height: '55px'
                                }}
                            ></img>
                        </Box>
                    </Box>
                    <Box
                        sx={{
                            mt: '10px',
                            color: !(!promotionPercent || promotionPercent >= 0) ? '#F93C65' : '#00B69B',
                            fontSize: '16px',
                            fontWeight: 'bold',
                            display: 'flex',
                            alignItems: 'center'
                        }}
                    >
                        {promotionPercent !== null &&
                            (!(!promotionPercent || promotionPercent >= 0) ? (
                                <TrendingDown style={{ marginRight: '6px' }} />
                            ) : (
                                <TrendingUp style={{ marginRight: '6px' }} />
                            ))}
                        {promotionPercent !== null ? promotionPercent + '%' : t('COMMON.DASHBOARD.NO_CHANGE')}
                        <Typography
                            sx={{
                                ml: '6px',
                                color: '#00626b',
                                fontSize: '16px'
                            }}
                        >
                            {t('COMMON.DASHBOARD.FROM_LAST_QUARTER')}
                        </Typography>
                    </Box>
                </Paper>
            </Box>
        </Box>
    )
}

export default DisplayInfo
