import { createSelector, createSlice } from '@reduxjs/toolkit'
import deepMerge from 'deepmerge'
import { IFunctions, ITablePermission, ITableTempData } from '@/models/TablePermissionModel'
import { RootState } from '@/redux/store'

const initialState: {
    defaultData: any[]
    role: ITablePermission[]
    function: any
} = {
    defaultData: [],
    role: [],
    function: []
}

const customDeepMerge = (a: ITablePermission[], b: ITablePermission[]) => {
    const cloneA = structuredClone(a)
    b.forEach(itemB => {
        // find a that matches id b
        const findA = cloneA.find(itemA => itemA.Id === itemB.Id)
        if (findA) {
            findA.Function = itemB.Function
        }
    })

    return cloneA
}

const customDeepMergeForAPI = (a: any[], b: any[]) => {
    const cloneA = structuredClone(a)
    const cloneB = b
    cloneB.forEach(itemB => {
        // find a that matches id b

        const findA = cloneA.find(itemA => itemA.ControllerName === itemB.ControllerName)
        if (findA) {
            findA.IsCheckedCtrl = itemB.IsCheckedCtrl
            findA.PermissionModels = itemB.PermissionModels
        }
    })

    return cloneA
}

const cleanDoubleElementArray = (array: any) => {
    const input = [...array]
    const seen = new Set()
    const uniqueArray = input.filter((el: any) => {
        const duplicate = seen.has(el.Id)
        seen.add(el.Id)

        return !duplicate
    })

    return uniqueArray
}

