'use client'
import { Autocomplete, Box, Button, Paper, TextField, Typography } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { SaveIcon, XIcon } from 'lucide-react'
import { useRouter } from 'next/navigation'
// import { useUpdateSysConfigurationMutation, useGetByIdSysConfigurationQuery } from '@/services/SysConfigurationService'
import { useEffect, useState } from 'react'
import LoadingButton from '@mui/lab/LoadingButton'
import { useToast } from '@/hooks/useToast'
import { useSearchParams } from 'next/navigation'
import { useGetAllBenefitsTypeQuery, useGetByIdBenefitQuery, useUpdateBenefitMutation } from '@/services/BenefitService'
import { IBenefitGetAllType } from '@/models/Benefit'

function UpdateConfigurationPage() {
    const { t } = useTranslation('common')
    const router = useRouter()
    const [benefitTypeId, setBenefitTypeId] = useState<number | null>()
    const [Id, setBenefitTypeName] = useState('')
    const [name, setName] = useState('')

    // const [key, setKey] = useState('')
    // const [type, setType] = useState('')
    // const [value, setValue] = useState('')
    // const [description, setDescription] = useState('')
    const toast = useToast()
    const [isSubmit, setIsSubmit] = useState(false)

    const searchParams = useSearchParams()
    const id = searchParams.get('id') ? (searchParams.get('id') as string) : ''

    const { data: responseData, isFetching: isFetchingGetById, refetch } = useGetByIdBenefitQuery(id)
    const [updateBenefit, { isSuccess, isLoading, isError }] = useUpdateBenefitMutation()

    const data = responseData?.Data
    useEffect(() => {
        if (!isFetchingGetById && data) {
            // setKey(data.Key)
            // setType(data.Type)
            // setValue(data.Value)
            // setDescription(data.Description)
            setBenefitTypeId(data.BenefitTypeId)
            setName(data.Name)
            setBenefitTypeName(data.BenefitTypeName)
        }
    }, [data, isFetchingGetById])

    const handleSave = async () => {
        setIsSubmit(true)

        const data = {
            Name: name,
            Id: id,
            BenefitTypeId: benefitTypeId
            //Value: value,
            //Description: description
        }
        await updateBenefit(data).unwrap()
        refetch()
        setIsSubmit(false)
    }

    useEffect(() => {
        if (isSuccess === true) {
            toast(t('COMMON.SYS_CONFIGURATION.ACTION_CONFIGURATION.UPDATE_SUCCESS'), 'success')
        }
        if (isError === true) {
            toast(t('COMMON.SYS_CONFIGURATION.ACTION_CONFIGURATION.UPDATE_ERROR'), 'error')
        }
    }, [isSuccess, isError])

    const handleSaveAndClose = async () => {
        setIsSubmit(true)

        const data = {
            Name: name,
            Id: id,
            BenefitTypeId: benefitTypeId
            // Value: value,
            // Description: description
        }
        await updateBenefit(data).unwrap()
        refetch()
        setIsSubmit(false)
        router.push('/admin/benefit')
    }
    const { data: benefitTypes } = useGetAllBenefitsTypeQuery()
    const benefitTypesData = (benefitTypes?.Data?.Records as IBenefitGetAllType[]) || []

    const specialOption = { Id: -1, Name: '---Lựa chọn---', Description: null }
    const optionsWithSpecial = [specialOption, ...benefitTypesData]

    useEffect(() => {}, [Id])

    return (
        <Box sx={{ width: '720px', maxWidth: '100%', margin: '0 auto' }}>
            <Paper
                elevation={0}
                sx={{
                    width: '100%',
                    boxShadow: 'var(--box-shadow-paper)',
                    overflow: 'hidden',
                    borderRadius: '15px',
                    backgroundColor: 'var(--background-item)',
                    padding: '24px'
                }}
            >
                <Typography sx={{ fontWeight: 'bold', fontSize: '22px', color: 'var(--text-color)' }}>
                    {t('COMMON.SYS_CONFIGURATION.ACTION_CONFIGURATION.UPDATE_TITLE')}
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
                        sx={{
                            height: '50px',
                            backgroundColor: 'var(--button-color)',
                            width: 'auto',
                            padding: '0px 30px',
                            fontSize: '16px',
                            '&:hover': {
                                backgroundColor: 'var(--hover-button-color)'
                            },
                            fontWeight: 'bold',
                            whiteSpace: 'nowrap',
                            textTransform: 'none'
                        }}
                        onClick={handleSave}
                    >
                        {t('COMMON.BUTTON.SAVE')}
                    </LoadingButton>

                    <LoadingButton
                        variant='contained'
                        {...(isLoading && { loading: true })}
                        loadingPosition='start'
                        startIcon={<SaveIcon />}
                        sx={{
                            height: '50px',
                            backgroundColor: 'var(--button-color)',
                            width: 'auto',
                            padding: '0px 30px',
                            fontSize: '16px',
                            '&:hover': {
                                backgroundColor: 'var(--hover-button-color)'
                            },
                            fontWeight: 'bold',
                            whiteSpace: 'nowrap',
                            textTransform: 'none'
                        }}
                        onClick={handleSaveAndClose}
                    >
                        {t('COMMON.BUTTON.SAVE_AND_CLOSE')}
                    </LoadingButton>

                    <Button
                        variant='contained'
                        startIcon={<XIcon />}
                        sx={{
                            height: '50px',
                            backgroundColor: 'var(--button-color)',
                            width: 'auto',
                            padding: '0px 30px',
                            fontSize: '16px',
                            '&:hover': {
                                backgroundColor: 'var(--hover-button-color)'
                            },
                            fontWeight: 'bold',
                            whiteSpace: 'nowrap',
                            textTransform: 'none'
                        }}
                        onClick={() => {
                            router.push('/admin/configuration')
                        }}
                    >
                        {t('COMMON.BUTTON.CLOSE')}
                    </Button>
                </Box>
            </Paper>
        </Box>
    )
}

export default UpdateConfigurationPage
