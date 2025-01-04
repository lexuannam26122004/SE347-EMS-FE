import { MessageCircleMore } from 'lucide-react'
import { Box, Tooltip, TextField, IconButton } from '@mui/material'
import { useState } from 'react'
import { Close as CloseIcon, Send as SendIcon } from '@mui/icons-material'

export default function ChatButton() {
    const [isOpen, setIsOpen] = useState(false)
    const [isAppear, setIsAppear] = useState(true)
    const [messages, setMessages] = useState([])
    const [newMessage, setNewMessage] = useState('')

    const handleToggleChat = () => {
        setIsOpen(true)
        setIsAppear(false)
    }

    const handleCloseChat = () => {
        setIsOpen(false)
        setIsAppear(true)
    }

    const handleSendMessage = () => {
        if (newMessage.trim()) {
            setMessages([...messages, { text: newMessage, sender: 'user' }])
            setNewMessage('')
        }
    }

    return (
        <>
            {/* Nút chat */}
            {isAppear && (
                <Box
                    onClick={handleToggleChat}
                    sx={{
                        position: 'fixed',
                        bottom: '0.5rem',
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
                        overflow: 'hidden',
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
                            overflowY: 'auto',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 1
                        }}
                    >
                        {messages.map((message, index) => (
                            <Box
                                key={index}
                                sx={{
                                    alignSelf: message.sender === 'user' ? 'flex-end' : 'flex-start',
                                    backgroundColor: message.sender === 'user' ? 'var(--button-color)' : '#f1f1f1',
                                    color: message.sender === 'user' ? 'white' : 'black',
                                    borderRadius: '12px',
                                    padding: '8px 12px',
                                    maxWidth: '70%'
                                }}
                            >
                                {message.text}
                            </Box>
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
