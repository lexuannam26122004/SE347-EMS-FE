import { IAspNetRoleGetAll } from '@/models/AspNetRole'
import { useState, useMemo, useCallback, useEffect } from 'react'
import { Columns } from './ColumnRoleList'
import { CircleEditOutline } from 'mdi-material-ui'
import Loading from '@/components/Loading'
import { useGetAllRolesQuery } from '@/services/AspNetRoleService'
import {
    Button,
    Paper,
    Skeleton,
    Table,
    TableCell,
    TableBody,
    Box,
    TextField,
    InputAdornment,
    MenuItem,
    Select,
    Pagination,
    SelectChangeEvent
} from '@mui/material'
import { TableSortLabel, Typography, TableContainer, TableHead, TableRow } from '@mui/material'
import sortTable, { getComparator } from '@/common/sortTable'
import { useTranslation } from 'react-i18next'
import PermissionForRoleModal from './PermissionForRoleModal'
import { SearchIcon } from 'lucide-react'
import { IFilterRole } from '@/models/TablePermissionModel'

export default function PermissionForRole() {
    const { t } = useTranslation('common')
    const [keyword, setKeyword] = useState('')
    const [order, setOrder] = useState<'asc' | 'desc'>('asc')
    const [orderBy, setOrderBy] = useState<string>('')
    const [roleSelected, setRoleSelected] = useState<IAspNetRoleGetAll | null>(null)
    const [page, setPage] = useState(1)
    const [rowsPerPage, setRowsPerPage] = useState('5')
    const [from, setFrom] = useState(1)
    const [to, setTo] = useState(5)
    const [filter, setFilter] = useState<IFilterRole>({
        pageSize: 5,
        pageNumber: 1
    })

    useEffect(() => {}, [filter])

    const { data: roleResponse, isLoading, isFetching } = useGetAllRolesQuery()

    const roleData = (roleResponse?.Data?.Records as IAspNetRoleGetAll[]) || []
    const totalRecords = roleResponse?.Data?.TotalRecords || 0

    useEffect(() => {
        if (!isFetching && roleResponse?.Data) {
            const from = (page - 1) * Number(rowsPerPage) + Math.min(1, roleData.length)
            setFrom(from)

            const to = Math.min(roleData.length + (page - 1) * Number(rowsPerPage), totalRecords)
            setTo(to)
        }
    }, [isFetching, roleResponse, page, rowsPerPage])

    const comparator = useMemo(() => getComparator(order, orderBy), [order, orderBy])
    const sortedRecords = useMemo(() => sortTable(roleData, comparator), [roleData, comparator])

    const handleSort = (property: string) => {
        setOrder(order === 'asc' ? 'desc' : 'asc')
        setOrderBy(property)
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

    const handleOpenModal = useCallback(
        (data: IAspNetRoleGetAll | null) => {
            setRoleSelected(data)
        },
        [roleSelected]
    )

    if (isLoading) {
        return <Loading />
    }

    return (
        <Paper
            elevation={0}
            sx={{
                boxShadow: 'var(--box-shadow-paper)',
                width: '100%',
                overflow: 'hidden',
                borderRadius: '20px',
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
                {t('COMMON.TABLE.PERMISSION.TITLE')}
            </Typography>
            <Box sx={{ position: 'relative', width: '40%', height: '55px', margin: '0px 24px 24px' }}>
                <TextField
                    id='location-search'
                    type='search'
                    placeholder={t('COMMON.TABLE.PERMISSION.SEARCH')}
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
            <TableContainer
                sx={{
                    maxHeight: '80vh',
                    overflow: 'auto',
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
                            {Columns.map((column, idx) => {
                                return (
                                    <TableCell
                                        key={idx}
                                        align={column.align}
                                        sx={{
                                            minWidth: column.minWidth,
                                            maxWidth: column.maxWidth,
                                            width: column.width,
                                            whiteSpace: 'nowrap',
                                            overflow: 'hidden',
                                            padding: '14px',
                                            textOverflow: 'ellipsis',
                                            color: 'var(--text-color)',
                                            borderBottom: '1px solid var(--border-color)'
                                        }}
                                    >
                                        {column.sortable ? (
                                            <TableSortLabel
                                                active={column.id === orderBy}
                                                direction={orderBy === column.id ? order : 'asc'}
                                                onClick={() => handleSort(column.id)}
                                                sx={{
                                                    '& .MuiTableSortLabel-icon': {
                                                        color: 'var(--text-color) !important'
                                                    }
                                                }}
                                            >
                                                <Typography sx={{ color: 'var(--text-color)' }}>
                                                    {t(column.label)}
                                                </Typography>
                                            </TableSortLabel>
                                        ) : (
                                            <Typography sx={{ color: 'var(--text-color)' }}>
                                                {t(column.label)}
                                            </Typography>
                                        )}
                                    </TableCell>
                                )
                            })}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {isLoading
                            ? Array.from({ length: 8 }).map((_, index) => (
                                  <TableRow
                                      key={index}
                                      sx={{
                                          '&:last-child td, &:last-child th': {
                                              border: 'none'
                                          }
                                      }}
                                  >
                                      {Columns.map((column, idx) => {
                                          return (
                                              <TableCell
                                                  key={idx}
                                                  align={column.align}
                                                  sx={{
                                                      minWidth: column.minWidth,
                                                      maxWidth: column.maxWidth,
                                                      width: column.width,
                                                      backgroundColor: 'var(--background-color)',
                                                      color: 'var(--text-color)',
                                                      borderBottom: '1px solid var(--border-color)'
                                                  }}
                                              >
                                                  <Skeleton
                                                      variant='text'
                                                      width='80%'
                                                      height={35}
                                                      sx={{
                                                          bgcolor: 'var(--skeleton-color)',
                                                          display: 'inline-block'
                                                      }}
                                                  />
                                              </TableCell>
                                          )
                                      })}
                                  </TableRow>
                              ))
                            : sortedRecords.map(row => {
                                  return (
                                      <TableRow
                                          role='checkbox'
                                          tabIndex={-1}
                                          key={row.Id}
                                          sx={{
                                              '&:hover': {
                                                  backgroundColor: 'var(--hover-color) !important' // Thêm !important để override style mặc định
                                              }
                                          }}
                                      >
                                          <TableCell
                                              align='center'
                                              sx={{
                                                  width: '5%',
                                                  minWidth: 50,
                                                  padding: '14px',
                                                  maxWidth: '200px',
                                                  borderBottom: '1px solid var(--border-color)'
                                              }}
                                          >
                                              <Typography
                                                  sx={{
                                                      overflow: 'hidden',
                                                      textOverflow: 'ellipsis',
                                                      whiteSpace: 'nowrap',
                                                      color: 'var(--text-color)'
                                                  }}
                                              >
                                                  {row.Id}
                                              </Typography>
                                          </TableCell>
                                          <TableCell
                                              sx={{
                                                  maxWidth: '200px',
                                                  width: '30%',
                                                  padding: '14px',
                                                  whiteSpace: 'nowrap',
                                                  overflow: 'hidden',
                                                  textOverflow: 'ellipsis',
                                                  borderBottom: '1px solid var(--border-color)'
                                              }}
                                          >
                                              <Typography
                                                  sx={{
                                                      overflow: 'hidden',
                                                      textOverflow: 'ellipsis',
                                                      whiteSpace: 'nowrap',
                                                      color: 'var(--text-color)'
                                                  }}
                                              >
                                                  {row.Name}
                                              </Typography>
                                          </TableCell>
                                          <TableCell
                                              align='center'
                                              sx={{
                                                  width: '5%',
                                                  padding: 0,
                                                  borderBottom: '1px solid var(--border-color)'
                                              }}
                                          >
                                              <Button
                                                  onClick={() => {
                                                      handleOpenModal(row)
                                                  }}
                                                  sx={{
                                                      '&:hover': {
                                                          backgroundColor: 'var(--hover-color)'
                                                      }
                                                  }}
                                              >
                                                  <CircleEditOutline style={{ color: 'green' }} />
                                              </Button>
                                          </TableCell>
                                      </TableRow>
                                  )
                              })}
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

            {roleSelected && (
                <PermissionForRoleModal
                    data={roleSelected}
                    open={!!roleSelected}
                    onClose={() => setRoleSelected(null)}
                />
            )}
        </Paper>
    )
}
