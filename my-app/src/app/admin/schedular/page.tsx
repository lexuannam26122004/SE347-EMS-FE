'use client'

import React, { useState, useRef, useEffect } from 'react'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction' // Dùng plugin này để hỗ trợ kéo và thả
import { EventDropArg } from '@fullcalendar/core'
import dayjs from 'dayjs'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker'
import CheckIcon from '@mui/icons-material/Check'
import { renderTimeViewClock } from '@mui/x-date-pickers/timeViewRenderers'
import { styled } from '@mui/material/styles'
import { SwitchProps } from '@mui/material/Switch'
import equal from 'fast-deep-equal'
import {
    Paper,
    Dialog,
    DialogTitle,
    DialogContent,
    TextField,
    DialogActions,
    Button,
    FormControlLabel,
    Switch,
    Typography,
    Box,
    FormControl,
    SelectChangeEvent,
    Select,
    MenuItem,
    IconButton,
    InputAdornment,
    Tooltip
} from '@mui/material'
import CircleIcon from '@mui/icons-material/Circle'
import './styles.css'
import { useTranslation } from 'react-i18next'
import { CalendarRange, ChevronLeft, ChevronRight, Trash2 } from 'lucide-react'
import { RootState } from '@/redux/store'
import { useSelector } from 'react-redux'
import {
    useSearchEventQuery,
    useCreateEventMutation,
    useDeleteEventMutation,
    useUpdateEventMutation
} from '@/services/EventService'
import { IEventGetAll, IFilterEvent, IEventCreate, IEventUpdate } from '@/models/Event'
import { parseISO } from 'date-fns'

const IOSSwitch = styled((props: SwitchProps) => (
    <Switch focusVisibleClassName='.Mui-focusVisible' disableRipple {...props} />
))(({ theme }) => ({
    width: 40,
    height: 24,
    padding: 0,
    '& .MuiSwitch-switchBase': {
        padding: 0,
        margin: 2,
        transitionDuration: '300ms',
        '&.Mui-checked': {
            transform: 'translateX(16px)',
            color: '#fff',
            '& + .MuiSwitch-track': {
                backgroundColor: '#65C466',
                opacity: 1,
                border: 0,
                ...theme.applyStyles('dark', {
                    backgroundColor: '#2ECA45'
                })
            },
            '&.Mui-disabled + .MuiSwitch-track': {
                opacity: 0.5
            }
        },
        '&.Mui-focusVisible .MuiSwitch-thumb': {
            color: '#33cf4d',
            border: '6px solid #fff'
        },
        '&.Mui-disabled .MuiSwitch-thumb': {
            color: theme.palette.grey[100],
            ...theme.applyStyles('dark', {
                color: theme.palette.grey[600]
            })
        },
        '&.Mui-disabled + .MuiSwitch-track': {
            opacity: 0.7,
            ...theme.applyStyles('dark', {
                opacity: 0.3
            })
        }
    },
    '& .MuiSwitch-thumb': {
        boxSizing: 'border-box',
        width: 20,
        height: 20
    },
    '& .MuiSwitch-track': {
        borderRadius: 26 / 2,
        backgroundColor: 'var(--background-switch)',
        opacity: 1,
        transition: theme.transitions.create(['background-color'], {
            duration: 500
        }),
        ...theme.applyStyles('dark', {
            backgroundColor: '#39393D'
        })
    }
}))

import { toZonedTime, format } from 'date-fns-tz'

const convertToVietnamTime = (date: Date) => {
    // Đảm bảo date là hợp lệ
    if (isNaN(date.getTime())) {
        throw new Error('Invalid Date')
    }

    // Múi giờ Việt Nam
    const timeZone = 'Asia/Ho_Chi_Minh'

    // Chuyển thời gian từ UTC sang thời gian theo múi giờ Việt Nam
    const vietnamTime = toZonedTime(date, timeZone)

    // Định dạng thời gian theo kiểu ISO (YYYY-MM-DDTHH:mm:ss)
    const formattedDate = format(vietnamTime, "yyyy-MM-dd'T'HH:mm:ss")

    return formattedDate // Trả về thời gian đã được định dạng
}

