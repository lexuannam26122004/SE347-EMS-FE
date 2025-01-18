import { Avatar, Box, Paper, Typography } from '@mui/material'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Star } from 'lucide-react'
import { useTopUserByMonthQuery } from '@/services/StatsRewardAndDisciplineService'
import Loading from '@/components/Loading'

function a11yProps(index: number) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`
    }
}

function Page() {
    const { t } = useTranslation('common')
    const [currentTab, setCurrentTab] = useState(0)

    const month = new Date().getMonth() + 1
    const year = new Date().getFullYear()

    const { data: topUserByMonth, isLoading } = useTopUserByMonthQuery({ month, year })

    const nthUsersReward = topUserByMonth?.Data.TopRewards || []

    const nthUsersDiscipline = topUserByMonth?.Data.TopDisciplines || []

    if (isLoading) {
        return <Loading />
    }

    return (
        <Box width='100%'>
            <Paper
                sx={{
                    width: '100%',
                    height: '100%',
                    boxShadow: 'var(--box-shadow-paper)',
                    overflow: 'hidden',
                    borderRadius: '20px',
                    backgroundColor: '#6A5AE0'
                }}
            >
                <Typography
                    variant='h5'
                    sx={{
                        padding: '24px 24px 15px 24px',
                        fontSize: '18px',
                        fontWeight: 'bold',
                        color: 'white'
                    }}
                >
                    {t('COMMON.REWARD_DISCIPLINE.TOP_EMPLOYEE_BY_MONTH')}
                </Typography>

                <Box>
                    <Tabs
                        value={currentTab}
                        onChange={(event, newValue) => setCurrentTab(newValue)}
                        aria-label='basic tabs example'
                        centered
                        TabIndicatorProps={{
                            sx: { display: 'none' }
                        }}
                        sx={{
                            transition: 'background-color 0.3s ease, color 0.3s ease', // Hiệu ứng chuyển background và color
                            backgroundColor: '#9c90ed'
                        }}
                    >
                        <Tab
                            sx={{
                                textTransform: 'none',
                                flex: '1',
                                display: 'flex',
                                justifyContent: 'center',
                                padding: '10px',
                                alignItems: 'center'
                            }}
                            label={
                                <Box
                                    sx={{
                                        transition: 'background-color 0.3s ease, color 0.3s ease', // Hiệu ứng chuyển background và color
                                        borderRadius: '8px',
                                        padding: '10px 0',
                                        width: '100%',
                                        fontSize: '15px',
                                        whiteSpace: 'nowrap',
                                        fontWeight: 'bold',
                                        backgroundColor: currentTab === 0 ? 'white' : 'transparent',
                                        color: currentTab === 0 ? 'black' : '#51469f'
                                    }}
                                >
                                    {t('COMMON.REWARD_DISCIPLINE.REWARD')}
                                </Box>
                            }
                            {...a11yProps(0)}
                        />
                        <Tab
                            sx={{
                                textTransform: 'none',
                                flex: '1',
                                display: 'flex',
                                padding: '10px',
                                justifyContent: 'center',
                                alignItems: 'center'
                            }}
                            label={
                                <Box
                                    sx={{
                                        transition: 'background-color 0.3s ease, color 0.3s ease', // Hiệu ứng chuyển background và color
                                        borderRadius: '8px',
                                        padding: '10px 0',
                                        fontSize: '15px',
                                        width: '100%',
                                        fontWeight: 'bold',
                                        whiteSpace: 'nowrap',
                                        backgroundColor: currentTab === 1 ? 'white' : 'transparent',
                                        color: currentTab === 1 ? 'black' : '#51469f'
                                    }}
                                >
                                    {t('COMMON.REWARD_DISCIPLINE.DISCIPLINE')}
                                </Box>
                            }
                            {...a11yProps(1)}
                        />
                    </Tabs>

                    <Box
                        sx={{
                            width: '100%',
                            height: '100%',
                            position: 'relative'
                        }}
                    >
                        <img
                            src='/images/group8.svg'
                            style={{
                                position: 'absolute',
                                top: '0',
                                right: '0'
                            }}
                        />
                        <img
                            src='/images/ovalCopy.svg'
                            style={{
                                position: 'absolute',
                                top: '95px',
                                right: '120px'
                            }}
                        />
                        {currentTab === 0 && (
                            <Box
                                sx={{
                                    width: '100%',
                                    height: '100%',
                                    position: 'relative',
                                    display: 'flex', // Sử dụng Flexbox
                                    flexDirection: 'column' // Đặt các phần tử con theo chiều dọc
                                }}
                            >
                                <Box
                                    sx={{
                                        width: '100%',
                                        padding: '24px',
                                        height: '400px',
                                        position: 'relative'
                                    }}
                                >
                                    <Box
                                        sx={{
                                            display: 'flex',
                                            justifyContent: 'center',
                                            alignItems: 'top',
                                            height: '100%',
                                            mt: '175px'
                                        }}
                                    >
                                        <Box
                                            sx={{
                                                width: 'calc(100% / 3)',
                                                height: '100%',
                                                position: 'relative',
                                                mt: '45px',
                                                backgroundImage: 'url(/images/rank-2.svg)',
                                                backgroundSize: 'contain',
                                                backgroundPosition: 'center top',
                                                backgroundRepeat: 'no-repeat'
                                            }}
                                        >
                                            {nthUsersReward[1] && (
                                                <>
                                                    {' '}
                                                    <Box
                                                        sx={{
                                                            width: '60px',
                                                            height: '60px',
                                                            position: 'absolute',
                                                            left: 'calc(50%)',
                                                            borderRadius: '50%',
                                                            transform: 'translateX(-50%)',
                                                            top: '-145px',
                                                            border: '2px solid #00D95F',
                                                            zIndex: 1,
                                                            overflow: 'visible', // Cho phép phần tử con thoát ra ngoài
                                                            // Thêm ::after để tạo hình vuông
                                                            '&::after': {
                                                                content: '""',
                                                                position: 'absolute',
                                                                bottom: '-8px', // Đặt hình vuông vào cuối avatar
                                                                left: '50%', // Căn giữa hình vuông
                                                                width: '17px', // Kích thước hình vuông
                                                                height: '17px',
                                                                borderRadius: '4px', // Bo tròn hình vuông
                                                                backgroundColor: '#00D95F', // Màu nền của hình vuông
                                                                transform: 'translateX(-50%) rotate(45deg)', // Xoay hình vuông 45 độ
                                                                zIndex: 2 // Đặt hình vuông phía sau avatar
                                                            },
                                                            '&::before': {
                                                                content: '"2"', // Nội dung hiển thị số 1
                                                                position: 'absolute',
                                                                bottom: '-5px', // Đặt số 1 vào cùng vị trí với hình vuông
                                                                left: '50%', // Căn giữa số 1
                                                                transform: 'translateX(-50%)', // Đảm bảo số 1 không bị xoay
                                                                zIndex: 3, // Đặt số 1 lên trên hình vuông
                                                                display: 'flex', // Sử dụng flex để căn giữa
                                                                justifyContent: 'center', // Căn giữa theo chiều ngang
                                                                alignItems: 'center', // Căn giữa theo chiều dọc
                                                                fontSize: '10px', // Kích thước chữ
                                                                color: 'white', // Màu chữ
                                                                fontWeight: 'bold' // Đậm chữ
                                                            }
                                                        }}
                                                    >
                                                        <Avatar
                                                            src={nthUsersReward[1]?.AvatarPath}
                                                            sx={{
                                                                position: 'absolute',
                                                                width: '55px',
                                                                height: '55px',
                                                                top: '0.5px',
                                                                left: '0.5px'
                                                            }}
                                                        ></Avatar>
                                                    </Box>
                                                    <Typography
                                                        sx={{
                                                            position: 'absolute',
                                                            right: '50%',
                                                            transform: 'translateX(50%)',
                                                            fontSize: '15px',
                                                            fontWeight: 'bold',
                                                            color: 'white',
                                                            top: '-70px'
                                                        }}
                                                    >
                                                        {nthUsersReward[1]?.FullName.toString().split(' ').pop()}
                                                    </Typography>
                                                    <Typography
                                                        sx={{
                                                            position: 'absolute',
                                                            right: '50%',
                                                            fontSize: '16px',
                                                            color: 'white',
                                                            borderRadius: '8px',
                                                            padding: '4px 7px',
                                                            whiteSpace: 'nowrap',
                                                            backgroundColor: '#9087E5',
                                                            fontWeight: 'bold',
                                                            transform: 'translateX(50%)',
                                                            top: '-40px'
                                                        }}
                                                    >
                                                        {nthUsersReward[1]?.Count +
                                                            ' ' +
                                                            t('COMMON.REWARD_DISCIPLINE.TIMES')}
                                                    </Typography>
                                                </>
                                            )}
                                        </Box>

                                        <Box
                                            sx={{
                                                backgroundImage: 'url(/images/rank-1.svg)', // Gradient nền mượt mà
                                                width: 'calc(100% / 3)',
                                                height: '100%',
                                                mt: '-10px',
                                                backgroundSize: 'contain',
                                                backgroundPosition: 'center top',
                                                backgroundRepeat: 'no-repeat',
                                                position: 'relative'
                                            }}
                                        >
                                            {nthUsersReward[0] && (
                                                <>
                                                    <Box
                                                        sx={{
                                                            width: '70px',
                                                            height: '70px',
                                                            position: 'absolute',
                                                            left: '50%',
                                                            borderRadius: '50%',
                                                            transform: 'translateX(-50%)',
                                                            top: '-155px',
                                                            border: '2px solid #FFAA00',
                                                            zIndex: 1,
                                                            overflow: 'visible', // Cho phép phần tử con thoát ra ngoài
                                                            // Thêm ::after để tạo hình vuông
                                                            '&::after': {
                                                                content: '""',
                                                                position: 'absolute',
                                                                bottom: '-8px', // Đặt hình vuông vào cuối avatar
                                                                left: '50%', // Căn giữa hình vuông
                                                                width: '17px', // Kích thước hình vuông
                                                                height: '17px',
                                                                borderRadius: '4px', // Bo tròn hình vuông
                                                                backgroundColor: '#FFAA00', // Màu nền của hình vuông
                                                                transform: 'translateX(-50%) rotate(45deg)', // Xoay hình vuông 45 độ
                                                                zIndex: 2 // Đặt hình vuông phía sau avatar
                                                            },
                                                            '&::before': {
                                                                content: '"1"', // Nội dung hiển thị số 1
                                                                position: 'absolute',
                                                                bottom: '-5px', // Đặt số 1 vào cùng vị trí với hình vuông
                                                                left: '50%', // Căn giữa số 1
                                                                transform: 'translateX(-50%)', // Đảm bảo số 1 không bị xoay
                                                                zIndex: 3, // Đặt số 1 lên trên hình vuông
                                                                display: 'flex', // Sử dụng flex để căn giữa
                                                                justifyContent: 'center', // Căn giữa theo chiều ngang
                                                                alignItems: 'center', // Căn giữa theo chiều dọc
                                                                fontSize: '10px', // Kích thước chữ
                                                                color: 'white', // Màu chữ
                                                                fontWeight: 'bold' // Đậm chữ
                                                            }
                                                        }}
                                                    >
                                                        <Avatar
                                                            src={nthUsersReward[0]?.AvatarPath}
                                                            sx={{
                                                                position: 'absolute',
                                                                width: '65px',
                                                                height: '65px',
                                                                top: '0.5px',
                                                                left: '0.5px'
                                                            }}
                                                        ></Avatar>
                                                    </Box>

                                                    <img
                                                        src='/images/leader-board.svg'
                                                        style={{
                                                            position: 'absolute',
                                                            top: '-175px',
                                                            left: 'calc(50% - 30px)',
                                                            transform: 'translateX(-50%) rotate(324deg)',
                                                            zIndex: 1
                                                        }}
                                                    />

                                                    <Typography
                                                        sx={{
                                                            position: 'absolute',
                                                            right: '50%',
                                                            transform: 'translateX(50%)',
                                                            fontSize: '15px',
                                                            fontWeight: 'bold',
                                                            color: 'white',
                                                            top: '-70px'
                                                        }}
                                                    >
                                                        {nthUsersReward[0]?.FullName.toString().split(' ').pop()}
                                                    </Typography>

                                                    <Typography
                                                        sx={{
                                                            position: 'absolute',
                                                            right: '50%',
                                                            fontSize: '16px',
                                                            color: 'white',
                                                            borderRadius: '8px',
                                                            padding: '4px 7px',
                                                            whiteSpace: 'nowrap',
                                                            backgroundColor: '#9087E5',
                                                            fontWeight: 'bold',
                                                            transform: 'translateX(50%)',
                                                            top: '-40px'
                                                        }}
                                                    >
                                                        {nthUsersReward[0]?.Count +
                                                            ' ' +
                                                            t('COMMON.REWARD_DISCIPLINE.TIMES')}
                                                    </Typography>
                                                </>
                                            )}
                                        </Box>

                                        <Box
                                            sx={{
                                                backgroundImage: 'url(/images/rank-3.svg)', // Gradient nền mượt mà
                                                width: 'calc(100%/ 3)',
                                                mt: '80px',
                                                height: '100%',
                                                backgroundSize: 'contain',
                                                backgroundPosition: 'center top',
                                                backgroundRepeat: 'no-repeat',
                                                position: 'relative'
                                            }}
                                        >
                                            {nthUsersReward[2] && (
                                                <>
                                                    <Box
                                                        sx={{
                                                            width: '60px',
                                                            height: '60px',
                                                            position: 'absolute',
                                                            borderRadius: '50%',
                                                            right: '50%',
                                                            transform: 'translateX(50%)',
                                                            top: '-145px',
                                                            border: '2px solid red',
                                                            zIndex: 1,
                                                            overflow: 'visible', // Cho phép phần tử con thoát ra ngoài
                                                            // Thêm ::after để tạo hình vuông
                                                            '&::after': {
                                                                content: '""',
                                                                position: 'absolute',
                                                                bottom: '-8px', // Đặt hình vuông vào cuối avatar
                                                                left: '50%', // Căn giữa hình vuông
                                                                width: '17px', // Kích thước hình vuông
                                                                height: '17px',
                                                                borderRadius: '4px', // Bo tròn hình vuông
                                                                backgroundColor: 'red', // Màu nền của hình vuông
                                                                transform: 'translateX(-50%) rotate(45deg)', // Xoay hình vuông 45 độ
                                                                zIndex: 2 // Đặt hình vuông phía sau avatar
                                                            },
                                                            '&::before': {
                                                                content: '"3"', // Nội dung hiển thị số 1
                                                                position: 'absolute',
                                                                bottom: '-5px', // Đặt số 1 vào cùng vị trí với hình vuông
                                                                left: '50%', // Căn giữa số 1
                                                                transform: 'translateX(-50%)', // Đảm bảo số 1 không bị xoay
                                                                zIndex: 3, // Đặt số 1 lên trên hình vuông
                                                                display: 'flex', // Sử dụng flex để căn giữa
                                                                justifyContent: 'center', // Căn giữa theo chiều ngang
                                                                alignItems: 'center', // Căn giữa theo chiều dọc
                                                                fontSize: '10px', // Kích thước chữ
                                                                color: 'white', // Màu chữ
                                                                fontWeight: 'bold' // Đậm chữ
                                                            }
                                                        }}
                                                    >
                                                        <Avatar
                                                            src={nthUsersReward[2]?.AvatarPath}
                                                            sx={{
                                                                position: 'absolute',
                                                                width: '55px',
                                                                height: '55px',
                                                                top: '0.5px',
                                                                left: '0.5px'
                                                            }}
                                                        ></Avatar>
                                                    </Box>

                                                    <Typography
                                                        sx={{
                                                            position: 'absolute',
                                                            right: '50%',
                                                            transform: 'translateX(50%)',
                                                            fontSize: '15px',
                                                            color: 'white',
                                                            fontWeight: 'bold',
                                                            top: '-70px'
                                                        }}
                                                    >
                                                        {nthUsersReward[2]?.FullName.toString().split(' ').pop()}
                                                    </Typography>

                                                    <Typography
                                                        sx={{
                                                            position: 'absolute',
                                                            right: '50%',
                                                            fontSize: '16px',
                                                            color: 'white',
                                                            borderRadius: '8px',
                                                            padding: '4px 7px',
                                                            whiteSpace: 'nowrap',
                                                            backgroundColor: '#9087E5',
                                                            fontWeight: 'bold',
                                                            transform: 'translateX(50%)',
                                                            top: '-40px'
                                                        }}
                                                    >
                                                        {nthUsersReward[2]?.Count +
                                                            ' ' +
                                                            t('COMMON.REWARD_DISCIPLINE.TIMES')}
                                                    </Typography>
                                                </>
                                            )}
                                        </Box>
                                    </Box>
                                </Box>
                                <Box
                                    sx={{
                                        position: 'absolute', // Bắt buộc để z-index hoạt động
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'left',
                                        bottom: '-260px',
                                        width: 'calc(100% - 20px)',
                                        left: '50%',
                                        padding: '45px 0px 2px 0px',
                                        transform: 'translateX(-50%)',
                                        backgroundImage: 'url(/images/userRank.svg)',
                                        backgroundSize: 'cover',
                                        fontSize: '20px',
                                        height: '290px',
                                        overflow: 'hidden',
                                        borderRadius: '0 0 12px 12px',
                                        zIndex: 3
                                    }}
                                >
                                    <Box
                                        sx={{
                                            overflow: 'auto',
                                            scrollbarGutter: 'stable',
                                            padding: '0 1px 7px 7px',
                                            '&::-webkit-scrollbar': {
                                                width: '7px',
                                                height: '7px'
                                            },
                                            '&::-webkit-scrollbar-thumb': {
                                                backgroundColor: '#cecece',
                                                borderRadius: '10px'
                                            }
                                        }}
                                    >
                                        {nthUsersReward?.map((user, index) => (
                                            <Box
                                                key={index}
                                                sx={{
                                                    '&:hover': {
                                                        backgroundColor: 'var(--hover-color)',
                                                        cursor: 'pointer'
                                                    },
                                                    borderRadius: '10px',
                                                    padding: '5px 6px',
                                                    display: 'flex',
                                                    justifyContent: 'left',
                                                    alignItems: 'center'
                                                }}
                                            >
                                                {index === 0 ? (
                                                    <img
                                                        src='/images/cup.svg'
                                                        style={{
                                                            width: '20px',
                                                            marginRight: '15px'
                                                        }}
                                                    ></img>
                                                ) : (
                                                    <Box
                                                        sx={{
                                                            color: 'white',
                                                            fontSize: '13px',
                                                            borderRadius: '50%',
                                                            border:
                                                                index === 0
                                                                    ? '1px solid #FFAA00'
                                                                    : index === 1
                                                                    ? '1px solid #00D95F'
                                                                    : index === 2
                                                                    ? '1px solid red'
                                                                    : '1px solid rgb(59, 59, 59)',
                                                            width: '20px',
                                                            height: '20px',
                                                            display: 'flex',
                                                            backgroundColor:
                                                                index === 0
                                                                    ? '#FFAA00'
                                                                    : index === 1
                                                                    ? '#00D95F'
                                                                    : index === 2
                                                                    ? 'red'
                                                                    : 'rgb(59, 59, 59)',
                                                            justifyContent: 'center',
                                                            alignItems: 'center',
                                                            marginRight: '15px'
                                                        }}
                                                    >
                                                        {index + 1}
                                                    </Box>
                                                )}
                                                <Box>
                                                    <Avatar
                                                        sx={{
                                                            mr: '12px',
                                                            width: '45px',
                                                            height: '45px'
                                                        }}
                                                        src={
                                                            user.AvatarPath ||
                                                            'https://localhost:44381/avatars/aa1678f0-75b0-48d2-ae98-50871178e9bd.jfif'
                                                        }
                                                    />
                                                </Box>
                                                <Box>
                                                    <Typography
                                                        sx={{
                                                            color: '#0C092A',
                                                            fontWeight: 'bold',
                                                            fontSize: '16px'
                                                        }}
                                                    >
                                                        {user.FullName}
                                                    </Typography>
                                                    <Typography
                                                        sx={{
                                                            color: '#858494',
                                                            fontSize: '14px'
                                                        }}
                                                    >
                                                        {user.EmployeeId}
                                                    </Typography>
                                                </Box>
                                                <Box
                                                    sx={{
                                                        fontSize: '16px',
                                                        color: 'white',
                                                        marginLeft: 'auto',
                                                        borderRadius: '8px',
                                                        display: 'flex',
                                                        justifyContent: 'center',
                                                        alignItems: 'center',
                                                        padding: '4px 7px',
                                                        whiteSpace: 'nowrap',
                                                        backgroundColor: '#37cf79e6',
                                                        fontWeight: 'bold'
                                                    }}
                                                >
                                                    <Star
                                                        size={16}
                                                        style={{
                                                            color: '#FFAA00',
                                                            fill: '#FFAA00',
                                                            verticalAlign: 'middle',
                                                            marginRight: '6px'
                                                        }}
                                                    />
                                                    {user.Count}
                                                </Box>
                                            </Box>
                                        ))}
                                    </Box>
                                </Box>
                            </Box>
                        )}
                        {currentTab === 1 && (
                            <Box
                                sx={{
                                    width: '100%',
                                    height: '100%',
                                    position: 'relative',
                                    display: 'flex', // Sử dụng Flexbox
                                    flexDirection: 'column' // Đặt các phần tử con theo chiều dọc
                                }}
                            >
                                <Box
                                    sx={{
                                        width: '100%',
                                        padding: '24px',
                                        height: '400px',
                                        position: 'relative'
                                    }}
                                >
                                    <Box
                                        sx={{
                                            display: 'flex',
                                            justifyContent: 'center',
                                            alignItems: 'top',
                                            height: '100%',
                                            mt: '175px'
                                        }}
                                    >
                                        <Box
                                            sx={{
                                                width: 'calc(100% / 3)',
                                                height: '100%',
                                                position: 'relative',
                                                mt: '45px',
                                                backgroundImage: 'url(/images/rank-2.svg)',
                                                backgroundSize: 'contain',
                                                backgroundPosition: 'center top',
                                                backgroundRepeat: 'no-repeat'
                                            }}
                                        >
                                            {nthUsersDiscipline[1] && (
                                                <>
                                                    <Box
                                                        sx={{
                                                            width: '60px',
                                                            height: '60px',
                                                            position: 'absolute',
                                                            left: 'calc(50%)',
                                                            borderRadius: '50%',
                                                            transform: 'translateX(-50%)',
                                                            top: '-145px',
                                                            border: '2px solid #00D95F',
                                                            zIndex: 1,
                                                            overflow: 'visible', // Cho phép phần tử con thoát ra ngoài
                                                            // Thêm ::after để tạo hình vuông
                                                            '&::after': {
                                                                content: '""',
                                                                position: 'absolute',
                                                                bottom: '-8px', // Đặt hình vuông vào cuối avatar
                                                                left: '50%', // Căn giữa hình vuông
                                                                width: '17px', // Kích thước hình vuông
                                                                height: '17px',
                                                                borderRadius: '4px', // Bo tròn hình vuông
                                                                backgroundColor: '#00D95F', // Màu nền của hình vuông
                                                                transform: 'translateX(-50%) rotate(45deg)', // Xoay hình vuông 45 độ
                                                                zIndex: 2 // Đặt hình vuông phía sau avatar
                                                            },
                                                            '&::before': {
                                                                content: '"2"', // Nội dung hiển thị số 1
                                                                position: 'absolute',
                                                                bottom: '-5px', // Đặt số 1 vào cùng vị trí với hình vuông
                                                                left: '50%', // Căn giữa số 1
                                                                transform: 'translateX(-50%)', // Đảm bảo số 1 không bị xoay
                                                                zIndex: 3, // Đặt số 1 lên trên hình vuông
                                                                display: 'flex', // Sử dụng flex để căn giữa
                                                                justifyContent: 'center', // Căn giữa theo chiều ngang
                                                                alignItems: 'center', // Căn giữa theo chiều dọc
                                                                fontSize: '10px', // Kích thước chữ
                                                                color: 'white', // Màu chữ
                                                                fontWeight: 'bold' // Đậm chữ
                                                            }
                                                        }}
                                                    >
                                                        <Avatar
                                                            src={nthUsersDiscipline[1]?.AvatarPath}
                                                            sx={{
                                                                position: 'absolute',
                                                                width: '55px',
                                                                height: '55px',
                                                                top: '0.5px',
                                                                left: '0.5px'
                                                            }}
                                                        ></Avatar>
                                                    </Box>
                                                    <Typography
                                                        sx={{
                                                            position: 'absolute',
                                                            right: '50%',
                                                            transform: 'translateX(50%)',
                                                            fontSize: '15px',
                                                            fontWeight: 'bold',
                                                            color: 'white',
                                                            top: '-70px'
                                                        }}
                                                    >
                                                        {nthUsersDiscipline[1]?.FullName.toString().split(' ').pop()}
                                                    </Typography>

                                                    <Typography
                                                        sx={{
                                                            position: 'absolute',
                                                            right: '50%',
                                                            fontSize: '16px',
                                                            color: 'white',
                                                            borderRadius: '8px',
                                                            padding: '4px 7px',
                                                            whiteSpace: 'nowrap',
                                                            backgroundColor: '#9087E5',
                                                            fontWeight: 'bold',
                                                            transform: 'translateX(50%)',
                                                            top: '-40px'
                                                        }}
                                                    >
                                                        {nthUsersDiscipline[1]?.Count +
                                                            ' ' +
                                                            t('COMMON.REWARD_DISCIPLINE.TIMES')}
                                                    </Typography>
                                                </>
                                            )}
                                        </Box>

                                        <Box
                                            sx={{
                                                backgroundImage: 'url(/images/rank-1.svg)', // Gradient nền mượt mà
                                                width: 'calc(100% / 3)',
                                                height: '100%',
                                                mt: '-10px',
                                                backgroundSize: 'contain',
                                                backgroundPosition: 'center top',
                                                backgroundRepeat: 'no-repeat',
                                                position: 'relative'
                                            }}
                                        >
                                            {nthUsersDiscipline[0] && (
                                                <>
                                                    <Box
                                                        sx={{
                                                            width: '70px',
                                                            height: '70px',
                                                            position: 'absolute',
                                                            left: '50%',
                                                            borderRadius: '50%',
                                                            transform: 'translateX(-50%)',
                                                            top: '-155px',
                                                            border: '2px solid #FFAA00',
                                                            zIndex: 1,
                                                            overflow: 'visible', // Cho phép phần tử con thoát ra ngoài
                                                            // Thêm ::after để tạo hình vuông
                                                            '&::after': {
                                                                content: '""',
                                                                position: 'absolute',
                                                                bottom: '-8px', // Đặt hình vuông vào cuối avatar
                                                                left: '50%', // Căn giữa hình vuông
                                                                width: '17px', // Kích thước hình vuông
                                                                height: '17px',
                                                                borderRadius: '4px', // Bo tròn hình vuông
                                                                backgroundColor: '#FFAA00', // Màu nền của hình vuông
                                                                transform: 'translateX(-50%) rotate(45deg)', // Xoay hình vuông 45 độ
                                                                zIndex: 2 // Đặt hình vuông phía sau avatar
                                                            },
                                                            '&::before': {
                                                                content: '"1"', // Nội dung hiển thị số 1
                                                                position: 'absolute',
                                                                bottom: '-5px', // Đặt số 1 vào cùng vị trí với hình vuông
                                                                left: '50%', // Căn giữa số 1
                                                                transform: 'translateX(-50%)', // Đảm bảo số 1 không bị xoay
                                                                zIndex: 3, // Đặt số 1 lên trên hình vuông
                                                                display: 'flex', // Sử dụng flex để căn giữa
                                                                justifyContent: 'center', // Căn giữa theo chiều ngang
                                                                alignItems: 'center', // Căn giữa theo chiều dọc
                                                                fontSize: '10px', // Kích thước chữ
                                                                color: 'white', // Màu chữ
                                                                fontWeight: 'bold' // Đậm chữ
                                                            }
                                                        }}
                                                    >
                                                        <Avatar
                                                            src={nthUsersDiscipline[0]?.AvatarPath}
                                                            sx={{
                                                                position: 'absolute',
                                                                width: '65px',
                                                                height: '65px',
                                                                top: '0.5px',
                                                                left: '0.5px'
                                                            }}
                                                        ></Avatar>
                                                    </Box>

                                                    <img
                                                        src='/images/leader-board.svg'
                                                        style={{
                                                            position: 'absolute',
                                                            top: '-175px',
                                                            left: 'calc(50% - 30px)',
                                                            transform: 'translateX(-50%) rotate(324deg)',
                                                            zIndex: 1
                                                        }}
                                                    />

                                                    <Typography
                                                        sx={{
                                                            position: 'absolute',
                                                            right: '50%',
                                                            transform: 'translateX(50%)',
                                                            fontSize: '15px',
                                                            fontWeight: 'bold',
                                                            color: 'white',
                                                            top: '-70px'
                                                        }}
                                                    >
                                                        {nthUsersDiscipline[0]?.FullName.toString().split(' ').pop()}
                                                    </Typography>

                                                    <Typography
                                                        sx={{
                                                            position: 'absolute',
                                                            right: '50%',
                                                            fontSize: '16px',
                                                            color: 'white',
                                                            borderRadius: '8px',
                                                            padding: '4px 7px',
                                                            whiteSpace: 'nowrap',
                                                            backgroundColor: '#9087E5',
                                                            fontWeight: 'bold',
                                                            transform: 'translateX(50%)',
                                                            top: '-40px'
                                                        }}
                                                    >
                                                        {nthUsersDiscipline[0]?.Count +
                                                            ' ' +
                                                            t('COMMON.REWARD_DISCIPLINE.TIMES')}
                                                    </Typography>
                                                </>
                                            )}
                                        </Box>

                                        <Box
                                            sx={{
                                                backgroundImage: 'url(/images/rank-3.svg)', // Gradient nền mượt mà
                                                width: 'calc(100%/ 3)',
                                                mt: '80px',
                                                height: '100%',
                                                backgroundSize: 'contain',
                                                backgroundPosition: 'center top',
                                                backgroundRepeat: 'no-repeat',
                                                position: 'relative'
                                            }}
                                        >
                                            {nthUsersDiscipline[2] && (
                                                <>
                                                    <Box
                                                        sx={{
                                                            width: '60px',
                                                            height: '60px',
                                                            position: 'absolute',
                                                            borderRadius: '50%',
                                                            right: '50%',
                                                            transform: 'translateX(50%)',
                                                            top: '-145px',
                                                            border: '2px solid red',
                                                            zIndex: 1,
                                                            overflow: 'visible', // Cho phép phần tử con thoát ra ngoài
                                                            // Thêm ::after để tạo hình vuông
                                                            '&::after': {
                                                                content: '""',
                                                                position: 'absolute',
                                                                bottom: '-8px', // Đặt hình vuông vào cuối avatar
                                                                left: '50%', // Căn giữa hình vuông
                                                                width: '17px', // Kích thước hình vuông
                                                                height: '17px',
                                                                borderRadius: '4px', // Bo tròn hình vuông
                                                                backgroundColor: 'red', // Màu nền của hình vuông
                                                                transform: 'translateX(-50%) rotate(45deg)', // Xoay hình vuông 45 độ
                                                                zIndex: 2 // Đặt hình vuông phía sau avatar
                                                            },
                                                            '&::before': {
                                                                content: '"3"', // Nội dung hiển thị số 1
                                                                position: 'absolute',
                                                                bottom: '-5px', // Đặt số 1 vào cùng vị trí với hình vuông
                                                                left: '50%', // Căn giữa số 1
                                                                transform: 'translateX(-50%)', // Đảm bảo số 1 không bị xoay
                                                                zIndex: 3, // Đặt số 1 lên trên hình vuông
                                                                display: 'flex', // Sử dụng flex để căn giữa
                                                                justifyContent: 'center', // Căn giữa theo chiều ngang
                                                                alignItems: 'center', // Căn giữa theo chiều dọc
                                                                fontSize: '10px', // Kích thước chữ
                                                                color: 'white', // Màu chữ
                                                                fontWeight: 'bold' // Đậm chữ
                                                            }
                                                        }}
                                                    >
                                                        <Avatar
                                                            src={nthUsersDiscipline[2]?.AvatarPath}
                                                            sx={{
                                                                position: 'absolute',
                                                                width: '55px',
                                                                height: '55px',
                                                                top: '0.5px',
                                                                left: '0.5px'
                                                            }}
                                                        ></Avatar>
                                                    </Box>

                                                    <Typography
                                                        sx={{
                                                            position: 'absolute',
                                                            right: '50%',
                                                            transform: 'translateX(50%)',
                                                            fontSize: '15px',
                                                            color: 'white',
                                                            fontWeight: 'bold',
                                                            top: '-70px'
                                                        }}
                                                    >
                                                        {nthUsersDiscipline[2]?.FullName.toString().split(' ').pop()}
                                                    </Typography>

                                                    <Typography
                                                        sx={{
                                                            position: 'absolute',
                                                            right: '50%',
                                                            fontSize: '16px',
                                                            color: 'white',
                                                            borderRadius: '8px',
                                                            padding: '4px 7px',
                                                            whiteSpace: 'nowrap',
                                                            backgroundColor: '#9087E5',
                                                            fontWeight: 'bold',
                                                            transform: 'translateX(50%)',
                                                            top: '-40px'
                                                        }}
                                                    >
                                                        {nthUsersDiscipline[2]?.Count +
                                                            ' ' +
                                                            t('COMMON.REWARD_DISCIPLINE.TIMES')}
                                                    </Typography>
                                                </>
                                            )}
                                        </Box>
                                    </Box>
                                </Box>
                                <Box
                                    sx={{
                                        position: 'absolute', // Bắt buộc để z-index hoạt động
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'left',
                                        bottom: '-260px',
                                        width: 'calc(100% - 20px)',
                                        left: '50%',
                                        padding: '45px 0px 2px 0px',
                                        transform: 'translateX(-50%)',
                                        backgroundImage: 'url(/images/userRank.svg)',
                                        backgroundSize: 'cover',
                                        fontSize: '20px',
                                        height: '290px',
                                        overflow: 'hidden',
                                        borderRadius: '0 0 12px 12px',
                                        zIndex: 3
                                    }}
                                >
                                    <Box
                                        sx={{
                                            overflow: 'auto',
                                            scrollbarGutter: 'stable',
                                            padding: '0 1px 7px 7px',
                                            '&::-webkit-scrollbar': {
                                                width: '7px',
                                                height: '7px'
                                            },
                                            '&::-webkit-scrollbar-thumb': {
                                                backgroundColor: '#cecece',
                                                borderRadius: '10px'
                                            }
                                        }}
                                    >
                                        {nthUsersDiscipline?.map((user, index) => (
                                            <Box
                                                key={index}
                                                sx={{
                                                    '&:hover': {
                                                        backgroundColor: 'var(--hover-color)',
                                                        cursor: 'pointer'
                                                    },
                                                    borderRadius: '10px',
                                                    padding: '5px 6px',
                                                    display: 'flex',
                                                    justifyContent: 'left',
                                                    alignItems: 'center'
                                                }}
                                            >
                                                {index === 0 ? (
                                                    <img
                                                        src='/images/cup.svg'
                                                        style={{
                                                            width: '20px',
                                                            marginRight: '15px'
                                                        }}
                                                    ></img>
                                                ) : (
                                                    <Box
                                                        sx={{
                                                            color: 'white',
                                                            fontSize: '13px',
                                                            borderRadius: '50%',
                                                            border:
                                                                index === 0
                                                                    ? '1px solid #FFAA00'
                                                                    : index === 1
                                                                    ? '1px solid #00D95F'
                                                                    : index === 2
                                                                    ? '1px solid red'
                                                                    : '1px solid rgb(59, 59, 59)',
                                                            width: '20px',
                                                            height: '20px',
                                                            display: 'flex',
                                                            backgroundColor:
                                                                index === 0
                                                                    ? '#FFAA00'
                                                                    : index === 1
                                                                    ? '#00D95F'
                                                                    : index === 2
                                                                    ? 'red'
                                                                    : 'rgb(59, 59, 59)',
                                                            justifyContent: 'center',
                                                            alignItems: 'center',
                                                            marginRight: '15px'
                                                        }}
                                                    >
                                                        {index + 1}
                                                    </Box>
                                                )}
                                                <Box>
                                                    <Avatar
                                                        sx={{
                                                            mr: '12px',
                                                            width: '45px',
                                                            height: '45px'
                                                        }}
                                                        src={
                                                            user.AvatarPath ||
                                                            'https://localhost:44381/avatars/aa1678f0-75b0-48d2-ae98-50871178e9bd.jfif'
                                                        }
                                                    />
                                                </Box>
                                                <Box>
                                                    <Typography
                                                        sx={{
                                                            color: '#0C092A',
                                                            fontWeight: 'bold',
                                                            fontSize: '16px'
                                                        }}
                                                    >
                                                        {user.FullName}
                                                    </Typography>
                                                    <Typography
                                                        sx={{
                                                            color: '#858494',
                                                            fontSize: '14px'
                                                        }}
                                                    >
                                                        {user.EmployeeId}
                                                    </Typography>
                                                </Box>
                                                <Box
                                                    sx={{
                                                        fontSize: '16px',
                                                        color: 'white',
                                                        marginLeft: 'auto',
                                                        borderRadius: '8px',
                                                        display: 'flex',
                                                        justifyContent: 'center',
                                                        alignItems: 'center',
                                                        padding: '4px 7px',
                                                        whiteSpace: 'nowrap',
                                                        backgroundColor: '#37cf79e6',
                                                        fontWeight: 'bold'
                                                    }}
                                                >
                                                    <Star
                                                        size={16}
                                                        style={{
                                                            color: '#FFAA00',
                                                            fill: '#FFAA00',
                                                            verticalAlign: 'middle',
                                                            marginRight: '6px'
                                                        }}
                                                    />
                                                    {user.Count}
                                                </Box>
                                            </Box>
                                        ))}
                                    </Box>
                                </Box>
                            </Box>
                        )}
                    </Box>
                </Box>
            </Paper>
        </Box>
    )
}

export default Page
