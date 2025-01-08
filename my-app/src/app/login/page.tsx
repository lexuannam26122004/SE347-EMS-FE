'use client'
import React, { useState } from 'react'
import { Box, Button, Typography, Link } from '@mui/material'
import { useToast } from '@/hooks/useToast'
import { useRouter } from 'next/navigation'
import { useTranslation } from 'react-i18next'
import IconButton from '@mui/material/IconButton'
import OutlinedInput from '@mui/material/OutlinedInput'
import InputLabel from '@mui/material/InputLabel'
import InputAdornment from '@mui/material/InputAdornment'
import FormControl from '@mui/material/FormControl'
import Visibility from '@mui/icons-material/Visibility'
import VisibilityOff from '@mui/icons-material/VisibilityOff'
import LanguageMenu from '@/components/LanguageMenu'
import ColorModeIconDropdown from '@/components/ColorModeIconDropdown'
import { useGetAuthMeQuery } from '@/services/AuthService'
import { useCreateAttendanceUserMutation } from '@/services/UserAttendanceService'

const LoginForm: React.FC = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [isSubmit, setIsSubmit] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const toast = useToast()
    const router = useRouter()
    const { t } = useTranslation('common')
    const [showPassword, setShowPassword] = React.useState(false)
    const [createAttendanceUser] = useCreateAttendanceUserMutation()

    const handleClickShowPassword = () => setShowPassword(show => !show)

    const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault()
    }

    const handleMouseUpPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault()
    }

    const handleClick = () => {
        router.push('/')
    }

    const { data: responseData, refetch } = useGetAuthMeQuery()
    const infoData = responseData?.Data

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmit(true)
        if (email === '' || password === '') {
            return
        }
        setIsLoading(true)

        const loginData = {
            Email: email,
            Password: password
        }

        try {
            const responseIP = await fetch('https://api.ipify.org?format=json')
            const IPdata = await responseIP.json()

            const response = await fetch('https://localhost:44381/api/Auth/Login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json-patch+json'
                },
                body: JSON.stringify(loginData)
            })

            const data = await response.json()

            if (response.ok) {
                const token = data.Data.auth_token
                sessionStorage.setItem('auth_token', token)
                try {
                    const responseAttendance = await createAttendanceUser(IPdata.ip).unwrap()

                    await refetch()

                    if (infoData !== null) {
                        if (infoData?.IsAdmin === false) {
                            router.push('/user')
                        } else {
                            router.push('/admin')
                        }
                    } else {
                        return
                    }

                    sessionStorage.setItem('AttendanceId', responseAttendance.Data.Id)
                    toast('Đăng nhập thành công!', 'success')
                } catch (error) {
                    console.error('Lỗi từ API:', error)
                    sessionStorage.removeItem('auth_token')
                    toast('Tên tài khoản hoặc mật khẩu không đúng!', 'error')
                }
            } else {
                toast(data?.message || 'Đăng nhập thất bại!', 'error')
            }
        } catch {
            //toast('Đã xảy ra lỗi. Vui lòng thử lại sau!', 'error')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Box
            sx={{
                minHeight: '100vh',
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                position: 'relative',
                textAlign: 'center'
            }}
        >
            <img
                onClick={handleClick}
                src='/images/logo.png'
                style={{
                    position: 'absolute',
                    top: '20px',
                    left: '20px',
                    cursor: 'pointer',
                    height: '50px',
                    transition: 'all 300ms ease-in-out'
                }}
            />

            <Box
                sx={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'stretch'
                }}
            >
                <Box
                    sx={{
                        width: 'calc(100% / 5 * 1.8)',
                        padding: '90px 24px',
                        minHeight: '100vh',
                        backgroundImage:
                            'linear-gradient(0deg, var(--palette-background-defaultChannel), var(--palette-background-defaultChannel)), url(https://assets.minimals.cc/public/assets/background/background-3-blur.webp)',
                        backgroundSize: 'cover',
                        backgroundRepeat: 'no-repeat',
                        backgroundPosition: 'center center',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center'
                    }}
                >
                    <Typography
                        sx={{
                            fontSize: '30px',
                            color: 'var(--text-color)',
                            fontWeight: 'bold'
                        }}
                    >
                        {t('COMMON.LOGIN.HI')}
                    </Typography>
                    <Typography
                        sx={{
                            mt: '15px',
                            fontSize: '17px',
                            color: 'var(--sub-title-color)'
                        }}
                    >
                        {t('COMMON.LOGIN.MORE_EFFECTIVELY')}
                    </Typography>
                    <Box
                        sx={{
                            mt: '50px',
                            width: '432px'
                        }}
                    >
                        <img
                            alt='Dashboard illustration'
                            src='https://assets.minimals.cc/public/assets/illustrations/illustration-dashboard.webp'
                            style={{
                                width: '100%',
                                objectFit: 'cover',
                                aspectRatio: '4/3'
                            }}
                        ></img>
                    </Box>

                    <Box
                        sx={{
                            display: 'flex',
                            gap: '16px',
                            mt: '50px',
                            alignItems: 'center'
                        }}
                    >
                        <Box>
                            <img
                                alt='Jwt'
                                src='https://assets.minimals.cc/public/assets/icons/platforms/ic-jwt.svg'
                                style={{ width: '40px', height: '40px' }} // Tuỳ chỉnh kích thước icon
                            />
                        </Box>
                        <Box>
                            <img
                                alt='Firebase'
                                src='https://assets.minimals.cc/public/assets/icons/platforms/ic-firebase.svg'
                                style={{ width: '40px', height: '40px' }}
                            />
                        </Box>
                        <Box>
                            <img
                                alt='Amplify'
                                src='https://assets.minimals.cc/public/assets/icons/platforms/ic-amplify.svg'
                                style={{ width: '40px', height: '40px' }}
                            />
                        </Box>
                        <Box>
                            <img
                                alt='Auth0'
                                src='https://assets.minimals.cc/public/assets/icons/platforms/ic-auth0.svg'
                                style={{ width: '40px', height: '40px' }}
                            />
                        </Box>
                        <Box>
                            <img
                                alt='Supabase'
                                src='https://assets.minimals.cc/public/assets/icons/platforms/ic-supabase.svg'
                                style={{ width: '40px', height: '40px' }}
                            />
                        </Box>
                    </Box>
                </Box>
                <Box
                    sx={{
                        width: 'calc(100% / 5 * 3.2)',
                        minHeight: '100vh',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                        position: 'relative'
                    }}
                >
                    <Box
                        sx={{
                            position: 'absolute',
                            top: '24px',
                            right: '24px',
                            display: 'flex',
                            gap: '16px',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}
                    >
                        <LanguageMenu />
                        <ColorModeIconDropdown />
                    </Box>
                    <Box
                        sx={{
                            width: '450px',
                            display: 'flex',
                            mt: '-40px',
                            flexDirection: 'column',
                            justifyContent: 'center'
                        }}
                    >
                        <img
                            src='/images/login-img.png'
                            style={{
                                width: '220px',
                                margin: '0 auto'
                            }}
                        />
                        <Typography
                            sx={{
                                mr: 'auto',
                                fontSize: '22px',
                                fontWeight: 'bold',
                                color: 'var(--text-color)'
                            }}
                        >
                            {t('COMMON.LOGIN.SIGN_IN_TO_YOUR_ACCOUNT')}
                        </Typography>

                        <Box
                            sx={{
                                width: '100%',
                                mt: '40px',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'left'
                            }}
                        >
                            <form autoComplete='off'>
                                <FormControl sx={{ width: '100%' }} variant='outlined'>
                                    <InputLabel
                                        htmlFor='outlined-adornment-username'
                                        {...(isSubmit && email === '' && { error: true })}
                                        sx={{
                                            color: 'var(--text-label-color)',
                                            '&.Mui-focused': {
                                                color: 'var(--selected-field-color)'
                                            },
                                            '&.Mui-error': {
                                                color: 'var(--error-color) !important' // Màu khi có lỗi
                                            }
                                        }}
                                        shrink
                                    >
                                        {t('COMMON.LOGIN.USERNAME')}
                                    </InputLabel>
                                    <OutlinedInput
                                        notched
                                        onKeyDown={e => {
                                            if (e.key === 'Enter') {
                                                handleSubmit(e) // Gọi hàm submit khi nhấn Enter
                                            }
                                        }}
                                        tabIndex={0} // Thêm thuộc tính tabIndex
                                        placeholder={t('COMMON.LOGIN.USERNAME_PLACEHOLDER')}
                                        id='outlined-adornment-username'
                                        {...(isSubmit && email === '' && { error: true })}
                                        autoComplete='off' // Ngăn tự động điền
                                        sx={{
                                            '& .MuiInputBase-input': {
                                                padding: '15.5px 0 15.5px 14px',
                                                color: 'var(--text-color)',
                                                borderRadius: '8px',
                                                overflow: 'hidden'
                                            },
                                            '& fieldset': {
                                                borderColor: 'var(--border-color)',
                                                borderWidth: '1px',
                                                borderRadius: '8px',
                                                overflow: 'hidden'
                                            },
                                            '&:hover fieldset': {
                                                borderColor: 'var(--hover-field-color) !important' // Đảm bảo không bị ghi đè
                                            },
                                            '&.Mui-focused fieldset': {
                                                borderColor: 'var(--selected-field-color) !important',
                                                borderWidth: '2px' // Độ dày viền
                                            },
                                            '&.Mui-error:hover fieldset': {
                                                borderColor: 'var(--error-color) !important'
                                            },
                                            '&.Mui-error fieldset': {
                                                borderColor: 'var(--error-color) !important'
                                            }
                                        }}
                                        label={t('COMMON.LOGIN.USERNAME')}
                                        onChange={e => setEmail(e.target.value)}
                                    />
                                </FormControl>
                            </form>
                            <Typography
                                sx={{
                                    color: 'var(--error-color)',
                                    margin: '3px auto 0 12px',
                                    width: 'auto',
                                    fontSize: '12px',
                                    visibility: isSubmit && email === '' ? 'visible' : 'hidden'
                                }}
                            >
                                {t('COMMON.TEXTFIELD.REQUIRED')}
                            </Typography>
                        </Box>

                        <Link
                            href='/reset-password'
                            sx={{
                                fontSize: '15px',
                                textDecoration: 'none', // Xóa gạch chân
                                ml: 'auto',
                                color: 'var(--text-color)',
                                mt: '2px',
                                fontWeight: 'bold',
                                '&:hover': {
                                    textDecoration: 'underline' // Xóa gạch chân
                                }
                            }}
                            tabIndex={4} // Thêm thuộc tính tabIndex
                        >
                            {t('COMMON.LOGIN.FORGOT_PASSWORD')}
                        </Link>

                        <Box
                            sx={{
                                width: '100%',
                                mt: '10px',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'left'
                            }}
                        >
                            <FormControl sx={{ width: '100%' }} variant='outlined'>
                                <InputLabel
                                    {...(isSubmit && (password === '' || password.length < 8) && { error: true })}
                                    htmlFor='outlined-adornment-password'
                                    sx={{
                                        color: 'var(--text-label-color)',
                                        '&.Mui-focused': {
                                            color: 'var(--selected-field-color)'
                                        },
                                        '&.Mui-error': {
                                            color: 'var(--error-color) !important' // Màu khi có lỗi
                                        }
                                    }}
                                    shrink
                                >
                                    {t('COMMON.LOGIN.PASSWORD')}
                                </InputLabel>
                                <OutlinedInput
                                    placeholder={t('COMMON.LOGIN.8_CHARACTERS')}
                                    notched
                                    onKeyDown={e => {
                                        if (e.key === 'Enter') {
                                            handleSubmit(e) // Gọi hàm submit khi nhấn Enter
                                        }
                                    }}
                                    id='outlined-adornment-password'
                                    {...(isSubmit && (password === '' || password.length < 8) && { error: true })}
                                    autoComplete='off' // Ngăn tự động điền
                                    type={showPassword ? 'text' : 'password'}
                                    tabIndex={1}
                                    onChange={e => setPassword(e.target.value)}
                                    sx={{
                                        '& .MuiInputBase-input': {
                                            padding: '15.5px 0 15.5px 14px',
                                            color: 'var(--text-color)',
                                            borderRadius: '8px',
                                            overflow: 'hidden'
                                        },
                                        '& fieldset': {
                                            borderColor: 'var(--border-color)',
                                            borderWidth: '1px',
                                            borderRadius: '8px',
                                            overflow: 'hidden'
                                        },
                                        '&:hover fieldset': {
                                            borderColor: 'var(--hover-field-color) !important' // Đảm bảo không bị ghi đè
                                        },
                                        '&.Mui-focused fieldset': {
                                            borderColor: 'var(--selected-field-color) !important',
                                            borderWidth: '2px' // Độ dày viền
                                        },
                                        '&.Mui-error:hover fieldset': {
                                            borderColor: 'var(--error-color) !important'
                                        },
                                        '&.Mui-error fieldset': {
                                            borderColor: 'var(--error-color) !important'
                                        }
                                    }}
                                    endAdornment={
                                        <InputAdornment position='end'>
                                            <IconButton
                                                aria-label={showPassword ? 'hide the password' : 'display the password'}
                                                onClick={handleClickShowPassword}
                                                onMouseDown={handleMouseDownPassword}
                                                onMouseUp={handleMouseUpPassword}
                                                edge='end'
                                                sx={{
                                                    color: 'var(--text-label-color)'
                                                }}
                                            >
                                                {showPassword ? <VisibilityOff /> : <Visibility />}
                                            </IconButton>
                                        </InputAdornment>
                                    }
                                    label={t('COMMON.LOGIN.PASSWORD')}
                                />
                            </FormControl>
                            <Typography
                                sx={{
                                    color: 'var(--error-color)',
                                    margin: '3px auto 0 12px',
                                    width: 'auto',
                                    fontSize: '12px',
                                    visibility:
                                        isSubmit && (password === '' || password.length < 8) ? 'visible' : 'hidden'
                                }}
                            >
                                {password === ''
                                    ? t('COMMON.TEXTFIELD.REQUIRED')
                                    : t('COMMON.CHANGE_PASSWORD.LEAST_8_CHARACTERS')}
                            </Typography>
                        </Box>

                        <Button
                            variant='contained'
                            color='primary'
                            tabIndex={2}
                            sx={{
                                mt: '30px',
                                height: '100%',
                                fontSize: '18px',
                                padding: '9px',
                                fontWeight: 'bold',
                                color: 'var(--text-button-accept)',
                                backgroundColor: 'var(--bg-button-accept)',
                                borderRadius: '8px',
                                '&:hover': {
                                    backgroundColor: 'var(--bg-button-accept-hover)'
                                },
                                pointerEvents: isLoading ? 'none' : 'auto',
                                textTransform: 'none',
                                opacity: isLoading ? 0.7 : 1 // Làm mờ nhẹ khi đang loading
                            }}
                            onClick={handleSubmit}
                            onKeyDown={e => {
                                if (e.key === 'Enter') {
                                    handleSubmit(e)
                                }
                            }}
                        >
                            {t('COMMON.LOGIN.SIGN_IN')}
                        </Button>
                    </Box>
                </Box>
            </Box>
        </Box>
    )
}

export default LoginForm
