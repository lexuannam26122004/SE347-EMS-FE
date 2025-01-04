import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { RootState } from '@/redux/store'

// Định nghĩa kiểu dữ liệu cho Function (quyền)
interface FunctionRights {
    IsAllowAll?: boolean
    IsAllowView: boolean
    IsAllowEdit?: boolean
    IsAllowCreate?: boolean
    IsAllowPrint?: boolean
    IsAllowDelete?: boolean
}

// Định nghĩa kiểu dữ liệu cho menu item
export interface MenuItem {
    Id: number
    Name: string
    PathTo: string
    NameController: string | null
    Function: FunctionRights
}

// State của Redux lưu menu và quyền
interface MenuLeftState {
    [key: string]: FunctionRights
}

const initialState: MenuLeftState = {}

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        // Payload là dữ liệu chứa MenuLeft
        updateAuth: (state, action: PayloadAction<MenuItem[]>) => {
            action.payload.forEach(menu => {
                // Lưu quyền theo Name
                state[menu.Name] = menu.Function

                if (menu.PathTo) {
                    state[menu.PathTo] = menu.Function
                }

                // Tạo menu con có đường dẫn '/create' và '/update' (nếu cần) và chỉ sao chép quyền IsAllowView
                if (menu.PathTo) {
                    // Cập nhật quyền cho menu '/create'
                    const createPath = `${menu.PathTo}/create`
                    state[createPath] = {
                        IsAllowView: menu.Function.IsAllowCreate // Chỉ sao chép IsAllowCreate thành IsAllowView
                    }

                    // Cập nhật quyền cho menu '/update'
                    const updatePath = `${menu.PathTo}/update`
                    state[updatePath] = {
                        IsAllowView: menu.Function.IsAllowEdit // Chỉ sao chép IsAllowEdit thành IsAllowView
                    }

                    if (menu.PathTo == '/admin/benefit') {
                        const updatePath = `${menu.PathTo}/add-employee-benefits`
                        state[updatePath] = {
                            IsAllowView: menu.Function.IsAllowCreate // Chỉ sao chép IsAllowCreate thành IsAllowView
                        }
                    }
                }
            })
        }
    }
})

export const { updateAuth } = authSlice.actions

export const authSelector = (state: RootState) => state.auth

export default authSlice.reducer
