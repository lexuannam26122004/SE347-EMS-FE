export interface IEmploymentContractSearch {
    Id: string
    IsActive: boolean
    CreatedBy?: string
    CreatedDate?: Date
    UpdatedBy?: string
    UpdatedDate?: Date
    UserId: string
    ContractName: string
    StartDate: Date | null
    EndDate: Date | null
    BasicSalary: number
    Clause?: string
    Appendix?: string
    ProbationPeriod: number
    WorkingHours: number
    TerminationClause: string
    ContractFileId: number
    TypeContract?: string
    ManagerId?: string
}

export interface IContractExp {
    FullName: string // Họ tên nhân viên
    ContractType: string // Loại hợp đồng
    ContractName: string // Tên hợp đồng
    ContractStart: string // Ngày bắt đầu hợp đồng
    ContractEnd: string
    AvatarPath: string | null
}

export interface IFilterEmploymentContract {
    isActive?: boolean
    createdDate?: Date
    createdBy?: string
    pageSize?: number
    pageNumber?: number
    sortBy?: string
    isDescending?: boolean
    keyword?: string
    daysUntilExpiration: number
}

export interface IEmploymentContractCreate {
    UserId: string
    ContractName: string
    StartDate: Date
    EndDate: Date
    BasicSalary: number
    Clause: string
    IsActive: boolean
    ProbationPeriod: number
    WorkingHours: number
    TerminationClause: string
    ContractFileId: number
    TypeContract: string
    ManagerId: string
    Appendix: string
}

export interface IEmploymentContractUpdate {
    Id: string
    UserId: string
    ContractName: string
    StartDate: Date
    EndDate: Date
    BasicSalary: number
    Clause: string
    IsActive: boolean
    ProbationPeriod: number
    WorkingHours: number
    TerminationClause: string
    ContractFileId: number
    TypeContract: string
    ManagerId: string
    Appendix: string
}

export interface IUserDetails extends IEmploymentContractSearch {
    FullName: string
    EmployeeId: string
    ManagerFullName: string
    Manager: string
}
