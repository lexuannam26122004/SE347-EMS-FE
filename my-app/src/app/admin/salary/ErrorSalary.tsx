import React, { useRef, useState } from 'react'
import Slider from 'react-slick'
import { Card, CardContent, Typography, Button, Avatar, Box, Paper, Divider, Chip } from '@mui/material'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'
import { Building, ChevronLeft, ChevronRight, IdCard, UserRoundCog } from 'lucide-react'
import { useTranslation } from 'react-i18next'

// Sample Error Report Data based on provided SQL schema
const errorReports = [
    {
        Id: 1,
        ReportedBy: 'EMP001',
        ReportedDate: '2024-12-20T10:00:00',
        Type: 'Salary',
        TypeId: 101,
        Description: 'Incorrect salary calculation for November',
        Status: 'Pending',
        ResolvedBy: null,
        ResolvedDate: null,
        ResolutionDetails: null,
        AvatarPath: '/AvatarPath1.jpg',
        FullName: 'Nguyen Van A',
        Roles: 'Software Engineer',
        Department: 'IT Department',
        EmployeeId: 'EMP001'
    },
    {
        Id: 2,
        ReportedBy: 'EMP002',
        ReportedDate: '2024-12-21T14:30:00',
        Type: 'Tax',
        TypeId: 202,
        Description: 'Tax deduction error in payslip',
        Status: 'Resolved',
        ResolvedBy: 'ADM001',
        ResolvedDate: '2024-12-22T16:00:00',
        ResolutionDetails: 'Tax rate was corrected.',
        AvatarPath: '/AvatarPath2.jpg',
        FullName: 'Tran Thi B',
        Roles: 'Project Manager',
        Department: 'HR Department',
        EmployeeId: 'EMP002'
    },
    {
        Id: 3,
        ReportedBy: 'EMP003',
        ReportedDate: '2024-12-22T09:00:00',
        Type: 'Bonus',
        TypeId: 303,
        Description: 'Bonus not added to November salary',
        Status: 'Pending',
        ResolvedBy: null,
        ResolvedDate: null,
        ResolutionDetails: null,
        AvatarPath: '/Avatar3.jpg',
        FullName: 'Le Van C',
        Roles: 'UI/UX Designer',
        Department: 'Design Department',
        EmployeeId: 'EMP003'
    },
    {
        Id: 4,
        ReportedBy: 'EMP001',
        ReportedDate: '2024-12-20T10:00:00',
        Type: 'Salary',
        TypeId: 101,
        Description: 'Another salary calculation error for December',
        Status: 'Pending',
        ResolvedBy: null,
        ResolvedDate: null,
        ResolutionDetails: null,
        AvatarPath: '/AvatarPath1.jpg',
        FullName: 'Nguyen Van A',
        Roles: 'Software Engineer',
        Department: 'IT Department',
        EmployeeId: 'EMP001'
    }
]

