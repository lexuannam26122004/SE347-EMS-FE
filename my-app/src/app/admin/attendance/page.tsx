'use client'

import React, { useEffect, useMemo, useState, CSSProperties } from 'react'
import { Box, Paper, Typography } from '@mui/material'
import { Table, TableBody, TableCell, TableHead, TableRow, TableContainer } from '@mui/material'
import { ITimekeepingGetById, IFilterTimekeeping } from '@/models/Timekeeping'
import { IAspNetUserGetAll } from '@/models/AspNetUser'
import { IAspNetRoleGetAll } from '@/models/AspNetRole'
import { IDepartmentGetAll } from '@/models/Department'
import { useSearchTimekeepingQuery } from '@/services/TimekeepingService'
import { useGetAllUsersQuery } from '@/services/AspNetUserService'
import { useGetAllRolesQuery } from '@/services/AspNetRoleService'
import { useGetAllDepartmentQuery } from '@/services/DepartmentService'
import debounce from 'lodash.debounce'
import { useTranslation } from 'react-i18next'
import Loading from '@/components/Loading'

interface UserRowProps {
    user: IAspNetUserGetAll
    daysInMonth: number[]
    timekeepingLookup: Record<string, ITimekeepingGetById>
    checkIn: string
    filterModel: IFilterTimekeeping
}

interface TimekeepingPageProps {
    filterModel?: IFilterTimekeeping
}

