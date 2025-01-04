import { MessageCircleMore } from 'lucide-react'
import { Box, Tooltip, TextField, IconButton } from '@mui/material'
import { useState } from 'react'
import { Close as CloseIcon, Send as SendIcon } from '@mui/icons-material'
import { useCreateMessageMutation, useGetAllMessageQuery } from '@/services/MessageService'
import { IMessageGetAll } from '@/models/Message'
import { GoogleGenerativeAI } from '@google/generative-ai'

// Access your API key as an environment variable (see "Set up your API key" above)
const genAI = new GoogleGenerativeAI('AIzaSyAGW_ofMFvk9YoadeM9eq9j931Bb_58l5s')

const formatDate = (date: Date | string) => {
    const dateObj = typeof date === 'string' ? new Date(date) : date // Chuyển đổi nếu là chuỗi
    const options: Intl.DateTimeFormatOptions = {
        month: '2-digit',
        day: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false // Để sử dụng định dạng 24 giờ
    }
    return dateObj.toLocaleString('en-GB', options).replace(',', '') // Định dạng theo kiểu dd:mm:yyyy
}

export default function ChatButton() {
    const [isOpen, setIsOpen] = useState(false)
    const [isAppear, setIsAppear] = useState(true)
    const [messages, setMessages] = useState([])
    const [newMessage, setNewMessage] = useState('')
    const [type, setType] = useState(true)

    const [createMessage] = useCreateMessageMutation()
    const { data: responseData } = useGetAllMessageQuery()
    const messageData = (responseData?.Data as IMessageGetAll[]) || []

    const handleToggleChat = () => {
        setIsOpen(true)
        setIsAppear(false)
    }

    const handleCloseChat = () => {
        setIsOpen(false)
        setIsAppear(true)
    }

    const handleSendMessage = async () => {
        if (newMessage.trim()) {
            setMessages([...messages, { text: newMessage, sender: 'user' }])
            setNewMessage('')
            setType(true)

            try {
                // Gọi API createMessage
                await createMessage({ Content: newMessage, Type: type })
                    .unwrap()
                    .then(response => {
                        console.log('Message sent successfully:', response)
                    })
                    .catch(err => {
                        console.error('Lỗi khi gửi tin nhắn:', err)
                    })
                const modelResponse = await runPrompt(newMessage) // Gửi tin nhắn người dùng và nhận phản hồi từ API

                // Lưu phản hồi của chatbot vào cơ sở dữ liệu
                await createMessage({ Content: modelResponse, Type: false }).unwrap()

                // Cập nhật lại danh sách tin nhắn để hiển thị phản hồi
                setMessages([...messages, { text: modelResponse, sender: 'bot' }])
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
    }

    const runPrompt = async userMessage => {
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })

        const chat = model.startChat({
            history: [
                {
                    role: 'user',
                    parts: [{ text: 'Gần đây tôi cảm thấy căng thẳng với khối lượng công việc.' }] // Thông điệp từ nhân viên
                },
                {
                    role: 'model',
                    parts: [{ text: 'Tôi hiểu bạn. Cụ thể điều gì khiến bạn cảm thấy căng thẳng?' }]
                }
            ],
            generationConfig: {
                maxOutputTokens: 2000
            }
        })

        // Phân tích cảm xúc trong thông điệp của nhân viên
        // const sentimentAnalysis = await analyzeSentiment(userMessage)

        // // Dựa trên phân tích cảm xúc, tạo phản hồi hợp lý
        // let responseText = await generateResponse(sentimentAnalysis)

        const result = await chat.sendMessage(userMessage)
        try {
            const response = await result.response
            const text = response.text()
            return text
        } catch (err) {
            console.error('Lỗi khi nhận phản hồi từ mô hình:', err)
        }
    }

    // Hàm phân tích cảm xúc
    // const analyzeSentiment = async message => {
    //     try {
    //         const sentimentApiResponse = await fetch('https://sentiment-analysis-api.com', {
    //             method: 'POST',
    //             headers: {
    //                 'Content-Type': 'application/json'
    //             },
    //             body: JSON.stringify({ text: message })
    //         })

    //         if (!sentimentApiResponse.ok) {
    //             throw new Error('Yêu cầu API thất bại với mã trạng thái ' + sentimentApiResponse.status)
    //         }

    //         const sentimentData = await sentimentApiResponse.json()
    //         return sentimentData
    //     } catch (error) {
    //         console.error('Lỗi khi phân tích cảm xúc:', error)
    //         return { sentiment: 'neutral' } // Trả về cảm xúc mặc định nếu có lỗi
    //     }
    // }

    // // Hàm tạo phản hồi dựa trên kết quả phân tích cảm xúc
    // const generateResponse = sentimentAnalysis => {
    //     let responseText = ''

    //     // Phân tích cảm xúc và đưa ra phản hồi phù hợp trong môi trường quản lý nhân sự
    //     if (sentimentAnalysis.sentiment === 'positive') {
    //         responseText =
    //             'Có vẻ như bạn đang có một trải nghiệm tích cực. Làm sao tôi có thể hỗ trợ bạn để duy trì tinh thần này?'
    //     } else if (sentimentAnalysis.sentiment === 'negative') {
    //         responseText =
    //             'Rất tiếc khi nghe bạn cảm thấy căng thẳng. Bạn có muốn chia sẻ thêm về khối lượng công việc hoặc cần hỗ trợ gì để giảm tải không?'
    //     } else {
    //         responseText =
    //             'Cảm ơn bạn đã chia sẻ. Tôi có thể hỗ trợ bạn như thế nào để cải thiện công việc hoặc giải quyết vấn đề của bạn?'
    //     }

    //     return responseText
    // }

    return (
        <>
            {/* Nút chat */}
            {isAppear && (
                <Box
                    onClick={handleToggleChat}
                    sx={{
                        position: 'fixed',
                        bottom: '0rem',
                        right: '0.5rem',
                        zIndex: 1000,
                        animation: `${isAppear ? 'slideUp' : 'slideDown'} 0.5s ease forwards`
                    }}
                >
                    <Tooltip title='Chat với chúng tôi' placement='left'>
                        <Box
                            sx={{
                                width: '50px',
                                height: '50px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                backgroundColor: 'var(--button-color)',
                                color: 'white',
                                boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
                                borderRadius: '45px',
                                padding: '10px',
                                '&:hover': {
                                    backgroundColor: 'var(--hover-button-color)'
                                },
                                cursor: 'pointer'
                            }}
                        >
                            <MessageCircleMore size={28} />
                        </Box>
                    </Tooltip>
                </Box>
            )}
            {/* Chat box (hiển thị khi isOpen = true) */}
            {isOpen && (
                <Box
                    sx={{
                        position: 'fixed',
                        bottom: '2rem',
                        right: '0.5rem',
                        width: '400px',
                        height: '500px',
                        backgroundColor: 'white',
                        borderRadius: '12px',
                        boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
                        zIndex: 999,
                        overflow: 'hidden', // Ngăn không cho phần tử cha cuộn
                        display: 'flex',
                        flexDirection: 'column'
                    }}
                >
                    {/* Header */}
                    <Box
                        sx={{
                            p: 2,
                            borderBottom: '1px solid var(--border-color)',
                            backgroundColor: 'var(--button-color)',
                            color: 'white',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center'
                        }}
                    >
                        Chat với chúng tôi
                        <IconButton onClick={handleCloseChat} sx={{ color: 'white' }}>
                            <CloseIcon />
                        </IconButton>
                    </Box>

                    {/* Chat content */}
                    <Box
                        sx={{
                            flex: 1,
                            padding: 2,
                            overflowY: 'auto', // Chỉ phần tử này cuộn
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 1
                        }}
                    >
                        {messageData.map((message, index) => (
                            <Tooltip title={formatDate(message.CreatedAt)} key={index}>
                                <Box
                                    sx={{
                                        alignSelf: message.Type === true ? 'flex-end' : 'flex-start',
                                        backgroundColor: message.Type === true ? 'var(--button-color)' : '#f1f1f1',
                                        color: message.Type === true ? 'white' : 'black',
                                        borderRadius: '12px',
                                        padding: '8px 12px',
                                        maxWidth: '70%',
                                        wordWrap: 'break-word', // Tự động ngắt dòng nếu từ quá dài
                                        whiteSpace: 'pre-wrap'
                                    }}
                                >
                                    {message.Content}
                                </Box>
                            </Tooltip>
                        ))}
                    </Box>

                    {/* Input box */}
                    <Box
                        sx={{
                            p: 2,
                            borderTop: '1px solid var(--border-color)',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1
                        }}
                    >
                        <TextField
                            fullWidth
                            value={newMessage}
                            onChange={e => setNewMessage(e.target.value)}
                            placeholder='Nhập tin nhắn...'
                            variant='outlined'
                            size='small'
                            multiline
                            sx={{ flex: 1 }}
                        />
                        <IconButton onClick={handleSendMessage} color='primary' disabled={!newMessage.trim()}>
                            <SendIcon />
                        </IconButton>
                    </Box>
                </Box>
            )}

            {/* CSS Animations */}
            <style>
                {`
                @keyframes slideUp {
                    0% {
                        transform: translateY(100%);
                        opacity: 0;
                    }
                    100% {
                        transform: translateY(0);
                        opacity: 1;
                    }
                }
                
                @keyframes slideDown {
                    0% {
                        transform: translateY(0);
                        opacity: 1;
                    }
                    100% {
                        transform: translateY(100%);
                        opacity: 0;
                    }
                }
                `}
            </style>
        </>
    )
}
