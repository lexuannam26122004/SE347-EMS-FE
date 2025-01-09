'use client'
import { IHolidayGetAll } from '@/models/Holiday'
import {
    useGetAllHolidayQuery,
    useDeleteHolidayMutation,
    useUpdateHolidayMutation,
    useCreateHolidayMutation,
    useDeleteManyHolidayMutation
} from '@/services/HolidayService'
import { formatDate } from '@/utils/formatDate'
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
    FormControlLabel,
    Switch,
    SwitchProps,
    styled,
    Dialog,
    DialogContent,
    DialogTitle,
    DialogActions
} from '@mui/material'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import SearchIcon from '@mui/icons-material/Search'
import { CirclePlus, EyeIcon, Pencil, Trash2 } from 'lucide-react'
import AlertDialog from '@/components/AlertDialog'
import { userSentNotificationId } from '@/utils/globalVariables'

import { useCreateNotificationMutation } from '@/services/NotificationsService'
import { useToast } from '@/hooks/useToast'
import { IFilterEvent } from '@/models/Event'
import { format, toZonedTime } from 'date-fns-tz'
import dayjs from 'dayjs'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { renderTimeViewClock } from '@mui/x-date-pickers/timeViewRenderers'
import { useSelector } from 'react-redux'
import { authSelector } from '@/redux/slices/authSlice'

