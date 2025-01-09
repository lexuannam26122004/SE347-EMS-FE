import { ISalaryGetAll } from '@/models/salary'
import { IFilterSysConfiguration } from '@/models/SysConfiguration'
import { createApi } from '@reduxjs/toolkit/query/react'
import { ITotalEventsByMonth } from '@/models/Event'
import { createBaseQuery } from './api'

interface SalaryResponse {
    Success: boolean
    Data: any
}

const apiPath = 'https://localhost:44381/api/admin/Salary'

export const salaryApi = createApi({
    reducerPath: 'salaryApi',
    baseQuery: createBaseQuery(apiPath),
    tagTypes: ['Salary'],
    endpoints: builder => ({
        getAllSalaries: builder.query<SalaryResponse, { filter: IFilterSysConfiguration; period: string }>({
            query: ({ filter, period }) => {
                const params = new URLSearchParams()

                // Add filter parameters to URL
                if (filter) {
                    if (filter.createdBy) params.append('CreatedBy', filter.createdBy)
                    if (filter.createdDate) params.append('CreatedDate', filter.createdDate.toISOString())
                    if (filter.pageSize) params.append('PageSize', filter.pageSize.toString())
                    if (filter.pageNumber) params.append('PageNumber', filter.pageNumber.toString())
                    if (filter.isActive !== undefined) params.append('IsActive', filter.isActive.toString())
                    if (filter.keyword) params.append('Keyword', filter.keyword)
                    if (filter.isDescending !== undefined) params.append('IsDescending', filter.isDescending.toString())
                    if (filter.sortBy) params.append('SortBy', filter.sortBy)
                }

                if (period) params.append('Period', period)

                return `GetAll?${params.toString()}`
            },
            providesTags: ['Salary']
        }),
        updateSalary: builder.mutation<void, ISalaryGetAll>({
            query: salary => ({
                url: 'Update',
                method: 'PUT',
                body: salary
            }),
            invalidatesTags: ['Salary']
        }),
        getSalaryById: builder.query<SalaryResponse, { Id: string }>({
            query: ({ Id }) => ({
                url: `GetById?id=${Id}`,
                method: 'GET'
            }),
            providesTags: ['Salary']
        }),
        getYearIncome: builder.query<SalaryResponse, { year: number }>({
            query: ({ year }) => ({
                url: `GetYearIncome?year=${year}`,
                method: 'GET'
            }),
            providesTags: ['Salary']
        }),
        updateSalaryById: builder.mutation<void, { Id: string }>({
            query: ({ Id }) => ({
                url: `Update?Id=${Id}`, // Properly wrap `Id` in a string template
                method: 'PUT'
            }),
            invalidatesTags: ['Salary'] // This ensures the cache is updated after the mutation
        }),
        paymentConfirmation: builder.mutation<void, { Id: string }>({
            query: ({ Id }) => ({
                url: `PaymentConfirmation?Id=${Id}`,
                method: 'PUT'
            }),
            invalidatesTags: ['Salary'] // Ensure cache invalidation after updating the salary status
        }),
        changeStatus: builder.mutation<void, string>({
            query: id => ({
                url: `Remove/${id}`,
                method: 'PUT'
            }),
            invalidatesTags: ['Salary']
        }),
        changeStatusMany: builder.mutation<void, string[]>({
            query: ids => ({
                url: `ChangeStatusMany`,
                method: 'PUT',
                body: { Ids: ids }
            }),
            // Invalidates 'Holiday' cache so list refreshes
            invalidatesTags: ['Salary']
        }),
        getIncomeInMonth: builder.query<SalaryResponse, ITotalEventsByMonth>({
            query: params => `GetIncomeInMonth?month=${params.Month}&year=${params.Year}`
        }),
        getInfoForDepartmentChart: builder.query<SalaryResponse, void>({
            query: () => 'GetInfoForDepartmentChart',
            providesTags: ['Salary']
        }),
        getSalaryByLevel: builder.query<SalaryResponse, void>({
            query: () => 'GetSalaryByLevel',
            providesTags: ['Salary']
        }),
        createSalary: builder.mutation<void, void>({
            query: () => ({
                url: 'Create',
                method: 'Post'
            }),
            invalidatesTags: ['Salary']
        }),
        getInfoForSalarySummary: builder.query<SalaryResponse, void>({
            query: () => 'GetInfoForSalarySummary',
            providesTags: ['Salary']
        }),
        getTotalIncomeOverTime: builder.query<SalaryResponse, void>({
            query: () => 'GetTotalIncomeOverTime',
            providesTags: ['Salary']
        }),
        getIncomeStructure: builder.query<SalaryResponse, void>({
            query: () => 'GetIncomeStructure',
            providesTags: ['Salary']
        }),
        getPeriod: builder.query<SalaryResponse, void>({
            query: () => 'getPeriod',
            providesTags: ['Salary']
        }),
        getTotalBySex: builder.query<SalaryResponse, void>({
            query: () => 'GetTotalBySex',
            providesTags: ['Salary']
        }),
        getGrossTotal: builder.query<SalaryResponse, void>({
            query: () => 'GetGrossTotal',
            providesTags: ['Salary']
        }),
        getTotalMaxMin: builder.query<SalaryResponse, void>({
            query: () => 'GetTotalMaxMin',
            providesTags: ['Salary']
        }),
        getDisplayInfo: builder.query<SalaryResponse, void>({
            query: () => 'GetDisplayInfo',
            providesTags: ['Salary']
        }),
        getGrossTotalByDepartments: builder.query<SalaryResponse, void>({
            query: () => 'GetGrossTotalByDepartments',
            providesTags: ['Salary']
        }),
        getPayrollOfDepartmentOvertime: builder.query<SalaryResponse, { year: string }>({
            query: ({ year }) => ({
                url: `GetPayrollOfDepartmentOvertime?year=${year}`,
                method: 'GET'
            }),
            providesTags: ['Salary']
        }),
        getPayrollReport: builder.query<SalaryResponse, { year: string }>({
            query: ({ year }) => ({
                url: `GetPayrollReport?year=${year}`,
                method: 'GET'
            }),
            providesTags: ['Salary']
        }),
        getUnpaidSalary: builder.query<SalaryResponse, { filter: IFilterSysConfiguration; year: string }>({
            query: ({ filter, year }) => {
                const params = new URLSearchParams()

                // Add filter parameters to URL
                if (filter) {
                    if (filter.createdBy) params.append('CreatedBy', filter.createdBy)
                    if (filter.createdDate) params.append('CreatedDate', filter.createdDate.toISOString())
                    if (filter.pageSize) params.append('PageSize', filter.pageSize.toString())
                    if (filter.pageNumber) params.append('PageNumber', filter.pageNumber.toString())
                    if (filter.isActive !== undefined) params.append('IsActive', filter.isActive.toString())
                    if (filter.keyword) params.append('Keyword', filter.keyword)
                    if (filter.isDescending !== undefined) params.append('IsDescending', filter.isDescending.toString())
                    if (filter.sortBy) params.append('SortBy', filter.sortBy)
                }

                if (year) params.append('Year', year)

                return `GetUnpaidSalary?${params.toString()}`
            },
            providesTags: ['Salary']
        }),
        getPayrollOverview: builder.query<SalaryResponse, { period: string }>({
            query: ({ period }) => ({
                url: `PayrollOverview?period=${period}`,
                method: 'GET'
            }),
            providesTags: ['Salary']
        })
    })
})

export const {
    useGetAllSalariesQuery,
    useGetSalaryByIdQuery,
    useUpdateSalaryMutation,
    usePaymentConfirmationMutation,
    useUpdateSalaryByIdMutation,
    useChangeStatusMutation,
    useChangeStatusManyMutation,
    useGetInfoForDepartmentChartQuery,
    useGetSalaryByLevelQuery,
    useCreateSalaryMutation,
    useGetInfoForSalarySummaryQuery,
    useGetTotalIncomeOverTimeQuery,
    useGetIncomeStructureQuery,
    useGetPeriodQuery,
    useGetTotalBySexQuery,
    useGetGrossTotalQuery,
    useGetTotalMaxMinQuery,
    useGetDisplayInfoQuery,
    useGetGrossTotalByDepartmentsQuery,
    useGetPayrollOfDepartmentOvertimeQuery,
    useGetPayrollReportQuery,
    useGetUnpaidSalaryQuery,
    useGetPayrollOverviewQuery,
    useGetIncomeInMonthQuery,
    useGetYearIncomeQuery
} = salaryApi