interface Event {
    id: string
    title: string
    description: string
    start: Date
    end: Date
    isHoliday?: boolean
    allDay: boolean
    color: string
}

const MyCalendar = () => {
    const { t } = useTranslation('common')

    const [filter] = useState<IFilterEvent>({
        pageNumber: 1,
        sortBy: 'Id',
        isDescending: false,
        keyword: ''
    })

    const [createEvent, { isLoading: isLoadingCreate }] = useCreateEventMutation()
    const [deleteEvent, { isLoading: isLoadingDelete }] = useDeleteEventMutation()
    const [updateEvent, { isLoading: isLoadingUpdate }] = useUpdateEventMutation()
    const { data: responseData, refetch } = useSearchEventQuery(filter)

    const eventData = responseData?.Data.Records as IEventGetAll[]

    const [events, setEvents] = useState<Event[]>([])

    useEffect(() => {
        const eventRecords = eventData?.map(event => {
            return {
                id: event.Id.toString(),
                title: event.Title,
                start: parseISO(event.StartDate), // Sử dụng parseISO để đảm bảo đúng định dạng
                end: parseISO(event.EndDate),
                color: event.IsHoliday === true ? '#ea0000' : event.Color,
                allDay: event.AllDay,
                isHoliday: event.IsHoliday,
                description: event.Description
            } as Event
        })
        setEvents(eventRecords || [])
    }, [eventData])

    useEffect(() => {
        if (isLoadingCreate || isLoadingDelete || isLoadingUpdate) {
            return
        }
        refetch()
    }, [isLoadingCreate, isLoadingDelete, isLoadingUpdate])

    const [calendarView, setCalendarView] = useState('dayGridMonth')
    const [isSubmit, setIsSubmit] = useState(false)
    const expanded = useSelector((state: RootState) => state.sidebar.expanded)

    useEffect(() => {
        const timer = setTimeout(() => {
            if (calendarRef.current) {
                calendarRef.current.getApi().updateSize()
            }
        }, 300)

        return () => clearTimeout(timer)
    }, [expanded])

    const handleCancel = () => {
        setModalOpen(false)
        setIsSubmit(false)
    }

    const [modalOpen, setModalOpen] = useState(false)
    const [newEvent, setNewEvent] = useState<Event>({
        id: 'new_' + Date.now(),
        title: '',
        description: '',
        isHoliday: false,
        start: new Date(),
        end: new Date(),
        allDay: false,
        color: '#00a76f'
    })

    const colors = ['#00a76f', '#8e33ff', '#00b8d9', '#003768', '#22c55e', '#ffcc00', '#ff5630', '#7a0916']

    const [isNewEvent, setIsNewEvent] = useState(false)

    const handleSelect = (info: { start: Date; end: Date }) => {
        const newEventId = 'new_' + Date.now() // Tạo ID mới cho sự kiện mới

        setNewEvent({
            id: newEventId,
            title: '',
            description: '',
            start: info.start,
            isHoliday: false,
            end: info.end,
            allDay: false,
            color: '#00a76f'
        })
        setModalOpen(true)
        setIsNewEvent(true)
        setIsSubmit(false)
    }

    const handleSaveEvent = () => {
        setIsSubmit(true)
        if (
            newEvent.title.trim() === '' ||
            newEvent.start === null ||
            newEvent.end === null ||
            newEvent.start > newEvent.end ||
            newEvent.description.trim() === ''
        ) {
            return
        }

        const startTime = convertToVietnamTime(newEvent.start)
        const endTime = convertToVietnamTime(newEvent.end)

        if (isNewEvent) {
            setEvents([...events, newEvent])
            const eventCreate = {
                Title: newEvent.title,
                StartDate: startTime,
                EndDate: endTime,
                IsHoliday: false,
                Description: newEvent.description,
                Color: newEvent.color,
                AllDay: newEvent.allDay
            } as IEventCreate
            createEvent(eventCreate)
        } else {
            const eventUpdate = {
                Title: newEvent.title,
                StartDate: startTime,
                EndDate: endTime,
                Description: newEvent.description,
                Color: newEvent.color,
                AllDay: newEvent.allDay,
                Id: parseInt(newEvent.id)
            } as IEventUpdate
            updateEvent(eventUpdate)
        }

        setModalOpen(false)
    }

    const handleEventClick = (info: any) => {
        const event = info.event

        setIsNewEvent(false)

        console.log(event.start, event.end)

        setNewEvent({
            id: event.id,
            title: event.title,
            description: event.extendedProps.description || '',
            start: event.start,
            isHoliday: event.extendedProps.isHoliday || false,
            end: event.end,
            allDay: event.allDay || false,
            color: event.backgroundColor || '#00a76f'
        })

        setModalOpen(true)
        setIsSubmit(false)
    }

    const handleAllDayChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setNewEvent(prevEvent => ({
            ...prevEvent,
            allDay: event.target.checked
        }))
    }

    const handleEventDrop = async (info: EventDropArg) => {
        const newStart = info.event.start instanceof Date ? info.event.start : new Date()
        const newEnd = info.event.end instanceof Date ? info.event.end : new Date()

        const updatedEvents = events.map(event =>
            event.id === info.event.id ? { ...event, start: newStart, end: newEnd } : event
        )

        const startTime = convertToVietnamTime(newStart)
        const endTime = convertToVietnamTime(newEnd)

        const eventUpdate = {
            Title: info.event.title,
            StartDate: startTime,
            EndDate: endTime,
            Description: info.event.extendedProps.description || '',
            Color: info.event.backgroundColor,
            AllDay: info.event.allDay,
            Id: parseInt(info.event.id)
        } as IEventUpdate

        if (!equal(events, updatedEvents)) {
            await updateEvent(eventUpdate).unwrap()
            refetch()
        }
    }

    const calendarRef = useRef<FullCalendar | null>(null)

    const handleViewChange = (event: SelectChangeEvent<string>) => {
        const newView = event.target.value
        setCalendarView(newView)

        // Sử dụng API của FullCalendar để thay đổi view
        if (calendarRef.current) {
            const calendarApi = calendarRef.current.getApi()
            calendarApi.changeView(newView)
        }
    }

    const [currentTitle, setCurrentTitle] = useState('') // Lưu trữ tiêu đề hiện tại

    const updateTitle = () => {
        const calendarApi = calendarRef.current?.getApi()
        if (calendarApi) {
            setCurrentTitle(calendarApi.view.title) // Lấy tiêu đề từ view hiện tại
        }
    }

    useEffect(() => {
        updateTitle()
        refetch()
    }, [])

    const handleTodayClick = () => {
        if (calendarRef.current) {
            const calendarApi = calendarRef.current.getApi()
            calendarApi.today() // Di chuyển lịch đến ngày hiện tại
        }
    }

    return (
        <Paper
            sx={{
                borderRadius: '15px',
                width: '100%',
                boxShadow: 'var(--box-shadow-paper)',
                overflow: 'hidden',
                backgroundColor: 'var(--background-item)',
                position: 'relative'
            }}
        >
            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'relative',
                    padding: '24px 24px 24px 24px'
                }}
            >
                <FormControl sx={{ width: 117, height: 40, position: 'absolute', left: '24px', top: '24px' }}>
                    <Select
                        value={calendarView}
                        onChange={handleViewChange}
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
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                padding: '9px 8px 9px 0'
                            }
                        }}
                        startAdornment={
                            <InputAdornment position='start'>
                                <CalendarRange
                                    width='21'
                                    height='21'
                                    style={{
                                        marginTop: '-1px',
                                        marginLeft: '-3px'
                                    }}
                                    color='var(--text-color)'
                                />{' '}
                            </InputAdornment>
                        }
                        MenuProps={{
                            PaperProps: {
                                elevation: 0,
                                sx: {
                                    width: '120px',
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
                                horizontal: 'left' // Căn chỉnh bên phải
                            },
                            transformOrigin: {
                                vertical: 'top',
                                horizontal: 'left' // Căn chỉnh bên phải
                            }
                        }}
                    >
                        <MenuItem
                            value='dayGridMonth'
                            sx={{
                                borderRadius: '6px'
                            }}
                        >
                            {t('COMMON.CALENDAR.MONTH')}
                        </MenuItem>
                        <MenuItem
                            value='dayGridWeek'
                            sx={{
                                borderRadius: '6px',
                                mt: '3px'
                            }}
                        >
                            {t('COMMON.CALENDAR.WEEK')}
                        </MenuItem>
                        <MenuItem
                            value='dayGridDay'
                            sx={{
                                borderRadius: '6px',
                                mt: '3px'
                            }}
                        >
                            {t('COMMON.CALENDAR.DAY')}
                        </MenuItem>
                    </Select>
                </FormControl>

                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}
                >
                    <IconButton
                        onClick={() => calendarRef.current?.getApi().prev()}
                        sx={{
                            color: 'var(--text-color)',
                            marginRight: '10px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            '&:hover': {
                                backgroundColor: 'var(--hover-color)'
                            }
                        }}
                    >
                        <ChevronLeft />
                    </IconButton>

                    <Typography
                        variant='h6'
                        sx={{
                            flex: '1', // Tiêu đề chiếm không gian linh hoạt
                            textAlign: 'center',
                            fontWeight: 'bold',
                            fontSize: '19px',
                            color: 'var(--text-color)'
                        }}
                    >
                        {currentTitle || 'Calendar'}
                    </Typography>

                    <IconButton
                        onClick={() => calendarRef.current?.getApi().next()}
                        sx={{
                            color: 'var(--text-color)',
                            marginLeft: '10px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            '&:hover': {
                                backgroundColor: 'var(--hover-color)'
                            }
                        }}
                    >
                        <ChevronRight />
                    </IconButton>
                </Box>

                <Box
                    sx={{
                        position: 'absolute',
                        right: '180px',
                        top: '32px',
                        display: 'flex',
                        gap: '10px',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}
                >
                    <Typography
                        sx={{
                            color: 'var(--text-rejected-color1)',
                            fontSize: '12px'
                        }}
                    >
                        {t('COMMON.CALENDAR.NOTE')}
                    </Typography>
                    <Tooltip title={t('COMMON.CALENDAR.HOLIDAY')} placement='top'>
                        <Box
                            width={30}
                            height={22}
                            sx={{
                                borderRadius: '6px',
                                backgroundColor: '#ea0000'
                            }}
                        ></Box>
                    </Tooltip>
                </Box>

                <Button
                    variant='outlined'
                    onClick={handleTodayClick}
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
                        borderRadius: '8px',
                        position: 'absolute',
                        right: '24px',
                        top: '24px'
                    }}
                >
                    {t('COMMON.CALENDAR.TODAY')}
                </Button>
            </Box>

            <FullCalendar
                ref={calendarRef} // Thêm ref cho FullCalendar
                plugins={[dayGridPlugin, interactionPlugin]}
                initialView={calendarView}
                events={events}
                eventDrop={handleEventDrop}
                editable
                droppable
                eventTimeFormat={{
                    hour: 'numeric',
                    minute: '2-digit',
                    meridiem: 'short'
                }}
                select={handleSelect}
                selectable
                contentHeight={500}
                headerToolbar={{
                    left: '',
                    center: '',
                    right: ''
                }}
                datesSet={updateTitle}
                dragScroll={true}
                eventClick={info => handleEventClick(info)} // Thêm sự kiện eventClick
            />

            <Dialog
                open={modalOpen}
                sx={{
                    '& .MuiDialog-container': {
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center'
                    },
                    '& .MuiDialog-paper': {
                        backgroundColor: 'var(--background-dialog)',
                        width: '444px',
                        margin: 0,
                        borderRadius: '16px',
                        maxWidth: 'none',
                        height: '90vh'
                    }
                }}
                onClose={() => setModalOpen(false)}
            >
                <DialogTitle
                    sx={{
                        padding: '24px',
                        fontSize: '18px',
                        color: 'var(--text-color)',
                        backgroundColor: 'var(--header-dialog)'
                    }}
                >
                    {t('COMMON.CALENDAR.ADD_EVENT')}
                </DialogTitle>
                <DialogContent
                    sx={{
                        pr: '17px',
                        scrollbarGutter: 'stable',
                        '&::-webkit-scrollbar': {
                            width: '7px',
                            height: '7px'
                        },
                        '&::-webkit-scrollbar-thumb': {
                            backgroundColor: 'var(--scrollbar-color)',
                            borderRadius: '10px'
                        }
                    }}
                >
                    <Box
                        width='100%'
                        sx={{
                            mt: '24px'
                        }}
                    >
                        <TextField
                            label={t('COMMON.CALENDAR.TITLE')}
                            {...(isSubmit === true && newEvent.title === '' && { error: true })}
                            sx={{
                                width: '100%',
                                '& fieldset': {
                                    borderRadius: '8px',
                                    color: 'var(--text-color)',
                                    borderColor: 'var(--border-dialog)'
                                },
                                '& .MuiInputBase-root': {
                                    paddingRight: '0px'
                                },
                                '& .MuiInputBase-input': {
                                    paddingRight: '12px',
                                    color: 'var(--text-color)',
                                    fontSize: '16px',
                                    '&::placeholder': {
                                        color: 'var(--placeholder-color)',
                                        opacity: 1
                                    }
                                },
                                '& .MuiOutlinedInput-root:hover fieldset': {
                                    borderColor: 'var(--hover-field-color)'
                                },
                                '& .MuiOutlinedInput-root.Mui-error:hover fieldset': {
                                    borderColor: 'var(--error-color) !important' // Màu lỗi khi hover
                                },
                                '& .MuiOutlinedInput-root.Mui-error fieldset': {
                                    borderColor: 'var(--error-color) !important' // Màu lỗi khi hover
                                },
                                '& .MuiOutlinedInput-root.Mui-focused fieldset': {
                                    borderColor: 'var(--selected-field-color)'
                                },
                                '& .MuiInputLabel-root': {
                                    color: 'var(--text-label-color)'
                                },
                                '& .MuiInputLabel-root.Mui-focused': {
                                    color: 'var(--selected-field-color)'
                                },
                                '& .MuiInputLabel-root.Mui-error': {
                                    color: 'var(--error-color)'
                                }
                            }}
                            value={newEvent.title}
                            onChange={e => setNewEvent({ ...newEvent, title: e.target.value })}
                        />
                        <Typography
                            sx={{
                                visibility: isSubmit === true && newEvent.title === '' ? 'visible' : 'hidden',
                                color: 'var(--error-color)',
                                margin: '1px 0 0 10px',
                                fontSize: '12px'
                            }}
                        >
                            {t('COMMON.TEXTFIELD.REQUIRED')}
                        </Typography>
                    </Box>
                    <Box
                        width='100%'
                        sx={{
                            mt: '10px'
                        }}
                    >
                        <TextField
                            label={t('COMMON.CALENDAR.DESCRIPTION')}
                            {...(isSubmit === true && newEvent.description === '' && { error: true })}
                            multiline
                            rows={3}
                            sx={{
                                width: '100%',
                                '& fieldset': {
                                    borderRadius: '8px',
                                    color: 'var(--text-color)',
                                    borderColor: 'var(--border-dialog)'
                                },
                                '& .MuiInputBase-root': {
                                    paddingRight: '0px'
                                },
                                '& .MuiInputBase-input': {
                                    paddingRight: '12px',
                                    color: 'var(--text-color)',
                                    fontSize: '16px',
                                    '&::placeholder': {
                                        color: 'var(--placeholder-color)',
                                        opacity: 1
                                    }
                                },
                                '& .MuiOutlinedInput-root:hover fieldset': {
                                    borderColor: 'var(--hover-field-color)'
                                },
                                '& .MuiOutlinedInput-root.Mui-error:hover fieldset': {
                                    borderColor: 'var(--error-color) !important' // Màu lỗi khi hover
                                },
                                '& .MuiOutlinedInput-root.Mui-error fieldset': {
                                    borderColor: 'var(--error-color) !important' // Màu lỗi khi hover
                                },
                                '& .MuiOutlinedInput-root.Mui-focused fieldset': {
                                    borderColor: 'var(--selected-field-color)'
                                },
                                '& .MuiInputLabel-root': {
                                    color: 'var(--text-label-color)'
                                },
                                '& .MuiInputLabel-root.Mui-focused': {
                                    color: 'var(--selected-field-color)'
                                },
                                '& .MuiInputLabel-root.Mui-error': {
                                    color: 'var(--error-color)'
                                }
                            }}
                            value={newEvent.description}
                            onChange={e => setNewEvent({ ...newEvent, description: e.target.value })}
                        />
                        <Typography
                            sx={{
                                visibility: isSubmit === true && newEvent.description === '' ? 'visible' : 'hidden',
                                color: 'var(--error-color)',
                                margin: '1px 0 0 10px',
                                fontSize: '12px'
                            }}
                        >
                            {t('COMMON.TEXTFIELD.REQUIRED')}
                        </Typography>
                    </Box>

                    <FormControlLabel
                        sx={{
                            mt: '0px',
                            ml: '-8px',
                            mb: '20px',
                            '& .MuiFormControlLabel-label': {
                                color: 'var(--text-color)',
                                fontSize: '16px'
                            }
                        }}
                        control={
                            <IOSSwitch sx={{ m: 1, mr: 2 }} onChange={handleAllDayChange} checked={newEvent.allDay} />
                        }
                        label={t('COMMON.CALENDAR.ALL_DAY')}
                    />

                    <Box>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DateTimePicker
                                label='Ngày bắt đầu'
                                value={dayjs(newEvent.start)}
                                onChange={value => setNewEvent({ ...newEvent, start: value?.toDate() || new Date() })}
                                viewRenderers={{
                                    hours: renderTimeViewClock,
                                    minutes: renderTimeViewClock,
                                    seconds: renderTimeViewClock
                                }}
                                sx={{
                                    width: '100%',
                                    '& .MuiInputBase-root': {
                                        color: 'var(--text-color)'
                                    },
                                    '& .MuiInputLabel-root': {
                                        color: 'var(--text-label-color)'
                                    },
                                    '& .MuiOutlinedInput-notchedOutline': {
                                        borderRadius: '8px',
                                        borderColor: 'var(--border-dialog)'
                                    },
                                    '& .MuiSvgIcon-root': {
                                        color: 'var(--text-label-color)' // Màu của icon (lịch)
                                    },
                                    '& .MuiOutlinedInput-root': {
                                        '&:hover .MuiOutlinedInput-notchedOutline': {
                                            borderColor: 'var(--hover-field-color)' // Màu viền khi hover
                                        },
                                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                            borderColor: 'var(--selected-field-color) !important' // Màu viền khi focus, thêm !important để ghi đè
                                        }
                                    },
                                    '& .MuiInputLabel-root.Mui-focused': {
                                        color: 'var(--selected-field-color)'
                                    }
                                }}
                            />
                        </LocalizationProvider>
                    </Box>

                    <Box
                        sx={{
                            mt: '26px'
                        }}
                    >
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DateTimePicker
                                label='Ngày kết thúc'
                                value={dayjs(newEvent.end)}
                                onChange={value => setNewEvent({ ...newEvent, end: value?.toDate() || new Date() })}
                                viewRenderers={{
                                    hours: renderTimeViewClock,
                                    minutes: renderTimeViewClock,
                                    seconds: renderTimeViewClock
                                }}
                                sx={{
                                    width: '100%',
                                    '& .MuiInputBase-root': {
                                        color: 'var(--text-color)'
                                    },
                                    '& .MuiInputLabel-root': {
                                        color: 'var(--text-label-color)'
                                    },
                                    '& .MuiOutlinedInput-notchedOutline': {
                                        borderRadius: '8px',
                                        borderColor: 'var(--border-dialog)'
                                    },
                                    '& .MuiSvgIcon-root': {
                                        color: 'var(--text-label-color)' // Màu của icon (lịch)
                                    },
                                    '& .MuiOutlinedInput-root': {
                                        '&:hover .MuiOutlinedInput-notchedOutline': {
                                            borderColor: 'var(--hover-field-color)' // Màu viền khi hover
                                        },
                                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                            borderColor: 'var(--selected-field-color) !important' // Màu viền khi focus, thêm !important để ghi đè
                                        }
                                    },
                                    '& .MuiInputLabel-root.Mui-focused': {
                                        color: 'var(--selected-field-color)'
                                    }
                                }}
                            />
                        </LocalizationProvider>
                    </Box>

                    {newEvent.isHoliday === false && (
                        <Box sx={{ marginTop: '25px', ml: '1px', display: 'flex', gap: '16px' }}>
                            {colors.map(color => (
                                <Box key={color}>
                                    <IconButton
                                        onClick={() => setNewEvent({ ...newEvent, color })}
                                        sx={{
                                            padding: '0px',
                                            color: color,
                                            boxShadow: newEvent.color === color ? `0px 2px 6px ${color}` : 'none',
                                            transition: 'transform 0.2s, box-shadow 0.2s',
                                            position: 'relative'
                                        }}
                                    >
                                        <CircleIcon
                                            sx={{
                                                transform: newEvent.color === color ? 'scale(1.3)' : 'scale(1)'
                                            }}
                                        />
                                        {newEvent.color === color && (
                                            <CheckIcon
                                                sx={{
                                                    color: 'white',
                                                    fontSize: '14px',
                                                    position: 'absolute',
                                                    top: '50%',
                                                    left: '50%',
                                                    transform: 'translate(-50%, -50%)'
                                                }}
                                            />
                                        )}
                                    </IconButton>
                                </Box>
                            ))}
                        </Box>
                    )}
                </DialogContent>
                <DialogActions
                    sx={{
                        display: 'flex',
                        justifyContent: isNewEvent === true ? 'right' : 'space-between',
                        alignItems: 'center',
                        backgroundColor: 'var(--header-dialog)',
                        padding: '24px'
                    }}
                >
                    {isNewEvent === false && (
                        <Tooltip title={t('COMMON.CALENDAR.DELETE_EVENT')} placement='top'>
                            <IconButton
                                sx={{
                                    padding: '10px',
                                    borderRadius: '50%',
                                    '&:hover': {
                                        backgroundColor: 'var(--hover-color)'
                                    }
                                }}
                                onClick={() => {
                                    deleteEvent(parseInt(newEvent.id))
                                    setModalOpen(false)
                                }}
                            >
                                <Trash2 width='21px' height='21px' color='var(--placeholder-color)' />
                            </IconButton>
                        </Tooltip>
                    )}
                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'content',
                            alignItems: 'center',
                            gap: '16px'
                        }}
                    >
                        <Button
                            variant='contained'
                            color='error'
                            sx={{
                                fontSize: '14px',
                                fontWeight: 'bold',
                                height: '36x',
                                color: 'var(--text-button-reject)',
                                backgroundColor: 'var(--bg-button-reject)',
                                borderRadius: '8px',
                                '&:hover': {
                                    backgroundColor: 'var(--bg-button-reject-hover)'
                                },
                                textTransform: 'none'
                            }}
                            onClick={handleCancel}
                        >
                            {t('COMMON.BUTTON.CANCEL')}
                        </Button>
                        <Button
                            variant='contained'
                            color='primary'
                            sx={{
                                fontSize: '14px',
                                fontWeight: 'bold',
                                height: '36x',
                                color: 'var(--text-button-accept)',
                                backgroundColor: 'var(--bg-button-accept)',
                                borderRadius: '8px',
                                '&:hover': {
                                    backgroundColor: 'var(--bg-button-accept-hover)'
                                },
                                textTransform: 'none'
                            }}
                            onClick={handleSaveEvent}
                        >
                            {t('COMMON.BUTTON.SAVE_CHANGES')}
                        </Button>
                    </Box>
                </DialogActions>
            </Dialog>
        </Paper>
    )
}

export default MyCalendar
