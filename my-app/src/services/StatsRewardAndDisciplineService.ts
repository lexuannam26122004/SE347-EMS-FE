import { createApi } from '@reduxjs/toolkit/query/react'
import { createBaseQuery } from './api'

interface StatsRewardAndDisciplineResponse {
    Success: boolean
    Data: any
}

const apiPath = 'https://localhost:44381/api/admin/StatsRewardAndDiscipline'

export const statsRewardAndDisciplineApi = createApi({
    reducerPath: 'statsRewardAndDisciplineApi',
    baseQuery: createBaseQuery(apiPath),
    endpoints: builder => ({
        topUserByMonth: builder.query<StatsRewardAndDisciplineResponse, { month: number; year: number }>({
            query: params => `TopUserByMonth?month=${params.month}&year=${params.year}`
        }),
        statsDisplay: builder.query<StatsRewardAndDisciplineResponse, { month: number; year: number }>({
            query: params => `StatsDisplay?month=${params.month}&year=${params.year}`
        }),
        statsChart: builder.query<StatsRewardAndDisciplineResponse, number>({
            query: year => `StatsChart?year=${year}`
        })
    })
})

export const { useTopUserByMonthQuery, useStatsDisplayQuery, useStatsChartQuery } = statsRewardAndDisciplineApi
