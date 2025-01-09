import { createApi } from '@reduxjs/toolkit/query/react'
import { IJobHistoryCreate } from '@/models/JobHistory'
import { createBaseQuery } from './api'

interface ApiResponse {
    Success: boolean
    Data: any
}

const apiPath = 'https://localhost:44381/api/admin/JobHistory'

export const JobHistoryApi = createApi({
    reducerPath: 'JobHistoryApi',
    baseQuery: createBaseQuery(apiPath),
    endpoints: builder => ({
        createUsers: builder.mutation<void, IJobHistoryCreate>({
            query: body => ({
                url: `Create`,
                method: 'POST',
                body: body
            })
        }),

        searchByUser: builder.query<ApiResponse, string>({
            query: id => `SearchByUser?id=${id}`
        })

        // getEmployeeCountByDepartment: builder.query<ApiResponse, void>({
        //     query: () => 'GetEmployeeCountByDepartment'
        // }),

        // getEmployeeCountByAge: builder.query<ApiResponse, void>({
        //     query: () => 'GetEmployeeCountByAge'
        // }),

        // getEmployeeCountByGender: builder.query<ApiResponse, void>({
        //     query: () => 'GetEmployeeCountByGender'
        // }),

        // changeStatusUsers: builder.mutation<void, string>({
        //     query: id => ({
        //         url: `ChangeStatus/${id}`,
        //         method: 'PUT'
        //     })
        // })
    })
})

export const {
    useCreateUsersMutation,
    useSearchByUserQuery
    // useChangeStatusUsersMutation,
    // useGetEmployeeCountByAgeQuery,
    // useGetEmployeeCountByGenderQuery,
    // useGetEmployeeCountByDepartmentQuery
} = JobHistoryApi
