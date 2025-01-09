'use client'
import AlertDialog from '@/components/AlertDialog'
import Loading from '@/components/Loading'
import { ISalaryGetAll } from '@/models/salary'
import { IFilterSysConfiguration } from '@/models/SysConfiguration'
import {
    useChangeStatusManyMutation,
    useChangeStatusMutation,
    useGetAllSalariesQuery,
    useGetPayrollOverviewQuery,
    useGetPeriodQuery,
    useUpdateSalaryByIdMutation
} from '@/services/SalaryService'
import { formatDate } from '@/utils/formatDate'
import {
    Box,
    Select,
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
    IconButton,
    Tooltip,
    TableSortLabel,
    Divider,
    LinearProgress,
    LinearProgressProps,
    FormControl,
    Pagination
} from '@mui/material'
import {
    BadgeCheck,
    BadgeDollarSign,
    BadgeMinus,
    Bitcoin,
    ChevronLeft,
    EyeIcon,
    Heart,
    LocateFixed,
    Pencil,
    SearchIcon,
    Smile,
    Trash2,
    Users
} from 'lucide-react'
import { useCallback, useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useRouter } from 'next/navigation'
import { debounce } from 'lodash'
import EmployeeSalaryModal from '@/app/admin/salary/detail/ModalDetail'

function LinearProgressWithLabel(props: LinearProgressProps & { value: number }) {
    return (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Box sx={{ width: '100%', mr: 1 }}>
                <LinearProgress variant='determinate' {...props} />
            </Box>
            <Box sx={{ minWidth: 35 }}>
                <Typography variant='body2' sx={{ color: 'var(--text-color)' }}>{`${props.value}%`}</Typography>
            </Box>
        </Box>
    )
}

interface PayrollOverview {
    grossTotal: number
    netTotal: number
    totalPersonnel: number
    totalBenefit: number
    totalPITax: number
    totalInsurance: number
    avgGross: number
    avgNet: number
    avgInsurance: number
    avgTax: number
    salaryPercent: {
        [key: string]: number // Các phòng ban và tỷ lệ phần trăm lương
    }
    salaryByDepartment: {
        [key: string]: number
    }
}

