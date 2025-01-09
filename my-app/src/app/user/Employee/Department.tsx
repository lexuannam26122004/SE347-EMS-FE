import React from 'react'
import { Box, Typography } from '@mui/material'

const Timeline: React.FC = () => {
    const colors = [
        'hsl(0, 100%, 50%)',
        'hsl(30, 100%, 50%)',
        'hsl(60, 100%, 50%)',
        'hsl(120, 100%, 50%)',
        'hsl(180, 100%, 50%)',
        'hsl(240, 100%, 50%)'
    ]

    let colorIndex = 0

    const getRandomColor = (): string => {
        const color = colors[colorIndex]
        colorIndex = (colorIndex + 1) % colors.length
        return color
    }

    const hslToRgba = (hsl: string, alpha = 0.5): string => {
        const match = hsl.match(/\d+/g)
        if (!match) {
            throw new Error('Invalid HSL string')
        }
        const [h, s, l] = match.map(Number)
        const c = (1 - Math.abs((2 * l) / 100 - 1)) * (s / 100)
        const x = c * (1 - Math.abs(((h / 60) % 2) - 1))
        const m = l / 100 - c / 2
        let r = 0,
            g = 0,
            b = 0

        if (h >= 0 && h < 60) {
            r = c
            g = x
            b = 0
        } else if (h >= 60 && h < 120) {
            r = x
            g = c
            b = 0
        } else if (h >= 120 && h < 180) {
            r = 0
            g = c
            b = x
        } else if (h >= 180 && h < 240) {
            r = 0
            g = x
            b = c
        } else if (h >= 240 && h < 300) {
            r = x
            g = 0
            b = c
        } else {
            r = c
            g = 0
            b = x
        }
        r = Math.round((r + m) * 255)
        g = Math.round((g + m) * 255)
        b = Math.round((b + m) * 255)

        return `rgba(${r}, ${g}, ${b}, ${alpha})`
    }

    const events = [
        {
            TransferDate: '24 Dec 2024 - 9:47 PM',
            Reason: 'Department restructuring',
            ToDepartment: 'Marketing',
            color: getRandomColor()
        },
        {
            TransferDate: '23 Dec 2024 - 8:47 PM',
            Reason: 'Promotion to team leader',
            ToDepartment: 'Development',
            color: getRandomColor()
        },
        {
            TransferDate: '22 Dec 2024 - 7:47 PM',
            Reason: 'Project reassignment',
            ToDepartment: 'Research',
            color: getRandomColor()
        },
        {
            TransferDate: '21 Dec 2024 - 6:47 PM',
            Reason: 'Performance improvement plan',
            ToDepartment: 'Quality Assurance',
            color: getRandomColor()
        },
        {
            TransferDate: '20 Dec 2024 - 5:47 PM',
            Reason: 'Cross-functional training',
            ToDepartment: 'Customer Support',
            color: getRandomColor()
        },
        {
            TransferDate: '19 Dec 2024 - 4:47 PM',
            Reason: 'Temporary assignment',
            ToDepartment: 'Sales',
            color: getRandomColor()
        },
        {
            TransferDate: '18 Dec 2024 - 3:47 PM',
            Reason: 'Relocation request',
            ToDepartment: 'Human Resources',
            color: getRandomColor()
        },
        {
            TransferDate: '17 Dec 2024 - 2:47 PM',
            Reason: 'Department realignment',
            ToDepartment: 'Finance',
            color: getRandomColor()
        }
    ]

    return (
        <Box
            sx={{
                //padding: '20px',
                backgroundColor: 'var(--attendance-bg1)',
                boxShadow: 'var(--box-shadow-paper)',
                borderRadius: '30px',
                overflow: 'hidden',
                height: '100%',
                padding: '35px',
                //border: '1px solid #e0e0e0',
                width: '100%'
            }}
        >
            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center'
                }}
            >
                <Box
                    sx={{
                        width: '5px',
                        height: '42px',
                        backgroundColor: '#4effca',
                        borderRadius: '4px',
                        mr: '14px'
                    }}
                />
                <Typography
                    sx={{
                        color: 'var(--text-color)',
                        fontSize: '21px',
                        fontWeight: 'bold'
                    }}
                >
                    {'Lịch sử chuyển phòng ban'}
                </Typography>
            </Box>
            <Box
                sx={{
                    position: 'sticky',
                    left: 0,
                    right: 0,
                    top: 87,
                    height: '4px',
                    backgroundColor: 'var(--text-color)',
                    zIndex: 1,
                    width: '100%',
                    '&::after': {
                        content: '""',
                        position: 'absolute',
                        top: '-8px',
                        right: '-21px',
                        width: '0',
                        height: '0',
                        borderTop: '10px solid transparent',
                        borderBottom: '10px solid transparent',
                        borderLeft: '24px solid var(--text-color)'
                    }
                }}
            />

            <Box
                sx={{
                    borderRadius: '12px',
                    marginTop: '24px',
                    backgroundColor: 'var(--attendance-bg1)',
                    position: 'relative',
                    width: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    paddingTop: '20px',
                    paddingBottom: '20px',
                    paddingRight: '20px',
                    overflowX: 'auto',
                    scrollBehavior: 'smooth',
                    touchAction: 'pan-x',
                    direction: 'rtl',
                    '&::-webkit-scrollbar': {
                        height: '8px' // Độ cao thanh cuộn
                    },
                    '&::-webkit-scrollbar-thumb': {
                        background: '#555', // Màu thanh cuộn
                        borderRadius: '4px'
                    },
                    '&::-webkit-scrollbar-thumb:hover': {
                        background: '#333'
                    }
                }}
            >
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        marginTop: '-12px',
                        width: '100%',
                        gap: '80px'
                    }}
                >
                    {events.map((event, index) => (
                        <Box
                            key={index}
                            sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                position: 'relative',
                                minWidth: '200px' // Đảm bảo mỗi sự kiện có chiều rộng tối thiểu
                            }}
                        >
                            {/* Chấm tròn */}
                            <Box
                                sx={{
                                    width: '20px',
                                    height: '20px',
                                    backgroundColor: event.color,
                                    borderRadius: '50%',
                                    border: '4px solid var(--text-color)',
                                    zIndex: 2,
                                    marginBottom: '10px' // Khoảng cách giữa chấm và nội dung
                                }}
                            />
                            {/* Nội dung sự kiện */}
                            <Box
                                sx={{
                                    padding: '10px',
                                    backgroundColor: hslToRgba(event.color, 0.2),
                                    borderRadius: '8px',
                                    zIndex: 2,
                                    width: '200px',
                                    textAlign: 'center',
                                    border: `2px solid ${event.color}`
                                }}
                            >
                                <Typography sx={{ fontSize: '0.9em', marginBottom: '5px', color: 'var(--text-color)' }}>
                                    {event.TransferDate}
                                </Typography>
                                <Typography sx={{ fontSize: '1.1em', fontWeight: 'bold', color: 'var(--text-color)' }}>
                                    {event.ToDepartment}
                                </Typography>
                                <Typography sx={{ fontSize: '1em', color: 'var(--text-color)' }}>
                                    Reason: {event.Reason}
                                </Typography>
                            </Box>
                        </Box>
                    ))}
                </Box>
            </Box>
        </Box>
    )
}

export default Timeline
