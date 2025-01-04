import { Box, IconButton, InputLabel, Paper, Tooltip, Typography } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { useState } from 'react'
import {
    SelectChangeEvent,
    TextField,
    InputAdornment,
    Pagination,
    Dialog,
    DialogTitle,
    FormControlLabel,
    Switch,
    DialogContent
} from '@mui/material'
import Select from '@mui/material/Select'
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker'
import CircleIcon from '@mui/icons-material/Circle'
import { styled } from '@mui/material/styles'
import { SwitchProps } from '@mui/material/Switch'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import SearchIcon from '@mui/icons-material/Search'
import { Eye, Star } from 'lucide-react'
import dayjs from 'dayjs'
import CheckIcon from '@mui/icons-material/Check'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { DatePicker } from '@mui/x-date-pickers'
import { IEventGetAll, IFilterEvent } from '@/models/Event'
import { renderTimeViewClock } from '@mui/x-date-pickers/timeViewRenderers'
import { toZonedTime, format } from 'date-fns-tz'
import formatDateToTime from '@/utils/formatDateToTime'

export const eventData: IEventGetAll[] = [
    {
        Id: 1,
        Title: 'New Year Celebration',
        StartDate: '2024-01-01T00:00:00',
        EndDate: '2024-01-01T23:59:59',
        IsHoliday: true,
        Description: 'Celebration of the New Year.',
        Color: '#FF5733',
        AllDay: true
    },
    {
        Id: 2,
        Title: 'Team Meeting',
        StartDate: '2024-01-05T10:00:00',
        EndDate: '2024-01-05T12:00:00',
        IsHoliday: false,
        Description: 'Monthly team meeting.',
        Color: '#33C4FF',
        AllDay: false
    },
    {
        Id: 3,
        Title: 'Company Retreat',
        StartDate: '2024-01-15T09:00:00',
        EndDate: '2024-01-16T17:00:00',
        IsHoliday: false,
        Description: 'Annual company retreat.',
        Color: '#4CAF50',
        AllDay: false
    },
    {
        Id: 4,
        Title: "Valentine's Day",
        StartDate: '2024-02-14T00:00:00',
        EndDate: '2024-02-14T23:59:59',
        IsHoliday: true,
        Description: "Celebration of Valentine's Day.",
        Color: '#FF69B4',
        AllDay: true
    },
    {
        Id: 5,
        Title: 'Project Deadline',
        StartDate: '2024-03-01T08:00:00',
        EndDate: '2024-03-01T23:59:59',
        IsHoliday: false,
        Description: 'Final deadline for project submission.',
        Color: '#FFC300',
        AllDay: false
    },
    {
        Id: 6,
        Title: 'Team Building Activity',
        StartDate: '2024-03-10T14:00:00',
        EndDate: '2024-03-10T18:00:00',
        IsHoliday: false,
        Description: 'Outdoor team-building games and activities.',
        Color: '#7D3C98',
        AllDay: false
    },
    {
        Id: 7,
        Title: 'Easter Holiday',
        StartDate: '2024-03-31T00:00:00',
        EndDate: '2024-03-31T23:59:59',
        IsHoliday: true,
        Description: 'Easter Sunday celebration.',
        Color: '#FF7F50',
        AllDay: true
    },
    {
        Id: 8,
        Title: 'Conference Presentation',
        StartDate: '2024-04-15T09:00:00',
        EndDate: '2024-04-15T11:00:00',
        IsHoliday: false,
        Description: 'Presenting at the annual tech conference.',
        Color: '#2980B9',
        AllDay: false
    },
    {
        Id: 9,
        Title: 'Labor Day',
        StartDate: '2024-05-01T00:00:00',
        EndDate: '2024-05-01T23:59:59',
        IsHoliday: true,
        Description: 'International Labor Day holiday.',
        Color: '#E74C3C',
        AllDay: true
    },
    {
        Id: 10,
        Title: 'Summer Vacation',
        StartDate: '2024-06-15T00:00:00',
        EndDate: '2024-06-20T23:59:59',
        IsHoliday: false,
        Description: 'Family summer vacation.',
        Color: '#F39C12',
        AllDay: true
    }
]

// interface IGetAll {
//     avatarPath: string
//     fullname: string
//     count: number
//     employeeID: string
//     roles: string[]
// }

const responseData = {
    Data: {
        TotalRecords: eventData.length,
        Records: eventData
    }
}