const TimekeepingPage: React.FC<TimekeepingPageProps> = ({
    filterModel = { Month: new Date().getMonth() + 1, Year: new Date().getFullYear() }
}) => {
    const { t } = useTranslation('common')
    const [filters, setFilters] = useState({
        roles: [] as string[],
        departments: [] as string[]
    })

    const handleCheckboxChange = debounce((name: string, type: 'roles' | 'departments') => {
        setFilters(prevFilters => {
            const newValues = prevFilters[type].includes(name)
                ? prevFilters[type].filter(item => item !== name)
                : [...prevFilters[type], name]

            if (newValues.length !== prevFilters[type].length || newValues.some((v, i) => v !== prevFilters[type][i])) {
                return { ...prevFilters, [type]: newValues }
            } else {
                return prevFilters
            }
        })
    }, 100)

    const { data: userResponse, isLoading: isLoadingUsers } = useGetAllUsersQuery()
    const { data: roleResponse, isLoading: isLoadingRoles } = useGetAllRolesQuery()
    const { data: departmentResponse, isLoading: isLoadingDepartments } = useGetAllDepartmentQuery()
    const { data: timekeepingResponse, isLoading: isLoadingTimekeeping } = useSearchTimekeepingQuery(filterModel)

    const data = (timekeepingResponse?.Data as ITimekeepingGetById[]) || []
    const users = (userResponse?.Data.Records as IAspNetUserGetAll[]) || []
    const roles = (roleResponse?.Data.Records as IAspNetRoleGetAll[]) || []
    const departments = (departmentResponse?.Data as IDepartmentGetAll[]) || []

    const checkIn = '08:00'
    const employee = 178
    const workingDays = 4124
    const absences = 603
    const lates = 1711
    const latesPercent = '41.5%'
    const absencesPercent = '14.6%'

    const timekeepingLookup = useMemo(() => {
        const lookup: Record<string, ITimekeepingGetById> = {}
        data.forEach(item => {
            const key = `${item.UserId}-${new Date(item.Date).getDate()}`
            lookup[key] = item
        })
        return lookup
    }, [data])

    useEffect(() => {
        if (
            JSON.stringify(filters.roles) !== JSON.stringify(roles.map(role => role.Name)) ||
            JSON.stringify(filters.departments) !== JSON.stringify(departments.map(department => department.Name))
        ) {
            setFilters({
                roles: roles.map(role => role.Name),
                departments: departments.map(department => department.Name)
            })
        }
    }, [roles, departments])

    const daysInMonth = useMemo(
        () => Array.from({ length: new Date(filterModel.Year, filterModel.Month, 0).getDate() }, (_, i) => i + 1),
        [filterModel.Year, filterModel.Month]
    )

    const RenderTableCell = ({
        day,
        user,
        timekeepingLookup,
        checkIn,
        filterModel
    }: {
        day: number
        user: IAspNetUserGetAll
        timekeepingLookup: Record<string, ITimekeepingGetById>
        checkIn: string
        filterModel: IFilterTimekeeping
    }) => {
        const date = new Date(filterModel.Year, filterModel.Month - 1, day)
        const dayOfWeek = date.toLocaleDateString('en-US', { weekday: 'short' })
        const isSunday = dayOfWeek === 'Sun'

        const timekeepingData = timekeepingLookup[`${user.Id}-${day}`]

        const cellStyles: CSSProperties = {
            textAlign: 'center',
            padding: '0 5px',
            borderRight: '1px solid var(--border-color)',
            borderBottom: '1px solid var(--border-color)',
            backgroundColor: !isSunday
                ? typeof timekeepingData !== 'undefined'
                    ? timekeepingData.CheckInTime.slice(0, 5) > checkIn
                        ? '#ffe5e5'
                        : '#e4ffe4'
                    : '#fff1e2'
                : '#f3f0f0'
        }
        return (
            <TableCell key={`${user.Id}-${day}`} sx={cellStyles}>
                {timekeepingData ? (
                    <span
                        style={{
                            fontSize: '10px',
                            color: timekeepingData.CheckInTime.slice(0, 5) > checkIn ? 'red' : '#00a900'
                        }}
                    >
                        {timekeepingData.CheckInTime.slice(0, 5)}
                        <div style={{ margin: '-8px 0' }}>---</div>
                        {timekeepingData.CheckOutTime.slice(0, 5)}
                    </span>
                ) : (
                    ''
                )}
            </TableCell>
        )
    }

    const memoizedUsers = useMemo(
        () =>
            users.filter(
                user =>
                    filters.roles.some(role => Array.isArray(user.Roles) && user.Roles.includes(role)) &&
                    filters.departments.includes(user.DepartmentName)
            ),
        [users, filters]
    )

    const UserRow = React.memo(
        ({ user, daysInMonth, timekeepingLookup, checkIn, filterModel }: UserRowProps) => {
            return (
                <TableRow key={user.Id}>
                    <TableCell
                        sx={{
                            position: 'sticky',
                            left: 0,
                            backgroundColor: 'var(--background-color)',
                            minWidth: '14vw',
                            maxWidth: '20vw',
                            textAlign: 'left',
                            padding: '4px 10px',
                            borderRight: '1px solid var(--border-color)',
                            borderBottom: '1px solid var(--border-color)'
                        }}
                    >
                        <img
                            src={
                                user.AvatarPath ||
                                'https://localhost:44381/avatars/aa1678f0-75b0-48d2-ae98-50871178e9bd.jfif'
                            }
                            alt='Avatar'
                            style={{
                                borderRadius: '50%',
                                objectFit: 'cover',
                                float: 'left',
                                marginRight: '11px',
                                width: '35px',
                                height: '35px'
                            }}
                        />

                        <div style={{ overflow: 'hidden', flexGrow: 1 }}>
                            <p
                                style={{
                                    fontWeight: 'bold',
                                    margin: 0,
                                    marginTop: '1px',
                                    whiteSpace: 'nowrap',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis'
                                }}
                            >
                                <span
                                    style={{ overflow: 'hidden', textOverflow: 'ellipsis', color: 'var(--text-color)' }}
                                >
                                    {user.FullName}
                                </span>
                            </p>
                            <p
                                style={{
                                    fontWeight: '500',
                                    color: '#1879b3',
                                    fontSize: '10px',
                                    margin: 0,
                                    marginTop: '-2px',
                                    whiteSpace: 'nowrap',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis'
                                }}
                            >
                                <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                    {user.Roles ? user.Roles?.join(', ') : '#'} - {user.DepartmentName}
                                </span>
                            </p>
                        </div>
                    </TableCell>
                    {daysInMonth.map(day => {
                        return (
                            <RenderTableCell
                                filterModel={filterModel}
                                key={`${user.Id}-${day}`}
                                day={day}
                                user={user}
                                checkIn={checkIn}
                                timekeepingLookup={timekeepingLookup}
                            />
                        )
                    })}
                </TableRow>
            )
        },
        (prevProps, nextProps) => prevProps.user.Id === nextProps.user.Id
    )

    UserRow.displayName = 'UserRow'

    if (isLoadingUsers || isLoadingRoles || isLoadingDepartments || isLoadingTimekeeping) {
        return <Loading />
    }

    return (
        <Box display='flex'>
            <Box flexGrow={1} mr={0.7} sx={{ overflowX: 'auto', overflowY: 'auto' }}>
                <Paper
                    elevation={0}
                    sx={{
                        padding: '0px',
                        position: 'relative'
                    }}
                >
                    <TableContainer
                        sx={{
                            borderLeft: '1px solid var(--border-color)',
                            borderTop: '1px solid var(--border-color)',
                            maxHeight: 'calc(100vh - 90px)',
                            '&::-webkit-scrollbar': {
                                width: '7px',
                                height: '7px',
                                backgroundColor: 'var(--background-color)'
                            },
                            '&::-webkit-scrollbar-thumb': {
                                backgroundColor: 'var(--scrollbar-color)',
                                borderRadius: '10px'
                            },
                            '&::-webkit-scrollbar-corner': {
                                backgroundColor: 'var(--scrollbar-color)'
                            }
                        }}
                    >
                        <Table stickyHeader aria-label='sticky table table-border'>
                            <TableHead>
                                <TableRow sx={{ position: 'sticky', top: 0, zIndex: 3 }}>
                                    <TableCell
                                        sx={{
                                            position: 'sticky',
                                            left: 0,
                                            backgroundColor: 'var(--background-color)',
                                            zIndex: 5,
                                            minWidth: '3vw',
                                            whiteSpace: 'nowrap',
                                            borderRight: '1px solid var(--border-color)',
                                            borderBottom: '1px solid var(--border-color)'
                                        }}
                                    ></TableCell>

                                    {daysInMonth.map(day => {
                                        const date = new Date(filterModel.Year, filterModel.Month - 1, day)
                                        const dayOfWeek = date.toLocaleDateString('en-US', { weekday: 'short' })

                                        const isSundayOrSaturday = dayOfWeek === 'Sun' || dayOfWeek === 'Sat'

                                        return (
                                            <TableCell
                                                key={day}
                                                sx={{
                                                    textAlign: 'center',
                                                    fontSize: '10px',
                                                    position: 'sticky',
                                                    backgroundColor: 'var(--background-color)',
                                                    top: 0,
                                                    color: 'gray',
                                                    zIndex: 4,
                                                    padding: '0 10px',
                                                    width: '45px',
                                                    minWidth: '45px',
                                                    maxWidth: '45px',
                                                    borderRight: '1px solid var(--border-color)',
                                                    borderBottom: '1px solid var(--border-color)'
                                                }}
                                            >
                                                <span
                                                    style={{
                                                        fontWeight: 'bold',
                                                        color: isSundayOrSaturday ? '#ff3939' : 'gray',
                                                        fontSize: '10px',
                                                        display: 'block',
                                                        width: '100%'
                                                    }}
                                                >
                                                    {dayOfWeek.toUpperCase()}
                                                </span>
                                                <div style={{ margin: '-10px 0' }} />
                                                <span style={{ display: 'block', width: '100%' }}>
                                                    {day.toString().padStart(2, '0') + '/' + filterModel.Month}
                                                </span>
                                            </TableCell>
                                        )
                                    })}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {memoizedUsers.map(user => (
                                    <UserRow
                                        filterModel={filterModel}
                                        key={user.Id}
                                        user={user}
                                        daysInMonth={daysInMonth}
                                        checkIn={checkIn}
                                        timekeepingLookup={timekeepingLookup}
                                    />
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Paper>
            </Box>

            <Box flex={1}>
                <Paper
                    elevation={0}
                    sx={{
                        padding: '9px 5px 10px 5px',
                        minHeight: '16vh',
                        maxHeight: '18vh',
                        display: 'flex',
                        minWidth: '250px',
                        maxWidth: '19vw',
                        border: '1px solid var(--border-color)',
                        borderRadius: '6px',
                        backgroundColor: 'var(--background-color)'
                    }}
                >
                    <Box
                        flex={1}
                        display='flex'
                        flexDirection='column'
                        justifyContent='space-between'
                        borderRight='1px solid var(--border-color)'
                    >
                        <Box textAlign='center'>
                            <Typography variant='subtitle1' sx={{ fontSize: '16px', color: '#1dcafa' }}>
                                {employee}
                            </Typography>
                            <Typography variant='body2' sx={{ fontSize: '10px', color: 'var(--text-color)' }}>
                                {t('COMMON.TIMEKEEPING.EMPLOYEES')}
                            </Typography>
                        </Box>
                        <Box textAlign='center'>
                            <Typography variant='subtitle1' sx={{ fontSize: '16px', color: 'rgb(46, 233, 46)' }}>
                                {workingDays}
                            </Typography>
                            <Typography variant='body2' sx={{ fontSize: '10px', color: 'var(--text-color)' }}>
                                {t('COMMON.TIMEKEEPING.WORKING_DAYS')}
                            </Typography>
                        </Box>
                    </Box>
                    <Box
                        flex={1}
                        display='flex'
                        flexDirection='column'
                        justifyContent='space-between'
                        borderRight='1px solid var(--border-color)'
                    >
                        <Box textAlign='center'>
                            <Typography variant='subtitle1' sx={{ fontSize: '16px', color: '#ff3939' }}>
                                {lates}
                            </Typography>
                            <Typography variant='body2' sx={{ fontSize: '10px', color: 'var(--text-color)' }}>
                                {t('COMMON.TIMEKEEPING.LATE')}
                            </Typography>
                        </Box>
                        <Box textAlign='center'>
                            <Typography variant='subtitle1' sx={{ fontSize: '16px', color: '#ff3939' }}>
                                {latesPercent}
                            </Typography>
                            <Typography variant='body2' sx={{ fontSize: '10px', color: 'var(--text-color)' }}>
                                {t('COMMON.TIMEKEEPING.LATE')}
                            </Typography>
                        </Box>
                    </Box>
                    <Box flex={1} display='flex' flexDirection='column' justifyContent='space-between'>
                        <Box textAlign='center'>
                            <Typography variant='subtitle1' sx={{ fontSize: '16px', color: 'rgb(252 129 30)' }}>
                                {absences}
                            </Typography>
                            <Typography variant='body2' sx={{ fontSize: '10px', color: 'var(--text-color)' }}>
                                {t('COMMON.TIMEKEEPING.ABSENCES')}
                            </Typography>
                        </Box>
                        <Box textAlign='center'>
                            <Typography variant='subtitle1' sx={{ fontSize: '16px', color: 'rgb(252 129 30)' }}>
                                {absencesPercent}
                            </Typography>
                            <Typography variant='body2' sx={{ fontSize: '10px', color: 'var(--text-color)' }}>
                                {t('COMMON.TIMEKEEPING.ABSENCES')}
                            </Typography>
                        </Box>
                    </Box>
                </Paper>

                <Paper
                    elevation={0}
                    sx={{
                        marginTop: '10px',
                        padding: '10px',
                        minWidth: '250px',
                        maxWidth: '19vw',
                        overflow: 'hidden',
                        border: '1px solid var(--border-color)',
                        borderRadius: '6px',
                        backgroundColor: 'var(--background-color)'
                    }}
                >
                    <Typography variant='h6' sx={{ fontSize: '11px', color: 'var(--text-color)' }}>
                        {t('COMMON.TIMEKEEPING.FILTER_BY_ROLES')}
                    </Typography>
                    <Box
                        sx={{
                            marginTop: '6px',
                            overflowX: 'auto',
                            paddingRight: '10px',
                            '&::-webkit-scrollbar': {
                                width: '7px',
                                height: '7px',
                                borderRadius: '10px',
                                backgroundColor: 'var(--background-color)'
                            },
                            '&::-webkit-scrollbar-thumb': {
                                backgroundColor: 'var(--scrollbar-color)',
                                borderRadius: '10px'
                            }
                        }}
                    >
                        {roles.map(role => (
                            <div key={role.Id}>
                                <label
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        fontSize: '15px',
                                        color: '#146ca1',
                                        marginTop: '4px',
                                        fontWeight: '600'
                                    }}
                                >
                                    <input
                                        type='checkbox'
                                        checked={filters.roles.includes(role.Name)}
                                        onChange={() => handleCheckboxChange(role.Name, 'roles')}
                                        style={{
                                            width: '15px',
                                            minWidth: '15px',
                                            height: '15px',
                                            marginRight: '8px',
                                            transform: 'scale(0.8)',
                                            accentColor: '#146ca1'
                                        }}
                                    />
                                    <span
                                        style={{
                                            whiteSpace: 'nowrap'
                                        }}
                                    >
                                        {role.Name}
                                    </span>
                                </label>
                            </div>
                        ))}
                    </Box>
                </Paper>

                <Paper
                    elevation={0}
                    sx={{
                        marginTop: '10px',
                        padding: '10px',
                        minWidth: '250px',
                        maxWidth: '19vw',
                        overflow: 'hidden',
                        border: '1px solid var(--border-color)',
                        borderRadius: '6px',
                        backgroundColor: 'var(--background-color)'
                    }}
                >
                    <Typography variant='h6' sx={{ fontSize: '11px', color: 'var(--text-color)' }}>
                        {t('COMMON.TIMEKEEPING.FILTER_BY_DEPARTMENTS')}
                    </Typography>
                    <Box
                        sx={{
                            marginTop: '6px',
                            overflowX: 'auto',
                            paddingRight: '10px',
                            '&::-webkit-scrollbar': {
                                width: '7px',
                                height: '7px',
                                borderRadius: '10px',
                                backgroundColor: 'var(--background-color)'
                            },
                            '&::-webkit-scrollbar-thumb': {
                                backgroundColor: 'var(--scrollbar-color)',
                                borderRadius: '10px'
                            }
                        }}
                    >
                        {departments.map(department => (
                            <div key={department.Id}>
                                <label
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        fontSize: '15px',
                                        color: '#146ca1',
                                        marginTop: '4px',
                                        fontWeight: '600'
                                    }}
                                >
                                    <input
                                        type='checkbox'
                                        checked={filters.departments.includes(department.Name)}
                                        onChange={() => handleCheckboxChange(department.Name, 'departments')}
                                        style={{
                                            width: '15px',
                                            height: '15px',
                                            marginRight: '8px',
                                            transform: 'scale(0.8)',
                                            accentColor: '#146ca1'
                                        }}
                                    />
                                    <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                        {department.Name}
                                    </span>
                                </label>
                            </div>
                        ))}
                    </Box>
                </Paper>
            </Box>
        </Box>
    )
}

TimekeepingPage.displayName = 'TimekeepingPage'

export default TimekeepingPage
