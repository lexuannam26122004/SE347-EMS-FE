export interface IErrorReportSearch {
    Id: number
    ReportedBy?: string
    ReportedDate?: Date
    Type?: string
    TypeId?: string
    Description?: string
    Status?: string
    ResolvedBy?: string
    ResolvedDate?: Date
    ResolutionDetails?: string
}

export interface IErrorReportCreate {
    ReportedBy?: string
    ReportedDate?: Date
    Type?: string
    TypeId?: string
    Description?: string
    Status?: string
    ResolvedBy?: string
    ResolvedDate?: Date
    ResolutionDetails?: string
}

export interface IErrorReportUpdate {
    ReportedBy?: string
    ReportedDate?: Date
    Type?: string
    TypeId?: string
    Description?: string
    Status?: string
    ResolvedBy?: string
    ResolvedDate?: Date
    ResolutionDetails?: string
}
