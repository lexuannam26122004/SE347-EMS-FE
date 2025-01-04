'use client'

import { ChevronLast, ChevronFirst } from 'lucide-react'
import { useContext, createContext, useState, ReactNode, FC, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Box, Typography } from '@mui/material'
import { useSelector, useDispatch } from 'react-redux'
import { sidebarSlice } from '@/redux/slices/sidebarSlice'
import { RootState } from '@/redux/store'

// Define a context type for the Sidebar context
interface SidebarContextType {
    expanded: boolean
}

// Create the SidebarContext
const SidebarContext = createContext<SidebarContextType | undefined>(undefined)

// Sidebar component
const Sidebar: FC<{ children: ReactNode }> = ({ children }) => {
    const dispatch = useDispatch()
    const expanded = useSelector((state: RootState) => state.sidebar.expanded)

    const router = useRouter()

    const handleClick = () => {
        router.push('/')
    }

    const handleSidebarToggle = () => {
        dispatch(sidebarSlice.actions.toggleSidebar())
    }

    return (
        <SidebarContext.Provider value={{ expanded }}>
            <aside className='h-screen' style={{ userSelect: 'none' }}>
                <nav
                    className='h-full flex flex-col shadow-sm transition-all duration-300 ease-in-out'
                    style={{
                        backgroundColor: 'var(--background-color)',
                        width: expanded ? '265px' : '80px'
                    }}
                >
                    <div className='h-[60px] relative flex items-center px-3'>
                        <div className={`absolute left-3 flex items-center h-full`}>
                            <img
                                onClick={handleClick}
                                src='/images/logo.png'
                                style={{
                                    height: '50px',
                                    transition: 'all 300ms ease-in-out',
                                    marginLeft: expanded ? '15px' : '0'
                                }}
                                className={`
                                    overflow-hidden transition-all cursor-pointer duration-300 ease-in-out
                                    ${expanded ? 'w-[140px] opacity-100' : 'w-0 opacity-0'}
                                `}
                                alt=''
                            />
                        </div>

                        <button
                            onClick={handleSidebarToggle}
                            style={{
                                borderRadius: '6px',
                                padding: '5px'
                            }}
                            className={`
                                absolute ${expanded ? 'right-3' : 'right-[21.5px]'}
                                bg-[var(--background-color)]
                                border border-[var(--border-color)]
                                hover:bg-[var(--hover-color)]
                                hover:border-[var(--hover-color)]`}
                        >
                            {expanded ? <ChevronFirst /> : <ChevronLast />}
                        </button>
                    </div>

                    {/* Content box */}
                    <Box
                        className='flex-1 px-3 pt-3 pb-3'
                        sx={{
                            overflowY: 'auto',
                            overflowX: 'hidden',
                            '&::-webkit-scrollbar': {
                                width: '7px',
                                height: '7px',
                                backgroundColor: 'var(--background-color)'
                            },
                            '&::-webkit-scrollbar-thumb': {
                                backgroundColor: 'var(--scrollbar-color)',
                                borderRadius: '10px'
                            }
                        }}
                    >
                        {children}
                    </Box>
                </nav>
            </aside>
        </SidebarContext.Provider>
    )
}

interface TypographyItemProps {
    text: string
}

export const TypographyItem: FC<TypographyItemProps> = ({ text }) => {
    const context = useContext(SidebarContext)

    if (!context) {
        throw new Error('SidebarItem must be used within a Sidebar')
    }

    const { expanded } = context

    return (
        <Typography
            variant='h6'
            sx={{
                fontSize: '18px',
                fontWeight: 'bold',
                height: '29px',
                paddingLeft: '15px',
                color: 'var(--text-color)',
                opacity: expanded ? 1 : 0,
                visibility: expanded ? 'visible' : 'hidden',
                transition: 'all 300ms ease-in-out',
                marginBottom: '8px',
                width: expanded ? 'auto' : 0,
                overflow: 'hidden'
            }}
        >
            {text}
        </Typography>
    )
}

