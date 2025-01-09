import { createApi } from '@reduxjs/toolkit/query/react'
import { createBaseQuery } from './api'

interface ApiResponse {
    Success: boolean
    Data: any
}

const apiPath = 'https://localhost:44381/api/user/UserJobHistory'

export const userJobHistoryApi = createApi({
    reducerPath: 'userJobHistoryApi',
    baseQuery: createBaseQuery(apiPath),
    endpoints: builder => ({
        searchByUser: builder.query<ApiResponse, void>({
            query: () => `SearchByUser`
        })
    })
})

export const { useSearchByUserQuery } = userJobHistoryApi
