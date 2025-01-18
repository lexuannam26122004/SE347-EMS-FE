import { createApi } from '@reduxjs/toolkit/query/react'
import { createBaseQuery } from './api'
//import { use } from 'i18next'
interface EmploymentContractResponse {
    Success: boolean
    Data: any
}

const apiPath = 'https://localhost:44381/api/user/UserEmploymentContract'

export const userEmploymentContractApi = createApi({
    reducerPath: 'userEmploymentContractApi',
    baseQuery: createBaseQuery(apiPath),
    endpoints: builder => ({
        searchUser: builder.query<EmploymentContractResponse, void>({
            query: () => 'SearchUser'
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

export const { useSearchUserQuery, useExportContractPdfQuery } = userEmploymentContractApi
