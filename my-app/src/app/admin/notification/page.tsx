'use client'
import { Box, Button, Paper, Typography, Skeleton, Menu, MenuItem } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { SearchForUser, useChangeAllReadMutation, useUpdateIsNewMutation } from '@/services/NotificationsService'
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
import { userId } from '@/utils/globalVariables'

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
    const [updateIsNew] = useUpdateIsNewMutation()

    const unreadCount = useSelector(countNewNotificationSelector)

    useEffect(() => {
        try {
            updateIsNew(userId).unwrap()
            dispatch(countNewNotificationSlice.actions.resetCountNewNotification())
        } catch (err) {
            console.error('Failed to update notifications:', err)
        }
    }, [unreadCount])

    const fetchNotifications = async (filter: IFilterNotificationsForUserVModel) => {
        setIsLoading(true)
        try {
            const dataResponse = await SearchForUser(filter)
            dispatch(notificationsSlice.actions.updateNotifications(dataResponse?.Data.Records || []))
        } catch (error) {
            console.error('Failed to fetch notifications:', error)
        } finally {
            setTimeout(() => {
                setIsLoading(false)
            }, 500)
        }
    }

    const handleOpenNotification = () => {
        router.push('/admin/notification')
        handleCloseEllipsis()
    }

    const notifications = useSelector(notificationsSelector)

    const handleClick = useCallback((key: number) => {
        setIsRead(key)
    }, [])

    const [changeAllRead] = useChangeAllReadMutation()

    const handleClickMarkAll = useCallback(
        async (userId: string) => {
            await changeAllRead(userId).unwrap()
            const updatedNotifications = notifications.map(notification => ({
                ...notification,
                IsRead: true
            }))
            dispatch(notificationsSlice.actions.updateNotifications(updatedNotifications))
            handleCloseEllipsis()
        },
        [changeAllRead, notifications]
    )

    useEffect(() => {
        const initialFilter: IFilterNotificationsForUserVModel = {
            userId: userId,
            isRead: isRead === 1 ? undefined : false
        }
        fetchNotifications(initialFilter)
    }, [isRead])

    const totalRecords = notifications.length

    const Container: ElementType = menu !== undefined ? Box : Paper
    const containerProps = {
        ...(menu !== undefined ? {} : { elevation: 0 }),
        sx: {
            width: menu === undefined ? '700px' : '400px',
            borderRadius: '12px',
            backgroundColor: menu === false ? 'var(--background-color)' : 'transparent',
            ...(menu === undefined ? { border: '1px solid var(--border-color)' } : {})
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
                    sx={{ ...(menu === undefined ? { padding: '15px' } : { padding: '10px 8px 5px 15px' }) }}
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
                                    mt: 0.5,
                                    border: '1px solid var(--border-color)',
                                    borderRadius: '6px',
                                    padding: '0 8px'
                                }
                            }
                        }}
                    >
                        <MenuItem
                            onClick={() => handleClickMarkAll(userId)}
                            sx={{
                                borderRadius: '4px',
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
                                borderRadius: '4px',
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
                        padding: '0 15px 15px',
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
                                onClick={() => handleClickMarkAll(userId)}
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
                            padding: '7.5px 15px'
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
                            ...(menu === undefined
                                ? { padding: '0px 7.5px 7.5px' }
                                : { padding: '0px 0.5px 7.5px 7.5px' })
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
