import React from 'react'
import MyTabs from './MyTabs' // Import MyTabs component
import { Box } from '@mui/material'
import { useRouter } from 'next/navigation'
import ColorModeIconDropdown from '@/components/ColorModeIconDropdown'
import LanguageMenu from '@/components/LanguageMenu'
import NotificationMenu from '@/components/NotificationMenu'
import AvatarMenu from '@/components/AvatarMenu'
import Chat from './Chat'

function Layout({ children }: { children: React.ReactNode }) {
    const router = useRouter()

    return (
        <Box
            component='main'
            sx={{
                height: '100vh',
                overflowY: 'auto',
                position: 'relative',
                overflow: 'hidden'
            }}
        >
            <Box
                sx={{
                    display: 'flex',
                    right: '40px',
                    left: '40px',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    height: '80px',
                    position: 'absolute',
                    top: 0,
                    zIndex: 1000,
                    backgroundColor: 'var(--header-maim-color)', // Nền bán trong suốt
                    backdropFilter: 'blur(10px)' // Làm mờ phần nền phía sau header
                }}
            >
                <img
                    onClick={() => router.push('/')}
                    src='/images/logo.png'
                    style={{
                        cursor: 'pointer',
                        height: '50px',
                        transition: 'all 300ms ease-in-out'
                    }}
                />
                <Box className='flex items-center gap-2'>
                    <MyTabs />
                    <Box
                        className='flex items-center gap-2'
                        sx={{
                            borderRadius: '30px',
                            padding: '5px',
                            backgroundColor: '#dc2e85'
                        }}
                    >
                        <LanguageMenu />
                        <ColorModeIconDropdown />
                        <NotificationMenu />
                    </Box>
                    <AvatarMenu />
                </Box>
            </Box>

            <Box
                sx={{
                    height: '100%',
                    paddingTop: '60px',
                    position: 'relative',
                    scrollbarGutter: 'stable both-edges',
                    '&::-webkit-scrollbar': {
                        width: '7px',
                        height: '7px',
                        backgroundColor: 'var(--background-after-color)'
                    },
                    '&::-webkit-scrollbar-thumb': {
                        backgroundColor: 'var(--scrollbar-color)',
                        borderRadius: '10px'
                    },
                    backgroundColor: 'var(--background-after-color)',
                    overflowY: 'auto'
                }}
            >
                <Box
                    sx={{
                        padding: '40px 33px',
                        minHeight: '100%'
                    }}
                >
                    {children}
                </Box>
            </Box>
            <Chat />
        </Box>
    )
}

export default Layout
