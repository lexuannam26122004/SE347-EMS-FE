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
    Checkbox,
    ListItemText,
    Avatar
} from '@mui/material'
import Loading from '@/components/Loading'
import axios from 'axios'
import { useSearchParams } from 'next/navigation'
import { useTranslation } from 'react-i18next'
import { SaveIcon, XIcon, RefreshCcwIcon } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useGetAllUsersQuery, useUpdateUsersMutation, useGetByIdUsersQuery } from '@/services/AspNetUserService'
import { useEffect, useState } from 'react'
import LoadingButton from '@mui/lab/LoadingButton'
import { useToast } from '@/hooks/useToast'
import { IAspNetUserGetAll } from '@/models/AspNetUser'

import { IAspNetRoleGetAll } from '@/models/AspNetRole'
import { useGetAllRolesQuery } from '@/services/AspNetRoleService'

import { IDepartmentGetAll } from '@/models/Department'
import { useGetAllDepartmentQuery } from '@/services/DepartmentService'

import { useGetAuthMeQuery } from '@/services/AuthService'

const UpdateEmployeePage = () => {
    const { t } = useTranslation('common')
    const router = useRouter()
    const [fullName, setFullName] = useState('')
    const [userName, setUserName] = useState('')
    const [email, setEmail] = useState('')
    const [phoneNumber, setPhoneNumber] = useState('')
    const [startDateWork, setStartDateWork] = useState('')
    const [gender, setGender] = useState('')
    const [address, setAddress] = useState('')
    const [note, setNote] = useState('')
    const [birthday, setBirthday] = useState('')
    const [departmentId, setDepartmentId] = useState('')
    const [employeeId, setEmployeeId] = useState('')
    const [roles, setRoles] = useState<string[]>([])
    const [AvatarFileId, setAvatarFileId] = useState(0)
    const [isExistingUser, setIsExistingUser] = useState(false)
    const [isExistingEmail, setIsExistingEmail] = useState(false)

    const [previewSrc, setPreviewSrc] = useState<string>()
    const [file, setFile] = useState<File | null>(null)

    function formatDate(dateString: string): string {
        const date = new Date(dateString)
        if (isNaN(date.getTime())) {
            return ''
        }
        const year = date.getFullYear()
        const month = String(date.getMonth() + 1).padStart(2, '0')
        const day = String(date.getDate()).padStart(2, '0')

        return `${year}-${month}-${day}`
    }

    const { refetch: fetchGetMe } = useGetAuthMeQuery()

    const toast = useToast()
    const [isSubmit, setIsSubmit] = useState(false)

    const searchParams = useSearchParams()
    const id = searchParams.get('id') || ''
    const { data: responseData, isFetching: isFetchingGetById, refetch: fetchUserById } = useGetByIdUsersQuery(id)

    const [updateUsers, { isSuccess, isError, reset }] = useUpdateUsersMutation()

    const data = responseData?.Data
    useEffect(() => {
        if (!isFetchingGetById && data) {
            setEmployeeId(data.EmployeeId)
            setFullName(data.FullName ?? '')
            setUserName(data.UserName)
            setEmail(data.Email)
            setPhoneNumber(data.PhoneNumber ?? '')
            setStartDateWork(formatDate(data.StartDateWork))
            setGender(data.Gender === true ? 'nam' : data.Gender === false ? 'nữ' : 'khác')
            setAddress(data.Address)
            setNote(data.Note)
            setBirthday(formatDate(data.Birthday))
            setDepartmentId(data.DepartmentId)
            setRoles(data.Roles)
            setAvatarFileId(data.AvatarFileId || 0)
            setPreviewSrc(
                data.AvatarPath
                    ? 'https://localhost:44381/' + data.AvatarPath
                    : 'https://localhost:44381/avatars/aa1678f0-75b0-48d2-ae98-50871178e9bd.jfif'
            )
        }
    }, [data, isFetchingGetById])

    const { data: userResponse, isLoading: isUsersLoading, refetch } = useGetAllUsersQuery()
    const employee = (userResponse?.Data?.Records as IAspNetUserGetAll[]) || []

    const { data: roleResponse, isLoading: isRoleLoading } = useGetAllRolesQuery(null)
    const role = (roleResponse?.Data?.Records as IAspNetRoleGetAll[]) || []

    const { data: departmentResponse, isLoading: isDepartmentLoading } = useGetAllDepartmentQuery()
    const department = (departmentResponse?.Data?.Records as IDepartmentGetAll[]) || []

    const [isSaveLoading, setIsSaveLoading] = useState(false)
    const [isSaveAndCloseLoading, setIsSaveAndCloseLoading] = useState(false)

    const handleSave = async () => {
        setIsSaveLoading(true)
        setIsSubmit(true)
        if (
            fullName === '' ||
            userName === '' ||
            email === '' ||
            phoneNumber === '' ||
            startDateWork === '' ||
            gender === '' ||
            address === '' ||
            birthday === '' ||
            departmentId === '' ||
            !Array.isArray(roles) ||
            roles.length === 0 ||
            isExistingUser ||
            isExistingEmail
        ) {
            setIsSaveLoading(false)
            return
        }

        let avatarFileId = AvatarFileId

        if (file !== null) {
            try {
                await fileChunk(file)
                avatarFileId = await createFile(file)
            } catch (error) {
                console.error('Error during file upload:', error)
                setIsSaveLoading(false)
                return
            }
        }

        const data = {
            Id: id,
            EmployeeId: employeeId,
            FullName: fullName,
            UserName: userName,
            Email: email,
            PhoneNumber: phoneNumber,
            StartDateWork: new Date(startDateWork),
            Gender: gender === 'nam' ? true : gender === 'nữ' ? false : undefined,
            Address: address,
            Note: note,
            Birthday: new Date(birthday),
            DepartmentId: Number(departmentId),
            Roles: roles,
            IsActive: true,
            AvatarFileId: avatarFileId
        }
        try {
            await updateUsers(data).unwrap()
        } finally {
            setIsSaveLoading(false)
        }
        setIsSubmit(false)
    }

    useEffect(() => {
        if (isSuccess === true) {
            toast(t('COMMON.EMPLOYEE.UPDATE.SUCCESS.UPDATE_EMPLOYEE'), 'success')
            refetch()
            reset()
            fetchUserById()
            fetchGetMe()
        }
        if (isError === true) {
            toast(t('COMMON.EMPLOYEE.UPDATE.ERROR.UPDATE_EMPLOYEE'), 'error')
            reset()
            fetchUserById()
            fetchGetMe()
        }
    }, [isSuccess, isError, toast, t, reset, refetch, fetchUserById, fetchGetMe])

    const handleSaveAndClose = async () => {
        setIsSaveAndCloseLoading(true)
        setIsSubmit(true)
        if (
            fullName === '' ||
            userName === '' ||
            email === '' ||
            phoneNumber === '' ||
            startDateWork === '' ||
            gender === '' ||
            address === '' ||
            birthday === '' ||
            departmentId === '' ||
            !Array.isArray(roles) ||
            roles.length === 0 ||
            isExistingUser ||
            isExistingEmail
        ) {
            setIsSaveAndCloseLoading(false)
            return
        }

        let avatarFileId = AvatarFileId

        if (file !== null) {
            try {
                await fileChunk(file)
                avatarFileId = await createFile(file)
            } catch (error) {
                console.error('Error during file upload:', error)
                setIsSaveLoading(false)
                return
            }
        }

        const data = {
            Id: id,
            EmployeeId: employeeId,
            FullName: fullName,
            UserName: userName,
            Email: email,
            PhoneNumber: phoneNumber,
            StartDateWork: new Date(startDateWork),
            Gender: gender === 'nam' ? true : gender === 'nữ' ? false : undefined,
            Address: address,
            Note: note,
            Birthday: new Date(birthday),
            DepartmentId: Number(departmentId),
            Roles: roles,
            IsActive: true,
            AvatarFileId: avatarFileId
        }
        try {
            await updateUsers(data).unwrap()
            router.push('/admin/employee')
        } finally {
            setIsSaveAndCloseLoading(false)
        }
        setIsSubmit(false)
    }

    if (isUsersLoading || isRoleLoading || isDepartmentLoading) return <Loading />

    const triggerFileInput = () => {
        document.getElementById('fileInput')?.click()
    }

    const previewImage = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files ? event.target.files[0] : null

        if (file) {
            if (file.size > 3 * 1024 * 1024) {
                alert('File size must not exceed 3MB!')
                return
            }

            const reader = new FileReader()
            reader.onload = (e: ProgressEvent<FileReader>) => {
                setPreviewSrc(e.target?.result as string)
                setFile(file)
            }
            reader.readAsDataURL(file)
        }
    }
    const fileChunk = async (file: File) => {
        const url = 'https://localhost:44381/api/admin/SysFile/FileChunks'
        const formData = new FormData()
        formData.append('File', file)
        formData.append('FileName', file?.name)
        formData.append('UniqueFileName', file?.name)
        formData.append('TotalChunks', '1')
        try {
            const response = await axios.post(url, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            })

            console.log('File chunk uploaded successfully:', response.data)
        } catch (error) {
            console.error('Error uploading file chunk:', error)
        }
    }

    const createFile = async (file: File) => {
        const url = 'https://localhost:44381/api/admin/SysFile/CreateFile'
        const formData = new FormData()
        formData.append('Name', file?.name)
        formData.append('UniqueFileName', file?.name)
        formData.append('Type', '')

        try {
            const response = await axios.post(url, formData, {
                headers: {
                    'Content-Type': 'application/json-patch+json'
                }
            })

            return response.data.Data
        } catch (error) {
            console.error('Error creating file:', error)
            throw error
        }
    }

    return (
        <Box sx={{ width: '100%', display: 'flex' }}>
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginBottom: 'auto',
                    width: '18%',
                    position: 'sticky',
                    top: '25px',
                    color: 'var(--text-color)'
                }}
            >
                <Box
                    sx={{
                        textAlign: 'center',
                        background: '#fff',
                        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                        maxWidth: '300px',
                        marginRight: 'auto',
                        borderRadius: '15px',
                        backgroundColor: 'var(--background-item)',
                        padding: '24px',

                        backgroundImage:
                            'url(data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIwIiBoZWlnaHQ9IjEyMCIgdmlld0JveD0iMCAwIDEyMCAxMjAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMjAiIGhlaWdodD0iMTIwIiBmaWxsPSJ1cmwoI3BhaW50MF9yYWRpYWxfMjc0OV8xNDUxODYpIiBmaWxsLW9wYWNpdHk9IjAuMTIiLz4KPGRlZnM+CjxyYWRpYWxHcmFkaWVudCBpZD0icGFpbnQwX3JhZGlhbF8yNzQ5XzE0NTE4NiIgY3g9IjAiIGN5PSIwIiByPSIxIiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSIgZ3JhZGllbnRUcmFuc2Zvcm09InRyYW5zbGF0ZSgxMjAgMS44MTgxMmUtMDUpIHJvdGF0ZSgtNDUpIHNjYWxlKDEyMy4yNSkiPgo8c3RvcCBzdG9wLWNvbG9yPSIjMDBCOEQ5Ii8+CjxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iIzAwQjhEOSIgc3RvcC1vcGFjaXR5PSIwIi8+CjwvcmFkaWFsR3JhZGllbnQ+CjwvZGVmcz4KPC9zdmc+Cg==), url(data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIwIiBoZWlnaHQ9IjEyMCIgdmlld0JveD0iMCAwIDEyMCAxMjAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMjAiIGhlaWdodD0iMTIwIiBmaWxsPSJ1cmwoI3BhaW50MF9yYWRpYWxfMjc0OV8xNDUxODcpIiBmaWxsLW9wYWNpdHk9IjAuMTIiLz4KPGRlZnM+CjxyYWRpYWxHcmFkaWVudCBpZD0icGFpbnQwX3JhZGlhbF8yNzQ5XzE0NTE4NyIgY3g9IjAiIGN5PSIwIiByPSIxIiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSIgZ3JhZGllbnRUcmFuc2Zvcm09InRyYW5zbGF0ZSgwIDEyMCkgcm90YXRlKDEzNSkgc2NhbGUoMTIzLjI1KSI+CjxzdG9wIHN0b3AtY29sb3I9IiNGRjU2MzAiLz4KPHN0b3Agb2Zmc2V0PSIxIiBzdG9wLWNvbG9yPSIjRkY1NjMwIiBzdG9wLW9wYWNpdHk9IjAiLz4KPC9yYWRpYWxHcmFkaWVudD4KPC9kZWZzPgo8L3N2Zz4K)',
                        backgroundPosition: 'top right, bottom left',
                        backgroundSize: '50%, 50%',
                        backgroundRepeat: 'no-repeat'
                    }}
                >
                    <Box
                        sx={{
                            position: 'relative',
                            cursor: 'pointer'
                        }}
                    >
                        <input
                            type='file'
                            id='fileInput'
                            accept='image/*'
                            onChange={previewImage}
                            style={{ display: 'none' }}
                        />

                        <Box
                            sx={{
                                width: '150px',
                                height: '150px',
                                borderRadius: '50%',
                                overflow: 'hidden',
                                margin: '0 auto 8px',
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                position: 'relative',
                                transition: 'box-shadow 0.3s ease'
                            }}
                            onMouseEnter={() => (document.getElementById('updatePhoto')!.style.display = 'flex')}
                            onMouseLeave={() => (document.getElementById('updatePhoto')!.style.display = 'none')}
                        >
                            <Avatar
                                sx={{
                                    width: '100%',
                                    height: '100%'
                                }}
                                src={previewSrc}
                                alt='Avatar'
                            />
                            <Box
                                id='updatePhoto'
                                sx={{
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    width: '100%',
                                    height: '100%',
                                    background: 'rgba(0, 0, 0, 0.3)',
                                    display: 'none',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    fontSize: '14px',
                                    cursor: 'pointer',
                                    flexDirection: 'column',
                                    textAlign: 'center'
                                }}
                                onClick={triggerFileInput}
                            >
                                <svg
                                    xmlns='http://www.w3.org/2000/svg'
                                    width='36'
                                    height='36'
                                    viewBox='0 0 24 24'
                                    fill='white'
                                >
                                    <path d='M12 10.25a.75.75 0 0 1 .75.75v1.25H14a.75.75 0 0 1 0 1.5h-1.25V15a.75.75 0 0 1-1.5 0v-1.25H10a.75.75 0 0 1 0-1.5h1.25V11a.75.75 0 0 1 .75-.75'></path>
                                    <path d='M9.778 21h4.444c3.121 0 4.682 0 5.803-.735a4.4 4.4 0 0 0 1.226-1.204c.749-1.1.749-2.633.749-5.697s0-4.597-.749-5.697a4.4 4.4 0 0 0-1.226-1.204c-.72-.473-1.622-.642-3.003-.702c-.659 0-1.226-.49-1.355-1.125A2.064 2.064 0 0 0 13.634 3h-3.268c-.988 0-1.839.685-2.033 1.636c-.129.635-.696 1.125-1.355 1.125c-1.38.06-2.282.23-3.003.702A4.4 4.4 0 0 0 2.75 7.667C2 8.767 2 10.299 2 13.364s0 4.596.749 5.697c.324.476.74.885 1.226 1.204C5.096 21 6.657 21 9.778 21M16 13a4 4 0 1 1-8 0a4 4 0 0 1 8 0m2-3.75a.75.75 0 0 0 0 1.5h1a.75.75 0 0 0 0-1.5z'></path>
                                </svg>
                                <span style={{ color: 'white' }}>Update Avatar</span>
                            </Box>
                        </Box>
                    </Box>
                    <Box
                        sx={{
                            marginTop: '15px'
                        }}
                    >
                        Allowed: *.jpeg, *.jpg, *.png, *.gif
                        <br />
                        <small>Max size: 3MB</small>
                    </Box>
                </Box>
            </Box>

            <Paper
                sx={{
                    width: '80%',
                    overflow: 'hidden',
                    marginLeft: 'auto',
                    marginBottom: 'auto',
                    borderRadius: '15px',
                    backgroundColor: 'var(--background-item)',
                    padding: '24px',
                    boxShadow: 'var(--box-shadow-paper)'
                }}
            >
                <Typography sx={{ fontWeight: 'bold', fontSize: '22px', color: 'var(--text-color)' }}>
                    {t('COMMON.EMPLOYEE.UPDATE.UPDATE_EMPLOYEE')}
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
                        <TextField
                            variant='outlined'
                            label={t('COMMON.EMPLOYEE.FULLNAME') + '*'}
                            fullWidth
                            {...(isSubmit && fullName === '' && { error: true })}
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
                            value={fullName}
                            onChange={e => setFullName(e.target.value)}
                        />
                        <Typography
                            sx={{
                                color: 'red',
                                margin: '1px 0 0 10px',
                                fontSize: '12px',
                                visibility: isSubmit && fullName === '' ? 'visible' : 'hidden'
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
                        <FormControl
                            fullWidth
                            error={isSubmit && departmentId === ''}
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
                                    color: isSubmit && departmentId === '' ? 'var(--error-color)' : 'var(--text-color)'
                                }
                            }}
                        >
                            <InputLabel>{t('COMMON.EMPLOYEE.DEPARTMENTNAME') + '*'}</InputLabel>
                            <Select
                                value={departmentId}
                                onChange={e => setDepartmentId(e.target.value)}
                                label={t('COMMON.EMPLOYEE.DEPARTMENTNAME') + '*'}
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
                                {department.map(dept => (
                                    <MenuItem key={dept.Id} value={dept.Id}>
                                        {dept.Name}
                                    </MenuItem>
                                ))}
                            </Select>
                            <Typography
                                sx={{
                                    color: 'red',
                                    margin: '1px 0 0 10px',
                                    fontSize: '12px',
                                    visibility: isSubmit && departmentId === '' ? 'visible' : 'hidden'
                                }}
                            >
                                {t('COMMON.TEXTFIELD.REQUIRED')}
                            </Typography>
                        </FormControl>
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
                            label={t('COMMON.EMPLOYEE.USERNAME') + '*'}
                            fullWidth
                            {...(isSubmit && (userName === '' || isExistingUser) && { error: true })}
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
                            value={userName}
                            onChange={e => {
                                setUserName(e.target.value)
                                setIsExistingUser(
                                    employee
                                        .filter(user => user.Id != id)
                                        .some(user => user.UserName === e.target.value.trim())
                                )
                            }}
                        />
                        <Typography
                            sx={{
                                color: 'red',
                                margin: '1px 0 0 10px',
                                fontSize: '12px',
                                visibility:
                                    isSubmit && userName === '' ? 'visible' : isExistingUser ? 'visible' : 'hidden'
                            }}
                        >
                            {isSubmit && userName === ''
                                ? t('COMMON.TEXTFIELD.REQUIRED')
                                : isExistingUser
                                  ? t('COMMON.EMPLOYEE.CREATE.ERROR.ACCOUNT_EXISTS')
                                  : 'Hợp lệ'}
                        </Typography>
                    </Box>

                    <Box
                        sx={{
                            width: 'calc(50% - 10px)'
                        }}
                    >
                        <FormControl
                            variant='outlined'
                            fullWidth
                            {...(isSubmit && (!Array.isArray(roles) || roles.length === 0) && { error: true })}
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
                                    color:
                                        isSubmit && (!Array.isArray(roles) || roles.length === 0)
                                            ? 'var(--error-color)'
                                            : 'var(--text-color)'
                                }
                            }}
                        >
                            <InputLabel id='roles-label'>{t('COMMON.EMPLOYEE.ROLES') + '*'}</InputLabel>
                            <Select
                                label={t('COMMON.EMPLOYEE.ROLES') + '*'}
                                multiple
                                value={roles}
                                onChange={event => setRoles(event.target.value as string[])}
                                renderValue={selected => (selected as string[]).join(', ')}
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
                                {role.map(roleItem => (
                                    <MenuItem key={roleItem.Name} value={roleItem.Name}>
                                        <Checkbox
                                            checked={roles.includes(roleItem.Name)}
                                            sx={{
                                                color: 'var(--text-color)'
                                            }}
                                        />
                                        <ListItemText primary={roleItem.Name} />
                                    </MenuItem>
                                ))}
                            </Select>

                            <Typography
                                sx={{
                                    color: 'red',
                                    margin: '1px 0 0 10px',
                                    fontSize: '12px',
                                    visibility:
                                        isSubmit && (!Array.isArray(roles) || roles.length === 0) ? 'visible' : 'hidden'
                                }}
                            >
                                {t('COMMON.TEXTFIELD.REQUIRED')}
                            </Typography>
                        </FormControl>
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
                        <FormControl
                            fullWidth
                            error={isSubmit && gender === ''}
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
                                    color: isSubmit && gender === '' ? 'var(--error-color)' : 'var(--text-color)'
                                }
                            }}
                        >
                            <InputLabel>{t('COMMON.EMPLOYEE.GENDER') + '*'}</InputLabel>

                            <Select
                                labelId='gender-label'
                                id='gender'
                                value={gender}
                                label={t('COMMON.EMPLOYEE.GENDER') + '*'}
                                onChange={e => setGender(e.target.value)}
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
                                <MenuItem value='nam'>Nam</MenuItem>
                                <MenuItem value='nữ'>Nữ</MenuItem>
                                <MenuItem value='khác'>Khác</MenuItem>
                            </Select>
                            <Typography
                                sx={{
                                    color: 'red',
                                    margin: '1px 0 0 10px',
                                    fontSize: '12px',
                                    visibility: isSubmit && gender === '' ? 'visible' : 'hidden'
                                }}
                            >
                                {t('COMMON.TEXTFIELD.REQUIRED')}
                            </Typography>
                        </FormControl>
                    </Box>

                    <Box
                        sx={{
                            width: 'calc(50% - 10px)'
                        }}
                    >
                        <TextField
                            variant='outlined'
                            label={t('COMMON.EMPLOYEE.ADDRESS') + '*'}
                            fullWidth
                            {...(isSubmit && address === '' && { error: true })}
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
                            value={address}
                            onChange={e => setAddress(e.target.value)}
                        />
                        <Typography
                            sx={{
                                color: 'red',
                                margin: '1px 0 0 10px',
                                fontSize: '12px',
                                visibility: isSubmit && address === '' ? 'visible' : 'hidden'
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
                            label={t('COMMON.EMPLOYEE.BIRTHDAY') + '*'}
                            type='date'
                            fullWidth
                            {...(isSubmit && birthday === '' && { error: true })}
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
                            value={birthday}
                            onChange={e => setBirthday(e.target.value)}
                        />
                        <Typography
                            sx={{
                                color: 'red',
                                margin: '1px 0 0 10px',
                                fontSize: '12px',
                                visibility: isSubmit && birthday === '' ? 'visible' : 'hidden'
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
                            label={t('COMMON.EMPLOYEE.STARTDATE') + '*'}
                            fullWidth
                            {...(isSubmit && startDateWork === '' && { error: true })}
                            type='date'
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
                            value={startDateWork}
                            onChange={e => setStartDateWork(e.target.value)}
                        />
                        <Typography
                            sx={{
                                color: 'red',
                                margin: '1px 0 0 10px',
                                fontSize: '12px',
                                visibility: isSubmit && startDateWork === '' ? 'visible' : 'hidden'
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
                            label={t('COMMON.EMPLOYEE.EMAIL') + '*'}
                            fullWidth
                            {...(isSubmit && (email === '' || isExistingEmail) && { error: true })}
                            type='email'
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
                            value={email}
                            onChange={e => {
                                setEmail(e.target.value)
                                setIsExistingEmail(
                                    employee
                                        .filter(user => user.Id != id)
                                        .some(user => user.Email === e.target.value.trim())
                                )
                            }}
                        />
                        <Typography
                            sx={{
                                color: 'red',
                                margin: '1px 0 0 10px',
                                fontSize: '12px',
                                visibility:
                                    isSubmit && email === '' ? 'visible' : isExistingEmail ? 'visible' : 'hidden'
                            }}
                        >
                            {isSubmit && email === ''
                                ? t('COMMON.TEXTFIELD.REQUIRED')
                                : isExistingEmail
                                  ? t('COMMON.EMPLOYEE.CREATE.ERROR.EMAIL_EXISTS')
                                  : 'Hợp lệ'}
                        </Typography>
                    </Box>

                    <Box
                        sx={{
                            width: 'calc(50% - 10px)'
                        }}
                    >
                        <TextField
                            variant='outlined'
                            label={t('COMMON.EMPLOYEE.PHONENUMBER') + '*'}
                            fullWidth
                            {...(isSubmit && phoneNumber === '' && { error: true })}
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
                            value={phoneNumber}
                            onChange={e => {
                                const value = e.target.value

                                if (/^\d*$/.test(value)) {
                                    setPhoneNumber(value)
                                }
                            }}
                        />
                        <Typography
                            sx={{
                                color: 'red',
                                margin: '1px 0 0 10px',
                                fontSize: '12px',
                                visibility: isSubmit && phoneNumber === '' ? 'visible' : 'hidden'
                            }}
                        >
                            {t('COMMON.TEXTFIELD.REQUIRED')}
                        </Typography>
                    </Box>
                </Box>

                <TextField
                    variant='outlined'
                    label={t('COMMON.EMPLOYEE.NOTE')}
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
                    value={note}
                    onChange={e => setNote(e.target.value)}
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
                            router.push('/admin/employee')
                        }}
                    >
                        {t('COMMON.BUTTON.CLOSE')}
                    </Button>
                </Box>
            </Paper>
        </Box>
    )
}

export default UpdateEmployeePage
