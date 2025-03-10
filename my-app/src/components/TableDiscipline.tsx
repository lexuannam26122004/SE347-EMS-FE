'use client'
import { formatDate } from '@/utils/formatDate'
import { formatNumberToMoney } from '@/utils/formatNumberWithUnit'
import {
    Box,
    Typography,
    Tooltip,
    TableRow,
    TableBody,
    Table,
    TableCell,
    TableHead,
    TableContainer,
    TableSortLabel,
    Avatar
} from '@mui/material'
import { ClipboardCheck, EyeIcon, Pencil, Trash2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useRouter, usePathname } from 'next/navigation'
import Loading from './Loading'
import { authSelector } from '@/redux/slices/authSlice'
import { useSelector } from 'react-redux'
import { IFilterReward } from '@/models/Reward'
import { useChangeStatusDisciplineMutation } from '@/services/DisciplineService'
import AlertDialog from './AlertDialog'
import DetailModal from '@/app/admin/discipline/DetailModal'
import { useUpdateIsPenalizedMutation } from '@/services/DisciplineService'

function getStatusBgColor(status: boolean): string {
    if (status === false) {
        return 'var(--bg-warning-color)'
    } else {
        return 'var(--bg-success-color)'
    }
}

function getStatusTextColor(status: boolean): string {
    if (status === false) {
        return 'var(--text-warning-color)'
    } else {
        return 'var(--text-success-color)'
    }
}

interface IGetAllDiscipline {
    Id: number
    FullName: string
    AvatarPath: string
    EmployeeId: string
    Department: string
    Date: string
    Money?: number
    Reason: string
    Note: string
    IsPenalized: boolean
}

interface IProps {
    disciplinesData: IGetAllDiscipline[]
    setFilter: React.Dispatch<React.SetStateAction<IFilterReward>>
    refetch: () => void
}

