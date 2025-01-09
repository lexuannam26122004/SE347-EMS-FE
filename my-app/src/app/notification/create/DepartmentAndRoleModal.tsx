import React from 'react'
import { Box, Paper, Modal, Typography, Divider } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { X } from 'lucide-react'
import { useEffect, useState } from 'react'
import ListDepartment from './ListDepartment'
import ListRole from './ListRole'
import {
    selectedDepartmentsToNotifySelector,
    selectedDepartmentsToNotifySlice
} from '@/redux/slices/selectedDepartmentsToNotifySlice'
import { useDispatch, useSelector } from 'react-redux'
import { IDepartmentGetAll } from '@/models/Department'
import { selectedRolesToNotifySlice } from '@/redux/slices/selectedRolesToNotifySlice'
import { IAspNetRoleGetAll } from '@/models/AspNetRole'
import { selectedRolesToNotifySelector } from '@/redux/slices/selectedRolesToNotifySlice'

interface ModalProps {
    open: boolean
    handleClose: () => void
}

function DepartmentAndRoleModal({ open, handleClose }: ModalProps) {
    const { t } = useTranslation()
    const [step, setStep] = useState(0)
    const selectedDepartment = useSelector(selectedDepartmentsToNotifySelector)
    const selectedRole = useSelector(selectedRolesToNotifySelector)
    const [tempSelectedDepartment, setTempSelectedDepartment] = useState<IDepartmentGetAll[]>(selectedDepartment)
    const [tempSelectedRole, setTempSelectedRole] = useState<IAspNetRoleGetAll[]>(selectedRole)
    const dispatch = useDispatch()

    useEffect(() => {
        if (open) {
            setStep(0)
            setTempSelectedDepartment(selectedDepartment)
            setTempSelectedRole(selectedRole)
        }
    }, [open, selectedDepartment, selectedRole])

    const handleAfter = () => {
        setStep(1)
    }

    const handleBefore = () => {
        setStep(0)
    }

    const handleSave = () => {
        dispatch(
            selectedDepartmentsToNotifySlice.actions.updateSelectedDepartmentsToNotifySlice(tempSelectedDepartment)
        )
        dispatch(selectedRolesToNotifySlice.actions.updateSelectedRolesToNotifySlice(tempSelectedRole))
        handleClose()
    }

    return (
        <Modal open={open} sx={{ padding: 10 }} onClose={handleClose}>
            <Paper
                sx={{
                    width: '50vw',
                    maxWidth: '500px',
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    backgroundColor: 'var(--background-color)',
                    border: '1px solid var(--border-color)',
                    borderRadius: '10px',
                    transform: 'translate(-50%, -50%)'
                }}
            >
                <Box
                    sx={{
                        paddingBlock: 1.6,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        zIndex: '1',
                        position: 'relative'
                    }}
                >
                    <Typography
                        variant='h6'
                        sx={{
                            fontWeight: 'Bold',
                            fontSize: '20px',
                            textAlign: 'center',
                            margin: 'auto',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                            color: 'var(--text-color)'
                        }}
                    >
                        {step === 0
                            ? t('COMMON.CREATE_NOTIFICATION.BY_DEPARTMENT')
                            : t('COMMON.CREATE_NOTIFICATION.BY_ROLE')}
                    </Typography>
                    <Box
                        sx={{
                            position: 'absolute',
                            right: '16px',
                            top: '11px',
                            cursor: 'pointer',
                            backgroundColor: 'var(--background-color)',
                            padding: '5px',
                            borderRadius: '50%',
                            border: '1px solid var(--border-color)',
                            '&:hover': {
                                backgroundColor: 'var(--hover-color)',
                                borderColor: 'var(--hover-color)'
                            }
                        }}
                        onClick={handleClose}
                    >
                        <X style={{ color: 'var(--text-color)' }} />
                    </Box>
                </Box>
                <Divider sx={{ zIndex: '1', borderColor: 'var(--border-color)' }} />

                {step === 0 ? (
                    <ListDepartment
                        handleAfter={handleAfter}
                        tempSelectedDepartment={tempSelectedDepartment}
                        setTempSelectedDepartment={setTempSelectedDepartment}
                        handleClose={handleClose}
                    />
                ) : (
                    <ListRole
                        handleBefore={handleBefore}
                        handleClose={handleClose}
                        tempSelectedRole={tempSelectedRole}
                        setTempSelectedRole={setTempSelectedRole}
                        handleSave={handleSave}
                    />
                )}
            </Paper>
        </Modal>
    )
}

export default DepartmentAndRoleModal
