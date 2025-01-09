import { createApi } from '@reduxjs/toolkit/query/react'
import { IFilterRole } from '../models/AspNetRole'
import { createBaseQuery } from './api'

interface RoleResponse {
    Success: boolean
    Data: any
}

const apiPath = 'https://localhost:44381/api/admin/AspNetRole'

export const roleApi = createApi({
    reducerPath: 'roleApi',
    baseQuery: createBaseQuery(apiPath),
    endpoints: builder => ({
        getAllRoles: builder.query<RoleResponse, IFilterRole>({
            query: filter => {
                const params = new URLSearchParams()

                if (filter) {
                    if (filter.pageSize) params.append('PageSize', filter.pageSize.toString())
                    if (filter.pageNumber) params.append('PageNumber', filter.pageNumber.toString())
                    if (filter.keyword) params.append('Keyword', filter.keyword)
                    if (filter.isDescending !== undefined) params.append('IsDescending', filter.isDescending.toString())
                    if (filter.sortBy) params.append('SortBy', filter.sortBy)
                }

                return `GetAll?${params.toString()}`
            }
        }),
        getJsonRoleHasFunctions: builder.query<RoleResponse, string>({
            query: id => `GetJsonRoleHasFunctions?roleId=${id}`
        }),
        updateJsonRoleHasFunctions: builder.mutation<RoleResponse, any>({
            query: data => ({
                url: '/UpdateJsonRoleHasFunctions',
                method: 'PUT',
                body: data
            })
        })
    })
})

export const { useGetAllRolesQuery, useGetJsonRoleHasFunctionsQuery, useUpdateJsonRoleHasFunctionsMutation } = roleApi
