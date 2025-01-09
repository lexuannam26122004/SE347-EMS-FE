'use client'
import LoadingButton from '@mui/lab/LoadingButton'
import {
    Box,
    Paper,
    TextField,
    Typography,
    Button,
    FormControl,
    FormLabel,
    FormControlLabel,
    RadioGroup,
    Chip,
    Avatar
} from '@mui/material'
import { SaveIcon } from 'lucide-react'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { XIcon } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useCreateUsersMutation } from '@/services/JobHistoryService'
import Radio from '@mui/material/Radio'
import SpecificUsersModal from './SpecificUsersModal'
import {
    selectedUsersToNotifySlice,
    selectedUsersToNotifySliceSelector
} from '@/redux/slices/selectedUsersToNotifySlice'
import { useSelector, useDispatch } from 'react-redux'
import {
    selectedDepartmentsToNotifySelector,
    selectedDepartmentsToNotifySlice
} from '@/redux/slices/selectedDepartmentsToNotifySlice'
import { selectedRolesToNotifySelector, selectedRolesToNotifySlice } from '@/redux/slices/selectedRolesToNotifySlice'

const getCurrentDateTime = () => {
    const now = new Date()
    const year = now.getFullYear()
    const month = String(now.getMonth() + 1).padStart(2, '0')
    const day = String(now.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
}

function Create() {
    const { t } = useTranslation('common')
    const router = useRouter()
    const [create, { isLoading }] = useCreateUsersMutation()
    const [isSubmit, setIsSubmit] = useState(false)
    const dispatch = useDispatch()
    const [typeReceiveNotify, setTypeReceiveNotify] = useState('All')
    const [openSpecificUsersModal, setOpenSpecificUsersModal] = useState(false)
    const selectedUsers = useSelector(selectedUsersToNotifySliceSelector)
    const selectedDepartment = useSelector(selectedDepartmentsToNotifySelector)
    const selectedRole = useSelector(selectedRolesToNotifySelector)
    const [startDate, setStartDate] = useState('')
    const [endDate, setEndDate] = useState('')
    const [note, setNote] = useState('')
    const [jobDescription, setJobDescription] = useState('')
    const [workLocation, setWorkLocation] = useState('')
    const [allowance, setAllowance] = useState('')

    const handleCloseSpecificUsersModal = () => {
        setOpenSpecificUsersModal(false)
    }

    useEffect(() => {
        setStartDate(getCurrentDateTime())
        setEndDate(getCurrentDateTime())
    }, [])

    const handleSaveAndClose = async () => {
        setIsSubmit(true)
        if (
            jobDescription === '' ||
            workLocation === '' ||
            workLocation === '' ||
            (typeReceiveNotify === 'Specific_Users' && selectedUsers.length === 0)
        ) {
            return
        }

        const data = {
            StartDate: startDate,
            EndDate: endDate,
            Note: note,
            JobDescription: jobDescription,
            WorkLocation: workLocation,
            Allowance: allowance,
            ListUser: selectedUsers.map(x => x.Id),
            TypeToNotify: typeReceiveNotify === 'All' ? 1 : 0
        }

        await create(data).unwrap()

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
                    {t('COMMON.JOBHISTORY.CREATE_NEW_JOB')}
                </Typography>

                <Box sx={{ display: 'flex', gap: '20px', mt: '7px' }}>
                    <Box width='100%'>
                        <TextField
                            label={t('COMMON.JOBHISTORY.JOBDESCRIPTION') + '*'}
                            multiline
                            maxRows={4}
                            {...(isSubmit === true && jobDescription === '' && { error: true })}
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
                            value={jobDescription}
                            onChange={e => setJobDescription(e.target.value)}
                        />
                        <Typography
                            sx={{
                                visibility: isSubmit === true && jobDescription === '' ? 'visible' : 'hidden',
                                color: 'var(--error-color)',
                                margin: '1px 0 0 10px',
                                fontSize: '12px'
                            }}
                        >
                            {t('COMMON.TEXTFIELD.REQUIRED')}
                        </Typography>
                    </Box>
                </Box>

                <Box sx={{ display: 'flex', gap: '20px', mt: '7px' }}>
                    <Box
                        sx={{
                            width: 'calc(50% - 10px)'
                        }}
                    >
                        <TextField
                            variant='outlined'
                            label={t('COMMON.JOBHISTORY.STARTDATE') + '*'}
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
                            label={t('COMMON.JOBHISTORY.ENDDATE') + '*'}
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

                <Box sx={{ display: 'flex', gap: '20px', mt: '7px' }}>
                    <Box
                        sx={{
                            width: 'calc(50% - 10px)'
                        }}
                    >
                        <TextField
                            variant='outlined'
                            label={t('COMMON.JOBHISTORY.WORKLOCATION') + '*'}
                            type='text'
                            fullWidth
                            {...(isSubmit && workLocation === '' && { error: true })}
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
                            value={workLocation}
                            onChange={e => setWorkLocation(e.target.value)}
                        />
                        <Typography
                            sx={{
                                color: 'red',
                                margin: '1px 0 0 10px',
                                fontSize: '12px',
                                visibility: isSubmit && workLocation === '' ? 'visible' : 'hidden'
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
                            label={t('COMMON.JOBHISTORY.ALLOWANCE') + '*'}
                            type='text'
                            fullWidth
                            {...(isSubmit && allowance === '' && { error: true })}
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
                            value={allowance}
                            onChange={e => setAllowance(e.target.value)}
                        />
                        <Typography
                            sx={{
                                color: 'red',
                                margin: '1px 0 0 10px',
                                fontSize: '12px',
                                visibility: isSubmit && allowance === '' ? 'visible' : 'hidden'
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
                        label={t('COMMON.JOBHISTORY.NOTE') + '*'}
                        multiline
                        {...(isSubmit === true && note === '' && { error: true })}
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
                        value={note}
                        onChange={e => setNote(e.target.value)}
                    />
                    <Typography
                        sx={{
                            visibility: isSubmit === true && note === '' ? 'visible' : 'hidden',
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
                            {t('COMMON.JOBHISTORY.ASSIGNEE')}
                        </FormLabel>
                        <RadioGroup
                            aria-labelledby='demo-row-radio-buttons-group-label'
                            name='row-radio-buttons-group'
                            defaultValue={'All'}
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
                                borderRadius: '6px',
                                padding: '15px'
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
                                    {t('COMMON.CREATE_NOTIFICATION.BY_ROLE_H')}
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

                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '20px', mt: '20px' }}>
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
        </Box>
    )
}

export default Create
