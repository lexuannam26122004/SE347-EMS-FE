import React, { useMemo } from 'react'
import { Box, Typography, Skeleton, Button, InputAdornment, TextField, Divider } from '@mui/material'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import { useEffect, useState } from 'react'
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline'
import { IDepartmentGetAll } from '@/models/Department'
import { useGetAllDepartmentQuery } from '@/services/DepartmentService'
import debounce from 'lodash.debounce'
import { useTranslation } from 'react-i18next'
import { ArrowRight, SearchIcon } from 'lucide-react'

interface Props {
    handleAfter: () => void
    handleClose: () => void
    tempSelectedDepartment: IDepartmentGetAll[]
    setTempSelectedDepartment: React.Dispatch<React.SetStateAction<IDepartmentGetAll[]>>
}

function ListDepartment({ handleAfter, handleClose, tempSelectedDepartment, setTempSelectedDepartment }: Props) {
    const [showError, setShowError] = useState(false)
    const { t } = useTranslation('common')
    const [showSkeleton, setShowSkeleton] = useState(true)
    const {
        data: departmentResponse,
        isFetching: isFetchingDepartment,
        isError: isErrorDepartment
    } = useGetAllDepartmentQuery()
    const departments = (departmentResponse?.Data?.Records as IDepartmentGetAll[]) || []
    const [filteredDept, setFilteredDept] = useState<IDepartmentGetAll[]>([])
    const [search, setSearch] = useState('')
    const [select, setSelect] = useState(true)

    const handleChooseDepartment = (department: IDepartmentGetAll) => {
        setTempSelectedDepartment(prev =>
            prev.some(d => d.Id === department.Id) ? prev.filter(d => d.Id !== department.Id) : [...prev, department]
        )
        setSelect(tempSelectedDepartment.length + 1 !== departments.length)
    }

    const sortedDepartments = useMemo(() => {
        const selectedDepartmentsSet = new Set(tempSelectedDepartment.map(u => u.Id))
        return [
            ...tempSelectedDepartment,
            ...(Array.isArray(departments)
                ? departments.filter(department => !selectedDepartmentsSet.has(department.Id))
                : [])
        ]
    }, [departments, tempSelectedDepartment])

    const handleSearch = debounce(value => {
        const filtered = sortedDepartments.filter(dept => dept.Name.toLowerCase().includes(value.toLowerCase()))
        setFilteredDept(filtered)
    }, 100)

    const deptLast = useMemo(() => {
        if (filteredDept.length === 0 && search === '') {
            return sortedDepartments
        }
        return filteredDept
    }, [sortedDepartments, filteredDept])

    useEffect(() => {
        setSearch('')
    }, [])

    useEffect(() => {
        handleSearch(search)
    }, [search, sortedDepartments])

    useEffect(() => {
        if (!isFetchingDepartment) {
            setShowError(isErrorDepartment)
            setShowSkeleton(false)
        }
    }, [isFetchingDepartment, isErrorDepartment])

    useEffect(() => {
        if (departments.length === 0) return

        const shouldSelect = tempSelectedDepartment.length !== departments.length
        if (shouldSelect !== select) {
            setSelect(shouldSelect)
        }
    }, [tempSelectedDepartment, departments])

    const handleSelectAllClick = () => {
        if (!select) {
            setTempSelectedDepartment([])
        } else {
            setTempSelectedDepartment(departments)
        }
        setSelect(!select)
    }

    return (
        <Box>
            <Box padding='16px 16px' sx={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <TextField
                    variant='outlined'
                    inputRef={input => input && input.focus()}
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    placeholder={'Tìm kiếm phòng ban'}
                    sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        width: '100%',
                        borderRadius: '50px',
                        height: '45px',
                        backgroundColor: 'var(--search-color)',
                        '& .MuiOutlinedInput-root': {
                            borderRadius: '20px',
                            '& fieldset': {
                                border: 'none' // Ẩn viền
                            },
                            '&:hover fieldset': {
                                border: 'none' // Ẩn viền khi hover
                            },
                            '&.Mui-focused fieldset': {
                                border: 'none' // Ẩn viền khi focus
                            }
                        },
                        '& .MuiInputBase-input': {
                            color: 'var(--text-color)' // Thay đổi màu chữ trong TextField
                        }
                    }}
                    slotProps={{
                        input: {
                            startAdornment: (
                                <InputAdornment position='start'>
                                    <SearchIcon style={{ color: 'gray', width: '19px', height: '19px' }} />
                                </InputAdornment>
                            )
                        }
                    }}
                />

                <Button
                    sx={{
                        textTransform: 'none',
                        whiteSpace: 'nowrap',
                        padding: '6px 15px',
                        width: 'auto',
                        '&:hover': {
                            backgroundColor: 'var(--hover-color)'
                        }
                    }}
                    onClick={handleSelectAllClick}
                >
                    {select === true ? t('COMMON.BUTTON.SELECT') : t('COMMON.BUTTON.UNSELECT')}
                </Button>
            </Box>
            <Box
                sx={{
                    height: '60vh',
                    width: '100%',
                    flexGrow: 1,
                    borderWidth: '0px',
                    borderStyle: 'solid',
                    borderColor: 'divider',
                    display: 'flex',
                    flexDirection: 'column',
                    overflow: 'auto',
                    scrollbarGutter: 'stable both-edges',
                    '&::-webkit-scrollbar': {
                        width: '7px',
                        height: '7px'
                    },
                    gap: 0,
                    '&::-webkit-scrollbar-thumb': {
                        backgroundColor: 'var(--scrollbar-color)',
                        borderRadius: '10px'
                    }
                }}
            >
                {showSkeleton ? (
                    <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%', gap: 1.9, height: '100%' }}>
                        {Array.from({ length: 15 }).map((_, index) => (
                            <Box
                                key={index}
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    padding: '6px 10px 0',
                                    justifyContent: 'center'
                                }}
                            >
                                <Skeleton
                                    variant='text'
                                    width='85%'
                                    height='22px'
                                    sx={{ borderRadius: '10px', bgcolor: 'var(--skeleton-color)' }}
                                />
                            </Box>
                        ))}
                    </Box>
                ) : showError ? (
                    <img src='/images/Error.gif' alt='' />
                ) : deptLast.length === 0 ? (
                    <Box sx={{ mt: '20px', width: '100%' }}>
                        <Typography sx={{ width: '100%', textAlign: 'center' }}>
                            {t('COMMON.CREATE_NOTIFICATION.NOT_FOUND')}
                        </Typography>
                    </Box>
                ) : (
                    deptLast.map((department, index) => (
                        <Box
                            key={index}
                            sx={{
                                backgroundColor: 'var(--background-color)',
                                padding: '14px 11px',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                borderRadius: '6px',
                                position: 'relative',
                                '&:hover': {
                                    backgroundColor: 'var(--hover-color)'
                                }
                            }}
                            onClick={() => handleChooseDepartment(department)}
                        >
                            <Typography
                                sx={{
                                    fontWeight: 'bold',
                                    margin: 0,
                                    fontSize: '15px',
                                    whiteSpace: 'nowrap',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    color: 'var(--text-color)'
                                }}
                            >
                                {department.Name}
                            </Typography>

                            <Box sx={{ position: 'absolute', right: '10px' }}>
                                {tempSelectedDepartment.includes(department) ? (
                                    <CheckCircleIcon sx={{ color: '#1879b3' }} />
                                ) : (
                                    <CheckCircleOutlineIcon sx={{ color: 'var(--text-gray-color)' }} />
                                )}
                            </Box>
                        </Box>
                    ))
                )}
            </Box>
            <Box>
                <Divider />
                <Box
                    sx={{
                        padding: '12px 16px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '20px',
                        justifyContent: 'right'
                    }}
                >
                    <Typography
                        sx={{
                            color: '#0064D1',
                            padding: '6px 12px',
                            borderRadius: '4px',
                            fontSize: '15px',
                            cursor: 'pointer',
                            '&:hover': {
                                backgroundColor: 'var(--hover-color)'
                            }
                        }}
                        onClick={handleClose}
                    >
                        {t('COMMON.BUTTON.CANCEL')}
                    </Typography>
                    <Button
                        variant='contained'
                        endIcon={<ArrowRight />}
                        sx={{
                            height: '40px',
                            backgroundColor: 'var(--button-color)',
                            width: 'auto',
                            fontSize: '15px',
                            '&:hover': {
                                backgroundColor: 'var(--hover-button-color)'
                            },
                            padding: '0px 24px',
                            fontWeight: 'bold',
                            whiteSpace: 'nowrap',
                            textTransform: 'none'
                        }}
                        onClick={handleAfter}
                    >
                        {t('COMMON.BUTTON.AFTER')}
                    </Button>
                </Box>
            </Box>
        </Box>
    )
}

export default ListDepartment
