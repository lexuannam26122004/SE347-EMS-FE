'use client'
import React, { useEffect, useState } from 'react'
import {
    Box,
    Card,
    CardContent,
    Typography,
    Avatar,
    TableContainer,
    Table,
    TableBody,
    TableRow,
    TableCell,
    Paper,
    Modal
} from '@mui/material'
import { styled } from '@mui/material/styles'
import { ISalaryGetById } from '@/models/salary'
import Loading from '@/components/Loading'
import { useGetSalaryByIdQuery } from '@/services/SalaryService'

const StyledCard = styled(Card)(() => ({}))

interface Props {
    open: boolean
    handleToggle: () => void
    salaryId: string
}

// Reusable component for displaying data in a table row
const DataTableRow: React.FC<{ label: string; value: string | number | undefined }> = ({ label, value }) => {
    return (
        <TableRow>
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
                    {label}
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
                    {typeof value === 'number'
                        ? value.toLocaleString('vi-VN', {
                              style: 'currency',
                              currency: 'VND'
                          })
                        : value}
                </Typography>
            </TableCell>
        </TableRow>
    )
}

// Reusable component for section titles
const SectionTitle: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return (
        <TableRow>
            <TableCell colSpan={4} sx={{ borderColor: 'var(--border-color)' }}>
                <Typography
                    fontWeight='bold'
                    sx={{
                        color: 'var(--text-color)',
                        fontSize: '20px',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        fontWeight: 'bold'
                    }}
                >
                    {children}
                </Typography>
            </TableCell>
        </TableRow>
    )
}

const EmployeeSalary: React.FC<ISalaryGetById & { handleToggle: () => void; open: boolean }> = ({
    AvatarPath,
    FullName,
    EmployeeId,
    DepartmentName,
    RoleName,
    Date,
    SalaryPayment,
    PayrollPeriod,
    ProRatedSalary,
    PITax,
    TotalInsurance,
    TotalBenefit,
    TotalReward,
    TotalDiscipline,
    NumberOfWorkingHours,
    handleToggle,
    open
}) => {
    return (
        <Modal open={open} onClose={handleToggle}>
            <Paper
                sx={{
                    width: '60%',
                    height: '90vh',
                    position: 'absolute',
                    overflowY: 'auto',
                    top: '50%',
                    left: '50%',
                    backgroundColor: 'var(--background-color)',
                    borderRadius: '15px',
                    transform: 'translate(-50%, -50%)',
                    '&::-webkit-scrollbar': {
                        display: 'none'
                    }
                }}
            >
                <StyledCard>
                    <CardContent
                        sx={{ backgroundColor: 'var(--background-color)', boxShadow: 'var(--box-shadow-paper)' }}
                    >
                        {/* Header Section */}
                        <Box
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                ml: 2,
                                mt: 2,
                                mb: 3
                            }}
                        >
                            <Avatar
                                alt={FullName}
                                src={AvatarPath}
                                sx={{
                                    width: 80,
                                    height: 80,
                                    mr: 3,
                                    border: '2px solid',
                                    borderColor: 'primary.main'
                                }}
                            />
                            <Box>
                                <Typography variant='h5' fontWeight='bold' color='var(--text-color)'>
                                    {FullName}
                                </Typography>
                            </Box>
                        </Box>

                        <Box sx={{ padding: '20px' }}>
                            <TableContainer>
                                <Table>
                                    <TableBody>
                                        {/* Thông tin nhân viên */}
                                        <DataTableRow label='Họ tên' value={FullName} />
                                        <DataTableRow label='Mã số nhân viên' value={EmployeeId} />
                                        <DataTableRow label='Phòng ban' value={DepartmentName} />
                                        <DataTableRow label='Chức vụ' value={RoleName.join(', ')} />
                                        <DataTableRow label='Ngày nhận lương' value={Date.toString()} />
                                        <DataTableRow label='Kỳ lương' value={PayrollPeriod} />
                                        <DataTableRow label='Số giờ làm việc' value={NumberOfWorkingHours} />

                                        {/* Các khoản thu nhập */}
                                        <SectionTitle>Các khoản thu nhập</SectionTitle>
                                        <DataTableRow label='Lương cơ bản' value={ProRatedSalary} />
                                        <DataTableRow label='Thưởng' value={TotalReward} />
                                        <DataTableRow label='Phúc lợi' value={TotalBenefit} />

                                        {/* Các khoản khấu trừ */}
                                        <SectionTitle>Các khoản khấu trừ</SectionTitle>
                                        <DataTableRow label='Bảo hiểm' value={TotalInsurance} />
                                        <DataTableRow label='Thuế' value={PITax} />
                                        <DataTableRow label='Phạt' value={TotalDiscipline} />

                                        {/* Tổng cộng */}
                                        <TableRow>
                                            <TableCell
                                                colSpan={1}
                                                sx={{ fontWeight: 'bold', borderColor: 'var(--border-color)' }}
                                            >
                                                <Typography
                                                    sx={{
                                                        color: 'var(--text-color)',
                                                        fontSize: '20px',
                                                        overflow: 'hidden',
                                                        textOverflow: 'ellipsis',
                                                        whiteSpace: 'nowrap',
                                                        fontWeight: 'bold'
                                                    }}
                                                >
                                                    Tổng cộng
                                                </Typography>
                                            </TableCell>
                                            <TableCell colSpan={1} sx={{ borderColor: 'var(--border-color)' }}>
                                                <Typography
                                                    sx={{
                                                        color: 'var(--text-color)',
                                                        fontSize: '16px',
                                                        overflow: 'hidden',
                                                        textOverflow: 'ellipsis',
                                                        whiteSpace: 'nowrap'
                                                    }}
                                                >
                                                    {SalaryPayment.toLocaleString('vi-VN', {
                                                        style: 'currency',
                                                        currency: 'VND'
                                                    })}
                                                </Typography>
                                            </TableCell>
                                        </TableRow>
                                    </TableBody>
                                </Table>
                            </TableContainer>

                            {/* Tổng tiền thực nhận */}
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
                                <Typography fontWeight='bold' fontSize={'20px'} color='var(--text-color)'>
                                    Tổng số tiền thực nhận:
                                </Typography>
                                <Typography color='var(--text-color)'>
                                    {(SalaryPayment - TotalInsurance - PITax).toLocaleString('vi-VN', {
                                        style: 'currency',
                                        currency: 'VND'
                                    })}
                                </Typography>
                            </Box>
                        </Box>
                    </CardContent>
                </StyledCard>
            </Paper>
        </Modal>
    )
}

const EmployeeSalaryModal: React.FC<Props> = ({ open, handleToggle, salaryId }) => {
    const { data, isLoading, isError } = useGetSalaryByIdQuery({ Id: salaryId })
    const [salaryData, setSalaryData] = useState<ISalaryGetById | null>(null)
    useEffect(() => {
        if (data) {
            setSalaryData(data.Data as ISalaryGetById)
        }
    }, [data])

    if (!open) return null

    return (
        <div>
            {isLoading && (
                <Box display='flex' justifyContent='center' alignItems='center' minHeight={200}>
                    <Loading />
                </Box>
            )}

            {isError && (
                <Box display='flex' justifyContent='center' alignItems='center' minHeight={200}>
                    <Typography color='error'>Failed to load salary data. Please try again.</Typography>
                </Box>
            )}

            {salaryData && !isLoading && !isError && (
                <EmployeeSalary {...salaryData} handleToggle={handleToggle} open={open} />
            )}
        </div>
    )
}

export default EmployeeSalaryModal
