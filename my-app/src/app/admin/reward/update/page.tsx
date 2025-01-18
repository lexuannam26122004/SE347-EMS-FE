'use client'
import {
    Box,
    Button,
    Paper,
    TextField,
    Typography,
    Autocomplete,
    Avatar
    //Dialog,
    //DialogTitle,
    //DialogContent,
    //DialogActions
} from '@mui/material'
import { useTranslation } from 'react-i18next'
import { SaveIcon, XIcon } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import LoadingButton from '@mui/lab/LoadingButton'
import { useToast } from '@/hooks/useToast'
import { useGetAllUsersQuery } from '@/services/AspNetUserService'
import { IAspNetUserGetAll } from '@/models/AspNetUser'
import Loading from '@/components/Loading'
import { useSearchParams } from 'next/navigation'
import { useGetByIdRewardQuery, useUpdateRewardMutation } from '@/services/RewardService'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { DatePicker } from '@mui/x-date-pickers'
import dayjs from 'dayjs'
import { toZonedTime, format } from 'date-fns-tz'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'

const convertToVietnamTime = (date: Date) => {
    if (isNaN(date.getTime())) {
        throw new Error('Invalid Date')
    }

    const timeZone = 'Asia/Ho_Chi_Minh'

    const vietnamTime = toZonedTime(date, timeZone)

    const formattedDate = format(vietnamTime, 'yyyy-MM-dd')

    return formattedDate // Trả về thời gian đã được định dạng
}

