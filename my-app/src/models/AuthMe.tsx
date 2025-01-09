export interface IUser {
    Success: boolean
    Data: IUserData
}

export interface IUserData {
    MenuLeft: string[]
    DepartmentName: string
    AvatarPath: string
    Id: string
    IsActive: boolean
    Roles: string[]
    FullName: string
    UserName: string
    Email: string
    PhoneNumber: string
    StartDateWork: string
    AvatarFileId: number
    Gender: boolean
    Address: string
    Note: string
    Birthday: string
    DepartmentId: number
    EmployeeDependents: number
    EmployeeId: string
    IsAdmin: boolean
    RemainingLeaveDays: number
}
