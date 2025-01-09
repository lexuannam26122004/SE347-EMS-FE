import { useTranslation } from 'react-i18next'
import { Paper, Typography } from '@mui/material'
import { Box } from '@mui/material'
import { UserRoundSearch, CircleUserRound } from 'lucide-react'
import { useGetAllDepartmentQuery } from '@/services/DepartmentService'
import { IDepartmentGetAll } from '@/models/Department'
import { IFilterSysConfiguration } from '@/models/SysConfiguration'
import { useEffect, useState } from 'react'

function DepartmentInfo() {
    const { t } = useTranslation('common')
    const [filter, setFilter] = useState<IFilterSysConfiguration>({
        isDescending: false
    })
    useEffect(() => {}, [setFilter])

    const { data: department } = useGetAllDepartmentQuery(filter)
    const departmentDataRecord = (department?.Data?.Records as IDepartmentGetAll[]) || []
    //const departmentDataTotalRecord = (department?.Data?.TotalRecords as IDepartmentGetAll[]) || []

    const departmentStyles: { [key: number]: { backgroundImage: string; color: string } } = {
        1: {
            backgroundImage: 'linear-gradient(135deg, rgb(147, 155, 163), #34495e)',
            color: 'rgb(255,255,255)'
        },
        2: {
            backgroundImage: 'linear-gradient(135deg, rgb(255, 100, 100), rgb(255, 150, 150))',
            color: '#000000'
        },
        3: {
            backgroundImage: 'linear-gradient(135deg, rgb(34, 193, 195), rgb(253, 187, 45))',
            color: 'rgb(66, 26, 226)'
        },
        4: {
            backgroundImage: 'linear-gradient(135deg, rgb(100, 200, 255), rgb(50, 150, 255))',
            color: 'rgb(255, 221, 0)'
        },
        5: {
            backgroundImage: 'linear-gradient(135deg, rgb(255, 204, 255), rgb(255, 102, 204))',
            color: '#8A2BE2'
        },
        6: {
            backgroundImage: 'linear-gradient(135deg, rgb(255, 223, 186), rgb(255, 165, 0))',
            color: 'rgb(159, 16, 231)'
        },
        7: {
            backgroundImage: 'linear-gradient(135deg, rgb(93, 109, 126), rgb(48, 63, 77))',
            color: 'rgb(226, 212, 222)'
        },
        8: {
            backgroundImage: 'linear-gradient(135deg, rgb(204, 255, 204), rgb(0, 204, 102))',
            color: '#32CD32'
        },
        9: {
            backgroundImage: 'linear-gradient(135deg, rgb(252, 85, 85), rgb(255, 112, 67))',
            color: '#DC143C'
        },
        10: {
            backgroundImage: 'linear-gradient(135deg, rgb(72, 61, 139), rgb(255, 99, 71))',
            color: '#800080'
        },
        11: {
            backgroundImage: 'linear-gradient(135deg, rgb(72, 61, 139), rgb(255, 99, 71))',
            color: '#800080'
        }
    }
    return (
        <Box
            sx={{
                display: 'flex',
                justifyContent: 'flex-start',
                alignItems: 'center',
                gap: '24px',
                overflow: 'auto',
                '&::-webkit-scrollbar': {
                    width: '10px',
                    height: '10px',
                    backgroundColor: 'var(--background-after-color)'
                },
                '&::-webkit-scrollbar-thumb': {
                    backgroundColor: 'var(--scrollbar-color)',
                    borderRadius: '10px'
                },
                backgroundColor: 'var(--background-after-color)'
            }}
        >
            {departmentDataRecord.map(department => {
                const departmentStyle = departmentStyles[department.Id] || {
                    backgroundImage: 'linear-gradient(135deg, rgb(147, 155, 163), #34495e)',
                    color: '#FFFFFF'
                }
                return (
                    <Paper
                        key={department.Id}
                        elevation={0}
                        sx={{
                            backgroundImage: departmentStyle.backgroundImage,
                            backgroundSize: 'cover',
                            flexShrink: 0,
                            backgroundRepeat: 'no-repeat',
                            backgroundPosition: 'center',
                            borderRadius: '15px',
                            padding: '20px 22px',
                            width: '500px'
                        }}
                    >
                        <Box
                            sx={{
                                display: 'flex',
                                flexDirection: 'row',
                                justifyContent: 'flex-start',
                                alignItems: 'center',
                                position: 'relative',
                                gap: '5px'
                            }}
                        >
                            <Box
                                sx={{
                                    width: '50px',
                                    height: '50px',
                                    borderRadius: '50%',
                                    overflow: 'hidden'
                                }}
                            >
                                <img
                                    src='/images/workforce.png'
                                    alt='Logo'
                                    style={{
                                        width: '100%',
                                        height: '100%',
                                        objectFit: 'cover'
                                    }}
                                />
                            </Box>
                            <Box>
                                <Typography
                                    sx={{
                                        color: departmentStyle.color || '#FFFFFF',
                                        fontWeight: 'bold',
                                        fontSize: '30px'
                                    }}
                                >
                                    {t(department.Name)}
                                </Typography>
                                <Box
                                    sx={{
                                        display: 'flex',
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        gap: '5px'
                                    }}
                                >
                                    <Box
                                        sx={{
                                            display: 'flex',
                                            flexDirection: 'row',
                                            alignItems: 'center',
                                            backgroundImage: 'linear-gradient(135deg,rgb(75, 77, 68),rgb(48, 55, 61))',
                                            borderRadius: '15px',
                                            padding: '8px 12px',
                                            gap: '5px'
                                        }}
                                    >
                                        <Box sx={{ fontSize: '10px', color: '#C6E2FF', display: 'flex' }}>
                                            <UserRoundSearch />
                                        </Box>
                                        <Typography
                                            sx={{
                                                color: '#C6E2FF',
                                                fontWeight: 'bold',
                                                fontSize: '10px'
                                            }}
                                        >
                                            {t(department.DepartmentHeadId || 'N/A')}
                                        </Typography>
                                    </Box>
                                    <Box
                                        sx={{
                                            display: 'flex',
                                            flexDirection: 'row',
                                            alignItems: 'center',
                                            backgroundImage: 'linear-gradient(135deg,rgb(75, 77, 68),rgb(48, 55, 61))',
                                            borderRadius: '15px',
                                            padding: '8px 12px',
                                            gap: '5px'
                                        }}
                                    >
                                        <Box sx={{ fontSize: '10px', color: '#C6E2FF', display: 'flex' }}>
                                            <CircleUserRound />
                                        </Box>
                                        <Typography
                                            sx={{
                                                color: '#C6E2FF',
                                                fontWeight: 'bold',
                                                fontSize: '10px'
                                            }}
                                        >
                                            {t(department.DepartmentHeadName || 'N/A')}
                                        </Typography>
                                    </Box>
                                </Box>
                            </Box>
                        </Box>

                        <Box
                            sx={{
                                mt: '10px',
                                color: departmentStyle.color || '#FFFFFF',
                                fontSize: '30px',
                                fontWeight: 'bold',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '1px'
                            }}
                        >
                            {department.CountDepartment}
                            <Typography
                                sx={{
                                    ml: '6px',
                                    color: departmentStyle.color || '#C6E2FF',
                                    fontSize: '16px',
                                    mt: '7px'
                                }}
                            >
                                {t('Thành viên')}
                            </Typography>
                        </Box>
                    </Paper>
                )
            })}
        </Box>
    )
}

export default DepartmentInfo
