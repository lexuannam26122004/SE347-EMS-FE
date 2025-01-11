'use client'

interface IGetAllErrorReport {
    Id: number | null
    ReportedBy: string | null
    ReportedDate: string | null
    Type: string | null
    TypeId: string | null
    Description: string | null
    Status: string | null
    ResolvedBy: string | null
    ResolvedDate: string | null
    ResolutionDetails: string | null
    ReportedFullName: string | null
    ReportedId: string | null
    ReportedAvatarPath: string | null
    ResolvedFullName: string | null
    ResolvedId: string | null
    ResolvedAvatarPath: string | null
}

import { formatDate } from '@/utils/formatDate'
import {
    Box,
    Divider,
    Modal,
    Paper,
    TableContainer,
    Table,
    Typography,
    TableRow,
    TableBody,
    TableCell,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem
} from '@mui/material'
import LoadingButton from '@mui/lab/LoadingButton'
import { useState } from 'react'
import { SaveIcon } from 'lucide-react'
import { X } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useUpdateErrorReportsMutation, useSearchErrorReportQuery } from '@/services/ErrorReportService'

interface Props {
    open: boolean
    handleToggle: () => void
    configuration: IGetAllErrorReport
}

function DetailModal({ open, handleToggle, configuration }: Props) {
    const { t } = useTranslation('common')
    const [isSaveAndCloseLoading, setIsSaveAndCloseLoading] = useState(false)
    const [status, setStatus] = useState(configuration?.Status)
    const [resolutionDetails, setResolutionDetails] = useState(configuration?.ResolutionDetails)

    const [update] = useUpdateErrorReportsMutation()
    const { refetch } = useSearchErrorReportQuery(null)

    const handleSave = async () => {
        setIsSaveAndCloseLoading(true)
        const data = {
            ReportedBy: configuration?.ReportedBy,
            ReportedDate: configuration?.ReportedDate,
            Type: configuration?.Type,
            TypeId: configuration?.TypeId,
            Description: configuration?.Description,
            Status: status,
            ResolvedBy: configuration?.ResolvedBy,
            ResolvedDate: configuration?.ResolvedDate,
            ResolutionDetails: resolutionDetails,
            Id: configuration?.Id
        }

        try {
            await update(data).unwrap()
        } finally {
            setIsSaveAndCloseLoading(false)
            refetch()
            handleToggle()
        }
    }

    return (
        <Modal open={open} onClose={handleToggle}>
            <Paper
                elevation={0}
                sx={{
                    width: '50%',
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    backgroundColor: 'var(--background-color)',
                    border: '1px solid var(--border-color)',
                    borderRadius: '15px',
                    overflow: 'hidden',
                    transform: 'translate(-50%, -50%)',
                    paddingBottom: '24px'
                }}
            >
                <Box
                    sx={{
                        paddingBlock: 1.6,
                        paddingInline: 9,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        zIndex: '1',
                        position: 'relative'
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
                        {t('COMMON.BUTTON.VIEW_DETAIL')}
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
                <Divider sx={{ zIndex: '1', borderColor: 'var(--border-color)' }} />

                <TableContainer
                    sx={{
                        padding: '20px 17px 0px 24px',
                        maxHeight: '80vh',
                        scrollbarGutter: 'stable',
                        '&::-webkit-scrollbar': {
                            width: '7px',
                            height: '7px',
                            backgroundColor: 'var(--background-after-color)'
                        },
                        '&::-webkit-scrollbar-thumb': {
                            backgroundColor: 'var(--scrollbar-color)',
                            borderRadius: '10px'
                        },
                        overflow: 'auto',
                        '&::-webkit-scrollbar-corner': {
                            borderRadius: '10px'
                        }
                    }}
                >
                    <Table>
                        <TableBody>
                            {[
                                {
                                    label: t('COMMON.ERROR_REPORT.FULL_NAME_REPORTED'),
                                    value: `${configuration?.ReportedId ?? 'N/A'}  ${
                                        configuration?.ReportedFullName ?? 'N/A'
                                    }`
                                },
                                {
                                    label: t('COMMON.ERROR_REPORT.TYPE'),
                                    value: t(String(configuration?.Type)) || 'N/A'
                                },
                                {
                                    label: t('COMMON.ERROR_REPORT.TYPE_ID'),
                                    value: t(String(configuration?.TypeId)) || 'N/A'
                                },
                                {
                                    label: t('COMMON.ERROR_REPORT.REPORTED_DATE'),
                                    value: formatDate(configuration?.ReportedDate?.toString()) || 'N/A'
                                },
                                {
                                    label: t('COMMON.ERROR_REPORT.DESCRIPTION'),
                                    value: configuration?.Description || 'N/A'
                                },

                                {
                                    label: t('COMMON.ERROR_REPORT.FULL_NAME_RESOLVED'),
                                    value: `${configuration?.ResolvedId ?? 'N/A'}  ${
                                        configuration?.ResolvedFullName ?? 'N/A'
                                    }`
                                },
                                {
                                    label: t('COMMON.ERROR_REPORT.RESOLVED_DATE'),
                                    value: formatDate(configuration?.ResolvedDate?.toString()) || 'N/A'
                                }
                            ].map((item, index) => (
                                <TableRow key={index}>
                                    <TableCell
                                        sx={{
                                            fontSize: '16px',
                                            fontWeight: 'bold',
                                            whiteSpace: 'nowrap',
                                            color: 'var(--text-color)',
                                            borderBottom: 'none',
                                            padding: '8px'
                                        }}
                                    >
                                        {item.label}:
                                    </TableCell>
                                    <TableCell
                                        sx={{
                                            color: 'var(--text-color)',
                                            fontSize: '16px',
                                            borderBottom: 'none',
                                            padding: '8px'
                                        }}
                                    >
                                        {item.value}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>

                <Box
                    sx={{
                        padding: '20px 17px 0px 24px',
                        maxHeight: '80vh',
                        scrollbarGutter: 'stable',
                        '&::-webkit-scrollbar': {
                            width: '7px',
                            height: '7px',
                            backgroundColor: 'var(--background-after-color)'
                        },
                        '&::-webkit-scrollbar-thumb': {
                            backgroundColor: 'var(--scrollbar-color)',
                            borderRadius: '10px'
                        },
                        overflow: 'auto',
                        '&::-webkit-scrollbar-corner': {
                            borderRadius: '10px'
                        }
                    }}
                >
                    <FormControl
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
                    >
                        <InputLabel>{t('COMMON.ERROR_REPORT.STATUS')}</InputLabel>

                        <Select
                            labelId='gender-label'
                            id='gender'
                            value={status}
                            label={t('COMMON.ERROR_REPORT.STATUS')}
                            onChange={e => setStatus(e.target.value)}
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
                            <MenuItem value='0'>{t('COMMON.ERROR_REPORT.PENDING')} </MenuItem>
                            <MenuItem value='1'>{t('COMMON.ERROR_REPORT.IN_PROGRESS')}</MenuItem>
                            <MenuItem value='2'>{t('COMMON.ERROR_REPORT.RESOLVED')}</MenuItem>
                            <MenuItem value='3'>{t('COMMON.ERROR_REPORT.REJECTED')}</MenuItem>
                        </Select>
                    </FormControl>

                    <TextField
                        variant='outlined'
                        label={t('COMMON.ERROR_REPORT.RESOLUTION_DETAILS')}
                        id='fullWidth'
                        fullWidth
                        multiline
                        minRows={4}
                        maxRows={4}
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
                        value={resolutionDetails}
                        onChange={e => setResolutionDetails(e.target.value)}
                    />
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '20px', mt: '20px' }}>
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
                        onClick={handleSave}
                    >
                        {t('COMMON.BUTTON.SAVE_AND_CLOSE')}
                    </LoadingButton>
                </Box>
            </Paper>
        </Modal>
    )
}

export default DetailModal
