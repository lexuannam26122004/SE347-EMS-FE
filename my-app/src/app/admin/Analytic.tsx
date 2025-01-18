'use client'
import { IFilterEmploymentContract } from '@/models/EmploymentContract'
import {
    Box,
    Select,
    Typography,
    MenuItem,
    SelectChangeEvent,
    Paper,
    Button,
    FormControl,
    InputLabel
} from '@mui/material'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useGetContractsExpiringSoonQuery } from '@/services/EmploymentContractService'

// function getContractBgColor(contractEnd: string): string {
//     const today = new Date()
//     const endDate = new Date(contractEnd)

//     const diffInMilliseconds = endDate.getTime() - today.getTime()
//     const diffInMonths = diffInMilliseconds / (1000 * 60 * 60 * 24 * 30)

//     if (diffInMonths <= 2) {
//         return 'var(--bg-danger-color)'
//     } else if (diffInMonths <= 4) {
//         return 'var(--bg-warning-color)'
//     } else {
//         return 'var(--bg-success-color)'
//     }
// }

// function getContractTextColor(contractEnd: string): string {
//     const today = new Date()
//     const endDate = new Date(contractEnd)

//     const diffInMilliseconds = endDate.getTime() - today.getTime()
//     const diffInMonths = diffInMilliseconds / (1000 * 60 * 60 * 24 * 30)

//     if (diffInMonths <= 2) {
//         return 'var(--text-danger-color)'
//     } else if (diffInMonths <= 4) {
//         return 'var(--text-warning-color)'
//     } else {
//         return 'var(--text-success-color)'
//     }
// }

function Page() {
    const { t } = useTranslation('common')
    const [filter, setFilter] = useState<IFilterEmploymentContract>({
        pageSize: 5,
        pageNumber: 1,
        daysUntilExpiration: 180
    })

    const [type, setType] = useState(0)
    const handleTypeChange = (event: SelectChangeEvent<number>) => {
        setType(event.target.value as number)
    }

    const { data: responseData, isFetching, refetch } = useGetContractsExpiringSoonQuery(filter)

    // const handleClickDetail = (config: IGetAllSysConfiguration) => {
    //     setSelectedConfig(config)
    //     setOpenModal(true)
    // }

    // const contractData = responseData?.Data.Records

    // const contracts = contractData?.map((item: any) => {
    //     return {
    //         FullName: item.User.FullName,
    //         ContractType: item.Contract.TypeContract,
    //         ContractName: item.Contract.ContractName,
    //         ContractStart: item.Contract.StartDate,
    //         ContractEnd: item.Contract.EndDate,
    //         AvatarPath: item.User.AvatarPath
    //     }
    // })

    // const totalRecords = (responseData?.Data.TotalRecords as number) || 0

    // const handleChangePage = (event: React.ChangeEvent<unknown>, newPage: number) => {
    //     setPage(newPage)
    //     setFilter(prev => {
    //         return {
    //             ...prev,
    //             pageNumber: newPage
    //         }
    //     })
    // }

    // const handleChangeRowsPerPage = (event: SelectChangeEvent) => {
    //     setPage(1)
    //     setRowsPerPage(event.target.value as string)
    //     setFilter(prev => {
    //         return {
    //             ...prev,
    //             pageSize: Number(event.target.value),
    //             pageNumber: 1
    //         }
    //     })
    // }

    // const handleSearchKeyword = () => {
    //     setPage(1)
    //     setFilter(prev => {
    //         return {
    //             ...prev,
    //             keyword: keyword,
    //             pageNumber: 1
    //         }
    //     })
    // }

    // useEffect(() => {
    //     if (!isFetching && responseData?.Data) {
    //         const from = (page - 1) * Number(rowsPerPage) + Math.min(1, contractData.length)
    //         setFrom(from)

    //         const to = Math.min(contractData.length + (page - 1) * Number(rowsPerPage), totalRecords)
    //         setTo(to)
    //     }
    // }, [isFetching, responseData, page, rowsPerPage])

    useEffect(() => {
        refetch()
    }, [filter])

    // const handleSort = (property: string) => {
    //     setFilter(prev => ({
    //         ...prev,
    //         sortBy: property,
    //         isDescending: orderBy === property && order === 'asc' ? true : false
    //     }))
    //     if (orderBy === property) {
    //         setOrder(order === 'asc' ? 'desc' : 'asc')
    //     } else {
    //         setOrder('asc')
    //     }
    //     setOrderBy(property)
    // }

    return (
        <Box>
            <Paper
                elevation={0}
                sx={{
                    width: '100%',
                    overflow: 'hidden',
                    boxShadow: 'var(--box-shadow-paper)',
                    borderRadius: '15px',
                    backgroundColor: 'var(--background-item)'
                }}
            >
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography
                        sx={{
                            userSelect: 'none',
                            color: 'var(--text-color)',
                            fontWeight: 'bold',
                            fontSize: '18px',
                            display: 'flex',
                            alignItems: 'center',
                            padding: '24px'
                        }}
                    >
                        {t('COMMON.DASHBOARD.Analysis')}
                    </Typography>

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: '24px', padding: '24px' }}>
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
                                defaultValue={0}
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
                                    {t('COMMON.USER.TODAY')}
                                </MenuItem>

                                <MenuItem
                                    value={1}
                                    sx={{
                                        mt: '3px',
                                        borderRadius: '6px'
                                    }}
                                >
                                    {t('COMMON.USER.THIS_WEEK')}
                                </MenuItem>

                                <MenuItem
                                    value={2}
                                    sx={{
                                        borderRadius: '6px',
                                        mt: '3px'
                                    }}
                                >
                                    {t('COMMON.USER.THIS_MONTH')}
                                </MenuItem>

                                <MenuItem
                                    value={3}
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
                            variant='outlined'
                            sx={{
                                color: '#ffffff',
                                padding: '7.5px 20px',
                                fontWeight: 'bold',
                                textTransform: 'none',
                                backgroundColor: '#FF5630',
                                border: 'none !important',
                                '&:hover': {
                                    backgroundColor: '#b71d18',
                                    boxShadow: '0px 4px 8px rgba(183, 29, 24, 0.50)'
                                },
                                borderRadius: '8px'
                            }}
                        >
                            {t('COMMON.CALENDAR.REFRESH')}
                        </Button>
                    </Box>
                </Box>
            </Paper>
        </Box>
    )
}

export default Page
