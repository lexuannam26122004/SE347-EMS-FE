export interface IDisciplineGetAll {
    Id: number
    FullName: string
    AvatarPath: string
    UserId: string
    Department: string
    Money?: number
    CreatedDate: string
    Reason?: string
    Note?: string
    IsPenalized: boolean
}

export interface ICreateDiscipline {
    UserId: string
    Reason?: string
    Note?: string
    Money?: number
    Date: string
}

export interface IUpdateDiscipline extends ICreateDiscipline {
    Id: number
}
export interface IDiscipline extends IDisciplineGetAll {
    Date: string
}
