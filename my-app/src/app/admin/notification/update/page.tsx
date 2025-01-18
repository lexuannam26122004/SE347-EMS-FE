'use client'
import LoadingButton from '@mui/lab/LoadingButton'
import {
    Box,
    Paper,
    TextField,
    Typography,
    Select,
    MenuItem,
    SelectChangeEvent,
    InputLabel,
    Button,
    FormControl,
    FormLabel,
    FormControlLabel,
    RadioGroup,
    Chip,
    Avatar
} from '@mui/material'
import { SaveIcon } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { XIcon } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useUpdateNotificationMutation } from '@/services/NotificationsService'
import Radio from '@mui/material/Radio'
import SpecificUsersModal from './SpecificUsersModal'
import {
    selectedUsersToNotifySlice,
    selectedUsersToNotifySliceSelector
} from '@/redux/slices/selectedUsersToNotifySlice'
import { useSelector, useDispatch } from 'react-redux'
import DepartmentAndRoleModal from './DepartmentAndRoleModal'
import {
    selectedDepartmentsToNotifySelector,
    selectedDepartmentsToNotifySlice
} from '@/redux/slices/selectedDepartmentsToNotifySlice'
import { selectedRolesToNotifySelector, selectedRolesToNotifySlice } from '@/redux/slices/selectedRolesToNotifySlice'
import UploadFiles from './UploadFiles'
import { useToast } from '@/hooks/useToast'
import { useSearchParams } from 'next/navigation'
import Loading from '@/components/Loading'
import { useGetNotificationByIdQuery } from '@/services/NotificationsService'
import { useGetAuthMeQuery } from '@/services/AuthService'

