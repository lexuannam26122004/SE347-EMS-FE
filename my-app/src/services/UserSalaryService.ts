import { createApi } from '@reduxjs/toolkit/query/react'
import { createBaseQuery } from './api'

interface SalaryResponse {
    Success: boolean
    Data: any
}

const apiPath = 'https://localhost:44381/api/user/UserSalary'
export const userSalaryApi = createApi({
    reducerPath: 'userSalaryApi',
    baseQuery: createBaseQuery(apiPath),
    tagTypes: ['Salary'],
    endpoints: builder => ({
        getMeInfo: builder.query<SalaryResponse, void>({
            query: () => 'GetMeInfo',
            providesTags: ['Salary']
        }),
        getMeInfoCycle: builder.query<SalaryResponse, { year: string }>({
            query: ({ year }) => ({
                url: `GetMeInfoCycle?year=${year}`,
                method: 'GET'
            }),
            providesTags: ['Salary']
        }),
        getIncomeByYear: builder.query<SalaryResponse, { year: string }>({
            query: ({ year }) => ({
                url: `GetIncomeByYear?year=${year}`,
                method: 'GET'
            }),
            providesTags: ['Salary']
        }),
        getMeSalaryInfo: builder.query<SalaryResponse, { id: string }>({
            query: ({ id }) => ({
                url: `GetMeSalaryInfo?id=${id}`,
                method: 'GET'
            }),
            providesTags: ['Salary']
        })
    })
})

export const { useGetMeInfoQuery, useGetMeInfoCycleQuery, useGetIncomeByYearQuery, useGetMeSalaryInfoQuery } =
    userSalaryApi
