'use client'
import {
    Box,
    Button,
    Paper,
    TextField,
    Typography,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Autocomplete,
    Avatar
} from '@mui/material'
import { useTranslation } from 'react-i18next'
import { SaveIcon, XIcon, RefreshCcwIcon } from 'lucide-react'
import { useRouter } from 'next/navigation'
import Loading from '@/components/Loading'
import { useEffect, useState } from 'react'
import LoadingButton from '@mui/lab/LoadingButton'
import { useToast } from '@/hooks/useToast'

import { IAspNetUserGetAll } from '@/models/AspNetUser'
import { useGetAllUsersQuery } from '@/services/AspNetUserService'

import { useCreateTimeOffsMutation, useSearchTimeOffQuery } from '@/services/TimeOffService'

const getCurrentDateTime = () => {
    const now = new Date()
    const year = now.getFullYear()
    const month = String(now.getMonth() + 1).padStart(2, '0')
    const day = String(now.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
}

const CreateTimeOff = () => {
    const { t } = useTranslation('common')
    const router = useRouter()

    const [userId, setUserId] = useState('')
    const [reason, setReason] = useState('')
    const [startDate, setStartDate] = useState('')
    const [endDate, setEndDate] = useState('')
    const [content, setContent] = useState('')
    const [isAccepted, setIsAccepted] = useState('')

    const toast = useToast()
    const [isSubmit, setIsSubmit] = useState(false)

    const [createTimeOff, { isSuccess, isError, reset }] = useCreateTimeOffsMutation()

    const { refetch } = useSearchTimeOffQuery(null)

    const { data: userResponse, isLoading: isUsersLoading } = useGetAllUsersQuery()
    const employee = (userResponse?.Data?.Records as IAspNetUserGetAll[]) || []

    const [isSaveLoading, setIsSaveLoading] = useState(false)
    const [isSaveAndCloseLoading, setIsSaveAndCloseLoading] = useState(false)

    useEffect(() => {
        setStartDate(getCurrentDateTime())
        setEndDate(getCurrentDateTime())
    }, [])

    const handleSave = async () => {
        setIsSaveLoading(true)
        setIsSubmit(true)
        if (userId === '' || reason === '' || startDate === '' || endDate === '' || isAccepted === '') {
            setIsSaveLoading(false)
            return
        }
        const data = {
            UserId: userId,
            Reason: reason,
            StartDate: new Date(startDate),
            EndDate: new Date(endDate),
            IsAccepted: isAccepted === 'da' ? true : isAccepted === 'chua' ? false : null,
            Content: content,
            IsActive: true
        }
        try {
            await createTimeOff(data).unwrap()
        } finally {
            setIsSaveLoading(false)
        }
        setIsSubmit(false)
    }

    useEffect(() => {
        if (isSuccess === true) {
            toast(t('COMMON.TIMEOFF.CREATE.SUCCESS.CREATE_TIMEOFF'), 'success')
            refetch()
            reset()
        }
        if (isError === true) {
            toast(t('COMMON.TIMEOFF.CREATE.ERROR.CREATE_TIMEOFF'), 'error')
            reset()
        }
    }, [isSuccess, isError, toast, t, reset, refetch])

    const handleSaveAndClose = async () => {
        setIsSaveAndCloseLoading(true)
        setIsSubmit(true)
        if (userId === '' || reason === '' || startDate === '' || endDate === '' || isAccepted === '') {
            setIsSaveAndCloseLoading(false)
            return
        }
        const data = {
            UserId: userId,
            Reason: reason,
            StartDate: new Date(startDate),
            EndDate: new Date(endDate),
            IsAccepted: isAccepted === 'da' ? true : isAccepted === 'chua' ? false : null,
            Content: content,
            IsActive: true
        }
        try {
            await createTimeOff(data).unwrap()
            router.push('/admin/time-off')
        } finally {
            setIsSaveAndCloseLoading(false)
        }
        setIsSubmit(false)
    }

    if (isUsersLoading) return <Loading />

    return (
        <Box sx={{ width: '720px', maxWidth: '100%', margin: '0 auto' }}>
            <Paper
                elevation={0}
                sx={{
                    width: '100%',
                    overflow: 'hidden',
                    borderRadius: '15px',
                    backgroundColor: 'var(--background-item)',
                    padding: '24px',
                    boxShadow: 'var(--box-shadow-paper)'
                }}
            >
                <Typography sx={{ fontWeight: 'bold', fontSize: '22px', color: 'var(--text-color)' }}>
                    {t('COMMON.TIMEOFF.CREATE.CREATE_TIMEOFF')}
                </Typography>

                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        gap: '20px',
                        mt: '20px'
                    }}
                >
                    <Box
                        sx={{
                            width: 'calc(50% - 10px)'
                        }}
                    >
                        <Autocomplete
                            sx={{
                                '& fieldset': {
                                    borderRadius: '8px',
                                    color: 'var(--text-color)',
                                    borderColor: 'var(--border-color)'
                                },
                                '& .MuiInputBase-root': {
                                    paddingRight: '0px'
                                },
                                '& .MuiInputBase-input': {
                                    paddingRight: '12px',
                                    color: 'var(--text-color)',
                                    fontSize: '16px',
                                    '&::placeholder': {
                                        color: 'var(--placeholder-color)',
                                        opacity: 1
                                    }
                                },
                                '& .MuiOutlinedInput-root:hover fieldset': {
                                    borderColor: 'var(--hover-field-color)'
                                },
                                '& .MuiOutlinedInput-root.Mui-error:hover fieldset': {
                                    borderColor: 'var(--error-color) !important' // Màu lỗi khi hover
                                },
                                '& .MuiOutlinedInput-root.Mui-error fieldset': {
                                    borderColor: 'var(--error-color) !important' // Màu lỗi khi hover
                                },
                                '& .MuiOutlinedInput-root.Mui-focused fieldset': {
                                    borderColor: 'var(--selected-field-color)'
                                },
                                '& .MuiInputLabel-root': {
                                    color: 'var(--text-label-color)'
                                },
                                '& .MuiInputLabel-root.Mui-focused': {
                                    color: 'var(--selected-field-color)'
                                },
                                '& .MuiInputLabel-root.Mui-error': {
                                    color: 'var(--error-color)'
                                },
                                '& .MuiAutocomplete-popupIndicator': {
                                    '& svg': {
                                        fill: isSubmit && userId === '' ? 'var(--error-color)' : 'var(--text-color)'
                                    }
                                },
                                '& .MuiAutocomplete-clearIndicator': {
                                    '& svg': {
                                        fill: 'var(--text-color)'
                                    }
                                }
                            }}
                            options={employee}
                            getOptionLabel={option => `${option.EmployeeId}  ${option.FullName}`}
                            renderOption={(props, option, { selected }) => {
                                const { key, ...otherProps } = props
                                return (
                                    <Box
                                        key={key}
                                        component='li'
                                        {...otherProps}
                                        sx={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '10px',
                                            padding: '8px',
                                            color: selected ? 'black' : 'var(--text-color)',
                                            backgroundColor: 'var(--background-color)',
                                            '&:hover': {
                                                color: 'black'
                                            }
                                        }}
                                    >
                                        <Avatar
                                            src={
                                                option.AvatarPath ||
                                                'https://localhost:44381/avatars/aa1678f0-75b0-48d2-ae98-50871178e9bd.jfif'
                                            }
                                            alt='Avatar'
                                        />
                                        <Typography>{`${option.EmployeeId}  ${option.FullName}`}</Typography>
                                    </Box>
                                )
                            }}
                            renderInput={params => (
                                <TextField
                                    {...params}
                                    variant='outlined'
                                    label={t('COMMON.TIMEOFF.INFORMATION') + '*'}
                                    fullWidth
                                    error={isSubmit && userId === ''}
                                />
                            )}
                            value={employee.find(e => e.Id === userId) || null}
                            onChange={(event, newValue) => setUserId(newValue?.Id || '')}
                            isOptionEqualToValue={(option, value) => option.Id === value.Id}
                        />

                        <Typography
                            sx={{
                                color: 'red',
                                margin: '1px 0 0 10px',
                                fontSize: '12px',
                                visibility: isSubmit && userId === '' ? 'visible' : 'hidden'
                            }}
                        >
                            {t('COMMON.TEXTFIELD.REQUIRED') + '*'}
                        </Typography>
                    </Box>
                    <Box
                        sx={{
                            width: 'calc(50% - 10px)'
                        }}
                    >
                        <FormControl
                            fullWidth
                            error={isSubmit && isAccepted === ''}
                            sx={{
                                '& fieldset': {
                                    borderRadius: '8px',
                                    color: 'var(--text-color)',
                                    borderColor: 'var(--border-color)'
                                },
                                '& .MuiInputBase-root': {
                                    paddingRight: '0px'
                                },
                                '& .MuiInputBase-input': {
                                    paddingRight: '12px',
                                    color: 'var(--text-color)',
                                    fontSize: '16px',
                                    '&::placeholder': {
                                        color: 'var(--placeholder-color)',
                                        opacity: 1
                                    }
                                },
                                '& .MuiOutlinedInput-root:hover fieldset': {
                                    borderColor: 'var(--hover-field-color)'
                                },
                                '& .MuiOutlinedInput-root.Mui-error:hover fieldset': {
                                    borderColor: 'var(--error-color) !important' // Màu lỗi khi hover
                                },
                                '& .MuiOutlinedInput-root.Mui-error fieldset': {
                                    borderColor: 'var(--error-color) !important' // Màu lỗi khi hover
                                },
                                '& .MuiOutlinedInput-root.Mui-focused fieldset': {
                                    borderColor: 'var(--selected-field-color)'
                                },
                                '& .MuiInputLabel-root': {
                                    color: 'var(--text-label-color)'
                                },
                                '& .MuiInputLabel-root.Mui-focused': {
                                    color: 'var(--selected-field-color)'
                                },
                                '& .MuiInputLabel-root.Mui-error': {
                                    color: 'var(--error-color)'
                                },
                                '& .MuiSelect-icon': {
                                    color: isSubmit && isAccepted === '' ? 'var(--error-color)' : 'var(--text-color)'
                                }
                            }}
                        >
                            <InputLabel>{t('COMMON.TIMEOFF.ISACCEPTED') + '*'}</InputLabel>

                            <Select
                                labelId='gender-label'
                                id='gender'
                                value={isAccepted}
                                label={t('COMMON.TIMEOFF.ISACCEPTED') + '*'}
                                onChange={e => setIsAccepted(e.target.value)}
                                MenuProps={{
                                    PaperProps: {
                                        elevation: 0,
                                        sx: {
                                            backgroundImage:
                                                'url(data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIwIiBoZWlnaHQ9IjEyMCIgdmlld0JveD0iMCAwIDEyMCAxMjAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMjAiIGhlaWdodD0iMTIwIiBmaWxsPSJ1cmwoI3BhaW50MF9yYWRpYWxfMjc0OV8xNDUxODYpIiBmaWxsLW9wYWNpdHk9IjAuMTIiLz4KPGRlZnM+CjxyYWRpYWxHcmFkaWVudCBpZD0icGFpbnQwX3JhZGlhbF8yNzQ5XzE0NTE4NiIgY3g9IjAiIGN5PSIwIiByPSIxIiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSIgZ3JhZGllbnRUcmFuc2Zvcm09InRyYW5zbGF0ZSgxMjAgMS44MTgxMmUtMDUpIHJvdGF0ZSgtNDUpIHNjYWxlKDEyMy4yNSkiPgo8c3RvcCBzdG9wLWNvbG9yPSIjMDBCOEQ5Ii8+CjxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iIzAwQjhEOSIgc3RvcC1vcGFjaXR5PSIwIi8+CjwvcmFkaWFsR3JhZGllbnQ+CjwvZGVmcz4KPC9zdmc+Cg==), url(data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIwIiBoZWlnaHQ9IjEyMCIgdmlld0JveD0iMCAwIDEyMCAxMjAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMjAiIGhlaWdodD0iMTIwIiBmaWxsPSJ1cmwoI3BhaW50MF9yYWRpYWxfMjc0OV8xNDUxODcpIiBmaWxsLW9wYWNpdHk9IjAuMTIiLz4KPGRlZnM+CjxyYWRpYWxHcmFkaWVudCBpZD0icGFpbnQwX3JhZGlhbF8yNzQ5XzE0NTE4NyIgY3g9IjAiIGN5PSIwIiByPSIxIiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSIgZ3JhZGllbnRUcmFuc2Zvcm09InRyYW5zbGF0ZSgwIDEyMCkgcm90YXRlKDEzNSkgc2NhbGUoMTIzLjI1KSI+CjxzdG9wIHN0b3AtY29sb3I9IiNGRjU2MzAiLz4KPHN0b3Agb2Zmc2V0PSIxIiBzdG9wLWNvbG9yPSIjRkY1NjMwIiBzdG9wLW9wYWNpdHk9IjAiLz4KPC9yYWRpYWxHcmFkaWVudD4KPC9kZWZzPgo8L3N2Zz4K)',
                                            backgroundPosition: 'top right, bottom left',
                                            backgroundSize: '50%, 50%',
                                            backgroundRepeat: 'no-repeat',
                                            padding: '0 8px',
                                            backdropFilter: 'blur(20px)',
                                            borderRadius: '8px',
                                            backgroundColor: 'var(--background-item)',
                                            color: 'var(--text-color)',
                                            border: '1px solid var(--border-color)',
                                            '& .MuiMenuItem-root': {
                                                borderRadius: '6px',
                                                '&:hover': {
                                                    backgroundColor: 'var(--hover-color)'
                                                },
                                                '&.Mui-selected': {
                                                    backgroundColor: 'var(--selected-color)',
                                                    '&:hover': {
                                                        backgroundColor: 'var(--hover-color)'
                                                    }
                                                }
                                            }
                                        },
                                        autoFocus: false
                                    }
                                }}
                            >
                                <MenuItem value='da'>{t('COMMON.TIMEOFF.AGREE')} </MenuItem>
                                <MenuItem value='chua'>{t('COMMON.TIMEOFF.REFUSE')}</MenuItem>
                                <MenuItem value='dang'>{t('COMMON.TIMEOFF.PENDING')}</MenuItem>
                            </Select>
                        </FormControl>
                        <Typography
                            sx={{
                                color: 'red',
                                margin: '1px 0 0 10px',
                                fontSize: '12px',
                                visibility: isSubmit && isAccepted === '' ? 'visible' : 'hidden'
                            }}
                        >
                            {t('COMMON.TEXTFIELD.REQUIRED')}
                        </Typography>
                    </Box>
                </Box>

                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        gap: '20px',
                        mt: '7px'
                    }}
                >
                    <Box
                        sx={{
                            width: 'calc(50% - 10px)'
                        }}
                    >
                        <TextField
                            variant='outlined'
                            label={t('COMMON.TIMEOFF.STARTDATE') + '*'}
                            type='date'
                            fullWidth
                            {...(isSubmit && startDate === '' && { error: true })}
                            sx={{
                                '& fieldset': {
                                    borderRadius: '8px',
                                    color: 'var(--text-color)',
                                    borderColor: 'var(--border-color)'
                                },
                                '& .MuiInputBase-root': {
                                    paddingRight: '0px'
                                },
                                '& .MuiInputBase-input': {
                                    paddingRight: '12px',
                                    color: 'var(--text-color)',
                                    fontSize: '16px',
                                    '&::placeholder': {
                                        color: 'var(--placeholder-color)',
                                        opacity: 1
                                    }
                                },
                                '& .MuiOutlinedInput-root:hover fieldset': {
                                    borderColor: 'var(--hover-field-color)'
                                },
                                '& .MuiOutlinedInput-root.Mui-error:hover fieldset': {
                                    borderColor: 'var(--error-color) !important' // Màu lỗi khi hover
                                },
                                '& .MuiOutlinedInput-root.Mui-error fieldset': {
                                    borderColor: 'var(--error-color) !important' // Màu lỗi khi hover
                                },
                                '& .MuiOutlinedInput-root.Mui-focused fieldset': {
                                    borderColor: 'var(--selected-field-color)'
                                },
                                '& .MuiInputLabel-root': {
                                    color: 'var(--text-label-color)'
                                },
                                '& .MuiInputLabel-root.Mui-focused': {
                                    color: 'var(--selected-field-color)'
                                },
                                '& .MuiInputLabel-root.Mui-error': {
                                    color: 'var(--error-color)'
                                }
                            }}
                            value={startDate}
                            onChange={e => setStartDate(e.target.value)}
                        />
                        <Typography
                            sx={{
                                color: 'red',
                                margin: '1px 0 0 10px',
                                fontSize: '12px',
                                visibility: isSubmit && startDate === '' ? 'visible' : 'hidden'
                            }}
                        >
                            {t('COMMON.TEXTFIELD.REQUIRED')}
                        </Typography>
                    </Box>

                    <Box
                        sx={{
                            width: 'calc(50% - 10px)'
                        }}
                    >
                        <TextField
                            variant='outlined'
                            label={t('COMMON.TIMEOFF.ENDDATE') + '*'}
                            type='date'
                            fullWidth
                            {...(isSubmit && endDate === '' && { error: true })}
                            sx={{
                                '& fieldset': {
                                    borderRadius: '8px',
                                    color: 'var(--text-color)',
                                    borderColor: 'var(--border-color)'
                                },
                                '& .MuiInputBase-root': {
                                    paddingRight: '0px'
                                },
                                '& .MuiInputBase-input': {
                                    paddingRight: '12px',
                                    color: 'var(--text-color)',
                                    fontSize: '16px',
                                    '&::placeholder': {
                                        color: 'var(--placeholder-color)',
                                        opacity: 1
                                    }
                                },
                                '& .MuiOutlinedInput-root:hover fieldset': {
                                    borderColor: 'var(--hover-field-color)'
                                },
                                '& .MuiOutlinedInput-root.Mui-error:hover fieldset': {
                                    borderColor: 'var(--error-color) !important' // Màu lỗi khi hover
                                },
                                '& .MuiOutlinedInput-root.Mui-error fieldset': {
                                    borderColor: 'var(--error-color) !important' // Màu lỗi khi hover
                                },
                                '& .MuiOutlinedInput-root.Mui-focused fieldset': {
                                    borderColor: 'var(--selected-field-color)'
                                },
                                '& .MuiInputLabel-root': {
                                    color: 'var(--text-label-color)'
                                },
                                '& .MuiInputLabel-root.Mui-focused': {
                                    color: 'var(--selected-field-color)'
                                },
                                '& .MuiInputLabel-root.Mui-error': {
                                    color: 'var(--error-color)'
                                }
                            }}
                            value={endDate}
                            onChange={e => setEndDate(e.target.value)}
                        />
                        <Typography
                            sx={{
                                color: 'red',
                                margin: '1px 0 0 10px',
                                fontSize: '12px',
                                visibility: isSubmit && endDate === '' ? 'visible' : 'hidden'
                            }}
                        >
                            {t('COMMON.TEXTFIELD.REQUIRED')}
                        </Typography>
                    </Box>
                </Box>

                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        gap: '20px',
                        mt: '7px'
                    }}
                >
                    <Box
                        sx={{
                            width: '100%'
                        }}
                    >
                        <TextField
                            variant='outlined'
                            label={t('COMMON.TIMEOFF.REASON') + '*'}
                            id='fullWidth'
                            fullWidth
                            multiline
                            {...(isSubmit && reason === '' && { error: true })}
                            minRows={1}
                            maxRows={12}
                            sx={{
                                '& fieldset': {
                                    borderRadius: '8px',
                                    color: 'var(--text-color)',
                                    borderColor: 'var(--border-color)'
                                },
                                '& .MuiInputBase-root': {
                                    paddingRight: '0px'
                                },
                                '& .MuiInputBase-input': {
                                    paddingRight: '12px',
                                    color: 'var(--text-color)',
                                    fontSize: '16px',
                                    '&::placeholder': {
                                        color: 'var(--placeholder-color)',
                                        opacity: 1
                                    }
                                },
                                '& .MuiOutlinedInput-root:hover fieldset': {
                                    borderColor: 'var(--hover-field-color)'
                                },
                                '& .MuiOutlinedInput-root.Mui-error:hover fieldset': {
                                    borderColor: 'var(--error-color) !important' // Màu lỗi khi hover
                                },
                                '& .MuiOutlinedInput-root.Mui-error fieldset': {
                                    borderColor: 'var(--error-color) !important' // Màu lỗi khi hover
                                },
                                '& .MuiOutlinedInput-root.Mui-focused fieldset': {
                                    borderColor: 'var(--selected-field-color)'
                                },
                                '& .MuiInputLabel-root': {
                                    color: 'var(--text-label-color)'
                                },
                                '& .MuiInputLabel-root.Mui-focused': {
                                    color: 'var(--selected-field-color)'
                                },
                                '& .MuiInputLabel-root.Mui-error': {
                                    color: 'var(--error-color)'
                                }
                            }}
                            value={reason}
                            onChange={e => setReason(e.target.value)}
                        />
                        <Typography
                            sx={{
                                color: 'red',
                                margin: '1px 0 0 10px',
                                fontSize: '12px',
                                visibility: isSubmit && reason === '' ? 'visible' : 'hidden'
                            }}
                        >
                            {t('COMMON.TEXTFIELD.REQUIRED')}
                        </Typography>
                    </Box>
                </Box>

                <TextField
                    variant='outlined'
                    label={t('COMMON.TIMEOFF.CONTENT')}
                    id='fullWidth'
                    fullWidth
                    multiline
                    minRows={4}
                    maxRows={12}
                    sx={{
                        mt: '7px',
                        '& fieldset': {
                            borderRadius: '8px',
                            color: 'var(--text-color)',
                            borderColor: 'var(--border-color)'
                        },
                        '& .MuiInputBase-root': {
                            paddingRight: '0px'
                        },
                        '& .MuiInputBase-input': {
                            paddingRight: '12px',
                            color: 'var(--text-color)',
                            fontSize: '16px',
                            '&::placeholder': {
                                color: 'var(--placeholder-color)',
                                opacity: 1
                            }
                        },
                        '& .MuiOutlinedInput-root:hover fieldset': {
                            borderColor: 'var(--hover-field-color)'
                        },
                        '& .MuiOutlinedInput-root.Mui-error:hover fieldset': {
                            borderColor: 'var(--error-color) !important' // Màu lỗi khi hover
                        },
                        '& .MuiOutlinedInput-root.Mui-error fieldset': {
                            borderColor: 'var(--error-color) !important' // Màu lỗi khi hover
                        },
                        '& .MuiOutlinedInput-root.Mui-focused fieldset': {
                            borderColor: 'var(--selected-field-color)'
                        },
                        '& .MuiInputLabel-root': {
                            color: 'var(--text-label-color)'
                        },
                        '& .MuiInputLabel-root.Mui-focused': {
                            color: 'var(--selected-field-color)'
                        },
                        '& .MuiInputLabel-root.Mui-error': {
                            color: 'var(--error-color)'
                        }
                    }}
                    value={content}
                    onChange={e => setContent(e.target.value)}
                />

                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '20px', mt: '20px' }}>
                    <Button
                        variant='contained'
                        startIcon={<RefreshCcwIcon />}
                        sx={{
                            height: '44px',
                            backgroundColor: 'var(--button-color)',
                            width: 'auto',
                            fontSize: '16px',
                            '&:hover': {
                                backgroundColor: 'var(--hover-button-color)'
                            },
                            padding: '0px 20px',
                            fontWeight: 'bold',
                            whiteSpace: 'nowrap',
                            textTransform: 'none'
                        }}
                        onClick={() => {
                            window.location.reload()
                        }}
                    >
                        {t('COMMON.BUTTON.REFRESH')}
                    </Button>

                    <LoadingButton
                        variant='contained'
                        loading={isSaveLoading}
                        loadingPosition='start'
                        startIcon={<SaveIcon />}
                        sx={{
                            height: '44px',
                            backgroundColor: 'var(--button-color)',
                            width: 'auto',
                            padding: '0px 20px',
                            fontSize: '16px',
                            '&:hover': {
                                backgroundColor: 'var(--hover-button-color)'
                            },
                            fontWeight: 'bold',
                            whiteSpace: 'nowrap',
                            textTransform: 'none'
                        }}
                        onClick={handleSave}
                    >
                        {t('COMMON.BUTTON.SAVE')}
                    </LoadingButton>

                    <LoadingButton
                        variant='contained'
                        loading={isSaveAndCloseLoading}
                        loadingPosition='start'
                        startIcon={<SaveIcon />}
                        sx={{
                            height: '44px',
                            backgroundColor: 'var(--button-color)',
                            width: 'auto',
                            padding: '0px 20px',
                            '&:hover': {
                                backgroundColor: 'var(--hover-button-color)'
                            },
                            fontSize: '16px',
                            fontWeight: 'bold',
                            whiteSpace: 'nowrap',
                            textTransform: 'none'
                        }}
                        onClick={handleSaveAndClose}
                    >
                        {t('COMMON.BUTTON.SAVE_AND_CLOSE')}
                    </LoadingButton>

                    <Button
                        variant='contained'
                        startIcon={<XIcon />}
                        sx={{
                            height: '44px',
                            backgroundColor: 'var(--button-color)',
                            width: 'auto',
                            fontSize: '16px',
                            '&:hover': {
                                backgroundColor: 'var(--hover-button-color)'
                            },
                            padding: '0px 20px',
                            fontWeight: 'bold',
                            whiteSpace: 'nowrap',
                            textTransform: 'none'
                        }}
                        onClick={() => {
                            router.push('/admin/time-off')
                        }}
                    >
                        {t('COMMON.BUTTON.CLOSE')}
                    </Button>
                </Box>
            </Paper>
        </Box>
    )
}

export default CreateTimeOff
