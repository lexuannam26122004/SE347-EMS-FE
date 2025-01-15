export interface ITimekeeping {
    Id: number
    UserId: string
    Date: Date
    CheckInTime: string // Sử dụng string để đại diện cho TimeSpan
    CheckOutTime: string // Sử dụng string để đại diện cho TimeSpan
    CheckInIP: string
    Note: string
    Agent: string
    Status: boolean
    Overtime: string
    TotalHours: number
}

export interface IFilterTimekeepingForUser {
    StartDate: string
    EndDate: string
    IsValid: boolean
    IsEarly: boolean
    IsLate: boolean
    IsOnTime: boolean
    PageSize: number
    PageNumber: number
}

export interface ITimekeepingCreate {
    UserId: string
    Date: Date
    CheckInTime: string
    CheckOutTime: string
    CheckInIP: string
}

export interface ITimekeepingUpdate extends ITimekeepingCreate {
    Id: number
}

export interface ITimekeepingGetById extends ITimekeepingUpdate {
    FullName: string
}

export interface IFilterTimekeeping {
    Month: number
    Year: number
}

export interface ITimekeepingFilter {
    fullName?: string
    pageSize?: number
    pageNumber?: number
    sortBy?: string
    isDescending?: boolean
    startDate?: string
    endDate?: string
}

export interface IFilterAttendance {
    isHoliday?: boolean
    pageSize?: number
    pageNumber?: number
    sortBy?: string
    isDescending?: boolean
    departmentId?: number
    startDate?: string
    endDate?: string
    keyword?: string
}

export interface IFilterAttendanceSummary {
    date: string
    period: string
}