import ReactDOM from 'react-dom'
import React from 'react'

interface SidebarItemProps {
    icon: ReactNode
    text: string
    route?: string
    alert?: boolean
    active?: boolean
    children?: ReactNode
}

export const SidebarItem: FC<SidebarItemProps> = ({ icon, text, route, alert, active, children }) => {
    const context = useContext(SidebarContext)
    const router = useRouter()
    const [showTooltip, setShowTooltip] = useState(false)
    const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 })
    const [isExpanded, setIsExpanded] = useState(false) // Để mở rộng các tab con

    const [portalContainer, setPortalContainer] = useState<HTMLElement | null>(null)

    useEffect(() => {
        const container =
            document.getElementById('tooltip-portal') ||
            (() => {
                const el = document.createElement('div')
                el.id = 'tooltip-portal'
                document.body.appendChild(el)
                return el
            })()
        setPortalContainer(container)

        return () => {
            if (container && document.body.contains(container)) {
                document.body.removeChild(container)
            }
        }
    }, [])

    if (!context) {
        throw new Error('SidebarItem must be used within a Sidebar')
    }

    const { expanded } = context

    const handleClick = () => {
        if (route) {
            router.push(route)
        } else {
            setIsExpanded(!isExpanded) // Toggle mở rộng nếu có tab con
        }
    }

    const handleMouseEnter = (event: React.MouseEvent) => {
        const rect = event.currentTarget.getBoundingClientRect()
        setTooltipPosition({
            top: rect.top + window.scrollY + 6.5,
            left: rect.right + 8
        })
        setShowTooltip(true)
    }

    const handleMouseLeave = () => {
        setShowTooltip(false)
    }

    return (
        <>
            <Box
                onClick={handleClick}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                className={`group relative flex items-center py-2 px-3 my-1 font-medium rounded-md cursor-pointer transition-colors ${
                    active
                        ? 'bg-[var(--selected-menu-left-color)] hover:bg-[var(--hover-color)]'
                        : 'hover:bg-[var(--hover-color)] text-[var(--text-color)]'
                }`}
            >
                <div
                    className='w-6 h-6 flex items-center justify-center flex-shrink-0'
                    style={{
                        ...(active ? { color: 'var(--selected-menu-text-color)' } : { color: 'var(--text-color)' })
                    }}
                >
                    {icon}
                </div>

                <span
                    className={`overflow-hidden whitespace-nowrap transition-all duration-300 ease-in-out ${
                        expanded ? 'w-48 ml-3 opacity-100' : 'w-0 opacity-0'
                    }`}
                    style={{
                        ...(active ? { color: 'var(--selected-menu-text-color)' } : { color: 'var(--text-color)' })
                    }}
                >
                    {text}
                </span>
                {alert && <div className={`absolute right-2 w-2 h-2 rounded bg-[red] ${expanded ? '' : 'top-2'}`} />}

                {children && (
                    <ChevronLast
                        style={{
                            transform: isExpanded ? 'rotate(90deg)' : 'rotate(0)',
                            transition: 'transform 200ms ease-in-out',
                            marginLeft: 'auto'
                        }}
                    />
                )}

                {!expanded &&
                    showTooltip &&
                    portalContainer &&
                    ReactDOM.createPortal(
                        <div
                            style={{
                                position: 'absolute',
                                top: tooltipPosition.top,
                                left: tooltipPosition.left,
                                zIndex: 1000000
                            }}
                            className='rounded-md px-2 py-1 bg-[var(--hover-color)] text-[var(--text-color)] text-sm transition-opacity opacity-100 shadow-lg'
                        >
                            {text}
                        </div>,
                        portalContainer
                    )}
            </Box>

            {isExpanded && children && children && <Box className='pl-4'>{children}</Box>}
        </>
    )
}

export default Sidebar
