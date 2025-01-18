import { Avatar, Box, Button, Typography } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { useRef, useEffect, useState } from 'react'
import ErrorPage from '@/app/user/requests/ErrorPage'
import { Download, AlertCircle, ChevronDown, ChevronUp } from 'lucide-react'

import { useSearchUserQuery, useExportContractPdfQuery } from '@/services/UserEmploymentContractService'

import { formatDate } from '@/utils/formatDate'

import Loading from '@/components/Loading'

interface ContractProps {
    infoMe
}

const Contract: React.FC<ContractProps> = ({ infoMe }) => {
    const { t } = useTranslation('common')
    const [openErrorReport, setopenErrorReport] = useState(false)

    const { data: contractResponse, isFetching, isLoading } = useSearchUserQuery()

    const { data, isLoading: isLoadingExport } = useExportContractPdfQuery()

    const handleDownload = () => {
        
        if (data) {
            const url = window.URL.createObjectURL(new Blob([data]))
            const link = document.createElement('a')
            link.href = url
            link.setAttribute('download', 'Employment_Contract.pdf')

            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)

            window.URL.revokeObjectURL(url)
        } else {
            console.error('No data available for download')
        }
    }

    const contract = contractResponse?.Data

    const [openDetail, setOpenDetail] = useState(false)

    const handleIconClick = () => {
        setOpenDetail(!openDetail)
    }

    const prevOpen = useRef(open)
    useEffect(() => {
        prevOpen.current = open
    }, [open])

    if (isLoading || !contract || isFetching || isLoadingExport) {
        return <Loading />
    }

    return (
        <Box
            sx={{
                width: '100%',
                boxShadow: 'var(--box-shadow-paper)',
                borderRadius: '30px',
                padding: '35px',
                backgroundColor: 'var(--attendance-bg1)'
            }}
        >
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'space-between'
                }}
            >
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        mb: '35px'
                    }}
                >
                    <Box
                        sx={{
                            width: '5px',
                            height: '42px',
                            backgroundColor: '#4effca',
                            borderRadius: '4px',
                            mr: '14px'
                        }}
                    />
                    <Typography
                        sx={{
                            color: 'var(--text-color)',
                            fontSize: '21px',
                            fontWeight: 'bold'
                        }}
                    >
                        {t('Thông tin chi tiết hợp đồng')}
                    </Typography>
                </Box>

                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '18px'
                    }}
                >
                    <Button
                        sx={{
                            padding: '8px 12px',
                            borderRadius: '8px',
                            height: '41.5px',
                            mb: 'auto',
                            fontWeight: 'bold',
                            display: 'flex',
                            gap: '10px',
                            color: '#040506',
                            backgroundColor: '#4effca',
                            textTransform: 'none',
                            justifyContent: 'center',
                            alignItems: 'center'
                        }}
                        onClick={handleDownload}
                    >
                        <Download size={20} />
                        {t('COMMON.ATTENDANCE.DOWNLOAD_INFO')}
                    </Button>

                    <Button
                        sx={{
                            padding: '8px 12px',
                            borderRadius: '8px',
                            height: '41.5px',
                            mb: 'auto',
                            fontWeight: 'bold',
                            display: 'flex',
                            gap: '10px',
                            color: '#040506',
                            backgroundColor: '#ff4e4e',
                            textTransform: 'none',
                            justifyContent: 'center',
                            alignItems: 'center'
                        }}
                        onClick={() => setopenErrorReport(true)}
                    >
                        <AlertCircle size={20} />
                        {t('COMMON.ATTENDANCE.ERROR_REPORT')}
                    </Button>
                </Box>
            </Box>

            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '40px'
                }}
            >
                <Avatar
                    src={
                        contract?.ManagerAvatarPath ||
                        'https://localhost:44381/avatars/aa1678f0-75b0-48d2-ae98-50871178e9bd.jfif'
                    }
                    sx={{
                        width: '120px',
                        height: '120px'
                    }}
                />

                <Box sx={{ width: '100%' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                        <Typography
                            sx={{
                                fontSize: '20px',
                                fontWeight: 'bold',
                                color: 'var(--text-color)',
                                flexGrow: 1
                            }}
                        >
                            {'Người phụ trách : ' + `${contract?.ManagerEmployeeId} ${contract?.ManagerFullName}`}
                        </Typography>
                        <Box
                            sx={{
                                width: '40px',
                                height: '40px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                border: '1px solid var(--border-color)',
                                borderRadius: '50%',
                                padding: '5px'
                            }}
                            onClick={handleIconClick}
                        >
                            {openDetail ? (
                                <ChevronUp style={{ fontSize: '24px' }} />
                            ) : (
                                <ChevronDown style={{ fontSize: '24px' }} />
                            )}
                        </Box>
                    </Box>

                    <Box
                        sx={{
                            mt: '20px',
                            display: 'flex',
                            gap: '45px',
                            alignItems: 'center',
                            width: '100%'
                        }}
                    >
                        <Box>
                            <Typography
                                sx={{
                                    color: 'var(--sub-title-color)',
                                    fontSize: '15px'
                                }}
                            >
                                {t(`COMMON.CONTRACT.CONTRACTNAME`)}
                            </Typography>
                            <Typography
                                sx={{
                                    mt: '4px',
                                    color: 'var(--text-color)',
                                    fontSize: '17px'
                                }}
                            >
                                {contract?.ContractName}
                            </Typography>
                        </Box>
                        <Box>
                            <Typography
                                sx={{
                                    color: 'var(--sub-title-color)',
                                    fontSize: '15px'
                                }}
                            >
                                {t(`COMMON.CONTRACT.STARTDATE`)}
                            </Typography>
                            <Typography
                                sx={{
                                    mt: '4px',
                                    color: 'var(--text-color)',
                                    fontSize: '17px'
                                }}
                            >
                                {formatDate(contract?.StartDate?.toString())}
                            </Typography>
                        </Box>
                        <Box>
                            <Typography
                                sx={{
                                    color: 'var(--sub-title-color)',
                                    fontSize: '15px'
                                }}
                            >
                                {t(`COMMON.CONTRACT.ENDDATE`)}
                            </Typography>
                            <Typography
                                sx={{
                                    mt: '4px',
                                    color: 'var(--text-color)',
                                    fontSize: '17px'
                                }}
                            >
                                {formatDate(contract?.EndDate?.toString())}
                            </Typography>
                        </Box>
                        <Box>
                            <Typography
                                sx={{
                                    color: 'var(--sub-title-color)',
                                    fontSize: '15px'
                                }}
                            >
                                {t(`COMMON.CONTRACT.BASICSALARY`)}
                            </Typography>
                            <Typography
                                sx={{
                                    mt: '4px',
                                    color: 'var(--text-color)',
                                    fontSize: '17px'
                                }}
                            >
                                {contract?.BasicSalary}
                            </Typography>
                        </Box>
                        <Box>
                            <Typography
                                sx={{
                                    color: 'var(--sub-title-color)',
                                    fontSize: '15px'
                                }}
                            >
                                {t(`COMMON.CONTRACT.WORKINGHOURS`)}
                            </Typography>
                            <Typography
                                sx={{
                                    mt: '4px',
                                    color: 'var(--text-color)',
                                    fontSize: '17px'
                                }}
                            >
                                {contract?.WorkingHours}
                            </Typography>
                        </Box>
                        <Box>
                            <Typography
                                sx={{
                                    color: 'var(--sub-title-color)',
                                    fontSize: '15px'
                                }}
                            >
                                {t(`COMMON.CONTRACT.PROBATIONPERIOD`)}
                            </Typography>
                            <Typography
                                sx={{
                                    mt: '4px',
                                    color: 'var(--text-color)',
                                    fontSize: '17px'
                                }}
                            >
                                {contract?.ProbationPeriod}
                            </Typography>
                        </Box>
                        <Box>
                            <Typography
                                sx={{
                                    color: 'var(--sub-title-color)',
                                    fontSize: '15px'
                                }}
                            >
                                {t(`COMMON.CONTRACT.TYPECONTRACT`)}
                            </Typography>
                            <Typography
                                sx={{
                                    mt: '4px',
                                    color: 'var(--text-color)',
                                    fontSize: '17px'
                                }}
                            >
                                {contract?.TypeContract}
                            </Typography>
                        </Box>
                    </Box>

                    <Box
                        sx={{
                            mt: '20px',
                            gap: '45px',
                            alignItems: 'center',
                            display: openDetail ? 'grid' : 'none',
                            width: '100%'
                        }}
                    >
                        <Box>
                            <Typography
                                sx={{
                                    color: 'var(--sub-title-color)',
                                    fontSize: '15px'
                                }}
                            >
                                {t(`COMMON.CONTRACT.CLAUSE`)}
                            </Typography>
                            <Typography
                                sx={{
                                    mt: '4px',
                                    color: 'var(--text-color)',
                                    fontSize: '17px'
                                }}
                            >
                                {contract?.Clause || 'N/A'}
                            </Typography>
                        </Box>
                    </Box>

                    <Box
                        sx={{
                            mt: '20px',
                            gap: '45px',
                            alignItems: 'center',
                            display: openDetail ? 'grid' : 'none',
                            width: '100%'
                        }}
                    >
                        <Box>
                            <Typography
                                sx={{
                                    color: 'var(--sub-title-color)',
                                    fontSize: '15px'
                                }}
                            >
                                {t(`COMMON.CONTRACT.TERMINATIONCLAUSE`)}
                            </Typography>
                            <Typography
                                sx={{
                                    mt: '4px',
                                    color: 'var(--text-color)',
                                    fontSize: '17px'
                                }}
                            >
                                {contract?.TerminationClause || 'N/A'}
                            </Typography>
                        </Box>
                    </Box>

                    <Box
                        sx={{
                            mt: '20px',
                            gap: '45px',
                            alignItems: 'center',
                            display: openDetail ? 'grid' : 'none',
                            width: '100%'
                        }}
                    >
                        <Box>
                            <Typography
                                sx={{
                                    color: 'var(--sub-title-color)',
                                    fontSize: '15px'
                                }}
                            >
                                {t(`COMMON.CONTRACT.APPENDIX`)}
                            </Typography>
                            <Typography
                                sx={{
                                    mt: '4px',
                                    color: 'var(--text-color)',
                                    fontSize: '17px'
                                }}
                            >
                                {contract?.Appendix || 'N/A'}
                            </Typography>
                        </Box>
                    </Box>
                </Box>
            </Box>

            <ErrorPage
                handleToggle={() => setopenErrorReport(false)}
                open={openErrorReport}
                infoMe={infoMe}
                type={'COMMON.SIDEBAR.CONTRACT'}
                typeId={contract?.Id}
            />
        </Box>
    )
}

export default Contract