function GetAllSalaryPage() {
    const { t } = useTranslation('common')
    const [selected, setSelected] = useState<string[]>([])
    const [page, setPage] = useState(1)
    const [rowsPerPage, setRowsPerPage] = useState('10')
    const [from, setFrom] = useState(1)
    const [to, setTo] = useState(10)
    const [keyword, setKeyword] = useState('')
    const [isChangeMany, setIsChangeMany] = useState(false)
    const [openDialog, setOpenDialog] = useState(false)
    const router = useRouter()

    const [selectedRow, setSelectedRow] = useState<string | null>(null)
    const [order, setOrder] = useState<'asc' | 'desc'>('asc')
    const [orderBy, setOrderBy] = useState<string>('')
    const [filter, setFilter] = useState<IFilterSysConfiguration>({
        pageSize: 10,
        pageNumber: 1
    })

    const { data: periodData, isFetching: periodFetching } = useGetPeriodQuery()
    const periodList = periodData?.Data || []
    const [period, setPeriod] = useState<string>('')

    const {
        data: responseData,
        isFetching,
        isLoading,
        refetch
    } = useGetAllSalariesQuery({
        filter,
        period: period || ''
    })

    useEffect(() => {
        if (periodList.length > 0) {
            setPeriod(periodList[periodList.length - 1])
            refetch()
        }
    }, [periodList])

    const salaryData = responseData?.Data.Records as ISalaryGetAll[]
    useEffect(() => {
        refetch()
    }, [salaryData])
    const totalRecords = responseData?.Data.TotalRecords as number

    const { data: cycleResponseData, isFetching: cycleFetching } = useGetPayrollOverviewQuery({ period: period || '' })

    const cycleData = cycleResponseData?.Data as PayrollOverview

    useEffect(() => {
        if (period && periodList.length > 0) {
            refetch() // Trigger query if period is valid
        }
    }, [period, cycleFetching, periodList, refetch])

    useEffect(() => {
        refetch()
    }, [filter])

    console.log(period)

    const [deleteSalary] = useChangeStatusMutation()
    const [deleteManySalaries] = useChangeStatusManyMutation()
    const [updateSalary] = useUpdateSalaryByIdMutation()

    const isSelected = (id: string) => selected.includes(id)

    const [openModal, setOpenModal] = useState(false)
    const [selectedSalary, setSelectedSalary] = useState<string | null>(null)
    const handleClickDetail = (Id: string) => {
        setSelectedSalary(Id)
        setOpenModal(true)
    }

    const handleCheckboxClick = (id: string) => {
        setSelected(prev => (prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]))
    }

    const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.checked) {
            setSelected(salaryData.map(row => row.Id))
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

    const debouncedSetFilter = useCallback(
        debounce(value => {
            setFilter(prev => ({
                ...prev,
                keyword: value,
                pageNumber: 1
            }))
        }, 100),
        []
    )

    const handleUpdate = (id: string) => {
        updateSalary({ Id: id }).unwrap()
    }

    const handleSearchKeyword = value => {
        setPage(1)
        setKeyword(value)
        debouncedSetFilter(value)
    }

    useEffect(() => {
        if (!isFetching && responseData?.Data) {
            const from = (page - 1) * Number(rowsPerPage) + Math.min(1, salaryData.length)
            setFrom(from)

            const to = Math.min(salaryData.length + (page - 1) * Number(rowsPerPage), totalRecords)
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

    const handleDeleteClick = async (id: string) => {
        setOpenDialog(true)
        setSelectedRow(id)
    }

    const handleDeleteManyClick = async () => {
        setIsChangeMany(true)
        setOpenDialog(true)
    }

    const handleDeleteManySalary = async () => {
        if (selected.length > 0) {
            await deleteManySalaries(selected)
            setIsChangeMany(false)
            setSelected([])
            setOpenDialog(false)
        }
    }

    const handleDeleteSalary = async () => {
        if (selectedRow) {
            await deleteSalary(selectedRow)
            if (isSelected(selectedRow)) {
                setSelected(prev => prev.filter(item => item !== selectedRow))
            }
            setOpenDialog(false)
            setSelectedRow(null)
        }
    }

    const handlePeriodChange = (event: SelectChangeEvent<string>) => {
        setPeriod(event.target.value as string)
    }

    const countRows = selected.length

    const departmentList = Object.keys(cycleData?.salaryPercent || {})
    const formatValue = (value: number) => {
        return value.toLocaleString('vi-VN') + ' ' + t('COMMON.SALARY.VND')
    }

    const paperRef = useRef(null)
    const [paperHeight, setPaperHeight] = useState(500)

    useEffect(() => {
        if (paperRef.current && isLoading === false) {
            setPaperHeight(paperRef.current.offsetHeight)
        }
    }, [isLoading, salaryData])

    if (isLoading || periodFetching) {
        return <Loading />
    }

    return (
        <Box
            sx={{
                display: 'flex',
                width: '100%',
                height: '100%',
                overflow: 'hidden',
                gap: '10px'
            }}
        >
            <Box
                sx={{
                    width: 'calc(100% / 5 + 30px)',
                    height: { paperHeight },
                    backgroundColor: 'var(--background-color)',
                    overflowY: 'auto',
                    scrollbarGutter: 'stable',

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
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        marginTop: '10px'
                    }}
                >
                    <IconButton
                        sx={{
                            marginRight: '16px',
                            '& .MuiOutlinedInput-root:hover fieldset': {
                                borderColor: 'var(--hover-field-color)'
                            },
                            '& .MuiOutlinedInput-root.Mui-focused fieldset': {
                                borderColor: 'var(--selected-field-color)'
                            }
                        }}
                        onClick={() => router.back()}
                    >
                        <ChevronLeft size={24} color='var(--text-color)' />
                    </IconButton>
                    <BadgeDollarSign size={'24px'} color='var(--button-color)'></BadgeDollarSign>
                    <Typography
                        style={{ marginLeft: '10px', fontWeight: 'bold', fontSize: '20px', color: 'var(--text-color)' }}
                    >
                        {t('COMMON.SALARY.PAYROLL')} {period}
                    </Typography>
                </Box>
                <Typography fontSize={'16px'} sx={{ marginLeft: '60px' }}>
                    Hoàn thành 01/11 - 30/11/24
                </Typography>
                <Divider
                    orientation='horizontal'
                    flexItem
                    sx={{
                        marginRight: '20px',
                        marginLeft: '20px',
                        marginTop: '15px',
                        marginBottom: '15px',
                        backgroundColor: 'var(--divider-color)'
                    }}
                />
                <Box
                    sx={{
                        marginLeft: '20px',
                        marginRight: '20px'
                    }}
                >
                    <Typography
                        sx={{
                            fontSize: '20px',
                            color: 'var(--title-color)',

                            marginTop: '5px',
                            fontWeight: 'bold'
                        }}
                    >
                        {t('COMMON.SALARY.OVERVIEW_OF_THE_CYCLE')}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', marginTop: '15px' }}>
                        <Box
                            sx={{
                                borderRadius: '45px',
                                backgroundColor: 'green',
                                width: '50px', // Thiết lập chiều rộng
                                height: '50px', // Thiết lập chiều cao
                                display: 'flex', // Nếu bạn muốn căn giữa nội dung bên trong
                                alignItems: 'center', // Căn giữa theo chiều dọc
                                justifyContent: 'center'
                            }}
                        >
                            <LocateFixed size={'30px'}></LocateFixed>
                        </Box>
                        <Box sx={{ marginLeft: '10px' }}>
                            <Typography sx={{ fontWeight: 'bold' }}>{t('COMMON.SALARY.TOTAL_GROSS')}</Typography>
                            <Typography>{formatValue(cycleData?.grossTotal || 0)}</Typography>
                        </Box>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', marginTop: '15px' }}>
                        <Box
                            sx={{
                                borderRadius: '45px',
                                backgroundColor: '#00FF00',
                                width: '50px', // Thiết lập chiều rộng
                                height: '50px', // Thiết lập chiều cao
                                display: 'flex', // Nếu bạn muốn căn giữa nội dung bên trong
                                alignItems: 'center', // Căn giữa theo chiều dọc
                                justifyContent: 'center'
                            }}
                        >
                            <BadgeCheck size={'30px'}></BadgeCheck>
                        </Box>
                        <Box sx={{ marginLeft: '10px' }}>
                            <Typography sx={{ fontWeight: 'bold' }}>{t('COMMON.SALARY.TOTAL_NET')}</Typography>
                            <Typography>{formatValue(cycleData?.netTotal || 0)}</Typography>
                        </Box>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', marginTop: '15px' }}>
                        <Box
                            sx={{
                                borderRadius: '45px',
                                backgroundColor: '#FFCC66',
                                width: '50px', // Thiết lập chiều rộng
                                height: '50px', // Thiết lập chiều cao
                                display: 'flex', // Nếu bạn muốn căn giữa nội dung bên trong
                                alignItems: 'center', // Căn giữa theo chiều dọc
                                justifyContent: 'center'
                            }}
                        >
                            <Users size={'30px'}></Users>
                        </Box>
                        <Box sx={{ marginLeft: '10px' }}>
                            <Typography sx={{ fontWeight: 'bold' }}>{t('COMMON.SALARY.TOTAL_PERSONNEL')}</Typography>
                            <Typography>
                                {cycleData?.totalPersonnel.toLocaleString('vi-VN') || 0} {t('COMMON.SALARY.PERSONNEL')}
                            </Typography>
                        </Box>
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center', marginTop: '15px' }}>
                        <Box
                            sx={{
                                borderRadius: '45px',
                                backgroundColor: '#00FFFF',
                                width: '50px', // Thiết lập chiều rộng
                                height: '50px', // Thiết lập chiều cao
                                display: 'flex', // Nếu bạn muốn căn giữa nội dung bên trong
                                alignItems: 'center', // Căn giữa theo chiều dọc
                                justifyContent: 'center'
                            }}
                        >
                            <Smile size={'30px'}></Smile>
                        </Box>
                        <Box sx={{ marginLeft: '10px' }}>
                            <Typography sx={{ fontWeight: 'bold' }}>{t('COMMON.SALARY.BENEFIT')}</Typography>
                            <Typography>{formatValue(cycleData?.totalBenefit || 0)}</Typography>
                        </Box>
                    </Box>
                </Box>
                <Divider
                    orientation='horizontal'
                    flexItem
                    sx={{
                        marginRight: '20px',
                        marginLeft: '20px',
                        marginTop: '15px',
                        marginBottom: '15px',
                        backgroundColor: 'var(--divider-color)'
                    }}
                />
                <Box
                    sx={{
                        marginLeft: '20px',
                        marginRight: '20px'
                    }}
                >
                    <Typography
                        sx={{
                            fontSize: '20px',
                            color: 'var(--title-color)',

                            marginTop: '5px',
                            fontWeight: 'bold'
                        }}
                    >
                        {t('COMMON.SALARY.OVERVIEW_OF_TAXES_AND_INSURANCE')}
                    </Typography>

                    <Box sx={{ display: 'flex', alignItems: 'center', marginTop: '15px' }}>
                        <Box
                            sx={{
                                borderRadius: '50%',
                                backgroundColor: '#FF9933',
                                width: '50px', // Thiết lập chiều rộng
                                height: '50px', // Thiết lập chiều cao
                                display: 'flex', // Nếu bạn muốn căn giữa nội dung bên trong
                                alignItems: 'center', // Căn giữa theo chiều dọc
                                justifyContent: 'center'
                            }}
                        >
                            <BadgeMinus size={'30px'}></BadgeMinus>
                        </Box>
                        <Box sx={{ marginLeft: '10px' }}>
                            <Typography sx={{ fontWeight: 'bold' }}>{t('COMMON.SALARY.TOTAL_PITAX')}</Typography>
                            <Typography>{formatValue(cycleData?.totalPITax || 0)}</Typography>
                        </Box>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', marginTop: '15px' }}>
                        <Box
                            sx={{
                                borderRadius: '45px',
                                backgroundColor: '#FF0033',
                                width: '50px', // Thiết lập chiều rộng
                                height: '50px', // Thiết lập chiều cao
                                display: 'flex', // Nếu bạn muốn căn giữa nội dung bên trong
                                alignItems: 'center', // Căn giữa theo chiều dọc
                                justifyContent: 'center'
                            }}
                        >
                            <Heart size={'30px'}></Heart>
                        </Box>
                        <Box sx={{ marginLeft: '10px' }}>
                            <Typography sx={{ fontWeight: 'bold' }}>{t('COMMON.SALARY.TOTAL_INSURANCE')}</Typography>
                            <Typography>{formatValue(cycleData?.totalInsurance || 0)}</Typography>
                        </Box>
                    </Box>
                </Box>
                <Divider
                    orientation='horizontal'
                    flexItem
                    sx={{
                        marginRight: '20px',
                        marginLeft: '20px',
                        marginTop: '15px',
                        marginBottom: '15px',
                        backgroundColor: 'var(--divider-color)'
                    }}
                />
                <Box
                    sx={{
                        marginLeft: '20px',
                        marginRight: '20px'
                    }}
                >
                    <Typography
                        sx={{
                            fontSize: '20px',
                            color: 'var(--title-color)',

                            marginTop: '5px',
                            fontWeight: 'bold'
                        }}
                    >
                        {t('COMMON.SALARY.OVERVIEW_OF_INCOME')}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', marginTop: '15px', gap: '10px' }}>
                        <Box
                            sx={{
                                borderRadius: '45px',
                                backgroundColor: '#00CCCC',
                                width: '50px', // Thiết lập chiều rộng
                                height: '50px', // Thiết lập chiều cao
                                display: 'flex', // Nếu bạn muốn căn giữa nội dung bên trong
                                alignItems: 'center', // Căn giữa theo chiều dọc
                                justifyContent: 'center'
                            }}
                        >
                            <BadgeDollarSign size={'30px'}></BadgeDollarSign>
                        </Box>
                        <Box>
                            <Typography sx={{ fontWeight: 'bold' }}>{t('COMMON.SALARY.AVG_GROSS')}</Typography>
                            <Typography>{formatValue(cycleData?.avgGross || 0)}</Typography>
                        </Box>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', marginTop: '15px' }}>
                        <Box
                            sx={{
                                borderRadius: '45px',
                                backgroundColor: '#CC99FF',
                                width: '50px', // Thiết lập chiều rộng
                                height: '50px', // Thiết lập chiều cao
                                display: 'flex', // Nếu bạn muốn căn giữa nội dung bên trong
                                alignItems: 'center', // Căn giữa theo chiều dọc
                                justifyContent: 'center'
                            }}
                        >
                            <Bitcoin size={'30px'}></Bitcoin>
                        </Box>
                        <Box sx={{ marginLeft: '10px' }}>
                            <Typography sx={{ fontWeight: 'bold' }}>{t('COMMON.SALARY.AVG_NET')}</Typography>
                            <Typography>{formatValue(cycleData?.avgNet || 0)}</Typography>
                        </Box>
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center', marginTop: '15px', gap: '10px' }}>
                        <Box
                            sx={{
                                borderRadius: '45px',
                                backgroundColor: '#FF0066',
                                width: '50px', // Thiết lập chiều rộng
                                height: '50px', // Thiết lập chiều cao
                                display: 'flex', // Nếu bạn muốn căn giữa nội dung bên trong
                                alignItems: 'center', // Căn giữa theo chiều dọc
                                justifyContent: 'center'
                            }}
                        >
                            <Heart size={'30px'}></Heart>
                        </Box>
                        <Box>
                            <Typography sx={{ fontWeight: 'bold' }}>{t('COMMON.SALARY.AVG_INSURANCE')}</Typography>
                            <Typography>{formatValue(cycleData?.avgInsurance || 0)}</Typography>
                        </Box>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', marginTop: '15px' }}>
                        <Box
                            sx={{
                                borderRadius: '45px',
                                backgroundColor: '#FF33CC',
                                width: '50px', // Thiết lập chiều rộng
                                height: '50px', // Thiết lập chiều cao
                                display: 'flex', // Nếu bạn muốn căn giữa nội dung bên trong
                                alignItems: 'center', // Căn giữa theo chiều dọc
                                justifyContent: 'center'
                            }}
                        >
                            <BadgeMinus size={'30px'}></BadgeMinus>
                        </Box>
                        <Box sx={{ marginLeft: '10px' }}>
                            <Typography sx={{ fontWeight: 'bold' }}>{t('COMMON.SALARY.AVG_PITAX')}</Typography>
                            <Typography>{formatValue(cycleData?.avgTax || 0)}</Typography>
                        </Box>
                    </Box>
                </Box>
                <Divider
                    orientation='horizontal'
                    flexItem
                    sx={{
                        marginRight: '20px',
                        marginLeft: '20px',
                        marginTop: '15px',
                        marginBottom: '15px',
                        backgroundColor: 'var(--divider-color)'
                    }}
                />
                <Box
                    sx={{
                        marginLeft: '20px',
                        marginRight: '20px',
                        marginBottom: '10px'
                    }}
                >
                    <Typography
                        sx={{
                            fontSize: '20px',
                            color: 'var(--title-color)',

                            marginTop: '5px',
                            fontWeight: 'bold'
                        }}
                    >
                        {t('COMMON.SALARY.DEPARTMENTAL_REPORT')}
                    </Typography>
                    {departmentList.map((department, index) => {
                        const salaryPercent = cycleData.salaryPercent?.[department] || 0
                        const salaryByDepartment = cycleData.salaryByDepartment?.[department] || 0

                        return (
                            <Box key={index} sx={{ marginTop: '10px' }}>
                                <Typography sx={{ fontWeight: 'bold' }}>{department}</Typography>
                                <Typography>{salaryByDepartment} VND</Typography>
                                <Box sx={{ width: '100%' }}>
                                    <LinearProgressWithLabel value={salaryPercent} />
                                </Box>
                            </Box>
                        )
                    })}
                </Box>
            </Box>
            <Box
                sx={{
                    width: 'calc(100% / 5 * 4 - 30px)',
                    height: '100%'
                }}
            >
                <Paper
                    ref={paperRef}
                    sx={{
                        width: '100%',
                        height: '100%',
                        overflow: 'hidden',
                        borderRadius: '6px',
                        backgroundColor: 'var(--background-color)'
                    }}
                >
                    <Box display='flex' alignItems='center' justifyContent='space-between' margin='20px'>
                        <Box sx={{ position: 'relative', width: '100%', height: '55px' }}>
                            <TextField
                                id='location-search'
                                type='search'
                                placeholder={t('COMMON.SYS_CONFIGURATION.PLACEHOLDER_SEARCH')}
                                variant='outlined'
                                required
                                value={keyword}
                                onChange={e => handleSearchKeyword(e.target.value)}
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

                            <FormControl fullWidth>
                                <Select
                                    value={period}
                                    onChange={handlePeriodChange}
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
                                                width: '120px',
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
                                    {periodList.map((dept: string) => (
                                        <MenuItem key={dept} value={dept}>
                                            {dept}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
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
                                        sx={{ borderColor: 'var(--border-color)', paddingLeft: '8.5px' }}
                                    >
                                        <Checkbox
                                            indeterminate={selected.length > 0 && selected.length < salaryData.length}
                                            checked={
                                                salaryData && selected.length > 0
                                                    ? selected.length === salaryData.length
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
                                                {t('COMMON.SALARY.NAME')}
                                            </Typography>
                                        </TableSortLabel>
                                    </TableCell>
                                    <TableCell sx={{ borderColor: 'var(--border-color)' }}>
                                        <TableSortLabel
                                            active={'UserId' === orderBy}
                                            direction={orderBy === 'UserId' ? order : 'asc'}
                                            onClick={() => handleSort('UserId')}
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
                                                {t('COMMON.SALARY.EMPLOYEE_ID')}
                                            </Typography>
                                        </TableSortLabel>
                                    </TableCell>
                                    <TableCell sx={{ borderColor: 'var(--border-color)' }}>
                                        <TableSortLabel
                                            active={'Date' === orderBy}
                                            direction={orderBy === 'Date' ? order : 'asc'}
                                            onClick={() => handleSort('Date')}
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
                                                {t('COMMON.SALARY.DATE')}
                                            </Typography>
                                        </TableSortLabel>
                                    </TableCell>
                                    <TableCell sx={{ borderColor: 'var(--border-color)' }}>
                                        <TableSortLabel
                                            active={'BasicSalary' === orderBy}
                                            direction={orderBy === 'BasicSalary' ? order : 'asc'}
                                            onClick={() => handleSort('BasicSalary')}
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
                                                {t('COMMON.SALARY.BASIC_SALARY')}
                                            </Typography>
                                        </TableSortLabel>
                                    </TableCell>
                                    <TableCell sx={{ borderColor: 'var(--border-color)' }}>
                                        <TableSortLabel
                                            active={'Timekeeping' === orderBy}
                                            direction={orderBy === 'Timekeeping' ? order : 'asc'}
                                            onClick={() => handleSort('Timekeeping')}
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
                                                {t('COMMON.SALARY.TIME_KEEPING')}
                                            </Typography>
                                        </TableSortLabel>
                                    </TableCell>
                                    <TableCell sx={{ borderColor: 'var(--border-color)' }}>
                                        <TableSortLabel
                                            active={'Insurance' === orderBy}
                                            direction={orderBy === 'Insurance' ? order : 'asc'}
                                            onClick={() => handleSort('Insurance')}
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
                                                    maxWidth: '280px',
                                                    textOverflow: 'ellipsis',
                                                    whiteSpace: 'nowrap'
                                                }}
                                            >
                                                {t('COMMON.SALARY.INSURANCE')}
                                            </Typography>
                                        </TableSortLabel>
                                    </TableCell>
                                    <TableCell sx={{ borderColor: 'var(--border-color)' }}>
                                        <TableSortLabel
                                            active={'Benefit' === orderBy}
                                            direction={orderBy === 'Benefit' ? order : 'asc'}
                                            onClick={() => handleSort('Benefit')}
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
                                                    maxWidth: '280px',
                                                    textOverflow: 'ellipsis',
                                                    whiteSpace: 'nowrap'
                                                }}
                                            >
                                                {t('COMMON.SALARY.BENEFIT')}
                                            </Typography>
                                        </TableSortLabel>
                                    </TableCell>
                                    <TableCell sx={{ borderColor: 'var(--border-color)' }}>
                                        <TableSortLabel
                                            active={'Reward' === orderBy}
                                            direction={orderBy === 'Reward' ? order : 'asc'}
                                            onClick={() => handleSort('Reward')}
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
                                                    maxWidth: '280px',
                                                    textOverflow: 'ellipsis',
                                                    whiteSpace: 'nowrap'
                                                }}
                                            >
                                                {t('COMMON.SALARY.REWARD')}
                                            </Typography>
                                        </TableSortLabel>
                                    </TableCell>
                                    <TableCell sx={{ borderColor: 'var(--border-color)' }}>
                                        <TableSortLabel
                                            active={'Discipline' === orderBy}
                                            direction={orderBy === 'Discipline' ? order : 'asc'}
                                            onClick={() => handleSort('Discipline')}
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
                                                    maxWidth: '280px',
                                                    textOverflow: 'ellipsis',
                                                    whiteSpace: 'nowrap'
                                                }}
                                            >
                                                {t('COMMON.SALARY.DISCIPLINE')}
                                            </Typography>
                                        </TableSortLabel>
                                    </TableCell>
                                    <TableCell sx={{ borderColor: 'var(--border-color)' }}>
                                        <TableSortLabel
                                            active={'PITax' === orderBy}
                                            direction={orderBy === 'PITax' ? order : 'asc'}
                                            onClick={() => handleSort('PITax')}
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
                                                    maxWidth: '280px',
                                                    textOverflow: 'ellipsis',
                                                    whiteSpace: 'nowrap'
                                                }}
                                            >
                                                {t('COMMON.SALARY.PI_TAX')}
                                            </Typography>
                                        </TableSortLabel>
                                    </TableCell>
                                    <TableCell sx={{ borderColor: 'var(--border-color)' }}>
                                        <TableSortLabel
                                            active={'TotalSalary' === orderBy}
                                            direction={orderBy === 'TotalSalary' ? order : 'asc'}
                                            onClick={() => handleSort('TotalSalary')}
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
                                                    maxWidth: '280px',
                                                    textOverflow: 'ellipsis',
                                                    whiteSpace: 'nowrap'
                                                }}
                                            >
                                                {t('COMMON.SALARY.TOTAL_SALARY')}
                                            </Typography>
                                        </TableSortLabel>
                                    </TableCell>
                                    <TableCell sx={{ borderColor: 'var(--border-color)' }}>
                                        <TableSortLabel
                                            active={'PayrollPeriod' === orderBy}
                                            direction={orderBy === 'PayrollPeriod' ? order : 'asc'}
                                            onClick={() => handleSort('PayrollPeriod')}
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
                                                    maxWidth: '280px',
                                                    textOverflow: 'ellipsis',
                                                    whiteSpace: 'nowrap'
                                                }}
                                            >
                                                {t('COMMON.SALARY.PAYROLL_PERIOD')}
                                            </Typography>
                                        </TableSortLabel>
                                    </TableCell>

                                    <TableCell
                                        sx={{
                                            borderColor: 'var(--border-color)',
                                            padding: '0px 9.5px 0px 0px',
                                            width: '146px'
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
                                {salaryData &&
                                    salaryData.map(row => (
                                        <TableRow key={row.Id} selected={isSelected(row.Id)}>
                                            <TableCell
                                                padding='checkbox'
                                                sx={{ borderColor: 'var(--border-color)', paddingLeft: '8.5px' }}
                                            >
                                                <Checkbox
                                                    checked={isSelected(row.Id)}
                                                    onChange={() => handleCheckboxClick(row.Id)}
                                                    sx={{
                                                        color: 'var(--text-color)'
                                                    }}
                                                />
                                            </TableCell>
                                            <TableCell
                                                sx={{
                                                    minWidth: '49px',
                                                    maxWidth: '100px',
                                                    borderColor: 'var(--border-color)'
                                                }}
                                            >
                                                <Typography
                                                    sx={{
                                                        color: 'var(--text-color)',
                                                        fontSize: '16px',
                                                        overflow: 'hidden',
                                                        textOverflow: 'ellipsis',
                                                        whiteSpace: 'nowrap'
                                                    }}
                                                >
                                                    {row.Id}
                                                </Typography>
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
                                                    {row.FullName}
                                                </Typography>
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
                                                    {row.UserId}
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
                                                    {formatDate(row.Date.toString())}
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
                                                    {row.BasicSalary}
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
                                                    {row.Timekeeping}
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
                                                    {row.Insurance}
                                                </Typography>
                                            </TableCell>
                                            <TableCell sx={{ borderColor: 'var(--border-color)' }}>
                                                <Typography
                                                    sx={{
                                                        color: 'var(--text-color)',
                                                        fontSize: '16px',
                                                        overflow: 'hidden',
                                                        maxWidth: '280px',
                                                        textAlign: 'center',
                                                        textOverflow: 'ellipsis',
                                                        whiteSpace: 'nowrap'
                                                    }}
                                                >
                                                    {row.Benefit}
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
                                                    {row.Reward}
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
                                                    {row.Discipline}
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
                                                    {row.PITax}
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
                                                    {row.TotalSalary}
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
                                                    {row.PayrollPeriod}
                                                </Typography>
                                            </TableCell>

                                            <TableCell
                                                sx={{
                                                    padding: '0px 9.5px 0px 0px',
                                                    borderColor: 'var(--border-color)',
                                                    width: '146px'
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
                                                            onClick={() => handleClickDetail(row.Id)}
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
                                                            onClick={() => handleUpdate(row.Id)}
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
            <AlertDialog
                title={t('COMMON.ALERT_DIALOG.CONFIRM_DELETE.TITLE')}
                content={t('COMMON.ALERT_DIALOG.CONFIRM_DELETE.CONTENT')}
                type='warning'
                open={openDialog}
                setOpen={setOpenDialog}
                buttonCancel={t('COMMON.ALERT_DIALOG.CONFIRM_DELETE.CANCEL')}
                buttonConfirm={t('COMMON.ALERT_DIALOG.CONFIRM_DELETE.DELETE')}
                onConfirm={() => (isChangeMany ? handleDeleteManySalary() : handleDeleteSalary())}
            />
            {selectedSalary && (
                <EmployeeSalaryModal
                    open={openModal}
                    handleToggle={() => setOpenModal(false)}
                    salaryId={selectedSalary}
                />
            )}
        </Box>
    )
}

export default GetAllSalaryPage
