'use client'
import {
    Box,
    Select,
    Typography,
    MenuItem,
    SelectChangeEvent,
    Paper,
    Button,
    FormControl,
    InputLabel,
    LinearProgress
} from '@mui/material'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { GoogleGenerativeAI } from '@google/generative-ai'
import { useGetAllMessageToAnalyticsQuery } from '@/services/MessageService'

// Access your API key as an environment variable (see "Set up your API key" above)
const genAI = new GoogleGenerativeAI('AIzaSyAGW_ofMFvk9YoadeM9eq9j931Bb_58l5s')

// function getContractBgColor(contractEnd: string): string {
//     const today = new Date()
//     const endDate = new Date(contractEnd)

//     const diffInMilliseconds = endDate.getTime() - today.getTime()
//     const diffInMonths = diffInMilliseconds / (1000 * 60 * 60 * 24 * 30)

//     if (diffInMonths <= 2) {
//         return 'var(--bg-danger-color)'
//     } else if (diffInMonths <= 4) {
//         return 'var(--bg-warning-color)'
//     } else {
//         return 'var(--bg-success-color)'
//     }
// }

// function getContractTextColor(contractEnd: string): string {
//     const today = new Date()
//     const endDate = new Date(contractEnd)

//     const diffInMilliseconds = endDate.getTime() - today.getTime()
//     const diffInMonths = diffInMilliseconds / (1000 * 60 * 60 * 24 * 30)

//     if (diffInMonths <= 2) {
//         return 'var(--text-danger-color)'
//     } else if (diffInMonths <= 4) {
//         return 'var(--text-warning-color)'
//     } else {
//         return 'var(--text-success-color)'
//     }
// }

