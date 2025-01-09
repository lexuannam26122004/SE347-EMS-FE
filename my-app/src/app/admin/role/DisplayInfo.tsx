'use client'

import { Box, Paper, Typography } from '@mui/material'
import { TrendingDown, TrendingUp } from '@mui/icons-material'
import { useTranslation } from 'react-i18next'
interface IRoleInfo {
    Name: string
    Total: number
    Percent_Money: number
    RoleStype: number
}

const responseData = {
    Data: {
        TotalRecords: 4,
        Records: [
            {
                Name: 'Tổng số quản trị viên',
                Total: 2,
                Percent_Money: 0,
                RoleStype: 1
            },
            {
                Name: 'Tổng số nhân viên quản lý',
                Total: 10,
                Percent_Money: 11.11,
                RoleStype: 2
            },
            {
                Name: 'Tổng số nhân viên',
                Total: 100,
                Percent_Money: 25,
                RoleStype: 3
            },
            {
                Name: 'Tổng số nhân viên IT',
                Total: 20,
                Percent_Money: 33.33,
                RoleStype: 4
            }
        ]
    }
}

function Page() {
    const { t } = useTranslation('common')

    const RoleDataRecord = (responseData?.Data?.Records as IRoleInfo[]) || []

    const rolesTypes = {
        1: {
            backgroundImage: 'linear-gradient(135deg, rgb(76, 221, 90),rgb(78, 244, 78))',
            color: 'rgb(0, 0, 0)'
        },
        2: {
            backgroundImage: 'linear-gradient(135deg, rgb(239, 102, 102), rgb(236, 60, 37))',
            color: 'rgb(0, 0, 0)'
        },
        3: {
            backgroundImage: 'linear-gradient(135deg, rgb(236, 107, 217), rgb(236, 33, 199))',
            color: 'rgb(0,0,0)'
        },
        4: {
            backgroundImage: 'linear-gradient(135deg, rgb(42, 179, 253), rgb(50, 150, 255))',
            color: 'rgb(0, 0, 0)'
        }
    }

    return (
        <Box>
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'flex-start',
                    alignItems: 'center',
                    height: '100%',
                    overflowY: 'hidden',
                    //marginBottom: '24px'
                    gap: '24px',
                    //overflow: 'auto',
                    '&::-webkit-scrollbar': {
                        width: '10px',
                        height: '10px',
                        backgroundColor: 'var(--background-after-color)'
                    },
                    '&::-webkit-scrollbar-thumb': {
                        backgroundColor: 'var(--scrollbar-color)',
                        borderRadius: '10px'
                    },
                    backgroundColor: 'var(--background-after-color)'
                }}
            >
                {RoleDataRecord.map(role => {
                    const styles = rolesTypes[role.RoleStype] || {
                        backgroundImage: 'linear-gradient(135deg, #ffffff, #dddddd)', // Kiểu mặc định
                        color: '#000000'
                    }
                    return (
                        <Paper
                            key={role.RoleStype}
                            sx={{
                                flexShrink: 0,
                                width: '400px',

                                backgroundImage: styles.backgroundImage,
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
                                    backgroundImage: 'url(/images/statistics_new_employee.png)',
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
                                {role.Name}
                            </Typography>
                            <Typography
                                sx={{
                                    color: 'var(--reward-title-color)',
                                    fontSize: '35px',
                                    mt: '10px',
                                    fontWeight: 'bold'
                                }}
                            >
                                {role.Total}
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
                                {role.Percent_Money !== null &&
                                    (!(!role.Percent_Money || role.Percent_Money >= 0) ? (
                                        <TrendingDown style={{ marginRight: '6px' }} />
                                    ) : (
                                        <TrendingUp style={{ marginRight: '6px' }} />
                                    ))}
                                {role.Percent_Money !== null
                                    ? role.Percent_Money + '%'
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
                    )
                })}
            </Box>
        </Box>
    )
}

export default Page
