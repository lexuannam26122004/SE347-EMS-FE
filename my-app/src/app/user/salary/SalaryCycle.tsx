'use client'
import {
    MenuItem,
    FormControl,
    Select,
    Box,
    Paper,
    Typography,
    SelectChangeEvent,
    Tooltip,
    Button
} from '@mui/material'
import { Clock, MailWarning } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useGetMeInfoCycleQuery } from '@/services/UserSalaryService'
import EmployeeSalaryModal from './ModalDetail'

function getContractBgColor(IsPaid: boolean): string {
    if (IsPaid) {
        return 'var(--bg-success-color)'
    } else {
        return 'var(--bg-danger-color)'
    }
}

function getContractTextColor(IsPaid: boolean): string {
    if (IsPaid) {
        return 'var(--text-success-color)'
    } else {
        return 'var(--text-danger-color)'
    }
}
interface infoCycle {
    Id: string
    Period: string
    Ispaid: boolean
    NumberOfWorkingHours: number
    TotalSalary: number
}

export default function SalaryCycle() {
    const { t } = useTranslation('common')
    const currentYear = new Date().getFullYear() - 1
    const [selectedYear, setSelectedYear] = useState(currentYear)
    const [openModal, setOpenModal] = useState(false)
    const [selectedSalary, setSelectedSalary] = useState<string | null>(null)

    const { data: cycleData, refetch } = useGetMeInfoCycleQuery({ year: selectedYear.toString() })

    useEffect(() => {
        refetch()
    }, [selectedYear, cycleData])

    const myData = cycleData?.Data as infoCycle[]

    const handleYearChange = (event: SelectChangeEvent<number>) => {
        setSelectedYear(event.target.value as number)
    }
    useEffect(() => {}, [selectedYear])
    const handleClickDetail = (Id: string) => {
        setSelectedSalary(Id)
        setOpenModal(true)
    }
    return (
        <Paper
            elevation={0}
            sx={{
                width: '100%',
                mt: '24px',
                overflow: 'hidden',
                borderRadius: '20px',
                backgroundColor: 'var(--background-item)'
            }}
        >
            <Box
                sx={{
                    display: 'flex',
                    padding: '35px',
                    mb: '20px',
                    justifyContent: 'space-between'
                }}
            >
                <Box>
                    <Typography
                        sx={{
                            fontSize: '18px',
                            fontWeight: 'bold',
                            color: 'var(--text-color)'
                        }}
                    >
                        {t('COMMON.SALARY.CYCLE')}
                    </Typography>
                </Box>
                <FormControl sx={{ width: '90px' }}>
                    <Select
                        defaultValue={currentYear}
                        onChange={handleYearChange}
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
                                padding: '10px'
                            }
                        }}
                        MenuProps={{
                            PaperProps: {
                                elevation: 0,
                                sx: {
                                    width: '120px',
                                    mt: '2px',
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
                        {[...Array(currentYear - 2021)].map((_, index) => {
                            const year = currentYear - index
                            return (
                                <MenuItem
                                    key={year}
                                    value={year}
                                    sx={{
                                        borderRadius: '6px',
                                        '&:last-child': {
                                            mt: '3px'
                                        }
                                    }}
                                >
                                    {year}
                                </MenuItem>
                            )
                        })}
                    </Select>
                </FormControl>
            </Box>

            <Box
                sx={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(2, 1fr)',
                    gap: '30px',
                    height: 'auto',
                    //maxHeight: '540px',
                    padding: '0 28px 0 35px',
                    scrollbarGutter: 'stable',
                    '&::-webkit-scrollbar': {
                        width: '7px',
                        height: '7px'
                    },
                    '&::-webkit-scrollbar-thumb': {
                        backgroundColor: 'var(--scrollbar-color)',
                        borderRadius: '10px'
                    },
                    overflowY: 'auto',
                    mb: '24px'
                }}
            >
                {myData?.map((period, index) => (
                    <Box
                        onClick={() => handleClickDetail(period?.Id)}
                        key={index}
                        sx={{
                            position: 'relative', // Đảm bảo có thể dùng pseudo-element
                            backgroundColor: 'var(--attendance-bg2)',
                            padding: '24px',
                            borderRadius: '20px',

                            cursor: 'pointer', // Hiển thị con trỏ tay khi hover
                            transition: 'transform 0.5s ease', // Hiệu ứng phóng to mượt mà
                            '&:hover': {
                                transform: 'scale(1.02)' // Phóng to nhẹ khi hover
                            },
                            '&::after': {
                                content: '""',
                                position: 'absolute',
                                top: '50%',
                                left: '50%',
                                width: '0',
                                height: '100%',
                                background:
                                    'linear-gradient(to right, rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0))',
                                transform: 'translate(-50%, -50%)',
                                opacity: 0,
                                transition: 'width 0.4s ease, opacity 0.4s ease',
                                zIndex: 0 // Đảm bảo pseudo-element nằm dưới nội dung
                            },
                            '&:active::after': {
                                width: '200%', // Hiệu ứng gợn sóng sang hai bên
                                opacity: 1
                            }
                        }}
                    >
                        <Box sx={{ position: 'relative', zIndex: 1 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <Clock size={'24px'} color='var(--text-color)' />
                                <Typography
                                    fontSize={'16px'}
                                    fontWeight={'bold'}
                                    style={{ marginLeft: '15px' }}
                                    color='var(--text-color)'
                                >
                                    {period?.Period}
                                </Typography>
                                <Box sx={{ display: 'flex', alignItems: 'center', marginLeft: 'auto' }}>
                                    <Box
                                        sx={{
                                            borderRadius: '8px',
                                            padding: '5px 10px',
                                            display: 'flex',
                                            minWidth: '100px',
                                            justifyContent: 'center',
                                            backgroundColor: getContractBgColor(period?.Ispaid)
                                        }}
                                    >
                                        <Typography
                                            sx={{
                                                fontSize: '15px',
                                                overflow: 'hidden',
                                                color: getContractTextColor(period?.Ispaid),
                                                width: 'auto',
                                                fontWeight: 'bold',
                                                display: 'inline-block',
                                                textOverflow: 'ellipsis',
                                                whiteSpace: 'nowrap'
                                            }}
                                        >
                                            {getContractBgColor(period?.Ispaid) === 'var(--bg-danger-color)'
                                                ? `${t('COMMON.SALARY.IS_UNPAID')}`
                                                : `${t('COMMON.SALARY.IS_PAID')}`}
                                        </Typography>
                                    </Box>
                                    <Tooltip title='error report'>
                                        <Button
                                            sx={{
                                                borderRadius: '8px',
                                                padding: '5px',
                                                backgroundColor: '#33FF66',
                                                marginLeft: '15px',
                                                position: 'relative',
                                                overflow: 'hidden',
                                                color: '#000',
                                                '&:hover': {
                                                    backgroundColor: '#2ecc71'
                                                },
                                                '&::after': {
                                                    content: '""',
                                                    position: 'absolute',
                                                    width: '100%',
                                                    height: '100%',
                                                    top: 0,
                                                    left: 0,
                                                    background:
                                                        'radial-gradient(circle, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0) 60%)',
                                                    transform: 'scale(0)',
                                                    opacity: 0,
                                                    transition: 'transform 0.5s, opacity 0.5s'
                                                },
                                                '&:active::after': {
                                                    transform: 'scale(4)',
                                                    opacity: 1
                                                }
                                            }}
                                        >
                                            <MailWarning style={{ fontSize: '24px' }} />
                                        </Button>
                                    </Tooltip>
                                </Box>
                            </Box>
                            <Box
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    marginTop: '25px',
                                    gap: '10'
                                }}
                            >
                                <Box sx={{ flex: 1 }}>
                                    <Typography sx={{ color: 'var(--sub-title-color)' }}>
                                        {t('COMMON.SALARY.WORKING_TIME')}
                                    </Typography>
                                    <Typography sx={{ color: '#FFCC99', marginTop: '10px' }}>
                                        {period?.NumberOfWorkingHours}
                                    </Typography>
                                </Box>
                                <Box sx={{ flex: 1, justifyContent: 'center' }}>
                                    <Typography sx={{ color: 'var(--sub-title-color)' }}>
                                        {t('COMMON.SALARY.TOTAL_SALARY')}
                                    </Typography>
                                    <Typography sx={{ color: '#FFCC99', marginTop: '10px' }}>
                                        {period?.TotalSalary}
                                    </Typography>
                                </Box>
                            </Box>
                        </Box>
                    </Box>
                ))}
            </Box>
            {selectedSalary && (
                <EmployeeSalaryModal
                    open={openModal}
                    handleToggle={() => setOpenModal(false)}
                    salaryId={selectedSalary}
                />
            )}
        </Paper>
    )
}
