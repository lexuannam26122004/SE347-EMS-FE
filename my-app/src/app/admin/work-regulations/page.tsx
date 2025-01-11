'use client'

export interface IFilter {
    isActive?: boolean
    createdDate?: Date
    createdBy?: string
    pageSize?: number
    pageNumber?: number
    sortBy?: string
    isDescending?: boolean
    keyword?: string
    name?: string
}
import AlertDialog from '@/components/AlertDialog'
import { Box, Typography, Paper, Button, Tooltip, MenuItem, Select, Pagination, SelectChangeEvent } from '@mui/material'
import { CirclePlus, Pencil, Trash2 } from 'lucide-react'
import { AlarmClock, List, Shirt, Trash, CheckSquare, FileText, ShieldCheck, Lock } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useGetAllWorkingRulesQuery, useChangeStatusMutation } from '@/services/WorkingRulesService'
import { IWorkingRulesGetAll } from '@/models/WorkingRules'
import Loading from '@/components/Loading'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

function WorkingRolesPage() {
    const { t } = useTranslation('common')
    const router = useRouter()
    const [page, setPage] = useState(1)
    const [rowsPerPage, setRowsPerPage] = useState('10')
    const [from, setFrom] = useState(1)
    const [to, setTo] = useState(10)
    const [openDialog, setOpenDialog] = useState(false)
    const [selectedRow, setSelectedRow] = useState<number | null>(null)
    const [selected, setSelected] = useState<number[]>([])

    const [filter, setFilter] = useState<IFilter>({
        pageSize: 10,
        pageNumber: 1,
        isDescending: false
    })

    const isSelected = (id: number) => selected.includes(id)

    const [deleteDepartment, { isSuccess: isSuccessDelete }] = useChangeStatusMutation()

    const { data: responseData, isFetching, refetch, isLoading: LoadingDepartment } = useGetAllWorkingRulesQuery(filter)
    const data = (responseData?.Data.Records as IWorkingRulesGetAll[]) || []
    const totalRecords = responseData?.Data.TotalRecords as number

    const handleChangePage = (event: React.ChangeEvent<unknown>, newPage: number) => {
        setPage(newPage)
        setFilter(prev => {
            return {
                ...prev,
                pageNumber: newPage
            }
        })
    }

    const handleName = (Type: string) => {
        setPage(1)
        setFilter(prev => {
            return {
                ...prev,
                name: Type
            }
        })
    }

    useEffect(() => {
        if (isSuccessDelete) {
            refetch()
        }
    }, [isSuccessDelete])

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
    }, [page, rowsPerPage, filter])

    const handleDeleteClick = async (id: number) => {
        setOpenDialog(true)
        setSelectedRow(id)
    }

    const handleDelete = async () => {
        if (selectedRow) {
            await deleteDepartment(selectedRow)
            if (isSelected(selectedRow)) {
                setSelected(prev => prev.filter(item => item !== selectedRow))
            }
            setOpenDialog(false)
            setSelectedRow(null)
        }
    }

    if (LoadingDepartment) return <Loading />

    return (
        <Box>
            <Paper
                sx={{
                    width: '100%',
                    overflow: 'hidden',
                    borderRadius: '6px',
                    backgroundColor: 'var(--background-color)',
                    flexDirection: 'column',
                    gap: '24px'
                }}
            >
                <Box
                    sx={{
                        width: '100%',
                        height: '500px',
                        backgroundImage: 'url(/images/backgroundWorkingRules.svg)',
                        position: 'relative'
                    }}
                >
                    <Button
                        variant='contained'
                        startIcon={<CirclePlus />}
                        sx={{
                            height: '44px',
                            backgroundColor: 'rgb(134, 90, 200)',
                            width: 'auto',
                            padding: '0px 24px',
                            '&:hover': {
                                backgroundColor: 'rgb(134, 90, 200)'
                            },
                            fontSize: '16px',
                            fontWeight: 'bold',
                            whiteSpace: 'nowrap',
                            textTransform: 'none',
                            position: 'absolute',
                            top: 20,
                            right: 20
                        }}
                        onClick={() => router.push('/admin/work-regulations/create')}
                    >
                        {t('COMMON.BUTTON.CREATE')}
                    </Button>
                    <img
                        src='/images/backgroundBottomWorkingRules_White.svg'
                        alt=''
                        style={{ width: '100%', position: 'absolute', bottom: 0, zIndex: 0 }}
                    />

                    <img
                        src='/images/policy_icon.svg'
                        alt=''
                        style={{ width: 'calc(100% / 3)', position: 'absolute', bottom: 0, right: 100, zIndex: 0 }}
                    />
                    <Box
                        sx={{
                            //border: '2px solid black',
                            width: '725px',
                            height: '450px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}
                    >
                        <Typography
                            sx={{
                                fontSize: 70,
                                color: 'white',
                                textAlign: 'center',
                                fontWeight: 'bold'
                            }}
                        >
                            WORKING
                            <br />
                            RULES
                        </Typography>
                    </Box>
                </Box>

                <Box
                    sx={{
                        display: 'grid',
                        gridTemplateColumns: 'calc(100% / 4 - 8px) calc(100% / 4 * 3 - 16px)',
                        gap: '24px',
                        margin: '100px 24px 24px 24px'
                    }}
                >
                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            //justifyContent: 'center',
                            flexDirection: 'column',
                            gap: '15px'
                        }}
                    >
                        <Box
                            sx={{
                                gap: '24px',
                                //border: '2px solid black',
                                alignItems: 'center',
                                justifyContent: 'center',
                                display: 'flex',
                                flexDirection: 'column'
                            }}
                        >
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <Typography
                                    sx={{
                                        fontSize: 25,
                                        color: 'var(--roles)',
                                        textAlign: 'center',
                                        fontWeight: 'bold'
                                    }}
                                >
                                    Danh mục
                                </Typography>
                            </Box>
                        </Box>

                        <Box
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'flex-start',
                                backgroundColor: 'rgb(79,38,141)',
                                height: '50px',
                                width: '200px',
                                borderRadius: '25px',
                                paddingLeft: '10px',
                                gap: '15px',
                                cursor: 'pointer'
                            }}
                            onClick={() => handleName(null)}
                        >
                            <Box>
                                <List size={30} color='white' />
                            </Box>
                            <Box
                                sx={{
                                    width: '200px',
                                    height: '50px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}
                            >
                                <Typography
                                    sx={{
                                        fontWeight: 'bold',
                                        fontSize: '15px',
                                        lineHeight: 1,
                                        textAlign: 'center',
                                        paddingRight: '15px',
                                        color: 'white'
                                    }}
                                >
                                    Tất cả
                                </Typography>
                            </Box>
                        </Box>

                        <Box
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'flex-start',
                                backgroundColor: 'rgb(79,38,141)',
                                height: '50px',
                                width: '200px',
                                borderRadius: '25px',
                                paddingLeft: '10px',
                                gap: '15px',
                                cursor: 'pointer'
                            }}
                            onClick={() => handleName('1')}
                        >
                            <Box>
                                <AlarmClock size={30} color='white' />
                            </Box>
                            <Box
                                sx={{
                                    width: '200px',
                                    height: '50px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}
                            >
                                <Typography
                                    sx={{
                                        fontWeight: 'bold',
                                        fontSize: '15px',
                                        lineHeight: 1,
                                        textAlign: 'center',
                                        paddingRight: '15px',
                                        color: 'white'
                                    }}
                                >
                                    Thời gian
                                </Typography>
                            </Box>
                        </Box>
                        <Box
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'flex-start',
                                backgroundColor: 'rgb(79,38,141)',
                                height: '50px',
                                width: '200px',
                                borderRadius: '25px',
                                paddingLeft: '10px',
                                gap: '15px',
                                cursor: 'pointer'
                            }}
                            onClick={() => handleName('2')}
                        >
                            <Box>
                                <Shirt size={30} color='white' />
                            </Box>
                            <Box
                                sx={{
                                    width: '200px',
                                    height: '50px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}
                            >
                                <Typography
                                    sx={{
                                        fontWeight: 'bold',
                                        fontSize: '15px',
                                        lineHeight: 1,
                                        textAlign: 'center',
                                        paddingRight: '15px',
                                        color: 'white'
                                    }}
                                >
                                    Trang phục
                                </Typography>
                            </Box>
                        </Box>
                        <Box
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'flex-start',
                                backgroundColor: 'rgb(79,38,141)',
                                height: '50px',
                                width: '200px',
                                borderRadius: '25px',
                                paddingLeft: '10px',
                                gap: '15px',
                                cursor: 'pointer'
                            }}
                            onClick={() => handleName('3')}
                        >
                            <Box>
                                <Trash size={30} color='white' />
                            </Box>
                            <Box
                                sx={{
                                    width: '200px',
                                    height: '50px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}
                            >
                                <Typography
                                    sx={{
                                        fontWeight: 'bold',
                                        fontSize: '15px',
                                        lineHeight: 1,
                                        textAlign: 'center',
                                        paddingRight: '15px',
                                        color: 'white'
                                    }}
                                >
                                    Giữ gìn vệ sinh
                                </Typography>
                            </Box>
                        </Box>
                        <Box
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'flex-start',
                                backgroundColor: 'rgb(79,38,141)',
                                height: '50px',
                                width: '200px',
                                borderRadius: '25px',
                                paddingLeft: '10px',
                                gap: '15px',
                                cursor: 'pointer'
                            }}
                            onClick={() => handleName('4')}
                        >
                            <Box>
                                <CheckSquare size={30} color='white' />
                            </Box>
                            <Box
                                sx={{
                                    width: '200px',
                                    height: '50px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}
                            >
                                <Typography
                                    sx={{
                                        fontWeight: 'bold',
                                        fontSize: '15px',
                                        lineHeight: 1,
                                        textAlign: 'center',
                                        paddingRight: '15px',
                                        color: 'white'
                                    }}
                                >
                                    Nhiệm vụ
                                </Typography>
                            </Box>
                        </Box>
                        <Box
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'flex-start',
                                backgroundColor: 'rgb(79,38,141)',
                                height: '50px',
                                width: '200px',
                                borderRadius: '25px',
                                paddingLeft: '10px',
                                gap: '15px',
                                cursor: 'pointer'
                            }}
                            onClick={() => handleName('5')}
                        >
                            <Box>
                                <FileText size={30} color='white' />
                            </Box>
                            <Box
                                sx={{
                                    width: '200px',
                                    height: '50px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}
                            >
                                <Typography
                                    sx={{
                                        fontWeight: 'bold',
                                        fontSize: '15px',
                                        lineHeight: 1,
                                        textAlign: 'center',
                                        paddingRight: '15px',
                                        color: 'white'
                                    }}
                                >
                                    Báo cáo
                                </Typography>
                            </Box>
                        </Box>
                        <Box
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'flex-start',
                                backgroundColor: 'rgb(79,38,141)',
                                height: '50px',
                                width: '200px',
                                borderRadius: '25px',
                                paddingLeft: '10px',
                                gap: '15px',
                                cursor: 'pointer'
                            }}
                            onClick={() => handleName('6')}
                        >
                            <Box>
                                <ShieldCheck size={30} color='white' />
                            </Box>
                            <Box
                                sx={{
                                    width: '200px',
                                    height: '50px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}
                            >
                                <Typography
                                    sx={{
                                        fontWeight: 'bold',
                                        fontSize: '15px',
                                        lineHeight: 1,
                                        textAlign: 'center',
                                        paddingRight: '15px',
                                        color: 'white'
                                    }}
                                >
                                    Tuân thủ quy tắc
                                </Typography>
                            </Box>
                        </Box>
                        <Box
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'flex-start',
                                backgroundColor: 'rgb(79,38,141)',
                                height: '50px',
                                width: '200px',
                                borderRadius: '25px',
                                paddingLeft: '10px',
                                gap: '15px',
                                cursor: 'pointer'
                            }}
                            onClick={() => handleName('7')}
                        >
                            <Box>
                                <Lock size={30} color='white' />
                            </Box>
                            <Box
                                sx={{
                                    width: '200px',
                                    height: '50px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}
                            >
                                <Typography
                                    sx={{
                                        fontWeight: 'bold',
                                        fontSize: '15px',
                                        lineHeight: 1,
                                        textAlign: 'center',
                                        paddingRight: '15px',
                                        color: 'white'
                                    }}
                                >
                                    Bảo quản tài sản
                                </Typography>
                            </Box>
                        </Box>
                    </Box>
                    <Box sx={{ gap: '24px', display: 'flex', flexDirection: 'column' }}>
                        {data.map(item => (
                            <Box key={item.Id}>
                                <Box
                                    sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'flex-start',
                                        height: '100%',
                                        gap: '24px',
                                        //border: '2px solid var(--bg-all-color1)',
                                        borderRadius: '15px'
                                    }}
                                >
                                    <Box
                                        sx={{
                                            padding: '1px 10px 1px 10px',
                                            backgroundColor: 'rgb(79,38,141)',
                                            borderRadius: '13px',
                                            display: 'flex',
                                            width: '100px',
                                            alignItems: 'center',
                                            justifyContent: 'center'
                                        }}
                                    >
                                        <Typography
                                            sx={{
                                                color: 'rgb(255, 255, 255)',
                                                fontSize: '50px',
                                                fontWeight: 'bold'
                                            }}
                                        >
                                            {item.Id}
                                        </Typography>
                                    </Box>
                                    <Box
                                        sx={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            width: '100%'
                                        }}
                                    >
                                        <Box sx={{ textAlign: 'left' }}>
                                            <Box>
                                                <Typography
                                                    sx={{
                                                        fontWeight: 'bold',
                                                        fontSize: '17px',
                                                        color: 'var(--bg-all-color1)'
                                                    }}
                                                >
                                                    {item.Content}
                                                </Typography>
                                            </Box>

                                            <Typography sx={{ fontStyle: 'italic', color: 'var(--bg-all-color1)' }}>
                                                {t('Lưu ý: ') + item.Note}
                                            </Typography>
                                        </Box>
                                    </Box>
                                    <Box
                                        sx={{ marginLeft: 'auto' }}
                                        display='flex'
                                        alignItems='center'
                                        justifyContent='flex-end'
                                    >
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
                                                    router.push(`/admin/work-regulations/update?id=${item.Id}`)
                                                }
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
                                                onClick={() => handleDeleteClick(item.Id)}
                                            >
                                                <Trash2 />
                                            </Box>
                                        </Tooltip>
                                    </Box>
                                </Box>
                            </Box>
                        ))}

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
                                    {[5, 10, 20, 30, 40].map(value => (
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
                    </Box>
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
                onConfirm={() => handleDelete()}
            />
        </Box>
    )
}
export default WorkingRolesPage
