export interface IRewardGetAll {
    Id: number
    FullName: string
    AvatarPath: string
    UserId: string
    Department: string
    Money?: number
    Date: string
    Reason?: string
    Note?: string
    IsReceived: boolean
}

export interface ICreateReward {
    UserId: string
    Reason?: string
    Note?: string
    Money?: number
    Date: string
}

export interface IFilterReward {
    department?: string
    keyword?: string
    pageSize?: number
    pageNumber?: number
    startDate?: string
    endDate?: string
    sortBy?: string
    isDescending?: boolean
}

export interface IFilterRewardUser {
    department?: string
    keyword?: string
    pageSize?: number
    startDate?: string
    endDate?: string
    pageNumber?: number
    sortBy?: string
    isDescending?: boolean
}

export interface IUpdateReward extends ICreateReward {
    Id: number
}