function Page() {
    const { t } = useTranslation('common')
    const router = useRouter()
    const toast = useToast()
    const [isSubmit, setIsSubmit] = useState(false)
    const { data: userResponse, isLoading: isUsersLoading } = useGetAllUsersQuery()
    const employee = (userResponse?.Data?.Records as IAspNetUserGetAll[]) || []
    const [userId, setUserId] = useState('')
    const [reason, setReason] = useState('')
    const [note, setNote] = useState('')
    const [money, setMoney] = useState(0)
    const [date, setDate] = useState(dayjs().format('YYYY-MM-DD'))

    const searchParams = useSearchParams()
    const id = searchParams.get('id') ? parseInt(searchParams.get('id') as string) : 0

    const [updateReward, { isSuccess, isLoading, isError }] = useUpdateRewardMutation()
    const { data: responseData, isFetching: isFetchingGetById, refetch } = useGetByIdRewardQuery(id)

    const data = responseData?.Data
    useEffect(() => {
        if (!isFetchingGetById && data) {
            setUserId(data.UserId)
            setReason(data.Reason)
            setNote(data.Note)
            setMoney(data.Money || 0)
        }
    }, [data, isFetchingGetById])

    const handleSave = async () => {
        setIsSubmit(true)

        if (userId === '') {
            return
        }

        const data = {
            UserId: userId,
            Reason: reason,
            Note: note,
            Money: money,
            Id: id,
            Date: date
        }
        await updateReward(data).unwrap()
        setIsSubmit(false)
    }

    useEffect(() => {
        if (isSuccess) {
            refetch()
            toast(t('Thành công'), 'success')
        }
        if (isError) {
            toast(t('Không thành công'), 'error')
        }
    }, [isSuccess, isError])

    const handleSaveAndClose = async () => {
        await handleSave()
        if (userId === '') {
            return
        }

        router.push('/admin/reward')
    }

    if (isUsersLoading) {
        return <Loading />
    }

    return (
        <Box sx={{ width: '720px', maxWidth: '100%', margin: '0 auto' }}>
            <Paper
                elevation={0}
                sx={{
                    width: '100%',
                    overflow: 'hidden',
                    borderRadius: '15px',
                    backgroundColor: 'var(--background-item)',
                    padding: '24px'
                }}
            >
                <Typography sx={{ fontWeight: 'bold', fontSize: '22px', color: 'var(--text-color)' }}>
                    Cập nhật khen thưởng
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: '24px', mt: '24px' }}>
                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '24px'
                        }}
                    >
                        <Autocomplete
                            componentsProps={{
                                popper: {
                                    sx: {
                                        '& .MuiAutocomplete-option[aria-selected="true"]': {
                                            backgroundColor: 'var(--background-selected-item)'
                                        },
                                        '& .MuiAutocomplete-paper': {
                                            color: 'var(--text-color)',
                                            border: '1px solid var(--border-color)',
                                            borderRadius: '8px',
                                            backgroundImage:
                                                'url(data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIwIiBoZWlnaHQ9IjEyMCIgdmlld0JveD0iMCAwIDEyMCAxMjAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMjAiIGhlaWdodD0iMTIwIiBmaWxsPSJ1cmwoI3BhaW50MF9yYWRpYWxfMjc0OV8xNDUxODYpIiBmaWxsLW9wYWNpdHk9IjAuMTIiLz4KPGRlZnM+CjxyYWRpYWxHcmFkaWVudCBpZD0icGFpbnQwX3JhZGlhbF8yNzQ5XzE0NTE4NiIgY3g9IjAiIGN5PSIwIiByPSIxIiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSIgZ3JhZGllbnRUcmFuc2Zvcm09InRyYW5zbGF0ZSgxMjAgMS44MTgxMmUtMDUpIHJvdGF0ZSgtNDUpIHNjYWxlKDEyMy4yNSkiPgo8c3RvcCBzdG9wLWNvbG9yPSIjMDBCOEQ5Ii8+CjxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iIzAwQjhEOSIgc3RvcC1vcGFjaXR5PSIwIi8+CjwvcmFkaWFsR3JhZGllbnQ+CjwvZGVmcz4KPC9zdmc+Cg==), url(data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIwIiBoZWlnaHQ9IjEyMCIgdmlld0JveD0iMCAwIDEyMCAxMjAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMjAiIGhlaWdodD0iMTIwIiBmaWxsPSJ1cmwoI3BhaW50MF9yYWRpYWxfMjc0OV8xNDUxODcpIiBmaWxsLW9wYWNpdHk9IjAuMTIiLz4KPGRlZnM+CjxyYWRpYWxHcmFkaWVudCBpZD0icGFpbnQwX3JhZGlhbF8yNzQ5XzE0NTE4NyIgY3g9IjAiIGN5PSIwIiByPSIxIiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSIgZ3JhZGllbnRUcmFuc2Zvcm09InRyYW5zbGF0ZSgwIDEyMCkgcm90YXRlKDEzNSkgc2NhbGUoMTIzLjI1KSI+CjxzdG9wIHN0b3AtY29sb3I9IiNGRjU2MzAiLz4KPHN0b3Agb2Zmc2V0PSIxIiBzdG9wLWNvbG9yPSIjRkY1NjMwIiBzdG9wLW9wYWNpdHk9IjAiLz4KPC9yYWRpYWxHcmFkaWVudD4KPC9kZWZzPgo8L3N2Zz4K)',
                                            backgroundPosition: 'top right, bottom left',
                                            backgroundSize: '50%, 50%',
                                            backgroundRepeat: 'no-repeat',
                                            backdropFilter: 'blur(20px)',
                                            backgroundColor: 'var(--background-item)'
                                        },
                                        '& .MuiAutocomplete-option:hover': {
                                            backgroundColor: 'var(--hover-color) !important'
                                        }
                                    }
                                }
                            }}
                            sx={{
                                width: '65%',
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
                                '& .MuiAutocomplete-paper': {
                                    backgroundColor: 'var(--background-item)',
                                    color: 'var(--text-color)',
                                    border: '1px solid var(--border-color)',
                                    borderRadius: '8px',
                                    '& .MuiAutocomplete-option': {
                                        '&:hover': {
                                            backgroundColor: 'var(--hover-color) !important'
                                        }
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
                            renderOption={(props, option) => {
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
                                            padding: '10px',
                                            color: 'var(--text-color)'
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
                                    label={t('COMMON.CONTRACT.INFORMATION') + '*'}
                                    fullWidth
                                    error={isSubmit && userId === ''}
                                />
                            )}
                            value={employee.find(e => e.Id === userId) || null}
                            onChange={(event, newValue) => setUserId(newValue?.Id || '')}
                            isOptionEqualToValue={(option, value) => option.Id === value.Id}
                        />

                        <TextField
                            variant='outlined'
                            label='Số tiền'
                            sx={{
                                flex: 1,
                                '& fieldset': {
                                    borderRadius: '8px',
                                    color: 'var(--text-color)',
                                    borderColor: 'var(--border-color)'
                                },
                                '& .MuiInputBase-root': {
                                    paddingRight: '3px'
                                },
                                '& .MuiInputBase-input': {
                                    scrollbarGutter: 'stable',
                                    '&::-webkit-scrollbar': {
                                        width: '7px',
                                        height: '7px'
                                    },
                                    '&::-webkit-scrollbar-thumb': {
                                        backgroundColor: 'var(--scrollbar-color)',
                                        borderRadius: '10px'
                                    },
                                    paddingRight: '4px',
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
                            value={money}
                            onChange={e => setMoney(Number(e.target.value.replace(/[^0-9]/g, '')))}
                        />
                    </Box>

                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'center',
                            gap: '24px',
                            alignItems: 'center',
                            width: '100%'
                        }}
                    >
                        <TextField
                            variant='outlined'
                            label='Lý do'
                            id='fullWidth'
                            sx={{
                                width: '65%',
                                '& fieldset': {
                                    borderRadius: '8px',
                                    color: 'var(--text-color)',
                                    borderColor: 'var(--border-color)'
                                },
                                '& .MuiInputBase-root': {
                                    paddingRight: '3px'
                                },
                                '& .MuiInputBase-input': {
                                    scrollbarGutter: 'stable',
                                    '&::-webkit-scrollbar': {
                                        width: '7px',
                                        height: '7px'
                                    },
                                    '&::-webkit-scrollbar-thumb': {
                                        backgroundColor: 'var(--scrollbar-color)',
                                        borderRadius: '10px'
                                    },
                                    paddingRight: '4px',
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

                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DatePicker
                                label={'Ngày khen thưởng'}
                                value={dayjs(date)}
                                onChange={value => {
                                    setDate(convertToVietnamTime(value.toDate()))
                                }}
                                sx={{
                                    flex: 1,
                                    '& .MuiInputBase-root': {
                                        color: 'var(--text-color)'
                                    },
                                    '& .MuiInputBase-input': {
                                        padding: '16.5px 14px'
                                    },
                                    '& .MuiInputLabel-root': {
                                        color: 'var(--text-label-color)'
                                    },
                                    '& .MuiOutlinedInput-notchedOutline': {
                                        borderRadius: '8px',
                                        borderColor: 'var(--border-dialog)'
                                    },
                                    '& .MuiSvgIcon-root': {
                                        color: 'var(--text-label-color)' // Màu của icon (lịch)
                                    },
                                    '& .MuiOutlinedInput-root': {
                                        '&:hover .MuiOutlinedInput-notchedOutline': {
                                            borderColor: 'var(--hover-field-color)' // Màu viền khi hover
                                        },
                                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                            borderColor: 'var(--selected-field-color) !important' // Màu viền khi focus, thêm !important để ghi đè
                                        }
                                    },
                                    '& .MuiInputLabel-root.Mui-focused': {
                                        color: 'var(--selected-field-color)'
                                    }
                                }}
                            />
                        </LocalizationProvider>
                    </Box>

                    <TextField
                        variant='outlined'
                        label='Ghi chú'
                        id='fullWidth'
                        fullWidth
                        multiline
                        minRows={4}
                        maxRows={12}
                        sx={{
                            '& fieldset': {
                                borderRadius: '8px',
                                color: 'var(--text-color)',
                                borderColor: 'var(--border-color)'
                            },
                            '& .MuiInputBase-root': {
                                paddingRight: '3px'
                            },
                            '& .MuiInputBase-input': {
                                scrollbarGutter: 'stable',
                                '&::-webkit-scrollbar': {
                                    width: '7px',
                                    height: '7px'
                                },
                                '&::-webkit-scrollbar-thumb': {
                                    backgroundColor: 'var(--scrollbar-color)',
                                    borderRadius: '10px'
                                },
                                paddingRight: '4px',
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
                        value={note}
                        onChange={e => setNote(e.target.value)}
                    />
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '20px', mt: '24px' }}>
                    <LoadingButton
                        variant='contained'
                        {...(isLoading && { loading: true })}
                        loadingPosition='start'
                        startIcon={<SaveIcon />}
                        sx={{
                            height: '50px',
                            backgroundColor: 'var(--button-color)',
                            width: 'auto',
                            padding: '0px 30px',
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
                        {...(isLoading && { loading: true })}
                        loadingPosition='start'
                        startIcon={<SaveIcon />}
                        sx={{
                            height: '50px',
                            backgroundColor: 'var(--button-color)',
                            width: 'auto',
                            padding: '0px 30px',
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
                            height: '50px',
                            backgroundColor: 'var(--button-color)',
                            width: 'auto',
                            fontSize: '16px',
                            '&:hover': {
                                backgroundColor: 'var(--hover-button-color)'
                            },
                            padding: '0px 30px',
                            fontWeight: 'bold',
                            whiteSpace: 'nowrap',
                            textTransform: 'none'
                        }}
                        onClick={() => {
                            router.push('/admin/reward')
                        }}
                    >
                        {t('COMMON.BUTTON.CLOSE')}
                    </Button>
                </Box>
            </Paper>
        </Box>
    )
}

export default Page
