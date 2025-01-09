import { createApi } from '@reduxjs/toolkit/query/react'
import { createBaseQuery } from './api'
import { IFilterSysConfiguration } from '@/models/SysConfiguration'

interface DisciplineResponse {
    Success: boolean
    Data: any
}

const apiPath = 'https://localhost:44381/api/user/UserDiscipline'
export const userDisciplineApi = createApi({
    reducerPath: 'userDisciplineApi',
    baseQuery: createBaseQuery(apiPath),
    tagTypes: ['Discipline'],
    endpoints: builder => ({
        getMeDisciplineInfo: builder.query<DisciplineResponse, { filter: IFilterSysConfiguration; year: number }>({
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

                if (year) params.append('year', year.toString())

                return `GetMeDisciplineInfo?${params.toString()}`
            },
            providesTags: ['Discipline']
        })
    })
})

export const { useGetMeDisciplineInfoQuery } = userDisciplineApi
