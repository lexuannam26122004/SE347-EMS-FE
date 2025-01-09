'use client'
import { IFilterEmploymentContract } from '@/models/EmploymentContract'
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
import { useRouter } from 'next/navigation'
import TableReward from '@/components/TableReward'

import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'

function a11yProps(index: number) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`
    }
}

interface IGetAllDiscipline {
    Id: number
    FullName: string
    AvatarPath: string
    EmployeeId: string
    Department: string
    Money?: number
    Date: string
    Reason: string
    Note: string
    IsReceived: boolean
}

const responseData = {
    Data: {
        TotalRecords: 10,
        Records: [
            {
                Id: 1,
                UserId: 'CC-001',
                EmployeeId: 'Lê Xuân Nam',
                AvatarPath: '/images/avatar1.jpg',
                Department: 'Human Resources',
                Date: '2024-11-27',
                Reason: 'Hoàn thành xuất sắc công việc',
                Note: 'Khen thưởng vì đóng góp vượt mong đợi',
                IsReceived: true,
                Money: 2000000 // Số tiền thưởng (đơn vị: VNĐ)
            },
            {
                Id: 2,
                FullName: 'Nguyễn Văn Thành',
                EmployeeId: 'CC-002',
                AvatarPath: '/images/avatar2.jpg',
                Date: '2024-11-28',
                Department: 'Human Resources',
                Reason: 'Hỗ trợ tích cực đồng nghiệp',
                Note: 'Ghi nhận tinh thần đồng đội',
                IsReceived: true,
                Money: 1000000
            },
            {
                Id: 3,
                FullName: 'Trần Thị Hải Yến',
                EmployeeId: 'CC-003',
                AvatarPath: '/images/avatar3.jpg',
                Date: '2024-11-29',
                Department: 'IT Services',
                Reason: 'Đưa ra sáng kiến cải tiến quy trình',
                Note: 'Khen thưởng vì sáng kiến hữu ích',
                IsReceived: false,
                Money: 5000000
            },
            {
                Id: 4,
                FullName: 'Lê Văn Việt',
                EmployeeId: 'CC-004',
                AvatarPath: '/images/avatar4.jpg',
                Date: '2024-11-30',
                Department: 'Finance',
                Reason: 'Đạt KPI vượt mức',
                Note: 'Khen thưởng tháng',
                IsReceived: true,
                Money: 3000000
            },
            {
                Id: 5,
                FullName: 'Nguyễn Trọng Tất Thành',
                EmployeeId: 'CC-005',
                AvatarPath: '/images/avatar5.jpg',
                Department: 'IT Services',
                Date: '2024-12-01',
                Reason: 'Tích cực tham gia hoạt động công ty',
                Note: 'Ghi nhận tinh thần trách nhiệm',
                IsReceived: true,
                Money: 1500000
            },
            {
                Id: 6,
                FullName: 'Lê Minh Vũ Nam',
                EmployeeId: 'CC-006',
                AvatarPath: '/images/avatar6.jpg',
                Date: '2024-12-02',
                Department: 'Customer Support',
                Reason: 'Đạt giải nhân viên xuất sắc quý',
                Note: 'Khen thưởng quý',
                IsReceived: false,
                Money: 10000000
            },
            {
                Id: 7,
                FullName: 'Trần Thị Tuyết Phương',
                EmployeeId: 'CC-007',
                AvatarPath: '/images/avatar7.jpg',
                Department: 'Finance',
                Date: '2024-12-03',
                Reason: 'Hoàn thành dự án đúng tiến độ',
                Note: 'Khen thưởng vì đảm bảo thời gian và chất lượng',
                IsReceived: true,
                Money: 4000000
            },
            {
                Id: 8,
                FullName: 'Nguyen Thi K',
                EmployeeId: 'CC-008',
                AvatarPath: '/images/avatar8.jpg',
                Department: 'Customer Support',
                Date: '2024-12-04',
                Reason: 'Hỗ trợ khách hàng xuất sắc',
                Note: 'Ghi nhận thái độ phục vụ khách hàng',
                IsReceived: false,
                Money: 2500000
            },
            {
                Id: 9,
                FullName: 'Hoang Thi M',
                EmployeeId: 'CC-009',
                AvatarPath: '/images/avatar9.jpg',
                Date: '2024-12-05',
                Department: 'Customer Support',
                Reason: 'Góp phần cải thiện quy trình dịch vụ',
                Note: 'Khen thưởng vì nâng cao hiệu quả công việc',
                IsReceived: false,
                Money: 3500000
            },
            {
                Id: 10,
                FullName: 'Le Van N',
                EmployeeId: 'CC-010',
                AvatarPath: '/images/avatar10.jpg',
                Date: '2024-12-06',
                Department: 'Customer Support',
                Reason: 'Tham gia đào tạo và nâng cao kỹ năng',
                Note: 'Ghi nhận ý chí học hỏi',
                IsReceived: false,
                Money: 2000000
            }
        ]
    }
}

function Page() {
    const { t } = useTranslation('common')
    const router = useRouter()
    const [selected, setSelected] = useState<number[]>([])
    const [page, setPage] = useState(1)
    const [rowsPerPage, setRowsPerPage] = useState('5')
    const [from, setFrom] = useState(1)
    const [to, setTo] = useState(5)
    const [filter, setFilter] = useState<IFilterEmploymentContract>({
        pageSize: 5,
        pageNumber: 1,
        daysUntilExpiration: 60
    })
    const [keyword, setKeyword] = useState('')
    // const [openDialog, setOpenDialog] = useState(false)
    // const [selectedRow, setSelectedRow] = useState<number | null>(null)
    // const [order, setOrder] = useState<'asc' | 'desc'>('asc')
    // const [orderBy, setOrderBy] = useState<string>('')
    // const [selectedConfig, setSelectedConfig] = useState<IGetAllSysConfiguration | null>(null)
    // const [openModal, setOpenModal] = useState(false)

    useEffect(() => {}, [page, rowsPerPage, from, to, filter, keyword, selected, router, setSelected, setFrom, setTo])

    // const { data: responseD, isFetching, refetch } = useGetContractsExpiringSoonQuery(filter)

    // const handleClickDetail = (config: IGetAllSysConfiguration) => {
    //     setSelectedConfig(config)
    //     setOpenModal(true)
    // }

    const rewardData = responseData?.Data.Records as IGetAllDiscipline[]

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
    //         const from = (page - 1) * Number(rowsPerPage) + Math.min(1, rewardData.length)
    //         setFrom(from)

    //         const to = Math.min(rewardData.length + (page - 1) * Number(rowsPerPage), totalRecords)
    //         setTo(to)
    //     }
    // }, [isFetching, responseData, page, rowsPerPage])

    // useEffect(() => {
    //     refetch()
    // }, [filter])

    const [currentTab, setCurrentTab] = useState(0)

    // Lọc dữ liệu theo status
    const filteredData = useMemo(() => {
        switch (currentTab) {
            case 0: // All
                return rewardData
            case 1: // Pending
                return rewardData.filter(item => item.IsReceived === false)
            case 2: // In Progress
                return rewardData.filter(item => item.IsReceived === true)
            default:
                return rewardData
        }
    }, [rewardData, currentTab])

    const counts = useMemo(
        () => ({
            0: rewardData.length,
            1: rewardData.filter(item => item.IsReceived === false).length,
            2: rewardData.filter(item => item.IsReceived === true).length
        }),
        [rewardData]
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
                                    {t('COMMON.REWARD_DISCIPLINE.UNPROCESSED')}
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
                                    {t('COMMON.REWARD_DISCIPLINE.PROCESSED')}
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

                <Box display='flex' alignItems='center' gap='24px' margin='20px 24px'>
                    <Box sx={{ position: 'relative', width: '40%', height: '55px' }}>
                        <TextField
                            id='location-search'
                            type='search'
                            placeholder={t('COMMON.ERROR_REPORT.SEARCH')}
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

                    <Box>
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
                                <MenuItem value={'Reward'}>{t('COMMON.NOTIFICATION_TYPE.REWARD')}</MenuItem>
                                <MenuItem value={'Insurance'}>{t('COMMON.NOTIFICATION_TYPE.INSURANCE')}</MenuItem>
                                <MenuItem value={'Holiday'}>{t('COMMON.NOTIFICATION_TYPE.HOLIDAY')}</MenuItem>
                                <MenuItem value={'Discipline'}>{t('COMMON.NOTIFICATION_TYPE.DISCIPLINE')}</MenuItem>
                                <MenuItem value={'Timekeeping'}>{t('COMMON.NOTIFICATION_TYPE.TIMEKEEPING')}</MenuItem>
                            </Select>
                        </FormControl>
                    </Box>
                </Box>

                <TableReward rewardsData={filteredData} totalRecords={totalRecords} type={currentTab} />

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
