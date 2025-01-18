'use client'
import {
    Box,
    Select,
    Pagination,
    Typography,
    MenuItem,
    SelectChangeEvent,
    Paper,
    InputLabel,
    FormControl,
    TextField,
    InputAdornment
} from '@mui/material'
import { useEffect, useState, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import SearchIcon from '@mui/icons-material/Search'
import TableReward from '@/components/TableReward'
import { useGetAllDepartmentQuery } from '@/services/DepartmentService'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import { debounce } from 'lodash'
import { useCallback } from 'react'
import { IFilterReward } from '@/models/Reward'
import { useGetAllRewardsQuery } from '@/services/RewardService'
import Loading from '@/components/Loading'
import { authSelector } from '@/redux/slices/authSlice'
import { useSelector } from 'react-redux'
import { toZonedTime, format } from 'date-fns-tz'
import dayjs from 'dayjs'
import { DatePicker } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'

const convertToVietnamTime = (date: Date) => {
    if (isNaN(date.getTime())) {
        throw new Error('Invalid Date')
    }

    const timeZone = 'Asia/Ho_Chi_Minh'

    const vietnamTime = toZonedTime(date, timeZone)

    const formattedDate = format(vietnamTime, "yyyy-MM-dd'T'HH:mm:ss")

    return formattedDate // Trả về thời gian đã được định dạng
}

function a11yProps(index: number) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`
    }
}

function Page() {
    const { t } = useTranslation('common')
    const [page, setPage] = useState(1)
    const [rowsPerPage, setRowsPerPage] = useState('5')
    const [from, setFrom] = useState(1)
    const [to, setTo] = useState(5)
    const [filter, setFilter] = useState<IFilterReward>({
        pageSize: 5,
        pageNumber: 1,
        startDate: dayjs().startOf('month').format('YYYY-MM-DD'),
        endDate: dayjs().endOf('month').format('YYYY-MM-DD')
    })
    const [keyword, setKeyword] = useState('')

    const { data: responseDept } = useGetAllDepartmentQuery({})

    const departmentData = responseDept?.Data?.Records
    const [department, setDepartment] = useState(t('COMMON.ALL'))

    const { data: responseReward, isLoading, isFetching, refetch } = useGetAllRewardsQuery(filter)

    const handleDepartmentChange = value => {
        setDepartment(value)
        setFilter(prev => {
            return {
                ...prev,
                department: value === t('COMMON.ALL') ? undefined : value, // Sử dụng trực tiếp value
                pageNumber: 1
            }
        })
    }

    const rewardData = responseReward?.Data.Records

    const totalRecords = (responseReward?.Data.TotalRecords as number) || 0

    const handleChangePage = (event: React.ChangeEvent<unknown>, newPage: number) => {
        setPage(newPage)
        setFilter(prev => {
            return {
                ...prev,
                pageNumber: newPage
            }
        })
    }

    const handleChangeRowsPerPage = (event: SelectChangeEvent) => {
        setPage(1)
        setRowsPerPage(event.target.value as string)
        setFilter(prev => {
            return {
                ...prev,
                pageSize: Number(event.target.value),
                pageNumber: 1
            }
        })
    }

    const debouncedSetFilter = useCallback(
        debounce(value => {
            setFilter(prev => ({
                ...prev,
                keyword: value,
                pageNumber: 1
            }))
        }, 100),
        []
    )

    const handleSearchKeyword = value => {
        setPage(1)
        setKeyword(value)
        debouncedSetFilter(value)
    }

    useEffect(() => {
        if (!isFetching && responseReward?.Data) {
            const from = (page - 1) * Number(rowsPerPage) + Math.min(1, rewardData?.length)
            setFrom(from)

            const to = Math.min(rewardData?.length + (page - 1) * Number(rowsPerPage), totalRecords)
            setTo(to)
        }
    }, [isFetching, responseReward, page, rowsPerPage])

    useEffect(() => {
        refetch()
    }, [filter])

    const [currentTab, setCurrentTab] = useState(0)

    // Lọc dữ liệu theo status
    const filteredData = useMemo(() => {
        switch (currentTab) {
            case 0: // All
                return rewardData
            case 1: // Pending
                return rewardData?.filter(item => item.IsReceived === false)
            case 2: // In Progress
                return rewardData?.filter(item => item.IsReceived === true)
            default:
                return rewardData
        }
    }, [rewardData, currentTab])

    const counts = useMemo(
        () => ({
            0: rewardData?.length,
            1: rewardData?.filter(item => item.IsReceived === false).length,
            2: rewardData?.filter(item => item.IsReceived === true).length
        }),
        [rewardData]
    )

    const menuLeft = useSelector(authSelector)

    if (isLoading || menuLeft === null || Object.keys(menuLeft).length === 0) {
        return <Loading />
    }

    const badgeStyle: React.CSSProperties = {
        fontSize: '12px',
        height: '24px',
        minWidth: '24px',
        borderRadius: '6px',
        padding: '0px 7px',
        fontWeight: 'bold',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    }

    return (
        <Box
            sx={{
                mt: '24px'
            }}
        >
            <Paper
                sx={{
                    width: '100%',
                    overflow: 'hidden',
                    boxShadow: 'var(--box-shadow-paper)',
                    borderRadius: '20px',
                    backgroundColor: 'var(--background-item)'
                }}
            >
                <Typography
                    sx={{
                        userSelect: 'none',
                        color: 'var(--text-color)',
                        fontWeight: 'bold',
                        fontSize: '18px',
                        display: 'flex',
                        alignItems: 'center',
                        padding: '24px 24px 15px'
                    }}
                >
                    {t('COMMON.REWARD_DISCIPLINE.LIST_REWARD')}
                </Typography>

                <Box>
                    <Tabs
                        value={currentTab}
                        onChange={(event, newValue) => setCurrentTab(newValue)}
                        aria-label='basic tabs example'
                        TabIndicatorProps={{
                            sx: {
                                background: 'linear-gradient(to right,rgb(103, 255, 164),rgb(255, 182, 127))', // Màu của thanh indicator
                                height: '2px',
                                borderRadius: '1px'
                            }
                        }}
                    >
                        <Tab
                            sx={{
                                textTransform: 'none',
                                color: 'var(--text-rejected-color1)',
                                fontWeight: '600',
                                paddingLeft: '25px',
                                paddingRight: '25px',
                                '&.Mui-selected': {
                                    color: 'var(--text-color)',
                                    fontWeight: '600'
                                }
                            }}
                            label={
                                <Box style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    {t('COMMON.ERROR_REPORT.ALL')}
                                    <Box
                                        style={{
                                            ...badgeStyle,
                                            backgroundColor:
                                                currentTab === 0 ? 'var(--bg-all-color1)' : 'var(--bg-rejected-color1)',
                                            color:
                                                currentTab === 0
                                                    ? 'var(--text-all-color1)'
                                                    : 'var(--text-rejected-color1)'
                                        }}
                                    >
                                        {counts[0]}
                                    </Box>
                                </Box>
                            }
                            {...a11yProps(0)}
                        />
                        <Tab
                            sx={{
                                textTransform: 'none',
                                color: 'var(--text-rejected-color1)',
                                fontWeight: '600',
                                '&.Mui-selected': {
                                    color: 'var(--text-color)',
                                    fontWeight: '600'
                                }
                            }}
                            label={
                                <Box style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    Chưa nhận
                                    <Box
                                        style={{
                                            ...badgeStyle,
                                            backgroundColor:
                                                currentTab === 1
                                                    ? 'var(--bg-warning-color)'
                                                    : 'var(--bg-warning-color1)',
                                            color:
                                                currentTab === 1
                                                    ? 'var(--text-warning-color)'
                                                    : 'var(--text-warning-color1)'
                                        }}
                                    >
                                        {counts[1]}
                                    </Box>
                                </Box>
                            }
                            {...a11yProps(1)}
                        />
                        <Tab
                            sx={{
                                textTransform: 'none',
                                color: 'var(--text-rejected-color1)',
                                fontWeight: '600',
                                '&.Mui-selected': {
                                    color: 'var(--text-color)',
                                    fontWeight: '600'
                                }
                            }}
                            label={
                                <Box style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    Đã nhận
                                    <Box
                                        style={{
                                            ...badgeStyle,
                                            backgroundColor:
                                                currentTab === 2
                                                    ? 'var(--bg-success-color)'
                                                    : 'var(--bg-success-color1)',
                                            color:
                                                currentTab === 2
                                                    ? 'var(--text-success-color)'
                                                    : 'var(--text-success-color1)'
                                        }}
                                    >
                                        {counts[2]}
                                    </Box>
                                </Box>
                            }
                            {...a11yProps(2)}
                        />
                    </Tabs>
                </Box>

                <Box display='flex' alignItems='center' gap='24px' margin='24px'>
                    <Box sx={{ position: 'relative', width: '40%', height: '55px' }}>
                        <TextField
                            id='location-search'
                            type='search'
                            placeholder={t('COMMON.ERROR_REPORT.SEARCH')}
                            variant='outlined'
                            required
                            value={keyword}
                            onChange={e => handleSearchKeyword(e.target.value)}
                            sx={{
                                color: 'var(--text-color)',
                                padding: '0px',
                                width: '100%',
                                '& fieldset': {
                                    borderRadius: '10px',
                                    borderColor: 'var(--border-color)'
                                },
                                '& .MuiInputBase-root': { paddingLeft: '0px', paddingRight: '12px' },
                                '& .MuiInputBase-input': {
                                    padding: '15px 0px',
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
                                '& .MuiOutlinedInput-root.Mui-focused fieldset': {
                                    borderColor: 'var(--selected-field-color)'
                                }
                            }}
                            slotProps={{
                                input: {
                                    startAdornment: (
                                        <InputAdornment
                                            position='start'
                                            sx={{
                                                mr: 0
                                            }}
                                        >
                                            <Box
                                                sx={{
                                                    height: '100%',
                                                    color: '#a5bed4',
                                                    padding: '10.5px',
                                                    zIndex: 100
                                                }}
                                            >
                                                <SearchIcon />
                                            </Box>
                                        </InputAdornment>
                                    )
                                }
                            }}
                        />
                    </Box>

                    <Box width='20%'>
                        <FormControl
                            sx={{
                                width: '100%',
                                height: '53px',
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
                            <InputLabel
                                id='select-label'
                                sx={{
                                    color: 'var(--text-label-color)',
                                    '&.Mui-focused': {
                                        color: 'var(--selected-color)'
                                    }
                                }}
                            >
                                {t('COMMON.REWARD_DISCIPLINE.DEPARTMENT')}
                            </InputLabel>

                            <Select
                                labelId='select-label'
                                value={department} // Quản lý giá trị qua state
                                onChange={e => handleDepartmentChange(e.target.value)} // Cập nhật giá trị khi chọn
                                label={t('COMMON.REWARD_DISCIPLINE.DEPARTMENT')}
                                autoFocus={false}
                                sx={{
                                    height: '53px',
                                    mt: '-1px',
                                    '&:hover .MuiOutlinedInput-notchedOutline': {
                                        borderColor: 'var(--hover-color)' // Khi hover
                                    },
                                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                        borderColor: 'var(--selected-color)' // Khi focus
                                    },
                                    '& fieldset': {
                                        borderRadius: '8px',
                                        borderColor: 'var(--border-color)' // Viền khi không focus
                                    },
                                    '& .MuiSelect-icon': {
                                        color: 'var(--text-color)' // Màu icon dropdown
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
                                            backdropFilter: 'blur(20px)',
                                            borderRadius: '8px',
                                            backgroundColor: 'var(--background-item)',
                                            color: 'var(--text-color)',
                                            border: '1px solid var(--border-color)',
                                            '& .MuiMenuItem-root': {
                                                borderRadius: '6px',
                                                '&:not(:first-of-type)': {
                                                    mt: '3px'
                                                },
                                                '&:hover': {
                                                    backgroundColor: 'var(--hover-color)'
                                                },
                                                '&.Mui-selected': {
                                                    backgroundColor: 'var(--background-selected-item)',
                                                    '&:hover': { backgroundColor: 'var(--hover-color)' }
                                                }
                                            }
                                        },
                                        autoFocus: false
                                    }
                                }}
                            >
                                <MenuItem key={'all'} value={t('COMMON.ALL')}>
                                    {t('COMMON.ALL')}
                                </MenuItem>
                                {departmentData?.map((item, index) => (
                                    <MenuItem key={index} value={item.Name}>
                                        {item.Name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Box>

                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker
                            label={'Từ ngày'}
                            value={dayjs(filter.startDate)}
                            onChange={value => {
                                setFilter({
                                    ...filter,
                                    startDate: convertToVietnamTime(value?.toDate() || new Date())
                                })
                                setPage(1)
                            }}
                            sx={{
                                width: '20%',
                                mt: '-2px',
                                '& .MuiInputBase-root': {
                                    color: 'var(--text-color)'
                                },
                                '& .MuiInputBase-input': {
                                    padding: '15px 0 15px 14px !important'
                                },
                                '& .MuiInputLabel-root': {
                                    color: 'var(--text-label-color)'
                                },
                                '& .MuiOutlinedInput-notchedOutline': {
                                    borderRadius: '8px',
                                    borderColor: 'var(--border-dialog)'
                                },
                                '& .MuiSvgIcon-root': {
                                    color: 'var(--text-label-color)' // Màu của icon (lịch)
                                },
                                '& .MuiOutlinedInput-root': {
                                    '&:hover .MuiOutlinedInput-notchedOutline': {
                                        borderColor: 'var(--hover-field-color)' // Màu viền khi hover
                                    },
                                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                        borderColor: 'var(--selected-field-color) !important' // Màu viền khi focus, thêm !important để ghi đè
                                    }
                                },
                                '& .MuiInputLabel-root.Mui-focused': {
                                    color: 'var(--selected-field-color)'
                                }
                            }}
                        />
                    </LocalizationProvider>

                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker
                            label={'Đến ngày'}
                            value={dayjs(filter.endDate)}
                            onChange={value => {
                                setFilter({
                                    ...filter,
                                    endDate: convertToVietnamTime(value?.toDate() || new Date())
                                })
                                setPage(1)
                            }}
                            sx={{
                                width: '20%',
                                mt: '-2px',
                                '& .MuiInputBase-root': {
                                    color: 'var(--text-color)'
                                },
                                '& .MuiInputBase-input': {
                                    padding: '15px 0 15px 14px !important'
                                },
                                '& .MuiInputLabel-root': {
                                    color: 'var(--text-label-color)'
                                },
                                '& .MuiOutlinedInput-notchedOutline': {
                                    borderRadius: '8px',
                                    borderColor: 'var(--border-dialog)'
                                },
                                '& .MuiSvgIcon-root': {
                                    color: 'var(--text-label-color)' // Màu của icon (lịch)
                                },
                                '& .MuiOutlinedInput-root': {
                                    '&:hover .MuiOutlinedInput-notchedOutline': {
                                        borderColor: 'var(--hover-field-color)' // Màu viền khi hover
                                    },
                                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                        borderColor: 'var(--selected-field-color) !important' // Màu viền khi focus, thêm !important để ghi đè
                                    }
                                },
                                '& .MuiInputLabel-root.Mui-focused': {
                                    color: 'var(--selected-field-color)'
                                }
                            }}
                        />
                    </LocalizationProvider>
                </Box>

                <TableReward rewardsData={filteredData} setFilter={setFilter} refetch={refetch} />

                <Box display='flex' alignItems='center' justifyContent='space-between' padding='24px'>
                    <Box display='flex' alignItems='center'>
                        <Typography sx={{ mr: '10px', color: 'var(--text-color)' }}>
                            {t('COMMON.PAGINATION.ROWS_PER_PAGE')}
                        </Typography>
                        <Select
                            id='select'
                            sx={{
                                width: '71px',
                                padding: '5px',
                                borderRadius: '8px',
                                color: 'var(--text-color)',
                                '& .MuiSelect-icon': {
                                    color: 'var(--text-color)'
                                },
                                '& .MuiOutlinedInput-notchedOutline': {
                                    borderColor: 'var(--border-color)'
                                },
                                '&:hover .MuiOutlinedInput-notchedOutline': {
                                    borderColor: 'var(--hover-field-color)'
                                },
                                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                    borderColor: 'var(--selected-field-color)'
                                },
                                '& .MuiSelect-select': {
                                    padding: '6px 32px 6px 10px'
                                }
                            }}
                            value={rowsPerPage}
                            defaultValue='5'
                            onChange={handleChangeRowsPerPage}
                            MenuProps={{
                                PaperProps: {
                                    elevation: 0,
                                    sx: {
                                        border: '1px solid var(--border-color)',
                                        borderRadius: '8px',
                                        backgroundColor: 'var(--background-item)',
                                        '& .MuiList-root': {
                                            borderRadius: '0px',
                                            backgroundImage:
                                                'url(data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIwIiBoZWlnaHQ9IjEyMCIgdmlld0JveD0iMCAwIDEyMCAxMjAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMjAiIGhlaWdodD0iMTIwIiBmaWxsPSJ1cmwoI3BhaW50MF9yYWRpYWxfMjc0OV8xNDUxODYpIiBmaWxsLW9wYWNpdHk9IjAuMTIiLz4KPGRlZnM+CjxyYWRpYWxHcmFkaWVudCBpZD0icGFpbnQwX3JhZGlhbF8yNzQ5XzE0NTE4NiIgY3g9IjAiIGN5PSIwIiByPSIxIiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSIgZ3JhZGllbnRUcmFuc2Zvcm09InRyYW5zbGF0ZSgxMjAgMS44MTgxMmUtMDUpIHJvdGF0ZSgtNDUpIHNjYWxlKDEyMy4yNSkiPgo8c3RvcCBzdG9wLWNvbG9yPSIjMDBCOEQ5Ii8+CjxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iIzAwQjhEOSIgc3RvcC1vcGFjaXR5PSIwIi8+CjwvcmFkaWFsR3JhZGllbnQ+CjwvZGVmcz4KPC9zdmc+Cg==), url(data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIwIiBoZWlnaHQ9IjEyMCIgdmlld0JveD0iMCAwIDEyMCAxMjAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMjAiIGhlaWdodD0iMTIwIiBmaWxsPSJ1cmwoI3BhaW50MF9yYWRpYWxfMjc0OV8xNDUxODcpIiBmaWxsLW9wYWNpdHk9IjAuMTIiLz4KPGRlZnM+CjxyYWRpYWxHcmFkaWVudCBpZD0icGFpbnQwX3JhZGlhbF8yNzQ5XzE0NTE4NyIgY3g9IjAiIGN5PSIwIiByPSIxIiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSIgZ3JhZGllbnRUcmFuc2Zvcm09InRyYW5zbGF0ZSgwIDEyMCkgcm90YXRlKDEzNSkgc2NhbGUoMTIzLjI1KSI+CjxzdG9wIHN0b3AtY29sb3I9IiNGRjU2MzAiLz4KPHN0b3Agb2Zmc2V0PSIxIiBzdG9wLWNvbG9yPSIjRkY1NjMwIiBzdG9wLW9wYWNpdHk9IjAiLz4KPC9yYWRpYWxHcmFkaWVudD4KPC9kZWZzPgo8L3N2Zz4K)',
                                            backgroundPosition: 'top right, bottom left',
                                            backgroundSize: '50%, 50%',
                                            backgroundRepeat: 'no-repeat',
                                            backdropFilter: 'blur(20px)',
                                            backgroundColor: 'var(--background-item)',
                                            padding: '5px',
                                            '& .MuiMenuItem-root': {
                                                color: 'var(--text-color)',
                                                borderRadius: '6px',
                                                '&:hover': {
                                                    backgroundColor: 'var(--hover-color) !important'
                                                },
                                                '&.Mui-selected': {
                                                    backgroundColor: 'var(--background-selected-item)'
                                                }
                                            }
                                        }
                                    }
                                }
                            }}
                        >
                            <MenuItem sx={{ marginBottom: '3px' }} value={5}>
                                5
                            </MenuItem>
                            <MenuItem sx={{ marginBottom: '3px' }} value={10}>
                                10
                            </MenuItem>
                            <MenuItem sx={{ marginBottom: '3px' }} value={20}>
                                20
                            </MenuItem>
                            <MenuItem sx={{ marginBottom: '3px' }} value={30}>
                                30
                            </MenuItem>
                            <MenuItem value={40}>40</MenuItem>
                        </Select>
                        <Typography sx={{ ml: '30px', color: 'var(--text-color)' }}>
                            {t('COMMON.PAGINATION.FROM_TO', { from, to, totalRecords })}
                        </Typography>
                    </Box>

                    <Pagination
                        count={Math.ceil(totalRecords / (rowsPerPage ? Number(rowsPerPage) : 1))}
                        page={page}
                        onChange={handleChangePage}
                        boundaryCount={2}
                        siblingCount={0}
                        variant='outlined'
                        sx={{
                            color: 'var(--text-color)',
                            borderColor: 'var(--border-color)',
                            '& .MuiPaginationItem-root': {
                                color: 'var(--text-color)',
                                borderColor: 'var(--border-color)',
                                '&.Mui-selected': {
                                    backgroundColor: 'var(--background-selected-item) ',
                                    borderColor: 'var(--background-selected-item) ',
                                    color: 'var(--text-color)'
                                },
                                '&:hover': {
                                    backgroundColor: 'var(--hover-color) !important',
                                    borderColor: 'var(--hover-color) !important'
                                }
                            }
                        }}
                        color='primary'
                    />
                </Box>
            </Paper>
        </Box>
    )
}

export default Page
