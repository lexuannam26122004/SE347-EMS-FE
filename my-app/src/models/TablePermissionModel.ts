export interface ITablePermission {
    Id: number
    Name: string
    ParentId: number | null
    Sort: number
    PathTo: string
    PathIcon: null | string
    Function?: IFunctions
    Children?: ITablePermission[]
    data?: IFunctions
    NameController?: string
}

export interface IFunctions {
    IsAllowAll?: boolean
    IsAllowView?: boolean
    IsAllowCreate?: boolean
    IsAllowEdit?: boolean
    IsAllowPrint?: boolean
    IsAllowDelete?: boolean
}

export interface IFilterRole {
    pageSize?: number
    pageNumber?: number
    sortBy?: string
    isDescending?: boolean
    keyword?: string
}

export interface ITableTempData {
    id: number
    data?: IFunctions
}
export interface ISysFile {
    Id: number
    Name: string
    ParentId: number | null
    Sort: number
    PathTo: string
    PathIcon: null | string
}

export interface ITableTempData {
    id: number
}