function Page() {
    const { t } = useTranslation('common')

    const [type, setType] = useState<number>(0)
    const [overallAnalysis, setOverallAnalysis] = useState<string>()

    const handleTypeChange = (event: SelectChangeEvent<number>) => {
        setType(event.target.value as number)
    }

    const { data: messageResponse, refetch, isFetching } = useGetAllMessageToAnalyticsQuery(type)

    const messages = messageResponse?.Data

    const [isLoadingAnalyzing, setIsLoadingAnalyzing] = useState<boolean>(false)

    useEffect(() => {
        refetch()
    }, [type])

    useEffect(() => {
        handleSendMessage(messages)
    }, [messages])

    const handleSendMessage = async messages => {
        try {
            if (messages === undefined || messages.length === 0) {
                return
            }
            // Tổng hợp phân tích từ danh sách câu hỏi
            setOverallAnalysis(await analyzeOverallMessages(messages))
        } catch (error) {
            console.error('Lỗi khi gửi tin nhắn:', error)
            if (error instanceof Error) {
                console.error('Lỗi chi tiết:', error.message)
            } else {
                console.error('Lỗi không xác định', error)
            }
            // Có thể thêm logic hiển thị lỗi cho người dùng
        }
    }

    // Hàm phân tích tổng hợp cảm xúc từ danh sách tin nhắn
    const analyzeOverallMessages = async messages => {
        const prompt = `
                Dựa trên các câu hỏi sau, hãy tổng hợp và phân tích để tạo ra giải pháp quản lý việc đọc và giúp đỡ nhân viên, bao gồm:
                - Tổng quan về các câu hỏi liên quan đến việc đọc và hỗ trợ nhân viên.
                - Các vấn đề nổi bật hoặc mối quan tâm chung liên quan đến việc đọc và sự hỗ trợ cho nhân viên.
                - Nguyên nhân có thể hoặc ngữ cảnh liên quan đến việc đọc và giúp đỡ nhân viên.
                - Những giải pháp có thể giúp nâng cao hiệu quả quản lý việc đọc và hỗ trợ nhân viên.
                - Kết luận về phương pháp cải thiện việc giúp đỡ nhân viên trong công việc.
        
                Trả lời khoảng 6 - 7 câu thôi.

                Danh sách các câu hỏi: ${messages?.map(msg => `"${msg}"`).join(', ')}
        
                Trả lời bằng tiếng Việt theo định dạng:
            "Các câu hỏi nêu trên liên quan đến
            [tổng quan nội dung về việc đọc và hỗ trợ nhân viên].
            Gặp vấn đề về
            [vấn đề nổi bật].
            Nguyên nhân có thể là
            [ngữ cảnh hoặc nguyên nhân của vấn đề].
            Giải pháp có thể bao gồm
            [các giải pháp nâng cao việc đọc và giúp đỡ nhân viên].
            Kết luận cho các vấn đề này là
            [kết luận về việc cải thiện việc hỗ trợ nhân viên]."
            `

        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })

        try {
            setIsLoadingAnalyzing(true)
            const result = await model.generateContent(prompt)
            const response = await result.response
            console.log('Phân tích tổng hợp:', response.text())
            const analysis = response.text().trim()
            return analysis
        } catch (error) {
            console.error('Lỗi phân tích tổng hợp:', error)
            return 'Không thể phân tích thông điệp lúc này.'
        } finally {
            setIsLoadingAnalyzing(false)
        }
    }

    return (
        <Box>
            <Paper
                elevation={0}
                sx={{
                    width: '100%',
                    padding: '24px',
                    overflow: 'hidden',
                    boxShadow: 'var(--box-shadow-paper)',
                    borderRadius: '15px',
                    backgroundColor: 'var(--background-item)'
                }}
            >
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                        <img
                            src='/images/market-trends.png'
                            width='50px'
                            style={{
                                marginBottom: '-5px'
                            }}
                        />
                        <Typography
                            sx={{
                                color: 'var(--text-color)',
                                fontWeight: 'bold',
                                fontSize: '18px',
                                display: 'flex',
                                alignItems: 'center'
                            }}
                        >
                            {t('COMMON.DASHBOARD.Analysis')}
                        </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
                        <FormControl
                            sx={{
                                width: '140px',
                                mb: 'auto',
                                '& fieldset': {
                                    borderRadius: '8px',
                                    borderColor: 'var(--border-color)' // Viền mặc định
                                },
                                '& .MuiOutlinedInput-root:hover fieldset': {
                                    borderColor: 'var(--hover-field-color)' // Màu hover khi không lỗi
                                },
                                '& .MuiOutlinedInput-root.Mui-error:hover fieldset': {
                                    borderColor: 'var(--error-color)' // Màu hover khi lỗi
                                },
                                '& .MuiOutlinedInput-root.Mui-error fieldset': {
                                    borderColor: 'var(--error-color)' // Màu viền khi lỗi
                                },
                                '& .MuiOutlinedInput-root.Mui-focused fieldset': {
                                    borderColor: 'var(--selected-field-color)' // Màu viền khi focus
                                },
                                '& .MuiOutlinedInput-root.Mui-error.Mui-focused fieldset': {
                                    borderColor: 'var(--error-color)' // Màu viền khi lỗi và focus
                                },
                                '& .MuiInputLabel-root': {
                                    color: 'var(--text-label-color)' // Label mặc định
                                },
                                '& .MuiInputLabel-root.Mui-focused': {
                                    color: 'var(--selected-field-color)' // Label khi focus
                                },
                                '& .MuiInputLabel-root.Mui-error': {
                                    color: 'var(--error-color)' // Label khi lỗi
                                }
                            }}
                        >
                            <InputLabel id='select-label'>{t('COMMON.STAT_NOTIFY.BY')}</InputLabel>
                            <Select
                                label={t('COMMON.STAT_NOTIFY.BY')}
                                defaultValue={0}
                                value={type}
                                onChange={handleTypeChange}
                                sx={{
                                    '&:hover .MuiOutlinedInput-notchedOutline': {
                                        borderColor: 'var(--border-color)'
                                    },
                                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                        border: '1px solid var(--border-color)' // Đặt border cho trạng thái focus
                                    },
                                    '& fieldset': {
                                        borderRadius: '8px',
                                        borderColor: 'var(--border-color)'
                                    },
                                    '& .MuiSelect-icon': {
                                        color: 'var(--text-color)'
                                    },
                                    '& .MuiInputBase-input': {
                                        color: 'var(--text-color)',
                                        padding: '9.5px 14px'
                                    }
                                }}
                                MenuProps={{
                                    PaperProps: {
                                        elevation: 0,
                                        sx: {
                                            width: '140px',
                                            mt: '4px',
                                            borderRadius: '8px',
                                            padding: '0 8px',
                                            backgroundImage:
                                                'url(data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIwIiBoZWlnaHQ9IjEyMCIgdmlld0JveD0iMCAwIDEyMCAxMjAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMjAiIGhlaWdodD0iMTIwIiBmaWxsPSJ1cmwoI3BhaW50MF9yYWRpYWxfMjc0OV8xNDUxODYpIiBmaWxsLW9wYWNpdHk9IjAuMTIiLz4KPGRlZnM+CjxyYWRpYWxHcmFkaWVudCBpZD0icGFpbnQwX3JhZGlhbF8yNzQ5XzE0NTE4NiIgY3g9IjAiIGN5PSIwIiByPSIxIiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSIgZ3JhZGllbnRUcmFuc2Zvcm09InRyYW5zbGF0ZSgxMjAgMS44MTgxMmUtMDUpIHJvdGF0ZSgtNDUpIHNjYWxlKDEyMy4yNSkiPgo8c3RvcCBzdG9wLWNvbG9yPSIjMDBCOEQ5Ii8+CjxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iIzAwQjhEOSIgc3RvcC1vcGFjaXR5PSIwIi8+CjwvcmFkaWFsR3JhZGllbnQ+CjwvZGVmcz4KPC9zdmc+Cg==), url(data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIwIiBoZWlnaHQ9IjEyMCIgdmlld0JveD0iMCAwIDEyMCAxMjAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMjAiIGhlaWdodD0iMTIwIiBmaWxsPSJ1cmwoI3BhaW50MF9yYWRpYWxfMjc0OV8xNDUxODcpIiBmaWxsLW9wYWNpdHk9IjAuMTIiLz4KPGRlZnM+CjxyYWRpYWxHcmFkaWVudCBpZD0icGFpbnQwX3JhZGlhbF8yNzQ5XzE0NTE4NyIgY3g9IjAiIGN5PSIwIiByPSIxIiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSIgZ3JhZGllbnRUcmFuc2Zvcm09InRyYW5zbGF0ZSgwIDEyMCkgcm90YXRlKDEzNSkgc2NhbGUoMTIzLjI1KSI+CjxzdG9wIHN0b3AtY29sb3I9IiNGRjU2MzAiLz4KPHN0b3Agb2Zmc2V0PSIxIiBzdG9wLWNvbG9yPSIjRkY1NjMwIiBzdG9wLW9wYWNpdHk9IjAiLz4KPC9yYWRpYWxHcmFkaWVudD4KPC9kZWZzPgo8L3N2Zz4K)',
                                            backgroundPosition: 'top right, bottom left',
                                            backgroundSize: '50%, 50%',
                                            backgroundRepeat: 'no-repeat',
                                            backdropFilter: 'blur(20px)',
                                            backgroundColor: 'var(--background-item)',
                                            color: 'var(--text-color)',
                                            border: '1px solid var(--border-color)',
                                            '& .MuiMenuItem-root': {
                                                '&:hover': { backgroundColor: 'var(--hover-color)' },
                                                '&.Mui-selected': {
                                                    backgroundColor: 'var(--background-selected-item)',
                                                    '&:hover': { backgroundColor: 'var(--hover-color)' }
                                                }
                                            }
                                        }
                                    },
                                    anchorOrigin: {
                                        vertical: 'bottom',
                                        horizontal: 'right' // Căn chỉnh bên phải
                                    },
                                    transformOrigin: {
                                        vertical: 'top',
                                        horizontal: 'right' // Căn chỉnh bên phải
                                    }
                                }}
                            >
                                <MenuItem
                                    value={0}
                                    sx={{
                                        borderRadius: '6px'
                                    }}
                                >
                                    {t('COMMON.USER.TODAY')}
                                </MenuItem>

                                <MenuItem
                                    value={1}
                                    sx={{
                                        mt: '3px',
                                        borderRadius: '6px'
                                    }}
                                >
                                    {t('COMMON.USER.THIS_WEEK')}
                                </MenuItem>

                                <MenuItem
                                    value={2}
                                    sx={{
                                        borderRadius: '6px',
                                        mt: '3px'
                                    }}
                                >
                                    {t('COMMON.USER.THIS_MONTH')}
                                </MenuItem>

                                <MenuItem
                                    value={3}
                                    sx={{
                                        borderRadius: '6px',
                                        mt: '3px'
                                    }}
                                >
                                    {t('COMMON.USER.THIS_YEAR')}
                                </MenuItem>
                            </Select>
                        </FormControl>
                        <Button
                            variant='outlined'
                            onClick={() => refetch()}
                            sx={{
                                color: '#ffffff',
                                padding: '7.5px 20px',
                                fontWeight: 'bold',
                                textTransform: 'none',
                                backgroundColor: '#FF5630',
                                border: 'none !important',
                                '&:hover': {
                                    backgroundColor: '#b71d18',
                                    boxShadow: '0px 4px 8px rgba(183, 29, 24, 0.50)'
                                },
                                borderRadius: '8px'
                            }}
                        >
                            {t('COMMON.CALENDAR.REFRESH')}
                        </Button>
                    </Box>
                </Box>
                <Box
                    sx={{
                        color: 'var(--text-color)',
                        mt: '24px'
                    }}
                >
                    {isFetching || isLoadingAnalyzing || messages === undefined || messages.length === 0 ? (
                        <Box
                            sx={{
                                width: '100%',
                                height: '350px',
                                display: 'flex', // Sử dụng flexbox để căn giữa
                                alignItems: 'center', // Căn giữa theo trục dọc
                                justifyContent: 'center' // Căn giữa theo trục ngang
                            }}
                        >
                            <Box
                                sx={{
                                    width: '40%',
                                    textAlign: 'center',
                                    position: 'relative'
                                }}
                            >
                                <LinearProgress
                                    sx={{
                                        height: 4,
                                        backgroundColor: 'var(--button-alert-color)',
                                        borderRadius: '2px',
                                        '& .MuiLinearProgress-bar': {
                                            backgroundColor: 'var(--text-color)'
                                        }
                                    }}
                                />
                            </Box>
                        </Box>
                    ) : (
                        overallAnalysis
                            ?.replaceAll('**', '')
                            .split('.')
                            .map((sentence, index) => {
                                return (
                                    sentence.trim() && (
                                        <Box
                                            key={index}
                                            sx={{
                                                '&:not(:first-of-type)': {
                                                    mt: '8px'
                                                },
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '15px'
                                            }}
                                        >
                                            <img src='/images/finger.png' width='20px' />
                                            <Typography
                                                sx={{
                                                    fontSize: '16px',
                                                    lineHeight: '24px'
                                                }}
                                            >
                                                {sentence}.
                                            </Typography>
                                        </Box>
                                    )
                                )
                            })
                    )}
                </Box>
            </Paper>
        </Box>
    )
}

export default Page
