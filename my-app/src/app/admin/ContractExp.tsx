'use client'
import { IFilterEmploymentContract } from '@/models/EmploymentContract'
import { formatDate } from '@/utils/formatDate'
import {
    Box,
    Select,
    Pagination,
    Typography,
    MenuItem,
    SelectChangeEvent,
    Paper,
    TableRow,
    TableBody,
    Table,
    TableCell,
    TableHead,
    TableContainer,
    TextField,
    InputAdornment,
    TableSortLabel,
    Avatar
} from '@mui/material'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import SearchIcon from '@mui/icons-material/Search'
import { useRouter } from 'next/navigation'
import { IContractExp } from '@/models/EmploymentContract'
import { useGetContractsExpiringSoonQuery } from '@/services/EmploymentContractService'

function getContractBgColor(contractEnd: string): string {
    const today = new Date()
    const endDate = new Date(contractEnd)

    const diffInMilliseconds = endDate.getTime() - today.getTime()
    const diffInMonths = diffInMilliseconds / (1000 * 60 * 60 * 24 * 30)

    if (diffInMonths <= 2) {
        return 'var(--bg-danger-color)'
    } else if (diffInMonths <= 4) {
        return 'var(--bg-warning-color)'
    } else {
        return 'var(--bg-success-color)'
    }
}

