export interface ICreateWorkShift {
    ShiftName: string
    StartTime: string
    EndTime: string
    Description: string
}

export interface IUpdateWorkShift extends ICreateWorkShift {
    Id: number
}

export interface IGetAllWorkShift extends IUpdateWorkShift {
    CreatedDate: string
    CreateBy: string
}

export interface IWorkShiftChangeStatusMany {
    Ids: number[]
}

export interface IFilterWorkShift {
    isActive?: boolean
    createdDate?: Date
    pageSize?: number
    pageNumber?: number
    sortBy?: string
    isDescending?: boolean
    keyword?: string
}
