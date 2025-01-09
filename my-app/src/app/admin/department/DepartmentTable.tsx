'use client'
import AlertDialog from '@/components/AlertDialog'
import { IDepartmentGetAll } from '@/models/Department'
import {
    useChangeStatusManyDepartmentMutation,
    useChangeStatusMutation,
    useGetAllDepartmentQuery
} from '@/services/DepartmentService'
import {
    Box,
    Typography,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    SelectChangeEvent,
    TextField,
    InputAdornment,
    Button,
    Checkbox,
    TableSortLabel,
    Tooltip,
    Select,
    MenuItem,
    Pagination,
    IconButton
} from '@mui/material'
import { CirclePlus, EyeIcon, Pencil, Trash2 } from 'lucide-react'
import SearchIcon from '@mui/icons-material/Search'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
//import DetailModal from '../configuration/DetailModal'
import { IFilterSysConfiguration } from '@/models/SysConfiguration'
import { formatDate } from '@/utils/formatDate'

function DepartmentTable() {
    //const { data: department, isLoading: isBenefitTypesLoading, refetch } = useGetAllDepartmentQuery()
    //const departmentDataRecord = (department?.Data?.Records as IDepartmentGetAll[]) || []
    //const departmentDataTotalRecord = (department?.Data?.TotalRecords as IDepartmentGetAll[]) || []

    const { t } = useTranslation('common')
    const router = useRouter()
    const [selected, setSelected] = useState<number[]>([])
    const [page, setPage] = useState(1)
    const [rowsPerPage, setRowsPerPage] = useState('10')
    const [from, setFrom] = useState(1)
    const [to, setTo] = useState(10)
    const [keyword, setKeyword] = useState('')
    //const [isSubmit, setIsSubmit] = useState(false)
    const [openDialog, setOpenDialog] = useState(false)
    const [selectedRow, setSelectedRow] = useState<number | null>(null)
    const [order, setOrder] = useState<'asc' | 'desc'>('asc')
    const [orderBy, setOrderBy] = useState<string>('')
    //const [name, setName] = useState('')
    //const [benefitContribution, setBenefitContribution] = useState<number>(0)
    //const [benefitTypeId, setBenefitTypeId] = useState<number>(0)
    //const [nameOfBenefitType, setNameOfBenefitType] = useState('')
    const [isChangeMany, setIsChangeMany] = useState(false)
    const [filter, setFilter] = useState<IFilterSysConfiguration>({
        pageSize: 10,
        pageNumber: 1,
        isDescending: false
    })

    const { data: responseData, isFetching, refetch } = useGetAllDepartmentQuery(filter)
    const [deleteBenefit, { isSuccess: isSuccessDelete }] = useChangeStatusMutation()
    //const [createBenefit, { isSuccess, isLoading, isError }] = useCreateBenefitMutation()
    //const [updateBenefit] = useUpdateBenefitMutation()
    const [isSuccess] = useState(false)
    const [changeManyBenefit] = useChangeStatusManyDepartmentMutation()

    const departmentdata = responseData?.Data.Records as IDepartmentGetAll[]
    const totalRecords = responseData?.Data.TotalRecords as number

    const isSelected = (id: number) => selected.includes(id)

    const handleCheckboxClick = (id: number) => {
        setSelected(prev => (prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]))
    }

    useEffect(() => {
        if (isSuccess) {
            refetch()
        }
    }, [isSuccess])

    const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.checked) {
            setSelected(departmentdata.map(row => row.Id))
        } else {
            setSelected([])
        }
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
        const newRowsPerPage = event.target.value as string
        setRowsPerPage(newRowsPerPage)
        setPage(1)
        setFilter(prev => ({
            ...prev,
            pageSize: Number(newRowsPerPage),
            pageNumber: 1
        }))
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
            const from = (page - 1) * Number(rowsPerPage) + 1
            setFrom(from)

            const to = Math.min(page * Number(rowsPerPage), totalRecords)
            setTo(to)
        }
    }, [isFetching, responseData, page, rowsPerPage])

    useEffect(() => {
        refetch()
    }, [page, rowsPerPage, keyword])

    const handleDeleteClick = async (id: number) => {
        setOpenDialog(true)
        setSelectedRow(id)
    }

    const handleChangeManyClick = async () => {
        setIsChangeMany(true)
        setOpenDialog(true)
    }

    const handleChangeStatusManyBenefit = async () => {
        if (selected.length > 0) {
            await changeManyBenefit(selected)
            setIsChangeMany(false)
            setSelected([])
            setOpenDialog(false)
        }
    }

    const handleConfirmChangeMany = async () => {
        await handleChangeStatusManyBenefit()
        refetch()
    }

    const handleDeleteBenefit = async () => {
        if (selectedRow) {
            await deleteBenefit(selectedRow)
            if (isSelected(selectedRow)) {
                setSelected(prev => prev.filter(item => item !== selectedRow))
            }
            setOpenDialog(false)
            setSelectedRow(null)
        }
    }

    useEffect(() => {
        if (isSuccessDelete) {
            refetch()
        }
    }, [isSuccessDelete])

    //const [isOpen, setIsOpen] = useState(false)

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

    const countRows = selected.length

    return (
        <Box>
            <Paper
                sx={{
                    width: '100%',
                    overflow: 'hidden',
                    borderRadius: '6px',
                    backgroundColor: 'var(--background-color)'
                }}
            >
                <Box display='flex' alignItems='center' justifyContent='space-between' margin='20px'>
                    <Box sx={{ position: 'relative', width: '100%' }}>
                        <TextField
                            fullWidth
                            id='location-search'
                            type='search'
                            placeholder={t('COMMON.SYS_CONFIGURATION.PLACEHOLDER_SEARCH')}
                            variant='outlined'
                            value={keyword}
                            onChange={e => setKeyword(e.target.value)}
                            sx={{
                                color: 'var(--text-color)',
                                padding: '0px',
                                width: '335px',
                                '& fieldset': {
                                    borderRadius: '8px',
                                    borderColor: 'var(--border-color)'
                                },
                                '& .MuiInputBase-root': { paddingRight: '0px' },
                                '& .MuiInputBase-input': {
                                    padding: '11px 0 11px 14px',
                                    color: 'var(--text-color)',
                                    fontSize: '16px'
                                },
                                '& .MuiOutlinedInput-root:hover fieldset': {
                                    borderColor: 'var(--hover-color)'
                                },
                                '& .MuiOutlinedInput-root.Mui-focused fieldset': {
                                    borderColor: 'var(--selected-color)'
                                }
                            }}
                            onKeyDown={e => {
                                if (e.key === 'Enter') {
                                    e.preventDefault()
                                    handleSearchKeyword()
                                }
                            }}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position='end'>
                                        <IconButton
                                            onClick={handleSearchKeyword}
                                            sx={{
                                                backgroundColor: 'var(--button-color)',
                                                borderRadius: '0 8px 8px 0',
                                                padding: '10.5px',
                                                '&:hover': {
                                                    backgroundColor: 'var(--hover-button-color)'
                                                }
                                            }}
                                        >
                                            <SearchIcon sx={{ color: 'white' }} />
                                        </IconButton>
                                    </InputAdornment>
                                )
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
                        <Button
                            variant='contained'
                            startIcon={<Trash2 />}
                            sx={{
                                height: '44px',
                                visibility: countRows > 0 ? 'visible' : 'hidden',
                                backgroundColor: 'var(--button-color)',
                                width: 'auto',
                                padding: '0px 24px',
                                '&:hover': {
                                    backgroundColor: 'var(--hover-button-color)'
                                },
                                fontSize: '16px',
                                fontWeight: 'bold',
                                whiteSpace: 'nowrap',
                                textTransform: 'none'
                            }}
                            onClick={() => handleChangeManyClick()}
                            //onClick={() => handleDeleteBenefit()}
                        >
                            {t('COMMON.BUTTON.DELETE')}
                        </Button>

                        <Button
                            variant='contained'
                            startIcon={<CirclePlus />}
                            sx={{
                                height: '44px',
                                backgroundColor: 'var(--button-color)',
                                width: 'auto',
                                padding: '0px 24px',
                                '&:hover': {
                                    backgroundColor: 'var(--hover-button-color)'
                                },
                                fontSize: '16px',
                                fontWeight: 'bold',
                                whiteSpace: 'nowrap',
                                textTransform: 'none'
                            }}
                            onClick={() => router.push('/admin/department/create')}
                            //onClick={() => handleOpenCreateDialog()}
                        >
                            {t('COMMON.BUTTON.CREATE')}
                        </Button>
                    </Box>
                </Box>

                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow sx={{ backgroundColor: 'var(--header-color-table)' }}>
                                <TableCell
                                    padding='checkbox'
                                    sx={{ borderColor: 'var(--border-color)', paddingLeft: '8.5px' }}
                                >
                                    <Checkbox
                                        indeterminate={selected.length > 0 && selected.length < departmentdata.length}
                                        checked={
                                            departmentdata && selected.length > 0
                                                ? selected.length === departmentdata.length
                                                : false
                                        }
                                        onChange={handleSelectAllClick}
                                        sx={{
                                            color: 'var(--text-color)'
                                        }}
                                    />
                                </TableCell>
                                <TableCell
                                    sx={{ borderColor: 'var(--border-color)', minWidth: '49px', maxWidth: '60px' }}
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
                                                textOverflow: 'ellipsis',
                                                whiteSpace: 'nowrap'
                                            }}
                                        >
                                            ID
                                        </Typography>
                                    </TableSortLabel>
                                </TableCell>
                                <TableCell>
                                    <TableSortLabel
                                        active={orderBy === 'Name'}
                                        direction={orderBy === 'Name' ? order : 'asc'}
                                        onClick={() => handleSort('Name')}
                                        sx={{
                                            '& .MuiTableSortLabel-icon': {
                                                color: 'var(--text-color) !important'
                                            },
                                            width: '200px'
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
                                            {t('Tên phòng ban')} {/* Cập nhật khóa dịch này */}
                                        </Typography>
                                    </TableSortLabel>
                                </TableCell>
                                <TableCell
                                    sx={{ borderColor: 'var(--border-color)', minWidth: '49px', maxWidth: '60px' }}
                                >
                                    <TableSortLabel
                                        active={orderBy === 'DepartmentHeadName'}
                                        direction={orderBy === 'DepartmentHeadName' ? order : 'asc'}
                                        onClick={() => handleSort('DepartmentHeadName')}
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
                                            {t('Tên trưởng phòng')}
                                        </Typography>
                                    </TableSortLabel>
                                </TableCell>

                                <TableCell sx={{ borderColor: 'var(--border-color)' }}>
                                    <TableSortLabel
                                        active={'CreatedDate' === orderBy}
                                        direction={orderBy === 'CreatedDate' ? order : 'asc'}
                                        onClick={() => handleSort('CreatedDate')}
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
                                            {t('COMMON.SYS_CONFIGURATION.CREATED_DATE')}
                                        </Typography>
                                    </TableSortLabel>
                                </TableCell>
                                <TableCell>
                                    <TableSortLabel
                                        active={orderBy === 'CreatedBy'}
                                        direction={orderBy === 'CreatedBy' ? order : 'asc'}
                                        onClick={() => handleSort('CreatedBy')}
                                        sx={{
                                            '& .MuiTableSortLabel-icon': {
                                                color: 'var(--text-color) !important'
                                            },
                                            width: '150px'
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
                                            {t('Người tạo')}
                                        </Typography>
                                    </TableSortLabel>
                                </TableCell>
                                <TableCell>
                                    <Typography
                                        sx={{
                                            fontWeight: 'bold',
                                            color: 'var(--text-color)',
                                            fontSize: '16px',
                                            overflow: 'hidden',
                                            textAlign: 'center',
                                            textOverflow: 'ellipsis',
                                            whiteSpace: 'nowrap',
                                            width: '150px'
                                        }}
                                    >
                                        {t('Hành động')}
                                    </Typography>
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {departmentdata?.map(row => (
                                <TableRow key={row.Id} selected={isSelected(row.Id)}>
                                    <TableCell padding='checkbox'>
                                        <Checkbox
                                            sx={{
                                                ml: '5px',
                                                color: 'var(--text-color)',
                                                fontSize: '16px',
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis',
                                                whiteSpace: 'nowrap'
                                            }}
                                            checked={isSelected(row.Id)}
                                            onChange={() => handleCheckboxClick(row.Id)}
                                        />
                                    </TableCell>
                                    <TableCell
                                        sx={{
                                            fontWeight: 'bold',
                                            color: 'var(--text-color)',
                                            fontSize: '16px',
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                            whiteSpace: 'nowrap'
                                        }}
                                    >
                                        {row.Id}
                                    </TableCell>
                                    <TableCell
                                        sx={{
                                            width: '200px',
                                            color: 'var(--text-color)',
                                            fontSize: '16px',
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                            whiteSpace: 'nowrap'
                                        }}
                                    >
                                        {row.Name}
                                    </TableCell>
                                    <TableCell
                                        sx={{
                                            color: 'var(--text-color)',
                                            fontSize: '16px',
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                            whiteSpace: 'nowrap'
                                        }}
                                    >
                                        {row.DepartmentHeadName}
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
                                            {formatDate(row.CreatedDate)}
                                        </Typography>
                                    </TableCell>
                                    <TableCell
                                        sx={{
                                            width: '100px',
                                            color: 'var(--text-color)',
                                            fontSize: '16px',
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                            whiteSpace: 'nowrap'
                                        }}
                                    >
                                        {row.CreatedBy}
                                    </TableCell>
                                    <TableCell>
                                        <Box
                                            display='flex'
                                            alignItems='center'
                                            justifyContent='space-between'
                                            gap='10px'
                                            width={'150px'}
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
                                                >
                                                    <EyeIcon />
                                                </Box>
                                            </Tooltip>
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
                                                    //onClick={() => handleUpdate(row)}
                                                >
                                                    <Pencil />
                                                </Box>
                                            </Tooltip>
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
                                                    onClick={() => handleDeleteClick(row.Id)}
                                                >
                                                    <Trash2 />
                                                </Box>
                                            </Tooltip>
                                        </Box>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>

                <Box display='flex' alignItems='center' justifyContent='space-between' padding='15px'>
                    <Box display='flex' alignItems='center'>
                        <Typography
                            sx={{
                                mr: '10px',
                                color: 'var(--text-color)',
                                fontSize: '16px',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap'
                            }}
                        >
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
                            defaultValue='5'
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
                            {[1, 2, 3, 4, 5, 10, 20, 30, 40].map(value => (
                                <MenuItem key={value} value={value}>
                                    {value}
                                </MenuItem>
                            ))}
                        </Select>
                        <Typography
                            sx={{
                                ml: '30px',
                                color: 'var(--text-color)',
                                fontSize: '16px',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap'
                            }}
                        >
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

            <AlertDialog
                title={t('COMMON.ALERT_DIALOG.CONFIRM_DELETE.TITLE')}
                content={t('COMMON.ALERT_DIALOG.CONFIRM_DELETE.CONTENT')}
                type='warning'
                open={openDialog}
                setOpen={setOpenDialog}
                buttonCancel={t('COMMON.ALERT_DIALOG.CONFIRM_DELETE.CANCEL')}
                buttonConfirm={t('COMMON.ALERT_DIALOG.CONFIRM_DELETE.DELETE')}
                onConfirm={() => (isChangeMany ? handleConfirmChangeMany() : handleDeleteBenefit())}
            />
        </Box>
    )
}

export default DepartmentTable
