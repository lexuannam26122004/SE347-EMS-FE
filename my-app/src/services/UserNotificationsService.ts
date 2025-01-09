import { createApi } from '@reduxjs/toolkit/query/react'
import { IFilterNotificationsForUserVModel } from '@/models/Notifications'
import { createBaseQuery } from './api'

interface NotificationsResponse {
    Success: boolean
    Data: any
}

const apiPath = 'https://localhost:44381/api/user/UserNotifications'

// export const SearchForUser = async (filter: IFilterNotificationsForUserVModel): Promise<NotificationsResponse> => {
//     try {
//         const response = await axiosUser.get<NotificationsResponse>('UserNotifications/SearchForUser', {
//             params: filter
//         })
//         return response.data.Data
//     } catch (error) {
//         console.error('Error while fetching notifications:', error)
//         throw error
//     }
// }

export const userNotificationsApi = createApi({
    reducerPath: 'userNotificationsApi',
    baseQuery: createBaseQuery(apiPath),
    endpoints: builder => ({
        searchNotificationsForUser: builder.query<NotificationsResponse, IFilterNotificationsForUserVModel>({
            query: filter => {
                const params = new URLSearchParams()

                if (filter) {
                    if (filter.isActive !== undefined) params.append('IsActive', filter.isActive.toString())
                    if (filter.isRead !== undefined) params.append('IsRead', filter.isRead.toString())
                    if (filter.sentDate) params.append('SentDate', filter.sentDate.toISOString())
                }

                return `SearchForUser?${params.toString()}`
            }
        }),
        getCountIsNew: builder.query<NotificationsResponse, void>({
            query: () => `GetCountIsNew`
        }),
        changeAllRead: builder.mutation<NotificationsResponse, void>({
            query: () => ({
                url: `ChangeAllRead`,
                method: 'PUT'
            })
        }),
        updateIsNew: builder.mutation<NotificationsResponse, void>({
            query: () => ({
                url: `UpdateIsNew`,
                method: 'PUT'
            })
        }),
        changeNotificationRead: builder.mutation<NotificationsResponse, number>({
            query: id => ({
                url: `ChangeRead`,
                method: 'PUT',
                body: { Id: id }
            })
        }),
        deleteNotification: builder.mutation<NotificationsResponse, number>({
            query: id => ({
                url: `ChangeStatusForUser`,
                method: 'PUT',
                body: { Id: id }
            })
        })
    })
})

export const {
    useSearchNotificationsForUserQuery,
    useChangeAllReadMutation,
    useChangeNotificationReadMutation,
    useDeleteNotificationMutation,
    useGetCountIsNewQuery,
    useUpdateIsNewMutation
} = userNotificationsApi
