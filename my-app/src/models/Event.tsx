export interface IEventCreate {
    Title: string
    StartDate: string
    EndDate: string
    IsHoliday: boolean
    Description: string
    Color: string
    AllDay: boolean
}

export interface ITotalEventsByMonth {
    Year: number
    Month: number
}

export interface IEventGetAll extends IEventCreate {
    Id: number
}

export interface IEventUpdate {
    Id: number
    Title: string
    StartDate: string
    EndDate: string
    Description: string
    Color: string
    AllDay: boolean
}

export interface IFilterEvent {
    isHoliday?: boolean
    pageSize?: number
    pageNumber?: number
    sortBy?: string
    isDescending?: boolean
    startDate?: string
    endDate?: string
    keyword?: string
}