export default function ErrorSalary() {
    const sliderRef = useRef<Slider | null>(null)
    const [currentSlide, setCurrentSlide] = useState(0)
    const { t } = useTranslation('common')

    const settings = {
        dots: false,
        infinite: false,
        autoplaySpeed: 1000,
        cssEase: 'ease-out',
        speed: 500,
        swipeToSlide: true,
        waitForAnimate: false,
        slidesToShow: 1,
        adaptiveHeight: true,
        slidesToScroll: 1,
        arrows: false,
        beforeChange: (current: number, next: number) => {
            setCurrentSlide(next)
        }
    }

    const isFirstSlide = currentSlide === 0
    const isLastSlide = currentSlide === errorReports.length - 1

    const handleNext = () => {
        const nextSlide = currentSlide + 1 >= errorReports.length ? errorReports.length - 1 : currentSlide + 1
        sliderRef.current?.slickGoTo(nextSlide)
    }

    const handlePrev = () => {
        const prevSlide = currentSlide - 1 < 0 ? 0 : currentSlide - 1
        sliderRef.current?.slickGoTo(prevSlide)
    }

    return (
        <Paper
            elevation={0}
            sx={{
                width: '100%',
                padding: '24px 0',
                backgroundColor: 'var(--background-item)',
                borderRadius: '15px',
                height: '550px',
                display: 'flex',
                flexDirection: 'column'
            }}
        >
            <Box
                sx={{
                    padding: '0 17px 0 24px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'top'
                }}
            >
                <Typography
                    variant='h6'
                    sx={{
                        fontSize: '18px',
                        fontWeight: 'bold',
                        color: 'var(--text-color)'
                    }}
                >
                    Salary Report Errors List
                </Typography>
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}
                >
                    <Button
                        onClick={handlePrev}
                        sx={{
                            color: 'gray',
                            minWidth: 'auto',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            marginRight: 1,
                            borderRadius: '50%',
                            padding: 0.5,
                            '&:hover': {
                                backgroundColor: 'var(--hover-color)'
                            }
                        }}
                        disabled={isFirstSlide}
                    >
                        <ChevronLeft />
                    </Button>
                    <Button
                        onClick={handleNext}
                        sx={{
                            color: 'gray',
                            mr: 0,
                            minWidth: 'auto',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            marginRight: 1,
                            borderRadius: '50%',
                            padding: 0.5,
                            '&:hover': {
                                backgroundColor: 'var(--hover-color)'
                            }
                        }}
                        disabled={isLastSlide}
                    >
                        <ChevronRight />
                    </Button>
                </Box>
            </Box>

            <Typography
                variant='body2'
                sx={{ color: 'var(--sub-title-color)', padding: '0 24px', marginBottom: 3, mt: '0px' }}
            >
                {errorReports.length} {t('COMMON.DASHBOARD.REQUESTS')}
            </Typography>

            <Box
                sx={{
                    flexGrow: 1,
                    scrollbarGutter: 'stable',
                    '&::-webkit-scrollbar': {
                        width: '7px',
                        height: '7px'
                    },
                    '&::-webkit-scrollbar-thumb': {
                        backgroundColor: 'var(--scrollbar-color)',
                        borderRadius: '10px'
                    },
                    overflowY: 'auto'
                }}
            >
                <Slider ref={sliderRef} {...settings}>
                    {errorReports.map((report, index) => (
                        <Card
                            key={index}
                            sx={{
                                backgroundColor: 'transparent',
                                boxShadow: 'none',
                                height: 'auto',
                                display: 'block'
                            }}
                        >
                            <CardContent
                                sx={{
                                    padding: '0 17px 0 24px',
                                    paddingBottom: '10px!important',
                                    overflow: 'auto'
                                }}
                            >
                                <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: 2 }}>
                                    <Avatar
                                        sx={{ marginRight: 2, height: '48px', width: '48px' }}
                                        src={report.AvatarPath}
                                        alt={report.FullName}
                                    />
                                    <Box>
                                        <Typography
                                            variant='subtitle1'
                                            sx={{ fontWeight: 'bold', fontSize: '14px', color: 'var(--text-color)' }}
                                        >
                                            {report.FullName}
                                        </Typography>
                                        <Typography
                                            variant='body2'
                                            sx={{ fontSize: '12px', color: 'var(--created-date-color)', mt: '4px' }}
                                        >
                                            {t('COMMON.DASHBOARD.POSTED')}{' '}
                                            {new Date(report.ReportedDate).toLocaleString()}
                                        </Typography>
                                    </Box>
                                </Box>

                                <Box
                                    sx={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        marginBottom: 2,
                                        padding: '14px 16px',
                                        borderRadius: '10px',
                                        gap: '10px',
                                        border: '1px solid var(--border-color)'
                                    }}
                                >
                                    <Box
                                        sx={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            color: '#00b8d9',
                                            gap: '10px'
                                        }}
                                    >
                                        <Building />
                                        <Typography variant='body2' sx={{ fontSize: '14px', fontWeight: 'bold' }}>
                                            {t('COMMON.DASHBOARD.DEPARTMENT') + ': '}
                                        </Typography>
                                        <Typography
                                            variant='body2'
                                            sx={{ fontSize: '14px', color: 'var(--text-color)', fontWeight: 'bold' }}
                                        >
                                            {report.Department}
                                        </Typography>
                                    </Box>
                                    <Box
                                        sx={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            color: '#ff5630',
                                            gap: '10px'
                                        }}
                                    >
                                        <UserRoundCog />
                                        <Typography variant='body2' sx={{ fontSize: '14px', fontWeight: 'bold' }}>
                                            {t('COMMON.DASHBOARD.ROLES') + ': '}
                                        </Typography>
                                        <Typography
                                            variant='body2'
                                            sx={{ fontSize: '14px', color: 'var(--text-color)', fontWeight: 'bold' }}
                                        >
                                            {report.Roles}
                                        </Typography>
                                    </Box>
                                    <Box
                                        sx={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            color: '#22c55e',
                                            gap: '10px'
                                        }}
                                    >
                                        <IdCard />
                                        <Typography variant='body2' sx={{ fontSize: '14px', fontWeight: 'bold' }}>
                                            {t('COMMON.DASHBOARD.EMPLOYEE_ID') + ': '}
                                        </Typography>
                                        <Typography
                                            variant='body2'
                                            sx={{ fontSize: '14px', color: 'var(--text-color)', fontWeight: 'bold' }}
                                        >
                                            {report.EmployeeId}
                                        </Typography>
                                    </Box>
                                </Box>

                                <Typography
                                    variant='body2'
                                    sx={{
                                        marginBottom: 1,
                                        fontWeight: 'bold',
                                        fontStyle: 'italic',
                                        fontSize: '14px',
                                        color: 'var(--text-color)'
                                    }}
                                >
                                    {t('COMMON.DASHBOARD.DESCRIPTION') + ':'}
                                </Typography>
                                <Typography
                                    variant='body2'
                                    sx={{ marginBottom: 2, fontSize: '14px', color: 'var(--text-color)' }}
                                >
                                    {report.Description}
                                </Typography>
                                <Box
                                    sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'space-between'
                                    }}
                                >
                                    <Chip
                                        label={`${t('COMMON.DASHBOARD.TYPE')}: ${report.Type}`}
                                        sx={{
                                            fontSize: '13px',
                                            fontWeight: 'bold',
                                            color: 'var(--text-color)',
                                            backgroundColor: 'var(--chip-bg-color)'
                                        }}
                                    />
                                    <Chip
                                        label={`${t('COMMON.DASHBOARD.STATUS')}: ${report.Status}`}
                                        sx={{
                                            fontSize: '13px',
                                            fontWeight: 'bold',
                                            color: 'var(--text-color)',
                                            backgroundColor:
                                                report.Status === 'Resolved'
                                                    ? 'var(--chip-resolved-bg-color)'
                                                    : 'var(--chip-pending-bg-color)'
                                        }}
                                    />
                                </Box>
                            </CardContent>
                        </Card>
                    ))}
                </Slider>
            </Box>

            <Divider
                sx={{
                    margin: '0px 0 24px 0', // Đẩy divider xuống dưới
                    backgroundColor: 'var(--divider-color)'
                }}
            />

            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'content',
                    alignItems: 'center',
                    padding: '0 24px ',
                    gap: '16px'
                }}
            >
                <Button
                    variant='contained'
                    color='error'
                    sx={{
                        flex: 1,
                        fontSize: '14px',
                        fontWeight: 'bold',
                        height: '36x',
                        color: 'var(--text-button-reject)',
                        backgroundColor: 'var(--bg-button-reject)',
                        borderRadius: '8px',
                        '&:hover': {
                            backgroundColor: 'var(--bg-button-reject-hover)'
                        },
                        textTransform: 'none'
                    }}
                >
                    {t('COMMON.DASHBOARD.REJECT')}
                </Button>
                <Button
                    variant='contained'
                    color='primary'
                    sx={{
                        flex: 1,
                        fontSize: '14px',
                        fontWeight: 'bold',
                        height: '36x',
                        color: 'var(--text-button-accept)',
                        backgroundColor: 'var(--bg-button-accept)',
                        borderRadius: '8px',
                        '&:hover': {
                            backgroundColor: 'var(--bg-button-accept-hover)'
                        },
                        textTransform: 'none'
                    }}
                >
                    {t('COMMON.DASHBOARD.ACCEPT')}
                </Button>
            </Box>
        </Paper>
    )
}
