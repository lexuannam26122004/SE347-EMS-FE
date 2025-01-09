'use client'

import {
    Avatar,
    Box,
    Button,
    Checkbox,
    FormControl,
    FormControlLabel,
    IconButton,
    InputLabel,
    MenuItem,
    Pagination,
    Paper,
    Popper,
    Select,
    Typography
} from '@mui/material'
import { useTranslation } from 'react-i18next'
import { useState, useRef, useEffect } from 'react'
import { useGetAuthMeQuery } from '@/services/AuthService'
import { SelectChangeEvent } from '@mui/material'
import { formatDate } from '@/utils/formatDate'
import Loading from '@/components/Loading'
import {
    AlignJustify,
    CircleArrowOutDownLeft,
    CircleArrowOutUpRight,
    ClockAlert,
    Download,
    Filter,
    LayoutGrid,
    ListCollapse,
    ScanBarcode
} from 'lucide-react'
import dayjs from 'dayjs'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { DatePicker } from '@mui/x-date-pickers'
import { toZonedTime, format } from 'date-fns-tz'
import DataGrid from './DataGrid'
import TableData from './TableData'
import Grow from '@mui/material/Grow'
import ClickAwayListener from '@mui/material/ClickAwayListener'
import MenuList from '@mui/material/MenuList'
import DisplayInfo from './DisplayInfo'
import { useSearchAttendanceForUserQuery } from '@/services/UserAttendanceService'
import { IFilterTimekeepingForUser } from '@/models/Timekeeping'

const convertToVietnamTimeStart = (date: Date) => {
    if (isNaN(date.getTime())) {
        throw new Error('Invalid Date')
    }

    const timeZone = 'Asia/Ho_Chi_Minh'

    // Đặt giờ phút giây về 00:00:00
    const startOfDay = new Date(date)
    startOfDay.setHours(0, 0, 0, 0) // Giờ, phút, giây, mili giây = 0

    // Chuyển đổi sang múi giờ Việt Nam
    const vietnamTime = toZonedTime(startOfDay, timeZone)

    // Định dạng lại ngày giờ
    const formattedDate = format(vietnamTime, "yyyy-MM-dd'T'HH:mm:ss")

    return formattedDate // Trả về thời gian đã được định dạng
}

const convertToVietnamTimeEnd = (date: Date) => {
    if (isNaN(date.getTime())) {
        throw new Error('Invalid Date')
    }

    const timeZone = 'Asia/Ho_Chi_Minh'

    // Đặt giờ, phút, giây về 23:59:59
    const endOfDay = new Date(date)
    endOfDay.setHours(23, 59, 59, 999) // Giờ = 23, phút = 59, giây = 59, mili giây = 999

    // Chuyển đổi sang múi giờ Việt Nam
    const vietnamTime = toZonedTime(endOfDay, timeZone)

    // Định dạng lại ngày giờ
    const formattedDate = format(vietnamTime, "yyyy-MM-dd'T'HH:mm:ss")

    return formattedDate // Trả về thời gian đã được định dạng
}

