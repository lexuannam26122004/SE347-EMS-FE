export interface IJobHistoryByUser {
    Id: number // ID
    EmployeeId: string // Mã nhân viên
    StartDate: string | null // Ngày bắt đầu (dạng string hoặc null)
    EndDate: string | null // Ngày kết thúc (dạng string hoặc null)
    Note: string | null // Ghi chú (dạng string hoặc null)
    JobDescription: string | null // Mô tả công việc (dạng string hoặc null)
    SupervisorId: string | null // Mã người giám sát (dạng string hoặc null)
    WorkLocation: string | null // Địa điểm làm việc (dạng string hoặc null)
    Allowance: string | null // Phụ cấp (dạng string hoặc null)
    SupervisorFullName: string | null // Địa điểm làm việc (dạng string hoặc null)
    SupervisorEmployeeId: string | null // Phụ cấp (dạng string hoặc null)
}

export interface IJobHistoryCreate {
    ListUser?: string[] // Mã nhân viên
    StartDate: string | null // Ngày bắt đầu (dạng string hoặc null)
    EndDate: string | null // Ngày kết thúc (dạng string hoặc null)
    Note: string | null // Ghi chú (dạng string hoặc null)
    JobDescription: string | null // Mô tả công việc (dạng string hoặc null)
    WorkLocation: string | null // Địa điểm làm việc (dạng string hoặc null)
    Allowance: string | null // Phụ cấp (dạng string hoặc null)
    TypeToNotify: number
}
