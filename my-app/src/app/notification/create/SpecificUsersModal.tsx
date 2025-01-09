import React, { useMemo } from 'react'
import {
    Box,
    Paper,
    Modal,
    Typography,
    Avatar,
    Divider,
    Skeleton,
    Button,
    InputAdornment,
    TextField
} from '@mui/material'
import { useTranslation } from 'react-i18next'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import { SaveIcon, SearchIcon, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline'
import { IAspNetUserGetAll } from '@/models/AspNetUser'
import { useGetAllUsersQuery } from '@/services/AspNetUserService'
import { useSelector, useDispatch } from 'react-redux'
import {
    selectedUsersToNotifySliceSelector,
    selectedUsersToNotifySlice
} from '@/redux/slices/selectedUsersToNotifySlice'
import debounce from 'lodash.debounce'

interface NotificationModalProps {
    open: boolean
    handleClose: () => void
}

function SpecificUsersModal({ open, handleClose }: NotificationModalProps) {
    const { t } = useTranslation()
    const [showError, setShowError] = useState(false)
    const [showSkeleton, setShowSkeleton] = useState(true)
    const { data: userResponse, isFetching: isFetchingUsers, refetch } = useGetAllUsersQuery()
    const users = (userResponse?.Data.Records as IAspNetUserGetAll[]) || []
    const dispatch = useDispatch()
    const selectedUsers = useSelector(selectedUsersToNotifySliceSelector)
    const [tempSelectedUsers, setTempSelectedUsers] = useState<IAspNetUserGetAll[]>(selectedUsers)
    const [search, setSearch] = useState('')
    const [select, setSelect] = useState(true)
    const [filteredUsers, setFilteredUsers] = useState<IAspNetUserGetAll[]>([])

    const handleChooseUser = (user: IAspNetUserGetAll) => {
        setTempSelectedUsers(prev => (prev.includes(user) ? prev.filter(x => x !== user) : [...prev, user]))
    }

    useEffect(() => {
        if (open) {
            setTempSelectedUsers(selectedUsers)
            setSearch('')
        }
    }, [open, selectedUsers])

    const handleSave = () => {
        dispatch(selectedUsersToNotifySlice.actions.updateSelectedUsersToNotifySlice(tempSelectedUsers))
        handleClose()
    }

    const sortedUsers = useMemo(() => {
        const selectedUsersSet = new Set(tempSelectedUsers.map(u => u.Id))
        return [...tempSelectedUsers, ...users.filter(user => !selectedUsersSet.has(user.Id))]
    }, [users, tempSelectedUsers])

    useEffect(() => {
        if (open) {
            setShowError(false)
            setShowSkeleton(true)
            refetch()
        }
    }, [open, refetch])

    useEffect(() => {
        if (!isFetchingUsers) {
            setShowError(!users)
            setShowSkeleton(false)
        }
    }, [isFetchingUsers, users])

    const handleSearch = debounce(value => {
        const filtered = sortedUsers.filter(user => user.FullName.toLowerCase().includes(value.toLowerCase()))
        setFilteredUsers(filtered)
    }, 100)

    useEffect(() => {
        handleSearch(search)
    }, [search, sortedUsers])

    useEffect(() => {
        if (users.length === 0) return

        const shouldSelect = tempSelectedUsers.length !== users.length
        if (shouldSelect !== select) {
            setSelect(shouldSelect)
        }
    }, [tempSelectedUsers, users])

    const handleSelectAllClick = () => {
        if (!select) {
            setTempSelectedUsers([])
        } else {
            setTempSelectedUsers(users)
        }
        setSelect(!select)
    }

    return (
        <Modal open={open} sx={{ padding: 10 }} onClose={handleClose}>
            <Paper
                sx={{
                    width: '50vw',
                    maxWidth: '500px',
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
                        paddingBlock: 1.6,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        zIndex: '1',
                        position: 'relative'
                    }}
                >
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
                        {t('COMMON.CREATE_NOTIFICATION.SPECIFIC_USERS')}
                    </Typography>
                    <Box
                        sx={{
                            position: 'absolute',
                            right: '16px',
                            top: '11px',
                            cursor: 'pointer',
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
                <Box padding='16px 16px' sx={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                    <TextField
                        variant='outlined'
                        inputRef={input => input && input.focus()}
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        placeholder={t('COMMON.CREATE_NOTIFICATION.SEARCH_USERS')}
                        fullWidth
                        sx={{
                            display: 'flex',
                            backgroundColor: 'var(--search-color)',
                            justifyContent: 'center',
                            borderRadius: '50px',
                            height: '45px',
                            '& .MuiOutlinedInput-root': {
                                borderRadius: '20px',
                                '& fieldset': {
                                    border: 'none' // Ẩn viền
                                },
                                '&:hover fieldset': {
                                    border: 'none' // Ẩn viền khi hover
                                },
                                '&.Mui-focused fieldset': {
                                    border: 'none' // Ẩn viền khi focus
                                }
                            },
                            '& .MuiInputBase-input': {
                                color: 'var(--text-color)' // Thay đổi màu chữ trong TextField
                            }
                        }}
                        slotProps={{
                            input: {
                                startAdornment: (
                                    <InputAdornment position='start'>
                                        <SearchIcon style={{ color: 'gray', width: '19px', height: '19px' }} />
                                    </InputAdornment>
                                )
                            }
                        }}
                    />

                    <Button
                        sx={{
                            textTransform: 'none',
                            whiteSpace: 'nowrap',
                            padding: '6px 15px',
                            width: 'auto',
                            '&:hover': {
                                backgroundColor: 'var(--hover-color)'
                            }
                        }}
                        onClick={handleSelectAllClick}
                    >
                        {select === true ? t('COMMON.BUTTON.SELECT') : t('COMMON.BUTTON.UNSELECT')}
                    </Button>
                </Box>
                <Box
                    sx={{
                        height: '60vh',
                        width: '100%',
                        flexGrow: 1,
                        borderWidth: '0px',
                        borderStyle: 'solid',
                        borderColor: 'divider',
                        display: 'flex',
                        flexDirection: 'column',
                        overflow: 'auto',
                        paddingLeft: '7px',
                        scrollbarGutter: 'stable',
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
                        <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%', gap: 0.8, height: '100%' }}>
                            {Array.from({ length: 10 }).map((_, index) => (
                                <Box key={index} sx={{ display: 'flex', alignItems: 'center', padding: '6px 10px 0' }}>
                                    <Skeleton
                                        variant='circular'
                                        width='36px'
                                        height='36px'
                                        sx={{ bgcolor: 'var(--skeleton-color)', marginRight: '10px' }}
                                    />
                                    <Box>
                                        <Skeleton
                                            variant='text'
                                            width='200px'
                                            height='20px'
                                            sx={{ borderRadius: '13px', bgcolor: 'var(--skeleton-color)' }}
                                        />
                                        <Skeleton
                                            variant='text'
                                            width='130px'
                                            height='20px'
                                            sx={{
                                                borderRadius: '13px',
                                                bgcolor: 'var(--skeleton-color)'
                                            }}
                                        />
                                    </Box>
                                </Box>
                            ))}
                        </Box>
                    ) : showError ? (
                        <img src='/images/Error.gif' alt='' />
                    ) : filteredUsers.length === 0 ? (
                        <Box sx={{ mt: '20px', width: '100%' }}>
                            <Typography sx={{ width: '100%', textAlign: 'center', color: 'var(--text-color)' }}>
                                {t('COMMON.CREATE_NOTIFICATION.NOT_FOUND')}
                            </Typography>
                        </Box>
                    ) : (
                        filteredUsers.map((user, index) => (
                            <Box
                                key={index}
                                sx={{
                                    backgroundColor: 'var(--background-color)',
                                    padding: '6px 0px 6px 8px',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    borderRadius: '6px',
                                    position: 'relative',
                                    '&:hover': {
                                        backgroundColor: 'var(--hover-color)'
                                    }
                                }}
                                onClick={() => handleChooseUser(user)}
                            >
                                <Avatar
                                    src={
                                        user.AvatarPath ||
                                        'https://localhost:44381/avatars/aa1678f0-75b0-48d2-ae98-50871178e9bd.jfif'
                                    }
                                    alt='Avatar'
                                    style={{
                                        borderRadius: '50%',
                                        objectFit: 'cover',
                                        float: 'left',
                                        marginRight: '11px',
                                        width: '35px',
                                        height: '35px'
                                    }}
                                />

                                <Box style={{ overflow: 'hidden', flexGrow: 1 }}>
                                    <Typography
                                        sx={{
                                            fontWeight: 'bold',
                                            margin: 0,
                                            fontSize: '15px',
                                            marginTop: '1px',
                                            whiteSpace: 'nowrap',
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                            color: 'var(--text-color)'
                                        }}
                                    >
                                        {user.FullName}
                                    </Typography>
                                    <Typography
                                        style={{
                                            fontWeight: '500',
                                            color: '#1879b3',
                                            fontSize: '13px',
                                            margin: 0,
                                            marginTop: '-2px',
                                            whiteSpace: 'nowrap',
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis'
                                        }}
                                    >
                                        {user.Roles ? user.Roles?.join(', ') : '#'} - {user.DepartmentName}
                                    </Typography>
                                </Box>

                                <Box sx={{ position: 'absolute', right: '7px' }}>
                                    {tempSelectedUsers.includes(user) ? (
                                        <CheckCircleIcon sx={{ color: '#1879b3' }} />
                                    ) : (
                                        <CheckCircleOutlineIcon sx={{ color: 'var(--text-gray-color)' }} />
                                    )}
                                </Box>
                            </Box>
                        ))
                    )}
                </Box>
                <Box>
                    <Divider />
                    <Box
                        sx={{
                            padding: '12px 16px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '20px',
                            justifyContent: 'right'
                        }}
                    >
                        <Typography
                            sx={{
                                color: '#0064D1',
                                padding: '6px 12px',
                                borderRadius: '4px',
                                cursor: 'pointer',
                                fontSize: '15px',
                                '&:hover': {
                                    backgroundColor: 'var(--hover-color)'
                                }
                            }}
                            onClick={handleClose}
                        >
                            {t('COMMON.BUTTON.CANCEL')}
                        </Typography>
                        <Button
                            variant='contained'
                            startIcon={<SaveIcon />}
                            sx={{
                                height: '40px',
                                backgroundColor: 'var(--button-color)',
                                width: 'auto',
                                fontSize: '15px',
                                '&:hover': {
                                    backgroundColor: 'var(--hover-button-color)'
                                },
                                padding: '0px 24px',
                                fontWeight: 'bold',
                                whiteSpace: 'nowrap',
                                textTransform: 'none'
                            }}
                            onClick={handleSave}
                        >
                            {t('COMMON.BUTTON.SAVE')}
                        </Button>
                    </Box>
                </Box>
            </Paper>
        </Modal>
    )
}

export default SpecificUsersModal