function TableErrorReport({ disciplinesData, setFilter, refetch }: IProps) {
    const { t } = useTranslation('common')
    const router = useRouter()
    const pathName = usePathname()
    const [openDialog, setOpenDialog] = useState(false)
    const [selectedRow, setSelectedRow] = useState<number | null>(null)
    const [order, setOrder] = useState<'asc' | 'desc'>('asc')
    const [orderBy, setOrderBy] = useState<string>('')
    const [selectedDiscipline, setSelectedDiscipline] = useState<IGetAllDiscipline | null>(null)
    const [openModal, setOpenModal] = useState(false)
    const [changeDiscipline, { isSuccess: isSuccessChange }] = useChangeStatusDisciplineMutation()
    const [updateIsPenalized, { isSuccess: isSuccessUpdateIsPenalized }] = useUpdateIsPenalizedMutation()

    const handleButtonUpdateClick = (id: number) => {
        router.push(`/admin/discipline/update?id=${id}`)
    }

    const handleConsiderClick = async (id: number) => {
        await updateIsPenalized(id)
    }

    const handleClickDetail = (discipline: IGetAllDiscipline) => {
        setSelectedDiscipline(discipline)
        setOpenModal(true)
    }

    const handleDeleteClick = async (id: number) => {
        setOpenDialog(true)
        setSelectedRow(id)
    }

    const handleDeleteDiscipline = async () => {
        if (selectedRow) {
            await changeDiscipline(selectedRow)
            setOpenDialog(false)
            setSelectedRow(null)
        }
    }

    useEffect(() => {
        if (isSuccessChange || isSuccessUpdateIsPenalized) {
            refetch()
        }
    }, [isSuccessChange, isSuccessUpdateIsPenalized])

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

    const menuLeft = useSelector(authSelector)

    if (menuLeft === null || Object.keys(menuLeft).length === 0) {
        return <Loading />
    }

    return (
        <>
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
                            <TableCell sx={{ borderColor: 'var(--border-color)', padding: '16px 30px 16px 24px' }}>
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
                                            maxWidth: '300px',
                                            textOverflow: 'ellipsis',
                                            whiteSpace: 'nowrap'
                                        }}
                                    >
                                        {t('COMMON.REWARD_DISCIPLINE.FULLNAME')}
                                    </Typography>
                                </TableSortLabel>
                            </TableCell>

                            <TableCell sx={{ borderColor: 'var(--border-color)' }}>
                                <TableSortLabel
                                    active={'Department' === orderBy}
                                    direction={orderBy === 'Department' ? order : 'asc'}
                                    onClick={() => handleSort('Department')}
                                    sx={{
                                        '& .MuiTableSortLabel-icon': {
                                            color: 'var(--text-color) !important'
                                        },
                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignItems: 'center'
                                    }}
                                >
                                    <Typography
                                        sx={{
                                            fontWeight: 'bold',
                                            color: 'var(--text-color)',
                                            fontSize: '16px',
                                            textAlign: 'center',
                                            maxWidth: '280px',
                                            overflow: 'hidden',
                                            ml: '8px',
                                            textOverflow: 'ellipsis',
                                            whiteSpace: 'nowrap'
                                        }}
                                    >
                                        {t('COMMON.REWARD_DISCIPLINE.DEPARTMENT')}
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
                                        },
                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignItems: 'center'
                                    }}
                                >
                                    <Typography
                                        sx={{
                                            fontWeight: 'bold',
                                            color: 'var(--text-color)',
                                            fontSize: '16px',
                                            textAlign: 'center',
                                            maxWidth: '280px',
                                            overflow: 'hidden',
                                            ml: '8px',
                                            textOverflow: 'ellipsis',
                                            whiteSpace: 'nowrap'
                                        }}
                                    >
                                        {t('COMMON.REWARD_DISCIPLINE.DATE')}
                                    </Typography>
                                </TableSortLabel>
                            </TableCell>

                            <TableCell sx={{ borderColor: 'var(--border-color)' }}>
                                <TableSortLabel
                                    active={'Reason' === orderBy}
                                    direction={orderBy === 'Reason' ? order : 'asc'}
                                    onClick={() => handleSort('Reason')}
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
                                        {t('COMMON.REWARD_DISCIPLINE.REASON')}
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
                                        textOverflow: 'ellipsis',
                                        whiteSpace: 'nowrap'
                                    }}
                                >
                                    {t('COMMON.REWARD_DISCIPLINE.MONEY_REWARD')}
                                </Typography>
                            </TableCell>

                            <TableCell sx={{ borderColor: 'var(--border-color)' }}>
                                <Typography
                                    sx={{
                                        fontWeight: 'bold',
                                        color: 'var(--text-color)',
                                        fontSize: '16px',
                                        textAlign: 'center',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        whiteSpace: 'nowrap'
                                    }}
                                >
                                    {t('COMMON.ERROR_REPORT.STATUS')}
                                </Typography>
                            </TableCell>

                            <TableCell sx={{ borderColor: 'var(--border-color)', padding: '16px 50px' }}>
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
                                    {t('COMMON.ERROR_REPORT.ACTION')}
                                </Typography>
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {disciplinesData &&
                            disciplinesData.map((row: IGetAllDiscipline, index: number) => (
                                <TableRow
                                    key={index}
                                    sx={{
                                        '&:last-child td, &:last-child th': {
                                            border: 'none'
                                        }
                                    }}
                                >
                                    <TableCell
                                        sx={{
                                            borderColor: 'var(--border-color)',
                                            borderStyle: 'dashed',
                                            padding: '16px 24px 16px 24px'
                                        }}
                                    >
                                        <Box
                                            sx={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '14px'
                                            }}
                                        >
                                            <Avatar
                                                sx={{
                                                    mt: '-2px'
                                                }}
                                                src={
                                                    row.AvatarPath ||
                                                    'https://localhost:44381/avatars/aa1678f0-75b0-48d2-ae98-50871178e9bd.jfif'
                                                }
                                            />

                                            <Box>
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
                                                <Typography
                                                    sx={{
                                                        color: 'var(--created-date-color)',
                                                        fontSize: '16px',
                                                        mt: '-0px',
                                                        overflow: 'hidden',
                                                        textOverflow: 'ellipsis',
                                                        whiteSpace: 'nowrap'
                                                    }}
                                                >
                                                    {row.EmployeeId}
                                                </Typography>
                                            </Box>
                                        </Box>
                                    </TableCell>

                                    <TableCell sx={{ borderColor: 'var(--border-color)', borderStyle: 'dashed' }}>
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
                                            {row.Department}
                                        </Typography>
                                    </TableCell>

                                    <TableCell
                                        sx={{
                                            borderStyle: 'dashed',
                                            borderColor: 'var(--border-color)'
                                        }}
                                    >
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
                                            {formatDate(row.Date)}
                                        </Typography>
                                    </TableCell>

                                    <TableCell
                                        sx={{
                                            borderStyle: 'dashed',
                                            borderColor: 'var(--border-color)'
                                        }}
                                    >
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
                                            {row.Reason}
                                        </Typography>
                                    </TableCell>

                                    <TableCell
                                        sx={{
                                            borderStyle: 'dashed',
                                            borderColor: 'var(--border-color)'
                                        }}
                                    >
                                        <Box
                                            sx={{
                                                color: 'var(--text-color)',
                                                fontSize: '16px',
                                                maxWidth: '280px',
                                                fontStyle: 'italic',
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis',
                                                whiteSpace: 'nowrap'
                                            }}
                                        >
                                            {row.Money && formatNumberToMoney(row.Money)}
                                        </Box>
                                    </TableCell>

                                    <TableCell
                                        sx={{
                                            borderStyle: 'dashed',
                                            borderColor: 'var(--border-color)',
                                            padding: '11px'
                                        }}
                                    >
                                        <Box
                                            sx={{
                                                borderRadius: '8px',
                                                padding: '5px 10px',
                                                display: 'flex',
                                                minWidth: '100px',
                                                justifyContent: 'center',
                                                backgroundColor: getStatusBgColor(row.IsPenalized)
                                            }}
                                        >
                                            <Typography
                                                sx={{
                                                    fontSize: '15px',
                                                    overflow: 'hidden',
                                                    color: getStatusTextColor(row.IsPenalized),
                                                    width: 'auto',
                                                    fontWeight: 'bold',
                                                    display: 'inline-block',
                                                    textOverflow: 'ellipsis',
                                                    whiteSpace: 'nowrap'
                                                }}
                                            >
                                                {row.IsPenalized ? 'Đã xử lý' : 'Chưa xử lý'}
                                            </Typography>
                                        </Box>
                                    </TableCell>

                                    <TableCell
                                        sx={{
                                            padding: '0px 30px 0px',
                                            borderColor: 'var(--border-color)',
                                            width: '146px',
                                            borderStyle: 'dashed'
                                        }}
                                    >
                                        <Box display='flex' alignItems='center' justifyContent='center' gap='10px'>
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
                                                    onClick={() => handleClickDetail(row)}
                                                >
                                                    <EyeIcon />
                                                </Box>
                                            </Tooltip>

                                            {menuLeft['Discipline'].IsAllowEdit && (
                                                <Tooltip title={'Cập nhật trạng thái'}>
                                                    <Box
                                                        display='flex'
                                                        alignItems='center'
                                                        justifyContent='center'
                                                        sx={{
                                                            cursor: 'pointer',
                                                            color: '#d1006d',
                                                            borderRadius: '50%',
                                                            width: '42px',
                                                            height: '42px',
                                                            '&:hover': {
                                                                backgroundColor: 'var(--hover-color)'
                                                            }
                                                        }}
                                                        onClick={() => handleConsiderClick(row.Id)}
                                                    >
                                                        <ClipboardCheck />
                                                    </Box>
                                                </Tooltip>
                                            )}

                                            {menuLeft['Discipline'].IsAllowEdit && !pathName.includes('statistics') && (
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
                                                        onClick={() => handleButtonUpdateClick(row.Id)}
                                                    >
                                                        <Pencil />
                                                    </Box>
                                                </Tooltip>
                                            )}
                                            {menuLeft['Discipline'].IsAllowDelete &&
                                                !pathName.includes('statistics') && (
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
                                                )}
                                        </Box>
                                    </TableCell>
                                </TableRow>
                            ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <AlertDialog
                title={t('COMMON.ALERT_DIALOG.CONFIRM_DELETE.TITLE')}
                content={t('COMMON.ALERT_DIALOG.CONFIRM_DELETE.CONTENT')}
                type='warning'
                open={openDialog}
                setOpen={setOpenDialog}
                buttonCancel={t('COMMON.ALERT_DIALOG.CONFIRM_DELETE.CANCEL')}
                buttonConfirm={t('COMMON.ALERT_DIALOG.CONFIRM_DELETE.DELETE')}
                onConfirm={() => handleDeleteDiscipline()}
            />

            {selectedDiscipline && (
                <DetailModal
                    handleToggle={() => setOpenModal(false)}
                    open={openModal}
                    discipline={selectedDiscipline}
                />
            )}
        </>
    )
}

export default TableErrorReport
