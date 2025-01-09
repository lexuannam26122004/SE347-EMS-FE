import { createApi } from '@reduxjs/toolkit/query/react'
import {
    IFilterNotificationsForUserVModel,
    INotificationCreateVModel,
    IFilterNotificationsVModel,
    ICountNotifyReadByUser,
    INotificationUpdateVModel
} from '@/models/Notifications'
import axios from './axios'
import { ITotalEventsByMonth } from '@/models/Event'
import { createBaseQuery } from './api'
interface NotificationsResponse {
    Success: boolean
    Data: any
}

const apiPath = 'https://localhost:44381/api/admin/Notifications'

export const SearchForUser = async (filter: IFilterNotificationsForUserVModel): Promise<NotificationsResponse> => {
    try {
        const response = await axios.get<NotificationsResponse>('Notifications/SearchForUser', {
            params: filter
        })
        return response.data
    } catch (error) {
        console.error('Error while fetching notifications:', error)
        throw error
    }
}

export const notificationsApi = createApi({
    reducerPath: 'notificationsApi',
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
        searchNotifications: builder.query<NotificationsResponse, IFilterNotificationsVModel>({
            query: filter => {
                const params = new URLSearchParams()

                if (filter) {
                    if (filter.title) params.append('Title', filter.title)
                    if (filter.pageSize) params.append('PageSize', filter.pageSize.toString())
                    if (filter.pageNumber) params.append('PageNumber', filter.pageNumber.toString())
                    if (filter.isActive !== undefined) params.append('IsActive', filter.isActive.toString())
                    if (filter.sentDate) params.append('SentDate', filter.sentDate.toISOString())
                }

                return `Search?${params.toString()}`
            }
        }),
        getNotificationById: builder.query<NotificationsResponse, number>({
            query: id => `GetById?id=${id}`
        }),
        getCountIsNew: builder.query<NotificationsResponse, string>({
            query: userId => `GetCountIsNew?UserId=${userId}`
        }),
        changeAllRead: builder.mutation<NotificationsResponse, string>({
            query: userId => ({ url: `ChangeAllRead`, method: 'PUT', body: { UserId: userId } })
        }),
        updateIsNew: builder.mutation<NotificationsResponse, string>({
            query: userId => ({
                url: `UpdateIsNew`,
                method: 'PUT',
                body: { UserId: userId }
            })
        }),
        createNotification: builder.mutation<void, INotificationCreateVModel>({
            query: body => ({
                url: 'Create',
                method: 'POST',
                body: body
            })
        }),

        statNotificationByMonth: builder.query<NotificationsResponse, ITotalEventsByMonth>({
            query: params => `StatNotificationByMonth?month=${params.Month}&year=${params.Year}`
        }),

        statNotificationByType: builder.query<NotificationsResponse, number>({
            query: year => `StatNotificationByType?year=${year}`
        }),

        countNotifyReadByUser: builder.query<NotificationsResponse, ICountNotifyReadByUser>({
            query: filter => {
                const params = new URLSearchParams()

                if (filter) {
                    if (filter.fullName !== '' && filter.fullName !== undefined && filter.fullName !== null)
                        params.append('FullName', filter.fullName)
                    if (filter.pageNumber) params.append('PageNumber', filter.pageNumber.toString())
                    if (filter.startDate !== null) params.append('StartDate', filter.startDate)
                    if (filter.endDate !== null) params.append('EndDate', filter.endDate)
                }

                return `CountNotifyReadByUser?${params.toString()}`
            }
        }),

        updateNotification: builder.mutation<void, INotificationUpdateVModel>({
            query: body => ({
                url: 'Update',
                method: 'PUT',
                body: body
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
    useSearchNotificationsQuery,
    useGetNotificationByIdQuery,
    useGetCountIsNewQuery,
    useUpdateIsNewMutation,
    useCreateNotificationMutation,
    useStatNotificationByMonthQuery,
    useStatNotificationByTypeQuery,
    useCountNotifyReadByUserQuery,
    useUpdateNotificationMutation
} = notificationsApi
