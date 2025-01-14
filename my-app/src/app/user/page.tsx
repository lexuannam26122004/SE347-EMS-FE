'use client'

import { Box, Avatar } from '@mui/material'

import React, { useState, useEffect } from 'react'
import { useGetAuthMeQuery } from '@/services/AuthService'
import Employee from './employee/Employee'
import Contract from './employee/Contract'
import JobHistory from './employee/JobHistory'
import Department from './employee/Department'
import Career from './employee/Career'

const DetailModal = () => {
    const [backgroundImageUrl, setBackgroundImageUrl] = useState('')

    useEffect(() => {
        const randomIndex = Math.floor(Math.random() * 10) + 1
        const newBackgroundImageUrl = `https://api-prod-minimal-v620.pages.dev/assets/images/cover/cover-${randomIndex}.webp`
        setBackgroundImageUrl(newBackgroundImageUrl)
    }, [])

    const { data: responseData } = useGetAuthMeQuery()
    const user = responseData?.Data || null

    return (
        <Box
            sx={{
                width: '100%',
                borderRadius: '10px',
                position: 'relative',
                overflow: 'hidden',
                '&::-webkit-scrollbar': {
                    display: 'none' // Ẩn thanh cuộn
                }
            }}
        >
            <Box
                sx={{
                    position: 'absolute',
                    width: '100%',
                    height: '100%',
                    backgroundImage: `url(${backgroundImageUrl})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    filter: 'blur(20px)',
                    zIndex: -1
                }}
            />

            <Box
                sx={{
                    position: 'absolute',
                    width: '100%',
                    height: '100%',
                    zIndex: -1
                }}
            />

            <Box
                sx={{
                    width: '100%',
                    borderRadius: '15px'
                }}
            >
                <Box
                    sx={{
                        width: '100%',
                        borderRadius: '15px',
                        backgroundColor: 'var(--background-item)',
                        overflow: 'auto',
                        '&::-webkit-scrollbar-corner': {
                            borderRadius: '10px'
                        },
                        boxShadow: 'var(--box-shadow-paper)'
                    }}
                >
                    <Box
                        sx={{
                            width: '100%',
                            height: '250px',
                            backgroundImage: `url(${backgroundImageUrl})`,
                            backgroundPosition: 'center',
                            backgroundSize: 'cover',
                            position: 'relative'
                        }}
                    >
                        <Box
                            sx={{
                                position: 'absolute',
                                bottom: '-80px',
                                left: '150px',
                                width: '200px',
                                height: '200px',
                                border: '5px solid #fff',
                                borderRadius: '50%',
                                overflow: 'hidden',
                                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
                            }}
                        >
                            <Avatar
                                src={
                                    'https://localhost:44381/' + user?.AvatarPath ||
                                    'https://localhost:44381/avatars/aa1678f0-75b0-48d2-ae98-50871178e9bd.jfif'
                                }
                                alt='Avatar'
                                sx={{
                                    width: '100%',
                                    height: '100%',
                                    objectFit: 'cover'
                                }}
                            />
                        </Box>
                    </Box>

                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            padding: '130px 30px 20px',
                            marginTop: '-120px'
                        }}
                    >
                        <Box
                            sx={{
                                marginLeft: '350px'
                            }}
                        >
                            <h1
                                style={{
                                    fontSize: '30px',
                                    marginBottom: '5px',
                                    fontWeight: 'bold',
                                    color: 'var(--text-color)'
                                }}
                            >
                                {user?.FullName || 'N/A'}
                            </h1>
                            <p
                                style={{
                                    fontSize: '16px',
                                    color: 'var(--text-color)'
                                }}
                            >
                                {user?.Roles?.join(', ') || 'N/A'}
                            </p>
                        </Box>
                    </Box>
                </Box>

                <Box
                    sx={{
                        padding: '24px',
                        display: 'grid',
                        gap: '24px'
                    }}
                >
                    <Employee infoMe={user || ''} />

                    <Contract infoMe={user || ''} />

                    <Department />

                    <Box
                        sx={{
                            width: '100%',
                            display: 'grid',
                            gridTemplateColumns: 'calc(50% - 12px) calc(50% - 12px)',
                            gap: '24px',
                            marginBottom: '24px'
                        }}
                    >
                        <Box
                            sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'space-between',
                                height: '100%',
                                gap: '24px'
                            }}
                        >
                            <JobHistory />
                        </Box>

                        <Box
                            sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'space-between',
                                height: '100%',
                                gap: '24px'
                            }}
                        >
                            <Career />
                        </Box>
                    </Box>
                </Box>
            </Box>
        </Box>
    )
}

export default DetailModal
