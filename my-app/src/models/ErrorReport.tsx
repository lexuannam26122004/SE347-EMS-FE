export interface IErrorReportSearch {
    Id: number
    ReportedBy?: string
    ReportedDate?: string
    Type?: string
    TypeId?: string
    Description?: string
    Status?: string
    ResolvedBy?: string
    ResolvedDate?: string
    ResolutionDetails?: string
}

export interface IErrorReportCreate {
    ReportedBy?: string
    ReportedDate?: string
    Type?: string
    TypeId?: string
    Description?: string
    Status?: string
    ResolvedBy?: string
    ResolvedDate?: string
    ResolutionDetails?: string
}

export interface IErrorReportUpdate {
    ReportedBy?: string
    ReportedDate?: string
    Type?: string
    TypeId?: string
    Description?: string
    Status?: string
    ResolvedBy?: string
    ResolvedDate?: string
    ResolutionDetails?: string
    Id: number
}
