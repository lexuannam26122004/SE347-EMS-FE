import React from 'react'
import { Box, Paper, Modal, Typography, Avatar, Divider, Skeleton } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { useGetNotificationByIdQuery } from '@/services/NotificationsService'
import { INotificationGetById } from '@/models/Notifications'
import { X } from 'lucide-react'
import { useEffect, useState } from 'react'
import DOMPurify from 'dompurify'
import ImageGrid from './ImageGrid'
import { getTimeDifferenceText } from '@/utils/calcForNotification'

interface NotificationModalProps {
    notificationId: number
    open: boolean
    handleClose: () => void
}

function NotificationModal({ notificationId, open, handleClose }: NotificationModalProps) {
    const { t } = useTranslation()
    const { data: responseData, isFetching, refetch } = useGetNotificationByIdQuery(notificationId)
    const notificationData = responseData?.Data as INotificationGetById | undefined
    const [showError, setShowError] = useState(false)
    const [showSkeleton, setShowSkeleton] = useState(true)
    useEffect(() => {
        if (open) {
            setShowError(false)
            setShowSkeleton(true) // true
            refetch()
        }
    }, [open, refetch])

    useEffect(() => {
        if (!isFetching) {
            setShowError(!notificationData)
            const timer = setTimeout(() => setShowSkeleton(false), 200)
            return () => clearTimeout(timer)
        }
    }, [isFetching, notificationData])

    return (
        <Modal open={open} sx={{ padding: 10 }} onClose={handleClose}>
            <Paper
                sx={{
                    width: '50vw',
                    maxWidth: '1000px',
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    backgroundColor: 'var(--background-color)',
                    border: '1px solid var(--border-color)',
                    borderRadius: '10px',
                    transform: 'translate(-50%, -50%)'
                }}
            >
                <Box
                    sx={{
                        paddingBlock: 1.8,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        zIndex: '1',
                        position: 'relative'
                    }}
                >
                    {showSkeleton ? (
                        <Skeleton
                            variant='text'
                            width='70%'
                            height={30}
                            sx={{
                                borderRadius: '13px',
                                bgcolor: 'var(--skeleton-color)'
                            }}
                        />
                    ) : showError ? (
                        <Typography
                            variant='h6'
                            sx={{
                                fontWeight: 'Bold',
                                fontSize: '20px',
                                textAlign: 'center',
                                margin: 'auto',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap',
                                color: 'var(--text-color)'
                            }}
                        >
                            {t('COMMON.NOTIFICATION.GET_NOTIFICATION_BY_ID.NOT_FOUND')}
                        </Typography>
                    ) : (
                        <Typography
                            variant='h6'
                            sx={{
                                fontWeight: 'Bold',
                                fontSize: '20px',
                                textAlign: 'center',
                                margin: 'auto',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap',
                                color: 'var(--text-color)'
                            }}
                        >
                            {t('COMMON.NOTIFICATION.GET_NOTIFICATION_BY_ID.TITLE') + notificationData?.FullName}
                        </Typography>
                    )}
                    <Box
                        className='absolute right-4 cursor-pointer'
                        sx={{
                            backgroundColor: 'var(--background-color)',
                            padding: '5px',
                            borderRadius: '50%',
                            border: '1px solid var(--border-color)',
                            '&:hover': {
                                backgroundColor: 'var(--hover-color)',
                                borderColor: 'var(--hover-color)'
                            }
                        }}
                        onClick={handleClose}
                    >
                        <X style={{ color: 'var(--text-color)' }} />
                    </Box>
                </Box>
                <Divider sx={{ zIndex: '1', borderColor: 'var(--border-color)' }} />
                <Box
                    sx={{
                        height: '85vh',
                        width: '100%',
                        flexGrow: 1,
                        padding: '20px 3px 20px 10px',
                        borderWidth: '0px',
                        borderStyle: 'solid',
                        borderColor: 'divider',
                        display: 'flex',
                        flexDirection: 'column',
                        scrollbarGutter: 'stable',
                        justifyContent: 'space-between',
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
                    {showSkeleton ? (
                        <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%', gap: 3, height: '100%' }}>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <Skeleton
                                    variant='circular'
                                    width='42px'
                                    height='42px'
                                    sx={{ bgcolor: 'var(--skeleton-color)', marginRight: '10px' }}
                                />
                                <Box>
                                    <Skeleton
                                        variant='text'
                                        width='200px'
                                        height='30px'
                                        sx={{ borderRadius: '13px', bgcolor: 'var(--skeleton-color)' }}
                                    />
                                    <Skeleton
                                        variant='text'
                                        width='130px'
                                        height='30px'
                                        sx={{ borderRadius: '13px', bgcolor: 'var(--skeleton-color)', mt: '-10px' }}
                                    />
                                </Box>
                            </Box>
                            <Skeleton
                                variant='rectangular'
                                height={150}
                                width='80%'
                                sx={{ borderRadius: '16px', bgcolor: 'var(--skeleton-color)' }}
                            />
                            <Skeleton
                                variant='rectangular'
                                height={200}
                                width='70%'
                                sx={{ borderRadius: '16px', bgcolor: 'var(--skeleton-color)' }}
                            />
                            <Skeleton
                                variant='rectangular'
                                height={100}
                                width='90%'
                                sx={{ borderRadius: '16px', bgcolor: 'var(--skeleton-color)' }}
                            />
                        </Box>
                    ) : showError ? (
                        <img src='/images/Error.gif' alt='' />
                    ) : (
                        <Box width='100%' height='100%' display='flex' flexDirection='column'>
                            <Box sx={{ display: 'flex', alignContent: 'center' }}>
                                <Avatar
                                    src={notificationData?.AvatarPath}
                                    alt=''
                                    style={{
                                        width: '45px',
                                        height: '45px',
                                        borderRadius: '50%',
                                        objectFit: 'cover',
                                        marginRight: '12px'
                                    }}
                                />
                                <Box>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: '1.5px' }}>
                                        <Typography
                                            variant='h6'
                                            sx={{
                                                fontWeight: 'Bold',
                                                fontSize: '15px',
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis',
                                                whiteSpace: 'nowrap',
                                                color: 'var(--text-color)'
                                            }}
                                        >
                                            {notificationData?.FullName}
                                        </Typography>
                                        <Typography
                                            sx={{
                                                backgroundColor: '#ffe7e7',
                                                color: '#a60b0a',
                                                padding: '3px 9px',
                                                borderRadius: '13px',
                                                fontSize: '13px',
                                                fontWeight: 'medium',
                                                height: 'fit-content'
                                            }}
                                        >
                                            {notificationData?.Role}
                                        </Typography>
                                    </Box>
                                    <Typography
                                        variant='h6'
                                        sx={{ color: 'var(--text-role-color)', fontSize: '12px', mt: '-2px' }}
                                        className='text-gray-500'
                                    >
                                        {getTimeDifferenceText(notificationData?.SentTime || '', t)}
                                    </Typography>
                                </Box>
                            </Box>

                            <Typography
                                variant='h6'
                                sx={{ fontSize: '15px', mt: '10px', fontWeight: 'Bold', color: 'var(--text-color)' }}
                            >
                                {notificationData?.Title}
                            </Typography>

                            <Typography
                                variant='h6'
                                component='div'
                                sx={{
                                    fontSize: '15px',
                                    mt: '10px',
                                    color: 'var(--text-color)',
                                    '& p': { marginBottom: '0.5rem' },
                                    '& ul': {
                                        paddingLeft: '1.5rem',
                                        marginBottom: '0.5rem'
                                    },
                                    '& li': { marginBottom: '0.3rem' },
                                    '& strong': { fontWeight: 600 },
                                    '& br': { display: 'block', marginBottom: '0.5rem' },
                                    '& a': {
                                        color: 'var(--text-color)',
                                        textDecoration: 'none',
                                        '&:hover': {
                                            textDecoration: 'underline'
                                        }
                                    }
                                }}
                                dangerouslySetInnerHTML={{
                                    __html: DOMPurify.sanitize(notificationData?.Content || '')
                                }}
                            />

                            {notificationData?.ListFile && notificationData.ListFile.length > 0 && (
                                <Box>
                                    {/* <Divider
                                        sx={{
                                            borderColor: 'var(--border-color)',
                                            mt: '10px',
                                            marginLeft: -2,
                                            marginRight: -2
                                        }}
                                    /> */}
                                    <ImageGrid files={notificationData.ListFile} />
                                </Box>
                            )}
                        </Box>
                    )}
                </Box>
            </Paper>
        </Modal>
    )
}

export default NotificationModal
