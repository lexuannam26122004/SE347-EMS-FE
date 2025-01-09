'use client'
import {
    Box,
    //Select,
    //Pagination,
    Typography,
    // MenuItem,
    //SelectChangeEvent,
    Paper

    //Checkbox,
    //TableRow,
    //TableBody,
    //Table,
    //TableCell,
    //TableHead,
    //TableContainer,
    //Button,
    //TextField,
    //InputAdornment,
    //IconButton,
    //Tooltip,
    //TableSortLabel,
    //Chip
} from '@mui/material'
import { AlarmClock } from 'lucide-react'

import { useTranslation } from 'react-i18next'

function WorkingRolesPage() {
    const { t } = useTranslation('common')

    const data = [
        {
            Id: '01',
            Content: 'Công ty yêu cầu nhân viên đến đúng giờ làm việc, không được phép đi muộn.',
            Note: 'Quy định này giúp duy trì kỷ luật trong công ty.'
        },
        {
            Id: '02',
            Content: 'Nhân viên phải mặc đồng phục công ty trong giờ làm việc.',
            Note: 'Điện thoại cá nhân có thể gây xao nhãng công việc.'
        },
        {
            Id: '03',
            Content: 'Không được phép sử dụng điện thoại cá nhân trong giờ làm việc trừ khi có việc gấp.',
            Note: 'Các nhân viên phải tuân thủ quy trình báo cáo công việc định kỳ.'
        },
        {
            Id: '04',
            Content: 'Các nhân viên phải tuân thủ quy trình báo cáo công việc định kỳ.',
            Note: 'Báo cáo giúp quản lý dễ dàng theo dõi tiến độ công việc.'
        },
        {
            Id: '05',
            Content: 'Tất cả nhân viên phải tham gia các cuộc họp định kỳ hàng tuần.',
            Note: 'Cuộc họp giúp đảm bảo thông tin được cập nhật đầy đủ cho toàn bộ nhân viên.'
        },
        {
            Id: '06',
            Content: 'Nhân viên cần giữ gìn vệ sinh nơi làm việc và khu vực chung.',
            Note: 'Vệ sinh nơi làm việc giúp tạo môi trường làm việc sạch sẽ và chuyên nghiệp.'
        },
        {
            Id: '07',
            Content: 'Nhân viên phải thông báo trước khi nghỉ phép hoặc vắng mặt.',
            Note: 'Thông báo kịp thời giúp bộ phận nhân sự sắp xếp công việc hợp lý.'
        },
        {
            Id: '08',
            Content: 'Các nhân viên không được phép tiết lộ thông tin công ty cho bên ngoài.',
            Note: 'Thông tin công ty cần được bảo mật để tránh rủi ro cho tổ chức.'
        },
        {
            Id: '09',
            Content: 'Mỗi nhân viên cần hoàn thành các nhiệm vụ được giao đúng thời hạn.',
            Note: 'Hoàn thành đúng hạn giúp công ty duy trì hiệu quả công việc.'
        },
        {
            Id: '10',
            Content: 'Nhân viên cần báo cáo với cấp trên về các vấn đề phát sinh trong công việc.',
            Note: 'Việc báo cáo sớm giúp xử lý nhanh chóng các tình huống phát sinh.'
        },
        {
            Id: '11',
            Content: 'Nhân viên cần tuân thủ các chỉ thị về an toàn lao động trong quá trình làm việc.',
            Note: 'An toàn lao động là ưu tiên hàng đầu để bảo vệ sức khỏe nhân viên.'
        },
        {
            Id: '12',
            Content: 'Nhân viên không được phép sử dụng rượu bia trong giờ làm việc.',
            Note: 'Sử dụng rượu bia trong công ty sẽ làm giảm năng suất công việc và ảnh hưởng đến kỷ luật.'
        },
        {
            Id: '13',
            Content: 'Các nhân viên phải báo cáo tình hình công việc với phòng ban vào cuối mỗi tháng.',
            Note: 'Báo cáo công việc hàng tháng giúp đánh giá hiệu quả công việc của từng phòng ban.'
        },
        {
            Id: '14',
            Content: 'Nhân viên phải tham gia các khóa đào tạo nâng cao kỹ năng khi công ty tổ chức.',
            Note: 'Đào tạo giúp nhân viên nâng cao trình độ chuyên môn và hiệu quả công việc.'
        },
        {
            Id: '15',
            Content: 'Mọi nhân viên phải có trách nhiệm với các tài sản công ty được giao.',
            Note: 'Việc bảo quản tài sản công ty giúp duy trì sự phát triển bền vững cho công ty.'
        }
    ]

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
                        position: 'relative',
                        backgroundRepeat: 'no-repeat',
                        backgroundSize: '100%'
                    }}
                >
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
                                gap: '15px'
                            }}
                        >
                            {/*<Chip
                                label='Minh'
                                sx={{
                                    '& .MuiChip-label': {
                                        fontSize: '15px', // Đặt cỡ chữ theo ý muốn
                                        fontWeight: 'bold' // (Tùy chọn) Đặt kiểu chữ đậm
                                    }
                                }}
                            ></Chip>
                            */}
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
                                gap: '15px'
                            }}
                        >
                            {/*<Chip
                                label='Minh'
                                sx={{
                                    '& .MuiChip-label': {
                                        fontSize: '15px', // Đặt cỡ chữ theo ý muốn
                                        fontWeight: 'bold' // (Tùy chọn) Đặt kiểu chữ đậm
                                    }
                                }}
                            ></Chip>
                            */}
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
                                gap: '15px'
                            }}
                        >
                            {/*<Chip
                                label='Minh'
                                sx={{
                                    '& .MuiChip-label': {
                                        fontSize: '15px', // Đặt cỡ chữ theo ý muốn
                                        fontWeight: 'bold' // (Tùy chọn) Đặt kiểu chữ đậm
                                    }
                                }}
                            ></Chip>
                            */}
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
                                gap: '15px'
                            }}
                        >
                            {/*<Chip
                                label='Minh'
                                sx={{
                                    '& .MuiChip-label': {
                                        fontSize: '15px', // Đặt cỡ chữ theo ý muốn
                                        fontWeight: 'bold' // (Tùy chọn) Đặt kiểu chữ đậm
                                    }
                                }}
                            ></Chip>
                            */}
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
                                gap: '15px'
                            }}
                        >
                            {/*<Chip
                                label='Minh'
                                sx={{
                                    '& .MuiChip-label': {
                                        fontSize: '15px', // Đặt cỡ chữ theo ý muốn
                                        fontWeight: 'bold' // (Tùy chọn) Đặt kiểu chữ đậm
                                    }
                                }}
                            ></Chip>
                            */}
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
                                gap: '15px'
                            }}
                        >
                            {/*<Chip
                                label='Minh'
                                sx={{
                                    '& .MuiChip-label': {
                                        fontSize: '15px', // Đặt cỡ chữ theo ý muốn
                                        fontWeight: 'bold' // (Tùy chọn) Đặt kiểu chữ đậm
                                    }
                                }}
                            ></Chip>
                            */}
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
                                gap: '15px'
                            }}
                        >
                            {/*<Chip
                                label='Minh'
                                sx={{
                                    '& .MuiChip-label': {
                                        fontSize: '15px', // Đặt cỡ chữ theo ý muốn
                                        fontWeight: 'bold' // (Tùy chọn) Đặt kiểu chữ đậm
                                    }
                                }}
                            ></Chip>
                            */}
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
                                    Bảo quản <br />
                                    tài sản
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
                                            borderRadius: '15px',
                                            display: 'flex',
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
                                            width: '100%',
                                            mt: '24px',
                                            mb: '24px',
                                            mr: '50px'
                                        }}
                                    >
                                        <Box sx={{ textAlign: 'justify' }}>
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
                                </Box>
                            </Box>
                        ))}
                    </Box>
                </Box>
            </Paper>
        </Box>
    )
}
export default WorkingRolesPage
