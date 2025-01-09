export interface IMessageCreate {
    Content: string
    Type: boolean
}
export interface IMessageGetAll extends IMessageCreate {
    CreatedAt: Date
}