function Page() {
    const { t } = useTranslation('common')
    const [type, setType] = useState(0)
    const [page, setPage] = useState(1)
    const [rowsPerPage, setRowsPerPage] = useState('10')
    const [from, setFrom] = useState(1)
    const [to, setTo] = useState(10)
    const [filter, setFilter] = useState<IFilterTimekeepingForUser>({
        PageSize: 10,
        PageNumber: 1,
        StartDate: dayjs().startOf('month').format('YYYY-MM-DD HH:mm:ss'),
        EndDate: dayjs().endOf('month').format('YYYY-MM-DD HH:mm:ss'),
        IsValid: true,
        IsEarly: true,
        IsLate: true,
        IsOnTime: true
    })
    const [typeDisplay, setTypeDisplay] = useState(1)
    const [open, setOpen] = useState(false)
    const anchorRef = useRef<HTMLButtonElement>(null)

    const [checkedItems, setCheckedItems] = useState({
        late: true,
        early: true,
        onTime: true,
        invalid: true
    })

    const [tempCheckedItems, setTempCheckedItems] = useState({ ...checkedItems })

    const handleTempCheckboxChange = event => {
        setTempCheckedItems({
            ...tempCheckedItems,
            [event.target.name]: event.target.checked
        })
    }

    const handleOkClick = () => {
        setCheckedItems({ ...tempCheckedItems })

        setFilter(prevFilter => ({
            ...prevFilter,
            IsLate: tempCheckedItems.late,
            IsEarly: tempCheckedItems.early,
            IsOnTime: tempCheckedItems.onTime,
            IsValid: tempCheckedItems.invalid
        }))

        setOpen(false)
    }

    const handleCancel = () => {
        setTempCheckedItems({ ...checkedItems })
        setOpen(false)
    }

    const handleToggle = () => {
        setOpen(prevOpen => !prevOpen)
        setTempCheckedItems({ ...checkedItems })
    }

    const handleClose = (event: Event | React.SyntheticEvent) => {
        if (anchorRef.current && anchorRef.current.contains(event.target as HTMLElement)) {
            return
        }
        setTempCheckedItems({ ...checkedItems })
        setOpen(false)
    }

    const prevOpen = useRef(open)
    useEffect(() => {
        if (prevOpen.current === true && open === false) {
            anchorRef.current!.focus()
        }

        prevOpen.current = open
    }, [open])

    const handleTypeChange = (event: SelectChangeEvent<number>) => {
        setType(event.target.value as number)
    }

    const handleChangePage = (event: React.ChangeEvent<unknown>, newPage: number) => {
        setPage(newPage)
        setFilter(prev => {
            return {
                ...prev,
                PageNumber: newPage
            }
        })
    }

    const handleChangeRowsPerPage = (event: SelectChangeEvent) => {
        setPage(1)
        setRowsPerPage(event.target.value as string)
        setFilter(prev => {
            return {
                ...prev,
                PageSize: Number(event.target.value),
                PageNumber: 1
            }
        })
    }

    const { data: responseGetMeData, isFetching: isFetchingGetMe } = useGetAuthMeQuery()
    const infoMe = responseGetMeData?.Data

    const { data: responseData, isFetching: isFetchingGetAttendance, refetch } = useSearchAttendanceForUserQuery(filter)

    useEffect(() => {
        refetch()
    }, [filter])

    const dataAttendance = responseData?.Data.Records || []
    const totalRecords = responseData?.Data.TotalRecords || 0

    useEffect(() => {
        if (!isFetchingGetAttendance && responseData?.Data) {
            const from = (page - 1) * Number(rowsPerPage) + Math.min(1, dataAttendance.length)
            setFrom(from)

            const to = Math.min(dataAttendance.length + (page - 1) * Number(rowsPerPage), totalRecords)
            setTo(to)
        }
    }, [isFetchingGetAttendance, responseData, page, rowsPerPage])

    if (isFetchingGetMe || !infoMe) {
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
                                {t('COMMON.USER.TOTAL_ATTENDANCE')}
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
                                {t('COMMON.USER.AVG_CHECK_IN')}
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
                                {t('COMMON.USER.AVG_CHECK_OUT')}
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
                                {t('COMMON.USER.TOTAL_LATE')}
                            </Typography>
                        </Box>
                    </Box>
                </Box>
            </Paper>

            <Paper
                elevation={1}
                sx={{
                    width: '100%',
                    boxShadow: 'var(--box-shadow-paper)',
                    mt: '40px',
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
                            {t('COMMON.USER.TODAY_ATTENDANCE')}
                        </Typography>
                    </Box>

                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '18px'
                        }}
                    >
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
                            <ListCollapse size={20} />
                            {t('COMMON.USER.DETAIL')}
                        </Button>
                    </Box>
                </Box>

                <DisplayInfo />
            </Paper>

            <Paper
                elevation={0}
                sx={{
                    mt: '40px',
                    boxShadow: 'var(--box-shadow-paper)',
                    width: '100%',
                    borderRadius: '30px',
                    backgroundColor: 'var(--attendance-bg1)'
                }}
            >
                <Box
                    sx={{
                        display: 'flex',
                        padding: '35px',
                        justifyContent: 'space-between'
                    }}
                >
                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'center'
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
                            {t('COMMON.USER.ATTENDANCE_HISTORY')}
                        </Typography>
                    </Box>

                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'right',
                            gap: '20px'
                        }}
                    >
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DatePicker
                                label={t('COMMON.USER.START_DATE')}
                                value={dayjs(filter.StartDate)}
                                onChange={value =>
                                    setFilter({
                                        ...filter,
                                        StartDate: convertToVietnamTimeStart(value?.toDate() || new Date())
                                    })
                                }
                                sx={{
                                    mb: 'auto',
                                    width: '25%',
                                    '& .MuiInputBase-root': {
                                        color: 'var(--text-color)'
                                    },
                                    '& .MuiInputBase-input': {
                                        padding: '9.5px 14px'
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
                                label={t('COMMON.USER.END_DATE')}
                                value={dayjs(filter.EndDate)}
                                onChange={value =>
                                    setFilter({
                                        ...filter,
                                        EndDate: convertToVietnamTimeEnd(value?.toDate() || new Date())
                                    })
                                }
                                sx={{
                                    mb: 'auto',
                                    width: '25%',
                                    '& .MuiInputBase-root': {
                                        color: 'var(--text-color)'
                                    },
                                    '& .MuiInputBase-input': {
                                        padding: '9.5px 14px'
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

                        <IconButton
                            sx={{
                                textTransform: 'none',
                                justifyContent: 'center',
                                alignItems: 'center',
                                color: 'var(--text-color)',
                                padding: '8px',
                                border:
                                    typeDisplay === 1
                                        ? '1px solid var(--border-color)'
                                        : '1px solid var(--sub-title-color)',
                                backgroundColor: typeDisplay === 1 ? '' : 'var(--attendance-bg2)',
                                borderRadius: '10px',
                                mb: 'auto',
                                '&:hover': {
                                    backgroundColor: 'var(--hover-color)'
                                }
                            }}
                            onClick={() => setTypeDisplay(0)}
                        >
                            <AlignJustify size={24} />
                        </IconButton>

                        <IconButton
                            sx={{
                                textTransform: 'none',
                                justifyContent: 'center',
                                alignItems: 'center',
                                color: 'var(--text-color)',
                                padding: '8px',
                                border:
                                    typeDisplay === 0
                                        ? '1px solid var(--border-color)'
                                        : '1px solid var(--sub-title-color)',
                                backgroundColor: typeDisplay === 0 ? '' : 'var(--attendance-bg2)',
                                borderRadius: '10px',
                                mb: 'auto',
                                '&:hover': {
                                    backgroundColor: 'var(--hover-color)'
                                }
                            }}
                            onClick={() => setTypeDisplay(1)}
                        >
                            <LayoutGrid size={24} />
                        </IconButton>

                        <Button
                            ref={anchorRef}
                            id='composition-button'
                            aria-controls={open ? 'composition-menu' : undefined}
                            aria-expanded={open ? 'true' : undefined}
                            aria-haspopup='true'
                            onClick={handleToggle}
                            sx={{
                                padding: '8px 12px',
                                borderRadius: '8px',
                                height: '42px',
                                mb: 'auto',
                                fontWeight: 'bold',
                                display: 'flex',
                                gap: '10px',
                                color: 'var(--text-color)',
                                border: '1px solid var(--border-color)',
                                textTransform: 'none',
                                justifyContent: 'center',
                                alignItems: 'center'
                            }}
                        >
                            <Filter size={20} />
                            {t('COMMON.USER.FILTER')}
                        </Button>

                        <Popper
                            open={open}
                            anchorEl={anchorRef.current}
                            role={undefined}
                            sx={{
                                zIndex: 999999
                            }}
                            placement='bottom-end'
                            transition
                            disablePortal
                        >
                            {({ TransitionProps }) => (
                                <Grow
                                    {...TransitionProps}
                                    timeout={0}
                                    style={{
                                        marginTop: '3px',
                                        transformOrigin: 'right top'
                                    }}
                                >
                                    <Paper
                                        elevation={0}
                                        sx={{
                                            backgroundImage:
                                                'url(data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIwIiBoZWlnaHQ9IjEyMCIgdmlld0JveD0iMCAwIDEyMCAxMjAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMjAiIGhlaWdodD0iMTIwIiBmaWxsPSJ1cmwoI3BhaW50MF9yYWRpYWxfMjc0OV8xNDUxODYpIiBmaWxsLW9wYWNpdHk9IjAuMTIiLz4KPGRlZnM+CjxyYWRpYWxHcmFkaWVudCBpZD0icGFpbnQwX3JhZGlhbF8yNzQ5XzE0NTE4NiIgY3g9IjAiIGN5PSIwIiByPSIxIiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSIgZ3JhZGllbnRUcmFuc2Zvcm09InRyYW5zbGF0ZSgxMjAgMS44MTgxMmUtMDUpIHJvdGF0ZSgtNDUpIHNjYWxlKDEyMy4yNSkiPgo8c3RvcCBzdG9wLWNvbG9yPSIjMDBCOEQ5Ii8+CjxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iIzAwQjhEOSIgc3RvcC1vcGFjaXR5PSIwIi8+CjwvcmFkaWFsR3JhZGllbnQ+CjwvZGVmcz4KPC9zdmc+Cg==), url(data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIwIiBoZWlnaHQ9IjEyMCIgdmlld0JveD0iMCAwIDEyMCAxMjAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMjAiIGhlaWdodD0iMTIwIiBmaWxsPSJ1cmwoI3BhaW50MF9yYWRpYWxfMjc0OV8xNDUxODcpIiBmaWxsLW9wYWNpdHk9IjAuMTIiLz4KPGRlZnM+CjxyYWRpYWxHcmFkaWVudCBpZD0icGFpbnQwX3JhZGlhbF8yNzQ5XzE0NTE4NyIgY3g9IjAiIGN5PSIwIiByPSIxIiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSIgZ3JhZGllbnRUcmFuc2Zvcm09InRyYW5zbGF0ZSgwIDEyMCkgcm90YXRlKDEzNSkgc2NhbGUoMTIzLjI1KSI+CjxzdG9wIHN0b3AtY29sb3I9IiNGRjU2MzAiLz4KPHN0b3Agb2Zmc2V0PSIxIiBzdG9wLWNvbG9yPSIjRkY1NjMwIiBzdG9wLW9wYWNpdHk9IjAiLz4KPC9yYWRpYWxHcmFkaWVudD4KPC9kZWZzPgo8L3N2Zz4K)',
                                            backgroundPosition: 'top right, bottom left',
                                            backgroundSize: '50%, 50%',
                                            backgroundRepeat: 'no-repeat',
                                            backdropFilter: 'blur(20px)',
                                            backgroundColor: 'var(--background-item)',
                                            border: '1px solid var(--border-color)',
                                            padding: '2px 10px',
                                            borderRadius: '10px',
                                            minWidth: '208px'
                                        }}
                                    >
                                        <ClickAwayListener onClickAway={handleClose}>
                                            <MenuList
                                                autoFocusItem={false}
                                                id='avatar-menu'
                                                sx={{
                                                    borderRadius: '10px',
                                                    padding: '10px 3px 15px 3px'
                                                }}
                                            >
                                                {[
                                                    {
                                                        key: 'late',
                                                        label: t('COMMON.ATTENDANCE.STATUS_LATE')
                                                    },
                                                    { key: 'early', label: t('COMMON.ATTENDANCE.STATUS_EARLY') },
                                                    { key: 'onTime', label: t('COMMON.ATTENDANCE.STATUS_ON_TIME') },
                                                    {
                                                        key: 'invalid',
                                                        label: t('COMMON.ATTENDANCE.STATUS_INVALID')
                                                    }
                                                ].map(item => (
                                                    <MenuItem
                                                        key={item.key}
                                                        sx={{
                                                            display: 'flex', // Đảm bảo MenuItem có thể sử dụng toàn bộ không gian
                                                            justifyContent: 'space-between', // Chia đều không gian cho checkbox và label
                                                            color: 'var(--text-color)',
                                                            padding: '0',
                                                            marginBottom: '5px',
                                                            borderRadius: '10px',
                                                            width: '100%', // Đảm bảo MenuItem chiếm hết chiều rộng
                                                            '&:hover': {
                                                                backgroundColor: 'var(--hover-color)'
                                                            }
                                                        }}
                                                    >
                                                        <FormControlLabel
                                                            control={
                                                                <Checkbox
                                                                    name={item.key}
                                                                    checked={tempCheckedItems[item.key]} // Liên kết với state tạm thời
                                                                    onChange={handleTempCheckboxChange}
                                                                    sx={{
                                                                        color: 'var(--text-color)',
                                                                        '&.Mui-checked': {
                                                                            color: 'var(--text-color)'
                                                                        }
                                                                    }}
                                                                />
                                                            }
                                                            label={item.label}
                                                            sx={{
                                                                color: 'var(--text-color)',
                                                                width: '100%',
                                                                margin: '0 !important',
                                                                padding: '0 !important'
                                                            }}
                                                        />
                                                    </MenuItem>
                                                ))}
                                                <Box
                                                    sx={{
                                                        display: 'flex',
                                                        justifyContent: 'center',
                                                        alignItems: 'center',
                                                        gap: '16px',
                                                        mt: '10px'
                                                    }}
                                                >
                                                    <Button
                                                        variant='contained'
                                                        color='error'
                                                        sx={{
                                                            fontSize: '14px',
                                                            fontWeight: 'bold',
                                                            height: '36x',
                                                            color: 'var(--text-button-reject)',
                                                            backgroundColor: 'var(--bg-button-reject)',
                                                            borderRadius: '8px',
                                                            '&:hover': {
                                                                backgroundColor: 'var(--bg-button-reject-hover)'
                                                            },
                                                            textTransform: 'none'
                                                        }}
                                                        onClick={handleCancel}
                                                    >
                                                        {t('COMMON.BUTTON.CANCEL')}
                                                    </Button>
                                                    <Button
                                                        variant='contained'
                                                        color='primary'
                                                        sx={{
                                                            fontSize: '14px',
                                                            fontWeight: 'bold',
                                                            height: '36x',
                                                            color: 'var(--text-button-accept)',
                                                            backgroundColor: 'var(--bg-button-accept)',
                                                            borderRadius: '8px',
                                                            '&:hover': {
                                                                backgroundColor: 'var(--bg-button-accept-hover)'
                                                            },
                                                            textTransform: 'none'
                                                        }}
                                                        onClick={handleOkClick}
                                                    >
                                                        {t('COMMON.USER.FILTER_V')}
                                                    </Button>
                                                </Box>
                                            </MenuList>
                                        </ClickAwayListener>
                                    </Paper>
                                </Grow>
                            )}
                        </Popper>
                    </Box>
                </Box>

                {typeDisplay === 1 ? <DataGrid data={dataAttendance} /> : <TableData attendanceData={dataAttendance} />}

                <Box display='flex' alignItems='center' justifyContent='space-between' padding='35px'>
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
                            defaultValue='10'
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
                        count={Math.ceil(totalRecords / Number(rowsPerPage))}
                        page={page}
                        onChange={handleChangePage}
                        boundaryCount={1}
                        siblingCount={2}
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
