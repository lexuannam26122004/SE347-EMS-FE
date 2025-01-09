export interface IAspNetRoleGetAll {
    Id: string
    Name: string
    IsActive?: boolean | null
    LevelRole: string
    IsAdmin: boolean
    CreatedDate?: string | null
    CreatedBy: string
    UpdatedDate?: string | null
    UpdatedBy: string
}

export interface IAspNetRoleCreate {
    Name: string
    IsActive?: boolean | null
    LevelRole: string
    IsAdmin: boolean
}

export interface IAspNetRoleUpdate {
    Id: string
    Name: string
    IsActive?: boolean | null
    LevelRole: string
    IsAdmin: boolean
}

export interface IFilterRole {
    pageSize?: number
    pageNumber?: number
    sortBy?: string
    isDescending?: boolean
    keyword?: string
}
