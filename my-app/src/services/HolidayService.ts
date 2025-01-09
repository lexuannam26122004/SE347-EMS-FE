import { IEventCreate, IEventUpdate, IFilterEvent } from '@/models/Event'

import { createApi } from '@reduxjs/toolkit/query/react'
import { createBaseQuery } from './api'

interface IEventResponse {
    Success: boolean
    Data: any
}

const apiPath = 'https://localhost:44381/api/admin/Holiday'

export const holidayApi = createApi({
    // Defines unique name for this API slice in the Redux store
    reducerPath: 'holidayApi',

    // Configures the base query with the API URL
    baseQuery: createBaseQuery(apiPath),

    // Tags are used for cache invalidation
    tagTypes: ['Holiday'],

    // Define the API endpoints
    endpoints: builder => ({
        // Query endpoint to get all holidays
        // getAllHolidays: builder.query<HolidayResponse, IFilterSysConfiguration>({
        //     // Makes GET request to /GetAll
        //     query: () => 'GetAll',
        //     // Marks response with 'Holiday' tag for cache updates
        //     providesTags: ['Holiday']
        // }),

        // Mutation endpoint to create a new holiday
        createHoliday: builder.mutation<void, IEventCreate>({
            query: body => ({
                url: `Create`,
                method: 'POST',
                body: body
            }),
            invalidatesTags: ['Holiday']
        }),

        // Mutation endpoint to delete a holiday by ID
        deleteHoliday: builder.mutation<void, number>({
            query: id => ({
                url: `Remove/${id}`,
                method: 'DELETE'
            }),
            invalidatesTags: ['Holiday']
        }),
        deleteManyHoliday: builder.mutation<void, number[]>({
            // Makes DELETE request to /Remove/{id}
            query: ids => ({
                url: `DeleteMany`,
                method: 'DELETE',
                body: { Ids: ids }
            }),
            // Invalidates 'Holiday' cache so list refreshes
            invalidatesTags: ['Holiday']
        }),
        updateHoliday: builder.mutation<void, IEventUpdate>({
            query: body => ({
                url: `Update`,
                method: 'PUT',
                body: body
            }),
            invalidatesTags: ['Holiday']
        }),
        getByIdEvent: builder.query<IEventResponse, number>({
            query: id => `GetById?id=${id}`,
            providesTags: ['Holiday']
        }),
        getAllHoliday: builder.query<IEventResponse, IFilterEvent>({
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
            },
            providesTags: ['Holiday']
        })
    })
})

export const {
    useGetAllHolidayQuery,
    useCreateHolidayMutation,
    useDeleteHolidayMutation,
    useUpdateHolidayMutation,
    useDeleteManyHolidayMutation
} = holidayApi
