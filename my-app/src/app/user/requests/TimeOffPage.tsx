'use client'

import { Box, Modal, Paper, TextField, Typography } from '@mui/material'
import { X } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { SaveIcon } from 'lucide-react'
import React from 'react'
import LoadingButton from '@mui/lab/LoadingButton'

import { useToast } from '@/hooks/useToast'
import { useEffect, useState } from 'react'
import { useCreateTimeOffsMutation } from '@/services/TimeOffService'

interface Props {
    open: boolean
    handleToggle: () => void
    reportedBy: string
}

const getCurrentDateTime = () => {
    const now = new Date()
    const year = now.getFullYear()
    const month = String(now.getMonth() + 1).padStart(2, '0')
    const day = String(now.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
}

function DetailModal({ open, handleToggle, reportedBy }: Props) {
    const { t } = useTranslation('common')
    const toast = useToast()
    const [isSaveLoading, setIsSaveLoading] = useState(false)
    const [isSubmit, setIsSubmit] = useState(false)

    const [reason, setReason] = useState('')
    const [startDate, setStartDate] = useState('')
    const [endDate, setEndDate] = useState('')
    const [content, setContent] = useState('')

    const [createTimeOff, { isSuccess, isError, reset }] = useCreateTimeOffsMutation()

    useEffect(() => {
        if (isSuccess === true) {
            toast(t('COMMON.TIMEOFF.CREATE.SUCCESS.CREATE_TIMEOFF'), 'success')
            reset()
        }
        if (isError === true) {
            toast(t('COMMON.TIMEOFF.CREATE.ERROR.CREATE_TIMEOFF'), 'error')
            reset()
        }
    }, [isSuccess, isError, toast, t, reset])

    useEffect(() => {
        setStartDate(getCurrentDateTime())
        setEndDate(getCurrentDateTime())
    }, [])

    const handleSave = async () => {
        setIsSaveLoading(true)
        setIsSubmit(true)
        if (reason === '' || startDate === '' || endDate === '') {
            setIsSaveLoading(false)
            return
        }
        const data = {
            UserId: reportedBy,
            Reason: reason,
            StartDate: new Date(startDate),
            EndDate: new Date(endDate),
            IsAccepted: null,
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
                        {t('COMMON.TIMEOFF.CREATE.CREATE_TIMEOFF')}
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

                <Paper
                    elevation={0}
                    sx={{
                        width: '100%',
                        height: '90%',
                        overflow: 'hidden',
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
                            mt: '15px'
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
                        maxRows={4}
                        sx={{
                            mt: '15px',
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
                            {t('COMMON.BUTTON.SAVE')}
                        </LoadingButton>
                    </Box>
                </Paper>
            </Paper>
        </Modal>
    )
}

export default DetailModal
