'use client'
import { Autocomplete, Avatar, Box, Button, Paper, TextField, Typography } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { SaveIcon, XIcon } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import LoadingButton from '@mui/lab/LoadingButton'
import { useToast } from '@/hooks/useToast'
import { useGetAllUsersQuery } from '@/services/AspNetUserService'
import { IAspNetUserGetAll } from '@/models/AspNetUser'
import { IDepartmentGetAll } from '@/models/Department'
import {
    useGetAllDepartmentQuery,
    useUpdateDepartmentMutation,
    useGetByIdDepartmentQuery
} from '@/services/DepartmentService'
import Loading from '@/components/Loading'

function CreateConfigurationPage() {
    const { t } = useTranslation('common')
    const router = useRouter()
    const [name, setName] = useState('')
    const [departmentHeadId, setDepartmentHeadId] = useState('')
    const toast = useToast()
    const [isSubmit, setIsSubmit] = useState(false)

    const searchParams = useSearchParams()
    const id = searchParams.get('id') ? parseInt(searchParams.get('id') as string) : 0
    const { data: response, isFetching: isFetchingGetById, refetch: fetch } = useGetByIdDepartmentQuery(id)

    const data = response?.Data
    useEffect(() => {
        if (!isFetchingGetById && data) {
            setName(data.Name || '')
            setDepartmentHeadId(data.DepartmentHeadId || '')
        }
    }, [data, isFetchingGetById])

    const [update, { isSuccess, isError, reset, isLoading }] = useUpdateDepartmentMutation()

    const { data: userResponse, isLoading: LoadingUsers } = useGetAllUsersQuery()
    const { data: responseData, isLoading: LoadingDepartment } = useGetAllDepartmentQuery(null)
    const employee = (userResponse?.Data?.Records as IAspNetUserGetAll[]) || []
    const departmentdata = (responseData?.Data.Records as IDepartmentGetAll[]) || []

    const filteredEmployees = employee.filter(
        emp => !departmentdata.some(dept => dept.DepartmentHeadId === emp.Id && emp.Id !== departmentHeadId)
    )

    const handleSave = async () => {
        setIsSubmit(true)
        if (name === '' || departmentHeadId === '') {
            return
        }
        const data = {
            Id: id,
            Name: name,
            DepartmentHeadId: departmentHeadId
        }
        await update(data).unwrap()
        setIsSubmit(false)
    }

    useEffect(() => {
        if (isSuccess === true) {
            toast(t('Tạo phòng ban thàng công'), 'success')
            fetch()
            reset()
        }
        if (isError === true) {
            toast(t('Tạo phòng ban thất bại'), 'error')
            fetch()
            reset()
        }
    }, [isSuccess, isError])

    const handleSaveAndClose = async () => {
        setIsSubmit(true)
        if (name === '' || departmentHeadId === '') {
            return
        }
        const data = {
            Id: id,
            Name: name,
            DepartmentHeadId: departmentHeadId
        }
        await update(data).unwrap()
        setIsSubmit(false)
        router.push('/admin/department')
    }

    if (LoadingUsers || LoadingDepartment) return <Loading />

    return (
        <Box sx={{ width: '720px', maxWidth: '100%', margin: '0 auto' }}>
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
                    {t('Thêm phòng ban')}
                </Typography>

                <Box
                    sx={{
                        mt: '25px'
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
                                    fill:
                                        isSubmit && departmentHeadId === '' ? 'var(--error-color)' : 'var(--text-color)'
                                }
                            },
                            '& .MuiAutocomplete-clearIndicator': {
                                '& svg': {
                                    fill: 'var(--text-color)'
                                }
                            }
                        }}
                        options={filteredEmployees}
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
                                label={t('COMMON.CONTRACT.INFORMATIONMANAGER') + '*'}
                                fullWidth
                                error={isSubmit && departmentHeadId === ''}
                            />
                        )}
                        value={filteredEmployees.find(e => e.Id === departmentHeadId) || null}
                        onChange={(event, newValue) => setDepartmentHeadId(newValue?.Id || '')}
                        isOptionEqualToValue={(option, value) => option.Id === value.Id}
                    />

                    <Typography
                        sx={{
                            color: 'red',
                            margin: '1px 0 0 10px',
                            fontSize: '12px',
                            visibility: isSubmit && departmentHeadId === '' ? 'visible' : 'hidden'
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
                        label={t('Tên phòng ban') + '*'}
                        fullWidth
                        multiline
                        {...(isSubmit && name === '' && { error: true })}
                        minRows={1}
                        maxRows={3}
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
                        value={name}
                        onChange={e => setName(e.target.value)}
                    />
                    <Typography
                        sx={{
                            color: 'var(--error-color)',
                            margin: '1px 0 0 10px',
                            fontSize: '12px',
                            visibility: isSubmit && name === '' ? 'visible' : 'hidden'
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
                            router.push('/admin/department')
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
