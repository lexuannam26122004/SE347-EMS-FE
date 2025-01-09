import { createApi } from '@reduxjs/toolkit/query/react'
import { createBaseQuery } from './api'
import {
    IEmploymentContractCreate,
    IFilterEmploymentContract,
    IEmploymentContractUpdate
} from '@/models/EmploymentContract'
//import { use } from 'i18next'
interface EmploymentContractResponse {
    Success: boolean
    Data: any
}

interface IMonthAndYear {
    Month: number
    Year: number
}

const apiPath = 'https://localhost:44381/api/admin/EmploymentContract'

export const EmploymentContractApi = createApi({
    reducerPath: 'EmploymentContractApi',
    baseQuery: createBaseQuery(apiPath),
    endpoints: builder => ({
        searchEmploymentContracts: builder.query<EmploymentContractResponse, void>({
            query: () => 'Search/search'
        }),

        createEmploymentContracts: builder.mutation<void, IEmploymentContractCreate>({
            query: body => ({
                url: `Create`,
                method: 'POST',
                body: body
            })
        }),

        updateEmploymentContracts: builder.mutation<void, IEmploymentContractUpdate>({
            query: body => ({
                url: `Update`,
                method: 'PUT',
                body: body
            })
        }),

        getEmployeeStatsByMonthAndYear: builder.query<EmploymentContractResponse, IMonthAndYear>({
            query: params => `GetEmployeeStatsByMonthAndYear/monthly-stats?year=${params.Year}&month=${params.Month}`
        }),

        getEmployeesStatsByYears: builder.query<EmploymentContractResponse, number>({
            query: params => `GetEmployeesStatsByYears?year=${params}`
        }),

        getByIdEmploymentContracts: builder.query<EmploymentContractResponse, string>({
            query: id => `GetById/${id}`
        }),

        getContractsExpiringSoon: builder.query<EmploymentContractResponse, IFilterEmploymentContract>({
            query: filter => {
                const params = new URLSearchParams()

                if (filter) {
                    if (filter.createdBy) params.append('CreatedBy', filter.createdBy)
                    if (filter.createdDate) params.append('CreatedDate', filter.createdDate.toDateString())
                    if (filter.pageSize) params.append('PageSize', filter.pageSize.toString())
                    if (filter.pageNumber) params.append('PageNumber', filter.pageNumber.toString())
                    if (filter.isActive !== undefined) params.append('IsActive', filter.isActive.toString())
                    if (filter.keyword) params.append('Keyword', filter.keyword)
                    if (filter.isDescending !== undefined) params.append('IsDescending', filter.isDescending.toString())
                    if (filter.sortBy) params.append('SortBy', filter.sortBy)
                    if (filter.daysUntilExpiration)
                        params.append('daysUntilExpiration', filter.daysUntilExpiration.toString())
                }

                return `GetContractsExpiringSoon/expiring-soon?${params.toString()}`
            }
        }),

        changeStatusEmploymentContracts: builder.mutation<void, string>({
            query: id => ({
                url: `ChangeStatus/${id}/status`,
                method: 'PUT'
            })
        })
    })
})

export const {
    useSearchEmploymentContractsQuery,
    useCreateEmploymentContractsMutation,
    useGetByIdEmploymentContractsQuery,
    useUpdateEmploymentContractsMutation,
    useChangeStatusEmploymentContractsMutation,
    useGetEmployeeStatsByMonthAndYearQuery,
    useGetEmployeesStatsByYearsQuery,
    useGetContractsExpiringSoonQuery
} = EmploymentContractApi
