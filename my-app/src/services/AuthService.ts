import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { IUser } from '@/models/AuthMe'

const apiBasePath = 'https://localhost:44381/api/Auth'

export const AuthApi = createApi({
    reducerPath: 'AuthApi',
    baseQuery: fetchBaseQuery({
        baseUrl: apiBasePath,
        prepareHeaders: headers => {
            const token = sessionStorage.getItem('auth_token')
            if (token) {
                headers.set('Authorization', `Bearer ${token}`)
            }
            return headers
        }
    }),

    endpoints: builder => ({
        getAuthMe: builder.query<IUser, void>({
            query: () => '/Me'
        }),
        exportContractPdf: builder.query<Blob, void>({
            query: () => ({
                url: 'ExportContractPdf',
                method: 'GET',
                responseHandler: (response: Response) => response.blob()
            })
        })
    })
})

export const { useGetAuthMeQuery, useExportContractPdfQuery } = AuthApi
