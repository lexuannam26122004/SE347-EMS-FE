'use client'

interface IGetAllErrorReport {
    Id: number | null
    ReportedBy: string | null
    ReportedDate: string | null
    Type: string | null
    TypeId: string | null
    Description: string | null
    Status: string | null
    ResolvedBy: string | null
    ResolvedDate: string | null
    ResolutionDetails: string | null
    ReportedFullName: string | null
    ReportedId: string | null
    ReportedAvatarPath: string | null
    ResolvedFullName: string | null
    ResolvedId: string | null
    ResolvedAvatarPath: string | null
}

import { formatDate } from '@/utils/formatDate'
import {
    Box,
    Divider,
    Modal,
    Paper,
    TableContainer,
    Table,
    Typography,
    TableRow,
    TableBody,
    TableCell
} from '@mui/material'
import { X } from 'lucide-react'
import { useTranslation } from 'react-i18next'

interface Props {
    open: boolean
    handleToggle: () => void
    configuration: IGetAllErrorReport
}

function DetailModal({ open, handleToggle, configuration }: Props) {
    const { t } = useTranslation('common')
    return (
        <Modal open={open} onClose={handleToggle}>
            <Paper
                elevation={0}
                sx={{
                    maxWidth: '60vw',
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    backgroundColor: 'var(--background-color)',
                    border: '1px solid var(--border-color)',
                    borderRadius: '15px',
                    overflow: 'hidden',
                    transform: 'translate(-50%, -50%)'
                }}
            >
                <Box
                    sx={{
                        paddingBlock: 1.6,
                        paddingInline: 9,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        zIndex: '1',
                        position: 'relative'
                    }}
                >
                    <Typography
                        variant='h6'
                        sx={{
                            fontWeight: 'Bold',
                            fontSize: '18px',
                            textAlign: 'center',
                            margin: 'auto',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                            color: 'var(--text-color)'
                        }}
                    >
                        {t('COMMON.BUTTON.VIEW_DETAIL')}
                    </Typography>
                    <Box
                        sx={{
                            position: 'absolute',
                            right: '16px',
                            top: '8px',
                            cursor: 'pointer',
                            backgroundColor: 'var(--background-color)',
                            padding: '5px',
                            borderRadius: '50%',
                            border: '1px solid var(--border-color)',
                            '&:hover': {
                                backgroundColor: 'var(--hover-color)',
                                borderColor: 'var(--hover-color)'
                            }
                        }}
                        onClick={handleToggle}
                    >
                        <X style={{ color: 'var(--text-color)' }} />
                    </Box>
                </Box>
                <Divider sx={{ zIndex: '1', borderColor: 'var(--border-color)' }} />

                <TableContainer
                    sx={{
                        padding: '20px 17px 20px 24px',
                        maxHeight: '80vh',
                        scrollbarGutter: 'stable',
                        '&::-webkit-scrollbar': {
                            width: '7px',
                            height: '7px',
                            backgroundColor: 'var(--background-after-color)'
                        },
                        '&::-webkit-scrollbar-thumb': {
                            backgroundColor: 'var(--scrollbar-color)',
                            borderRadius: '10px'
                        },
                        overflow: 'auto',
                        '&::-webkit-scrollbar-corner': {
                            borderRadius: '10px'
                        }
                    }}
                >
                    <Table>
                        <TableBody>
                            {[
                                {
                                    label: t('COMMON.ERROR_REPORT.TYPE'),
                                    value: t(String(configuration?.Type)) || 'N/A'
                                },
                                {
                                    label: t('COMMON.ERROR_REPORT.REPORTED_DATE'),
                                    value: formatDate(configuration?.ReportedDate?.toString()) || 'N/A'
                                },
                                {
                                    label: t('COMMON.ERROR_REPORT.DESCRIPTION'),
                                    value: configuration?.Description || 'N/A'
                                },
                                {
                                    label: t('COMMON.ERROR_REPORT.STATUS'),
                                    value:
                                        configuration?.Status === '1'
                                            ? 'In Progress'
                                            : configuration?.Status === '2'
                                            ? 'Resolved'
                                            : configuration?.Status === '3'
                                            ? 'Rejected'
                                            : 'Pending'
                                },
                                {
                                    label: t('COMMON.ERROR_REPORT.FULL_NAME_RESOLVED'),
                                    value: `${configuration?.ResolvedId ?? 'N/A'}  ${
                                        configuration?.ResolvedFullName ?? 'N/A'
                                    }`
                                },
                                {
                                    label: t('COMMON.ERROR_REPORT.RESOLVED_DATE'),
                                    value: formatDate(configuration?.ResolvedDate?.toString()) || 'N/A'
                                },
                                {
                                    label: t('COMMON.ERROR_REPORT.RESOLUTION_DETAILS'),
                                    value: configuration?.ResolutionDetails || 'N/A'
                                }
                            ].map((item, index) => (
                                <TableRow key={index}>
                                    <TableCell
                                        sx={{
                                            fontSize: '16px',
                                            fontWeight: 'bold',
                                            whiteSpace: 'nowrap',
                                            color: 'var(--text-color)',
                                            borderBottom: 'none',
                                            padding: '8px'
                                        }}
                                    >
                                        {item.label}:
                                    </TableCell>
                                    <TableCell
                                        sx={{
                                            color: 'var(--text-color)',
                                            fontSize: '16px',
                                            borderBottom: 'none',
                                            padding: '8px'
                                        }}
                                    >
                                        {item.value}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>
        </Modal>
    )
}

export default DetailModal
