'use client'

import { Box, Paper, Typography } from '@mui/material'
import { TrendingDown, TrendingUp } from '@mui/icons-material'
import { useTranslation } from 'react-i18next'
import { useStatsDisplayQuery } from '@/services/StatsRewardAndDisciplineService'
import Loading from '@/components/Loading'

function Page() {
    const { t } = useTranslation('common')

    const month = new Date().getMonth() + 1
    const year = new Date().getFullYear()

    const { data: responseDate, isLoading } = useStatsDisplayQuery({ month, year })

    const totalReward = responseDate?.Data?.currentReward
    const rewardPercent = responseDate?.Data?.rewardPercent
    const totalDis = responseDate?.Data?.currentDiscipline
    const disPercent = responseDate?.Data?.disciplinePercent

    if (isLoading) {
        return <Loading />
    }

    return (
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
                    width: 'calc(100% / 2)',
                    backgroundImage: 'url(/images/Subtract.svg)',
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
                        backgroundImage: 'url(/images/reward-image.svg)',
                        backgroundSize: '50% auto',
                        backgroundRepeat: 'no-repeat',
                        backgroundPosition: 'right -10px bottom -20px',
                        right: '24px',
                        top: '24px',
                        width: 'calc(100% - 50px)',
                        height: 'calc(100% - 48px)'
                    }}
                ></Box>
                <Typography
                    sx={{
                        fontSize: '20px',
                        fontWeight: 'bold',
                        color: 'var(--reward-title-color)'
                    }}
                >
                    {t('COMMON.REWARD_DISCIPLINE.SUMMARY_REWARD')}
                </Typography>
                <Typography
                    sx={{
                        color: 'var(--reward-title-color)',
                        fontSize: '35px',
                        mt: '10px',
                        fontWeight: 'bold'
                    }}
                >
                    {totalReward}
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
                    {rewardPercent !== null &&
                        (!(!rewardPercent || rewardPercent >= 0) ? (
                            <TrendingDown style={{ marginRight: '6px' }} />
                        ) : (
                            <TrendingUp style={{ marginRight: '6px' }} />
                        ))}
                    {rewardPercent !== null ? rewardPercent + '%' : t('COMMON.DASHBOARD.NO_CHANGE')}
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
            <Paper
                sx={{
                    width: 'calc(100% / 2)',
                    backgroundImage: 'url(/images/Subtract_orange.svg)',
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
                        backgroundImage: 'url(/images/discipline.png)',
                        backgroundSize: 'contain', // Đảm bảo hình hiển thị đầy đủ và tỷ lệ gốc
                        backgroundRepeat: 'no-repeat',
                        backgroundPosition: 'right -10px bottom -20px',
                        right: '24px',
                        bottom: '24px',
                        width: '36%',
                        height: '100%'
                    }}
                ></Box>

                <Typography
                    sx={{
                        fontSize: '20px',
                        fontWeight: 'bold',
                        color: 'var(--reward-title-color)'
                    }}
                >
                    {t('COMMON.REWARD_DISCIPLINE.SUMMARY_DISCIPLINE')}
                </Typography>
                <Typography
                    sx={{
                        color: 'var(--reward-title-color)',
                        fontSize: '35px',
                        mt: '10px',
                        fontWeight: 'bold'
                    }}
                >
                    {totalDis}
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
                    {disPercent !== null &&
                        (!(!disPercent || disPercent >= 0) ? (
                            <TrendingDown style={{ marginRight: '6px' }} />
                        ) : (
                            <TrendingUp style={{ marginRight: '6px' }} />
                        ))}
                    {disPercent !== null ? disPercent + '%' : t('COMMON.DASHBOARD.NO_CHANGE')}
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
    )
}

export default Page
