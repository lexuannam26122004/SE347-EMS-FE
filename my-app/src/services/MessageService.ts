import { IMessageCreate } from '@/models/Message'
import { createApi } from '@reduxjs/toolkit/query/react'
import { createBaseQuery } from './api'

interface IMessageResponse {
    Success: boolean
    Data: any
}

const apiPath = 'https://localhost:44381/api/admin/Message'
export const messageApi = createApi({
    reducerPath: 'messageApi',
    baseQuery: createBaseQuery(apiPath),
    tagTypes: ['Message'],
    endpoints: builder => ({
        getAllMessage: builder.query<IMessageResponse, void>({
            query: () => 'GetAll',
            providesTags: ['Message']
        }),
        createMessage: builder.mutation<void, IMessageCreate>({
            query: message => ({
                url: 'Create',
                method: 'Post',
                body: message
            }),
            invalidatesTags: ['Message']
        }),
        getMeMessage: builder.query<IMessageResponse, void>({
            query: () => `GetMeMessage`,
            providesTags: ['Message']
        }),
        getAllMessageToAnalytics: builder.query<IMessageResponse, number>({
            query: type => `GetAllMessage?type=${type}`,
            providesTags: ['Message']
        })
    })
})

export const {
    useGetAllMessageQuery,
    useCreateMessageMutation,
    useGetMeMessageQuery,
    useGetAllMessageToAnalyticsQuery
} = messageApi
