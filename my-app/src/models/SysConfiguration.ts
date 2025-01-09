export interface ICreateSysConfiguration {
    Key: string
    Type: string
    Value: string
    Description: string
}

export interface IUpdateSysConfiguration extends ICreateSysConfiguration {
    Id: number
}

export interface IGetAllSysConfiguration extends IUpdateSysConfiguration {
    CreatedDate: string
    CreateBy: string
}

export interface ISysConfigurationChangeStatusMany {
    Ids: number[]
}

export interface IFilterSysConfiguration {
    isActive?: boolean
    createdDate?: Date
    createdBy?: string
    pageSize?: number
    pageNumber?: number
    sortBy?: string
    isDescending?: boolean
    keyword?: string
}
