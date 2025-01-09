export interface INotificationsForUser {
    Id: number
    UserId: string
    Title: string
    Content: string
    SentTime: string
    Type: string
    IsRead: boolean
    NotificationId: number
}

export interface INotificationCreateVModel {
    Title: string
    Content: string
    ListUser: string[]
    ListFile?: number[]
    ListRole: string[]
    ListDept: number[]
    Type: string
    UserId: string
    TypeToNotify: number
}

export interface INotificationUpdateVModel extends INotificationCreateVModel {
    Id: number
}

export interface ICountNotifyReadByUser {
    pageNumber: number
    fullName?: string
    startDate?: string
    endDate?: string
}

export interface ICountNotifyReadByUserResponse {
    UserId: string
    UserFullName: string
    EmployeeId?: string
    AvatarPath?: string
    ReadCount: number
}

export interface IFilterNotificationsForUserVModel {
    isActive?: boolean
    isRead?: boolean
    sentDate?: Date
}

export interface IFilterNotificationsVModel {
    title?: string
    type?: string
    pageSize?: number
    pageNumber?: number
    isActive?: boolean
    sentDate?: Date
}

export interface IFilterReadNotificationsForUserVModel {
    userId?: string
    type?: string
    pageSize?: number
    pageNumber?: number
}

export interface INotificationGetById {
    Id: number
    Title: string
    Content: string
    SentTime: string
    Type: string
    UserId: string
    FullName: string
    ReceivedCount?: number
    ReadCount?: number
    AvatarPath?: string
    Role: string
    ListFile?: string[]
    ListUser?: string[]
    ListUserRead?: string[]
}