const IOSSwitch = styled((props: SwitchProps) => (
    <Switch focusVisibleClassName='.Mui-focusVisible' disableRipple {...props} />
))(({ theme }) => ({
    width: 40,
    height: 24,
    padding: 0,
    '& .MuiSwitch-switchBase': {
        padding: 0,
        margin: 2,
        cursor: 'default', // Con trỏ mặc định
        transitionDuration: '300ms',
        '&.Mui-checked': {
            transform: 'translateX(16px)',
            color: '#fff',
            '& + .MuiSwitch-track': {
                backgroundColor: '#65C466',
                opacity: 1,
                border: 0,
                ...theme.applyStyles('dark', {
                    backgroundColor: '#2ECA45'
                })
            },
            '&.Mui-disabled + .MuiSwitch-track': {
                opacity: 0.5
            }
        },
        '&.Mui-focusVisible .MuiSwitch-thumb': {
            color: '#33cf4d',
            border: '6px solid #fff'
        },
        '&.Mui-disabled .MuiSwitch-thumb': {
            color: theme.palette.grey[100],
            ...theme.applyStyles('dark', {
                color: theme.palette.grey[600]
            })
        },
        '&.Mui-disabled + .MuiSwitch-track': {
            opacity: 0.7,
            ...theme.applyStyles('dark', {
                opacity: 0.3
            })
        }
    },
    '& .MuiSwitch-thumb': {
        boxSizing: 'border-box',
        width: 20,
        height: 20
    },
    '& .MuiSwitch-track': {
        borderRadius: 26 / 2,
        backgroundColor: 'var(--background-switch)',
        opacity: 1,
        transition: theme.transitions.create(['background-color'], {
            duration: 500
        }),
        ...theme.applyStyles('dark', {
            backgroundColor: '#39393D'
        })
    }
}))

const convertToVietnamTime = (date: Date) => {
    if (isNaN(date.getTime())) {
        throw new Error('Invalid Date')
    }

    const timeZone = 'Asia/Ho_Chi_Minh'

    const vietnamTime = toZonedTime(date, timeZone)

    const formattedDate = format(vietnamTime, "yyyy-MM-dd'T'HH:mm:ss")

    return formattedDate // Trả về thời gian đã được định dạng
}

const colors = ['#00a76f', '#8e33ff', '#00b8d9', '#003768', '#22c55e', '#ffcc00', '#ff5630', '#7a0916']

