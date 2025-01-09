import { createApi } from '@reduxjs/toolkit/query/react'
import { IFilterTimekeeping } from '@/models/Timekeeping'
import { createBaseQuery } from './api'

interface TimekeepingResponse {
    Success: boolean
    Data: any
}

const apiPath = 'https://localhost:44381/api/admin/Timekeeping'

export const timekeepingApi = createApi({
    reducerPath: 'timekeepingApi',
    baseQuery: createBaseQuery(apiPath),
    endpoints: builder => ({
        searchTimekeeping: builder.query<TimekeepingResponse, IFilterTimekeeping | void>({
            query: () => 'Search'
        })
    })
})

export const { useSearchTimekeepingQuery } = timekeepingApi
