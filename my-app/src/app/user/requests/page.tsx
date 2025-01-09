'use client'

import { Box } from '@mui/material'

import React, { useState, useEffect } from 'react'
//import { useGetAuthMeQuery } from '@/services/AuthService'
import ErrorReport from './ErrorReport'
import TimeOff from './TimeOff'
import DisplayInfo from './DisplayInfo'
import Chart from './Chart'

const DetailModal = () => {
    const [backgroundImageUrl, setBackgroundImageUrl] = useState('')

    useEffect(() => {
        const randomIndex = Math.floor(Math.random() * 10) + 1
        const newBackgroundImageUrl = `https://api-prod-minimal-v620.pages.dev/assets/images/cover/cover-${randomIndex}.webp`
        setBackgroundImageUrl(newBackgroundImageUrl)
    }, [])

    //const { data: responseData, isFetching: isFetchingGetMe, refetch } = useGetAuthMeQuery()
    //const user = responseData?.Data || null

    return (
        <Box
            sx={{
                width: '100%',
                borderRadius: '10px',
                position: 'relative',
                overflow: 'hidden'
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
                    backgroundColor: 'rgba(0, 0, 0, 0.4)',
                    zIndex: -1
                }}
            />

            <Box
                sx={{
                    width: '100%',
                    borderRadius: '15px',
                    margin: '25px auto'
                }}
            >
                <Box
                    sx={{
                        width: '100%',
                        display: 'grid',
                        gridTemplateColumns: 'calc(70% - 12px) calc(30% - 12px)',
                        gap: '24px',
                        marginTop: '24px'
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
                        <TimeOff />
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
                        <DisplayInfo />
                    </Box>
                </Box>

                <Box
                    sx={{
                        width: '100%',
                        display: 'grid',
                        gridTemplateColumns: 'calc(30% - 12px) calc(70% - 12px)',
                        gap: '24px',
                        marginTop: '24px',
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
                        <Chart />
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
                        <ErrorReport />
                    </Box>
                </Box>
            </Box>
        </Box>
    )
}

export default DetailModal
