export interface IBenefitCreate {
    Name: string
    //BenefitContribution: number
    BenefitTypeId: number
}

export interface IBenefitGetAll extends IBenefitCreate {
    Id: string
    NameOfBenefitType: string
    CreatedDate: string
    CreatedBy: string
}

export interface IBenefitGetAllType {
    Id: number
    Name: string
    Description: string | null
}

export interface IBenefitUpdate {
    Id: string
    Name: string
    //BenefitContribution: number
    BenefitTypeId: number
}

export interface IBenefitTypeCreate {
    Name: string
    Description: string
}

export interface IBenefitTypeUpdate {
    Id: number
    Name: string
    Description: string
}

export interface IGetAllBenefitUser {
    Id?: number
    pageSize?: number
    pageNumber?: number
    sortBy?: string
    isDescending?: boolean
    keyword?: string
    UserId?: string
    DepartmentIds?: number[]
    Gender?: boolean
    FromBenefitContribution?: number
    ToBenefitContribution?: number
    FullName?: string
    DepartmentName?: string
    BenefitContribution?: number
}
