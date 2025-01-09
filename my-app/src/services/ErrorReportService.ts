import { createApi } from '@reduxjs/toolkit/query/react'
import { IErrorReportCreate, IErrorReportUpdate } from '@/models/ErrorReport'
import { createBaseQuery } from './api'
interface ErrorReportResponse {
    Success: boolean
    Data: any
}
interface IMonthAndYear {
    Month: number
    Year: number
}

interface IFilter {
    pageSize?: number
    pageNumber?: number
    sortBy?: string
    isDescending?: boolean
    keyword?: string
    isType?: string
}

const apiPath = 'https://localhost:44381/api/admin/ErrorReport'

export const ErrorReportApi = createApi({
    reducerPath: 'ErrorReportApi',
    baseQuery: createBaseQuery(apiPath),
    endpoints: builder => ({
        searchErrorReport: builder.query<ErrorReportResponse, IFilter>({
            query: filter => {
                const params = new URLSearchParams()

                if (filter) {
                    if (filter.pageSize) params.append('PageSize', filter.pageSize.toString())
                    if (filter.pageNumber) params.append('PageNumber', filter.pageNumber.toString())
                    if (filter.keyword) params.append('Keyword', filter.keyword)
                    if (filter.isDescending !== undefined) params.append('IsDescending', filter.isDescending.toString())
                    if (filter.sortBy) params.append('SortBy', filter.sortBy)
                    if (filter.isType) params.append('Keyword', filter.isType)
                }

                return `Search/search?${params.toString()}`
            }
        }),

        searchByUserId: builder.query<ErrorReportResponse, IFilter>({
            query: filter => {
                const params = new URLSearchParams()

                if (filter) {
                    if (filter.pageSize) params.append('PageSize', filter.pageSize.toString())
                    if (filter.pageNumber) params.append('PageNumber', filter.pageNumber.toString())
                    if (filter.keyword) params.append('Keyword', filter.keyword)
                    if (filter.isDescending !== undefined) params.append('IsDescending', filter.isDescending.toString())
                    if (filter.sortBy) params.append('SortBy', filter.sortBy)
                    if (filter.isType) params.append('Keyword', filter.isType)
                }

                return `SearchByUserId?${params.toString()}`
            }
        }),

        countErrorReportsByStatusAndMonth: builder.query<ErrorReportResponse, number>({
            query: params => `CountErrorReportsByStatusAndMonth?year=${params}`
        }),

        getCountErrorReportsInMonth: builder.query<ErrorReportResponse, IMonthAndYear>({
            query: params => `CountErrorReportsInMonth?year=${params.Year}&month=${params.Month}`
        }),

        getCountErrorReportsByTypeAndYear: builder.query<ErrorReportResponse, number>({
            query: params => `CountErrorReportsByTypeAndYear?year=${params}`
        }),

        createErrorReports: builder.mutation<void, IErrorReportCreate>({
            query: body => ({
                url: `Create`,
                method: 'POST',
                body: body
            })
        }),
        updateErrorReports: builder.mutation<void, IErrorReportUpdate>({
            query: body => ({
                url: `Update`,
                method: 'PUT',
                body: body
            })
        }),

        getByIdErrorReports: builder.query<ErrorReportResponse, number>({
            query: id => `GetById/${id}`
        }),

        changeStatusErrorReports: builder.mutation<void, number>({
            query: id => ({
                url: `ChangeStatus/${id}/status`,
                method: 'PUT'
            })
        })
    })
})

export const {
    useSearchErrorReportQuery,
    useSearchByUserIdQuery,
    useCountErrorReportsByStatusAndMonthQuery,
    useCreateErrorReportsMutation,
    useUpdateErrorReportsMutation,
    useGetByIdErrorReportsQuery,
    useGetCountErrorReportsInMonthQuery,
    useGetCountErrorReportsByTypeAndYearQuery,
    useChangeStatusErrorReportsMutation
} = ErrorReportApi
