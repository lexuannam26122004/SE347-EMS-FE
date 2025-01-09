import { createApi } from '@reduxjs/toolkit/query/react'
import { IAspNetUserCreate, IAspNetUserUpdate } from '@/models/AspNetUser'
import { createBaseQuery } from './api'
interface ApiResponse {
    Success: boolean
    Data: any
}

const apiPath = 'https://localhost:44381/api/admin/AspNetUser'

export const userApi = createApi({
    reducerPath: 'userApi',
    baseQuery: createBaseQuery(apiPath),
    endpoints: builder => ({
        getAllUsers: builder.query<ApiResponse, void>({
            query: () => 'GetAll'
        }),

        createUsers: builder.mutation<void, IAspNetUserCreate>({
            query: body => ({
                url: `Create`,
                method: 'POST',
                body: body
            })
        }),
        updateUsers: builder.mutation<void, IAspNetUserUpdate>({
            query: body => ({
                url: `Update`,
                method: 'PUT',
                body: body
            })
        }),

        getByIdUsers: builder.query<ApiResponse, string>({
            query: id => `GetById?id=${id}`
        }),

        getEmployeeCountByDepartment: builder.query<ApiResponse, void>({
            query: () => 'GetEmployeeCountByDepartment'
        }),

        getEmployeeCountByAge: builder.query<ApiResponse, void>({
            query: () => 'GetEmployeeCountByAge'
        }),

        getEmployeeCountByGender: builder.query<ApiResponse, void>({
            query: () => 'GetEmployeeCountByGender'
        }),

        changeStatusUsers: builder.mutation<void, string>({
            query: id => ({
                url: `ChangeStatus/${id}`,
                method: 'PUT'
            })
        })
    })
})

export const {
    useGetAllUsersQuery,
    useCreateUsersMutation,
    useUpdateUsersMutation,
    useGetByIdUsersQuery,
    useChangeStatusUsersMutation,
    useGetEmployeeCountByAgeQuery,
    useGetEmployeeCountByGenderQuery,
    useGetEmployeeCountByDepartmentQuery
} = userApi