export const tablePermissionSlice = createSlice({
    name: 'tablePermission',
    initialState,
    reducers: {
        addDefaultData: (state, action) => {
            const input = action.payload
            state.defaultData.length = 0
            state.function.length = 0
            state.role.length = 0
            state.defaultData.push(...input)
            state.function.push(...input)
            state.role.push(...input)
        },

        addRoleData: (state, action) => {
            if (action.payload.length > 0) {
                const defaultDataNoProxy = JSON.parse(JSON.stringify(state.defaultData))
                const mergeData: ITablePermission[] = deepMerge(defaultDataNoProxy, JSON.parse(action.payload), {
                    arrayMerge: customDeepMerge
                })
                const modifyData = cleanDoubleElementArray(mergeData)
                state.role.length = 0
                state.role.push(...modifyData)
            }
        },

        addFunctionData: (state, action) => {
            if (action.payload.length > 0) {
                const defaultDataNoProxy = JSON.parse(JSON.stringify(state.defaultData))
                const mergeData: any[] = deepMerge(defaultDataNoProxy, JSON.parse(action.payload), {
                    arrayMerge: customDeepMergeForAPI
                })

                state.function.length = 0
                state.function.push(...mergeData)
            }
        },

        cleanData: state => {
            state.defaultData = []
            state.function = []
            state.role = []

            return state
        },

        updateDataByCheckBox: (state, action) => {
            const { id, data } = action.payload.value
            const find = state.role.find((item: any) => item.Id === id)
            if (find && find.Function) {
                const updatedPermission = { ...find.Function, ...data }

                const { IsAllowView, IsAllowEdit, IsAllowCreate, IsAllowPrint, IsAllowDelete } = updatedPermission

                const updatedPermissionWithAllowAll = {
                    ...updatedPermission,
                    IsAllowAll: IsAllowView && IsAllowEdit && IsAllowCreate && IsAllowPrint && IsAllowDelete
                }
                const updatedData = state.role.map((item: any) => {
                    if (item.Id === id) {
                        return {
                            ...item,
                            Function: updatedPermissionWithAllowAll
                        }
                    }

                    return item
                })

                return {
                    ...state,
                    role: updatedData
                }
            }
        },

        updateDataByCheckAll: (state, action) => {
            const { parentId, keyName, value } = action.payload
            const getAllDataById = (data: ITablePermission[], parentId?: number) => {
                data.filter((item: ITablePermission) => item.ParentId === parentId).forEach(
                    (item: ITablePermission) => {
                        if (item.Function) {
                            if (keyName === 'IsAllowAll') {
                                item.Function = {
                                    IsAllowAll: value,
                                    IsAllowView: value,
                                    IsAllowEdit: value,
                                    IsAllowCreate: value,
                                    IsAllowPrint: value,
                                    IsAllowDelete: value
                                }
                            } else {
                                item.Function = { ...item.Function, [keyName]: value }

                                const { IsAllowView, IsAllowEdit, IsAllowCreate, IsAllowPrint, IsAllowDelete } =
                                    item.Function
                                if (IsAllowView && IsAllowEdit && IsAllowCreate && IsAllowPrint && IsAllowDelete) {
                                    item.Function = { ...item.Function, IsAllowAll: true }
                                } else {
                                    item.Function = { ...item.Function, IsAllowAll: false }
                                }
                            }
                        }
                        getAllDataById(data, item.Id)
                    }
                )
            }

            getAllDataById(state.role, parentId)
        }

        // updateDataByOneCheckforFunction: (state, action) => {
        //     const { ControllerName, ActionName, value } = action.payload
        //     const parents = state.function
        //     const hasControllerNameInParent = parents.find((item: any) => item.ControllerName === ControllerName)
        //     if (hasControllerNameInParent) {
        //         const findChildren: PermissionModelsChild = hasControllerNameInParent.PermissionModels.find(
        //             (el: any) => el.ActionName === ActionName
        //         )
        //         const actionNameNeedUpdate: string = findChildren.ActionName
        //         const children: PermissionModelsChild[] = updateChildrenByActionName(
        //             hasControllerNameInParent.PermissionModels,
        //             actionNameNeedUpdate,
        //             value.IsAllow
        //         )
        //         const isAllChildrenFalse: boolean = (children || []).every(
        //             (child: PermissionModelsChild) => !child.IsAllow
        //         )
        //         const isAllChildrenTrue: boolean = (children || []).some(
        //             (child: PermissionModelsChild) => child.IsAllow
        //         )
        //         const updatedData: SysAPIResponse[] = parents.map((itemParent: SysAPIResponse) => {
        //             if (itemParent.ControllerName === ControllerName) {
        //                 return {
        //                     ...itemParent,
        //                     IsCheckedCtrl: !isAllChildrenFalse || isAllChildrenTrue,
        //                     PermissionModels: [...children]
        //                 }
        //             }

        //             return itemParent
        //         })

        //         return {
        //             ...state,
        //             function: updatedData
        //         }
        //     }
        // },

        // updateCheckAllForFunction: (state, action) => {
        //     const { ControllerName, IsCheckedCtrl } = action.payload
        //     const updateObject = state.function.map((el: SysAPIResponse) => {
        //         if (el.ControllerName === ControllerName) {
        //             const updateAllChildByParent = el?.PermissionModels.map(item => ({
        //                 ...item,
        //                 IsAllow: IsCheckedCtrl
        //             }))

        //             return {
        //                 ...el,
        //                 IsCheckedCtrl: IsCheckedCtrl,
        //                 PermissionModels: updateAllChildByParent
        //             }
        //         } else {
        //             return el
        //         }
        //     })

        //     return {
        //         ...state,
        //         function: updateObject
        //     }
        // }
    }
})

// selectors
const tablePermissionForRoleSelector = (state: RootState) => state.tablePermission.role
const tablePermissionForFunctionSelector = (state: RootState) => state.tablePermission.function

const customDataByIdSelector = (state: RootState, parentId?: number) => {
    let result: ITableTempData[] = []
    state.tablePermission.role
        .filter((item: ITablePermission) => item.ParentId === parentId)
        .forEach((item: ITablePermission) => {
            if (item.Function) {
                result.push({ id: item.Id, data: item.Function })
            }
            result = result.concat(customDataByIdSelector(state, item.Id))
        })

    return result
}
const getStatusChecked = (data: ITableTempData[], keyName: keyof IFunctions) => {
    return data.every(item => {
        if (!item?.data) {
            return true
        }

        return item.data?.[keyName]
    })
}
const checkStatusByIdSelector = (state: RootState, parentId: number, keyName: keyof IFunctions) => {
    const data = customDataByIdSelector(state, parentId)
    const allow = getStatusChecked(data, keyName)
    const ids = data.map(e => e.id)

    return { allow, ids }
}

// createSelectors
export const getPermissionForRoleSelector = createSelector(tablePermissionForRoleSelector, data => data)
export const getPermissionForFunctionSelector = createSelector(tablePermissionForFunctionSelector, data => data)
export const getDataPermissionByParentSelector = createSelector(checkStatusByIdSelector, result => result)
