import { TableContainer, Table, TableRow, TableBody, TableCell, Box, CircularProgress } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { useGetByIdUsersQuery } from '@/services/AspNetUserService'
import { useEffect, useState } from 'react'
import { IDepartmentGetAll } from '@/models/Department'
import { useGetAllDepartmentQuery } from '@/services/DepartmentService'

interface EmployeeProps {
    aspnetUserId: string
}

const Employee: React.FC<EmployeeProps> = ({ aspnetUserId }) => {
    const { t } = useTranslation('common')

    const [fullName, setFullName] = useState('')
    const [userName, setUserName] = useState('')
    const [email, setEmail] = useState('')
    const [phoneNumber, setPhoneNumber] = useState('')
    const [startDateWork, setStartDateWork] = useState('')
    const [gender, setGender] = useState(null)
    const [address, setAddress] = useState('')
    const [note, setNote] = useState('')
    const [birthday, setBirthday] = useState('')
    const [departmentId, setDepartmentId] = useState(0)
    const [employeeId, setEmployeeId] = useState('')
    const [roles, setRoles] = useState<string[]>([])

    const { data: responseData, isFetching: isFetchingGetById } = useGetByIdUsersQuery(aspnetUserId)
    const { data: departmentResponse, isLoading: isDepartmentLoading } = useGetAllDepartmentQuery()
    const department = (departmentResponse?.Data?.Records as IDepartmentGetAll[]) || []

    const data = responseData?.Data
    useEffect(() => {
        if (!isFetchingGetById && data) {
            setEmployeeId(data.EmployeeId)
            setFullName(data.FullName)
            setUserName(data.UserName)
            setEmail(data.Email)
            setPhoneNumber(data.PhoneNumber)
            setStartDateWork(data.StartDateWork)
            setGender(data.Gender)
            setAddress(data.Address)
            setNote(data.Note)
            setBirthday(data.Birthday)
            setDepartmentId(data.DepartmentId)
            setRoles(data.Roles)
        }
    }, [data, isFetchingGetById])

    if (isDepartmentLoading) {
        return (
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '400px',
                    backgroundColor: '#f5f5f5'
                }}
            >
                <CircularProgress />
            </Box>
        )
    }

    return (
        <TableContainer
            sx={{
                padding: '20px',
                backgroundColor: 'var(--hover-color)',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                borderRadius: '12px',
                overflow: 'hidden',
                border: '1px solid #e0e0e0',
                maxWidth: '96%',
                margin: '20px auto', 
                '&::-webkit-scrollbar': {
                    width: '8px',
                    height: '8px',
                    backgroundColor: 'var(--hover-color)'
                },
                '&::-webkit-scrollbar-thumb': {
                    backgroundColor: '#888',
                    borderRadius: '10px',
                    transition: 'background-color 0.3s ease'
                },
                '&::-webkit-scrollbar-thumb:hover': {
                    backgroundColor: '#555'
                },
                '&::-webkit-scrollbar-corner': {
                    borderRadius: '10px'
                },
                color: 'var(--text-color)'
            }}
        >
            <Table>
                <TableBody>
                    {[
                        { label: t('ID'), value: employeeId },
                        { label: t('COMMON.EMPLOYEE.FULLNAME'), value: fullName || 'N/A' },
                        {
                            label: t('COMMON.EMPLOYEE.DEPARTMENTNAME'),
                            value: department.find(dm => dm.Id === departmentId)?.Name || 'N/A'
                        },
                        { label: t('COMMON.EMPLOYEE.USERNAME'), value: userName || 'N/A' },
                        {
                            label: t('COMMON.EMPLOYEE.ROLES'),
                            value: roles?.join(', ') || 'N/A'
                        },
                        {
                            label: t('COMMON.EMPLOYEE.GENDER'),
                            value: gender === true ? t('Nam') : gender === false ? t('Nữ') : t('Khác')
                        },
                        { label: t('COMMON.EMPLOYEE.ADDRESS'), value: address || 'N/A' },
                        {
                            label: t('COMMON.EMPLOYEE.BIRTHDAY'),
                            value:
                                birthday && !isNaN(new Date(birthday).getTime())
                                    ? new Date(birthday).toLocaleDateString()
                                    : 'N/A'
                        },
                        {
                            label: t('COMMON.EMPLOYEE.STARTDATE'),
                            value:
                                startDateWork && !isNaN(new Date(startDateWork).getTime())
                                    ? new Date(startDateWork).toLocaleDateString()
                                    : 'N/A'
                        },
                        { label: t('COMMON.EMPLOYEE.EMAIL'), value: email || 'N/A' },
                        { label: t('COMMON.EMPLOYEE.PHONENUMBER'), value: phoneNumber || 'N/A' },
                        { label: t('COMMON.EMPLOYEE.NOTE'), value: note || 'N/A' }
                    ].map((item, index) => (
                        <TableRow
                            key={index}
                            sx={{
                                color: 'var(--text-color)',
                                backgroundColor: index % 2 === 0 ? 'var(--hover-color)' : 'var(--background-color)',
                                '&:hover': {
                                    backgroundColor: 'var(--selected-menu-text-color)',
                                    cursor: 'pointer'
                                },
                                transition: 'background-color 0.3s ease'
                            }}
                        >
                            <TableCell
                                sx={{
                                    fontSize: '18px',
                                    fontWeight: '600',
                                    paddingLeft: '30px',
                                    paddingRight: '20px',
                                    width: '40%',
                                    borderBottom: '1px solid var(--hover-color)',
                                    borderRight: '2px solid var(--hover-color)',
                                    color: 'var(--text-color)'
                                }}
                            >
                                {item.label}:
                            </TableCell>
                            <TableCell
                                sx={{
                                    fontSize: '16px',
                                    paddingLeft: '20px',
                                    borderBottom: '1px solid var(--hover-color)',
                                    paddingRight: '30px',
                                    borderLeft: '2px solid var(--hover-color)',
                                    color: 'var(--text-color)'
                                }}
                            >
                                {item.value}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    )
}

export default Employee
