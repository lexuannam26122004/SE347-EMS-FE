'use client'
import { Box, Button, Paper, Typography, Skeleton, Menu, MenuItem } from '@mui/material'
import { useTranslation } from 'react-i18next'
import {
    useSearchNotificationsForUserQuery,
    useChangeAllReadMutation,
    useUpdateIsNewMutation
} from '@/services/UserNotificationsService'
import { useState, useCallback, useEffect, ElementType } from 'react'
import ListNotification from './ListNotifications'
import { IFilterNotificationsForUserVModel } from '@/models/Notifications'
import { useSelector } from 'react-redux'
import { notificationsSelector, notificationsSlice } from '@/redux/slices/notificationsSlice'
import { useDispatch } from 'react-redux'
import { DoneAll } from '@mui/icons-material'
import NotificationModal from './NotificationModal'
import { EllipsisIcon } from 'lucide-react'
import NotificationsActiveOutlinedIcon from '@mui/icons-material/NotificationsActiveOutlined'
import { useRouter } from 'next/navigation'
import { countNewNotificationSelector, countNewNotificationSlice } from '@/redux/slices/countNewNotificationSlice'

interface INotificationsPageProps {
    menu?: boolean | undefined
}

const NotificationsPage = ({ menu }: INotificationsPageProps) => {
    const { t } = useTranslation('common')
    const [isRead, setIsRead] = useState(1)
    const [isLoading, setIsLoading] = useState(true)
    const dispatch = useDispatch()
    const [notificationId, setNotificationId] = useState<number | null>(null)
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
    const router = useRouter()
    const [filter, setFilter] = useState<IFilterNotificationsForUserVModel>({})
    const [updateIsNew] = useUpdateIsNewMutation()

    const unreadCount = useSelector(countNewNotificationSelector)

    const { data: dataResponse, refetch, isLoading: isLoadingNotify } = useSearchNotificationsForUserQuery(filter)

    useEffect(() => {
        if (!isLoadingNotify && dataResponse) {
            dispatch(notificationsSlice.actions.updateNotifications(dataResponse?.Data.Records || []))
            setTimeout(() => {
                setIsLoading(false)
            }, 500)
        }
    }, [isLoadingNotify, dataResponse])

    useEffect(() => {
        try {
            updateIsNew().unwrap()
            dispatch(countNewNotificationSlice.actions.resetCountNewNotification())
        } catch (err) {
            console.error('Failed to update notifications:', err)
        }
    }, [unreadCount])

    const fetchNotifications = useCallback(async () => {
        setIsLoading(true)

        try {
            const result = await refetch()

            const records = result?.data?.Data?.Records || []
            dispatch(notificationsSlice.actions.updateNotifications(records))
        } catch (error) {
            console.error('Error in fetchNotifications:', error)
        } finally {
            setTimeout(() => {
                setIsLoading(false)
            }, 500)
        }
    }, [refetch, dispatch])

    const handleOpenNotification = () => {
        router.push('/admin/notification')
        handleCloseEllipsis()
    }

    const notifications = useSelector(notificationsSelector)

    const handleClick = useCallback(
        async (key: number) => {
            if (key === isRead) return // Nếu trạng thái giống nhau, không làm gì

            setIsRead(key) // Cập nhật trạng thái isRead
            setFilter(prevFilter => ({
                ...prevFilter,
                isRead: key === 1 ? undefined : false
            }))
        },
        [isRead, fetchNotifications]
    )

    useEffect(() => {
        fetchNotifications()
    }, [filter])

    const [changeAllRead] = useChangeAllReadMutation()

    const handleClickMarkAll = useCallback(async () => {
        await changeAllRead().unwrap()
        const updatedNotifications = notifications.map(notification => ({
            ...notification,
            IsRead: true
        }))
        dispatch(notificationsSlice.actions.updateNotifications(updatedNotifications))
        handleCloseEllipsis()
    }, [changeAllRead, notifications])

    const totalRecords = notifications.length

    const Container: ElementType = menu !== undefined ? Box : Paper
    const containerProps = {
        ...(menu !== undefined ? {} : { elevation: 0 }),
        sx: {
            width: menu === undefined ? '700px' : '400px',
            borderRadius: '15px',
            backgroundColor: menu === false ? 'var(--background-color)' : 'transparent',
            ...(menu === undefined
                ? { backgroundColor: 'var(--background-item)', boxShadow: 'var(--box-shadow-paper)' }
                : {})
        }
    }

    const handleClickEllipsis = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget)
    }

    const handleCloseEllipsis = () => {
        setAnchorEl(null)
    }

    return (
        <Box
            sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                ...(menu === undefined && { margin: '15px 0' })
            }}
        >
            <Container {...containerProps}>
                <Box
                    display='flex'
                    justifyContent='space-between'
                    alignItems='center'
                    sx={{ ...(menu === undefined ? { padding: '24px' } : { padding: '10px 8px 5px 15px' }) }}
                >
                    <Typography
                        variant='h5'
                        sx={{
                            color: 'var(--text-color)',
                            fontWeight: 'bold',
                            fontSize: '24px'
                        }}
                    >
                        {t('COMMON.NOTIFICATION.TITLE')}
                    </Typography>
                    {menu !== undefined && (
                        <Box
                            onClick={handleClickEllipsis}
                            sx={{
                                cursor: 'pointer',
                                width: '40px',
                                height: '40px',
                                color: 'var(--text-color)',
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                border: '1px solid var(--border-color)',
                                borderRadius: '50%',
                                '&:hover': {
                                    backgroundColor: 'var(--hover-color)',
                                    borderColor: 'var(--hover-color)'
                                }
                            }}
                        >
                            <EllipsisIcon />
                        </Box>
                    )}

                    <Menu
                        anchorEl={anchorEl}
                        open={Boolean(anchorEl)}
                        onClose={handleCloseEllipsis}
                        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                        slotProps={{
                            paper: {
                                elevation: 0,
                                sx: {
                                    transition: 'none',
                                    backgroundImage:
                                        'url(data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIwIiBoZWlnaHQ9IjEyMCIgdmlld0JveD0iMCAwIDEyMCAxMjAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMjAiIGhlaWdodD0iMTIwIiBmaWxsPSJ1cmwoI3BhaW50MF9yYWRpYWxfMjc0OV8xNDUxODYpIiBmaWxsLW9wYWNpdHk9IjAuMTIiLz4KPGRlZnM+CjxyYWRpYWxHcmFkaWVudCBpZD0icGFpbnQwX3JhZGlhbF8yNzQ5XzE0NTE4NiIgY3g9IjAiIGN5PSIwIiByPSIxIiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSIgZ3JhZGllbnRUcmFuc2Zvcm09InRyYW5zbGF0ZSgxMjAgMS44MTgxMmUtMDUpIHJvdGF0ZSgtNDUpIHNjYWxlKDEyMy4yNSkiPgo8c3RvcCBzdG9wLWNvbG9yPSIjMDBCOEQ5Ii8+CjxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iIzAwQjhEOSIgc3RvcC1vcGFjaXR5PSIwIi8+CjwvcmFkaWFsR3JhZGllbnQ+CjwvZGVmcz4KPC9zdmc+Cg==), url(data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIwIiBoZWlnaHQ9IjEyMCIgdmlld0JveD0iMCAwIDEyMCAxMjAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMjAiIGhlaWdodD0iMTIwIiBmaWxsPSJ1cmwoI3BhaW50MF9yYWRpYWxfMjc0OV8xNDUxODcpIiBmaWxsLW9wYWNpdHk9IjAuMTIiLz4KPGRlZnM+CjxyYWRpYWxHcmFkaWVudCBpZD0icGFpbnQwX3JhZGlhbF8yNzQ5XzE0NTE4NyIgY3g9IjAiIGN5PSIwIiByPSIxIiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSIgZ3JhZGllbnRUcmFuc2Zvcm09InRyYW5zbGF0ZSgwIDEyMCkgcm90YXRlKDEzNSkgc2NhbGUoMTIzLjI1KSI+CjxzdG9wIHN0b3AtY29sb3I9IiNGRjU2MzAiLz4KPHN0b3Agb2Zmc2V0PSIxIiBzdG9wLWNvbG9yPSIjRkY1NjMwIiBzdG9wLW9wYWNpdHk9IjAiLz4KPC9yYWRpYWxHcmFkaWVudD4KPC9kZWZzPgo8L3N2Zz4K)',
                                    backgroundPosition: 'top right, bottom left',
                                    backgroundSize: '50%, 50%',
                                    backgroundRepeat: 'no-repeat',
                                    backdropFilter: 'blur(20px)',
                                    border: '1px solid var(--border-color)',
                                    backgroundColor: 'var(--background-item)',
                                    borderRadius: '10px',
                                    mt: 0.5,
                                    padding: '0 8px'
                                }
                            }
                        }}
                    >
                        <MenuItem
                            onClick={() => handleClickMarkAll()}
                            sx={{
                                borderRadius: '6px',
                                color: 'var(--text-color)',
                                '&:hover': {
                                    backgroundColor: 'var(--hover-color)'
                                }
                            }}
                        >
                            <DoneAll sx={{ mr: 2 }} />
                            {t('COMMON.NOTIFICATION.ELLIPSIS.MARK_ALL_AS_READ')}
                        </MenuItem>
                        <MenuItem
                            onClick={handleOpenNotification}
                            sx={{
                                borderRadius: '6px',
                                color: 'var(--text-color)',
                                '&:hover': {
                                    backgroundColor: 'var(--hover-color)'
                                }
                            }}
                        >
                            <NotificationsActiveOutlinedIcon sx={{ mr: 2 }} />
                            {t('COMMON.NOTIFICATION.ELLIPSIS.OPEN_NOTIFICATION')}
                        </MenuItem>
                    </Menu>
                </Box>
                <Box
                    sx={{
                        display: 'flex',
                        padding: '0 24px 24px',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                    }}
                >
                    <Box>
                        <Button
                            variant='outlined'
                            key={1}
                            onClick={() => handleClick(1)}
                            sx={{
                                marginRight: '15px',
                                backgroundColor: isRead === 1 ? 'var(--selected-color)' : 'transparent',
                                color: 'var(--text-color)',
                                fontSize: '15px',
                                fontWeight: 'bold',
                                padding: '5px 12px',
                                borderRadius: '30px',
                                borderColor: isRead === 1 ? 'var(--selected-color)' : 'var(--border-color)',
                                textTransform: 'none',
                                '&:hover': {
                                    backgroundColor: 'var(--hover-color)',
                                    borderColor: 'var(--hover-color)'
                                }
                            }}
                        >
                            {t('COMMON.NOTIFICATION.BUTTON.ALL')}
                        </Button>
                        <Button
                            variant='outlined'
                            key={2}
                            onClick={() => handleClick(2)}
                            sx={{
                                backgroundColor: isRead === 2 ? 'var(--selected-color)' : 'transparent',
                                color: 'var(--text-color)',
                                fontSize: '15px',
                                fontWeight: 'bold',
                                padding: '5px 12px',
                                borderRadius: '30px',
                                borderColor: isRead === 2 ? 'var(--selected-color)' : 'var(--border-color)',
                                textTransform: 'none',
                                '&:hover': {
                                    backgroundColor: 'var(--hover-color)',
                                    borderColor: 'var(--hover-color)'
                                }
                            }}
                        >
                            {t('COMMON.NOTIFICATION.BUTTON.UNREAD')}
                        </Button>
                    </Box>
                    {menu === undefined && (
                        <Box>
                            <Button
                                variant='outlined'
                                onClick={() => handleClickMarkAll()}
                                sx={{
                                    backgroundColor: 'transparent',
                                    color: 'var(--text-color)',
                                    fontSize: '15px',
                                    fontWeight: 'bold',
                                    padding: '5px 12px',
                                    borderRadius: '30px',
                                    borderColor: 'var(--border-color)',
                                    textTransform: 'none',
                                    '&:hover': {
                                        backgroundColor: 'var(--hover-color)',
                                        borderColor: 'var(--hover-color)'
                                    }
                                }}
                            >
                                {t('COMMON.NOTIFICATION.BUTTON.MARK_ALL_AS_READ')}
                            </Button>
                        </Box>
                    )}
                </Box>

                {isLoading ? (
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            width: '100%',
                            padding: '17px 24px'
                        }}
                    >
                        {Array.from({ length: 7 }).map((_, index) => (
                            <Box
                                key={index}
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    width: '100%',
                                    marginBottom: '15px'
                                }}
                            >
                                <Skeleton
                                    variant='circular'
                                    width={58}
                                    height={58}
                                    sx={{
                                        flexShrink: 0,
                                        bgcolor: 'var(--skeleton-color)'
                                    }}
                                />
                                <Skeleton
                                    variant='text'
                                    width='100%'
                                    height={30}
                                    sx={{
                                        marginLeft: '15px',
                                        marginTop: '0',
                                        borderRadius: '13px',
                                        bgcolor: 'var(--skeleton-color)'
                                    }}
                                />
                            </Box>
                        ))}
                    </Box>
                ) : totalRecords === 0 || totalRecords === undefined ? (
                    <Box
                        sx={{
                            display: 'flex',
                            padding: '15px',
                            ...(menu === undefined && { marginTop: '20px' }),
                            flexDirection: 'column',
                            alignItems: 'center'
                        }}
                    >
                        <svg
                            viewBox='0 0 112 112'
                            width='115'
                            height='115'
                            className='xfx01vb x1lliihq x1tzjh5l x1k90msu x2h7rmj x1qfuztq'
                        >
                            <rect
                                width='18.98'
                                height='18.98'
                                x='34.96'
                                y='82'
                                fill='#1876f2'
                                rx='9.49'
                                transform='rotate(-15 44.445 91.471)'
                            ></rect>
                            <circle cx='43.01' cy='26.27' r='6.85' fill='#64676b'></circle>
                            <path
                                fill='#a4a7ab'
                                d='M75.28 43.44a26.72 26.72 0 1 0-51.62 13.83L30 81l51.62-13.87z'
                            ></path>
                            <path fill='#a4a7ab' d='M90.78 75.64 26.33 92.9l3.22-13.63 51.62-13.83 9.61 10.2z'></path>
                            <rect
                                width='66.91'
                                height='8.88'
                                x='25.35'
                                y='80.75'
                                fill='#a4a7ab'
                                rx='4.44'
                                transform='rotate(-15 58.793 85.207)'
                            ></rect>
                        </svg>
                        <Typography
                            variant='h6'
                            sx={{ fontWeight: 'bold', fontSize: '22px', color: 'var(--text-color)' }}
                        >
                            {t('COMMON.NOTIFICATION.MESSAGES.NO_NOTIFICATION')}
                        </Typography>
                    </Box>
                ) : (
                    <Box
                        sx={{
                            ...(menu === undefined ? { padding: '0px 12px 12px' } : { padding: '0px 5.5px 12px 12px' })
                        }}
                    >
                        <ListNotification setNotificationId={setNotificationId} />
                    </Box>
                )}
            </Container>
            {notificationId && (
                <NotificationModal
                    notificationId={notificationId}
                    open={!!notificationId}
                    handleClose={() => setNotificationId(null)}
                />
            )}
        </Box>
    )
}

export default NotificationsPage
