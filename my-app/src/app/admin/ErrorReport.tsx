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
import TableErrorReport from '@/components/TableErrorReport'

import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'

function a11yProps(index: number) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`
    }
}

interface IGetAllErrorReport {
    Id: number
    FullNameReported: string
    AvatarReportedPath: string
    EmployeeIdReported: string
    ReportedDate: string
    Type: string
    TypeId: string
    Description: string
    Status: string
    AvatarResolvedPath: string
    FullNameResolved: string | null
    ResolvedDate: string | null
    ResolutionDetails: string | null
}

const responseData = {
    Data: {
        TotalRecords: 10,
        Records: [
            {
                Id: 1,
                FullNameReported: 'Lê Xuân Nam',
                EmployeeIdReported: 'CC-001',
                ReportedDate: '2024-11-27 00:00:00.0000000',
                Type: 'Salary',
                TypeId: 'S0001',
                Description: 'Bảng lương sai',
                Status: 'Rejected',
                FullNameResolved: 'Nguyen Van D',
                ResolvedDate: '2024-11-27',
                ResolutionDetails: null
            },
            {
                Id: 2,
                FullNameReported: 'Nguyễn Văn Thành',
                EmployeeIdReported: 'CC-002',
                ReportedDate: '2024-11-28 00:00:00.0000000',
                Type: 'Benefit',
                TypeId: 'L0001',
                Description: 'Sai thông tin phép năm',
                Status: 'Pending',
                FullNameResolved: null,
                ResolvedDate: null,
                ResolutionDetails: null
            },
            {
                Id: 3,
                FullNameReported: 'Trần Thị Hải Yến',
                EmployeeIdReported: 'CC-003',
                ReportedDate: '2024-11-29 00:00:00.0000000',
                Type: 'Discipline',
                TypeId: 'O0001',
                Description: 'Tăng ca không được tính',
                Status: 'In Progress',
                FullNameResolved: 'Nguyen Van D',
                ResolvedDate: '2024-12-01 00:00:00.0000000',
                ResolutionDetails: 'Đã cập nhật dữ liệu tăng ca'
            },
            {
                Id: 4,
                FullNameReported: 'Lê Văn Việt',
                EmployeeIdReported: 'CC-004',
                ReportedDate: '2024-11-30 00:00:00.0000000',
                Type: 'Salary',
                TypeId: 'S0002',
                Description: 'Thưởng Tết không đúng',
                Status: 'Pending',
                FullNameResolved: null,
                ResolvedDate: null,
                ResolutionDetails: null
            },
            {
                Id: 5,
                FullNameReported: 'Nguyễn Trọng Tất Thành',
                EmployeeIdReported: 'CC-005',
                ReportedDate: '2024-12-01 00:00:00.0000000',
                Type: 'Reward',
                TypeId: 'L0002',
                Description: 'Đăng ký nghỉ nhưng không được duyệt',
                Status: 'Resolved',
                FullNameResolved: 'Nguyen Van G',
                ResolvedDate: '2024-12-03 00:00:00.0000000',
                ResolutionDetails: 'Đã xử lý phê duyệt nghỉ'
            },
            {
                Id: 6,
                FullNameReported: 'Lê Minh Vũ Nam',
                EmployeeIdReported: 'CC-006',
                ReportedDate: '2024-12-02 00:00:00.0000000',
                Type: 'Timekeeping',
                TypeId: 'O0002',
                Description: 'Sai số giờ tăng ca',
                Status: 'Pending',
                FullNameResolved: null,
                ResolvedDate: null,
                ResolutionDetails: null
            },
            {
                Id: 7,
                FullNameReported: 'Trần Thị Tuyết Phương',
                EmployeeIdReported: 'CC-007',
                ReportedDate: '2024-12-03 00:00:00.0000000',
                Type: 'Salary',
                TypeId: 'S0003',
                Description: 'Chưa nhận được lương tháng 11',
                Status: 'In Progress',
                FullNameResolved: null,
                ResolvedDate: null,
                ResolutionDetails: null
            },
            {
                Id: 8,
                FullNameReported: 'Nguyen Thi K',
                EmployeeIdReported: 'CC-008',
                ReportedDate: '2024-12-04 00:00:00.0000000',
                Type: 'Insurance',
                TypeId: 'L0003',
                Description: 'Ngày phép bị trừ sai',
                Status: 'Resolved',
                FullNameResolved: 'Pham Van L',
                ResolvedDate: '2024-12-05 00:00:00.0000000',
                ResolutionDetails: 'Đã điều chỉnh ngày phép'
            },
            {
                Id: 9,
                FullNameReported: 'Hoang Thi M',
                EmployeeIdReported: 'CC-009',
                ReportedDate: '2024-12-05 00:00:00.0000000',
                Type: 'Contract',
                TypeId: 'O0003',
                Description: 'Tăng ca bị thiếu tiền',
                Status: 'Rejected',
                FullNameResolved: 'Nguyen Van D',
                ResolvedDate: '2024-11-27',
                ResolutionDetails: null
            },
            {
                Id: 10,
                FullNameReported: 'Le Van N',
                EmployeeIdReported: 'CC-010',
                ReportedDate: '2024-12-06 00:00:00.0000000',
                Type: 'All',
                TypeId: 'S0004',
                Description: 'Sai bậc lương',
                Status: 'Pending',
                FullNameResolved: null,
                ResolvedDate: null,
                ResolutionDetails: null
            }
        ]
    }
}

function ContractExpPage() {
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
    const [openDialog, setOpenDialog] = useState(false)
    const [selectedRow, setSelectedRow] = useState<number | null>(null)
    const [order, setOrder] = useState<'asc' | 'desc'>('asc')
    const [orderBy, setOrderBy] = useState<string>('')
    // const [selectedConfig, setSelectedConfig] = useState<IGetAllSysConfiguration | null>(null)
    const [openModal, setOpenModal] = useState(false)

    // const { data: responseD, isFetching, refetch } = useGetContractsExpiringSoonQuery(filter)

    // const handleClickDetail = (config: IGetAllSysConfiguration) => {
    //     setSelectedConfig(config)
    //     setOpenModal(true)
    // }

    useEffect(() => {}, [
        router,
        page,
        rowsPerPage,
        from,
        to,
        filter,
        selected,
        openDialog,
        selectedRow,
        order,
        orderBy,
        openModal,
        setSelected,
        setSelectedRow,
        setOpenDialog,
        setFrom,
        setTo,
        setOrder,
        setOrderBy,
        setOpenModal
    ])

    const errorsData = responseData?.Data.Records as IGetAllErrorReport[]

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
    //         const from = (page - 1) * Number(rowsPerPage) + Math.min(1, errorsData.length)
    //         setFrom(from)

    //         const to = Math.min(errorsData.length + (page - 1) * Number(rowsPerPage), totalRecords)
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
                return errorsData
            case 1: // Pending
                return errorsData.filter(item => item.Status === 'Pending')
            case 2: // In Progress
                return errorsData.filter(item => item.Status === 'In Progress')
            case 3: // Resolved
                return errorsData.filter(item => item.Status === 'Resolved')
            case 4: // Rejected
                return errorsData.filter(item => item.Status === 'Rejected')
            default:
                return errorsData
        }
    }, [errorsData, currentTab])

    const counts = useMemo(
        () => ({
            0: errorsData.length,
            1: errorsData.filter(item => item.Status === 'Pending').length,
            2: errorsData.filter(item => item.Status === 'In Progress').length,
            3: errorsData.filter(item => item.Status === 'Resolved').length,
            4: errorsData.filter(item => item.Status === 'Rejected').length
        }),
        [errorsData]
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
        <Paper
            elevation={0}
            sx={{
                width: '100%',
                overflow: 'hidden',
                height: '605px',
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
                {t('COMMON.ERROR_REPORT.TITLE')}
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
                                            currentTab === 0 ? 'var(--text-all-color1)' : 'var(--text-rejected-color1)'
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
                                {t('COMMON.ERROR_REPORT.PENDING')}
                                <Box
                                    style={{
                                        ...badgeStyle,
                                        backgroundColor:
                                            currentTab === 1 ? 'var(--bg-warning-color)' : 'var(--bg-warning-color1)',
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
                                {t('COMMON.ERROR_REPORT.IN_PROGRESS')}
                                <Box
                                    style={{
                                        ...badgeStyle,
                                        backgroundColor:
                                            currentTab === 2 ? 'var(--bg-closed-color)' : 'var(--bg-closed-color1)',
                                        color:
                                            currentTab === 2 ? 'var(--text-closed-color)' : 'var(--text-closed-color1)'
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
                                {t('COMMON.ERROR_REPORT.RESOLVED')}
                                <Box
                                    style={{
                                        ...badgeStyle,
                                        backgroundColor:
                                            currentTab === 3 ? 'var(--bg-success-color)' : 'var(--bg-success-color1)',
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
                                {t('COMMON.ERROR_REPORT.REJECTED')}
                                <Box
                                    style={{
                                        ...badgeStyle,
                                        backgroundColor:
                                            currentTab === 4 ? 'var(--bg-danger-color)' : 'var(--bg-danger-color1)',
                                        color:
                                            currentTab === 4 ? 'var(--text-danger-color)' : 'var(--text-danger-color1)'
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
                <Box sx={{ position: 'relative', width: '45%', height: '55px' }}>
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
                            {t('COMMON.ERROR_REPORT.TYPE')}
                        </InputLabel>
                        <Select
                            labelId='select-label'
                            // open={openSelectType}
                            // onClose={handleCloseSelectType}
                            // onOpen={handleOpenSelectType}
                            // value={typeNotification}
                            // onChange={handleChange}
                            label={t('COMMON.CREATE_NOTIFICATION.TYPE')}
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

            <TableErrorReport errorsData={filteredData} totalRecords={totalRecords} type={currentTab} />

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
    )
}

export default ContractExpPage
