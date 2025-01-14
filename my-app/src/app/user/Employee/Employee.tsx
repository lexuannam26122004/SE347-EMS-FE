import { Avatar, Box, Button, Typography } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { useRef, useEffect, useState } from 'react'
import ErrorPage from '@/app/user/requests/ErrorPage'
import { formatDate } from '@/utils/formatDate'
import { Download, AlertCircle, ChevronDown, ChevronUp } from 'lucide-react'

interface EmployeeProps {
    infoMe
}

const Employee: React.FC<EmployeeProps> = ({ infoMe }) => {
    const { t } = useTranslation('common')
    const [openErrorReport, setopenErrorReport] = useState(false)
    const prevOpen = useRef(open)
    useEffect(() => {
        prevOpen.current = open
    }, [open])

    const [openDetail, setOpenDetail] = useState(false)

    const handleIconClick = () => {
        setOpenDetail(!openDetail)
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
                        {t('COMMON.ATTENDANCE.DETAIL_EMPLOYEE')}
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
                        'https://localhost:44381/' + infoMe?.AvatarPath ||
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
                            {`${infoMe?.EmployeeId} ${infoMe?.FullName}`}
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
                            display: 'grid',
                            gridTemplateColumns: 'repeat(5, 1fr)',
                            gap: '20px',
                            alignItems: 'start',
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
                                {t('COMMON.EMPLOYEE.ROLES')}
                            </Typography>
                            <Typography
                                sx={{
                                    mt: '4px',
                                    color: 'var(--text-color)',
                                    fontSize: '17px'
                                }}
                            >
                                {infoMe?.Roles?.join(', ') || 'N/A'}
                            </Typography>
                        </Box>
                        <Box>
                            <Typography
                                sx={{
                                    color: 'var(--sub-title-color)',
                                    fontSize: '15px'
                                }}
                            >
                                {t('COMMON.EMPLOYEE.PHONENUMBER')}
                            </Typography>
                            <Typography
                                sx={{
                                    mt: '4px',
                                    color: 'var(--text-color)',
                                    fontSize: '17px'
                                }}
                            >
                                {infoMe?.PhoneNumber || 'N/A'}
                            </Typography>
                        </Box>

                        <Box>
                            <Typography
                                sx={{
                                    color: 'var(--sub-title-color)',
                                    fontSize: '15px'
                                }}
                            >
                                {t('COMMON.EMPLOYEE.BIRTHDAY')}
                            </Typography>
                            <Typography
                                sx={{
                                    mt: '4px',
                                    color: 'var(--text-color)',
                                    fontSize: '17px'
                                }}
                            >
                                {formatDate(infoMe?.Birthday) || 'N/A'}
                            </Typography>
                        </Box>
                        <Box>
                            <Typography
                                sx={{
                                    color: 'var(--sub-title-color)',
                                    fontSize: '15px'
                                }}
                            >
                                {t('COMMON.EMPLOYEE.DEPARTMENTNAME')}
                            </Typography>
                            <Typography
                                sx={{
                                    mt: '4px',
                                    color: 'var(--text-color)',
                                    fontSize: '17px'
                                }}
                            >
                                {infoMe?.DepartmentName || 'N/A'}
                            </Typography>
                        </Box>

                        <Box>
                            <Typography
                                sx={{
                                    color: 'var(--sub-title-color)',
                                    fontSize: '15px'
                                }}
                            >
                                {t('COMMON.EMPLOYEE.ADDRESS')}
                            </Typography>
                            <Typography
                                sx={{
                                    mt: '4px',
                                    color: 'var(--text-color)',
                                    fontSize: '17px'
                                }}
                            >
                                {infoMe?.Address || 'N/A'}
                            </Typography>
                        </Box>
                    </Box>

                    <Box
                        sx={{
                            mt: '20px',
                            gridTemplateColumns: 'repeat(5, 1fr)',
                            gap: '20px',
                            alignItems: 'start',
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
                                {t('COMMON.EMPLOYEE.USERNAME')}
                            </Typography>
                            <Typography
                                sx={{
                                    mt: '4px',
                                    color: 'var(--text-color)',
                                    fontSize: '17px'
                                }}
                            >
                                {infoMe?.UserName || 'N/A'}
                            </Typography>
                        </Box>

                        <Box>
                            <Typography
                                sx={{
                                    color: 'var(--sub-title-color)',
                                    fontSize: '15px'
                                }}
                            >
                                {t('COMMON.EMPLOYEE.GENDER')}
                            </Typography>
                            <Typography
                                sx={{
                                    mt: '4px',
                                    color: 'var(--text-color)',
                                    fontSize: '17px'
                                }}
                            >
                                {infoMe?.Gender === true ? 'Nam' : infoMe?.Gender === false ? 'Nữ' : 'Khác'}
                            </Typography>
                        </Box>

                        <Box>
                            <Typography
                                sx={{
                                    color: 'var(--sub-title-color)',
                                    fontSize: '15px'
                                }}
                            >
                                {t('COMMON.EMPLOYEE.STARTDATEWORK')}
                            </Typography>
                            <Typography
                                sx={{
                                    mt: '4px',
                                    color: 'var(--text-color)',
                                    fontSize: '17px'
                                }}
                            >
                                {formatDate(infoMe?.StartDateWork) || 'N/A'}
                            </Typography>
                        </Box>

                        <Box>
                            <Typography
                                sx={{
                                    color: 'var(--sub-title-color)',
                                    fontSize: '15px'
                                }}
                            >
                                {t('COMMON.EMPLOYEE.EMAIL')}
                            </Typography>
                            <Typography
                                sx={{
                                    mt: '4px',
                                    color: 'var(--text-color)',
                                    fontSize: '17px'
                                }}
                            >
                                {infoMe?.Email || 'N/A'}
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
                                {t('COMMON.EMPLOYEE.NOTE')}
                            </Typography>
                            <Typography
                                sx={{
                                    mt: '4px',
                                    color: 'var(--text-color)',
                                    fontSize: '17px'
                                }}
                            >
                                {infoMe?.Note || 'N/A'}
                            </Typography>
                        </Box>
                    </Box>
                </Box>
            </Box>

            <ErrorPage
                handleToggle={() => setopenErrorReport(false)}
                open={openErrorReport}
                infoMe={infoMe}
                type={'COMMON.SIDEBAR.EMPLOYEE'}
                typeId={infoMe?.EmployeeId}
            />
        </Box>
    )
}

export default Employee
