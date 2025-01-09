export interface IWorkingRulesGetAll {
    Name: string
    Content: string
    Note: string
    Id: number
    IsActive: boolean
}

export interface IWorkingRulesCreate {
    Name: string
    Content: string
    Note: string
    IsActive: boolean
}

export interface IWorkingRulesUpdate {
    Name: string
    Content: string
    Note: string
    Id: number
    IsActive: boolean
}
