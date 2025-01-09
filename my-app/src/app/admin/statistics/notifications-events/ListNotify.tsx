import { Avatar, Box, Paper, Tooltip, Typography } from '@mui/material'
import { EllipsisIcon } from 'lucide-react'
import VisibilityIcon from '@mui/icons-material/Visibility'
import PeopleRoundedIcon from '@mui/icons-material/PeopleRounded'
import { INotificationGetById } from '@/models/Notifications'
import { useTranslation } from 'react-i18next'
import formatDateToTime from '@/utils/formatDateToTime'
import { useEffect, useState, useCallback } from 'react'
import Popper from '@mui/material/Popper'
import MenuItem from '@mui/material/MenuItem'
import { styled } from '@mui/material/styles'
import VisibilityRoundedIcon from '@mui/icons-material/VisibilityRounded'
import EditRoundedIcon from '@mui/icons-material/EditRounded'

interface Props {
    notifications: INotificationGetById[]
    totalRecords: number
}

const covers = [
    'https://api-prod-minimal-v620.pages.dev/assets/images/cover/cover-1.webp',
    'https://api-prod-minimal-v620.pages.dev/assets/images/cover/cover-2.webp',
    'https://api-prod-minimal-v620.pages.dev/assets/images/cover/cover-3.webp',
    'https://api-prod-minimal-v620.pages.dev/assets/images/cover/cover-4.webp',
    'https://api-prod-minimal-v620.pages.dev/assets/images/cover/cover-5.webp',
    'https://api-prod-minimal-v620.pages.dev/assets/images/cover/cover-6.webp',
    'https://api-prod-minimal-v620.pages.dev/assets/images/cover/cover-7.webp',
    'https://api-prod-minimal-v620.pages.dev/assets/images/cover/cover-8.webp',
    'https://api-prod-minimal-v620.pages.dev/assets/images/cover/cover-9.webp',
    'https://api-prod-minimal-v620.pages.dev/assets/images/cover/cover-10.webp',
    'https://api-prod-minimal-v620.pages.dev/assets/images/cover/cover-11.webp',
    'https://api-prod-minimal-v620.pages.dev/assets/images/cover/cover-12.webp',
    'https://api-prod-minimal-v620.pages.dev/assets/images/cover/cover-13.webp',
    'https://api-prod-minimal-v620.pages.dev/assets/images/cover/cover-14.webp',
    'https://api-prod-minimal-v620.pages.dev/assets/images/cover/cover-15.webp',
    'https://api-prod-minimal-v620.pages.dev/assets/images/cover/cover-16.webp',
    'https://api-prod-minimal-v620.pages.dev/assets/images/cover/cover-17.webp',
    'https://api-prod-minimal-v620.pages.dev/assets/images/cover/cover-18.webp',
    'https://api-prod-minimal-v620.pages.dev/assets/images/cover/cover-19.webp'
]

const avatars = [
    'https://api-prod-minimal-v620.pages.dev/assets/images/avatar/avatar-1.webp',
    'https://api-prod-minimal-v620.pages.dev/assets/images/avatar/avatar-2.webp',
    'https://api-prod-minimal-v620.pages.dev/assets/images/avatar/avatar-3.webp',
    'https://api-prod-minimal-v620.pages.dev/assets/images/avatar/avatar-4.webp',
    'https://api-prod-minimal-v620.pages.dev/assets/images/avatar/avatar-5.webp',
    'https://api-prod-minimal-v620.pages.dev/assets/images/avatar/avatar-6.webp',
    'https://api-prod-minimal-v620.pages.dev/assets/images/avatar/avatar-7.webp',
    'https://api-prod-minimal-v620.pages.dev/assets/images/avatar/avatar-8.webp',
    'https://api-prod-minimal-v620.pages.dev/assets/images/avatar/avatar-9.webp',
    'https://api-prod-minimal-v620.pages.dev/assets/images/avatar/avatar-10.webp',
    'https://api-prod-minimal-v620.pages.dev/assets/images/avatar/avatar-11.webp',
    'https://api-prod-minimal-v620.pages.dev/assets/images/avatar/avatar-12.webp',
    'https://api-prod-minimal-v620.pages.dev/assets/images/avatar/avatar-13.webp',
    'https://api-prod-minimal-v620.pages.dev/assets/images/avatar/avatar-14.webp',
    'https://api-prod-minimal-v620.pages.dev/assets/images/avatar/avatar-15.webp',
    'https://api-prod-minimal-v620.pages.dev/assets/images/avatar/avatar-16.webp',
    'https://api-prod-minimal-v620.pages.dev/assets/images/avatar/avatar-17.webp',
    'https://api-prod-minimal-v620.pages.dev/assets/images/avatar/avatar-18.webp',
    'https://api-prod-minimal-v620.pages.dev/assets/images/avatar/avatar-19.webp'
]

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

