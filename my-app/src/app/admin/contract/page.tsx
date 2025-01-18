'use client'

import React, { useState } from 'react'
import Loading from '@/components/Loading'
import { useRouter } from 'next/navigation'
import { authSelector } from '@/redux/slices/authSlice'
import { useSelector } from 'react-redux'
import {
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

import { IAspNetUserGetAll } from '@/models/AspNetUser'
import { useGetAllUsersQuery } from '@/services/AspNetUserService'
import { IEmploymentContractSearch } from '@/models/EmploymentContract'
import {
    useSearchEmploymentContractsQuery,
    useChangeStatusEmploymentContractsMutation
} from '@/services/EmploymentContractService'
import DetailContract from './DetailContract'
import { CirclePlus, EyeIcon, Pencil, Trash2 } from 'lucide-react'
import SearchIcon from '@mui/icons-material/Search'
import { useTranslation } from 'react-i18next'
import AlertDialog from '@/components/AlertDialog'

const EmployeeTable: React.FC = () => {
    const [selectedRow, setSelectedRow] = useState<string | null>(null)
    const [openDialog, setOpenDialog] = useState(false)
    const [isChangeMany, setIsChangeMany] = useState(false)
    const [selected, setSelected] = useState<string[]>([])
    const [searchTerm, setSearchTerm] = useState<string>('')
    const [rowsPerPage, setRowsPerPage] = useState('10')
    const [currentPage, setCurrentPage] = useState<number>(1)
    const [sortConfig, setSortConfig] = useState<{
        key: keyof IEmploymentContractSearch | 'Id'
        direction: 'asc' | 'desc'
    }>({ key: 'Id', direction: 'asc' })
    const { t } = useTranslation('common')
    const router = useRouter()

    const [openModal, setOpenModal] = useState(false)
    const [selectedContract, setSelectedContract] = useState<IEmploymentContractSearch | null>(null)

    const handleClickDetail = (config: IEmploymentContractSearch) => {
        setSelectedContract(config)
        setOpenModal(true)
    }

    const [changeEmploymentContract] = useChangeStatusEmploymentContractsMutation()

    const { data: contractResponse, isLoading: isContractsLoading, refetch } = useSearchEmploymentContractsQuery()
    const { data: userResponse, isLoading: isUsersLoading } = useGetAllUsersQuery()

    const contract = (contractResponse?.Data?.Records as IEmploymentContractSearch[]) || []
    const employee = (userResponse?.Data?.Records as IAspNetUserGetAll[]) || []
    console.log(1)
    const users = contract.map(contract => {
        const matchedEmployee = employee.find(emp => emp.Id === contract.UserId)
        const matchedManager = employee.find(emp => emp.Id === contract.ManagerId)
        return {
            ...contract,
            FullName: matchedEmployee?.FullName || 'N/A',
            AvatarPath:
                matchedEmployee?.AvatarPath ||
                'https://localhost:44381/avatars/aa1678f0-75b0-48d2-ae98-50871178e9bd.jfif',
            EmployeeId: matchedEmployee?.EmployeeId || 'N/A',
            ManagerFullName: matchedManager?.FullName || 'N/A',
            ManagerAvatarPath:
                matchedManager?.AvatarPath ||
                'https://localhost:44381/avatars/aa1678f0-75b0-48d2-ae98-50871178e9bd.jfif',
            Manager: matchedManager?.EmployeeId || 'N/A'
        }
    })

    const menuLeft = useSelector(authSelector)
    if (isContractsLoading || isUsersLoading || menuLeft === null || Object.keys(menuLeft).length === 0)
        return <Loading />

    const filteredUsers = users.filter(
        user =>
            user.Id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.FullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.EmployeeId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.ManagerFullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.Manager?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.ContractName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.BasicSalary?.toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.ProbationPeriod?.toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.WorkingHours?.toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.TypeContract?.toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
            (user.StartDate &&
                new Date(user.StartDate).toLocaleDateString().toLowerCase().includes(searchTerm.toLowerCase())) ||
            (user.EndDate &&
                new Date(user.EndDate).toLocaleDateString().toLowerCase().includes(searchTerm.toLowerCase()))
    )

    const isSelected = (id: string) => selected.includes(id)

    const handleCheckboxClick = (id: string) => {
        setSelected(prev => (prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]))
    }

    const sortedUsers = filteredUsers.sort((a, b) => {
        const aValue = a[sortConfig.key]
        const bValue = b[sortConfig.key]

        if (typeof aValue === 'number' && typeof bValue === 'number') {
            return sortConfig.direction === 'asc' ? aValue - bValue : bValue - aValue
        } else {
            const aString = aValue?.toString().toLowerCase() || ''
            const bString = bValue?.toString().toLowerCase() || ''
            return sortConfig.direction === 'asc' ? aString.localeCompare(bString) : bString.localeCompare(aString)
        }
    })

    const totalRecords = sortedUsers.length
    const paginatedUsers = sortedUsers.slice((currentPage - 1) * Number(rowsPerPage), currentPage * Number(rowsPerPage))

    const handleSort = (key: keyof IEmploymentContractSearch | 'Id') => {
        setSortConfig(prev => ({
            key,
            direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
        }))
    }

    const handleChangePage = (_event: React.ChangeEvent<unknown>, page: number) => setCurrentPage(page)

    const handleChangeRowsPerPage = (event: SelectChangeEvent<string>) => {
        setRowsPerPage(event.target.value)
        setCurrentPage(1)
    }

    const handleDeleteManyClick = async () => {
        setIsChangeMany(true)
        setOpenDialog(true)
    }

    const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.checked) {
            setSelected(users.map(row => row.Id))
        } else {
            setSelected([])
        }
    }

    const from = (currentPage - 1) * Number(rowsPerPage) + 1
    const to = Math.min(currentPage * Number(rowsPerPage), totalRecords)

    const countRows = selected.length

    const handleDeleteClick = async (id: string) => {
        setOpenDialog(true)
        setSelectedRow(id)
    }

    const handleDeleteEmploymentContract = async () => {
        if (selectedRow) {
            await changeEmploymentContract(selectedRow)
            if (isSelected(selectedRow)) {
                setSelected(prev => prev.filter(item => item !== selectedRow))
            }
            setOpenDialog(false)
            setSelectedRow(null)
            refetch()
        }
    }

    const handleDeleteManyEmploymentContract = async () => {
        if (selected.length > 0) {
            for (const id of selected) {
                await changeEmploymentContract(id)
            }
            setIsChangeMany(false)
            setSelected([])
            setOpenDialog(false)
            refetch()
        }
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
                <Box display='flex' alignItems='center' justifyContent='space-between' margin='24px'>
                    <Box sx={{ position: 'relative', width: '100%', height: '55px' }}>
                        <TextField
                            fullWidth
                            variant='outlined'
                            placeholder={t('COMMON.SYS_CONFIGURATION.PLACEHOLDER_SEARCH')}
                            value={searchTerm}
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
                            onChange={e => setSearchTerm(e.target.value)}
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

                        {menuLeft['Contract'].IsAllowDelete && (
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

                        {menuLeft['Contract'].IsAllowCreate && (
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
                                onClick={() => router.push('/admin/contract/create')}
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
                                        indeterminate={selected.length > 0 && selected.length < users.length}
                                        checked={
                                            users && selected.length > 0 ? selected.length === users.length : false
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
                                        active={sortConfig.key === 'Id'}
                                        direction={sortConfig.key === 'Id' ? sortConfig.direction : 'asc'}
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
                                            active={sortConfig.key === column}
                                            direction={sortConfig.key === column ? sortConfig.direction : 'asc'}
                                            onClick={() => handleSort(column as keyof IEmploymentContractSearch)}
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
                                                {t(`COMMON.CONTRACT.${column.toUpperCase()}`)}
                                            </Typography>
                                        </TableSortLabel>
                                    </TableCell>
                                ))}

                                {[
                                    'EmployeeId',
                                    'ContractName',
                                    'Manager',
                                    'ManagerFullName',
                                    'StartDate',
                                    'EndDate',
                                    'BasicSalary',
                                    'Clause',
                                    'ProbationPeriod',
                                    'WorkingHours',
                                    'TerminationClause',
                                    'TypeContract',
                                    'Appendix'
                                ].map((column, index) => (
                                    <TableCell key={index} sx={{ borderColor: 'var(--border-color)' }}>
                                        <TableSortLabel
                                            active={sortConfig.key === column}
                                            direction={sortConfig.key === column ? sortConfig.direction : 'asc'}
                                            onClick={() => handleSort(column as keyof IEmploymentContractSearch)}
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
                                                {t(`COMMON.CONTRACT.${column.toUpperCase()}`)}
                                            </Typography>
                                        </TableSortLabel>
                                    </TableCell>
                                ))}

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
                            {paginatedUsers.map(user => (
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
                                            {user.ContractName || 'N/A'}
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
                                            {user.Manager || 'N/A'}
                                        </Typography>
                                    </TableCell>

                                    <TableCell sx={{ borderColor: 'var(--border-color)' }}>
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
                                                    user.ManagerAvatarPath ||
                                                    'https://localhost:44381/avatars/aa1678f0-75b0-48d2-ae98-50871178e9bd.jfif'
                                                }
                                                alt='Avatar'
                                                sx={{ marginRight: '20px' }}
                                            />
                                            {user.ManagerFullName || 'N/A'}
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
                                            {user.BasicSalary ? user.BasicSalary.toString().toLowerCase() : 'N/A'}
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
                                            {user.Clause || 'N/A'}
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
                                            {user.ProbationPeriod
                                                ? user.ProbationPeriod.toString().toLowerCase()
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
                                            {user.WorkingHours ? user.WorkingHours.toString().toLowerCase() : 'N/A'}
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
                                            {user.TerminationClause || 'N/A'}
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
                                            {user.TypeContract || 'N/A'}
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
                                            {user.Appendix || 'N/A'}
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

                                            {menuLeft['Contract'].IsAllowEdit && (
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
                                                            router.push(`/admin/contract/update?id=${user.Id}`)
                                                        }
                                                    >
                                                        <Pencil />
                                                    </Box>
                                                </Tooltip>
                                            )}

                                            {menuLeft['Contract'].IsAllowDelete && (
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
                        page={currentPage}
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

            {selectedContract && (
                <DetailContract
                    handleToggle={() => setOpenModal(false)}
                    open={openModal}
                    configuration={selectedContract}
                    emp={employee}
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
                onConfirm={() =>
                    isChangeMany ? handleDeleteManyEmploymentContract() : handleDeleteEmploymentContract()
                }
            />
        </Box>
    )
}

export default EmployeeTable
