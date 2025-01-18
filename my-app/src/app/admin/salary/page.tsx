'use client'

import { Box, Typography } from '@mui/material'
import { BellPlus, Grid2x2Plus, HandCoins, Sheet } from 'lucide-react'
import EmployeeSalaryChart from './EmployeeSalaryChart'
import IncomeStructureChart from './IncomeStructureChart'
import TotalIncomeChart from './TotalIncomeChart'
import DepartmentChart from './DepartmentChart'
import ErrorSalary from './ErrorSalary'
import { useCreateSalaryMutation, useGetInfoForSalarySummaryQuery } from '@/services/SalaryService'
import { useEffect } from 'react'
import { useCreateNotificationMutation } from '@/services/NotificationsService'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { authSelector } from '@/redux/slices/authSlice'
import { useRouter } from 'next/navigation'
import { useGetAuthMeQuery } from '@/services/AuthService'

function OverviewSalaryPage() {
    const { t } = useTranslation()
    const router = useRouter()
    const [createSalaries, { isSuccess, isError }] = useCreateSalaryMutation()
    const [createNotification] = useCreateNotificationMutation()
    const menuLeft = useSelector(authSelector)

    const { data: responseGetMe } = useGetAuthMeQuery()
    const userSentNotificationId = responseGetMe?.Data?.Id

    const handleNotify = async () => {
        try {
            const data = {
                Type: 'Salary',
                Content: 'Đã có bảng lương tháng này',
                Title: 'New Salary Table',
                ListUser: [],
                ListFile: [],
                UserId: userSentNotificationId,
                ListDept: [],
                ListRole: [],
                TypeToNotify: 1
            }

            await createNotification(data).unwrap()
        } catch (error) {
            console.error('Failed to save holiday:', error)
        }
    }

    const handleCreate = () => {
        createSalaries()
    }

    const { data } = useGetInfoForSalarySummaryQuery()
    const { total, PITax, totalInsurance } = data?.Data || {}
    useEffect(() => {}, [createSalaries, isSuccess, isError])
    return (
        <Box
            sx={{
                scrollbarGutter: 'stable',
                overflow: 'auto',
                '&::-webkit-scrollbar': {
                    width: '7px',
                    height: '7px'
                },
                '&::-webkit-scrollbar-thumb': {
                    backgroundColor: 'var(--scrollbar-color)',
                    borderRadius: '10px'
                }
            }}
        >
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Box
                    sx={{
                        width: 'calc(100% / 3)',
                        backgroundBlendMode: 'overlay',
                        backgroundImage: 'url("images/group1.png")',
                        backgroundSize: 'cover',
                        backgroundColor: '#FFCCCC',
                        backgroundPosition: 'center',
                        borderRadius: '15px',
                        zIndex: 1,
                        cursor: 'pointer', // Hiển thị con trỏ tay khi hover
                        transition: 'transform 0.5s ease', // Hiệu ứng phóng to mượt mà
                        '&:hover': {
                            transform: 'scale(1.02)' // Phóng to nhẹ khi hover
                        },
                        '&::after': {
                            content: '""',
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            width: '0',
                            height: '100%',
                            background: 'linear-gradient(to right, rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0))',
                            transform: 'translate(-50%, -50%)',
                            opacity: 0,
                            transition: 'width 0.4s ease, opacity 0.4s ease',
                            zIndex: 0 // Đảm bảo pseudo-element nằm dưới nội dung
                        },
                        '&:active::after': {
                            width: '200%', // Hiệu ứng gợn sóng sang hai bên
                            opacity: 1
                        }
                        //border: '1px solid black'
                    }}
                    onClick={() => router.push('/admin/salary/detail')}
                >
                    <Sheet size={'30px'} style={{ color: 'white', marginLeft: '10px', marginTop: '20px' }}></Sheet>
                    <Typography
                        sx={{
                            color: 'green',
                            padding: '10px',
                            marginBottom: '5px',
                            zIndex: 2,
                            fontSize: '24px',
                            fontWeight: 'bold'
                        }}
                    >
                        {t('COMMON.SALARY.VIEW_DETAIL')}
                    </Typography>
                </Box>
                {menuLeft['/admin/salary'].IsAllowCreate && (
                    <Box
                        // variant='contained'
                        // color='primary'
                        // //onClick={handleCreateSalaries}
                        // disabled={isLoading}
                        sx={{
                            marginLeft: '20px',
                            width: 'calc(100% / 3)',
                            backgroundBlendMode: 'overlay',
                            backgroundImage: 'url("images/group1.png")',
                            backgroundSize: 'cover',
                            backgroundColor: '#99FF99',
                            backgroundPosition: 'center',
                            borderRadius: '15px',
                            zIndex: 1,
                            cursor: 'pointer', // Hiển thị con trỏ tay khi hover
                            transition: 'transform 0.5s ease', // Hiệu ứng phóng to mượt mà
                            '&:hover': {
                                transform: 'scale(1.02)' // Phóng to nhẹ khi hover
                            },
                            '&::after': {
                                content: '""',
                                position: 'absolute',
                                top: '50%',
                                left: '50%',
                                width: '0',
                                height: '100%',
                                background:
                                    'linear-gradient(to right, rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0))',
                                transform: 'translate(-50%, -50%)',
                                opacity: 0,
                                transition: 'width 0.4s ease, opacity 0.4s ease',
                                zIndex: 0 // Đảm bảo pseudo-element nằm dưới nội dung
                            },
                            '&:active::after': {
                                width: '200%', // Hiệu ứng gợn sóng sang hai bên
                                opacity: 1
                            }
                        }}
                        onClick={() => handleCreate()}
                    >
                        <Grid2x2Plus
                            size={'30px'}
                            style={{ color: 'white', marginLeft: '10px', marginTop: '20px' }}
                        ></Grid2x2Plus>
                        <Typography
                            sx={{
                                color: 'green',
                                padding: '10px',
                                marginBottom: '5px',
                                zIndex: 2,
                                fontSize: '24px',
                                fontWeight: 'bold'
                            }}
                        >
                            {t('COMMON.SALARY.CREATE')}
                        </Typography>
                    </Box>
                )}
                {menuLeft['/admin/salary'].IsAllowView && (
                    <Box
                        onClick={() => router.push('/admin/salary/unpaid')}
                        sx={{
                            marginLeft: '20px',
                            width: 'calc(100% / 3)',
                            backgroundBlendMode: 'overlay',
                            backgroundImage: 'url("images/group1.png")',
                            backgroundSize: 'cover',
                            backgroundColor: '#FFFF00',
                            backgroundPosition: 'center',
                            borderRadius: '15px',
                            zIndex: 1,
                            cursor: 'pointer', // Hiển thị con trỏ tay khi hover
                            transition: 'transform 0.5s ease', // Hiệu ứng phóng to mượt mà
                            '&:hover': {
                                transform: 'scale(1.02)' // Phóng to nhẹ khi hover
                            },
                            '&::after': {
                                content: '""',
                                position: 'absolute',
                                top: '50%',
                                left: '50%',
                                width: '0',
                                height: '100%',
                                background:
                                    'linear-gradient(to right, rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0))',
                                transform: 'translate(-50%, -50%)',
                                opacity: 0,
                                transition: 'width 0.4s ease, opacity 0.4s ease',
                                zIndex: 0 // Đảm bảo pseudo-element nằm dưới nội dung
                            },
                            '&:active::after': {
                                width: '200%', // Hiệu ứng gợn sóng sang hai bên
                                opacity: 1
                            }
                        }}
                    >
                        <HandCoins
                            size={'30px'}
                            style={{ color: 'white', marginLeft: '10px', marginTop: '20px' }}
                        ></HandCoins>
                        <Typography
                            sx={{
                                color: 'green',
                                padding: '10px',
                                marginBottom: '5px',
                                zIndex: 2,
                                fontSize: '24px',
                                fontWeight: 'bold'
                            }}
                        >
                            {t('COMMON.SALARY.PAID')}
                        </Typography>
                    </Box>
                )}
                {menuLeft['/admin/salary'].IsAllowCreate && (
                    <Box
                        sx={{
                            marginLeft: '20px',
                            width: 'calc(100% / 3)',
                            backgroundBlendMode: 'overlay',
                            backgroundImage: 'url("images/group1.png")',
                            backgroundSize: 'cover',
                            backgroundColor: '#FF9966',
                            backgroundPosition: 'center',
                            borderRadius: '15px',
                            zIndex: 1,
                            cursor: 'pointer', // Hiển thị con trỏ tay khi hover
                            transition: 'transform 0.5s ease', // Hiệu ứng phóng to mượt mà
                            '&:hover': {
                                transform: 'scale(1.02)' // Phóng to nhẹ khi hover
                            },
                            '&::after': {
                                content: '""',
                                position: 'absolute',
                                top: '50%',
                                left: '50%',
                                width: '0',
                                height: '100%',
                                background:
                                    'linear-gradient(to right, rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0))',
                                transform: 'translate(-50%, -50%)',
                                opacity: 0,
                                transition: 'width 0.4s ease, opacity 0.4s ease',
                                zIndex: 0 // Đảm bảo pseudo-element nằm dưới nội dung
                            },
                            '&:active::after': {
                                width: '200%', // Hiệu ứng gợn sóng sang hai bên
                                opacity: 1
                            }
                        }}
                        onClick={() => handleNotify()}
                    >
                        <BellPlus
                            size={'30px'}
                            style={{ color: 'white', marginLeft: '10px', marginTop: '20px' }}
                        ></BellPlus>
                        <Typography
                            sx={{
                                color: 'green',
                                padding: '10px',
                                marginBottom: '5px',
                                zIndex: 2,
                                fontSize: '24px',
                                fontWeight: 'bold'
                            }}
                        >
                            {t('COMMON.SALARY.NOTIFY')}
                        </Typography>
                    </Box>
                )}
            </Box>
            <Box
                sx={{
                    display: 'flex',
                    width: '100%',
                    height: '100%',
                    overflow: 'hidden',
                    marginTop: '24px',
                    gap: '24px'
                }}
            >
                <Box sx={{ width: 'calc(100% / 4 * 3)' }}>
                    <Box>
                        <Box
                            sx={{
                                backgroundColor: 'var(--background-item)',
                                width: '100%',
                                borderRadius: '15px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '15px',
                                marginRight: '5px',
                                height: '100%'
                            }}
                        >
                            <Box
                                sx={{
                                    width: 'calc(100% / 4)',
                                    backgroundBlendMode: 'overlay',
                                    backgroundImage: 'url("/background_salary/tinhluong.png")',
                                    backgroundSize: 'cover',
                                    backgroundRepeat: 'no-repeat',
                                    backgroundPosition: 'center',
                                    borderTopLeftRadius: '10px',
                                    borderBottomLeftRadius: '10px',
                                    height: '155px'
                                }}
                            ></Box>
                            <Box
                                sx={{
                                    width: 'calc(100% / 4 * 3)',
                                    marginLeft: '15px'
                                }}
                            >
                                <Typography
                                    sx={{
                                        fontSize: '20px',
                                        fontWeight: 'bold',
                                        marginTop: '12px',
                                        marginBottom: '2px'
                                    }}
                                >
                                    {t('COMMON.SALARY.SALARY_SUMMARY')}
                                </Typography>
                                <Typography
                                    sx={{
                                        fontSize: '16px',
                                        marginBottom: '15px'
                                    }}
                                >
                                    {t('COMMON.SALARY.MONTH_SALARY')}
                                </Typography>
                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <Box sx={{ width: 'calc(100% / 8 * 3)' }}>
                                        <Typography fontSize={'18px'}>{t('COMMON.SALARY.TOTAL_SALARY')}</Typography>
                                        <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: '12px' }}>
                                            <Typography fontWeight={'bold'} fontSize={'24px'}>
                                                {total > 1000000
                                                    ? (total / 1000000).toFixed(2)
                                                    : total > 1000
                                                    ? (total / 1000).toFixed(2)
                                                    : total}
                                            </Typography>
                                            <Typography fontSize={'16px'} style={{ marginLeft: '5px' }}>
                                                {total > 1000000
                                                    ? t('COMMON.SALARY.TB')
                                                    : total > 1000
                                                    ? t('COMMON.SALARY.B')
                                                    : t('COMMON.SALARY.M')}
                                            </Typography>
                                        </Box>
                                    </Box>
                                    <Box sx={{ width: 'calc(100% / 8 * 3)' }}>
                                        <Typography fontSize={'18px'}>{t('COMMON.SALARY.PI_TAX')}</Typography>
                                        <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: '12px' }}>
                                            <Typography fontWeight={'bold'} fontSize={'24px'}>
                                                {PITax > 1000000000
                                                    ? (PITax / 1000000000).toFixed(2)
                                                    : PITax > 1000000
                                                    ? (PITax / 1000000).toFixed(2)
                                                    : PITax > 1000
                                                    ? (PITax / 1000).toFixed(2)
                                                    : PITax}
                                            </Typography>
                                            <Typography fontSize={'16px'} style={{ marginLeft: '5px' }}>
                                                {PITax > 1000000
                                                    ? t('COMMON.SALARY.TB')
                                                    : PITax > 1000
                                                    ? t('COMMON.SALARY.B')
                                                    : t('COMMON.SALARY.M')}
                                            </Typography>
                                        </Box>
                                    </Box>
                                    <Box sx={{ width: 'calc(100% / 8 * 2)', marginRight: '-10px' }}>
                                        <Typography fontSize={'18px'}>{t('COMMON.SALARY.TOTAL_INSURANCE')}</Typography>
                                        <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: '12px' }}>
                                            <Typography fontWeight={'bold'} fontSize={'24px'}>
                                                {totalInsurance > 1000000
                                                    ? (totalInsurance / 1000000).toFixed(2)
                                                    : totalInsurance > 1000
                                                    ? (totalInsurance / 1000).toFixed(2)
                                                    : totalInsurance}
                                            </Typography>
                                            <Typography fontSize={'16px'} style={{ marginLeft: '5px' }}>
                                                {totalInsurance > 1000000
                                                    ? t('COMMON.SALARY.TB')
                                                    : totalInsurance > 1000
                                                    ? t('COMMON.SALARY.B')
                                                    : t('COMMON.SALARY.M')}
                                            </Typography>
                                        </Box>
                                    </Box>
                                </Box>
                            </Box>
                        </Box>
                    </Box>

                    <Box sx={{ gap: '24px', display: 'flex', alignItems: 'stretch', marginTop: '24px' }}>
                        <Box
                            sx={{
                                backgroundColor: 'var(--background-item)',
                                borderRadius: '15px',
                                width: 'calc(100% / 2)'
                            }}
                        >
                            <EmployeeSalaryChart />
                        </Box>
                        <Box
                            sx={{
                                backgroundColor: 'var(--background-item)',
                                borderRadius: '15px',
                                width: 'calc(100% / 2)'
                            }}
                        >
                            <IncomeStructureChart />
                        </Box>
                    </Box>
                    <Box sx={{ gap: '24px', display: 'flex', alignItems: 'stretch', marginTop: '24px' }}>
                        <Box
                            sx={{
                                backgroundColor: 'var(--background-item)',
                                borderRadius: '15px',
                                width: 'calc(100% / 2)'
                            }}
                        >
                            <TotalIncomeChart />
                        </Box>
                        <Box
                            sx={{
                                backgroundColor: 'var(--background-item)',
                                borderRadius: '15px',
                                width: 'calc(100% / 2)'
                            }}
                        >
                            <DepartmentChart />
                        </Box>
                    </Box>
                </Box>
                <Box sx={{ width: 'calc(100% / 4)', overflow: 'hidden' }}>
                    <ErrorSalary />
                </Box>
            </Box>
        </Box>
    )
}

export default OverviewSalaryPage
