'use client'
import { Avatar, Box, Button, FormControl, InputLabel, MenuItem, Paper, Select, Typography } from '@mui/material'
import React from 'react'
import { useTranslation } from 'react-i18next'
import Detail from './Reward'
import { formatDate } from '@/utils/formatDate'
import Discipline from './Disciplines'
import { Download } from 'lucide-react'
import Loading from '@/components/Loading'
import { SelectChangeEvent } from '@mui/material'
import { useState, useRef, useEffect } from 'react'
import { useGetAuthMeQuery } from '@/services/AuthService'
import {
    AlignJustify,
    CircleArrowOutDownLeft,
    CircleArrowOutUpRight,
    ClockAlert,
    Filter,
    LayoutGrid,
    ListCollapse,
    ScanBarcode
} from 'lucide-react'

interface info {
    AvatarPath: string
    FullName: string
    RoleName: string[]
    DepartmentName: string
    PhoneNumber: string
    Email: string
    Address: string
    StartDateWork: string
    PayrollCycle: number
    Birthday: string
}
export default function Page() {
    const { t } = useTranslation()
    const { data: responseGetMeData, isFetching: isFetchingGetMe } = useGetAuthMeQuery()
    const infoMe = responseGetMeData?.Data
    const [type, setType] = useState(0)

    const handleTypeChange = (event: SelectChangeEvent<number>) => {
        setType(event.target.value as number)
    }

    if (isFetchingGetMe) {
        return <Loading />
    }

    return (
        <Box>
            <Paper
                elevation={1}
                sx={{
                    width: '100%',
                    boxShadow: 'var(--box-shadow-paper)',
                    borderRadius: '30px',
                    padding: '35px',
                    backgroundColor: 'var(--attendance-bg1)'
                }}
            >
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'space-between'
                    }}
                >
                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            mb: '35px'
                        }}
                    >
                        <Box
                            sx={{
                                width: '5px',
                                height: '42px',
                                backgroundColor: '#4effca',
                                borderRadius: '4px',
                                mr: '14px'
                            }}
                        />
                        <Typography
                            sx={{
                                color: 'var(--text-color)',
                                fontSize: '21px',
                                fontWeight: 'bold'
                            }}
                        >
                            {t('COMMON.ATTENDANCE.DETAIL_EMPLOYEE')}
                        </Typography>
                    </Box>

                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '18px'
                        }}
                    >
                        <FormControl
                            sx={{
                                width: '140px',
                                mb: 'auto',
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
                        >
                            <InputLabel id='select-label'>{t('COMMON.STAT_NOTIFY.BY')}</InputLabel>
                            <Select
                                label={t('COMMON.STAT_NOTIFY.BY')}
                                defaultValue={1}
                                value={type}
                                onChange={handleTypeChange}
                                sx={{
                                    '&:hover .MuiOutlinedInput-notchedOutline': {
                                        borderColor: 'var(--border-color)'
                                    },
                                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                        border: '1px solid var(--border-color)' // Đặt border cho trạng thái focus
                                    },
                                    '& fieldset': {
                                        borderRadius: '8px',
                                        borderColor: 'var(--border-color)'
                                    },
                                    '& .MuiSelect-icon': {
                                        color: 'var(--text-color)'
                                    },
                                    '& .MuiInputBase-input': {
                                        color: 'var(--text-color)',
                                        padding: '9.5px 14px'
                                    }
                                }}
                                MenuProps={{
                                    PaperProps: {
                                        elevation: 0,
                                        sx: {
                                            width: '140px',
                                            mt: '4px',
                                            borderRadius: '8px',
                                            padding: '0 8px',
                                            backgroundImage:
                                                'url(data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIwIiBoZWlnaHQ9IjEyMCIgdmlld0JveD0iMCAwIDEyMCAxMjAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMjAiIGhlaWdodD0iMTIwIiBmaWxsPSJ1cmwoI3BhaW50MF9yYWRpYWxfMjc0OV8xNDUxODYpIiBmaWxsLW9wYWNpdHk9IjAuMTIiLz4KPGRlZnM+CjxyYWRpYWxHcmFkaWVudCBpZD0icGFpbnQwX3JhZGlhbF8yNzQ5XzE0NTE4NiIgY3g9IjAiIGN5PSIwIiByPSIxIiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSIgZ3JhZGllbnRUcmFuc2Zvcm09InRyYW5zbGF0ZSgxMjAgMS44MTgxMmUtMDUpIHJvdGF0ZSgtNDUpIHNjYWxlKDEyMy4yNSkiPgo8c3RvcCBzdG9wLWNvbG9yPSIjMDBCOEQ5Ii8+CjxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iIzAwQjhEOSIgc3RvcC1vcGFjaXR5PSIwIi8+CjwvcmFkaWFsR3JhZGllbnQ+CjwvZGVmcz4KPC9zdmc+Cg==), url(data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIwIiBoZWlnaHQ9IjEyMCIgdmlld0JveD0iMCAwIDEyMCAxMjAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMjAiIGhlaWdodD0iMTIwIiBmaWxsPSJ1cmwoI3BhaW50MF9yYWRpYWxfMjc0OV8xNDUxODcpIiBmaWxsLW9wYWNpdHk9IjAuMTIiLz4KPGRlZnM+CjxyYWRpYWxHcmFkaWVudCBpZD0icGFpbnQwX3JhZGlhbF8yNzQ5XzE0NTE4NyIgY3g9IjAiIGN5PSIwIiByPSIxIiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSIgZ3JhZGllbnRUcmFuc2Zvcm09InRyYW5zbGF0ZSgwIDEyMCkgcm90YXRlKDEzNSkgc2NhbGUoMTIzLjI1KSI+CjxzdG9wIHN0b3AtY29sb3I9IiNGRjU2MzAiLz4KPHN0b3Agb2Zmc2V0PSIxIiBzdG9wLWNvbG9yPSIjRkY1NjMwIiBzdG9wLW9wYWNpdHk9IjAiLz4KPC9yYWRpYWxHcmFkaWVudD4KPC9kZWZzPgo8L3N2Zz4K)',
                                            backgroundPosition: 'top right, bottom left',
                                            backgroundSize: '50%, 50%',
                                            backgroundRepeat: 'no-repeat',
                                            backdropFilter: 'blur(20px)',
                                            backgroundColor: 'var(--background-item)',
                                            color: 'var(--text-color)',
                                            border: '1px solid var(--border-color)',
                                            '& .MuiMenuItem-root': {
                                                '&:hover': { backgroundColor: 'var(--hover-color)' },
                                                '&.Mui-selected': {
                                                    backgroundColor: 'var(--background-selected-item)',
                                                    '&:hover': { backgroundColor: 'var(--hover-color)' }
                                                }
                                            }
                                        }
                                    },
                                    anchorOrigin: {
                                        vertical: 'bottom',
                                        horizontal: 'right' // Căn chỉnh bên phải
                                    },
                                    transformOrigin: {
                                        vertical: 'top',
                                        horizontal: 'right' // Căn chỉnh bên phải
                                    }
                                }}
                            >
                                <MenuItem
                                    value={0}
                                    sx={{
                                        borderRadius: '6px'
                                    }}
                                >
                                    {t('COMMON.USER.THIS_WEEK')}
                                </MenuItem>

                                <MenuItem
                                    value={1}
                                    sx={{
                                        borderRadius: '6px',
                                        mt: '3px'
                                    }}
                                >
                                    {t('COMMON.USER.THIS_MONTH')}
                                </MenuItem>

                                <MenuItem
                                    value={2}
                                    sx={{
                                        borderRadius: '6px',
                                        mt: '3px'
                                    }}
                                >
                                    {t('COMMON.USER.THIS_YEAR')}
                                </MenuItem>
                            </Select>
                        </FormControl>

                        <Button
                            sx={{
                                padding: '8px 12px',
                                borderRadius: '8px',
                                height: '41.5px',
                                mb: 'auto',
                                fontWeight: 'bold',
                                display: 'flex',
                                gap: '10px',
                                color: '#040506',
                                backgroundColor: '#4effca',
                                textTransform: 'none',
                                justifyContent: 'center',
                                alignItems: 'center'
                            }}
                        >
                            <Download size={20} />
                            {t('COMMON.ATTENDANCE.DOWNLOAD_INFO')}
                        </Button>
                    </Box>
                </Box>

                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '40px'
                    }}
                >
                    <Avatar
                        src='https://api-prod-minimal-v620.pages.dev/assets/images/avatar/avatar-3.webp'
                        sx={{
                            width: '120px',
                            height: '120px'
                        }}
                    />

                    <Box>
                        <Typography
                            sx={{
                                fontSize: '20px',
                                fontWeight: 'bold',
                                color: 'var(--text-color)'
                            }}
                        >
                            {infoMe.FullName}
                        </Typography>

                        <Box
                            sx={{
                                mt: '20px',
                                display: 'flex',
                                gap: '45px',
                                alignItems: 'center'
                            }}
                        >
                            <Box>
                                <Typography
                                    sx={{
                                        color: 'var(--sub-title-color)',
                                        fontSize: '15px'
                                    }}
                                >
                                    {t('COMMON.EMPLOYEE.ROLES')}
                                </Typography>
                                <Typography
                                    sx={{
                                        mt: '4px',
                                        color: 'var(--text-color)',
                                        fontSize: '17px'
                                    }}
                                >
                                    {infoMe.Roles.join(', ')}
                                </Typography>
                            </Box>
                            <Box>
                                <Typography
                                    sx={{
                                        color: 'var(--sub-title-color)',
                                        fontSize: '15px'
                                    }}
                                >
                                    {t('COMMON.EMPLOYEE.PHONENUMBER')}
                                </Typography>
                                <Typography
                                    sx={{
                                        mt: '4px',
                                        color: 'var(--text-color)',
                                        fontSize: '17px'
                                    }}
                                >
                                    {infoMe.PhoneNumber}
                                </Typography>
                            </Box>
                            <Box>
                                <Typography
                                    sx={{
                                        color: 'var(--sub-title-color)',
                                        fontSize: '15px'
                                    }}
                                >
                                    {t('COMMON.EMPLOYEE.EMAIL')}
                                </Typography>
                                <Typography
                                    sx={{
                                        mt: '4px',
                                        color: 'var(--text-color)',
                                        fontSize: '17px'
                                    }}
                                >
                                    {infoMe.Email}
                                </Typography>
                            </Box>
                            <Box>
                                <Typography
                                    sx={{
                                        color: 'var(--sub-title-color)',
                                        fontSize: '15px'
                                    }}
                                >
                                    {t('COMMON.EMPLOYEE.BIRTHDAY')}
                                </Typography>
                                <Typography
                                    sx={{
                                        mt: '4px',
                                        color: 'var(--text-color)',
                                        fontSize: '17px'
                                    }}
                                >
                                    {formatDate(infoMe.Birthday)}
                                </Typography>
                            </Box>
                            <Box>
                                <Typography
                                    sx={{
                                        color: 'var(--sub-title-color)',
                                        fontSize: '15px'
                                    }}
                                >
                                    {t('COMMON.EMPLOYEE.DEPARTMENTNAME')}
                                </Typography>
                                <Typography
                                    sx={{
                                        mt: '4px',
                                        color: 'var(--text-color)',
                                        fontSize: '17px'
                                    }}
                                >
                                    {infoMe.DepartmentName || 'Department'}
                                </Typography>
                            </Box>
                            <Box>
                                <Typography
                                    sx={{
                                        color: 'var(--sub-title-color)',
                                        fontSize: '15px'
                                    }}
                                >
                                    {t('COMMON.EMPLOYEE.STARTDATEWORK')}
                                </Typography>
                                <Typography
                                    sx={{
                                        mt: '4px',
                                        color: 'var(--text-color)',
                                        fontSize: '17px'
                                    }}
                                >
                                    {formatDate(infoMe.StartDateWork)}
                                </Typography>
                            </Box>
                        </Box>
                    </Box>
                </Box>

                <Box sx={{ display: 'flex', gap: '35px', alignItems: 'center', mt: '40px' }}>
                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            flex: 1,
                            backgroundColor: 'var(--attendance-bg2)',
                            padding: '20px 24px',
                            borderRadius: '20px'
                        }}
                    >
                        <Box
                            sx={{
                                mr: '20px',
                                width: '55px',
                                height: '55px',
                                borderRadius: '50%',
                                display: 'flex',
                                color: 'var(--text-color)',
                                justifyContent: 'center',
                                alignItems: 'center',
                                backgroundColor: 'var(--attendance-bg3)'
                            }}
                        >
                            <ScanBarcode size={28} />
                        </Box>
                        <Box>
                            <Typography sx={{ fontSize: '20px', fontWeight: 'bold', color: 'var(--text-color)' }}>
                                5
                            </Typography>
                            <Typography sx={{ fontSize: '15px', mt: '5px', color: 'var(--text-color)' }}>
                                Số lần nhận thưởng
                            </Typography>
                        </Box>
                    </Box>
                    <Box
                        sx={{
                            display: 'flex',
                            flex: 1,
                            backgroundColor: 'var(--attendance-bg2)',
                            alignItems: 'center',
                            padding: '20px 24px',
                            borderRadius: '20px'
                        }}
                    >
                        <Box
                            sx={{
                                mr: '20px',
                                width: '55px',
                                height: '55px',
                                borderRadius: '50%',
                                display: 'flex',
                                color: 'var(--text-color)',
                                justifyContent: 'center',
                                alignItems: 'center',
                                backgroundColor: 'var(--attendance-bg3)'
                            }}
                        >
                            <CircleArrowOutDownLeft size={28} />
                        </Box>
                        <Box>
                            <Typography sx={{ fontSize: '20px', fontWeight: 'bold', color: 'var(--text-color)' }}>
                                7:53
                            </Typography>
                            <Typography sx={{ fontSize: '15px', mt: '5px', color: 'var(--text-color)' }}>
                                Tổng số tiền thưởng
                            </Typography>
                        </Box>
                    </Box>
                    <Box
                        sx={{
                            display: 'flex',
                            flex: 1,
                            backgroundColor: 'var(--attendance-bg2)',
                            alignItems: 'center',
                            padding: '20px 24px',
                            borderRadius: '20px'
                        }}
                    >
                        <Box
                            sx={{
                                mr: '20px',
                                width: '55px',
                                height: '55px',
                                borderRadius: '50%',
                                display: 'flex',
                                color: 'var(--text-color)',
                                justifyContent: 'center',
                                alignItems: 'center',
                                backgroundColor: 'var(--attendance-bg3)'
                            }}
                        >
                            <CircleArrowOutUpRight size={28} />
                        </Box>
                        <Box>
                            <Typography sx={{ fontSize: '20px', fontWeight: 'bold', color: 'var(--text-color)' }}>
                                18:05
                            </Typography>
                            <Typography sx={{ fontSize: '15px', mt: '5px', color: 'var(--text-color)' }}>
                                Số lần bị kỷ luật
                            </Typography>
                        </Box>
                    </Box>
                    <Box
                        sx={{
                            display: 'flex',
                            flex: 1,
                            backgroundColor: 'var(--attendance-bg2)',
                            alignItems: 'center',
                            padding: '20px 24px',
                            borderRadius: '20px'
                        }}
                    >
                        <Box
                            sx={{
                                mr: '20px',
                                width: '55px',
                                height: '55px',
                                backgroundColor: 'var(--attendance-bg3)',
                                borderRadius: '50%',
                                color: 'var(--text-color)',
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center'
                            }}
                        >
                            <ClockAlert size={28} />
                        </Box>
                        <Box>
                            <Typography sx={{ fontSize: '20px', fontWeight: 'bold', color: 'var(--text-color)' }}>
                                5
                            </Typography>
                            <Typography sx={{ fontSize: '15px', mt: '5px', color: 'var(--text-color)' }}>
                                Tổng số tiền phạt
                            </Typography>
                        </Box>
                    </Box>
                </Box>
            </Paper>
            <Box sx={{ marginTop: '30px' }}>
                <Detail />
            </Box>
            <Box sx={{ marginTop: '30px' }}>
                <Discipline />
            </Box>
        </Box>
    )
}