function getContractTextColor(contractEnd: string): string {
    const today = new Date()
    const endDate = new Date(contractEnd)

    const diffInMilliseconds = endDate.getTime() - today.getTime()
    const diffInMonths = diffInMilliseconds / (1000 * 60 * 60 * 24 * 30)

    if (diffInMonths <= 2) {
        return 'var(--text-danger-color)'
    } else if (diffInMonths <= 4) {
        return 'var(--text-warning-color)'
    } else {
        return 'var(--text-success-color)'
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
        daysUntilExpiration: 180
    })
    const [keyword, setKeyword] = useState('')
    const [openDialog, setOpenDialog] = useState(false)
    const [selectedRow, setSelectedRow] = useState<number | null>(null)
    const [order, setOrder] = useState<'asc' | 'desc'>('asc')
    const [orderBy, setOrderBy] = useState<string>('')
    // const [selectedConfig, setSelectedConfig] = useState<IGetAllSysConfiguration | null>(null)
    const [openModal, setOpenModal] = useState(false)

    useEffect(() => {}, [
        router,
        openDialog,
        selectedRow,
        openModal,
        selected,
        setSelected,
        setOpenDialog,
        setSelectedRow,
        setFilter,
        setOpenModal,
        setOrder,
        setOrderBy
    ])

    const { data: responseData, isFetching, refetch } = useGetContractsExpiringSoonQuery(filter)

    // const handleClickDetail = (config: IGetAllSysConfiguration) => {
    //     setSelectedConfig(config)
    //     setOpenModal(true)
    // }

    const contractData = responseData?.Data.Records

    const contracts = contractData?.map((item: any) => {
        return {
            FullName: item.User.FullName,
            ContractType: item.Contract.TypeContract,
            ContractName: item.Contract.ContractName,
            ContractStart: item.Contract.StartDate,
            ContractEnd: item.Contract.EndDate,
            AvatarPath: item.User.AvatarPath
        }
    })

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

    useEffect(() => {
        if (!isFetching && responseData?.Data) {
            const from = (page - 1) * Number(rowsPerPage) + Math.min(1, contractData.length)
            setFrom(from)

            const to = Math.min(contractData.length + (page - 1) * Number(rowsPerPage), totalRecords)
            setTo(to)
        }
    }, [isFetching, responseData, page, rowsPerPage])

    useEffect(() => {
        refetch()
    }, [filter])

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
                <Typography
                    sx={{
                        userSelect: 'none',
                        color: 'var(--text-color)',
                        fontWeight: 'bold',
                        fontSize: '18px',
                        display: 'flex',
                        alignItems: 'center',
                        padding: '24px 24px 20px'
                    }}
                >
                    {t('COMMON.DASHBOARD.CONTRACT_EXPIRING_SOON')}
                </Typography>
                <Box display='flex' alignItems='center' justifyContent='space-between' margin='0 0 20px 24px'>
                    <Box sx={{ position: 'relative', width: '100%', height: '55px' }}>
                        <TextField
                            id='location-search'
                            type='search'
                            placeholder={t('COMMON.DASHBOARD.SEARCH_CONTRACT')}
                            variant='outlined'
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
                </Box>
                <TableContainer
                    sx={{
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
                    <Table>
                        <TableHead>
                            <TableRow
                                sx={{
                                    backgroundColor: 'var(--header-table-dashboard)',
                                    '&:last-child td, &:last-child th': {
                                        border: 'none'
                                    }
                                }}
                            >
                                <TableCell sx={{ borderColor: 'var(--border-color)' }}>
                                    <TableSortLabel
                                        active={'FullName' === orderBy}
                                        direction={orderBy === 'FullName' ? order : 'asc'}
                                        onClick={() => handleSort('FullName')}
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
                                            {t('COMMON.DASHBOARD.FULLNAME')}
                                        </Typography>
                                    </TableSortLabel>
                                </TableCell>
                                <TableCell sx={{ borderColor: 'var(--border-color)' }}>
                                    <TableSortLabel
                                        active={'ContractType' === orderBy}
                                        direction={orderBy === 'ContractType' ? order : 'asc'}
                                        onClick={() => handleSort('ContractType')}
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
                                                maxWidth: '280px',
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis',
                                                whiteSpace: 'nowrap'
                                            }}
                                        >
                                            {t('COMMON.DASHBOARD.CONTRACT_TYPE')}
                                        </Typography>
                                    </TableSortLabel>
                                </TableCell>
                                <TableCell sx={{ borderColor: 'var(--border-color)' }}>
                                    <TableSortLabel
                                        active={'ContractName' === orderBy}
                                        direction={orderBy === 'ContractName' ? order : 'asc'}
                                        onClick={() => handleSort('ContractName')}
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
                                                maxWidth: '280px',
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis',
                                                whiteSpace: 'nowrap'
                                            }}
                                        >
                                            {t('COMMON.DASHBOARD.CONTRACT_NAME')}
                                        </Typography>
                                    </TableSortLabel>
                                </TableCell>
                                <TableCell sx={{ borderColor: 'var(--border-color)' }}>
                                    <TableSortLabel
                                        active={'ContractStart' === orderBy}
                                        direction={orderBy === 'ContractStart' ? order : 'asc'}
                                        onClick={() => handleSort('ContractStart')}
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
                                                maxWidth: '400px',
                                                fontSize: '16px',
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis',
                                                whiteSpace: 'nowrap'
                                            }}
                                        >
                                            {t('COMMON.DASHBOARD.CONTRACT_START')}
                                        </Typography>
                                    </TableSortLabel>
                                </TableCell>
                                <TableCell sx={{ borderColor: 'var(--border-color)' }}>
                                    <TableSortLabel
                                        active={'ContractEnd' === orderBy}
                                        direction={orderBy === 'ContractEnd' ? order : 'asc'}
                                        onClick={() => handleSort('ContractEnd')}
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
                                                textOverflow: 'ellipsis',
                                                whiteSpace: 'nowrap'
                                            }}
                                        >
                                            {t('COMMON.DASHBOARD.CONTRACT_END')}
                                        </Typography>
                                    </TableSortLabel>
                                </TableCell>
                                <TableCell sx={{ borderColor: 'var(--border-color)' }}>
                                    <Typography
                                        sx={{
                                            fontWeight: 'bold',
                                            color: 'var(--text-color)',
                                            fontSize: '16px',
                                            overflow: 'hidden',
                                            textAlign: 'center',
                                            maxWidth: '280px',
                                            textOverflow: 'ellipsis',
                                            whiteSpace: 'nowrap'
                                        }}
                                    >
                                        {t('COMMON.DASHBOARD.CONTRACT_STATUS')}
                                    </Typography>
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {contracts &&
                                contracts.map((row: IContractExp, index: number) => (
                                    <TableRow
                                        key={index}
                                        sx={{
                                            '&:last-child td, &:last-child th': {
                                                border: 'none'
                                            }
                                        }}
                                    >
                                        <TableCell sx={{ borderColor: 'var(--border-color)', padding: '16px' }}>
                                            <Box
                                                sx={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '14px'
                                                }}
                                            >
                                                <Avatar
                                                    src={
                                                        row.AvatarPath ||
                                                        'https://localhost:44381/avatars/aa1678f0-75b0-48d2-ae98-50871178e9bd.jfif'
                                                    }
                                                />
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
                                                    {row.FullName}
                                                </Typography>
                                            </Box>
                                        </TableCell>
                                        <TableCell sx={{ borderColor: 'var(--border-color)' }}>
                                            <Typography
                                                sx={{
                                                    color: 'var(--text-color)',
                                                    fontSize: '16px',
                                                    maxWidth: '280px',
                                                    overflow: 'hidden',
                                                    textOverflow: 'ellipsis',
                                                    whiteSpace: 'nowrap'
                                                }}
                                            >
                                                {row.ContractType}
                                            </Typography>
                                        </TableCell>
                                        <TableCell sx={{ borderColor: 'var(--border-color)' }}>
                                            <Typography
                                                sx={{
                                                    color: 'var(--text-color)',
                                                    fontSize: '16px',
                                                    overflow: 'hidden',
                                                    maxWidth: '280px',
                                                    textOverflow: 'ellipsis',
                                                    whiteSpace: 'nowrap'
                                                }}
                                            >
                                                {row.ContractName}
                                            </Typography>
                                        </TableCell>
                                        <TableCell sx={{ borderColor: 'var(--border-color)' }}>
                                            <Typography
                                                sx={{
                                                    color: 'var(--text-color)',
                                                    fontSize: '16px',
                                                    overflow: 'hidden',
                                                    maxWidth: '400px',
                                                    textOverflow: 'ellipsis',
                                                    whiteSpace: 'nowrap'
                                                }}
                                            >
                                                {formatDate(row.ContractStart)}
                                            </Typography>
                                        </TableCell>
                                        <TableCell sx={{ borderColor: 'var(--border-color)' }}>
                                            <Typography
                                                sx={{
                                                    color: 'var(--text-color)',
                                                    fontSize: '16px',
                                                    overflow: 'hidden',
                                                    textOverflow: 'ellipsis',
                                                    whiteSpace: 'nowrap'
                                                }}
                                            >
                                                {formatDate(row.ContractEnd)}
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
                                                    backgroundColor: getContractBgColor(row.ContractEnd)
                                                }}
                                            >
                                                <Typography
                                                    sx={{
                                                        fontSize: '15px',
                                                        overflow: 'hidden',
                                                        color: getContractTextColor(row.ContractEnd),
                                                        width: 'auto',
                                                        fontWeight: 'bold',
                                                        display: 'inline-block',
                                                        textOverflow: 'ellipsis',
                                                        whiteSpace: 'nowrap'
                                                    }}
                                                >
                                                    {getContractBgColor(row.ContractEnd) === 'var(--bg-danger-color)'
                                                        ? `<= 2 ${t('COMMON.DASHBOARD.MONTHS')}`
                                                        : getContractBgColor(row.ContractEnd) ===
                                                            'var(--bg-warning-color)'
                                                          ? `<= 4  ${t('COMMON.DASHBOARD.MONTHS')}`
                                                          : `<= 6  ${t('COMMON.DASHBOARD.MONTHS')}`}
                                                </Typography>
                                            </Box>
                                        </TableCell>
                                    </TableRow>
                                ))}
                        </TableBody>
                    </Table>
                </TableContainer>
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

export default ContractExpPage
