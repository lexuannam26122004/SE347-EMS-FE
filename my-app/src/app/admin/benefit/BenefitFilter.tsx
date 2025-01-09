'use client'
//import { IBenefitGetAll } from '@/models/Benefit'
import Slider from 'rc-slider'
import 'rc-slider/assets/index.css'
/*import {
    useGetAllBenefitsQuery,
    useChangeStatusBenefitMutation,
    useUpdateBenefitMutation,
    useCreateBenefitMutation,
    useChangeStatusManyBenefitMutation
} from '@/services/BenefitService'*/
import {
    Box,
    Select,
    //Pagination,
    Typography,
    MenuItem,
    //SelectChangeEvent,
    //Paper,
    Checkbox,
    //TableRow,
    //TableBody,
    //Table,
    //TableCell,
    //TableHead,
    //TableContainer,
    //Button,
    //TextField,
    //InputAdornment,
    //IconButton,
    //Tooltip,
    //TableSortLabel,
    ListItemText,
    InputLabel,
    FormControl
} from '@mui/material'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
//import SearchIcon from '@mui/icons-material/Search'
//import { CirclePlus, EyeIcon, Pencil, Trash2 } from 'lucide-react'
//import AlertDialog from '@/components/AlertDialog'
//import { IFilterSysConfiguration } from '@/models/SysConfiguration'

//import { useRouter } from 'next/navigation'
//import { formatDate } from '@/utils/formatDate'
import { IAspNetRoleGetAll } from '@/models/AspNetRole'
import { useGetAllRolesQuery } from '@/services/AspNetRoleService'
//import { useGetAllDepartmentQuery } from '@/services/DepartmentService'
//import { IDepartmentGetAll } from '@/models/Department'

