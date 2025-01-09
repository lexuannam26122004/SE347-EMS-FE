import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

interface SysFunctionResponse {
    Success: boolean
    Data: any
}

const apiPath = 'https://localhost:44381/api/admin/SysFunction'

export const sysFunctionApi = createApi({
    reducerPath: 'sysFunctionApi',
    baseQuery: fetchBaseQuery({ baseUrl: apiPath }),
    endpoints: builder => ({
        getAllAsTree: builder.query<SysFunctionResponse, void>({
            query: () => 'GetAllAsTree'
        }),
        getAllFunctions: builder.query<SysFunctionResponse, void>({
            query: () => 'GetAll'
        })
    })
})

export const { useGetAllAsTreeQuery, useGetAllFunctionsQuery } = sysFunctionApi
