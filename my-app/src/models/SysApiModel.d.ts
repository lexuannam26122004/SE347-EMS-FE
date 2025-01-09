import { IExportInfo } from './ExportModel'

interface ICreatedAPI {
  ControllerName: string
  ActionName: string
  HttpMethod: 'GET' | 'DELETE' | 'POST' | 'PUT'
  IsActive: boolean
}
interface IUpdatedAPI extends ICreatedAPI {
  Id: number
}

interface IGetByIdAPI {
  Id?: number
}
interface IGetJsonAPIByIdAPI extends IGetByIdAPI {
  Type: string
}

interface IAPIResponse {
  CreatedBy?: string
  CreatedDate?: Date
  UpdatedBy?: string
  UpdatedDate?: Date
  ControllerName: string
  ActionName: string
  HttpMethod: 'GET' | 'DELETE' | 'POST' | 'PUT'
  Function?: any
  IsCheckedCtrl: boolean
  IsActive: boolean
  Id: number
}

interface PermissionModelsChild {
  ActionName: string
  HttpMethod: string
  IsAllow: boolean
}
interface SysAPIResponse {
  Id: number
  ActionName: string
  ControllerName: string
  HttpMethod: 'GET' | 'DELETE' | 'POST' | 'PUT'
  PermissionModels: PermissionModelsChild[]
}
export interface IFilterApi {
  Name?: string
  IsActive?: boolean
  CreatedDate?: Date
  CreatedBy?: string
  UpdatedDate?: Date
  UpdatedBy?: string
  PageSize?: number
  PageNumber?: number
  SortBy?: string
  IsDescending?: boolean
  IsExport?: boolean
  keyword?: string
}

interface APIListProps {
  data: SysAPIResponse[]
}

interface IApiExport extends IFilterApi, IExportInfo {}