function BenefitFilter() {
    const [isSubmit] = useState(false)
    const { t } = useTranslation('common')

    const [roles, setRoles] = useState<string[]>([])
    const { data: roleResponse } = useGetAllRolesQuery()
    const role = (roleResponse?.Data?.Records as IAspNetRoleGetAll[]) || []

    //const [departments, setDepartments] = useState<string[]>([])
    //const { data: department } = useGetAllDepartmentQuery()
    //const departmentDataRecord = (department?.Data?.Records as IDepartmentGetAll[]) || []

    const [gender, setGender] = useState('')
    const [priceRange, setPriceRange] = useState<[number, number]>([0, 26500000])

    const handleSliderChange = (value: number | number[]) => {
        if (Array.isArray(value) && value.length === 2) {
            setPriceRange([value[0], value[1]])
        }
    }
    return (
        <Box
            sx={{
                width: '100%',
                //display: 'flex',
                //justifyContent: 'center',
                //display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                gap: '20px',
                margin: '20px'
            }}
        >
            <Box>
                <FormControl
                    variant='outlined'
                    fullWidth
                    {...(isSubmit && (!Array.isArray(roles) || roles.length === 0) && { error: true })}
                    sx={{
                        '& fieldset': {
                            borderRadius: '8px',
                            color: 'var(--text-color)',
                            borderColor: 'var(--border-color)'
                        },
                        '& .MuiInputBase-root': {
                            paddingRight: '0px'
                        },
                        '& .MuiInputBase-input': {
                            paddingRight: '12px',
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
                        '& .MuiOutlinedInput-root.Mui-error:hover fieldset': {
                            borderColor: 'var(--error-color) !important' // Màu lỗi khi hover
                        },
                        '& .MuiOutlinedInput-root.Mui-error fieldset': {
                            borderColor: 'var(--error-color) !important' // Màu lỗi khi hover
                        },
                        '& .MuiOutlinedInput-root.Mui-focused fieldset': {
                            borderColor: 'var(--selected-field-color)'
                        },
                        '& .MuiInputLabel-root': {
                            color: 'var(--text-label-color)'
                        },
                        '& .MuiInputLabel-root.Mui-focused': {
                            color: 'var(--selected-field-color)'
                        },
                        '& .MuiInputLabel-root.Mui-error': {
                            color: 'var(--error-color)'
                        },
                        '& .MuiSelect-icon': {
                            color:
                                isSubmit && (!Array.isArray(roles) || roles.length === 0)
                                    ? 'var(--error-color)'
                                    : 'var(--text-color)'
                        }
                    }}
                >
                    <InputLabel id='roles-label'>{t('COMMON.EMPLOYEE.ROLES') + '*'}</InputLabel>
                    <Select
                        label={t('COMMON.EMPLOYEE.ROLES') + '*'}
                        multiple
                        value={roles}
                        onChange={event => setRoles(event.target.value as string[])}
                        renderValue={selected => (selected as string[]).join(', ')}
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
                        {role.map(roleItem => (
                            <MenuItem key={roleItem.Name} value={roleItem.Name}>
                                <Checkbox
                                    checked={roles.includes(roleItem.Name)}
                                    sx={{
                                        color: 'var(--text-color)'
                                    }}
                                />
                                <ListItemText primary={roleItem.Name} />
                            </MenuItem>
                        ))}
                    </Select>

                    <Typography
                        sx={{
                            color: 'red',
                            margin: '1px 0 0 10px',
                            fontSize: '12px',
                            visibility: isSubmit && (!Array.isArray(roles) || roles.length === 0) ? 'visible' : 'hidden'
                        }}
                    >
                        {t('COMMON.TEXTFIELD.REQUIRED')}
                    </Typography>
                </FormControl>
            </Box>

            <Box>
                <FormControl
                    fullWidth
                    error={isSubmit && gender === ''}
                    sx={{
                        '& fieldset': {
                            borderRadius: '8px',
                            color: 'var(--text-color)',
                            borderColor: 'var(--border-color)'
                        },
                        '& .MuiInputBase-root': {
                            paddingRight: '0px'
                        },
                        '& .MuiInputBase-input': {
                            paddingRight: '12px',
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
                        '& .MuiOutlinedInput-root.Mui-error:hover fieldset': {
                            borderColor: 'var(--error-color) !important' // Màu lỗi khi hover
                        },
                        '& .MuiOutlinedInput-root.Mui-error fieldset': {
                            borderColor: 'var(--error-color) !important' // Màu lỗi khi hover
                        },
                        '& .MuiOutlinedInput-root.Mui-focused fieldset': {
                            borderColor: 'var(--selected-field-color)'
                        },
                        '& .MuiInputLabel-root': {
                            color: 'var(--text-label-color)'
                        },
                        '& .MuiInputLabel-root.Mui-focused': {
                            color: 'var(--selected-field-color)'
                        },
                        '& .MuiInputLabel-root.Mui-error': {
                            color: 'var(--error-color)'
                        },
                        '& .MuiSelect-icon': {
                            color: isSubmit && gender === '' ? 'var(--error-color)' : 'var(--text-color)'
                        }
                    }}
                >
                    <InputLabel>{t('COMMON.EMPLOYEE.GENDER') + '*'}</InputLabel>

                    <Select
                        labelId='gender-label'
                        id='gender'
                        value={gender}
                        label={t('COMMON.EMPLOYEE.GENDER') + '*'}
                        onChange={e => setGender(e.target.value)}
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
                        <MenuItem value='nam'>Nam</MenuItem>
                        <MenuItem value='nữ'>Nữ</MenuItem>
                        <MenuItem value='khác'>Khác</MenuItem>
                    </Select>
                    <Typography
                        sx={{
                            color: 'red',
                            margin: '1px 0 0 10px',
                            fontSize: '12px',
                            visibility: isSubmit && gender === '' ? 'visible' : 'hidden'
                        }}
                    >
                        {t('COMMON.TEXTFIELD.REQUIRED')}
                    </Typography>
                </FormControl>
            </Box>
            <Box>
                <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
                    <h2>Khoảng giá</h2>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                        <input
                            type='number'
                            value={priceRange[0]}
                            min={0}
                            max={26500000}
                            onChange={e => setPriceRange([Number(e.target.value), priceRange[1]])}
                            style={{ width: '45%', padding: '5px' }}
                        />
                        <span style={{ margin: '0 10px' }}>-</span>
                        <input
                            type='number'
                            value={priceRange[1]}
                            min={0}
                            max={26500000}
                            onChange={e => setPriceRange([priceRange[0], Number(e.target.value)])}
                            style={{ width: '45%', padding: '5px' }}
                        />
                    </div>
                    <Slider
                        range
                        min={0}
                        max={26500000}
                        step={1000}
                        value={priceRange}
                        onChange={handleSliderChange}
                        style={{ marginBottom: '20px' }}
                    />
                    <p>
                        Giá từ: <strong>{priceRange[0].toLocaleString()}đ</strong> đến{' '}
                        <strong>{priceRange[1].toLocaleString()}đ</strong>
                    </p>
                </div>
            </Box>
        </Box>
    )
}

export default BenefitFilter
