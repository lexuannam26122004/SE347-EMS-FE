'use client'
import { IFilterEmploymentContract } from '@/models/EmploymentContract'
import { Box, Typography, Paper } from '@mui/material'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useRouter } from 'next/navigation'
import TableErrorReport from './ListRules'

interface IGetAllRules {
    Id: string
    Name: string
    SalaryCoefficident: number
    Description: string
    IsActive: boolean
}

const responseData = {
    Data: {
        TotalRecords: 10,
        Records: [
            {
                Id: 'R0001',
                Name: 'Administrator',
                SalaryCoefficident: 1.5,
                Description: 'Administrator with full access',
                IsActive: true
            },
            {
                Id: 'R0002',
                Name: 'Manager',
                SalaryCoefficident: 1.2,
                Description: 'Manager with limited access',
                IsActive: true
            },
            {
                Id: 'R0003',
                Name: 'Employee',
                SalaryCoefficident: 1,
                Description: 'Standard employee role',
                IsActive: true
            },
            {
                Id: 'R0004',
                Name: 'IT Support',
                SalaryCoefficident: 1.1,
                Description: 'IT support with access to system maintenance',
                IsActive: true
            }
        ]
    }
}

function Page() {
    const { t } = useTranslation('common')
    const router = useRouter()
    const [selected, setSelected] = useState<number[]>([])
    const [page, setPage] = useState(1)
    const [rowsPerPage, setRowsPerPage] = useState('5')
    const [from, setFrom] = useState(1)
    const [to, setTo] = useState(5)
    const [filter, setFilter] = useState<IFilterEmploymentContract>({
        pageSize: 5,
        pageNumber: 1,
        daysUntilExpiration: 60
    })

    const [keyword] = useState('')
    // const [openDialog, setOpenDialog] = useState(false)
    // const [selectedRow, setSelectedRow] = useState<number | null>(null)
    // const [order, setOrder] = useState<'asc' | 'desc'>('asc')
    // const [orderBy, setOrderBy] = useState<string>('')
    // const [selectedConfig, setSelectedConfig] = useState<IGetAllSysConfiguration | null>(null)
    // const [openModal, setOpenModal] = useState(false)

    useEffect(() => {}, [page, rowsPerPage, from, to, filter, keyword, selected, router, setSelected, setFrom, setTo])

    useEffect(() => {}, [
        page,
        setPage,
        from,
        to,
        filter,
        setFilter,
        selected,
        setRowsPerPage,
        setSelected,
        setFrom,
        setTo
    ])

    // const { data: responseD, isFetching, refetch } = useGetContractsExpiringSoonQuery(filter)

    // const handleClickDetail = (config: IGetAllSysConfiguration) => {
    //     setSelectedConfig(config)
    //     setOpenModal(true)
    // }

    const rewardData = responseData?.Data.Records as IGetAllRules[]

    const totalRecords = (responseData?.Data.TotalRecords as number) || 0

    // useEffect(() => {
    //     if (!isFetching && responseData?.Data) {
    //         const from = (page - 1) * Number(rowsPerPage) + Math.min(1, rewardData.length)
    //         setFrom(from)

    //         const to = Math.min(rewardData.length + (page - 1) * Number(rowsPerPage), totalRecords)
    //         setTo(to)
    //     }
    // }, [isFetching, responseData, page, rowsPerPage])

    // useEffect(() => {
    //     refetch()
    // }, [filter])

    // Lọc dữ liệu theo status

    return (
        <Box>
            <Paper
                sx={{
                    width: '100%',
                    overflow: 'hidden',
                    boxShadow: 'var(--box-shadow-paper)',
                    borderRadius: '20px',
                    backgroundColor: 'var(--background-item)'
                }}
            >
                <Typography
                    sx={{
                        userSelect: 'none',
                        color: 'var(--text-color)',
                        fontWeight: 'bold',
                        fontSize: '18px',
                        display: 'flex',
                        alignItems: 'center',
                        padding: '24px 24px 15px'
                    }}
                >
                    {t('Danh sách chức vụ')}
                </Typography>

                <TableErrorReport rewardsData={rewardData} totalRecords={totalRecords} />
            </Paper>
        </Box>
    )
}

export default Page