function Page() {
    const { t } = useTranslation('common')

    const currentMonth = new Date().getMonth()
    const currentYear = new Date().getFullYear()
    const [type] = useState(0)
    const [value, setValue] = useState(currentMonth)
    const [keyword, setKeyword] = useState('')
    const [filter, setFilter] = useState<IFilterEvent>({
        pageSize: 7,
        startDate: dayjs().startOf('month').format('YYYY-MM-DD HH:mm:ss'), // Đầu tháng với giờ
        endDate: dayjs().endOf('month').format('YYYY-MM-DD HH:mm:ss'), // Cuối tháng với giờ
        pageNumber: 1
    })
    const [rowsPerPage] = useState('10')
    const [from] = useState(1)
    const [to] = useState(5)
    const [selectedEvent, setSelectedEvent] = useState<IEventGetAll | null>(null)

    const handleSearchKeyword = () => {
        console.log(value)
    }

    //const notifyData = responseData?.Data.Records as IEventGetAll[]

    const totalRecords = (responseData?.Data.TotalRecords as number) || 0

    // const handleTypeChange = (event: SelectChangeEvent<number>) => {
    //     setType(event.target.value as number)
    // }

    const handleValueChange = (event: SelectChangeEvent<number>) => {
        setValue(event.target.value as number)
    }

    const [page, setPage] = useState(1)

    const handleChangePage = (event: React.ChangeEvent<unknown>, newPage: number) => {
        setPage(newPage)
        setFilter(prev => {
            return {
                ...prev,
                pageNumber: newPage
            }
        })
    }

    return (
        <>
            <Paper
                sx={{
                    width: '100%',
                    height: '100%',
                    overflow: 'hidden',
                    display: 'flex',
                    boxShadow: 'var(--box-shadow-paper)',
                    flexDirection: 'column',
                    borderRadius: '15px',
                    backgroundColor: 'var(--background-item)'
                }}
            >
                <Typography
                    variant='h5'
                    sx={{
                        fontSize: '18px',
                        padding: '24px 24px 0',
                        fontWeight: 'bold',
                        color: 'var(--text-color)'
                    }}
                >
                    {t('COMMON.USER_SCHEDULAR.TITLE')}
                </Typography>

                <Box
                    sx={{
                        mt: '24px',
                        padding: '0 24px',
                        display: 'flex',
                        gap: '18px'
                    }}
                >
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker
                            label={t('COMMON.USER.START_DATE')}
                            value={dayjs(filter.startDate)}
                            onChange={value =>
                                setFilter({
                                    ...filter,
                                    startDate: convertToVietnamTime(value?.toDate() || new Date())
                                })
                            }
                            sx={{
                                width: '100%',
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
                            value={dayjs(filter.startDate)}
                            onChange={value =>
                                setFilter({
                                    ...filter,
                                    startDate: convertToVietnamTime(value?.toDate() || new Date())
                                })
                            }
                            sx={{
                                width: '100%',
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
                </Box>
                <Box
                    sx={{
                        display: 'flex',
                        gap: '18px',
                        padding: '18px 24px 0'
                    }}
                >
                    <TextField
                        id='location-search'
                        type='search'
                        placeholder={t('COMMON.USER_SCHEDULAR.SEARCH_PLACEHOLDER')}
                        variant='outlined'
                        required
                        value={keyword}
                        onChange={e => setKeyword(e.target.value)}
                        sx={{
                            color: 'var(--text-color)',
                            padding: '0px',
                            flex: 1,
                            '& fieldset': {
                                borderRadius: '10px',
                                borderColor: 'var(--border-color)'
                            },
                            '& .MuiInputBase-root': { paddingLeft: '0px', paddingRight: '12px' },
                            '& .MuiInputBase-input': {
                                padding: '10px 0px',
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
                        onKeyDown={() => {
                            handleSearchKeyword()
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
                    <FormControl
                        sx={{
                            width: '110px',
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
                        <InputLabel id='select-label'>{t('COMMON.USER_SCHEDULAR.FILTER_LABEL')}</InputLabel>
                        <Select
                            label={t('COMMON.USER_SCHEDULAR.FILTER_LABEL')}
                            defaultValue={type === 0 ? currentMonth : currentYear}
                            onChange={handleValueChange}
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
                                        width: '110px',
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
                            <MenuItem
                                sx={{
                                    padding: '8px',
                                    borderRadius: '6px'
                                }}
                                value={0}
                            >
                                {t('COMMON.USER_SCHEDULAR.FILTER_OPTIONS.ALL')}
                            </MenuItem>

                            <MenuItem
                                sx={{
                                    padding: '8px',
                                    borderRadius: '6px',
                                    mt: '3px'
                                }}
                                value={1}
                            >
                                {t('COMMON.USER_SCHEDULAR.FILTER_OPTIONS.HOLIDAY')}
                            </MenuItem>

                            <MenuItem
                                sx={{
                                    padding: '8px',
                                    borderRadius: '6px',
                                    mt: '3px'
                                }}
                                value={2}
                            >
                                {t('COMMON.USER_SCHEDULAR.FILTER_OPTIONS.NON_HOLIDAY')}
                            </MenuItem>
                        </Select>
                    </FormControl>
                </Box>

                <Box
                    sx={{
                        flex: 1,
                        border: '1px dashed var(--border-color)',
                        borderRadius: '15px',
                        overflow: 'hidden',
                        margin: '18px 12px'
                    }}
                >
                    <Box
                        sx={{
                            height: '100%',
                            padding: '12px 5px 12px 12px',
                            overflow: 'auto',
                            scrollbarGutter: 'stable',
                            '&::-webkit-scrollbar': {
                                width: '7px',
                                height: '7px'
                            },
                            '&::-webkit-scrollbar-thumb': {
                                backgroundColor: 'var(--scrollbar-color)',
                                borderRadius: '10px'
                            }
                        }}
                    >
                        {eventData.map((event, index) => (
                            <Box
                                key={index}
                                sx={{
                                    '&:hover': {
                                        backgroundColor: 'var(--hover-color)'
                                    },
                                    borderRadius: '10px',
                                    padding: '12px 8px',
                                    display: 'flex',
                                    justifyContent: 'left',
                                    position: 'relative',
                                    alignItems: 'center'
                                }}
                            >
                                <Box
                                    sx={{
                                        backgroundColor: event.Color,
                                        borderRadius: '8px',
                                        width: '40px',
                                        height: '30px',
                                        mr: '12px'
                                    }}
                                />

                                <Box>
                                    <Typography
                                        sx={{
                                            color: 'var(--text-color)',
                                            fontWeight: 'bold',
                                            fontSize: '16px'
                                        }}
                                    >
                                        {event.Title}
                                    </Typography>
                                    <Box
                                        sx={{
                                            display: 'flex',
                                            gap: '5px',
                                            color: '#858494',
                                            fontSize: '14px',
                                            alignItems: 'center'
                                        }}
                                    >
                                        <Typography
                                            sx={{
                                                color: '#858494',
                                                fontSize: '14px'
                                            }}
                                        >
                                            {formatDateToTime(event.StartDate)}
                                        </Typography>
                                        {t('COMMON.STAT_NOTIFY.TO')}
                                        <Typography
                                            sx={{
                                                color: '#858494',
                                                fontSize: '14px'
                                            }}
                                        >
                                            {formatDateToTime(event.EndDate)}
                                        </Typography>
                                    </Box>
                                </Box>
                                {event.IsHoliday && (
                                    <Tooltip title={t('COMMON.STAT_NOTIFY.HOLIDAY')}>
                                        <Star
                                            size={16}
                                            style={{
                                                cursor: 'default',
                                                position: 'absolute',
                                                right: '60px',
                                                color: '#FFAA00',
                                                fill: '#FFAA00',
                                                verticalAlign: 'middle',
                                                marginRight: '6px'
                                            }}
                                        />
                                    </Tooltip>
                                )}

                                <Box
                                    display='flex'
                                    alignItems='center'
                                    justifyContent='center'
                                    sx={{
                                        ml: 'auto',
                                        color: '#00d100',
                                        borderRadius: '50%',
                                        width: '42px',
                                        height: '42px',
                                        '&:hover': {
                                            cursor: 'pointer',
                                            backgroundColor: 'var(--hover-color)'
                                        }
                                    }}
                                    onClick={() => setSelectedEvent(event)}
                                >
                                    <Eye />
                                </Box>
                            </Box>
                        ))}
                    </Box>
                </Box>

                <Box display='flex' alignItems='center' justifyContent='space-between' padding='0px 24px 20px'>
                    <Typography sx={{ color: 'var(--text-color)' }}>
                        {t('COMMON.PAGINATION.FROM_TO', { from, to, totalRecords })}
                    </Typography>
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

            <Dialog
                open={selectedEvent !== null}
                sx={{
                    '& .MuiDialog-container': {
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center'
                    },
                    '& .MuiDialog-paper': {
                        backgroundColor: 'var(--background-dialog)',
                        width: '444px',
                        margin: 0,
                        borderRadius: '16px',
                        maxWidth: 'none',
                        maxHeight: '82vh'
                    }
                }}
                onClose={() => setSelectedEvent(null)}
            >
                <DialogTitle
                    sx={{
                        padding: '24px',
                        fontSize: '18px',
                        fontWeight: 'bold',
                        color: 'var(--text-color)',
                        backgroundColor: 'var(--header-dialog)'
                    }}
                >
                    {t('COMMON.USER_SCHEDULAR.EVENT_DETAIL')}
                </DialogTitle>
                {selectedEvent && (
                    <DialogContent
                        sx={{
                            pr: '17px',
                            pb: '24px',
                            scrollbarGutter: 'stable',
                            '&::-webkit-scrollbar': {
                                width: '7px',
                                height: '7px'
                            },
                            '&::-webkit-scrollbar-thumb': {
                                backgroundColor: 'var(--scrollbar-color)',
                                borderRadius: '10px'
                            }
                        }}
                    >
                        <Box
                            width='100%'
                            sx={{
                                mt: '30px'
                            }}
                        >
                            <TextField
                                label={t('COMMON.CALENDAR.TITLE')}
                                slotProps={{
                                    input: {
                                        readOnly: true
                                    }
                                }}
                                sx={{
                                    width: '100%',
                                    '& fieldset': {
                                        borderRadius: '8px',
                                        color: 'var(--text-color)',
                                        borderColor: 'var(--border-dialog)'
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
                                    '& .MuiOutlinedInput-root.Mui-focused fieldset': {
                                        borderColor: 'var(--selected-field-color)'
                                    },
                                    '& .MuiInputLabel-root': {
                                        color: 'var(--text-label-color)'
                                    },
                                    '& .MuiInputLabel-root.Mui-focused': {
                                        color: 'var(--selected-field-color)'
                                    }
                                }}
                                value={selectedEvent?.Title}
                            />
                            <Typography
                                sx={{
                                    visibility: 'hidden',
                                    color: 'var(--error-color)',
                                    margin: '1px 0 0 10px',
                                    fontSize: '12px'
                                }}
                            >
                                {t('COMMON.TEXTFIELD.REQUIRED')}
                            </Typography>
                        </Box>
                        <Box
                            width='100%'
                            sx={{
                                mt: '10px'
                            }}
                        >
                            <TextField
                                label={t('COMMON.CALENDAR.DESCRIPTION')}
                                multiline
                                slotProps={{
                                    input: {
                                        readOnly: true
                                    }
                                }}
                                rows={3}
                                sx={{
                                    width: '100%',
                                    '& fieldset': {
                                        borderRadius: '8px',
                                        color: 'var(--text-color)',
                                        borderColor: 'var(--border-dialog)'
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
                                value={selectedEvent?.Description}
                            />
                            <Typography
                                sx={{
                                    visibility: 'hidden',
                                    color: 'var(--error-color)',
                                    margin: '1px 0 0 10px',
                                    fontSize: '12px'
                                }}
                            >
                                {t('COMMON.TEXTFIELD.REQUIRED')}
                            </Typography>
                        </Box>

                        <FormControlLabel
                            sx={{
                                mt: '0px',
                                cursor: 'default',
                                ml: '-8px',
                                mb: '20px',
                                '& .MuiFormControlLabel-label': {
                                    color: 'var(--text-color)',
                                    fontSize: '16px'
                                }
                            }}
                            control={<IOSSwitch sx={{ m: 1, mr: 2 }} checked={selectedEvent?.AllDay} />}
                            label={t('COMMON.CALENDAR.ALL_DAY')}
                        />

                        <Box>
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DateTimePicker
                                    label='Ngày bắt đầu'
                                    value={dayjs(selectedEvent?.StartDate)}
                                    viewRenderers={{
                                        hours: renderTimeViewClock,
                                        minutes: renderTimeViewClock,
                                        seconds: renderTimeViewClock
                                    }}
                                    slotProps={{
                                        textField: {
                                            inputProps: { onKeyDown: e => e.preventDefault(), readOnly: true } // Vô hiệu hóa sự kiện bàn phím
                                        }
                                    }}
                                    sx={{
                                        width: '100%',
                                        '& .MuiInputAdornment-root': {
                                            pointerEvents: 'none' // Vô hiệu hóa sự kiện click trên icon
                                        },
                                        '& .MuiInputBase-root': {
                                            color: 'var(--text-color)'
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

                        <Box
                            sx={{
                                mt: '26px'
                            }}
                        >
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DateTimePicker
                                    label='Ngày kết thúc'
                                    value={dayjs(selectedEvent?.EndDate)}
                                    viewRenderers={{
                                        hours: renderTimeViewClock,
                                        minutes: renderTimeViewClock,
                                        seconds: renderTimeViewClock
                                    }}
                                    slotProps={{
                                        textField: {
                                            inputProps: { onKeyDown: e => e.preventDefault(), readOnly: true } // Vô hiệu hóa sự kiện bàn phím
                                        }
                                    }}
                                    sx={{
                                        width: '100%',
                                        '& .MuiInputAdornment-root': {
                                            pointerEvents: 'none' // Vô hiệu hóa sự kiện click trên icon
                                        },
                                        '& .MuiInputBase-root': {
                                            color: 'var(--text-color)'
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

                        {selectedEvent?.IsHoliday === false && (
                            <Box sx={{ marginTop: '25px', ml: '1px', display: 'flex', gap: '16px' }}>
                                {colors.map(color => (
                                    <Box key={color}>
                                        <IconButton
                                            sx={{
                                                padding: '0px',
                                                color: color,
                                                cursor: 'default',
                                                boxShadow:
                                                    selectedEvent?.Color === color ? `0px 2px 6px ${color}` : 'none',
                                                transition: 'transform 0.2s, box-shadow 0.2s',
                                                position: 'relative'
                                            }}
                                        >
                                            <CircleIcon
                                                sx={{
                                                    transform:
                                                        selectedEvent?.Color === color ? 'scale(1.3)' : 'scale(1)'
                                                }}
                                            />
                                            {selectedEvent?.Color === color && (
                                                <CheckIcon
                                                    sx={{
                                                        color: 'white',
                                                        fontSize: '14px',
                                                        position: 'absolute',
                                                        top: '50%',
                                                        left: '50%',
                                                        transform: 'translate(-50%, -50%)'
                                                    }}
                                                />
                                            )}
                                        </IconButton>
                                    </Box>
                                ))}
                            </Box>
                        )}
                    </DialogContent>
                )}
            </Dialog>
        </>
    )
}

export default Page
