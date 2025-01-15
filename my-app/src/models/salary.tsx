export interface ISalaryGetAll {
    Id: string
    FullName: string
    EmployeeId: string
    UserId: string
    Date: Date
    BasicSalary: number
    Timekeeping: number
    Insurance: number
    Benefit: number
    Reward: number
    Discipline: number
    PITax: number
    TotalSalary: number
    IsActive: number
    IsPaid: boolean
    PayrollPeriod: string
}

export interface IUnpaidSalary extends ISalaryGetAll {
    AvatarPath: string
}

export interface ISalaryGetById {
    AvatarPath: string
    FullName: string
    EmployeeId: string
    Id: string
    IsActive: boolean
    UserId: string
    DepartmentName: string
    RoleName: string[]
    Date: string

    TotalSalary: number
    SalaryPayment: number
    IsPaid: boolean
    PayrollPeriod: string
    ProRatedSalary: number
    PITax: number
    TotalInsurance: number
    TotalBenefit: number
    TotalReward: number
    TotalDiscipline: number
    NumberOfWorkingHours: number
}

export interface ISalaryByLevel {
    period: string
    under10: number
    between10and20: number
    between20and30: number
    between30and40: number
    greaterThan40: number
}
export interface TotalIncome {
    payrollPeriod: string
    TotalIncome: number
    TotalSalary: number
}
