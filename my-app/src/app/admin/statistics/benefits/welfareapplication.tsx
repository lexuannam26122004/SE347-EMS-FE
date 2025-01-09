import React, { useRef, useState } from 'react'
import Slider from 'react-slick'
import { Card, CardContent, Typography, Button, Avatar, Box, Paper, Divider, Chip } from '@mui/material'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'
import { Building, ChevronLeft, ChevronRight, IdCard, UserRoundCog } from 'lucide-react'
import { useTranslation } from 'react-i18next'

const leaveRequests = [
    {
        FullName: 'Nguyen Van A',
        Roles: 'Software Engineer',
        CreatedDate: '15 Dec 2024 4:55pm',
        Department: 'IT Department',
        EmployeeId: 'EMP001',
        Reason: 'Personal Reasons',
        Content:
            'Undergoing a minor surgery and need recovery time. Undergoing a minor surgery and need recovery time. Need to take a short break to handle some personal. Need to take a short break to handle some personal. Need to take a short break to handle some personal. Need to take a short break to handle some personal',
        StartDate: '20 Dec 2024',
        EndDate: '22 Dec 2024',
        AvatarPath: '/AvatarPath1.jpg',
        TotalPrice: '200.000 VNĐ'
    },
    {
        FullName: 'Tran Thi B',
        Roles: 'Project Manager',
        CreatedDate: '15 Dec 2024 4:55pm',
        Reason: 'Medical leave',
        Department: 'HR Department',
        EmployeeId: 'EMP002',
        Content: 'Undergoing a minor surgery and need recovery time.',
        StartDate: '18 Dec 2024',
        EndDate: '25 Dec 2024',
        AvatarPath: '/AvatarPath2.jpg',
        TotalPrice: '300.000 VNĐ'
    },
    {
        FullName: 'Le Van C',
        Roles: 'UI/UX Designer',
        CreatedDate: '15 Dec 2024 4:55pm',
        Reason: 'Vacation',
        Department: 'Design Department',
        EmployeeId: 'EMP003',
        Content: 'Taking a vacation trip with family.',
        StartDate: '24 Dec 2024',
        EndDate: '31 Dec 2024',
        AvatarPath: '/Avatar3.jpg',
        TotalPrice: '1.000.000 VNĐ'
    }
]

export default function WalfareApplication() {
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
    const isLastSlide = currentSlide === leaveRequests.length - 1

    const handleNext = () => {
        const nextSlide = currentSlide + 1 >= leaveRequests.length ? leaveRequests.length - 1 : currentSlide + 1
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
                height: '605px',
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
                    {t('COMMON.INSURANCE_BENEFIT.WELARE_APPLICATION')}
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
                {leaveRequests.length} {t('COMMON.DASHBOARD.REQUESTS')}
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
                    {leaveRequests.map((request, index) => (
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
                                        src={request.AvatarPath}
                                        alt={request.FullName}
                                    />
                                    <Box>
                                        <Typography
                                            variant='subtitle1'
                                            sx={{ fontWeight: 'bold', fontSize: '14px', color: 'var(--text-color)' }}
                                        >
                                            {request.FullName}
                                        </Typography>
                                        <Typography
                                            variant='body2'
                                            sx={{ fontSize: '12px', color: 'var(--created-date-color)', mt: '4px' }}
                                        >
                                            {t('COMMON.DASHBOARD.POSTED')} {request.CreatedDate}
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
                                            {request.Department}
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
                                            {request.Roles}
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
                                            {request.EmployeeId}
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
                                    {t('COMMON.DASHBOARD.REASON') + ':'} {request.Reason}
                                </Typography>
                                <Typography
                                    variant='body2'
                                    sx={{ marginBottom: 2, fontSize: '14px', color: 'var(--text-color)' }}
                                >
                                    {request.Content}
                                </Typography>
                                <Box sx={{ display: 'flex', gap: '5px' }}>
                                    <Typography
                                        variant='body2'
                                        sx={{
                                            marginBottom: 2,
                                            fontWeight: 'bold',
                                            fontStyle: 'italic',
                                            fontSize: '14px',
                                            color: 'var(--text-color)'
                                        }}
                                    >
                                        {t('COMMON.INSURANCE_BENEFIT.PRICE_REQUEST')}
                                    </Typography>
                                    <Typography
                                        variant='body2'
                                        sx={{ marginBottom: 2, fontSize: '14px', color: 'red', fontWeight: 'bold' }}
                                    >
                                        {request.TotalPrice}
                                    </Typography>
                                </Box>
                                <Box
                                    sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'space-between'
                                    }}
                                >
                                    <Chip
                                        label={request.StartDate}
                                        sx={{
                                            fontSize: '13px',
                                            fontWeight: 'bold',
                                            color: 'var(--text-color)',
                                            backgroundColor: 'var(--chip-bg-color)'
                                        }}
                                    />
                                    <Chip
                                        label={request.EndDate}
                                        sx={{
                                            fontSize: '13px',
                                            fontWeight: 'bold',
                                            color: 'var(--text-color)',
                                            backgroundColor: 'var(--chip-bg-color)'
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
