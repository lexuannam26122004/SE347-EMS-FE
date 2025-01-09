export interface IAspNetUserGetAll {
    Id: string
    FullName: string
    UserName: string
    Email: string
    PhoneNumber: string | null
    AvatarFileId: number | null
    Gender?: boolean | null
    Address: string
    Note: string
    Birthday: Date | null
    Roles?: string[] | null
    AvatarPath: string | null
    DepartmentName: string
    EmployeeId: string
    StartDateWork: Date | null
}

export interface IUserByAgeGetAllDashboard {
    LessThan32: number
    Between32And45: number
    GreaterThan45: number
    LessThan32Percentage: number
    Between32And45Percentage: number
    GreaterThan45Percentage: number

    Between0And18: number
    Between19And35: number
    Between36And50: number
    Between51And65: number
    GreaterThan65: number
    Between0And18Percentage: number
    Between19And35Percentage: number
    Between36And50Percentage: number
    Between51And65Percentage: number
    GreaterThan65Percentage: number
}

export interface IAspNetUserCreate {
    FullName: string
    UserName: string
    Email: string
    PhoneNumber: string
    StartDateWork: Date
    AvatarFileId: number
    Gender?: boolean
    Address: string
    Note: string
    Birthday: Date
    DepartmentId: number
    Password: string
    Roles: string[]
    IsActive: boolean
    EmployeeId?: string
}

export interface IAspNetUserUpdate {
    Id: string
    FullName: string | null
    UserName: string
    Email: string
    PhoneNumber: string | null
    AvatarFileId: number | null
    Gender?: boolean | null
    Address: string
    Note: string
    Birthday: Date | null
    Roles?: string[] | null
    StartDateWork: Date
    DepartmentId: number
    IsActive: boolean
    EmployeeId?: string
}
