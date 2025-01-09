import React, { useMemo } from 'react'
import { Box, Typography, Divider, Skeleton, Button, InputAdornment, TextField } from '@mui/material'
import { useTranslation } from 'react-i18next'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import { ArrowLeft, Save, SearchIcon } from 'lucide-react'
import { useEffect, useState } from 'react'
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline'
import { IAspNetRoleGetAll } from '@/models/AspNetRole'
import { useGetAllRolesQuery } from '@/services/AspNetRoleService'
import debounce from 'lodash.debounce'

interface Props {
    handleBefore: () => void
    handleClose: () => void
    handleSave: () => void
    tempSelectedRole: IAspNetRoleGetAll[]
    setTempSelectedRole: React.Dispatch<React.SetStateAction<IAspNetRoleGetAll[]>>
}

function ListRole({ handleBefore, handleClose, handleSave, tempSelectedRole, setTempSelectedRole }: Props) {
    const { t } = useTranslation('common')
    const [showError, setShowError] = useState(false)
    const [showSkeleton, setShowSkeleton] = useState(true)
    const { data: roleResponse, isFetching: isFetchingRole, isError: isErrorRole } = useGetAllRolesQuery({})
    const roles = (roleResponse?.Data.Records as IAspNetRoleGetAll[]) || []
    const [filteredRoles, setFilteredRoles] = useState<IAspNetRoleGetAll[]>([])
    const [search, setSearch] = useState('')
    const [select, setSelect] = useState(true)

    const handleChooseRole = (role: IAspNetRoleGetAll) => {
        setTempSelectedRole(prev => (prev.includes(role) ? prev.filter(x => x !== role) : [...prev, role]))
    }

    const sortedRoles = useMemo(() => {
        const selectedRolesSet = new Set(tempSelectedRole.map(u => u.Id))
        return [...tempSelectedRole, ...roles.filter(role => !selectedRolesSet.has(role.Id))]
    }, [roles, tempSelectedRole])

    const handleSearch = debounce(value => {
        const filtered = sortedRoles.filter(role => role.Name.toLowerCase().includes(value.toLowerCase()))
        setFilteredRoles(filtered)
    }, 100)

    const roleLast = useMemo(() => {
        if (filteredRoles.length === 0 && search === '') {
            return sortedRoles
        }
        return filteredRoles
    }, [sortedRoles, filteredRoles])

    useEffect(() => {
        handleSearch(search)
    }, [search, sortedRoles])

    useEffect(() => {
        setSearch('')
    }, [])

    useEffect(() => {
        if (!isFetchingRole) {
            setShowError(isErrorRole)
            setShowSkeleton(false)
        }
    }, [isFetchingRole, isErrorRole])

    const handleSelectAllClick = () => {
        if (!select) {
            setTempSelectedRole([])
        } else {
            setTempSelectedRole(roles)
        }
        setSelect(!select)
    }

    useEffect(() => {
        if (roles.length === 0) return

        const shouldSelect = tempSelectedRole.length !== roles.length
        if (shouldSelect !== select) {
            setSelect(shouldSelect)
        }
    }, [tempSelectedRole, roles])

    return (
        <Box>
            <Box padding='16px 16px' sx={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <TextField
                    variant='outlined'
                    inputRef={input => input && input.focus()}
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    placeholder={t('COMMON.CREATE_NOTIFICATION.SEARCH_USERS')}
                    sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        width: '100%',
                        borderRadius: '50px',
                        height: '45px',
                        backgroundColor: 'var(--search-color)',
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
                    scrollbarGutter: 'stable both-edges',
                    '&::-webkit-scrollbar': {
                        width: '7px',
                        height: '7px'
                    },
                    gap: 0,
                    '&::-webkit-scrollbar-thumb': {
                        backgroundColor: 'var(--scrollbar-color)',
                        borderRadius: '10px'
                    }
                }}
            >
                {showSkeleton ? (
                    <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%', gap: 1.9, height: '100%' }}>
                        {Array.from({ length: 10 }).map((_, index) => (
                            <Box
                                key={index}
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    padding: '6px 10px 0',
                                    justifyContent: 'center'
                                }}
                            >
                                <Skeleton
                                    variant='text'
                                    width='85%'
                                    height='22px'
                                    sx={{ borderRadius: '10px', bgcolor: 'var(--skeleton-color)' }}
                                />
                            </Box>
                        ))}
                    </Box>
                ) : showError ? (
                    <img src='/images/Error.gif' alt='' />
                ) : roleLast.length === 0 ? (
                    <Box sx={{ mt: '20px', width: '100%' }}>
                        <Typography sx={{ width: '100%', textAlign: 'center' }}>
                            {t('COMMON.CREATE_NOTIFICATION.NOT_FOUND')}
                        </Typography>
                    </Box>
                ) : (
                    roleLast.map((role, index) => (
                        <Box
                            key={index}
                            sx={{
                                backgroundColor: 'var(--background-color)',
                                padding: '14px 11px',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                borderRadius: '6px',
                                position: 'relative',
                                '&:hover': {
                                    backgroundColor: 'var(--hover-color)'
                                }
                            }}
                            onClick={() => handleChooseRole(role)}
                        >
                            <Typography
                                sx={{
                                    fontWeight: 'bold',
                                    margin: 0,
                                    fontSize: '15px',
                                    whiteSpace: 'nowrap',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    color: 'var(--text-color)'
                                }}
                            >
                                {role.Name}
                            </Typography>

                            <Box sx={{ position: 'absolute', right: '10px' }}>
                                {tempSelectedRole.includes(role) ? (
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
                        justifyContent: 'space-between'
                    }}
                >
                    <Button
                        variant='contained'
                        endIcon={<ArrowLeft />}
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
                        onClick={handleBefore}
                    >
                        {t('COMMON.BUTTON.BEFORE')}
                    </Button>
                    <Box
                        sx={{
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
                                fontSize: '15px',
                                cursor: 'pointer',
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
                            startIcon={<Save />}
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
            </Box>
        </Box>
    )
}

export default ListRole
