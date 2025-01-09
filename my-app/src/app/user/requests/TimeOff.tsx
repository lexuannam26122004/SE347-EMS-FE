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
    InputAdornment,
    Button
} from '@mui/material'
import { CirclePlus } from 'lucide-react'
import { useEffect, useState, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import SearchIcon from '@mui/icons-material/Search'
import { useRouter } from 'next/navigation'
import TableTimeOff from './TableTimeOff'
import TimeOffPage from '@/app/user/requests/TimeOffPage'
import { useGetAuthMeQuery } from '@/services/AuthService'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import Loading from '@/components/Loading'
import { useSearchByUserIdQuery } from '@/services/UserTimeOffService'

function a11yProps(index: number) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`
    }
}

interface IGetAllTimeOff {
    Reason: string
    StartDate: string
    EndDate: string
    IsAccepted: boolean
    Content: string
}

interface IFilter {
    isActive?: boolean
    createdDate?: Date
    pageSize?: number
    pageNumber?: number
    sortBy?: string
    isDescending?: boolean
    keyword?: string
}

function ContractExpPage() {
    const { t } = useTranslation('common')
    const router = useRouter()
    const [selected, setSelected] = useState<number[]>([])
    const [page, setPage] = useState(1)
    const [rowsPerPage, setRowsPerPage] = useState('5')
    const [from, setFrom] = useState(1)
    const [to, setTo] = useState(5)
    const [filter, setFilter] = useState<IFilter>({
        pageSize: 5,
        pageNumber: 1
    })
    const [keyword, setKeyword] = useState('')
    const [openDialog, setOpenDialog] = useState(false)
    const [selectedRow, setSelectedRow] = useState<number | null>(null)
    const [order, setOrder] = useState<'asc' | 'desc'>('asc')
    const [orderBy, setOrderBy] = useState<string>('')
    const [openErrorReport, setopenErrorReport] = useState(false)

    const { data: responseGetMeData, isFetching: isFetchingGetMe } = useGetAuthMeQuery()
    const infoMe = responseGetMeData?.Data

    const { data: timeoffResponse, isLoading: istimeoffsLoading, isFetching, refetch } = useSearchByUserIdQuery(filter)

    const errorsData = timeoffResponse?.Data.Records as IGetAllTimeOff[]

    useEffect(() => {
        refetch()
    }, [])

    useEffect(() => {}, [
        router,
        page,
        rowsPerPage,
        from,
        to,
        selected,
        openDialog,
        selectedRow,
        order,
        orderBy,
        openErrorReport,
        setSelected,
        setSelectedRow,
        setOpenDialog,
        setFrom,
        setTo,
        setOrder,
        setOrderBy
    ])

    const totalRecords = (timeoffResponse?.Data.TotalRecords as number) || 0

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

    useEffect(() => {
        if (!isFetching && timeoffResponse?.Data) {
            const from = (page - 1) * Number(rowsPerPage) + Math.min(1, errorsData.length)
            setFrom(from)

            const to = Math.min(errorsData.length + (page - 1) * Number(rowsPerPage), totalRecords)
            setTo(to)
        }
    }, [isFetching, timeoffResponse, page, rowsPerPage])

    const [currentTab, setCurrentTab] = useState(0)

    // Lọc dữ liệu theo status
    const filteredData = useMemo(() => {
        switch (currentTab) {
            case 0: // All
                return errorsData
            case 1: // In Progress
                return errorsData.filter(item => item.IsAccepted === null)
            case 2: // Resolved
                return errorsData.filter(item => item.IsAccepted === true)
            case 3: // Resolved
                return errorsData.filter(item => item.IsAccepted === false)
            default:
                return errorsData
        }
    }, [errorsData, currentTab])

    const counts = useMemo(
        () => ({
            0: errorsData?.length ?? 0,
            1: errorsData?.filter(item => item.IsAccepted === null).length ?? 0,
            2: errorsData?.filter(item => item.IsAccepted === true).length ?? 0,
            3: errorsData?.filter(item => item.IsAccepted === false).length ?? 0
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

    if (isFetchingGetMe || istimeoffsLoading || !infoMe) {
        return <Loading />
    }

    return (
        <Box
            sx={{
                paddingTop: '35px',
                paddingLeft: '35px',
                paddingRight: '35px',
                boxShadow: 'var(--box-shadow-paper)',
                borderRadius: '30px',
                backgroundColor: 'var(--attendance-bg1)',
                overflow: 'hidden',
                height: '100%',
                //border: '1px solid #e0e0e0',
                width: '100%'
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
                     {t('COMMON.TIMEOFF.TIMEOFF')}
                </Typography>
            </Box>

            <Paper
                elevation={0}
                sx={{
                    width: '100%',
                    overflow: 'hidden',
                    borderRadius: '12px',
                    height: '88%',
                    backgroundColor: 'var(--background-item)'
                }}
            >
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
                                    {t('COMMON.TIMEOFF.PENDING')}
                                    <Box
                                        style={{
                                            ...badgeStyle,
                                            backgroundColor:
                                                currentTab === 1 ? 'var(--bg-closed-color)' : 'var(--bg-closed-color1)',
                                            color:
                                                currentTab === 1
                                                    ? 'var(--text-closed-color)'
                                                    : 'var(--text-closed-color1)'
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
                                    {t('COMMON.TIMEOFF.AGREE')}
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
                                    {t('COMMON.TIMEOFF.REFUSE')}
                                    <Box
                                        style={{
                                            ...badgeStyle,
                                            backgroundColor:
                                                currentTab === 3 ? 'var(--bg-danger-color)' : 'var(--bg-danger-color1)',
                                            color:
                                                currentTab === 3
                                                    ? 'var(--text-danger-color)'
                                                    : 'var(--text-danger-color1)'
                                        }}
                                    >
                                        {counts[3]}
                                    </Box>
                                </Box>
                            }
                            {...a11yProps(3)}
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
                    <Box display='flex' alignItems='center' justifyContent='flex-end' gap='20px' width='100%'>
                        <Button
                            variant='contained'
                            startIcon={<CirclePlus />}
                            sx={{
                                height: '53px',
                                backgroundColor: 'var(--button-color)',
                                width: 'auto',
                                padding: '0px 30px',
                                '&:hover': {
                                    backgroundColor: 'var(--hover-button-color)'
                                },
                                fontSize: '16px',
                                fontWeight: 'bold',
                                whiteSpace: 'nowrap',
                                textTransform: 'none',
                                borderRadius: '10px'
                            }}
                            onClick={() => setopenErrorReport(true)}
                        >
                            {t('COMMON.BUTTON.CREATE')}
                        </Button>
                    </Box>
                </Box>

                <TableTimeOff errorsData={filteredData} totalRecords={totalRecords} type={currentTab} />

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

            <TimeOffPage
                handleToggle={() => {
                    setopenErrorReport(false)
                    refetch()
                }}
                open={openErrorReport}
                reportedBy={infoMe.Id}
            />
        </Box>
    )
}

export default ContractExpPage
