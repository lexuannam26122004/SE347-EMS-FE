'use client'

import { Box, Modal, Paper, TextField, Typography } from '@mui/material'
import { X } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { SaveIcon } from 'lucide-react'
import React from 'react'
import LoadingButton from '@mui/lab/LoadingButton'
import { useCreateErrorReportsMutation, useSearchErrorReportQuery } from '@/services/ErrorReportService'
import { useToast } from '@/hooks/useToast'
import { useEffect, useState } from 'react'
import { IAspNetUserGetAll } from '@/models/AspNetUser'
import { useGetAllUsersQuery } from '@/services/AspNetUserService'
import Loading from '@/components/Loading'

interface Props {
    open: boolean
    handleToggle: () => void
    reportedBy: string
    type?: string
    typeId?: string
}

function DetailModal({ open, handleToggle, reportedBy, type, typeId }: Props) {
    const { t } = useTranslation('common')
    const toast = useToast()
    const [isSaveLoading, setIsSaveLoading] = useState(false)
    const [isSubmit, setIsSubmit] = useState(false)

    const [Type, setType] = useState(type)
    const reportedDate = new Date()
    const [TypeId, setTypeId] = useState(typeId)
    const [description, setDescription] = useState('')

    const { data: userResponse, isLoading: isUsersLoading } = useGetAllUsersQuery()
    const employee = (userResponse?.Data?.Records as IAspNetUserGetAll[]) || []

    const user = employee.find(em => em.Id === reportedBy)

    const [createErrorReport, { isSuccess, isError, reset }] = useCreateErrorReportsMutation()
    const { refetch } = useSearchErrorReportQuery(null)

    useEffect(() => {
        if (isSuccess === true) {
            toast(t('Tạo báo lỗi thành công'), 'success')
            refetch()
            reset()
        }
        if (isError === true) {
            toast(t('Tạo báo lỗi thất bại'), 'error')
            reset()
        }
    }, [isSuccess, isError, toast, t, reset, refetch])

    const handleSave = async () => {
        setIsSaveLoading(true)
        setIsSubmit(true)
        if (reportedBy === '' || Type === '' || TypeId === '') {
            setIsSaveLoading(false)
            return
        }
        const data = {
            ReportedBy: reportedBy,
            Type: Type,
            TypeId: TypeId,
            ReportedDate: reportedDate.toISOString().split('T')[0],
            Description: description
        }
        try {
            await createErrorReport(data).unwrap()
        } finally {
            setIsSaveLoading(false)
            handleToggle()
        }
        setIsSubmit(false)
    }

    if (isUsersLoading) {
        return <Loading />
    }

    return (
        <Modal open={open} onClose={handleToggle}>
            <Paper
                elevation={0}
                sx={{
                    width: '50%',
                    height: '70vh',
                    position: 'absolute',
                    overflowY: 'auto',
                    top: '50%',
                    left: '50%',
                    backgroundColor: 'var(--background-color)',
                    border: '1px solid var(--border-color)',
                    borderRadius: '10px',
                    transform: 'translate(-50%, -50%)',
                    '&::-webkit-scrollbar': {
                        display: 'none'
                    }
                }}
            >
                <Box
                    sx={{
                        paddingBlock: 1.4,
                        paddingInline: 9,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        zIndex: '1',
                        position: 'sticky',
                        top: 0,
                        height: '10%',
                        backgroundColor: 'var(--background-color)',
                        borderBottom: '1px solid var(--border-color)'
                    }}
                >
                    <Typography
                        variant='h6'
                        sx={{
                            fontWeight: 'Bold',
                            fontSize: '18px',
                            textAlign: 'center',
                            margin: 'auto',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                            color: 'var(--text-color)'
                        }}
                    >
                        {t('COMMON.ERROR_REPORT.ERROR_REPORT')}
                    </Typography>

                    <Box
                        sx={{
                            position: 'absolute',
                            right: '16px',
                            top: '8px',
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
                        onClick={handleToggle}
                    >
                        <X style={{ color: 'var(--text-color)' }} />
                    </Box>
                </Box>

                <Box
                    sx={{
                        width: '100%',
                        height: '90%',
                        backgroundColor: 'var(--background-item)',
                        padding: '24px',
                        boxShadow: 'var(--box-shadow-paper)'
                    }}
                >
                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'center',
                            gap: '20px',
                            mt: '15px'
                        }}
                    >
                        <Box
                            sx={{
                                width: 'calc(50% - 10px)'
                            }}
                        >
                            <TextField
                                variant='outlined'
                                label={t('COMMON.TIMEOFF.INFORMATION') + '*'}
                                type='text'
                                fullWidth
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
                                value={`${user?.EmployeeId} ${user?.FullName}`}
                                InputProps={{
                                    readOnly: true
                                }}
                            />
                            <Typography
                                sx={{
                                    color: 'red',
                                    margin: '1px 0 0 10px',
                                    fontSize: '12px',
                                    visibility: 'hidden'
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
                                label={t('COMMON.SYS_CONFIGURATION.ACTION_CONFIGURATION.TYPE')}
                                fullWidth
                                {...(isSubmit && Type === '' && { error: true })}
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
                                value={t(Type)}
                                onChange={e => setType(e.target.value)}
                                InputProps={{
                                    readOnly: Type !== ''
                                }}
                            />
                            <Typography
                                sx={{
                                    color: 'var(--error-color)',
                                    margin: '1px 0 0 10px',
                                    fontSize: '12px',
                                    visibility: isSubmit && Type === '' ? 'visible' : 'hidden'
                                }}
                            >
                                {t('COMMON.TEXTFIELD.REQUIRED')}
                            </Typography>
                        </Box>
                    </Box>

                    <Box
                        sx={{
                            display: 'none',
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
                                label={t('Ngày tạo báo cáo') + '*'}
                                type='date'
                                fullWidth
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
                                value={reportedDate.toISOString().split('T')[0]}
                                InputProps={{
                                    readOnly: true
                                }}
                            />
                            <Typography
                                sx={{
                                    color: 'red',
                                    margin: '1px 0 0 10px',
                                    fontSize: '12px',
                                    visibility: 'hidden'
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
                                label={t('Mã loại')}
                                fullWidth
                                {...(isSubmit && TypeId === '' && { error: true })}
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
                                value={TypeId}
                                onChange={e => setTypeId(e.target.value)}
                                InputProps={{
                                    readOnly: TypeId !== ''
                                }}
                            />
                            <Typography
                                sx={{
                                    color: 'var(--error-color)',
                                    margin: '1px 0 0 10px',
                                    fontSize: '12px',
                                    visibility: isSubmit && TypeId === '' ? 'visible' : 'hidden'
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
                        minRows={8}
                        maxRows={8}
                        sx={{
                            mt: '20px',
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
                        value={description}
                        onChange={e => setDescription(e.target.value)}
                    />

                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '20px',
                            mt: '20px'
                        }}
                    >
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
                            {t('COMMON.BUTTON.SAVE_AND_CLOSE')}
                        </LoadingButton>
                    </Box>
                </Box>
            </Paper>
        </Modal>
    )
}

export default DetailModal
