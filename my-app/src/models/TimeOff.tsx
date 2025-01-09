export interface ITimeOffSearch {
    Id: number
    FullName: string
    IsActive: boolean
    CreatedBy?: string
    CreatedDate?: Date
    UpdatedBy?: string
    UpdatedDate?: Date
    Reason?: string
    UserId: string
    StartDate: Date
    EndDate: Date
    Content: string
    IsAccepted: boolean
    EmployeeId?: string
    AvatarPath: string | null
}

export interface ITimeOffCreate {
    Reason?: string
    UserId: string
    StartDate: Date
    EndDate: Date
    Content: string
    IsAccepted: boolean
    IsActive: boolean
}

export interface ITimeOffUpdate {
    Id: number
    Reason?: string
    UserId: string
    StartDate: Date
    EndDate: Date
    Content: string
    IsAccepted: boolean
    IsActive: boolean
}