function Page() {
    const toast = useToast()
    const { t } = useTranslation('common')
    const router = useRouter()
    const [typeNotification, setTypeNotification] = useState<string>('')
    const [openSelectType, setOpenSelectType] = useState(false)
    const [updateNotification, { isLoading }] = useUpdateNotificationMutation()
    const [title, setTitle] = useState('')
    const [content, setContent] = useState('')
    const [files, setFiles] = useState<number[]>([])
    const [isSubmit, setIsSubmit] = useState(false)
    const dispatch = useDispatch()
    const [typeReceiveNotify, setTypeReceiveNotify] = useState('All')
    const [openSpecificUsersModal, setOpenSpecificUsersModal] = useState(false)
    const [openDepartmentAndRolesModal, setOpenDepartmentAndRolesModal] = useState(false)
    const selectedUsers = useSelector(selectedUsersToNotifySliceSelector)
    const selectedDepartment = useSelector(selectedDepartmentsToNotifySelector)
    const selectedRole = useSelector(selectedRolesToNotifySelector)

    const searchParams = useSearchParams()
    const id = searchParams.get('id') ? parseInt(searchParams.get('id') as string) : 0

    const { data: responseData, isLoading: isLoadingNotification } = useGetNotificationByIdQuery(id)

    const notification = responseData?.Data || {}

    useEffect(() => {
        if (isLoadingNotification === false && notification) {
            setTitle(notification.Title)
            setContent(notification.Content)
            setTypeNotification(notification.Type)
            setFiles(notification.ListFileId)
            setTypeReceiveNotify(notification.TypeToNotify === 1 ? 'All' : 'Specific_Users')
            dispatch(selectedUsersToNotifySlice.actions.updateSelectedUsersToNotifySlice(notification.ListUserId))
        }
    }, [notification, isLoadingNotification])

    const handleCloseSpecificUsersModal = () => {
        setOpenSpecificUsersModal(false)
    }

    const { data: responseGetMe } = useGetAuthMeQuery()
    const userSentNotificationId = responseGetMe?.Data?.Id

    const handleCloseDepartmentAndRolesModal = () => {
        setOpenDepartmentAndRolesModal(false)
    }

    const handleChange = (event: SelectChangeEvent<typeof typeNotification>) => {
        setTypeNotification(event.target.value)
    }

    const handleCloseSelectType = () => {
        setOpenSelectType(false)
    }

    const handleOpenSelectType = () => {
        setOpenSelectType(true)
    }

    const handleSave = async () => {
        setIsSubmit(true)
        if (
            typeNotification === '' ||
            title === '' ||
            content === '' ||
            (typeReceiveNotify === 'Specific_Users' && selectedUsers.length === 0) ||
            (typeReceiveNotify === 'Department_And_Role' &&
                (selectedDepartment.length === 0 || selectedRole.length === 0))
        ) {
            return
        }

        const data = {
            Type: typeNotification,
            Content: content,
            Title: title,
            ListUser: selectedUsers.map(x => x.Id),
            ListFile: files,
            Id: id,
            UserId: userSentNotificationId,
            ListDept: selectedDepartment.map(x => x.Id),
            ListRole: selectedRole.map(x => x.Id),
            TypeToNotify: typeReceiveNotify === 'Department_And_Role' ? 2 : typeReceiveNotify === 'All' ? 1 : 3
        }

        try {
            await updateNotification(data).unwrap()
        } catch (error) {
            if (error.status === 403) {
                toast('Bạn không có quyền tạo. Vui lòng tải lại trang', 'error')
            } else {
                toast('Có lỗi xảy ra khi tạo thông báo. Vui lòng thử lại!' + error, 'error')
            }
        }
    }

    const handleSaveAndClose = async () => {
        setIsSubmit(true)
        if (
            typeNotification === '' ||
            title === '' ||
            content === '' ||
            (typeReceiveNotify === 'Specific_Users' && selectedUsers.length === 0) ||
            (typeReceiveNotify === 'Department_And_Role' &&
                (selectedDepartment.length === 0 || selectedRole.length === 0))
        ) {
            return
        }

        const data = {
            Type: typeNotification,
            Content: content,
            Title: title,
            ListUser: selectedUsers.map(x => x.Id),
            ListFile: files,
            Id: id,
            UserId: userSentNotificationId,
            ListDept: selectedDepartment.map(x => x.Id),
            ListRole: selectedRole.map(x => x.Id),
            TypeToNotify: typeReceiveNotify === 'Department_And_Role' ? 2 : typeReceiveNotify === 'All' ? 1 : 3
        }

        try {
            await updateNotification(data).unwrap()
        } catch (error) {
            if (error.status === 403) {
                toast('Bạn không có quyền tạo. Vui lòng tải lại trang', 'error')
            } else {
                toast('Có lỗi xảy ra khi tạo thông báo. Vui lòng thử lại!' + error, 'error')
            }
        }

        router.push('/admin')
    }

    const handleDeleteUserChip = (userId: string) => {
        dispatch(
            selectedUsersToNotifySlice.actions.updateSelectedUsersToNotifySlice(
                selectedUsers.filter(temp => temp.Id !== userId)
            )
        )
    }
    const handleDeleteRoleChip = (roleId: string) => {
        dispatch(
            selectedRolesToNotifySlice.actions.updateSelectedRolesToNotifySlice(
                selectedRole.filter(temp => temp.Id !== roleId)
            )
        )
    }
    const handleDeleteDeptChip = (id: number) => {
        dispatch(
            selectedDepartmentsToNotifySlice.actions.updateSelectedDepartmentsToNotifySlice(
                selectedDepartment.filter(temp => temp.Id !== id)
            )
        )
    }

    if (isLoadingNotification) {
        return <Loading />
    }

    return (
        <Box width='100%'>
            <Paper
                elevation={0}
                sx={{
                    background: 'var(--background-item)',
                    width: '100%',
                    padding: '24px',
                    overflow: 'hidden',
                    borderRadius: '15px'
                }}
            >
                <Typography
                    sx={{
                        fontSize: '22px',
                        fontWeight: 'bold',
                        color: 'var(--text-color)',
                        marginBottom: '20px'
                    }}
                >
                    {t('COMMON.CREATE_NOTIFICATION.TITLE_PAGE')}
                </Typography>

                <Box sx={{ display: 'flex', gap: '20px', mt: '7px' }}>
                    <Box width='100%'>
                        <TextField
                            label={t('COMMON.CREATE_NOTIFICATION.TITLE*')}
                            multiline
                            maxRows={4}
                            {...(isSubmit === true && title === '' && { error: true })}
                            sx={{
                                width: '100%',
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
                            value={title}
                            onChange={e => setTitle(e.target.value)}
                        />
                        <Typography
                            sx={{
                                visibility: isSubmit === true && title === '' ? 'visible' : 'hidden',
                                color: 'var(--error-color)',
                                margin: '1px 0 0 10px',
                                fontSize: '12px'
                            }}
                        >
                            {t('COMMON.TEXTFIELD.REQUIRED')}
                        </Typography>
                    </Box>
                    <Box>
                        <FormControl
                            sx={{
                                width: '140px',
                                '& fieldset': {
                                    borderRadius: '8px',
                                    borderColor: 'var(--border-color)' // Viền mặc định
                                },
                                '& .MuiOutlinedInput-root:hover fieldset': {
                                    borderColor: 'var(--hover-field-color)' // Màu hover khi không lỗi
                                },
                                '& .MuiOutlinedInput-root.Mui-error:hover fieldset': {
                                    borderColor: 'var(--error-color)' // Màu hover khi lỗi
                                },
                                '& .MuiOutlinedInput-root.Mui-error fieldset': {
                                    borderColor: 'var(--error-color)' // Màu viền khi lỗi
                                },
                                '& .MuiOutlinedInput-root.Mui-focused fieldset': {
                                    borderColor: 'var(--selected-field-color)' // Màu viền khi focus
                                },
                                '& .MuiOutlinedInput-root.Mui-error.Mui-focused fieldset': {
                                    borderColor: 'var(--error-color)' // Màu viền khi lỗi và focus
                                },
                                '& .MuiInputLabel-root': {
                                    color: 'var(--text-label-color)' // Label mặc định
                                },
                                '& .MuiInputLabel-root.Mui-focused': {
                                    color: 'var(--selected-field-color)' // Label khi focus
                                },
                                '& .MuiInputLabel-root.Mui-error': {
                                    color: 'var(--error-color)' // Label khi lỗi
                                }
                            }}
                            {...(isSubmit && typeNotification === '' && { error: true })}
                        >
                            <InputLabel
                                id='select-label'
                                sx={{
                                    color:
                                        isSubmit && typeNotification === ''
                                            ? 'var(--error-color)'
                                            : 'var(--text-label-color)',
                                    '&.Mui-focused': {
                                        color:
                                            isSubmit && typeNotification === ''
                                                ? 'var(--error-color)'
                                                : 'var(--selected-color)'
                                    }
                                }}
                            >
                                {t('COMMON.CREATE_NOTIFICATION.TYPE')}
                            </InputLabel>
                            <Select
                                labelId='select-label'
                                open={openSelectType}
                                onClose={handleCloseSelectType}
                                onOpen={handleOpenSelectType}
                                value={typeNotification}
                                onChange={handleChange}
                                label={t('COMMON.CREATE_NOTIFICATION.TYPE')}
                                autoFocus={false}
                                sx={{
                                    '&:hover .MuiOutlinedInput-notchedOutline': {
                                        borderColor:
                                            isSubmit && typeNotification === ''
                                                ? 'var(--error-color)'
                                                : 'var(--hover-color)' // Khi hover
                                    },
                                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                        borderColor:
                                            isSubmit && typeNotification === ''
                                                ? 'var(--error-color)'
                                                : 'var(--selected-color)' // Khi focus
                                    },
                                    '& fieldset': {
                                        borderRadius: '8px',
                                        borderColor:
                                            isSubmit && typeNotification === ''
                                                ? 'var(--error-color)'
                                                : 'var(--border-color)' // Viền khi không focus
                                    },
                                    '& .MuiSelect-icon': {
                                        color:
                                            isSubmit && typeNotification === ''
                                                ? 'var(--error-color)'
                                                : 'var(--text-color)' // Màu icon dropdown
                                    },
                                    '& .MuiInputBase-input': {
                                        color: 'var(--text-color)' // Màu text
                                    }
                                }}
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
                                            mt: 'px',
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
                                                    backgroundColor: 'var(--background-selected-item)',
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
                                <MenuItem value={'Public'}>{t('COMMON.NOTIFICATION_TYPE.PUBLIC')}</MenuItem>
                                <MenuItem value={'Salary'}>{t('COMMON.NOTIFICATION_TYPE.SALARY')}</MenuItem>
                                <MenuItem value={'Reward'}>{t('COMMON.NOTIFICATION_TYPE.REWARD')}</MenuItem>
                                <MenuItem value={'Holiday'}>{t('COMMON.NOTIFICATION_TYPE.EVENT')}</MenuItem>
                                <MenuItem value={'Discipline'}>{t('COMMON.NOTIFICATION_TYPE.DISCIPLINE')}</MenuItem>
                                <MenuItem value={'Timekeeping'}>{t('COMMON.NOTIFICATION_TYPE.ATTENDANCE')}</MenuItem>
                            </Select>
                        </FormControl>
                        <Typography
                            sx={{
                                visibility: isSubmit === true && typeNotification === '' ? 'visible' : 'hidden',
                                color: 'var(--error-color)',
                                margin: '1px 0 0 10px',
                                fontSize: '12px'
                            }}
                        >
                            {t('COMMON.TEXTFIELD.REQUIRED')}
                        </Typography>
                    </Box>
                </Box>

                <Box
                    sx={{
                        mt: '7px'
                    }}
                >
                    <TextField
                        label={t('COMMON.CREATE_NOTIFICATION.CONTENT*')}
                        multiline
                        {...(isSubmit === true && content === '' && { error: true })}
                        maxRows={8}
                        minRows={4}
                        sx={{
                            width: '100%',
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
                    <Typography
                        sx={{
                            visibility: isSubmit === true && content === '' ? 'visible' : 'hidden',
                            color: 'var(--error-color)',
                            margin: '1px 0 0 10px',
                            fontSize: '12px'
                        }}
                    >
                        {t('COMMON.TEXTFIELD.REQUIRED')}
                    </Typography>
                </Box>

                <Box sx={{ display: 'flex', gap: '15px', mt: '7px' }}>
                    <FormControl>
                        <FormLabel
                            id='demo-row-radio-buttons-group-label'
                            sx={{
                                color: 'var(--text-color)'
                            }}
                        >
                            {t('COMMON.CREATE_NOTIFICATION.USERS_TO_NOTIFY')}
                        </FormLabel>
                        <RadioGroup
                            aria-labelledby='demo-row-radio-buttons-group-label'
                            name='row-radio-buttons-group'
                            value={typeReceiveNotify}
                            onChange={e => setTypeReceiveNotify(e.target.value)}
                        >
                            <FormControlLabel
                                value='All'
                                control={
                                    <Radio
                                        sx={{
                                            color: 'var(--text-color)',
                                            '&.Mui-checked': {
                                                color: 'var(--button-color)'
                                            },
                                            '&:hover': {
                                                backgroundColor: 'var(--hover-color)'
                                            }
                                        }}
                                    />
                                }
                                label={t('COMMON.CREATE_NOTIFICATION.ALL_USERS')}
                                sx={{
                                    color: 'var(--text-color)'
                                }}
                            />
                            <FormControlLabel
                                value='Department_And_Role'
                                control={
                                    <Radio
                                        sx={{
                                            color: 'var(--text-color)',
                                            '&.Mui-checked': {
                                                color: 'var(--button-color)'
                                            },
                                            '&:hover': {
                                                backgroundColor: 'var(--hover-color)'
                                            }
                                        }}
                                    />
                                }
                                label={t('COMMON.CREATE_NOTIFICATION.DEPARTMENT_AND_ROLE')}
                                onClick={() => setOpenDepartmentAndRolesModal(true)}
                                sx={{
                                    color: 'var(--text-color)'
                                }}
                            />
                            <FormControlLabel
                                value='Specific_Users'
                                control={
                                    <Radio
                                        sx={{
                                            color: 'var(--text-color)',
                                            '&.Mui-checked': {
                                                color: 'var(--button-color)'
                                            },
                                            '&:hover': {
                                                backgroundColor: 'var(--hover-color)'
                                            }
                                        }}
                                    />
                                }
                                label={t('COMMON.CREATE_NOTIFICATION.SPECIFIC_USERS')}
                                onClick={() => setOpenSpecificUsersModal(true)}
                                sx={{
                                    color: 'var(--text-color)'
                                }}
                            />
                        </RadioGroup>
                    </FormControl>

                    <Box display='flex' flexDirection='column' flex={1}>
                        <Box
                            flex={1}
                            display={typeReceiveNotify === 'All' ? 'none' : 'block'}
                            sx={{
                                border:
                                    (typeReceiveNotify === 'Specific_Users' &&
                                        selectedUsers.length === 0 &&
                                        isSubmit) ||
                                    (typeReceiveNotify === 'Department_And_Role' &&
                                        (selectedDepartment.length === 0 || selectedRole.length === 0) &&
                                        isSubmit)
                                        ? '1px solid var(--error-color)'
                                        : '1px solid var(--border-color)',
                                height: '100%',
                                borderRadius: '10px',
                                padding: '18px'
                            }}
                        >
                            <Box>
                                <Typography
                                    sx={{
                                        color: 'var(--text-color)'
                                    }}
                                    display={typeReceiveNotify === 'Department_And_Role' ? 'block' : 'none'}
                                >
                                    {t('COMMON.CREATE_NOTIFICATION.BY_DEPARTMENT_H')}
                                </Typography>
                                {typeReceiveNotify === 'Department_And_Role' &&
                                    (selectedDepartment.length === 0 ? (
                                        <Typography
                                            sx={{ fontStyle: 'italic', color: 'var(--button-alert-hover-color)' }}
                                        >
                                            {t('COMMON.CREATE_NOTIFICATION.EMPTY')}
                                        </Typography>
                                    ) : (
                                        selectedDepartment.map((dept, index) => (
                                            <Chip
                                                key={index}
                                                onDelete={() => handleDeleteDeptChip(dept.Id)}
                                                sx={{
                                                    mr: '10px',
                                                    mt: '10px',
                                                    color: 'var(--text-color)',
                                                    '& .MuiChip-deleteIcon': {
                                                        color: 'var(--icon-delete-chip-color)',
                                                        '&:hover': {
                                                            color: 'var(--hover-icon-delete-chip-color)'
                                                        }
                                                    }
                                                }}
                                                label={dept.Name}
                                                variant='outlined'
                                            />
                                        ))
                                    ))}
                            </Box>

                            <Box>
                                <Typography
                                    display={typeReceiveNotify === 'Department_And_Role' ? 'block' : 'none'}
                                    sx={{
                                        mt: '14px',
                                        color: 'var(--text-color)'
                                    }}
                                >
                                    {'Theo vai trò:'}
                                </Typography>
                                {typeReceiveNotify === 'Department_And_Role' &&
                                    (selectedRole.length === 0 ? (
                                        <Typography
                                            sx={{ fontStyle: 'italic', color: 'var(--button-alert-hover-color)' }}
                                        >
                                            {t('COMMON.CREATE_NOTIFICATION.EMPTY')}
                                        </Typography>
                                    ) : (
                                        selectedRole.map((role, index) => (
                                            <Chip
                                                key={index}
                                                onDelete={() => handleDeleteRoleChip(role.Id)}
                                                sx={{
                                                    mr: '10px',
                                                    mt: '10px',
                                                    color: 'var(--text-color)',
                                                    '& .MuiChip-deleteIcon': {
                                                        color: 'var(--icon-delete-chip-color)',
                                                        '&:hover': {
                                                            color: 'var(--hover-icon-delete-chip-color)'
                                                        }
                                                    }
                                                }}
                                                label={role.Name}
                                                variant='outlined'
                                            />
                                        ))
                                    ))}
                            </Box>

                            <Box>
                                <Typography
                                    sx={{
                                        color: 'var(--text-color)'
                                    }}
                                    display={typeReceiveNotify === 'Specific_Users' ? 'block' : 'none'}
                                >
                                    {t('COMMON.CREATE_NOTIFICATION.USERS_WILL_SEE_THE_POST')}
                                </Typography>
                                {typeReceiveNotify === 'Specific_Users' &&
                                    (selectedUsers.length === 0 ? (
                                        <Typography
                                            sx={{ fontStyle: 'italic', color: 'var(--button-alert-hover-color)' }}
                                        >
                                            {t('COMMON.CREATE_NOTIFICATION.EMPTY')}
                                        </Typography>
                                    ) : (
                                        selectedUsers.map((user, index) => (
                                            <Chip
                                                key={index}
                                                avatar={
                                                    user.AvatarPath ? (
                                                        <Avatar alt='avatar' src={user.AvatarPath} />
                                                    ) : (
                                                        <Avatar>{user.FullName[0]}</Avatar>
                                                    )
                                                }
                                                onDelete={() => handleDeleteUserChip(user.Id)}
                                                sx={{
                                                    mr: '10px',
                                                    mt: '10px',
                                                    color: 'var(--text-color)',
                                                    '& .MuiChip-deleteIcon': {
                                                        color: 'var(--icon-delete-chip-color)',
                                                        '&:hover': {
                                                            color: 'var(--hover-icon-delete-chip-color)'
                                                        }
                                                    }
                                                }}
                                                label={user.FullName}
                                                variant='outlined'
                                            />
                                        ))
                                    ))}
                            </Box>
                        </Box>
                        <Typography
                            sx={{
                                visibility:
                                    isSubmit === true &&
                                    ((typeReceiveNotify === 'Specific_Users' && selectedUsers.length === 0) ||
                                        (typeReceiveNotify === 'Department_And_Role' &&
                                            (selectedDepartment.length === 0 || selectedRole.length === 0)))
                                        ? 'visible'
                                        : 'hidden',
                                color: 'var(--error-color)',
                                margin: '1px 0 0 10px',
                                fontSize: '12px'
                            }}
                        >
                            {t('COMMON.TEXTFIELD.REQUIRED')}
                        </Typography>
                    </Box>
                </Box>

                <Box sx={{ mt: '5px' }}>
                    <UploadFiles files={files} initialFiles={notification.ListFile} setFiles={setFiles} />
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '20px', mt: '25px' }}>
                    <LoadingButton
                        variant='contained'
                        {...(isLoading && { loading: true })}
                        loadingPosition='start'
                        startIcon={<SaveIcon />}
                        sx={{
                            height: '53px',
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
                            height: '53px',
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
                            height: '53px',
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
                            router.push('/admin')
                        }}
                    >
                        {t('COMMON.BUTTON.CLOSE')}
                    </Button>
                </Box>
            </Paper>
            <SpecificUsersModal open={openSpecificUsersModal} handleClose={handleCloseSpecificUsersModal} />
            <DepartmentAndRoleModal
                open={openDepartmentAndRolesModal}
                handleClose={handleCloseDepartmentAndRolesModal}
            />
        </Box>
    )
}

export default Page
