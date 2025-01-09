'use client'
import {
    Box,
    Button,
    Paper,
    TextField,
    Typography,
    Autocomplete,
    Avatar
    //Dialog,
    //DialogTitle,
    //DialogContent,
    //DialogActions
} from '@mui/material'
import { useTranslation } from 'react-i18next'
import { Plus, SaveIcon, XIcon, Pencil, Ban, Trash2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import {
    useCreateBenefitMutation
    //useDeleteBenefitTypeMutation
} from '@/services/DisciplineService'
import { useEffect, useState } from 'react'
import LoadingButton from '@mui/lab/LoadingButton'
import { useToast } from '@/hooks/useToast'
import { IBenefitGetAllType } from '@/models/Benefit'
import { useGetAllUsersQuery } from '@/services/AspNetUserService'
import { IAspNetUserGetAll } from '@/models/AspNetUser'

function CreateBenefitPage() {
    const { t } = useTranslation('common')
    const router = useRouter()
    const [name, setName] = useState('')
    const [contribution, setContribution] = useState<number | ''>('')
    const [benefitTypeId, setBenefitTypeId] = useState<number | null>()

    const [benefitTypeName, setBenefitTypeName] = useState('')
    const [benefitTypeDescription, setBenefitTypeDescription] = useState<string | null>(null)
    const toast = useToast()
    const [isSubmit, setIsSubmit] = useState(false)
    const { data: userResponse, isLoading: isUsersLoading } = useGetAllUsersQuery()
    const employee = (userResponse?.Data?.Records as IAspNetUserGetAll[]) || []
    const [userId, setUserId] = useState('')
    const [reason, setReason] = useState('')
    const [note, setNote] = useState('')
    const [money, setMoney] = useState(0)

    //const [openDialog, setOpenDialog] = useState(false)

    const [createBenefit, { isSuccess, isLoading, isError }] = useCreateBenefitMutation()

    const handleSave = async () => {
        setIsSubmit(true)

        const data = {
            UserId: userId,
            Reason: reason,
            Note: note,
            //BenefitContribution: Number(contribution),
            Money: money
        }
        await createBenefit(data).unwrap()
        setIsSubmit(false)
    }

    useEffect(() => {
        if (isSuccess) {
            toast(t('COMMON.BENEFIT.CREATE_SUCCESS'), 'success')
        }
        if (isError) {
            toast(t('COMMON.BENEFIT.CREATE_ERROR'), 'error')
        }
    }, [isSuccess, isError])

    const handleSaveAndClose = async () => {
        await handleSave()

        router.push('/admin/discipline')
    }

    return (
        <Box sx={{ width: '720px', maxWidth: '100%', margin: '0 auto' }}>
            <Paper
                elevation={0}
                sx={{
                    width: '100%',
                    overflow: 'hidden',
                    borderRadius: '15px',
                    backgroundColor: 'var(--background-item)',
                    padding: '24px'
                }}
            >
                <Typography sx={{ fontWeight: 'bold', fontSize: '22px', color: 'var(--text-color)' }}>
                    {t('Thêm kỷ luật')}
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: '20px', mt: '20px' }}>
                    <Autocomplete
                        sx={{
                            '& fieldset': {
                                borderRadius: '8px',
                                color: 'var(--text-color)',
                                borderColor: 'var(--border-color)'
                            },
                            '& .MuiInputBase-root': {
                                paddingRight: '0px'
                            },
                            '& .MuiInputBase-input': {
                                paddingRight: '12px',
                                color: 'var(--text-color)',
                                fontSize: '16px',
                                '&::placeholder': {
                                    color: 'var(--placeholder-color)',
                                    opacity: 1
                                }
                            },
                            '& .MuiOutlinedInput-root:hover fieldset': {
                                borderColor: 'var(--hover-field-color)'
                            },
                            '& .MuiOutlinedInput-root.Mui-error:hover fieldset': {
                                borderColor: 'var(--error-color) !important' // Màu lỗi khi hover
                            },
                            '& .MuiOutlinedInput-root.Mui-error fieldset': {
                                borderColor: 'var(--error-color) !important' // Màu lỗi khi hover
                            },
                            '& .MuiOutlinedInput-root.Mui-focused fieldset': {
                                borderColor: 'var(--selected-field-color)'
                            },
                            '& .MuiInputLabel-root': {
                                color: 'var(--text-label-color)'
                            },
                            '& .MuiInputLabel-root.Mui-focused': {
                                color: 'var(--selected-field-color)'
                            },
                            '& .MuiInputLabel-root.Mui-error': {
                                color: 'var(--error-color)'
                            },
                            '& .MuiAutocomplete-popupIndicator': {
                                '& svg': {
                                    fill: isSubmit && userId === '' ? 'var(--error-color)' : 'var(--text-color)'
                                }
                            },
                            '& .MuiAutocomplete-clearIndicator': {
                                '& svg': {
                                    fill: 'var(--text-color)'
                                }
                            }
                        }}
                        options={employee}
                        getOptionLabel={option => `${option.EmployeeId}  ${option.FullName}`}
                        renderOption={(props, option, { selected }) => {
                            const { key, ...otherProps } = props
                            return (
                                <Box
                                    key={key}
                                    component='li'
                                    {...otherProps}
                                    sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '10px',
                                        padding: '8px',
                                        color: selected ? 'black' : 'var(--text-color)',
                                        backgroundColor: 'var(--background-color)',
                                        '&:hover': {
                                            color: 'black'
                                        }
                                    }}
                                >
                                    <Avatar
                                        src={
                                            option.AvatarPath ||
                                            'https://localhost:44381/avatars/aa1678f0-75b0-48d2-ae98-50871178e9bd.jfif'
                                        }
                                        alt='Avatar'
                                    />
                                    <Typography>{`${option.EmployeeId}  ${option.FullName}`}</Typography>
                                </Box>
                            )
                        }}
                        renderInput={params => (
                            <TextField
                                {...params}
                                variant='outlined'
                                label={t('COMMON.CONTRACT.INFORMATION') + '*'}
                                fullWidth
                                error={isSubmit && userId === ''}
                            />
                        )}
                        value={employee.find(e => e.Id === userId) || null}
                        onChange={(event, newValue) => setUserId(newValue?.Id || '')}
                        isOptionEqualToValue={(option, value) => option.Id === value.Id}
                    />

                    <TextField
                        variant='outlined'
                        label={t('Tiền phạt')}
                        fullWidth
                        {...(isSubmit && name === '' && { error: true })}
                        value={money}
                        onChange={e => setMoney(Number(e.target.value))}
                    />
                    <TextField
                        variant='outlined'
                        label={t('Lý do')}
                        fullWidth
                        {...(isSubmit && name === '' && { error: true })}
                        value={reason}
                        onChange={e => setReason(e.target.value)}
                    />
                    <TextField
                        variant='outlined'
                        label={t('Chú thích')}
                        fullWidth
                        {...(isSubmit && name === '' && { error: true })}
                        value={note}
                        onChange={e => setNote(e.target.value)}
                    />
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '20px', mt: '20px' }}>
                    <LoadingButton
                        variant='contained'
                        {...(isLoading && { loading: true })}
                        loadingPosition='start'
                        startIcon={<SaveIcon />}
                        onClick={handleSave}
                    >
                        {t('COMMON.BUTTON.SAVE')}
                    </LoadingButton>
                    <LoadingButton
                        variant='contained'
                        {...(isLoading && { loading: true })}
                        loadingPosition='start'
                        startIcon={<SaveIcon />}
                        onClick={handleSaveAndClose}
                    >
                        {t('COMMON.BUTTON.SAVE_AND_CLOSE')}
                    </LoadingButton>
                    <Button variant='contained' startIcon={<XIcon />} onClick={() => router.push('/admin/reward')}>
                        {t('COMMON.BUTTON.CLOSE')}
                    </Button>
                </Box>
            </Paper>
        </Box>
    )
}

export default CreateBenefitPage
