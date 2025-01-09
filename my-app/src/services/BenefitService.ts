import {
    IBenefitCreate,
    IBenefitGetAllType,
    IBenefitUpdate,
    IBenefitTypeCreate,
    IBenefitTypeUpdate,
    IGetAllBenefitUser
} from '@/models/Benefit'
import { createApi } from '@reduxjs/toolkit/query/react'
import { IFilterSysConfiguration } from '@/models/SysConfiguration'
import { createBaseQuery } from './api'

interface BenefitResponse {
    Success: boolean
    Data: any
}

const apiPath = 'https://localhost:44381/api/admin/Benefit'

export const benefitApi = createApi({
    reducerPath: 'benefitApi',
    baseQuery: createBaseQuery(apiPath),
    tagTypes: ['Benefit'],
    endpoints: builder => ({
        createBenefit: builder.mutation<void, IBenefitCreate>({
            query: benefit => ({
                url: 'Create',
                method: 'POST',
                body: benefit
            }),
            invalidatesTags: ['Benefit']
        }),
        createBenefitType: builder.mutation<void, IBenefitTypeCreate>({
            query: benefitType => ({
                url: 'CreateBenefitType',
                method: 'POST',
                body: benefitType
            }),
            invalidatesTags: ['Benefit']
        }),
        ChangeStatusBenefit: builder.mutation<void, string>({
            query: id => ({
                url: `ChangeStatus/${id}`,
                method: 'PUT'
            })
        }),

        updateBenefit: builder.mutation<void, IBenefitUpdate>({
            query: benefit => ({
                url: 'Update',
                method: 'PUT',
                body: benefit
            }),
            invalidatesTags: ['Benefit']
        }),
        updateBenefitType: builder.mutation<void, IBenefitTypeUpdate>({
            query: benefitType => ({
                url: 'UpdateBenefitType',
                method: 'PUT',
                body: benefitType
            }),
            invalidatesTags: ['Benefit']
        }),
        ChangeStatusManyBenefit: builder.mutation<void, string[]>({
            query: ids => ({
                url: `ChangeStatusMany`,
                method: 'PUT',
                body: { Ids: ids }
            })
        }),
        getAllBenefits: builder.query<BenefitResponse, IFilterSysConfiguration>({
            query: filter => {
                const params = new URLSearchParams()

                if (filter) {
                    if (filter.createdBy) params.append('CreatedBy', filter.createdBy)
                    if (filter.createdDate) params.append('CreatedDate', filter.createdDate.toDateString())
                    if (filter.pageSize) params.append('PageSize', filter.pageSize.toString())
                    if (filter.pageNumber) params.append('PageNumber', filter.pageNumber.toString())
                    if (filter.isActive !== undefined) params.append('IsActive', filter.isActive.toString())
                    if (filter.keyword) params.append('Keyword', filter.keyword)
                    if (filter.isDescending !== undefined) params.append('IsDescending', filter.isDescending.toString())
                    if (filter.sortBy) params.append('SortBy', filter.sortBy)
                }

                return `GetAll?${params.toString()}`
            },
            providesTags: ['Benefit'] // Thêm providesTags để cập nhật cache
        }),
        getAllBenefitsType: builder.query<BenefitResponse, IBenefitGetAllType | void>({
            query: benefitsType => ({
                url: 'GetAllBenefitType?',
                method: 'GET',
                body: benefitsType
            })
            /*query: filter => {

                return `GetAllBenefitType?`
            }*/
        }),
        GetByIdBenefit: builder.query<BenefitResponse, string>({
            query: id => `GetById?id=${id}`
        }),

        GetTotalBenefitAndEmployeeByMonthAndYear: builder.query<BenefitResponse, { year: number; month: number }>({
            query: ({ year, month }) => ({
                url: `GetTotalBenefitAndEmployeeByMonthAndYear/monthly-stats?year=${year}&month=${month}`,
                method: 'GET'
            })
        }),

        deleteBenefitType: builder.mutation<void, number>({
            query: id => ({
                url: `DeleteBenefitType/${id}`,
                method: 'DELETE'
            }),
            invalidatesTags: ['Benefit']
        }),
        getAllBenefitUser: builder.query<BenefitResponse, IGetAllBenefitUser | void>({
            query: filter => {
                const params = new URLSearchParams()

                if (filter) {
                    //if (filter.createdBy) params.append('CreatedBy', filter.createdBy)
                    //if (filter.createdDate) params.append('CreatedDate', filter.createdDate.toDateString())
                    if (filter.pageSize) params.append('PageSize', filter.pageSize.toString())
                    if (filter.pageNumber) params.append('PageNumber', filter.pageNumber.toString())
                    //if (filter.isActive !== undefined) params.append('IsActive', filter.isActive.toString())
                    if (filter.keyword) params.append('Keyword', filter.keyword)
                    if (filter.isDescending !== undefined) params.append('IsDescending', filter.isDescending.toString())
                    if (filter.sortBy) params.append('SortBy', filter.sortBy)
                    if (filter.ToBenefitContribution)
                        params.append('ToBenefitContribution', filter.ToBenefitContribution.toString())
                    if (filter.FromBenefitContribution)
                        params.append('FromBenefitContribution', filter.FromBenefitContribution.toString())
                    if (filter.Gender !== undefined) {
                        params.append('Gender', filter.Gender ? 'True' : 'False')
                    }
                    if (filter.DepartmentIds && filter.DepartmentIds.length > 0) {
                        filter.DepartmentIds.forEach(id => {
                            params.append('DepartmentIds', id.toString())
                        })
                    }
                }

                return `GetAllBenefitUser?${params.toString()}`
            },
            providesTags: ['Benefit']
        })
    })
})

export const {
    useGetAllBenefitsQuery,
    useCreateBenefitMutation,
    useChangeStatusBenefitMutation,
    useUpdateBenefitMutation,
    useChangeStatusManyBenefitMutation,
    useGetAllBenefitsTypeQuery,
    useCreateBenefitTypeMutation,
    useUpdateBenefitTypeMutation,
    useDeleteBenefitTypeMutation,
    useGetAllBenefitUserQuery,
    useGetByIdBenefitQuery,
    useGetTotalBenefitAndEmployeeByMonthAndYearQuery
} = benefitApi
