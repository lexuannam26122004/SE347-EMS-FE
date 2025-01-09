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
}

export interface IUpdateReward extends ICreateReward {
    Id: number
}
