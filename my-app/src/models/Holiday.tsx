export interface IHolidayCreate {
    Title: string
    StartDate: string
    EndDate: string
    IsHoliday: boolean
    Description: string
    Color: string
    AllDay: boolean
}

export interface IHolidayGetAll extends IHolidayCreate {
    Id: number
}
