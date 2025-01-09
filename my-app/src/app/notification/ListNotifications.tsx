import { INotificationsForUser } from '@/models/Notifications'
import React, { useCallback, useState, useEffect } from 'react'
import { Box, Typography, Avatar, Popper, MenuItem, styled } from '@mui/material'
import { Ellipsis, Check } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useChangeNotificationReadMutation, useDeleteNotificationMutation } from '@/services/NotificationsService'
import { useDispatch, useSelector } from 'react-redux'
import { useToast } from '@/hooks/useToast'
import { notificationsSelector, notificationsSlice } from '@/redux/slices/notificationsSlice'
import { iconsForNotification, getTimeDifferenceText } from '@/utils/calcForNotification'

const StyledMenuItem = styled(MenuItem)(() => ({
    padding: '7.5px',
    fontSize: '14px',
    fontWeight: 'bold',
    color: 'var(--text-color)',
    '&:hover': {
        backgroundColor: 'var(--hover-color)',
        borderRadius: '5px'
    }
}))

interface ListNotificationsProps {
    setNotificationId: (notificationId: number | null) => void
}

const NotificationsComponent = React.memo(({ setNotificationId }: ListNotificationsProps) => {
    const { t } = useTranslation('common')

    const dispatch = useDispatch()
    const notifications = useSelector(notificationsSelector)

    const toast = useToast()
    const [changeNotificationRead, resultChange] = useChangeNotificationReadMutation()
    const [deleteNotification, resultDelete] = useDeleteNotificationMutation()
    const [isHovered, setIsHovered] = useState(false)
    const [anchorEl, setAnchorEl] = useState<HTMLDivElement | null>(null)
    const [selectedNotification, setSelectedNotification] = useState<INotificationsForUser | null>(null)

    const handleClick = useCallback(
        (event: React.MouseEvent<HTMLDivElement, MouseEvent>, notification: INotificationsForUser) => {
            setAnchorEl(anchorEl ? null : event.currentTarget)
            setSelectedNotification(notification)
        },
        [anchorEl]
    )

    const handleClickNotification = useCallback(
        async (notification: INotificationsForUser) => {
            if (notification.Type === 'Public') {
                setNotificationId(notification.NotificationId)
                if (!notification.IsRead) {
                    await changeNotificationRead(notification.Id).unwrap()
                }
            }
        },
        [setNotificationId]
    )

    const handleAction = useCallback(
        async (action: string) => {
            if (action === 'mark' && selectedNotification) {
                await changeNotificationRead(selectedNotification.Id).unwrap()
            } else if (action === 'delete' && selectedNotification) {
                await deleteNotification(selectedNotification.Id).unwrap()
            }
            setAnchorEl(null)
            setSelectedNotification(null)
        },
        [deleteNotification, changeNotificationRead, selectedNotification]
    )

    useEffect(() => {
        if (resultDelete.isSuccess) {
            const updatedNotifications = notifications.filter(n => n.Id !== resultDelete.originalArgs)
            dispatch(notificationsSlice.actions.updateNotifications(updatedNotifications))
            toast(t('COMMON.NOTIFICATION.MESSAGE.SUCCESS.DELETE_NOTIFICATION'), 'success')
        } else if (resultDelete.isError) {
            toast(t('COMMON.NOTIFICATION.MESSAGE.ERROR.DELETE_NOTIFICATION'), 'error')
        }
    }, [resultDelete])

    useEffect(() => {
        if (resultChange.isSuccess) {
            const updatedNotifications = notifications.map(n =>
                n.Id === resultChange.originalArgs ? { ...n, IsRead: !n.IsRead } : n
            )
            dispatch(notificationsSlice.actions.updateNotifications(updatedNotifications))
        }
    }, [resultChange.isSuccess])

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (anchorEl && !anchorEl.contains(event.target as Node)) {
                setAnchorEl(null)
                setSelectedNotification(null)
            }
        }

        document.addEventListener('mousedown', handleClickOutside)
        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [anchorEl])

    return notifications.map(notification => (
        <Box
            key={notification.Id}
            sx={{
                width: '100%',
                userSelect: 'none',
                ...(isHovered
                    ? {}
                    : {
                          '&:hover': {
                              backgroundColor: 'var(--hover-color)',
                              borderRadius: '10px'
                          }
                      })
            }}
            className={`relative flex items-center rounded-md cursor-pointer group `}
        >
            <div
                className='flex-1 flex items-center'
                style={{
                    width: '100%',
                    padding: '10px 0.5px 10px 12px'
                }}
                onClick={() => handleClickNotification(notification)}
            >
                {!notification.IsRead && (
                    <div className={`absolute right-2 top-1/2 w-3 h-3 rounded-full bg-[red] -translate-y-1/2`} />
                )}
                <Avatar
                    src={iconsForNotification[notification.Type]}
                    style={{
                        borderRadius: '50%',
                        objectFit: 'cover',
                        width: '58px',
                        height: '58px',
                        border: '1px solid #fdd'
                    }}
                    alt=''
                />
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'left',
                        marginLeft: '10px',
                        width: 'calc(100% - 95px)'
                    }}
                >
                    <Typography
                        variant='h6'
                        sx={{
                            width: '100%',
                            fontWeight: 'bold',
                            fontSize: '14px',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                            color: 'var(--text-color)'
                        }}
                    >
                        {notification.Title}
                    </Typography>
                    <Typography
                        variant='h6'
                        component='div'
                        sx={{
                            marginTop: '-3px',
                            width: '100%',
                            fontSize: '14px',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                            color: 'var(--text-color)'
                        }}
                    >
                        {new DOMParser().parseFromString(notification.Content, 'text/html').body.textContent}
                    </Typography>
                    <Typography
                        variant='h6'
                        sx={{
                            marginTop: '-3px',
                            fontSize: '12px',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap'
                        }}
                        className={notification.IsRead ? 'text-gray-500' : 'text-[var(--text-role-color)] font-bold'}
                    >
                        {getTimeDifferenceText(notification.SentTime, t)}
                    </Typography>
                </Box>
            </div>

            <Box
                className='absolute right-7 group-hover:opacity-100 cursor-pointer'
                sx={{
                    backgroundColor: 'var(--background-color)',
                    padding: '5px',
                    borderRadius: '50%',
                    opacity: anchorEl && selectedNotification?.Id === notification.Id ? 1 : 0,
                    zIndex: 10,
                    border: '1px solid var(--border-color)',
                    '&:hover': {
                        backgroundColor: 'var(--hover-ellipsis)'
                    }
                }}
                onClick={event => handleClick(event, notification)}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                <Ellipsis style={{ color: 'var(--text-color)' }} />
            </Box>

            <Popper
                open={Boolean(anchorEl)}
                anchorEl={anchorEl}
                placement='bottom'
                modifiers={[
                    {
                        name: 'offset',
                        options: {
                            offset: [0, 4]
                        }
                    }
                ]}
                sx={{
                    zIndex: 2000,
                    width: '250px',
                    position: 'relative'
                }}
            >
                <Box
                    sx={{
                        padding: '7.5px',
                        transition: 'none',
                        backgroundImage:
                            'url(data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIwIiBoZWlnaHQ9IjEyMCIgdmlld0JveD0iMCAwIDEyMCAxMjAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMjAiIGhlaWdodD0iMTIwIiBmaWxsPSJ1cmwoI3BhaW50MF9yYWRpYWxfMjc0OV8xNDUxODYpIiBmaWxsLW9wYWNpdHk9IjAuMTIiLz4KPGRlZnM+CjxyYWRpYWxHcmFkaWVudCBpZD0icGFpbnQwX3JhZGlhbF8yNzQ5XzE0NTE4NiIgY3g9IjAiIGN5PSIwIiByPSIxIiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSIgZ3JhZGllbnRUcmFuc2Zvcm09InRyYW5zbGF0ZSgxMjAgMS44MTgxMmUtMDUpIHJvdGF0ZSgtNDUpIHNjYWxlKDEyMy4yNSkiPgo8c3RvcCBzdG9wLWNvbG9yPSIjMDBCOEQ5Ii8+CjxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iIzAwQjhEOSIgc3RvcC1vcGFjaXR5PSIwIi8+CjwvcmFkaWFsR3JhZGllbnQ+CjwvZGVmcz4KPC9zdmc+Cg==), url(data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIwIiBoZWlnaHQ9IjEyMCIgdmlld0JveD0iMCAwIDEyMCAxMjAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMjAiIGhlaWdodD0iMTIwIiBmaWxsPSJ1cmwoI3BhaW50MF9yYWRpYWxfMjc0OV8xNDUxODcpIiBmaWxsLW9wYWNpdHk9IjAuMTIiLz4KPGRlZnM+CjxyYWRpYWxHcmFkaWVudCBpZD0icGFpbnQwX3JhZGlhbF8yNzQ5XzE0NTE4NyIgY3g9IjAiIGN5PSIwIiByPSIxIiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSIgZ3JhZGllbnRUcmFuc2Zvcm09InRyYW5zbGF0ZSgwIDEyMCkgcm90YXRlKDEzNSkgc2NhbGUoMTIzLjI1KSI+CjxzdG9wIHN0b3AtY29sb3I9IiNGRjU2MzAiLz4KPHN0b3Agb2Zmc2V0PSIxIiBzdG9wLWNvbG9yPSIjRkY1NjMwIiBzdG9wLW9wYWNpdHk9IjAiLz4KPC9yYWRpYWxHcmFkaWVudD4KPC9kZWZzPgo8L3N2Zz4K)',
                        backgroundPosition: 'top right, bottom left',
                        backgroundSize: '50%, 50%',
                        backgroundRepeat: 'no-repeat',
                        border: '1px solid var(--border-color)',
                        backdropFilter: 'blur(20px)',
                        backgroundColor: 'var(--background-item)',
                        borderRadius: '10px'
                    }}
                >
                    <StyledMenuItem
                        onClick={() => handleAction('mark')}
                        onMouseDown={e => e.stopPropagation()}
                        sx={{
                            borderRadius: '6px'
                        }}
                    >
                        <Check style={{ color: 'var(--text-color)', width: '21px', margin: '0 10px 0 -2px' }} />
                        {selectedNotification?.IsRead
                            ? t('COMMON.NOTIFICATION.MENU.MARK_AS_UNREAD')
                            : t('COMMON.NOTIFICATION.MENU.MARK_AS_READ')}
                    </StyledMenuItem>
                    <StyledMenuItem
                        onClick={() => handleAction('delete')}
                        onMouseDown={e => e.stopPropagation()}
                        sx={{
                            borderRadius: '6px',
                            color: '#FF5630'
                        }}
                    >
                        <img
                            src='/images/trash.svg'
                            style={{
                                width: '20px',
                                height: '20px',
                                marginRight: '9px'
                            }}
                        />
                        {t('COMMON.NOTIFICATION.MENU.DELETE')}
                    </StyledMenuItem>
                </Box>
            </Popper>
        </Box>
    ))
})

// Đặt displayName
NotificationsComponent.displayName = 'NotificationsComponent'

export default NotificationsComponent
