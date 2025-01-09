export interface IAspNetRoleGetAll {
    Id: string
    Name: string
    IsActive?: boolean | null
    ConcurrencyStamp: string
    NormalizedName: string
    CreatedDate?: Date | null
    CreatedBy: string
    UpdatedDate?: Date | null
    UpdatedBy: string
}

export interface IFilterRole {
    pageSize?: number
    pageNumber?: number
    sortBy?: string
    isDescending?: boolean
    keyword?: string
}
