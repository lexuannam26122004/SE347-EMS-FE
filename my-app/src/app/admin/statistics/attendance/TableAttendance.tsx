'use client'
import {
    Box,
    Select,
    Pagination,
    Typography,
    MenuItem,
    SelectChangeEvent,
    Paper,
    TextField,
    InputAdornment
} from '@mui/material'
import { useState, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import SearchIcon from '@mui/icons-material/Search'
import TableData from './TableData'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import { IFilterAttendance } from '@/models/Timekeeping'
import dayjs from 'dayjs'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker'
import { renderTimeViewClock } from '@mui/x-date-pickers/timeViewRenderers'
import { toZonedTime, format } from 'date-fns-tz'

const convertToVietnamTime = (date: Date) => {
    if (isNaN(date.getTime())) {
        throw new Error('Invalid Date')
    }

    // Múi giờ Việt Nam
    const timeZone = 'Asia/Ho_Chi_Minh'

    // Chuyển thời gian từ UTC sang thời gian theo múi giờ Việt Nam
    const vietnamTime = toZonedTime(date, timeZone)

    // Định dạng thời gian theo kiểu ISO (YYYY-MM-DDTHH:mm:ss)
    const formattedDate = format(vietnamTime, "yyyy-MM-dd'T'HH:mm:ss")

    return formattedDate // Trả về thời gian đã được định dạng
}

function a11yProps(index: number) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`
    }
}

const responseData = {
    Data: {
        TotalRecords: 20,
        Records: [
            {
                Id: 1,
                UserId: 'CC-001',
                FullName: 'Lê Xuân Nam',
                Date: new Date('2024-12-01'),
                AvatarPath: '/avatars/jane_smith.png',
                CheckInTime: '08:00',
                CheckOutTime: '17:00',
                CheckInIP: '192.168.1.1',
                Department: 'Human Resources',
                Note: 'Normal working day',
                Agent: 'Chrome',
                IsValid: true,
                Overtime: '01:00',
                TotalHours: 8.05
            },
            {
                Id: 2,
                FullName: 'Nguyễn Văn Thành',
                UserId: 'CC-002',
                AvatarPath: '/avatars/jane_smith.png',
                Date: new Date('2024-12-01'),
                CheckInTime: '08:15',
                Department: 'Customer Support',
                CheckOutTime: '16:30',
                CheckInIP: '192.168.1.2',
                Note: 'Slightly late',
                Agent: 'Firefox',
                IsValid: true,
                Overtime: '00:45',
                TotalHours: 8.09
            },
            {
                Id: 3,
                FullName: 'Trần Thị Hải Yến',
                UserId: 'CC-003',
                AvatarPath: '/avatars/alice_johnson.png',
                Date: new Date('2024-12-01'),
                Department: 'Human Resources',
                CheckInTime: '07:50',
                CheckOutTime: '16:50',
                CheckInIP: '192.168.1.3',
                Note: 'Early check-in',
                Agent: 'Edge',
                IsValid: true,
                Overtime: '01:30',
                TotalHours: 8.15
            },
            {
                Id: 4,
                FullName: 'Lê Văn Việt',
                UserId: 'CC-004',
                AvatarPath: '/avatars/bob_brown.png',
                Date: new Date('2024-12-01'),
                CheckInTime: '09:00',
                CheckOutTime: '18:00',
                CheckInIP: '192.168.1.4',
                Department: 'Human Resources',
                Note: 'Late check-in',
                Agent: 'Safari',
                IsValid: false,
                Overtime: '00:00',
                TotalHours: 7.5
            },
            {
                Id: 5,
                FullName: 'Nguyễn Trọng Tất Thành',
                UserId: 'CC-005',
                AvatarPath: '/avatars/charlie_davis.png',
                Date: new Date('2024-12-01'),
                CheckInTime: '08:10',
                CheckOutTime: '18:10',
                CheckInIP: '192.168.1.5',
                Note: 'On time',
                Agent: 'Chrome',
                Department: 'Customer Support',
                IsValid: true,
                Overtime: '00:50',
                TotalHours: 8
            },
            {
                Id: 6,
                FullName: 'Lê Minh Vũ Nam',
                UserId: 'CC-006',
                AvatarPath: '/avatars/diana_evans.png',
                Date: new Date('2024-12-01'),
                CheckInTime: '08:30',
                CheckOutTime: '17:45',
                CheckInIP: '192.168.1.6',
                Note: 'Worked extra hours',
                Agent: 'Firefox',
                Department: 'IT Services',
                IsValid: true,
                Overtime: '01:15',
                TotalHours: 8
            },
            {
                Id: 7,
                FullName: 'Trần Thị Tuyết Phương',
                UserId: 'CC-007',
                AvatarPath: '/avatars/ethan_wilson.png',
                Date: new Date('2024-12-01'),
                CheckInTime: '08:00',
                CheckOutTime: '17:00',
                CheckInIP: '192.168.1.7',
                Note: 'Normal working day',
                Agent: 'Edge',
                IsValid: true,
                Department: 'Human Resources',
                Overtime: '00:00',
                TotalHours: 8
            },
            {
                Id: 8,
                FullName: 'Nguyen Thi K',
                UserId: 'CC-008',
                AvatarPath: '/avatars/fiona_harris.png',
                Date: new Date('2024-12-01'),
                CheckInTime: '08:45',
                CheckOutTime: '18:00',
                CheckInIP: '192.168.1.8',
                Note: 'Late check-in, overtime worked',
                Agent: 'Chrome',
                IsValid: true,
                Overtime: '01:15',
                Department: 'Human Resources',
                TotalHours: 8
            },
            {
                Id: 9,
                FullName: 'Hoang Thi M',
                UserId: 'CC-009',
                AvatarPath: '/avatars/george_king.png',
                Date: new Date('2024-12-01'),
                CheckInTime: '07:45',
                CheckOutTime: '16:30',
                Department: 'Finance',
                CheckInIP: '192.168.1.9',
                Note: 'Left early',
                Agent: 'Safari',
                IsValid: false,
                Overtime: '00:00',
                TotalHours: 8
            },
            {
                Id: 10,
                FullName: 'Le Van N',
                UserId: 'CC-010',
                AvatarPath: '/avatars/hannah_moore.png',
                Date: new Date('2024-12-01'),
                CheckInTime: '08:05',
                CheckOutTime: '17:20',
                CheckInIP: '192.168.1.10',
                Note: 'Slightly early',
                Department: 'Customer Support',
                Agent: 'Chrome',
                IsValid: true,
                Overtime: '00:50',
                TotalHours: 8
            },
            {
                Id: 11,
                UserId: 'CC011',
                FullName: 'Ian Turner',
                AvatarPath: '/avatars/ian_turner.png',
                Date: new Date('2024-12-01'),
                CheckInTime: '08:00',
                CheckOutTime: '17:00',
                CheckInIP: '192.168.1.11',
                Department: 'Operations',
                Note: 'Normal working day',
                Agent: 'Edge',
                IsValid: true,
                Overtime: '00:00',
                TotalHours: 8
            },
            {
                Id: 12,
                UserId: 'CC012',
                FullName: 'Jessica Wright',
                AvatarPath: '/avatars/jessica_wright.png',
                Date: new Date('2024-12-01'),
                CheckInTime: '07:55',
                CheckOutTime: '16:50',
                Department: 'Finance',
                CheckInIP: '192.168.1.12',
                Note: 'Early check-in',
                Agent: 'Firefox',
                IsValid: true,
                Overtime: '01:10',
                TotalHours: 8
            },
            {
                Id: 13,
                UserId: 'CC013',
                FullName: 'Kevin Scott',
                AvatarPath: '/avatars/kevin_scott.png',
                Date: new Date('2024-12-01'),
                CheckInTime: '08:20',
                CheckOutTime: '17:30',
                CheckInIP: '192.168.1.13',
                Department: 'Finance',
                Note: 'Slightly late',
                Agent: 'Chrome',
                IsValid: true,
                Overtime: '00:40',
                TotalHours: 8
            },
            {
                Id: 14,
                UserId: 'CC014',
                FullName: 'Laura Carter',
                AvatarPath: '/avatars/laura_carter.png',
                Date: new Date('2024-12-01'),
                CheckInTime: '08:00',
                CheckOutTime: '17:10',
                CheckInIP: '192.168.1.14',
                Note: 'Normal working day',
                Agent: 'Safari',
                IsValid: true,
                Department: 'Human Resources',
                Overtime: '00:30',
                TotalHours: 8
            },
            {
                Id: 15,
                UserId: 'CC015',
                FullName: 'Michael Adams',
                AvatarPath: '/avatars/michael_adams.png',
                Date: new Date('2024-12-01'),
                CheckInTime: '09:00',
                Department: 'IT Services',
                CheckOutTime: '18:00',
                CheckInIP: '192.168.1.15',
                Note: 'Late check-in',
                Agent: 'Edge',
                IsValid: false,
                Overtime: '00:00',
                TotalHours: 8
            },
            {
                Id: 16,
                UserId: 'CC016',
                FullName: 'Natalie Baker',
                AvatarPath: '/avatars/natalie_baker.png',
                Date: new Date('2024-12-01'),
                CheckInTime: '08:30',
                CheckOutTime: '17:45',
                Department: 'IT Services',
                CheckInIP: '192.168.1.16',
                Note: 'Worked extra hours',
                Agent: 'Chrome',
                IsValid: true,
                Overtime: '01:15',
                TotalHours: 8
            },
            {
                Id: 17,
                UserId: 'CC017',
                FullName: 'Oliver Brown',
                AvatarPath: '/avatars/oliver_brown.png',
                Date: new Date('2024-12-01'),
                CheckInTime: '08:00',
                CheckOutTime: '17:00',
                CheckInIP: '192.168.1.17',
                Note: 'Normal working day',
                Department: 'IT Services',
                Agent: 'Firefox',
                IsValid: true,
                Overtime: '00:00',
                TotalHours: 8
            },
            {
                Id: 18,
                UserId: 'CC018',
                FullName: 'Penelope Clark',
                AvatarPath: '/avatars/penelope_clark.png',
                Date: new Date('2024-12-01'),
                CheckInTime: '08:40',
                CheckOutTime: '18:10',
                Department: 'Operations',
                CheckInIP: '192.168.1.18',
                Note: 'Late check-in, overtime worked',
                Agent: 'Chrome',
                IsValid: true,
                Overtime: '01:20',
                TotalHours: 8
            },
            {
                Id: 19,
                UserId: 'CC019',
                FullName: 'Quentin Diaz',
                AvatarPath: '/avatars/quentin_diaz.png',
                Date: new Date('2024-12-01'),
                CheckInTime: '07:45',
                CheckOutTime: '16:50',
                Department: 'Operations',
                CheckInIP: '192.168.1.19',
                Note: 'Left early',
                Agent: 'Safari',
                IsValid: false,
                Overtime: '00:00',
                TotalHours: 8
            },
            {
                Id: 20,
                UserId: 'CC020',
                FullName: 'Rachel Evans',
                AvatarPath: '/avatars/rachel_evans.png',
                Date: new Date('2024-12-01'),
                CheckInTime: '08:10',
                CheckOutTime: '17:20',
                Department: 'Finance',
                CheckInIP: '192.168.1.20',
                Note: 'Normal day',
                Agent: 'Firefox',
                IsValid: true,
                Overtime: '00:50',
                TotalHours: 8
            }
            // Thêm các record khác tương tự
        ]
    }
}

function Page() {
    const { t } = useTranslation('common')
    // const [selected, setSelected] = useState<number[]>([])
    const [page, setPage] = useState(1)
    const [rowsPerPage, setRowsPerPage] = useState('5')
    const [from] = useState(1)
    const [to] = useState(5)
    const [filter, setFilter] = useState<IFilterAttendance>({
        pageSize: 5,
        pageNumber: 1,
        startDate: convertToVietnamTime(new Date()),
        endDate: convertToVietnamTime(new Date())
    })
    const [keyword, setKeyword] = useState('')
    // const [openDialog, setOpenDialog] = useState(false)
    // const [selectedRow, setSelectedRow] = useState<number | null>(null)
    // const [order, setOrder] = useState<'asc' | 'desc'>('asc')
    // const [orderBy, setOrderBy] = useState<string>('')
    // const [selectedConfig, setSelectedConfig] = useState<IGetAllSysConfiguration | null>(null)
    //const [openModal, setOpenModal] = useState(false)

    // const { data: responseD, isFetching, refetch } = useGetContractsExpiringSoonQuery(filter)

    // const handleClickDetail = (config: IGetAllSysConfiguration) => {
    //     setSelectedConfig(config)
    //     setOpenModal(true)
    // }

    const attendanceData = responseData?.Data.Records

    const totalRecords = (responseData?.Data.TotalRecords as number) || 0

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

    const handleSearchKeyword = () => {
        setPage(1)
        setFilter(prev => {
            return {
                ...prev,
                keyword: keyword,
                pageNumber: 1
            }
        })
    }

    // useEffect(() => {
    //     if (!isFetching && responseData?.Data) {
    //         const from = (page - 1) * Number(rowsPerPage) + Math.min(1, DisciplineData.length)
    //         setFrom(from)

    //         const to = Math.min(DisciplineData.length + (page - 1) * Number(rowsPerPage), totalRecords)
    //         setTo(to)
    //     }
    // }, [isFetching, responseData, page, rowsPerPage])

    // useEffect(() => {
    //     refetch()
    // }, [filter])

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

    const [currentTab, setCurrentTab] = useState(0)

    // Lọc dữ liệu theo status
    const filteredData = useMemo(() => {
        switch (currentTab) {
            case 0: // All
                return attendanceData
            case 1: // Pending
                return attendanceData.filter(item => item.CheckInTime > '08:00')
            case 2: // In Progress
                return attendanceData.filter(item => item.CheckOutTime < '17:00')
            case 3: // Pending
                return attendanceData.filter(item => item.CheckInTime <= '08:00' && item.CheckOutTime >= '17:00')
            case 4: // In Progress
                return attendanceData.filter(item => item.IsValid === false)
            default:
                return attendanceData
        }
    }, [attendanceData, currentTab])

    const counts = useMemo(
        () => ({
            0: attendanceData.length,
            1: attendanceData.filter(item => item.CheckInTime > '08:00').length,
            2: attendanceData.filter(item => item.CheckOutTime < '17:00').length,
            3: attendanceData.filter(item => item.CheckInTime <= '08:00' && item.CheckOutTime >= '17:00').length,
            4: attendanceData.filter(item => item.IsValid === false).length
        }),
        [attendanceData]
    )

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
                    boxShadow: 'var(--box-shadow-paper)',
                    overflow: 'hidden',
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
                    {t('COMMON.ATTENDANCE.LIST_ATTENDANCE')}
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
                                    {t('COMMON.ATTENDANCE.ALL')}
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
                                    {t('COMMON.ATTENDANCE.STATUS_LATE')}
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
                                    {t('COMMON.ATTENDANCE.STATUS_EARLY')}
                                    <Box
                                        style={{
                                            ...badgeStyle,
                                            backgroundColor:
                                                currentTab === 2 ? 'var(--bg-closed-color)' : 'var(--bg-closed-color1)',
                                            color:
                                                currentTab === 2
                                                    ? 'var(--text-closed-color)'
                                                    : 'var(--text-closed-color1)'
                                        }}
                                    >
                                        {counts[2]}
                                    </Box>
                                </Box>
                            }
                            {...a11yProps(2)}
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
                                    {t('COMMON.ATTENDANCE.STATUS_ON_TIME')}
                                    <Box
                                        style={{
                                            ...badgeStyle,
                                            backgroundColor:
                                                currentTab === 3
                                                    ? 'var(--bg-success-color)'
                                                    : 'var(--bg-success-color1)',
                                            color:
                                                currentTab === 3
                                                    ? 'var(--text-success-color)'
                                                    : 'var(--text-success-color1)'
                                        }}
                                    >
                                        {counts[3]}
                                    </Box>
                                </Box>
                            }
                            {...a11yProps(3)}
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
                                    {t('COMMON.ATTENDANCE.STATUS_INVALID')}
                                    <Box
                                        style={{
                                            ...badgeStyle,
                                            backgroundColor:
                                                currentTab === 4 ? 'var(--bg-danger-color)' : 'var(--bg-danger-color1)',
                                            color:
                                                currentTab === 4
                                                    ? 'var(--text-danger-color)'
                                                    : 'var(--text-danger-color1)'
                                        }}
                                    >
                                        {counts[4]}
                                    </Box>
                                </Box>
                            }
                            {...a11yProps(4)}
                        />
                    </Tabs>
                </Box>

                <Box display='flex' alignItems='center' gap='24px' margin='20px 24px'>
                    <Box sx={{ position: 'relative', width: '40%', height: '55px' }}>
                        <TextField
                            id='location-search'
                            type='search'
                            placeholder={t('COMMON.ATTENDANCE.SEARCH')}
                            variant='outlined'
                            required
                            value={keyword}
                            onChange={e => setKeyword(e.target.value)}
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
                    </Box>

                    {/* <Box>
                        <FormControl
                            sx={{
                                width: '140px',
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
                                // open={openSelectType}
                                // onClose={handleCloseSelectType}
                                // onOpen={handleOpenSelectType}
                                // value={typeNotification}
                                // onChange={handleChange}
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
                                <MenuItem value={'Public'}>{t('COMMON.NOTIFICATION_TYPE.PUBLIC')}</MenuItem>
                                <MenuItem value={'Benefit'}>{t('COMMON.NOTIFICATION_TYPE.BENEFIT')}</MenuItem>
                                <MenuItem value={'Salary'}>{t('COMMON.NOTIFICATION_TYPE.SALARY')}</MenuItem>
                                <MenuItem value={'attendance'}>{t('COMMON.NOTIFICATION_TYPE.attendance')}</MenuItem>
                                <MenuItem value={'Insurance'}>{t('COMMON.NOTIFICATION_TYPE.INSURANCE')}</MenuItem>
                                <MenuItem value={'Holiday'}>{t('COMMON.NOTIFICATION_TYPE.HOLIDAY')}</MenuItem>
                                <MenuItem value={'attendance'}>{t('COMMON.NOTIFICATION_TYPE.attendance')}</MenuItem>
                                <MenuItem value={'Timekeeping'}>{t('COMMON.NOTIFICATION_TYPE.TIMEKEEPING')}</MenuItem>
                            </Select>
                        </FormControl>
                    </Box> */}

                    <Box
                        sx={{
                            display: 'flex',
                            gap: '24px'
                        }}
                    >
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DateTimePicker
                                label={t('COMMON.ATTENDANCE.CHECK_IN')}
                                value={dayjs(filter.startDate)}
                                onChange={value =>
                                    setFilter({
                                        ...filter,
                                        startDate: convertToVietnamTime(value?.toDate() || new Date())
                                    })
                                }
                                viewRenderers={{
                                    hours: renderTimeViewClock,
                                    minutes: renderTimeViewClock,
                                    seconds: renderTimeViewClock
                                }}
                                sx={{
                                    width: '100%',
                                    '& .MuiInputBase-root': {
                                        color: 'var(--text-color)'
                                    },
                                    '& .MuiInputBase-input': {
                                        padding: '15px 0 15px 14px'
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
                            <DateTimePicker
                                label={t('COMMON.ATTENDANCE.CHECK_OUT')}
                                value={dayjs(filter.endDate)}
                                onChange={value =>
                                    setFilter({
                                        ...filter,
                                        endDate: convertToVietnamTime(value?.toDate() || new Date())
                                    })
                                }
                                viewRenderers={{
                                    hours: renderTimeViewClock,
                                    minutes: renderTimeViewClock,
                                    seconds: renderTimeViewClock
                                }}
                                sx={{
                                    width: '100%',
                                    '& .MuiInputBase-root': {
                                        color: 'var(--text-color)'
                                    },
                                    '& .MuiInputBase-input': {
                                        padding: '15px 0 15px 14px'
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
                </Box>

                <TableData attendanceData={filteredData} type={currentTab} />

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
