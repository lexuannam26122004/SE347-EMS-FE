import React, { useState } from 'react'
import { Button, Box, Typography, IconButton } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { UploadFile, Close, PictureAsPdf, Description, InsertDriveFile } from '@mui/icons-material'
import uploadFile from '@/utils/uploadFile'

interface Props {
    files: number[]
    setFiles: React.Dispatch<React.SetStateAction<number[]>>
    initialFiles?: string[] // Nhận danh sách URL từ API
}

function UploadFiles({ setFiles, initialFiles = [] }: Props) {
    const { t } = useTranslation('common')
    const [fileCurrents, setFileCurrents] = useState<File[]>([])

    // Chuyển đổi danh sách URL từ API thành đối tượng file
    const processedInitialFiles = initialFiles.map((url, index) => {
        const name = url.split('/').pop()?.split('\\').pop() || `File ${index + 1}`
        const ext = name.split('.').pop()?.toLowerCase()

        let type

        switch (ext) {
            case 'png':
            case 'jpg':
            case 'jpeg':
            case 'gif':
                type = `image/${ext}`
                break
            case 'pdf':
                type = 'application/pdf'
                break
            case 'doc':
            case 'docx':
                type = 'application/msword'
                break
            case 'xls':
            case 'xlsx':
                type = 'application/vnd.ms-excel'
                break
            case 'ppt':
            case 'pptx':
                type = 'application/vnd.ms-powerpoint'
                break
            default:
                type = 'application/octet-stream' // Default for unknown file types
                break
        }

        return { id: index, name, type, url }
    })

    // Danh sách file đã có từ API
    const [existingFiles, setExistingFiles] = useState(processedInitialFiles)

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
                }
            }
        }
    }

    const handleRemoveFile = (index: number) => {
        console.log('index', index)
        if (index < existingFiles.length) {
            // Xóa file từ danh sách ban đầu
            setExistingFiles(prev => prev.filter((_, i) => i !== index))
            setFiles(prevFiles => prevFiles.filter((_, i) => i !== index))
        } else {
            // Xóa file mới thêm vào
            const adjustedIndex = index - existingFiles.length
            setFileCurrents(prevFiles => prevFiles.filter((_, i) => i !== adjustedIndex))
            setFiles(prevFiles => prevFiles.filter((_, i) => i !== index))
        }
    }

    const getFileIcon = (fileType: string) => {
        if (fileType === 'application/pdf') {
            return <PictureAsPdf fontSize='large' sx={{ color: '#ff2e2e' }} />
        }
        if (
            fileType === 'application/vnd.ms-excel' ||
            fileType === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        ) {
            return <Description fontSize='large' sx={{ color: '#46ff46' }} />
        }
        if (
            fileType === 'application/msword' ||
            fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        ) {
            return <Description fontSize='large' sx={{ color: '#2cb5ff' }} />
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

            {/* Hiển thị file đã có và file mới thêm */}
            <Box
                sx={{
                    mt: '15px',
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
                {(existingFiles || fileCurrents) &&
                    [...existingFiles, ...fileCurrents].map((file, index) => {
                        const isFromAPI = 'url' in file // Kiểm tra nếu file có thuộc tính `url`
                        return (
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
                                {isFromAPI ? (
                                    // Nếu file từ API
                                    file.type.startsWith('image/') ? (
                                        <img
                                            src={file.url}
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
                                                    width: '100%',
                                                    overflow: 'hidden',
                                                    textOverflow: 'ellipsis',
                                                    WebkitLineClamp: 3
                                                }}
                                            >
                                                {file.name}
                                            </Typography>
                                        </>
                                    )
                                ) : // Nếu file là `File` (tải lên mới)
                                file.type.startsWith('image/') ? (
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
                                                width: '100%',
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
                        )
                    })}
            </Box>
        </Box>
    )
}

export default UploadFiles
