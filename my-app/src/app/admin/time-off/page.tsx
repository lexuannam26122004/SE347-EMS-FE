'use client'

import React, { useState, useEffect, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import {
    Tab,
    Tabs,
    Box,
    Select,
    Pagination,
    Typography,
    MenuItem,
    SelectChangeEvent,
    Paper,
    Checkbox,
    TableRow,
    TableBody,
    Table,
    TableCell,
    TableHead,
    TableContainer,
    Button,
    TextField,
    InputAdornment,
    Tooltip,
    TableSortLabel,
    Avatar
} from '@mui/material'

import { ITimeOffSearch } from '@/models/TimeOff'
import { useSearchTimeOffQuery, useChangeStatusTimeOffsMutation } from '@/services/TimeOffService'
import Loading from '@/components/Loading'
import { CirclePlus, EyeIcon, Pencil, Trash2 } from 'lucide-react'
import SearchIcon from '@mui/icons-material/Search'
import { useTranslation } from 'react-i18next'
import AlertDialog from '@/components/AlertDialog'
import DetailTimeOff from './DetailTimeOff'
import { authSelector } from '@/redux/slices/authSlice'
import { useSelector } from 'react-redux'

function a11yProps(index: number) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`
    }
}

function getStatusBgColor(status: boolean): string {
    if (status === false) {
        return 'var(--bg-danger-color)'
    } else if (status === true) {
        return 'var(--bg-success-color)'
    } else {
        return 'var(--bg-closed-color)'
    }
}

function getStatusTextColor(status: boolean): string {
    if (status === false) {
        return 'var(--text-danger-color)'
    } else if (status === true) {
        return 'var(--text-success-color)'
    } else {
        return 'var(--text-closed-color)'
    }
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

const EmployeeTable: React.FC = () => {
    const router = useRouter()
    const [selectedRow, setSelectedRow] = useState<number | null>(null)
    const [currentTab, setCurrentTab] = useState(0)
    const [page, setPage] = useState(1)
    const [keyword, setKeyword] = useState('')
    const [from, setFrom] = useState(1)
    const [to, setTo] = useState(10)
    const [order, setOrder] = useState<'asc' | 'desc'>('asc')
    const [orderBy, setOrderBy] = useState<string>('')

    const [openDialog, setOpenDialog] = useState(false)
    const [isChangeMany, setIsChangeMany] = useState(false)
    const [selected, setSelected] = useState<number[]>([])
    const [rowsPerPage, setRowsPerPage] = useState('10')
    const { t } = useTranslation('common')

    const [openModal, setOpenModal] = useState(false)
    const [selectedTimeOff, setSelectedTimeOff] = useState<ITimeOffSearch | null>(null)

    const handleClickDetail = (config: ITimeOffSearch) => {
        setSelectedTimeOff(config)
        setOpenModal(true)
    }

    const [filter, setFilter] = useState<IFilter>({
        pageSize: 10,
        pageNumber: 1
    })

    const handleSort = (property: string) => {
        setFilter(prev => ({
            ...prev,
            sortBy: property,
            isDescending: orderBy === property && order === 'asc' ? true : false
        }))
        if (orderBy === property) {
            setOrder(order === 'asc' ? 'desc' : 'asc')
        } else {
            setOrder('asc')
        }
        setOrderBy(property)
    }

    const [changeTimeOff] = useChangeStatusTimeOffsMutation()

    const { data: timeoffResponse, isLoading: istimeoffsLoading, isFetching, refetch } = useSearchTimeOffQuery(filter)

    const timeoff = timeoffResponse?.Data?.Records as ITimeOffSearch[]

    useEffect(() => {
        if (!isFetching && timeoffResponse?.Data) {
            const from = (page - 1) * Number(rowsPerPage) + Math.min(1, timeoff.length)
            setFrom(from)

            const to = Math.min(timeoff.length + (page - 1) * Number(rowsPerPage), totalRecords)
            setTo(to)
        }
    }, [isFetching, timeoffResponse, page, rowsPerPage])

    useEffect(() => {
        refetch()
    }, [])

    const filteredData = useMemo(() => {
        switch (currentTab) {
            case 0: // All
                return timeoff
            case 1: // In Progress
                return timeoff.filter(item => item.IsAccepted === null)
            case 2: // Resolved
                return timeoff.filter(item => item.IsAccepted === true)
            case 3: // Resolved
                return timeoff.filter(item => item.IsAccepted === false)
            default:
                return timeoff
        }
    }, [timeoff, currentTab])

    const counts = useMemo(
        () => ({
            0: timeoff?.length ?? 0,
            1: timeoff?.filter(item => item.IsAccepted === null).length ?? 0,
            2: timeoff?.filter(item => item.IsAccepted === true).length ?? 0,
            3: timeoff?.filter(item => item.IsAccepted === false).length ?? 0
        }),
        [timeoff]
    )

    const menuLeft = useSelector(authSelector)
    if (istimeoffsLoading || menuLeft === null || Object.keys(menuLeft).length === 0) return <Loading />

    const isSelected = (id: number) => selected.includes(id)

    const handleCheckboxClick = (id: number) => {
        setSelected(prev => (prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]))
    }

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

    const totalRecords = (timeoffResponse?.Data.TotalRecords as number) || 0

    const handleDeleteManyClick = async () => {
        setIsChangeMany(true)
        setOpenDialog(true)
    }

    const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.checked) {
            setSelected(timeoff.map(row => row.Id))
        } else {
            setSelected([])
        }
    }

    const countRows = selected.length

    const handleDeleteClick = async (id: number) => {
        setOpenDialog(true)
        setSelectedRow(id)
    }

    const handleDeleteTimeOff = async () => {
        if (selectedRow) {
            await changeTimeOff(selectedRow)
            if (isSelected(selectedRow)) {
                setSelected(prev => prev.filter(item => item !== selectedRow))
            }
            setOpenDialog(false)
            setSelectedRow(null)
            refetch()
        }
    }

    const handleDeleteManyTimeOff = async () => {
        if (selected.length > 0) {
            for (const id of selected) {
                await changeTimeOff(id)
            }
            setIsChangeMany(false)
            setSelected([])
            setOpenDialog(false)
            refetch()
        }
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
        <Box>
            <Paper
                sx={{
                    width: '100%',
                    overflow: 'hidden',
                    borderRadius: '15px',
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

                <Box display='flex' alignItems='center' justifyContent='space-between' margin='24px'>
                    <Box sx={{ position: 'relative', width: '100%', height: '55px' }}>
                        <TextField
                            fullWidth
                            variant='outlined'
                            placeholder={t('COMMON.SYS_CONFIGURATION.PLACEHOLDER_SEARCH')}
                            required
                            value={keyword}
                            onChange={e => setKeyword(e.target.value)}
                            sx={{
                                color: 'var(--text-color)',
                                padding: '0px',
                                width: '335px',
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
                                        opacity: 1 // Đảm bảo opacity của placeholder không bị giảm
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
                                                    padding: '10.5px'
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

                    <Box display='flex' alignItems='center' justifyContent='center' gap='20px'>
                        <Typography
                            sx={{
                                color: 'red',
                                whiteSpace: 'nowrap',
                                visibility: countRows > 0 ? 'visible' : 'hidden'
                            }}
                        >
                            {t('COMMON.COUNT_ROWS_SELECTED', { countRows })}
                        </Typography>

                        {menuLeft['/admin/time-off'].IsAllowDelete && (
                            <Button
                                variant='contained'
                                startIcon={<Trash2 />}
                                sx={{
                                    mr: '5px',
                                    height: '53px',
                                    visibility: countRows > 0 ? 'visible' : 'hidden',
                                    backgroundColor: 'var(--button-color)',
                                    width: 'auto',
                                    padding: '0px 30px',
                                    '&:hover': {
                                        backgroundColor: 'var(--hover-button-color)'
                                    },
                                    fontSize: '16px',
                                    fontWeight: 'bold',
                                    whiteSpace: 'nowrap',
                                    textTransform: 'none'
                                }}
                                onClick={() => handleDeleteManyClick()}
                            >
                                {t('COMMON.BUTTON.DELETE')}
                            </Button>
                        )}

                        {menuLeft['/admin/time-off'].IsAllowCreate && (
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
                                    textTransform: 'none'
                                }}
                                onClick={() => router.push('/admin/time-off/create')}
                            >
                                {t('COMMON.BUTTON.CREATE')}
                            </Button>
                        )}
                    </Box>
                </Box>

                <TableContainer
                    sx={{
                        textAlign: 'center',
                        '&::-webkit-scrollbar': {
                            width: '7px',
                            height: '7px',
                            backgroundColor: 'var(--background-color)'
                        },
                        '&::-webkit-scrollbar-thumb': {
                            backgroundColor: 'var(--scrollbar-color)',
                            borderRadius: '10px'
                        }
                    }}
                >
                    <Table>
                        <TableHead>
                            <TableRow sx={{ backgroundColor: 'var(--header-color-table)' }}>
                                <TableCell
                                    padding='checkbox'
                                    sx={{
                                        borderColor: 'var(--border-color)',
                                        paddingLeft: '12px',
                                        backgroundColor: 'var(--header-color-table)'
                                    }}
                                >
                                    <Checkbox
                                        indeterminate={selected.length > 0 && selected.length < timeoff.length}
                                        checked={
                                            timeoff && selected.length > 0 ? selected.length === timeoff.length : false
                                        }
                                        onChange={handleSelectAllClick}
                                        sx={{
                                            color: 'var(--text-color)',
                                            width: '48px'
                                        }}
                                    />
                                </TableCell>
                                <TableCell
                                    sx={{
                                        borderColor: 'var(--border-color)',
                                        backgroundColor: 'var(--header-color-table)'
                                    }}
                                >
                                    <TableSortLabel
                                        active={'Id' === orderBy}
                                        direction={orderBy === 'Id' ? order : 'asc'}
                                        onClick={() => handleSort('Id')}
                                        sx={{
                                            '& .MuiTableSortLabel-icon': {
                                                color: 'var(--text-color) !important'
                                            }
                                        }}
                                    >
                                        <Typography
                                            sx={{
                                                fontWeight: 'bold',
                                                color: 'var(--text-color)',
                                                fontSize: '16px',
                                                overflow: 'hidden',
                                                maxWidth: '260px',
                                                textOverflow: 'ellipsis',
                                                whiteSpace: 'nowrap'
                                            }}
                                        >
                                            ID
                                        </Typography>
                                    </TableSortLabel>
                                </TableCell>

                                {['FullName'].map((column, index) => (
                                    <TableCell
                                        key={index}
                                        sx={{
                                            borderColor: 'var(--border-color)',
                                            backgroundColor: 'var(--header-color-table)'
                                        }}
                                    >
                                        <TableSortLabel
                                            active={column === orderBy}
                                            direction={orderBy === column ? order : 'asc'}
                                            onClick={() => handleSort(column)}
                                            sx={{
                                                '& .MuiTableSortLabel-icon': {
                                                    color: 'var(--text-color) !important'
                                                }
                                            }}
                                        >
                                            <Typography
                                                sx={{
                                                    fontWeight: 'bold',
                                                    color: 'var(--text-color)',
                                                    fontSize: '16px',
                                                    overflow: 'hidden',
                                                    maxWidth: '260px',
                                                    textOverflow: 'ellipsis',
                                                    whiteSpace: 'nowrap'
                                                }}
                                            >
                                                {t(`COMMON.TIMEOFF.FULLNAME`)}
                                            </Typography>
                                        </TableSortLabel>
                                    </TableCell>
                                ))}

                                {['EmployeeId', 'IsAccepted', 'Reason', 'StartDate', 'EndDate', 'Content'].map(
                                    (column, index) => (
                                        <TableCell key={index} sx={{ borderColor: 'var(--border-color)' }}>
                                            <TableSortLabel
                                                active={column === orderBy}
                                                direction={orderBy === column ? order : 'asc'}
                                                onClick={() => handleSort(column)}
                                                sx={{
                                                    '& .MuiTableSortLabel-icon': {
                                                        color: 'var(--text-color) !important'
                                                    }
                                                }}
                                            >
                                                <Typography
                                                    sx={{
                                                        fontWeight: 'bold',
                                                        color: 'var(--text-color)',
                                                        fontSize: '16px',
                                                        overflow: 'hidden',
                                                        maxWidth: '260px',
                                                        textOverflow: 'ellipsis',
                                                        whiteSpace: 'nowrap'
                                                    }}
                                                >
                                                    {t(`COMMON.TIMEOFF.${column.toUpperCase()}`)}
                                                </Typography>
                                            </TableSortLabel>
                                        </TableCell>
                                    )
                                )}

                                <TableCell
                                    sx={{
                                        borderColor: 'var(--border-color)',
                                        padding: '0px 9.5px 0px 0px',

                                        backgroundColor: 'var(--header-color-table)'
                                    }}
                                >
                                    <Typography
                                        sx={{
                                            fontWeight: 'bold',
                                            color: 'var(--text-color)',
                                            fontSize: '16px',
                                            overflow: 'hidden',
                                            textAlign: 'center',
                                            textOverflow: 'ellipsis',
                                            whiteSpace: 'nowrap'
                                        }}
                                    >
                                        {t('COMMON.SYS_CONFIGURATION.ACTION')}
                                    </Typography>
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filteredData.map(user => (
                                <TableRow key={user.Id} selected={isSelected(user.Id)}>
                                    <TableCell
                                        padding='checkbox'
                                        sx={{
                                            borderColor: 'var(--border-color)',
                                            paddingLeft: '12px'
                                        }}
                                    >
                                        <Checkbox
                                            checked={isSelected(user.Id)}
                                            onChange={() => handleCheckboxClick(user.Id)}
                                            sx={{
                                                color: 'var(--text-color)',
                                                width: '48px'
                                            }}
                                        />
                                    </TableCell>

                                    <TableCell
                                        sx={{
                                            borderColor: 'var(--border-color)'
                                        }}
                                    >
                                        <Typography
                                            sx={{
                                                color: 'var(--text-color)',
                                                fontSize: '16px',
                                                maxWidth: '260px',
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis',
                                                whiteSpace: 'nowrap'
                                            }}
                                        >
                                            {user.Id}
                                        </Typography>
                                    </TableCell>

                                    <TableCell
                                        sx={{
                                            borderColor: 'var(--border-color)'
                                        }}
                                    >
                                        <Typography
                                            sx={{
                                                color: 'var(--text-color)',
                                                fontSize: '16px',
                                                maxWidth: '260px',
                                                overflow: 'hidden',
                                                whiteSpace: 'nowrap',
                                                display: 'flex',
                                                alignItems: 'center',
                                                textOverflow: 'ellipsis'
                                            }}
                                            component='div'
                                        >
                                            <Avatar
                                                src={
                                                    user.AvatarPath ||
                                                    'https://localhost:44381/avatars/aa1678f0-75b0-48d2-ae98-50871178e9bd.jfif'
                                                }
                                                alt='Avatar'
                                                sx={{ marginRight: '20px' }}
                                            />
                                            {user.FullName || 'N/A'}
                                        </Typography>
                                    </TableCell>

                                    <TableCell sx={{ borderColor: 'var(--border-color)' }}>
                                        <Typography
                                            sx={{
                                                color: 'var(--text-color)',
                                                fontSize: '16px',
                                                maxWidth: '260px',
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis',
                                                whiteSpace: 'nowrap'
                                            }}
                                        >
                                            {user.EmployeeId}
                                        </Typography>
                                    </TableCell>

                                    <TableCell sx={{ borderColor: 'var(--border-color)', padding: '11px' }}>
                                        <Box
                                            sx={{
                                                borderRadius: '8px',
                                                padding: '5px',
                                                display: 'flex',
                                                minWidth: '100px',
                                                justifyContent: 'center',
                                                backgroundColor: getStatusBgColor(user.IsAccepted)
                                            }}
                                        >
                                            <Typography
                                                sx={{
                                                    fontSize: '15px',
                                                    overflow: 'hidden',
                                                    color: getStatusTextColor(user.IsAccepted),
                                                    width: 'auto',
                                                    fontWeight: 'bold',
                                                    display: 'inline-block',
                                                    textOverflow: 'ellipsis',
                                                    whiteSpace: 'nowrap'
                                                }}
                                            >
                                                {user.IsAccepted === null
                                                    ? t('COMMON.TIMEOFF.PENDING')
                                                    : user.IsAccepted
                                                    ? t('COMMON.TIMEOFF.AGREE')
                                                    : t('COMMON.TIMEOFF.REFUSE')}
                                            </Typography>
                                        </Box>
                                    </TableCell>

                                    <TableCell sx={{ borderColor: 'var(--border-color)' }}>
                                        <Typography
                                            sx={{
                                                color: 'var(--text-color)',
                                                fontSize: '16px',
                                                maxWidth: '260px',
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis',
                                                whiteSpace: 'nowrap'
                                            }}
                                        >
                                            {user.Reason || 'N/A'}
                                        </Typography>
                                    </TableCell>
                                    <TableCell sx={{ borderColor: 'var(--border-color)' }}>
                                        <Typography
                                            sx={{
                                                color: 'var(--text-color)',
                                                fontSize: '16px',
                                                maxWidth: '260px',
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis',
                                                whiteSpace: 'nowrap'
                                            }}
                                        >
                                            {user.StartDate && !isNaN(new Date(user.StartDate).getTime())
                                                ? new Date(user.StartDate).toLocaleDateString()
                                                : 'N/A'}
                                        </Typography>
                                    </TableCell>

                                    <TableCell sx={{ borderColor: 'var(--border-color)' }}>
                                        <Typography
                                            sx={{
                                                color: 'var(--text-color)',
                                                fontSize: '16px',
                                                maxWidth: '260px',
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis',
                                                whiteSpace: 'nowrap'
                                            }}
                                        >
                                            {user.EndDate && !isNaN(new Date(user.EndDate).getTime())
                                                ? new Date(user.EndDate).toLocaleDateString()
                                                : 'N/A'}
                                        </Typography>
                                    </TableCell>

                                    <TableCell sx={{ borderColor: 'var(--border-color)' }}>
                                        <Typography
                                            sx={{
                                                color: 'var(--text-color)',
                                                fontSize: '16px',
                                                maxWidth: '260px',
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis',
                                                whiteSpace: 'nowrap'
                                            }}
                                        >
                                            {user.Content || 'N/A'}
                                        </Typography>
                                    </TableCell>

                                    <TableCell
                                        sx={{
                                            padding: '0px 9.5px 0px 0px',
                                            borderColor: 'var(--border-color)'
                                        }}
                                    >
                                        <Box
                                            display='flex'
                                            alignItems='center'
                                            justifyContent='space-between'
                                            gap='10px'
                                        >
                                            <Tooltip title={t('COMMON.BUTTON.VIEW_DETAIL')}>
                                                <Box
                                                    display='flex'
                                                    alignItems='center'
                                                    justifyContent='center'
                                                    sx={{
                                                        cursor: 'pointer',
                                                        color: '#00d100',
                                                        borderRadius: '50%',
                                                        width: '42px',
                                                        height: '42px',
                                                        '&:hover': {
                                                            backgroundColor: 'var(--hover-color)'
                                                        }
                                                    }}
                                                    onClick={() => handleClickDetail(user)}
                                                >
                                                    <EyeIcon />
                                                </Box>
                                            </Tooltip>

                                            {menuLeft['/admin/time-off'].IsAllowEdit && (
                                                <Tooltip title={t('COMMON.BUTTON.EDIT')}>
                                                    <Box
                                                        display='flex'
                                                        alignItems='center'
                                                        justifyContent='center'
                                                        sx={{
                                                            cursor: 'pointer',
                                                            color: '#00d4ff',
                                                            borderRadius: '50%',
                                                            width: '42px',
                                                            height: '42px',
                                                            '&:hover': {
                                                                backgroundColor: 'var(--hover-color)'
                                                            }
                                                        }}
                                                        onClick={() =>
                                                            router.push(`/admin/time-off/update?id=${user.Id}`)
                                                        }
                                                    >
                                                        <Pencil />
                                                    </Box>
                                                </Tooltip>
                                            )}

                                            {menuLeft['/admin/time-off'].IsAllowDelete && (
                                                <Tooltip title={t('COMMON.BUTTON.DELETE')}>
                                                    <Box
                                                        display='flex'
                                                        alignItems='center'
                                                        justifyContent='center'
                                                        sx={{
                                                            cursor: 'pointer',
                                                            color: 'red',
                                                            borderRadius: '50%',
                                                            width: '42px',
                                                            height: '42px',
                                                            '&:hover': {
                                                                backgroundColor: 'var(--hover-color)'
                                                            }
                                                        }}
                                                        onClick={() => handleDeleteClick(user.Id)}
                                                    >
                                                        <Trash2 />
                                                    </Box>
                                                </Tooltip>
                                            )}

                                        </Box>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>

                <Box display='flex' alignItems='center' justifyContent='space-between' padding='15px'>
                    <Box display='flex' alignItems='center'>
                        <Typography sx={{ mr: '10px', color: 'var(--text-color)' }}>
                            {' '}
                            {t('COMMON.PAGINATION.ROWS_PER_PAGE')}
                        </Typography>
                        <Select
                            id='select'
                            sx={{
                                width: '71px',
                                padding: '5px',
                                color: 'var(--text-color)',
                                '& .MuiSelect-icon': {
                                    color: 'var(--text-color)'
                                },
                                '& .MuiOutlinedInput-notchedOutline': {
                                    borderColor: 'var(--border-color)'
                                },
                                '&:hover .MuiOutlinedInput-notchedOutline': {
                                    borderColor: 'var(--hover-color)'
                                },
                                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                    borderColor: 'var(--selected-color)'
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
                                        '& .MuiList-root': {
                                            backgroundColor: 'var(--background-color)',
                                            padding: '5px',
                                            '& .MuiMenuItem-root': {
                                                color: 'var(--text-color)',
                                                borderRadius: '4px',
                                                '&:hover': {
                                                    backgroundColor: 'var(--hover-color)'
                                                },
                                                '&.Mui-selected': {
                                                    backgroundColor: 'var(--selected-color)'
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
                                    backgroundColor: 'var(--selected-color)',
                                    color: 'var(--text-color)'
                                },
                                '&:hover': {
                                    backgroundColor: 'var(--hover-color)',
                                    borderColor: 'var(--hover-color)'
                                }
                            }
                        }}
                        color='primary'
                    />
                </Box>
            </Paper>

            {selectedTimeOff && (
                <DetailTimeOff
                    handleToggle={() => setOpenModal(false)}
                    open={openModal}
                    configuration={selectedTimeOff}
                />
            )}

            <AlertDialog
                title={t('COMMON.ALERT_DIALOG.CONFIRM_DELETE.TITLE')}
                content={t('COMMON.ALERT_DIALOG.CONFIRM_DELETE.CONTENT')}
                type='warning'
                open={openDialog}
                setOpen={setOpenDialog}
                buttonCancel={t('COMMON.ALERT_DIALOG.CONFIRM_DELETE.CANCEL')}
                buttonConfirm={t('COMMON.ALERT_DIALOG.CONFIRM_DELETE.DELETE')}
                onConfirm={() => (isChangeMany ? handleDeleteManyTimeOff() : handleDeleteTimeOff())}
            />
        </Box>
    )
}

export default EmployeeTable