function Page({ notifications }: Props) {
    const { t } = useTranslation('common')

    const [anchorEl, setAnchorEl] = useState<HTMLDivElement | null>(null)
    const handleClick = useCallback(
        (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
            setAnchorEl(anchorEl ? null : event.currentTarget)
            // setSelectedNotification(notification)
        },
        [anchorEl]
    )

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (anchorEl && !anchorEl.contains(event.target as Node)) {
                setAnchorEl(null)
                // setSelectedNotification(null)
            }
        }

        document.addEventListener('mousedown', handleClickOutside)
        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [anchorEl])

    // const [open, setOpen] = useState(false)

    // const handleChangeLanguage = (language: string) => {
    //     setOpen(false)
    // }

    // const handleListKeyDown = (event: React.KeyboardEvent) => {
    //     if (event.key === 'Tab' || event.key === 'Escape') {
    //         event.preventDefault()
    //         setOpen(false)
    //     }
    // }

    // const handleToggle = () => {
    //     setOpen(prev => !prev)
    // }

    const chunkedNotifications = notifications?.reduce<INotificationGetById[][]>((result, _, index) => {
        if (index % 2 === 0) {
            result.push(notifications?.slice(index, index + 2))
        }
        return result
    }, [])

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                width: '100%',
                padding: '0 24px'
            }}
        >
            {chunkedNotifications?.map((chunk, chunkIndex) => (
                <Box
                    key={chunkIndex}
                    sx={{
                        width: '100%',
                        height: '100%',
                        display: 'flex',
                        mt: chunkIndex === 0 ? '0' : '24px',
                        alignItems: 'center',
                        gap: '24px'
                    }}
                >
                    <Paper
                        sx={{
                            display: 'flex',
                            height: '100%',
                            borderRadius: '15px',
                            overflow: 'hidden',
                            boxShadow: 'var(--box-shadow-paper)',
                            width: 'calc(100% / 2 - 12px)',
                            backgroundColor: 'var(--background-item)',
                            justifyContent: 'space-between'
                        }}
                    >
                        <Box
                            sx={{
                                display: 'flex',
                                width: 'calc(100% - 185px)',
                                flexDirection: 'column',
                                height: '214px',
                                padding: '24px 24px 16px'
                            }}
                        >
                            <Box
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    mb: '20px',
                                    justifyContent: 'space-between'
                                }}
                            >
                                <Typography
                                    variant='h6'
                                    sx={{
                                        padding: '2px 6px',
                                        backgroundColor: '#f5f5f5',
                                        borderRadius: '6px',
                                        fontSize: '14px',
                                        fontWeight: 'bold'
                                    }}
                                >
                                    {chunk[0].Type}
                                </Typography>

                                <Typography
                                    sx={{
                                        color: 'var(--created-date-color)',
                                        fontSize: '14px'
                                    }}
                                >
                                    {formatDateToTime(chunk[0].SentTime)}
                                </Typography>
                            </Box>

                            <Box>
                                <Typography
                                    variant='h5'
                                    sx={{
                                        color: 'var(--text-color)',
                                        fontSize: '16px',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        fontWeight: 'bold',
                                        width: '100%',
                                        cursor: 'pointer',
                                        whiteSpace: 'nowrap'
                                    }}
                                >
                                    {chunk[0].Title}
                                </Typography>

                                <Typography
                                    sx={{
                                        color: 'var(--text-label-color)',
                                        fontSize: '14px',
                                        display: '-webkit-box',
                                        overflow: 'hidden',
                                        WebkitBoxOrient: 'vertical',
                                        WebkitLineClamp: 2,
                                        textOverflow: 'ellipsis',
                                        mt: '10px'
                                    }}
                                >
                                    {chunk[0].Content}
                                </Typography>
                            </Box>

                            <Box
                                sx={{
                                    marginTop: 'auto',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between'
                                }}
                            >
                                <Box
                                    sx={{
                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        width: '38px',
                                        height: '38px',
                                        cursor: 'pointer',
                                        '&:hover': {
                                            backgroundColor: 'var(--hover-color)'
                                        },
                                        borderRadius: '50%'
                                    }}
                                    onClick={event => handleClick(event)}
                                >
                                    <EllipsisIcon
                                        style={{
                                            color: 'var(--text-color)',
                                            width: '20px',
                                            height: '20px'
                                        }}
                                    />
                                </Box>

                                <Box
                                    sx={{
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        display: 'flex',
                                        gap: '15px'
                                    }}
                                >
                                    <Box
                                        sx={{
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            display: 'flex',
                                            gap: '5px'
                                        }}
                                    >
                                        <Tooltip title={t('COMMON.STAT_NOTIFY.NUMBER_OF_RECIPIENTS')}>
                                            <PeopleRoundedIcon
                                                sx={{
                                                    color: 'var(--created-date-color)',
                                                    width: '18px',
                                                    height: '18px'
                                                }}
                                            />
                                        </Tooltip>
                                        <Typography
                                            sx={{
                                                color: 'var(--created-date-color)',
                                                fontSize: '14px'
                                            }}
                                        >
                                            {chunk[0].ReceivedCount}
                                        </Typography>
                                    </Box>
                                    <Box
                                        sx={{
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            display: 'flex',
                                            gap: '5px'
                                        }}
                                    >
                                        <Tooltip title={t('COMMON.STAT_NOTIFY.READ')}>
                                            <VisibilityIcon
                                                sx={{
                                                    color: 'var(--created-date-color)',
                                                    width: '18px',
                                                    height: '18px'
                                                }}
                                            />
                                        </Tooltip>
                                        <Typography
                                            sx={{
                                                color: 'var(--created-date-color)',
                                                fontSize: '14px'
                                            }}
                                        >
                                            {chunk[0].ReadCount}
                                        </Typography>
                                    </Box>
                                </Box>
                            </Box>
                        </Box>

                        <Box
                            sx={{
                                width: '185px',
                                height: '214px',
                                padding: '8px 8px 8px 3px',
                                flexShrink: 0,
                                overflow: 'hidden',
                                position: 'relative'
                            }}
                        >
                            <img
                                src={covers[(chunkIndex * 2) % 20]}
                                style={{
                                    width: '100%',
                                    borderRadius: '10px',
                                    height: '100%'
                                }}
                            ></img>

                            <Tooltip title={chunk[0].FullName}>
                                <Avatar
                                    src={chunk[0].AvatarPath ?? avatars[(chunkIndex * 2) % 20]}
                                    sx={{
                                        position: 'absolute',
                                        top: '15px',
                                        right: '15px',
                                        width: '40px',
                                        height: '40px'
                                    }}
                                />
                            </Tooltip>
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
                                width: '150px',
                                border: '1px solid var(--border-color)',
                                borderRadius: '11px',
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
                                    backdropFilter: 'blur(20px)',
                                    backgroundColor: 'var(--background-item)',
                                    borderRadius: '10px'
                                }}
                            >
                                <StyledMenuItem>
                                    <VisibilityRoundedIcon
                                        style={{
                                            color: 'var(--text-color)',
                                            width: '19px',
                                            marginRight: '10px'
                                        }}
                                    />
                                    {t('COMMON.STAT_NOTIFY.VIEW')}
                                </StyledMenuItem>
                                <StyledMenuItem>
                                    <EditRoundedIcon
                                        style={{ color: 'var(--text-color)', width: '20px', marginRight: '10px' }}
                                    />
                                    {t('COMMON.STAT_NOTIFY.UPDATE')}
                                </StyledMenuItem>
                                <StyledMenuItem
                                    sx={{
                                        color: '#FF5630'
                                    }}
                                >
                                    <img
                                        src='/images/trash.svg'
                                        style={{
                                            width: '20px',
                                            height: '20px',
                                            marginRight: '10px'
                                        }}
                                    />
                                    {t('COMMON.STAT_NOTIFY.DELETE')}
                                </StyledMenuItem>
                            </Box>
                        </Popper>
                    </Paper>

                    {chunk[1] && (
                        <Paper
                            sx={{
                                display: 'flex',
                                boxShadow: 'var(--box-shadow-paper)',
                                borderRadius: '15px',
                                overflow: 'hidden',
                                width: 'calc(100% / 2 - 12px)',
                                backgroundColor: 'var(--background-item)',
                                justifyContent: 'space-between'
                            }}
                        >
                            <Box
                                sx={{
                                    display: 'flex',
                                    width: 'calc(100% - 185px)',
                                    height: '214px',
                                    flexDirection: 'column',
                                    padding: '24px 24px 16px'
                                }}
                            >
                                <Box
                                    sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        width: '100%',
                                        mb: '20px',
                                        justifyContent: 'space-between'
                                    }}
                                >
                                    <Typography
                                        variant='h6'
                                        sx={{
                                            padding: '2px 6px',
                                            backgroundColor: '#f5f5f5',
                                            borderRadius: '6px',
                                            fontSize: '14px',
                                            fontWeight: 'bold'
                                        }}
                                    >
                                        {chunk[1].Type}
                                    </Typography>

                                    <Typography
                                        sx={{
                                            color: 'var(--created-date-color)',
                                            fontSize: '14px'
                                        }}
                                    >
                                        {formatDateToTime(chunk[1].SentTime)}
                                    </Typography>
                                </Box>

                                <Box sx={{ width: '100%' }}>
                                    <Typography
                                        variant='h5'
                                        sx={{
                                            color: 'var(--text-color)',
                                            fontSize: '16px',
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                            fontWeight: 'bold',
                                            width: '100%',
                                            cursor: 'pointer',
                                            whiteSpace: 'nowrap'
                                        }}
                                    >
                                        {chunk[1].Title}
                                    </Typography>

                                    <Typography
                                        sx={{
                                            color: 'var(--text-label-color)',
                                            fontSize: '14px',
                                            display: '-webkit-box',
                                            overflow: 'hidden',
                                            WebkitBoxOrient: 'vertical',
                                            WebkitLineClamp: 2,
                                            textOverflow: 'ellipsis',
                                            mt: '10px'
                                        }}
                                    >
                                        {chunk[1].Content}
                                    </Typography>
                                </Box>

                                <Box
                                    sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        mt: 'auto',
                                        justifyContent: 'space-between'
                                    }}
                                >
                                    <Box
                                        sx={{
                                            display: 'flex',
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            width: '38px',
                                            height: '38px',
                                            cursor: 'pointer',
                                            '&:hover': {
                                                backgroundColor: 'var(--hover-color)'
                                            },
                                            borderRadius: '50%'
                                        }}
                                        onClick={event => handleClick(event)}
                                    >
                                        <EllipsisIcon
                                            style={{
                                                color: 'var(--text-color)',
                                                width: '20px',
                                                height: '20px'
                                            }}
                                        />
                                    </Box>

                                    <Box
                                        sx={{
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            display: 'flex',
                                            gap: '15px'
                                        }}
                                    >
                                        <Box
                                            sx={{
                                                justifyContent: 'center',
                                                alignItems: 'center',
                                                display: 'flex',
                                                gap: '5px'
                                            }}
                                        >
                                            <Tooltip title={t('COMMON.STAT_NOTIFY.NUMBER_OF_RECIPIENTS')}>
                                                <PeopleRoundedIcon
                                                    sx={{
                                                        color: 'var(--created-date-color)',
                                                        width: '18px',
                                                        height: '18px'
                                                    }}
                                                />
                                            </Tooltip>
                                            <Typography
                                                sx={{
                                                    color: 'var(--created-date-color)',
                                                    fontSize: '14px'
                                                }}
                                            >
                                                {chunk[1].ReceivedCount}
                                            </Typography>
                                        </Box>
                                        <Box
                                            sx={{
                                                justifyContent: 'center',
                                                alignItems: 'center',
                                                display: 'flex',
                                                gap: '5px'
                                            }}
                                        >
                                            <Tooltip title={t('COMMON.STAT_NOTIFY.READ')}>
                                                <VisibilityIcon
                                                    sx={{
                                                        color: 'var(--created-date-color)',
                                                        width: '18px',
                                                        height: '18px'
                                                    }}
                                                />
                                            </Tooltip>
                                            <Typography
                                                sx={{
                                                    color: 'var(--created-date-color)',
                                                    fontSize: '14px'
                                                }}
                                            >
                                                {chunk[1].ReadCount}
                                            </Typography>
                                        </Box>
                                    </Box>
                                </Box>
                            </Box>

                            <Box
                                sx={{
                                    width: '185px',
                                    height: '214px',
                                    padding: '8px 8px 8px 3px',
                                    flexShrink: 0,
                                    overflow: 'hidden',
                                    position: 'relative'
                                }}
                            >
                                <img
                                    src={covers[(chunkIndex * 2 + 1) % 20]}
                                    style={{
                                        width: '100%',
                                        borderRadius: '10px',
                                        height: '100%'
                                    }}
                                ></img>

                                <Tooltip title={chunk[1].FullName}>
                                    <Avatar
                                        src={chunk[1].AvatarPath ?? avatars[(chunkIndex * 2 + 1) % 20]}
                                        sx={{
                                            position: 'absolute',
                                            top: '15px',
                                            right: '15px',
                                            width: '40px',
                                            height: '40px'
                                        }}
                                    />
                                </Tooltip>
                            </Box>
                        </Paper>
                    )}
                </Box>
            ))}
        </Box>
    )
}

export default Page
