'use client'
import {
    Box,
    Button,
    Paper,
    TextField,
    Typography,
    Autocomplete
    //Dialog,
    //DialogTitle,
    //DialogContent,
    //DialogActions
} from '@mui/material'
import { useTranslation } from 'react-i18next'
import { Plus, SaveIcon, XIcon, Pencil, Ban, Trash2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import {
    useCreateBenefitMutation,
    useCreateBenefitTypeMutation,
    useGetAllBenefitsTypeQuery,
    useUpdateBenefitTypeMutation
    //useDeleteBenefitTypeMutation
} from '@/services/BenefitService'
import { useEffect, useState } from 'react'
import LoadingButton from '@mui/lab/LoadingButton'
import { useToast } from '@/hooks/useToast'
import { IBenefitGetAllType } from '@/models/Benefit'

function CreateBenefitPage() {
    const { t } = useTranslation('common')
    const router = useRouter()
    const [name, setName] = useState('')
    const [benefitTypeId, setBenefitTypeId] = useState<number | null>()
    const [benefitTypeName, setBenefitTypeName] = useState('')
    const [benefitTypeDescription, setBenefitTypeDescription] = useState<string | null>(null)
    const { data: benefitTypes, refetch } = useGetAllBenefitsTypeQuery()
    const benefitTypesData = (benefitTypes?.Data?.Records as IBenefitGetAllType[]) || []
    const toast = useToast()
    const [isSubmit, setIsSubmit] = useState(false)
    //const [openDialog, setOpenDialog] = useState(false)

    const [createBenefit, { isSuccess, isLoading, isError }] = useCreateBenefitMutation()
    const [
        createBenefitType,
        {
            isSuccess: isSuccessCreateBenefitType,
            //isLoading: isLoadingCreateBenefitType,
            isError: isErrorCreateBenefitType
        }
    ] = useCreateBenefitTypeMutation()
    const [updateBenefitType] = useUpdateBenefitTypeMutation()
    const [isOpenCreateBenefitType, setIsOpenCreateBenefitType] = useState(false)
    const [isOpenUpdateBenefitType, setIsOpenUpdateBenefitType] = useState(false)

    const handleOpenCreateDialog = () => {
        setIsOpenCreateBenefitType(true)
    }
    const handleCloseCreateDialog = () => {
        setIsOpenCreateBenefitType(false)
        setBenefitTypeName('')
        setBenefitTypeDescription(null)
        setIsSubmit(false)
    }

    const handleOpenUpdateDialog = (benefitType: IBenefitGetAllType) => {
        setBenefitTypeName(benefitType.Name)
        setBenefitTypeId(benefitType.Id)
        setBenefitTypeDescription(benefitType.Description || null)
        setIsOpenUpdateBenefitType(true)
    }
    const handleCloseUpdateDialog = () => {
        setIsOpenUpdateBenefitType(false)
        setBenefitTypeName('')
        setBenefitTypeDescription(null)
        setBenefitTypeId(null)
    }

    const handleSaveBenefitType = async () => {
        setIsSubmit(true)

        if (benefitTypeId) {
            const data = {
                Id: benefitTypeId,
                Name: benefitTypeName,
                Description: benefitTypeDescription || ''
            }
            await updateBenefitType(data).unwrap()
            refetch()
            handleCloseUpdateDialog()
        } else {
            const data = {
                Name: benefitTypeName,
                Description: benefitTypeDescription || ''
            }
            await createBenefitType(data).unwrap()
            refetch()
            handleCloseCreateDialog()
        }
    }

    const handleSave = async () => {
        setIsSubmit(true)
        if (name === '' || !benefitTypeId) {
            return
        }
        const data = {
            Name: name,
            //BenefitContribution: Number(contribution),
            BenefitTypeId: benefitTypeId
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

    useEffect(() => {
        if (isSuccessCreateBenefitType) {
            toast(t('COMMON.BENEFIT.BENEFIT_TYPE.CREATE_SUCCESS'), 'success')
        }
        if (isErrorCreateBenefitType) {
            toast(t('COMMON.BENEFIT.BENEFIT_TYPE.CREATE_ERROR'), 'error')
        }
    }, [isSuccessCreateBenefitType, isErrorCreateBenefitType])

    const handleSaveAndClose = async () => {
        await handleSave()

        router.push('/admin/benefit')
    }

    const specialOption = { Id: -1, Name: '---Lựa chọn---', Description: null }
    const optionsWithSpecial = [specialOption, ...benefitTypesData]

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
                    {t('COMMON.BENEFIT.CREATE_TITLE')}
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: '20px', mt: '20px' }}>
                    <TextField
                        variant='outlined'
                        label={t('COMMON.BENEFIT.NAME')}
                        fullWidth
                        {...(isSubmit && name === '' && { error: true })}
                        value={name}
                        onChange={e => setName(e.target.value)}
                    />
                    <Autocomplete
                        sx={{
                            color: 'var(--text-color)',
                            backgroundColor: 'var(--background-color)',
                            '& fieldset': {
                                borderRadius: '8px',
                                color: 'var(--text-color)',
                                borderColor: 'var(--border-color)'
                            },
                            '& .MuiInputBase-root': { paddingRight: '0px' },
                            '& .MuiInputBase-input': {
                                color: 'var(--text-color)',
                                fontSize: '16px'
                            },
                            '& .MuiOutlinedInput-root:hover fieldset': {
                                borderColor: 'var(--hover-color)'
                            },
                            '& .MuiOutlinedInput-root.Mui-focused fieldset': {
                                borderColor: 'var(--selected-color)'
                            },
                            '& .MuiInputLabel-root': {
                                color: 'var(--text-label-color)'
                            },
                            '& .MuiInputLabel-root.Mui-focused': {
                                color: 'var(--selected-color)'
                            },
                            '& .MuiAutocomplete-popupIndicator': {
                                '& svg': {
                                    fill: 'var(--text-color)'
                                }
                            },
                            '& .MuiAutocomplete-clearIndicator': {
                                '& svg': {
                                    fill: 'var(--text-color)'
                                }
                            }
                        }}
                        options={optionsWithSpecial}
                        getOptionLabel={option => `${option.Id} - ${option.Name}`}
                        renderOption={(props, option, { selected }) => {
                            const { key, ...otherProps } = props
                            const isSpecialOption = option.Id === -1
                            return (
                                <Box
                                    key={key}
                                    component='li'
                                    {...otherProps}
                                    sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'flex-end',
                                        gap: '10px',
                                        padding: '8px',
                                        color: isSpecialOption ? 'gray' : selected ? 'black' : 'var(--text-color)',
                                        backgroundColor: 'var(--background-color)',
                                        '&:hover': {
                                            color: isSpecialOption ? 'gray' : 'black'
                                        },
                                        pointerEvents: isSpecialOption ? 'none' : 'auto'
                                    }}
                                >
                                    <Typography
                                        sx={{ flexGrow: 1 }}
                                    >{`${option.Id === -1 ? option.Name : `${option.Id} - ${option.Name}`}`}</Typography>
                                    {isSpecialOption ? (
                                        <Button
                                            variant='contained'
                                            sx={{
                                                //<Button><Plus/></Button>
                                                minWidth: '25px', // Đảm bảo nút không có chiều rộng tối thiểu
                                                padding: '0', // Loại bỏ padding
                                                margin: '0', // Loại bỏ margin
                                                height: '25px',
                                                width: '25px', // Đặt chiều rộng và chiều cao bằng nhau để nút là hình vuông
                                                display: 'flex', // Sử dụng flexbox để căn giữa
                                                alignItems: 'center', // Căn giữa theo chiều dọc
                                                justifyContent: 'center', // Căn giữa theo chiều ngang
                                                backgroundColor: 'var(--button-color)',
                                                '&:hover': {
                                                    backgroundColor: 'var(--hover-button-color)'
                                                },
                                                fontSize: '16px',
                                                fontWeight: 'bold',
                                                whiteSpace: 'nowrap',
                                                textTransform: 'none',
                                                pointerEvents: 'auto'
                                            }}
                                            onClick={handleOpenCreateDialog}
                                        >
                                            <Plus size={15} />
                                        </Button>
                                    ) : (
                                        <Button
                                            variant='contained'
                                            sx={{
                                                //<Button><Plus/></Button>
                                                minWidth: '25px', // Đảm bảo nút không có chiều rộng tối thiểu
                                                padding: '0', // Loại bỏ padding
                                                margin: '0', // Loại bỏ margin
                                                height: '25px',
                                                width: '25px', // Đặt chiều rộng và chiều cao bằng nhau để nút là hình vuông
                                                display: 'flex', // Sử dụng flexbox để căn giữa
                                                alignItems: 'center', // Căn giữa theo chiều dọc
                                                justifyContent: 'center', // Căn giữa theo chiều ngang
                                                backgroundColor: 'var(--background-color)',
                                                '&:hover': {
                                                    backgroundColor: 'var(--hover-button-color)'
                                                },
                                                fontSize: '16px',
                                                fontWeight: 'bold',
                                                whiteSpace: 'nowrap',
                                                textTransform: 'none',
                                                pointerEvents: 'auto',
                                                color: '#00d4ff'
                                            }}
                                            onClick={() => handleOpenUpdateDialog(option)}
                                        >
                                            <Pencil size={15} />
                                        </Button>
                                    )}
                                </Box>
                            )
                        }}
                        renderInput={params => (
                            <TextField
                                {...params}
                                variant='outlined'
                                label={t('COMMON.BENEFIT.TYPE')}
                                fullWidth
                                error={isSubmit && !benefitTypeId === null}
                            />
                        )}
                        value={benefitTypesData.find(type => type.Id === benefitTypeId) || null}
                        onChange={(event, newValue) => {
                            if (newValue?.Id !== -1) {
                                setBenefitTypeId(newValue?.Id || null)
                            }
                        }}
                        isOptionEqualToValue={(option, value) => option.Id === value.Id}
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
                    <Button variant='contained' startIcon={<XIcon />} onClick={() => router.push('/admin/benefit')}>
                        {t('COMMON.BUTTON.CLOSE')}
                    </Button>
                </Box>
            </Paper>

            {isOpenCreateBenefitType && (
                <Box
                    sx={{
                        position: 'fixed',
                        top: 0,
                        bottom: 0,
                        left: 0,
                        right: 0,
                        display: 'flex',
                        alignItems: 'center',
                        justifyItems: 'center',
                        backgroundColor: 'rgba(0, 0, 0, 0.5)',
                        zIndex: 1000
                    }}
                >
                    <Box //box nội dung
                        sx={{
                            width: '500px',
                            backgroundColor: 'white',
                            borderRadius: '12px',
                            boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
                            overflow: 'hidden', //ẩn nội dung khi bị tràn
                            margin: 'auto'
                        }}
                    >
                        <Box //header
                            sx={{
                                padding: '16px 24px',
                                borderBottom: '1px solid var(--border-color)',
                                fontSize: '24px',
                                fontWeight: 'bold',
                                backgroundColor: 'var(--background-color)' //màu nền
                            }}
                        >
                            {t('COMMON.BENEFIT.BENEFIT_TYPE.CREATE_TITLE')}
                        </Box>
                        <Box
                            sx={{
                                padding: '24px',
                                backgroundColor: 'var(--background-color)',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '20px'
                            }}
                        >
                            {/* Name Field - Required */}
                            <Box>
                                <TextField
                                    variant='outlined'
                                    label={t('COMMON.BENEFIT.BENEFIT_TYPE.NAME')}
                                    name='name'
                                    fullWidth
                                    {...(isSubmit && benefitTypeName === '' && { error: true })}
                                    sx={{
                                        color: 'var(--text-color)',
                                        '& fieldset': {
                                            borderRadius: '8px',
                                            color: 'var(--text-color)',
                                            borderColor: 'var(--border-color)'
                                        },
                                        '& .MuiInputBase-root': { paddingRight: '0px' },
                                        '& .MuiInputBase-input': {
                                            color: 'var(--text-color)',
                                            fontSize: '16px'
                                        },
                                        '& .MuiOutlinedInput-root:hover fieldset': {
                                            borderColor: 'var(--hover-color)'
                                        },
                                        '& .MuiOutlinedInput-root.Mui-focused fieldset': {
                                            borderColor: 'var(--selected-color)'
                                        },
                                        '& .MuiInputLabel-root': {
                                            color: 'var(--text-label-color)'
                                        },
                                        '& .MuiInputLabel-root.Mui-focused': {
                                            color: 'var(--selected-color)'
                                        }
                                    }}
                                    value={benefitTypeName}
                                    onChange={e => setBenefitTypeName(e.target.value)}
                                />
                                <Typography
                                    sx={{
                                        color: 'red',
                                        margin: '1px 0 0 10px',
                                        fontSize: '12px',
                                        visibility: isSubmit && benefitTypeName === '' ? 'visible' : 'hidden'
                                    }}
                                >
                                    {t('COMMON.TEXTFIELD.REQUIRED')}
                                </Typography>
                            </Box>

                            <TextField
                                variant='outlined'
                                label={t('COMMON.BENEFIT.BENEFIT_TYPE.DESCRIPTION')}
                                id='fullWidth'
                                fullWidth
                                multiline
                                minRows={4}
                                maxRows={12}
                                sx={{
                                    mt: '7px',
                                    color: 'var(--text-color)',
                                    '& fieldset': {
                                        borderRadius: '8px',
                                        color: 'var(--text-color)',
                                        borderColor: 'var(--border-color)'
                                    },
                                    '& .MuiInputBase-root': { paddingRight: '0px' },
                                    '& .MuiInputBase-input': {
                                        color: 'var(--text-color)',
                                        fontSize: '16px'
                                    },
                                    '& .MuiOutlinedInput-root:hover fieldset': {
                                        borderColor: 'var(--hover-color)'
                                    },
                                    '& .MuiOutlinedInput-root.Mui-focused fieldset': {
                                        borderColor: 'var(--selected-color)'
                                    },
                                    '& .MuiInputLabel-root': {
                                        color: 'var(--text-label-color)'
                                    },
                                    '& .MuiInputLabel-root.Mui-focused': {
                                        color: 'var(--selected-color)'
                                    }
                                }}
                                value={benefitTypeDescription}
                                onChange={e => setBenefitTypeDescription(e.target.value)}
                            />
                        </Box>
                        <Box
                            sx={{
                                //footer
                                padding: '16px 24px',
                                borderTop: '2px solid var(--border-color)',
                                display: 'flex',
                                justifyContent: 'flex-end',
                                gap: '12px',
                                backgroundColor: 'var(--background-color)'
                            }}
                        >
                            <Button //nút lưu
                                variant='contained'
                                onClick={handleSaveBenefitType}
                                sx={{
                                    height: '44px',
                                    backgroundColor: 'var(--button-color)',
                                    padding: '0px 24px',
                                    '&:hover': {
                                        backgroundColor: 'var(--hover-button-color)'
                                    },
                                    fontSize: '16px',
                                    fontWeight: 'bold',
                                    textTransform: 'none'
                                }}
                            >
                                Lưu
                            </Button>

                            <Button //nút hủy
                                variant='contained'
                                onClick={handleCloseCreateDialog}
                                sx={{
                                    height: '44px',
                                    backgroundColor: 'var(--button-color)',
                                    padding: '0px 24px',
                                    '&:hover': {
                                        backgroundColor: 'var(--hover-button-color)'
                                    },
                                    fontSize: '16px',
                                    fontWeight: 'bold',
                                    textTransform: 'none'
                                }}
                            >
                                Hủy
                            </Button>
                        </Box>
                    </Box>
                </Box>
            )}

            {isOpenUpdateBenefitType && (
                <Box
                    sx={{
                        position: 'fixed',
                        top: 0,
                        bottom: 0,
                        left: 0,
                        right: 0,
                        display: 'flex',
                        alignItems: 'center',
                        justifyItems: 'center',
                        backgroundColor: 'rgba(0, 0, 0, 0.5)',
                        zIndex: 1000
                    }}
                >
                    <Box //box nội dung
                        sx={{
                            width: '500px',
                            backgroundColor: 'white',
                            borderRadius: '12px',
                            boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
                            overflow: 'hidden', //ẩn nội dung khi bị tràn
                            margin: 'auto'
                        }}
                    >
                        <Box //header
                            sx={{
                                padding: '16px 24px',
                                borderBottom: '1px solid var(--border-color)',
                                fontSize: '24px',
                                fontWeight: 'bold',
                                backgroundColor: 'var(--background-color)' //màu nền
                            }}
                        >
                            {t('COMMON.BENEFIT.BENEFIT_TYPE.CREATE_TITLE')}
                        </Box>
                        <Box
                            sx={{
                                padding: '24px',
                                backgroundColor: 'var(--background-color)',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '20px'
                            }}
                        >
                            {/* Name Field - Required */}
                            <Box>
                                <TextField
                                    variant='outlined'
                                    label={t('COMMON.BENEFIT.BENEFIT_TYPE.NAME')}
                                    name='name'
                                    fullWidth
                                    {...(isSubmit && benefitTypeName === '' && { error: true })}
                                    sx={{
                                        color: 'var(--text-color)',
                                        '& fieldset': {
                                            borderRadius: '8px',
                                            color: 'var(--text-color)',
                                            borderColor: 'var(--border-color)'
                                        },
                                        '& .MuiInputBase-root': { paddingRight: '0px' },
                                        '& .MuiInputBase-input': {
                                            color: 'var(--text-color)',
                                            fontSize: '16px'
                                        },
                                        '& .MuiOutlinedInput-root:hover fieldset': {
                                            borderColor: 'var(--hover-color)'
                                        },
                                        '& .MuiOutlinedInput-root.Mui-focused fieldset': {
                                            borderColor: 'var(--selected-color)'
                                        },
                                        '& .MuiInputLabel-root': {
                                            color: 'var(--text-label-color)'
                                        },
                                        '& .MuiInputLabel-root.Mui-focused': {
                                            color: 'var(--selected-color)'
                                        }
                                    }}
                                    value={benefitTypeName}
                                    onChange={e => setBenefitTypeName(e.target.value)}
                                />
                                <Typography
                                    sx={{
                                        color: 'red',
                                        margin: '1px 0 0 10px',
                                        fontSize: '12px',
                                        visibility: isSubmit && benefitTypeName === '' ? 'visible' : 'hidden'
                                    }}
                                >
                                    {t('COMMON.TEXTFIELD.REQUIRED')}
                                </Typography>
                            </Box>

                            <TextField
                                variant='outlined'
                                label={t('COMMON.BENEFIT.BENEFIT_TYPE.DESCRIPTION')}
                                id='fullWidth'
                                fullWidth
                                multiline
                                minRows={4}
                                maxRows={12}
                                sx={{
                                    mt: '7px',
                                    color: 'var(--text-color)',
                                    '& fieldset': {
                                        borderRadius: '8px',
                                        color: 'var(--text-color)',
                                        borderColor: 'var(--border-color)'
                                    },
                                    '& .MuiInputBase-root': { paddingRight: '0px' },
                                    '& .MuiInputBase-input': {
                                        color: 'var(--text-color)',
                                        fontSize: '16px'
                                    },
                                    '& .MuiOutlinedInput-root:hover fieldset': {
                                        borderColor: 'var(--hover-color)'
                                    },
                                    '& .MuiOutlinedInput-root.Mui-focused fieldset': {
                                        borderColor: 'var(--selected-color)'
                                    },
                                    '& .MuiInputLabel-root': {
                                        color: 'var(--text-label-color)'
                                    },
                                    '& .MuiInputLabel-root.Mui-focused': {
                                        color: 'var(--selected-color)'
                                    }
                                }}
                                value={benefitTypeDescription}
                                onChange={e => setBenefitTypeDescription(e.target.value)}
                            />
                        </Box>
                        <Box
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '20px',
                                mt: '20px',
                                padding: '16px 24px'
                            }}
                        >
                            <LoadingButton
                                variant='contained'
                                {...(isLoading && { loading: true })}
                                loadingPosition='start'
                                sx={{ backgroundColor: 'var(--button-color)' }}
                                startIcon={<SaveIcon />}
                                onClick={handleSaveBenefitType}
                            >
                                {t('COMMON.BUTTON.SAVE')}
                            </LoadingButton>
                            <LoadingButton
                                variant='contained'
                                {...(isLoading && { loading: true })}
                                loadingPosition='start'
                                sx={{ backgroundColor: 'gray' }}
                                startIcon={<Ban />}
                                onClick={handleCloseUpdateDialog}
                            >
                                {t('BỎ QUA')}
                            </LoadingButton>
                            <Button
                                variant='contained'
                                sx={{ backgroundColor: 'red' }}
                                startIcon={<Trash2 />}
                                onClick={() => router.push('/admin/benefit')}
                            >
                                {t('COMMON.BUTTON.CLOSE')}
                            </Button>
                        </Box>
                    </Box>
                </Box>
            )}
        </Box>
    )
}

export default CreateBenefitPage