const IOSSwitch = styled((props: SwitchProps) => (
    <Switch focusVisibleClassName='.Mui-focusVisible' disableRipple {...props} />
))(({ theme }) => ({
    width: 40,
    height: 24,
    padding: 0,
    '& .MuiSwitch-switchBase': {
        padding: 0,
        margin: 2,
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
    // Đảm bảo date là hợp lệ
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

function HolidayPage() {
    const { t } = useTranslation('common')
    const [selected, setSelected] = useState<number[]>([])
    const [page, setPage] = useState(1)
    const toast = useToast()
    const [rowsPerPage, setRowsPerPage] = useState('10')
    const [from, setFrom] = useState(1)
    const [to, setTo] = useState(10)
    const [keyword, setKeyword] = useState('')
    const [isSubmit, setIsSubmit] = useState(false)
    const [isChangeMany, setIsChangeMany] = useState(false)
    const [openDialog, setOpenDialog] = useState(false)
    const [selectedRow, setSelectedRow] = useState<number | null>(null)
    const [order, setOrder] = useState<'asc' | 'desc'>('asc')
    const [orderBy, setOrderBy] = useState<string>('')
    const [name, setName] = useState('')
    const [startDate, setStartDate] = useState<Date | null>(null)
    const [endDate, setEndDate] = useState<Date | null>(null)
    const [note, setNote] = useState('')
    const [allDay, setAllDay] = useState(false)
    const [color] = useState('#ea0000')
    const [isHoliday] = useState(true)
    const [isOpenModalDetail, setIsOpenModalDetail] = useState(false)
    const menuLeft = useSelector(authSelector)

    const [filter, setFilter] = useState<IFilterEvent>({
        pageSize: 10,
        pageNumber: 1,
        sortBy: 'Id',
        isDescending: false,
        keyword: ''
    })

    const { data: responseData, isFetching, refetch } = useGetAllHolidayQuery(filter)
    const [deleteHoliday, { isSuccess: isSuccessDelete }] = useDeleteHolidayMutation()
    const [createHoliday, { isSuccess }] = useCreateHolidayMutation()
    const [updateHoliday] = useUpdateHolidayMutation()
    const [deleteManyHoliday, { isSuccess: isSuccessDeleteMany }] = useDeleteManyHolidayMutation()
    const [createNotification, { isError: isErrorCreate, isSuccess: isSuccessCreate }] = useCreateNotificationMutation()

    useEffect(() => {
        if (isSuccessCreate === true) {
            toast(t('COMMON.HOLIDAY.ACTION_HOLIDAY.CREATE_SUCCESS'), 'success')
        }
        if (isErrorCreate === true) {
            toast(t('COMMON.HOLIDAY.ACTION_HOLIDAY.CREATE_ERROR'), 'error')
        }
    }, [isSuccessCreate, isErrorCreate])

    const holidayData = responseData?.Data.Records as IHolidayGetAll[]
    const totalRecords = responseData?.Data.TotalRecords as number

    const isSelected = (id: number) => selected.includes(id)

    const handleCheckboxClick = (id: number) => {
        setSelected(prev => (prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]))
    }

    const handleSave = async () => {
        setIsSubmit(true)
        if (name.trim() === '' || startDate === null || endDate === null || startDate > endDate || note.trim() === '') {
            return
        }

        try {
            const startTime = convertToVietnamTime(startDate)
            const endTime = convertToVietnamTime(endDate)

            if (selectedRow) {
                await updateHoliday({
                    Id: selectedRow, // ID của bản ghi cần cập nhật
                    Title: name,
                    StartDate: startTime,
                    EndDate: endTime,
                    Description: note,
                    Color: color,
                    AllDay: allDay
                }).unwrap() // unwrap để xử lý lỗi nếu có
            } else {
                // Nếu không có selectedRow, tức là đang tạo mới
                await createHoliday({
                    Title: name,
                    StartDate: startTime,
                    EndDate: endTime,
                    IsHoliday: isHoliday,
                    Description: note,
                    Color: color,
                    AllDay: allDay
                }).unwrap()
                const data = {
                    Type: 'Holiday',
                    Content: note,
                    Title: name,
                    ListUser: [],
                    ListFile: [],
                    UserId: userSentNotificationId,
                    ListDept: [],
                    ListRole: [],
                    TypeToNotify: 1
                }

                await createNotification(data).unwrap()
            }

            handleCloseCreateDialog()
            setDialog()
            setSelectedRow(null) // Reset selectedRow
            setIsSubmit(false)
        } catch (error) {
            console.error('Failed to save holiday:', error)
        }
    }

    const setDialog = () => {
        setName('')
        setStartDate(null)
        setEndDate(null)
        setNote('')
        setAllDay(false)
    }

    useEffect(() => {
        if (isSuccess) {
            refetch() // Gọi lại dữ liệu sau khi tạo hoặc cập nhật thành công
        }
    }, [isSuccess])

    const handleUpdate = async (holiday: IHolidayGetAll) => {
        const startDate = typeof holiday.StartDate === 'string' ? new Date(holiday.StartDate) : holiday.StartDate
        const endDate = typeof holiday.EndDate === 'string' ? new Date(holiday.EndDate) : holiday.EndDate
        setName(holiday.Title)
        setStartDate(startDate) // Chuyển đổi sang định dạng YYYY-MM-DD
        setEndDate(endDate) // Chuyển đổi sang định dạng YYYY-MM-DD
        setNote(holiday.Description || '')
        setAllDay(false)
        setSelectedRow(holiday.Id) // Lưu ID của bản ghi đang chỉnh sửa
        setIsOpen(true) // Mở dialog
    }

    const handleDetail = async (holiday: IHolidayGetAll) => {
        const startDate = typeof holiday.StartDate === 'string' ? new Date(holiday.StartDate) : holiday.StartDate
        const endDate = typeof holiday.EndDate === 'string' ? new Date(holiday.EndDate) : holiday.EndDate
        setIsOpenModalDetail(true)
        setName(holiday.Title)
        setStartDate(startDate)
        setEndDate(endDate)
        setNote(holiday.Description || '')
    }

    const handleCloseModalDetail = () => {
        setIsOpenModalDetail(false)
        setDialog()
    }

    const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.checked) {
            setSelected(holidayData.map(row => row.Id))
        } else {
            setSelected([])
        }
    }
    const handleAllDayChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setAllDay(event.target.checked)
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
    }, [isFetching, responseData, page, rowsPerPage]) // Thêm filter vào dependencies

    useEffect(() => {
        refetch()
    }, [filter])

    const handleDeleteClick = async (id: number) => {
        setOpenDialog(true)
        setSelectedRow(id)
    }

    const handleDeleteHoliday = async () => {
        if (selectedRow) {
            await deleteHoliday(selectedRow)
            if (isSelected(selectedRow)) {
                setSelected(prev => prev.filter(item => item !== selectedRow))
            }
            setOpenDialog(false)
            setSelectedRow(null)
        }
    }

    const handleDeleteManyHoliday = async () => {
        if (selected.length > 0) {
            await deleteManyHoliday(selected)
            setIsChangeMany(false)
            setSelected([])
            setOpenDialog(false)
        }
    }
    useEffect(() => {
        if (isSuccessDelete || isSuccessDeleteMany) {
            refetch()
        }
    }, [isSuccessDelete, isSuccessDeleteMany])

    const handleDeleteManyClick = async () => {
        setIsChangeMany(true)
        setOpenDialog(true)
    }

    const [isOpen, setIsOpen] = useState(false)
    const handleOpenCreateDialog = () => {
        setIsOpen(true)
    }
    const handleCloseCreateDialog = () => {
        setIsOpen(false)
        setDialog()
        setSelectedRow(null)
        setIsSubmit(false)
    }

    useEffect(() => {
        if (isSuccessDelete) {
            refetch()
        }
    }, [isSuccessDelete])

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
                <Box display='flex' alignItems='center' justifyContent='space-between' margin='24px'>
                    <Box sx={{ position: 'relative', width: '100%', height: '55px' }}>
                        <TextField
                            id='location-search'
                            type='search'
                            placeholder={t('COMMON.SYS_CONFIGURATION.PLACEHOLDER_SEARCH')}
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

                        {menuLeft['/admin/holiday'].IsAllowCreate && (
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
                                onClick={() => handleOpenCreateDialog()}
                            >
                                {t('COMMON.BUTTON.CREATE')}
                            </Button>
                        )}
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
                                        indeterminate={selected.length > 0 && selected.length < holidayData.length}
                                        checked={
                                            holidayData && selected.length > 0
                                                ? selected.length === holidayData.length
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
                                <TableCell
                                    sx={{ borderColor: 'var(--border-color)', minWidth: '49px', maxWidth: '60px' }}
                                >
                                    <TableSortLabel
                                        active={orderBy === 'Name'}
                                        direction={orderBy === 'Name' ? order : 'asc'}
                                        onClick={() => handleSort('Name')}
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
                                            {t('COMMON.HOLIDAY.NAME')}
                                        </Typography>
                                    </TableSortLabel>
                                </TableCell>
                                <TableCell>
                                    <TableSortLabel
                                        active={orderBy === 'StartDate'}
                                        direction={orderBy === 'StartDate' ? order : 'asc'}
                                        onClick={() => handleSort('StartDate')}
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
                                            {t('COMMON.HOLIDAY.START_DATE')}
                                        </Typography>
                                    </TableSortLabel>
                                </TableCell>
                                <TableCell>
                                    <TableSortLabel
                                        active={orderBy === 'EndDate'}
                                        direction={orderBy === 'EndDate' ? order : 'asc'}
                                        onClick={() => handleSort('EndDate')}
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
                                            {t('COMMON.HOLIDAY.END_DATE')}
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
                                            maxWidth: '300px',
                                            textOverflow: 'ellipsis',
                                            whiteSpace: 'nowrap'
                                        }}
                                    >
                                        {t('COMMON.HOLIDAY.NOTE')}
                                    </Typography>
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
                                            whiteSpace: 'nowrap'
                                        }}
                                    >
                                        {t('COMMON.HOLIDAY.ACTION')}
                                    </Typography>
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {holidayData?.map(row => (
                                <TableRow key={row.Id} selected={isSelected(row.Id)}>
                                    <TableCell padding='checkbox'>
                                        <Checkbox
                                            checked={isSelected(row.Id)}
                                            onChange={() => handleCheckboxClick(row.Id)}
                                        />
                                    </TableCell>
                                    <TableCell>{row.Id}</TableCell>
                                    <TableCell>{row.Title}</TableCell>
                                    <TableCell>{formatDate(row.StartDate.toString())}</TableCell>
                                    <TableCell>{formatDate(row.EndDate.toString())}</TableCell>
                                    <TableCell
                                        sx={{
                                            color: 'var(--text-color)',
                                            fontSize: '16px',
                                            overflow: 'hidden',
                                            maxWidth: '300px',
                                            textOverflow: 'ellipsis',
                                            whiteSpace: 'nowrap'
                                        }}
                                    >
                                        {row.Description}
                                    </TableCell>
                                    <TableCell>
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
                                                    onClick={() => handleDetail(row)}
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
                                                    onClick={() => handleUpdate(row)}
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
                        <Typography sx={{ mr: '10px' }}>{t('COMMON.PAGINATION.ROWS_PER_PAGE')}</Typography>
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
                        <Typography sx={{ ml: '30px' }}>
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
                onConfirm={() => (isChangeMany ? handleDeleteManyHoliday() : handleDeleteHoliday())}
            />

            {isOpen && (
                <Box
                    sx={{
                        position: 'fixed',
                        top: 0,
                        bottom: 0,
                        left: 0,
                        right: 0,
                        display: 'flex',
                        alignItems: 'center',
                        justifyItems: 'center',
                        backgroundColor: 'rgba(0, 0, 0, 0.5)',
                        zIndex: 1000,
                        height: '100vh'
                    }}
                >
                    {/* <DateRangePicker>
                        
                    </DateRangePicker> */}
                    <Box //box nội dung
                        sx={{
                            width: '500px',
                            backgroundColor: 'white',
                            borderRadius: '12px',
                            boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
                            overflow: 'hidden', //ẩn nội dung khi bị tràn
                            margin: 'auto'
                        }}
                    >
                        <Box //header
                            sx={{
                                padding: '16px 24px',
                                borderBottom: '1px solid var(--border-color)',
                                fontSize: '24px',
                                fontWeight: 'bold',
                                backgroundColor: 'var(--background-color)' //màu nền
                            }}
                        >
                            {t('COMMON.HOLIDAY.TITLE')}
                        </Box>
                        <Box
                            sx={{
                                padding: '24px',
                                backgroundColor: 'var(--background-color)',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '20px'
                            }}
                        >
                            {/* Name Field - Required */}
                            <Box>
                                <TextField
                                    variant='outlined'
                                    label={t('COMMON.HOLIDAY.ACTION_HOLIDAY.NAME')}
                                    name='name'
                                    fullWidth
                                    {...(isSubmit && name === '' && { error: true })}
                                    sx={{
                                        color: 'var(--text-color)',
                                        '& fieldset': {
                                            borderRadius: '8px',
                                            color: 'var(--text-color)',
                                            borderColor: 'var(--border-color)'
                                        },
                                        '& .MuiInputBase-root': { paddingRight: '0px' },
                                        '& .MuiInputBase-input': {
                                            color: 'var(--text-color)',
                                            fontSize: '16px'
                                        },
                                        '& .MuiOutlinedInput-root:hover fieldset': {
                                            borderColor: 'var(--hover-color)'
                                        },
                                        '& .MuiOutlinedInput-root.Mui-focused fieldset': {
                                            borderColor: 'var(--selected-color)'
                                        },
                                        '& .MuiInputLabel-root': {
                                            color: 'var(--text-label-color)'
                                        },
                                        '& .MuiInputLabel-root.Mui-focused': {
                                            color: 'var(--selected-color)'
                                        }
                                    }}
                                    value={name}
                                    onChange={e => setName(e.target.value)}
                                />
                                <Typography
                                    sx={{
                                        color: 'red',
                                        margin: '1px 0 0 10px',
                                        fontSize: '12px',
                                        visibility: isSubmit && name === '' ? 'visible' : 'hidden'
                                    }}
                                >
                                    {t('COMMON.TEXTFIELD.REQUIRED')}
                                </Typography>
                            </Box>
                            <FormControlLabel
                                sx={{
                                    mt: '0px',
                                    ml: '-8px',
                                    mb: '20px',
                                    '& .MuiFormControlLabel-label': {
                                        color: 'var(--text-color)',
                                        fontSize: '16px'
                                    }
                                }}
                                control={
                                    <IOSSwitch sx={{ m: 1, mr: 2 }} onChange={handleAllDayChange} checked={allDay} />
                                }
                                label={t('COMMON.CALENDAR.ALL_DAY')}
                            />

                            <Box>
                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                    <DateTimePicker
                                        label={t('COMMON.HOLIDAY.START_DATE')}
                                        value={dayjs(startDate)}
                                        onChange={value => setStartDate(value?.toDate() || new Date())}
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
                                        label={t('COMMON.HOLIDAY.END_DATE')}
                                        value={dayjs(endDate)}
                                        onChange={value => setEndDate(value?.toDate() || new Date())}
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
                            <TextField
                                variant='outlined'
                                label={t('COMMON.HOLIDAY.NOTE')}
                                id='fullWidth'
                                fullWidth
                                multiline
                                minRows={4}
                                maxRows={12}
                                sx={{
                                    mt: '7px',
                                    color: 'var(--text-color)',
                                    '& fieldset': {
                                        borderRadius: '8px',
                                        color: 'var(--text-color)',
                                        borderColor: 'var(--border-color)'
                                    },
                                    '& .MuiInputBase-root': { paddingRight: '0px' },
                                    '& .MuiInputBase-input': {
                                        color: 'var(--text-color)',
                                        fontSize: '16px'
                                    },
                                    '& .MuiOutlinedInput-root:hover fieldset': {
                                        borderColor: 'var(--hover-color)'
                                    },
                                    '& .MuiOutlinedInput-root.Mui-focused fieldset': {
                                        borderColor: 'var(--selected-color)'
                                    },
                                    '& .MuiInputLabel-root': {
                                        color: 'var(--text-label-color)'
                                    },
                                    '& .MuiInputLabel-root.Mui-focused': {
                                        color: 'var(--selected-color)'
                                    }
                                }}
                                value={note}
                                onChange={e => setNote(e.target.value)}
                            />
                        </Box>
                        <Box
                            sx={{
                                //footer
                                padding: '16px 24px',
                                borderTop: '2px solid var(--border-color)',
                                display: 'flex',
                                justifyContent: 'flex-end',
                                gap: '12px',
                                backgroundColor: 'var(--background-color)'
                            }}
                        >
                            <Button //nút lưu
                                variant='contained'
                                onClick={handleSave}
                                sx={{
                                    height: '44px',
                                    backgroundColor: 'var(--button-color)',
                                    padding: '0px 24px',
                                    '&:hover': {
                                        backgroundColor: 'var(--hover-button-color)'
                                    },
                                    fontSize: '16px',
                                    fontWeight: 'bold',
                                    textTransform: 'none'
                                }}
                            >
                                Lưu
                            </Button>

                            <Button //nút hủy
                                variant='contained'
                                onClick={handleCloseCreateDialog}
                                sx={{
                                    height: '44px',
                                    backgroundColor: 'var(--button-color)',
                                    padding: '0px 24px',
                                    '&:hover': {
                                        backgroundColor: 'var(--hover-button-color)'
                                    },
                                    fontSize: '16px',
                                    fontWeight: 'bold',
                                    textTransform: 'none'
                                }}
                            >
                                Hủy
                            </Button>
                        </Box>
                    </Box>
                </Box>
            )}

            <Dialog open={isOpenModalDetail} onClose={() => handleCloseModalDetail()}>
                <DialogTitle style={{ color: color }}>{name}</DialogTitle>
                <DialogContent>
                    <Typography>
                        <strong>Start Date:</strong> {new Date(startDate).toLocaleDateString()}
                    </Typography>
                    <Typography>
                        <strong>End Date:</strong> {new Date(endDate).toLocaleDateString()}
                    </Typography>
                    <Typography sx={{ whiteSpace: 'normal', wordWrap: 'break-word' }}>
                        <strong>Description:</strong> {note}
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => handleCloseModalDetail()} color='primary'>
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    )
}

export default HolidayPage
