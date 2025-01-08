'use client'
import {
    Box,
    //Select,
    //Pagination,
    Typography,
    //MenuItem,
    //SelectChangeEvent,
    Paper,
    // InputLabel,
    // FormControl,
    //TextField,
    // InputAdornment,
    Divider,
    Button,
    Collapse
} from '@mui/material'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useRouter } from 'next/navigation'
import { AlignJustify, ChevronDown, ChevronUp, Smile, CalendarDays } from 'lucide-react'
//import { SizeIcon } from '@radix-ui/react-icons'
import { BsCoin } from 'react-icons/bs'
interface IBenefitType {
    Name: string
    Description: string
    Benefits: IBenefit[]
}

interface IBenefit {
    Money: number
    CreateDate: string
    IsActive: boolean
}

const responseData = {
    Data: {
        TotalRecords: 10,
        Records: [
            {
                Name: 'Health Insurance',
                Description: 'Provides health coverage for employees sfdf sdfdsf sdf',
                Benefits: [
                    {
                        Money: 500000,
                        CreateDate: '2025-01-01',
                        IsActive: true
                    },
                    {
                        Money: 300000,
                        CreateDate: '2025-02-01',
                        IsActive: false
                    }
                ]
            },
            {
                Name: 'Health Insurance',
                Description: 'Provides health coverage for employees',
                Benefits: [
                    {
                        Money: 5787800,
                        CreateDate: '2025-01-01',
                        IsActive: true
                    },
                    {
                        Money: 3087870,
                        CreateDate: '2025-02-01',
                        IsActive: false
                    }
                ]
            },
            {
                Name: 'Health Insurancesdfsdf',
                Description: 'Provides health coverage for employees',
                Benefits: [
                    {
                        Money: 500,
                        CreateDate: '2025-01-01',
                        IsActive: true
                    },
                    {
                        Money: 300,
                        CreateDate: '2025-02-01',
                        IsActive: false
                    }
                ]
            },
            {
                Name: 'Health Insurance',
                Description: 'Provides health coverage for employees',
                Benefits: [
                    {
                        Money: 45656500,
                        CreateDate: '2025-01-01',
                        IsActive: true
                    },
                    {
                        Money: 3645600,
                        CreateDate: '2025-02-01',
                        IsActive: false
                    }
                ]
            }
        ]
    }
}
function Page() {
    const { t } = useTranslation('common')
    const router = useRouter()
    const benefitData = responseData?.Data.Records as IBenefitType[]

    const totalRecords = (responseData?.Data.TotalRecords as number) || 0
    useEffect(() => {}, [t, router, benefitData, totalRecords])
    const [openState1, setOpenState1] = useState<Record<number, boolean>>({})
    const toggleCollapse1 = (index: number) => {
        setOpenState1(prev => ({
            ...prev,
            [index]: !prev[index]
        }))
    }
    const [openState2, setOpenState2] = useState<Record<number, boolean>>({})
    const toggleCollapse2 = (index: number) => {
        setOpenState2(prev => ({
            ...prev,
            [index]: !prev[index]
        }))
    }
    const [openState3, setOpenState3] = useState<Record<number, boolean>>({})
    const toggleCollapse3 = (index: number) => {
        setOpenState3(prev => ({
            ...prev,
            [index]: !prev[index]
        }))
    }

    return (
        <Paper
            sx={{
                width: '100%',
                overflow: 'hidden',
                boxShadow: 'var(--box-shadow-paper)',
                borderRadius: '20px',
                backgroundColor: 'var(--background-item)',
                padding: '24px 24px 24px 24px',
                display: 'flex',
                gap: '24px'
            }}
        >
            <Box sx={{ border: '2px solid black', borderRadius: '5px', padding: '24px 24px 24px 24px' }}>
                <Box sx={{ display: 'flex', flexDirection: 'row', gap: '5px' }}>
                    <AlignJustify size={30} />
                    <Typography sx={{ color: 'black', fontSize: '20px', fontWeight: 'bold' }}>
                        Phụ cấp phải đóng bảo hiểm xã hội
                    </Typography>
                </Box>
                <Box>
                    {responseData.Data.Records.map((record, index) => (
                        <Box key={index} sx={{ marginBottom: '20px' }}>
                            <Divider sx={{ marginTop: '15px', marginBottom: '10px', borderColor: 'black' }} />
                            <Box
                                sx={{
                                    padding: '10px',
                                    display: 'flex',
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    justifyContent: 'space-between'
                                }}
                            >
                                {/* Header của Collapse */}
                                <Box
                                    sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        flexDirection: 'row',
                                        //border: '2px solid black',
                                        width: '100%'
                                    }}
                                >
                                    <Box sx={{ padding: '5px', border: '2px solid black', borderRadius: '5px' }}>
                                        <Smile size={30} />
                                    </Box>
                                    <Box sx={{ ml: '24px' }}>
                                        <Typography sx={{ fontSize: '17px', fontWeight: 'bold' }}>
                                            {record.Name}
                                        </Typography>
                                        <Typography>{record.Description}</Typography>
                                    </Box>
                                </Box>
                                <Box>
                                    <Button
                                        onClick={() => toggleCollapse1(index)}
                                        style={{
                                            borderRadius: '6px',
                                            color: 'black',
                                            padding: '4px',
                                            minWidth: 'auto',
                                            border: '2px solid black'
                                        }}
                                    >
                                        {openState1[index] ? <ChevronUp /> : <ChevronDown />}
                                    </Button>
                                </Box>
                            </Box>

                            {/* Nội dung Collapse */}
                            <Collapse in={openState1[index]} timeout='auto' unmountOnExit>
                                <Box sx={{ marginTop: '10px', padding: '10px', backgroundColor: '#f5f5f5' }}>
                                    {record.Benefits.map((benefit, bIndex) => (
                                        <Box
                                            key={bIndex}
                                            sx={{
                                                padding: '10px',
                                                border: '1px solid gray',
                                                marginBottom: '15px'
                                            }}
                                        >
                                            <Box
                                                sx={{
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    gap: '10px'
                                                }}
                                            >
                                                <Box
                                                    sx={{
                                                        display: 'flex',
                                                        flexDirection: 'row',
                                                        justifyContent: 'space-between',
                                                        alignItems: 'center',
                                                        width: '100%',
                                                        gap: '10px'
                                                    }}
                                                >
                                                    <Box
                                                        sx={{
                                                            width: 'calc(100%)',
                                                            backgroundColor: 'yellow',
                                                            display: 'flex',
                                                            justifyContent: 'center',
                                                            alignItems: 'center',
                                                            borderRadius: '10px',
                                                            padding: '5px 0px 5px 0px',
                                                            border: '2px solid black',
                                                            gap: '10px'
                                                        }}
                                                    >
                                                        <BsCoin size={20} />
                                                        <Typography sx={{ fontWeight: 'bold' }}>
                                                            {benefit.Money} VNĐ
                                                        </Typography>
                                                    </Box>
                                                    <Box
                                                        sx={{
                                                            width: 'calc(100%)',
                                                            backgroundColor: 'yellow',
                                                            display: 'flex',
                                                            justifyContent: 'center',
                                                            alignItems: 'center',
                                                            gap: '10px',
                                                            borderRadius: '10px',
                                                            padding: '5px 0px 5px 0px',
                                                            border: '2px solid black'
                                                        }}
                                                    >
                                                        <CalendarDays />
                                                        <Typography>{benefit.CreateDate}</Typography>
                                                    </Box>
                                                </Box>
                                                <Box
                                                    sx={{
                                                        width: 'calc(100% / 2)',
                                                        backgroundColor:
                                                            benefit.IsActive === true
                                                                ? 'rgb(122, 233, 112)'
                                                                : 'rgb(242, 95, 95)',
                                                        display: 'flex',
                                                        justifyContent: 'center',
                                                        alignItems: 'center',
                                                        borderRadius: '10px',
                                                        padding: '5px 0px 5px 0px',
                                                        border: '2px solid black'
                                                    }}
                                                >
                                                    <Typography sx={{ fontWeight: 'bold' }}>
                                                        {benefit.IsActive === true
                                                            ? t('Đã nhận tiền')
                                                            : t('Chưa nhận tiền')}
                                                    </Typography>
                                                </Box>
                                            </Box>
                                        </Box>
                                    ))}
                                </Box>
                            </Collapse>
                        </Box>
                    ))}
                </Box>
            </Box>
            <Box sx={{ border: '2px solid black', borderRadius: '5px', padding: '24px 24px 24px 24px' }}>
                <Box sx={{ display: 'flex', flexDirection: 'row', gap: '5px' }}>
                    <AlignJustify size={30} />
                    <Typography sx={{ color: 'black', fontSize: '20px', fontWeight: 'bold' }}>
                        Phụ cấp phải đóng bảo hiểm xã hội
                    </Typography>
                </Box>
                <Box>
                    {responseData.Data.Records.map((record, index) => (
                        <Box key={index} sx={{ marginBottom: '20px' }}>
                            <Divider sx={{ marginTop: '15px', marginBottom: '10px', borderColor: 'black' }} />
                            <Box
                                sx={{
                                    padding: '10px',
                                    display: 'flex',
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    justifyContent: 'space-between'
                                }}
                            >
                                {/* Header của Collapse */}
                                <Box
                                    sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        flexDirection: 'row',
                                        //border: '2px solid black',
                                        width: '100%'
                                    }}
                                >
                                    <Box sx={{ padding: '5px', border: '2px solid black', borderRadius: '5px' }}>
                                        <Smile size={30} />
                                    </Box>
                                    <Box sx={{ ml: '24px' }}>
                                        <Typography sx={{ fontSize: '17px', fontWeight: 'bold' }}>
                                            {record.Name}
                                        </Typography>
                                        <Typography>{record.Description}</Typography>
                                    </Box>
                                </Box>
                                <Box>
                                    <Button
                                        onClick={() => toggleCollapse2(index)}
                                        style={{
                                            borderRadius: '6px',
                                            color: 'black',
                                            padding: '4px',
                                            minWidth: 'auto',
                                            border: '2px solid black'
                                        }}
                                    >
                                        {openState2[index] ? <ChevronUp /> : <ChevronDown />}
                                    </Button>
                                </Box>
                            </Box>

                            {/* Nội dung Collapse */}
                            <Collapse in={openState2[index]} timeout='auto' unmountOnExit>
                                <Box sx={{ marginTop: '10px', padding: '10px', backgroundColor: '#f5f5f5' }}>
                                    {record.Benefits.map((benefit, bIndex) => (
                                        <Box
                                            key={bIndex}
                                            sx={{
                                                padding: '10px',
                                                border: '1px solid gray',
                                                marginBottom: '8px'
                                            }}
                                        >
                                            <Typography>
                                                <strong>Money:</strong> {benefit.Money.toLocaleString()} VND
                                            </Typography>
                                            <Typography>
                                                <strong>Create Date:</strong> {benefit.CreateDate}
                                            </Typography>
                                            <Typography>
                                                <strong>Status:</strong> {benefit.IsActive ? 'Active' : 'Inactive'}
                                            </Typography>
                                        </Box>
                                    ))}
                                </Box>
                            </Collapse>
                        </Box>
                    ))}
                </Box>
            </Box>
            <Box sx={{ border: '2px solid black', borderRadius: '5px', padding: '24px 24px 24px 24px' }}>
                <Box sx={{ display: 'flex', flexDirection: 'row', gap: '5px' }}>
                    <AlignJustify size={30} />
                    <Typography sx={{ color: 'black', fontSize: '20px', fontWeight: 'bold' }}>
                        Phụ cấp phải đóng bảo hiểm xã hội
                    </Typography>
                </Box>
                <Box>
                    {responseData.Data.Records.map((record, index) => (
                        <Box key={index} sx={{ marginBottom: '20px' }}>
                            <Divider sx={{ marginTop: '15px', marginBottom: '10px', borderColor: 'black' }} />
                            <Box
                                sx={{
                                    padding: '10px',
                                    display: 'flex',
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    justifyContent: 'space-between'
                                }}
                            >
                                {/* Header của Collapse */}
                                <Box
                                    sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        flexDirection: 'row',
                                        //border: '2px solid black',
                                        width: '100%'
                                    }}
                                >
                                    <Box sx={{ padding: '5px', border: '2px solid black', borderRadius: '5px' }}>
                                        <Smile size={30} />
                                    </Box>
                                    <Box sx={{ ml: '24px' }}>
                                        <Typography sx={{ fontSize: '17px', fontWeight: 'bold' }}>
                                            {record.Name}
                                        </Typography>
                                        <Typography>{record.Description}</Typography>
                                    </Box>
                                </Box>
                                <Box>
                                    <Button
                                        onClick={() => toggleCollapse3(index)}
                                        style={{
                                            borderRadius: '6px',
                                            color: 'black',
                                            padding: '4px',
                                            minWidth: 'auto',
                                            border: '2px solid black'
                                        }}
                                    >
                                        {openState3[index] ? <ChevronUp /> : <ChevronDown />}
                                    </Button>
                                </Box>
                            </Box>

                            {/* Nội dung Collapse */}
                            <Collapse in={openState3[index]} timeout='auto' unmountOnExit>
                                <Box sx={{ marginTop: '10px', padding: '10px', backgroundColor: '#f5f5f5' }}>
                                    {record.Benefits.map((benefit, bIndex) => (
                                        <Box
                                            key={bIndex}
                                            sx={{
                                                padding: '10px',
                                                border: '1px solid gray',
                                                marginBottom: '8px'
                                            }}
                                        >
                                            <Typography>
                                                <strong>Money:</strong> {benefit.Money.toLocaleString()} VND
                                            </Typography>
                                            <Typography>
                                                <strong>Create Date:</strong> {benefit.CreateDate}
                                            </Typography>
                                            <Typography>
                                                <strong>Status:</strong> {benefit.IsActive ? 'Active' : 'Inactive'}
                                            </Typography>
                                        </Box>
                                    ))}
                                </Box>
                            </Collapse>
                        </Box>
                    ))}
                </Box>
            </Box>
        </Paper>
    )
}

export default Page
