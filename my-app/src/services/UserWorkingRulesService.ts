import { createApi } from '@reduxjs/toolkit/query/react'
import { createBaseQuery } from './api'

interface WorkingRulesResponse {
    Success: boolean
    Data: any
}

export interface IFilter {
    isActive?: boolean
    createdDate?: Date
    createdBy?: string
    pageSize?: number
    pageNumber?: number
    sortBy?: string
    isDescending?: boolean
    keyword?: string
    name?: string
}

const apiPath = 'https://localhost:44381/api/user/UserWorkingRules'

export const userWorkingRulesApi = createApi({
    reducerPath: 'userWorkingRulesApi',
    baseQuery: createBaseQuery(apiPath),
    tagTypes: ['WorkingRules'],
    endpoints: builder => ({
        getAllWorkingRules: builder.query<WorkingRulesResponse, IFilter | void>({
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
                    if (filter.name) params.append('Name', filter.name)
                }
                return `Search?${params.toString()}`
            }
        })
    })
})

export const { useGetAllWorkingRulesQuery } = userWorkingRulesApi
