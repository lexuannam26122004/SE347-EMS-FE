import React from 'react'
import { Box, Typography } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { useSearchByUserQuery } from '@/services/UserJobHistoryService'
import Loading from '@/components/Loading'
import { IJobHistoryByUser } from '@/models/JobHistory'
import { formatDate } from '@/utils/formatDate'

const Timeline: React.FC = () => {
    const { data, isLoading } = useSearchByUserQuery()

    const jobHistory = (data?.Data as IJobHistoryByUser[]) || []

    if (isLoading) {
        return <Loading />
    }

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

    const events = jobHistory.map(job => ({
        startDate: formatDate(job?.StartDate),
        endDate: formatDate(job?.EndDate),
        location: job?.WorkLocation,
        content: {
            supervisorId: job?.SupervisorEmployeeId,
            supervisorName: job?.SupervisorFullName,
            jobDescription: job?.JobDescription,
            allowance: job?.Allowance,
            note: job?.Note
        },
        color: getRandomColor()
    }))

    return (
        <Box
            sx={{
                position: 'relative',
                Width: '100%',
                margin: 'auto',
                padding: '40px'
            }}
        >
            <Box
                sx={{
                    position: 'absolute',
                    width: '4px',
                    backgroundColor: 'var(--text-color)',
                    top: 25,
                    bottom: 0,
                    left: '50%',
                    '&:before': {
                        content: '""',
                        position: 'absolute',
                        width: 0,
                        height: 0,
                        borderLeft: '10px solid transparent',
                        borderRight: '10px solid transparent',
                        borderBottom: '24px solid var(--text-color)',
                        top: '-24px',
                        left: '-8px',
                        zIndex: 3
                    }
                }}
            />

            {events.map((event, index) => (
                <Box
                    key={index}
                    sx={{
                        padding: '10px 20px',
                        position: 'relative',
                        backgroundColor: hslToRgba(event.color, 0.2),
                        borderRadius: '8px',
                        margin: '20px 0',
                        width: 'calc(50%)',
                        left: index % 2 === 0 ? 'calc(0% - 18px)' : 'calc(50% + 22px)',
                        borderLeft: index % 2 === 0 ? `4px solid ${event.color}` : 'none',
                        borderRight: index % 2 !== 0 ? `4px solid ${event.color}` : 'none',
                        color: 'var(--text-color)',
                        textAlign: index % 2 === 0 ? 'left' : 'right',
                        '&:after': {
                            content: '""',
                            position: 'absolute',
                            width: '20px',
                            height: '20px',
                            backgroundColor: event.color,
                            border: '4px solid var(--text-color)',
                            borderRadius: '50%',
                            top: '15px',
                            left: index % 2 === 0 ? 'calc(100% + 10px)' : 'auto',
                            right: index % 2 !== 0 ? 'calc(100% + 10px)' : 'auto'
                        }
                    }}
                >
                    <Typography sx={{ color: 'var(--text-color)', fontSize: '0.9em', marginBottom: '5px' }}>
                        {event.startDate} - {event.endDate} | {event.location}
                    </Typography>
                    <Typography sx={{ color: 'var(--text-color)', fontSize: '1.1em' }}>
                        {`${event.content.supervisorId}  ${event.content.supervisorName}`}
                    </Typography>
                    <Typography sx={{ color: 'var(--text-color)', fontSize: '1.1em' }}>
                        {event.content.jobDescription}
                    </Typography>
                    <Typography sx={{ color: 'var(--text-color)', fontSize: '1.1em' }}>
                        Allowance: {event.content.allowance}
                    </Typography>
                    <Typography sx={{ color: 'var(--text-color)', fontSize: '1.1em' }}>
                        Note: {event.content.note}
                    </Typography>
                </Box>
            ))}
        </Box>
    )
}

const App: React.FC = () => {
    const { t } = useTranslation('common')
    return (
        <Box
            sx={{
                padding: '35px',
                backgroundColor: 'var(--attendance-bg1)',
                boxShadow: 'var(--box-shadow-paper)',
                borderRadius: '30px',
                overflow: 'hidden',
                height: '100%',
                //border: '1px solid #e0e0e0',
                width: '100%'
            }}
        >
            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    mb: '35px'
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
                    {t('COMMON.SIDEBAR.WORKHISTORY')}
                </Typography>
            </Box>

            <Box
                sx={{
                    //boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                    borderRadius: '30px',
                    overflow: 'auto',
                    height: '600px',
                    width: '100%',
                    marginTop: '20px',
                    position: 'relative',
                    backgroundColor: 'var(--attendance-bg1)',
                    '&::-webkit-scrollbar': {
                        width: '10px' // Độ cao thanh cuộn
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
                <Timeline />
            </Box>
        </Box>
    )
}

export default App
