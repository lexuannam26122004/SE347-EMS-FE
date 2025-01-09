'use client'
import { Box, Paper, TableCell, TableBody, Table, TableRow, TableContainer, Typography } from '@mui/material'
import React from 'react'

export default function Payslip() {
    return (
        <Box>
            <Paper
                sx={{
                    backgroundColor: 'var(--background-color)'
                }}
            >
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        marginLeft: '10px',
                        marginRight: '10px',
                        backgroundColor: 'var(--background-color)'
                    }}
                >
                    <Typography sx={{ marginLeft: '20px', marginTop: '15px', color: 'var(--text-color)' }}>
                        NPM System
                    </Typography>
                    <Typography
                        sx={{ marginLeft: 'auto', marginRight: '20px', marginTop: '15px' }}
                        color='var(--text-color)'
                    >
                        Mã số: BL....
                    </Typography>
                </Box>
                <Typography
                    textAlign='center'
                    fontWeight={'bold'}
                    style={{ marginTop: '30px', fontSize: '24px' }}
                    color='var(--text-color)'
                >
                    Phiếu lương nhân viên
                </Typography>

                <Typography textAlign='center' style={{ marginTop: '15px' }} color='var(--text-color)'>
                    Tháng ..... năm ....
                </Typography>

                <Box sx={{ padding: '20px' }}>
                    <TableContainer>
                        <Table>
                            <TableBody>
                                {/* Thông tin nhân viên */}
                                <TableRow>
                                    <TableCell sx={{ borderColor: 'var(--border-color)' }}>
                                        <Typography
                                            sx={{
                                                color: 'var(--text-color)',
                                                maxWidth: '400px',
                                                fontSize: '16px',
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis',
                                                whiteSpace: 'nowrap'
                                            }}
                                        >
                                            Họ tên
                                        </Typography>
                                    </TableCell>
                                    <TableCell sx={{ borderColor: 'var(--border-color)' }}>
                                        <Typography
                                            sx={{
                                                color: 'var(--text-color)',
                                                maxWidth: '400px',
                                                fontSize: '16px',
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis',
                                                whiteSpace: 'nowrap'
                                            }}
                                        >
                                            ...............................................
                                        </Typography>
                                    </TableCell>
                                    <TableCell sx={{ borderColor: 'var(--border-color)' }}>
                                        <Typography
                                            sx={{
                                                color: 'var(--text-color)',
                                                maxWidth: '400px',
                                                fontSize: '16px',
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis',
                                                whiteSpace: 'nowrap'
                                            }}
                                        >
                                            Mã số nhân viên
                                        </Typography>
                                    </TableCell>
                                    <TableCell sx={{ borderColor: 'var(--border-color)' }}>
                                        <Typography
                                            sx={{
                                                color: 'var(--text-color)',
                                                maxWidth: '400px',
                                                fontSize: '16px',
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis',
                                                whiteSpace: 'nowrap'
                                            }}
                                        >
                                            ...............................................
                                        </Typography>
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell sx={{ borderColor: 'var(--border-color)' }}>
                                        {' '}
                                        <Typography
                                            sx={{
                                                color: 'var(--text-color)',
                                                maxWidth: '400px',
                                                fontSize: '16px',
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis',
                                                whiteSpace: 'nowrap'
                                            }}
                                        >
                                            Phòng ban
                                        </Typography>
                                    </TableCell>
                                    <TableCell sx={{ borderColor: 'var(--border-color)' }}>
                                        {' '}
                                        <Typography
                                            sx={{
                                                color: 'var(--text-color)',
                                                maxWidth: '400px',
                                                fontSize: '16px',
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis',
                                                whiteSpace: 'nowrap'
                                            }}
                                        >
                                            ...............................................
                                        </Typography>
                                    </TableCell>
                                    <TableCell sx={{ borderColor: 'var(--border-color)' }}>
                                        {' '}
                                        <Typography
                                            sx={{
                                                color: 'var(--text-color)',
                                                maxWidth: '400px',
                                                fontSize: '16px',
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis',
                                                whiteSpace: 'nowrap'
                                            }}
                                        >
                                            Số ngày công
                                        </Typography>
                                    </TableCell>
                                    <TableCell sx={{ borderColor: 'var(--border-color)' }}>
                                        {' '}
                                        <Typography
                                            sx={{
                                                color: 'var(--text-color)',
                                                maxWidth: '400px',
                                                fontSize: '16px',
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis',
                                                whiteSpace: 'nowrap'
                                            }}
                                        >
                                            ...............................................
                                        </Typography>
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell sx={{ borderColor: 'var(--border-color)' }}>
                                        {' '}
                                        <Typography
                                            sx={{
                                                color: 'var(--text-color)',
                                                maxWidth: '400px',
                                                fontSize: '16px',
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis',
                                                whiteSpace: 'nowrap'
                                            }}
                                        >
                                            Số ngày đi trễ
                                        </Typography>
                                    </TableCell>
                                    <TableCell sx={{ borderColor: 'var(--border-color)' }}>
                                        {' '}
                                        <Typography
                                            sx={{
                                                color: 'var(--text-color)',
                                                maxWidth: '400px',
                                                fontSize: '16px',
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis',
                                                whiteSpace: 'nowrap'
                                            }}
                                        >
                                            ...............................................
                                        </Typography>
                                    </TableCell>
                                    <TableCell sx={{ borderColor: 'var(--border-color)' }}>
                                        {' '}
                                        <Typography
                                            sx={{
                                                color: 'var(--text-color)',
                                                maxWidth: '400px',
                                                fontSize: '16px',
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis',
                                                whiteSpace: 'nowrap'
                                            }}
                                        >
                                            Ngày nghỉ có phép
                                        </Typography>
                                    </TableCell>
                                    <TableCell sx={{ borderColor: 'var(--border-color)' }}>
                                        {' '}
                                        <Typography
                                            sx={{
                                                color: 'var(--text-color)',
                                                maxWidth: '400px',
                                                fontSize: '16px',
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis',
                                                whiteSpace: 'nowrap'
                                            }}
                                        >
                                            ...............................................
                                        </Typography>
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell sx={{ borderColor: 'var(--border-color)' }}>
                                        {' '}
                                        <Typography
                                            sx={{
                                                color: 'var(--text-color)',
                                                maxWidth: '400px',
                                                fontSize: '16px',
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis',
                                                whiteSpace: 'nowrap'
                                            }}
                                        >
                                            Ngày nghỉ không phép
                                        </Typography>
                                    </TableCell>
                                    <TableCell sx={{ borderColor: 'var(--border-color)' }}>
                                        {' '}
                                        <Typography
                                            sx={{
                                                color: 'var(--text-color)',
                                                maxWidth: '400px',
                                                fontSize: '16px',
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis',
                                                whiteSpace: 'nowrap'
                                            }}
                                        >
                                            ...............................................
                                        </Typography>
                                    </TableCell>
                                </TableRow>

                                {/* Các khoản thu nhập */}
                                <TableRow>
                                    <TableCell sx={{ borderColor: 'var(--border-color)' }} colSpan={4}>
                                        <Typography fontWeight='bold'>
                                            {' '}
                                            <Typography
                                                sx={{
                                                    color: 'var(--text-color)',
                                                    maxWidth: '400px',
                                                    fontSize: '20px',
                                                    overflow: 'hidden',
                                                    textOverflow: 'ellipsis',
                                                    whiteSpace: 'nowrap',
                                                    fontWeight: 'bold'
                                                }}
                                            >
                                                Các khoản thu nhập
                                            </Typography>
                                        </Typography>
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell sx={{ borderColor: 'var(--border-color)' }}>
                                        {' '}
                                        <Typography
                                            sx={{
                                                color: 'var(--text-color)',
                                                maxWidth: '400px',
                                                fontSize: '16px',
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis',
                                                whiteSpace: 'nowrap'
                                            }}
                                        >
                                            Lương cơ bản
                                        </Typography>
                                    </TableCell>
                                    <TableCell sx={{ borderColor: 'var(--border-color)' }}>
                                        {' '}
                                        <Typography
                                            sx={{
                                                color: 'var(--text-color)',
                                                maxWidth: '400px',
                                                fontSize: '16px',
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis',
                                                whiteSpace: 'nowrap'
                                            }}
                                        >
                                            ...............................................
                                        </Typography>
                                    </TableCell>
                                    <TableCell sx={{ borderColor: 'var(--border-color)' }}>
                                        {' '}
                                        <Typography
                                            sx={{
                                                color: 'var(--text-color)',
                                                maxWidth: '400px',
                                                fontSize: '16px',
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis',
                                                whiteSpace: 'nowrap'
                                            }}
                                        >
                                            Hệ số
                                        </Typography>
                                    </TableCell>
                                    <TableCell sx={{ borderColor: 'var(--border-color)' }}>
                                        {' '}
                                        <Typography
                                            sx={{
                                                color: 'var(--text-color)',
                                                maxWidth: '400px',
                                                fontSize: '16px',
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis',
                                                whiteSpace: 'nowrap'
                                            }}
                                        >
                                            ...............................................
                                        </Typography>
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell sx={{ borderColor: 'var(--border-color)' }}>
                                        {' '}
                                        <Typography
                                            sx={{
                                                color: 'var(--text-color)',
                                                maxWidth: '400px',
                                                fontSize: '16px',
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis',
                                                whiteSpace: 'nowrap'
                                            }}
                                        >
                                            Lương làm thêm giờ
                                        </Typography>
                                    </TableCell>
                                    <TableCell sx={{ borderColor: 'var(--border-color)' }}>
                                        {' '}
                                        <Typography
                                            sx={{
                                                color: 'var(--text-color)',
                                                maxWidth: '400px',
                                                fontSize: '16px',
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis',
                                                whiteSpace: 'nowrap'
                                            }}
                                        >
                                            ...............................................
                                        </Typography>
                                    </TableCell>
                                    <TableCell sx={{ borderColor: 'var(--border-color)' }}>
                                        {' '}
                                        <Typography
                                            sx={{
                                                color: 'var(--text-color)',
                                                maxWidth: '400px',
                                                fontSize: '16px',
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis',
                                                whiteSpace: 'nowrap'
                                            }}
                                        >
                                            Phụ cấp
                                        </Typography>
                                    </TableCell>
                                    <TableCell sx={{ borderColor: 'var(--border-color)' }}>
                                        {' '}
                                        <Typography
                                            sx={{
                                                color: 'var(--text-color)',
                                                maxWidth: '400px',
                                                fontSize: '16px',
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis',
                                                whiteSpace: 'nowrap'
                                            }}
                                        >
                                            ...............................................
                                        </Typography>
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell sx={{ borderColor: 'var(--border-color)' }}>
                                        {' '}
                                        <Typography
                                            sx={{
                                                color: 'var(--text-color)',
                                                maxWidth: '400px',
                                                fontSize: '16px',
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis',
                                                whiteSpace: 'nowrap'
                                            }}
                                        >
                                            Thưởng
                                        </Typography>
                                    </TableCell>
                                    <TableCell sx={{ borderColor: 'var(--border-color)' }}>
                                        {' '}
                                        <Typography
                                            sx={{
                                                color: 'var(--text-color)',
                                                maxWidth: '400px',
                                                fontSize: '16px',
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis',
                                                whiteSpace: 'nowrap'
                                            }}
                                        >
                                            ...............................................
                                        </Typography>
                                    </TableCell>
                                    <TableCell sx={{ borderColor: 'var(--border-color)' }} colSpan={2}></TableCell>
                                </TableRow>

                                {/* Các khoản khấu trừ */}
                                <TableRow>
                                    <TableCell colSpan={4} sx={{ borderColor: 'var(--border-color)' }}>
                                        <Typography fontWeight='bold'>
                                            {' '}
                                            <Typography
                                                sx={{
                                                    color: 'var(--text-color)',
                                                    maxWidth: '400px',
                                                    fontSize: '20px',
                                                    overflow: 'hidden',
                                                    textOverflow: 'ellipsis',
                                                    whiteSpace: 'nowrap',
                                                    fontWeight: 'bold'
                                                }}
                                            >
                                                {' '}
                                                Các khoản khấu trừ
                                            </Typography>
                                        </Typography>
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell sx={{ borderColor: 'var(--border-color)' }}>
                                        {' '}
                                        <Typography
                                            sx={{
                                                color: 'var(--text-color)',
                                                maxWidth: '400px',
                                                fontSize: '16px',
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis',
                                                whiteSpace: 'nowrap'
                                            }}
                                        >
                                            Bảo hiểm y tế
                                        </Typography>
                                    </TableCell>
                                    <TableCell sx={{ borderColor: 'var(--border-color)' }}>
                                        {' '}
                                        <Typography
                                            sx={{
                                                color: 'var(--text-color)',
                                                maxWidth: '400px',
                                                fontSize: '16px',
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis',
                                                whiteSpace: 'nowrap'
                                            }}
                                        >
                                            ...............................................
                                        </Typography>
                                    </TableCell>
                                    <TableCell sx={{ borderColor: 'var(--border-color)' }}>
                                        {' '}
                                        <Typography
                                            sx={{
                                                color: 'var(--text-color)',
                                                maxWidth: '400px',
                                                fontSize: '16px',
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis',
                                                whiteSpace: 'nowrap'
                                            }}
                                        >
                                            Bảo hiểm xã hội
                                        </Typography>
                                    </TableCell>
                                    <TableCell sx={{ borderColor: 'var(--border-color)' }}>
                                        {' '}
                                        <Typography
                                            sx={{
                                                color: 'var(--text-color)',
                                                maxWidth: '400px',
                                                fontSize: '16px',
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis',
                                                whiteSpace: 'nowrap'
                                            }}
                                        >
                                            ...............................................
                                        </Typography>
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell sx={{ borderColor: 'var(--border-color)' }}>
                                        {' '}
                                        <Typography
                                            sx={{
                                                color: 'var(--text-color)',
                                                maxWidth: '400px',
                                                fontSize: '16px',
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis',
                                                whiteSpace: 'nowrap'
                                            }}
                                        >
                                            Thuế
                                        </Typography>
                                    </TableCell>
                                    <TableCell sx={{ borderColor: 'var(--border-color)' }}>
                                        {' '}
                                        <Typography
                                            sx={{
                                                color: 'var(--text-color)',
                                                maxWidth: '400px',
                                                fontSize: '16px',
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis',
                                                whiteSpace: 'nowrap'
                                            }}
                                        >
                                            ...............................................
                                        </Typography>
                                    </TableCell>
                                    <TableCell sx={{ borderColor: 'var(--border-color)' }} colSpan={2}></TableCell>
                                </TableRow>

                                {/* Tổng cộng */}
                                <TableRow>
                                    <TableCell
                                        colSpan={1}
                                        sx={{ fontWeight: 'bold', borderColor: 'var(--border-color)' }}
                                    >
                                        {' '}
                                        <Typography
                                            sx={{
                                                color: 'var(--text-color)',
                                                maxWidth: '400px',
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
                                        {' '}
                                        <Typography
                                            sx={{
                                                color: 'var(--text-color)',
                                                maxWidth: '400px',
                                                fontSize: '16px',
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis',
                                                whiteSpace: 'nowrap'
                                            }}
                                        >
                                            ...............................................
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
                            ...............................................
                        </Typography>
                    </Box>

                    {/* Chữ ký */}
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
                        <Typography color='var(--text-color)'>Người làm phiếu</Typography>
                        <Typography color='var(--text-color)'> Người nhận tiền</Typography>
                        <Typography color='var(--text-color)'>Thủ quỹ</Typography>
                        <Typography color='var(--text-color)'>Kế toán trưởng</Typography>
                        <Typography color='var(--text-color)'>Giám đốc</Typography>
                    </Box>
                </Box>
            </Paper>
        </Box>
    )
}
