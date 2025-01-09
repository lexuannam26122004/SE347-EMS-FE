'use client'
import { Box, Button, Paper, TextField, Typography, FormControl, InputLabel, MenuItem, Select } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { SaveIcon, XIcon } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import LoadingButton from '@mui/lab/LoadingButton'
import { useToast } from '@/hooks/useToast'

import { useUpdateWorkingRulesMutation, useGetByIdWorkingRulesQuery } from '@/services/WorkingRulesService'

function CreateConfigurationPage() {
    const { t } = useTranslation('common')
    const router = useRouter()
    const [name, setName] = useState('')
    const [content, setContent] = useState('')
    const [note, setNote] = useState('')

    const toast = useToast()
    const [isSubmit, setIsSubmit] = useState(false)

    const searchParams = useSearchParams()
    const id = searchParams.get('id') ? parseInt(searchParams.get('id') as string) : 0
    const { data: response, isFetching: isFetchingGetById, refetch: fetch } = useGetByIdWorkingRulesQuery(id)

    const data = response?.Data
    useEffect(() => {
        if (!isFetchingGetById && data) {
            setName(data.Name || '')
            setContent(data.Content || '')
            setNote(data.Note || '')
        }
    }, [data, isFetchingGetById])

    const [update, { isSuccess, isError, reset, isLoading }] = useUpdateWorkingRulesMutation()

    const handleSave = async () => {
        setIsSubmit(true)
        if (name === '' || content === '' || note === '') {
            return
        }
        const data = {
            Id: id,
            Name: name,
            IsActive: true,
            Content: content,
            Note: note
        }
        await update(data).unwrap()
        setIsSubmit(false)
    }

    useEffect(() => {
        if (isSuccess === true) {
            toast(t('Cập nhật quy định thàng công'), 'success')
            fetch()
            reset()
        }
        if (isError === true) {
            toast(t('Cập nhật quy định thất bại'), 'error')
            fetch()
            reset()
        }
    }, [isSuccess, isError])

    const handleSaveAndClose = async () => {
        setIsSubmit(true)
        if (name === '' || content === '' || note === '') {
            return
        }
        const data = {
            Id: id,
            Name: name,
            IsActive: true,
            Content: content,
            Note: note
        }
        await update(data).unwrap()
        setIsSubmit(false)
        router.push('/admin/work-regulations')
    }

    return (
        <Box sx={{ width: '60%', maxWidth: '100%', margin: '0 auto' }}>
            <Paper
                elevation={0}
                sx={{
                    width: '100%',
                    boxShadow: 'var(--box-shadow-paper)',
                    overflow: 'hidden',
                    borderRadius: '15px',
                    backgroundColor: 'var(--background-item)',
                    padding: '24px'
                }}
            >
                <Typography sx={{ fontWeight: 'bold', fontSize: '22px', color: 'var(--text-color)' }}>
                    {t('Cập nhật quy định')}
                </Typography>

                <Box
                    sx={{
                        mt: '25px'
                    }}
                >
                    <FormControl
                        fullWidth
                        error={isSubmit && name === ''}
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
                                color: isSubmit && name === '' ? 'var(--error-color)' : 'var(--text-color)'
                            }
                        }}
                    >
                        <InputLabel>{t('Loại quy định') + '*'}</InputLabel>

                        <Select
                            labelId='gender-label'
                            id='gender'
                            value={name}
                            label={t('Loại quy định') + '*'}
                            onChange={e => setName(e.target.value)}
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
                            <MenuItem value='1'>{t('Thời gian')} </MenuItem>
                            <MenuItem value='2'>{t('Trang phục')}</MenuItem>
                            <MenuItem value='3'>{t('Giữ gìn vệ sinh')} </MenuItem>
                            <MenuItem value='4'>{t('Nhiệm vụ')}</MenuItem>
                            <MenuItem value='5'>{t('Báo cáo')} </MenuItem>
                            <MenuItem value='6'>{t('Tuân thủ quy tắc')}</MenuItem>
                            <MenuItem value='7'>{t('Bảo quản tài sản')}</MenuItem>
                        </Select>
                    </FormControl>
                    <Typography
                        sx={{
                            color: 'red',
                            margin: '1px 0 0 10px',
                            fontSize: '12px',
                            visibility: isSubmit && name === '' ? 'visible' : 'hidden'
                        }}
                    >
                        {t('COMMON.TEXTFIELD.REQUIRED')}
                    </Typography>
                </Box>

                <Box
                    sx={{
                        mt: '7px'
                    }}
                >
                    <TextField
                        variant='outlined'
                        label={t('Nội dung') + '*'}
                        fullWidth
                        multiline
                        {...(isSubmit && content === '' && { error: true })}
                        minRows={5}
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
                        value={content}
                        onChange={e => setContent(e.target.value)}
                    />
                    <Typography
                        sx={{
                            color: 'var(--error-color)',
                            margin: '1px 0 0 10px',
                            fontSize: '12px',
                            visibility: isSubmit && content === '' ? 'visible' : 'hidden'
                        }}
                    >
                        {t('COMMON.TEXTFIELD.REQUIRED')}
                    </Typography>
                </Box>

                <Box
                    sx={{
                        mt: '7px'
                    }}
                >
                    <TextField
                        variant='outlined'
                        label={t('Chú ý') + '*'}
                        fullWidth
                        multiline
                        {...(isSubmit && note === '' && { error: true })}
                        minRows={5}
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
                    <Typography
                        sx={{
                            color: 'var(--error-color)',
                            margin: '1px 0 0 10px',
                            fontSize: '12px',
                            visibility: isSubmit && note === '' ? 'visible' : 'hidden'
                        }}
                    >
                        {t('COMMON.TEXTFIELD.REQUIRED')}
                    </Typography>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '20px', mt: '20px' }}>
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
                            router.push('/admin/work-regulations')
                        }}
                    >
                        {t('COMMON.BUTTON.CLOSE')}
                    </Button>
                </Box>
            </Paper>
        </Box>
    )
}

export default CreateConfigurationPage
