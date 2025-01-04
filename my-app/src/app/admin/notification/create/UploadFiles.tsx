import React, { useState } from 'react'
import { Button, Box, Typography, IconButton } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { UploadFile, Close, PictureAsPdf, Description, InsertDriveFile } from '@mui/icons-material'
import uploadFile from '@/utils/uploadFile'

interface Props {
    files: number[]
    setFiles: React.Dispatch<React.SetStateAction<number[]>>
}

function UploadFiles({ setFiles }: Props) {
    const { t } = useTranslation('common')
    const [fileCurrents, setFileCurrents] = useState<File[]>([])

    const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB
    const ALLOWED_TYPES = [
        'image/jpeg',
        'image/png',
        'image/gif',
        'application/pdf',
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ]

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFiles = event.target.files
        if (selectedFiles) {
            const filesArray = Array.from(selectedFiles)
            const validFiles = filesArray.filter(file => {
                if (!ALLOWED_TYPES.includes(file.type)) {
                    alert(`File "${file.name}" không được hỗ trợ.`)
                    return false
                }
                if (file.size > MAX_FILE_SIZE) {
                    alert(`File "${file.name}" vượt quá dung lượng tối đa (5MB).`)
                    return false
                }
                return true
            })

            for (const file of validFiles) {
                const result = await uploadFile(file)
                if (result.Success === true) {
                    setFileCurrents(prevFiles => [...prevFiles, file])
                    setFiles(prev => [...prev, result.Data])
                    console.log(result.Data)
                }
            }
        }
    }

    const handleRemoveFile = (index: number) => {
        setFileCurrents(prevFiles => prevFiles.filter((_, i) => i !== index))
        setFiles(prevFiles => prevFiles.filter((_, i) => i !== index))
    }

    const getFileIcon = (fileType: string) => {
        if (fileType === 'application/pdf') {
            return <PictureAsPdf fontSize='large' sx={{ color: 'red' }} />
        }
        if (
            fileType === 'application/vnd.ms-excel' ||
            fileType === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        ) {
            return <Description fontSize='large' sx={{ color: 'green' }} />
        }
        if (
            fileType === 'application/msword' ||
            fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        ) {
            return <Description fontSize='large' sx={{ color: 'blue' }} />
        }
        return <InsertDriveFile fontSize='large' />
    }

    return (
        <Box>
            <Button
                startIcon={<UploadFile />}
                sx={{
                    padding: '6px 10px',
                    '&:hover': {
                        backgroundColor: 'var(--hover-color)'
                    }
                }}
                component='label'
            >
                {t('COMMON.CREATE_NOTIFICATION.ADD_IMAGES_OR_FILES')}
                <input type='file' multiple onChange={handleFileChange} style={{ display: 'none' }} />
            </Button>

            {fileCurrents.length > 0 && (
                <Box
                    sx={{
                        mt: '10px',
                        border: '1px solid var(--border-color)',
                        height: 'auto',
                        minHeight: '100px',
                        borderRadius: '6px',
                        padding: '10px',
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: '10px'
                    }}
                >
                    {fileCurrents.map((file, index) => (
                        <Box
                            key={index}
                            sx={{
                                position: 'relative',
                                border: '1px solid var(--border-color)',
                                borderRadius: '6px',
                                padding: '10px',
                                textAlign: 'center',
                                width: '120px',
                                height: '120px',
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'center',
                                alignItems: 'center'
                            }}
                        >
                            {file.type.startsWith('image/') ? (
                                <img
                                    src={URL.createObjectURL(file)}
                                    alt={file.name}
                                    style={{
                                        width: '100px',
                                        height: '100px',
                                        objectFit: 'cover',
                                        borderRadius: '4px'
                                    }}
                                />
                            ) : (
                                <>
                                    {getFileIcon(file.type)}
                                    <Typography
                                        variant='body2'
                                        sx={{
                                            color: 'var(--text-color)',
                                            marginTop: '8px',
                                            display: '-webkit-box',
                                            WebkitBoxOrient: 'vertical',
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                            WebkitLineClamp: 3
                                        }}
                                    >
                                        {file.name}
                                    </Typography>
                                </>
                            )}
                            <IconButton
                                size='small'
                                sx={{
                                    position: 'absolute',
                                    top: '-8px',
                                    right: '-7px',
                                    padding: '3px',
                                    color: 'var(--text-gray-color)',
                                    backgroundColor: 'var(--icon-delete-chip-color)',
                                    '&:hover': { backgroundColor: 'var(--hover-icon-delete-chip-color)' }
                                }}
                                onClick={() => handleRemoveFile(index)}
                            >
                                <Close fontSize='small' />
                            </IconButton>
                        </Box>
                    ))}
                </Box>
            )}
        </Box>
    )
}

export default UploadFiles
