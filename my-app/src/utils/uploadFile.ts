'use client'

import { v4 } from 'uuid'
import axios from 'axios'

export default async function UploadFile(file: File): Promise<any> {
    const apiUrlChunks = 'https://localhost:44381/api/admin/SysFile/FileChunks'
    const apiUrlCreate = 'https://localhost:44381/api/admin/SysFile/CreateFile'
    try {
        const chunkSize = 1024 * 1024 * 1 // 1MB
        const uniqueFileName = `${v4().replace(/-/g, '')}_${file.name}`
        const totalChunks = Math.ceil(file.size / chunkSize)

        for (let chunkIndex = 0; chunkIndex < totalChunks; chunkIndex++) {
            const start = chunkIndex * chunkSize
            const end = Math.min(start + chunkSize, file.size)
            const chunk = file.slice(start, end)

            const formData = new FormData()
            formData.append('FileName', file.name)
            formData.append('File', chunk)
            formData.append('ChunkIndex', chunkIndex.toString())
            formData.append('TotalChunks', totalChunks.toString())
            formData.append('UniqueFileName', uniqueFileName)

            try {
                const response = await axios.post(apiUrlChunks, formData, {
                    headers: { 'Content-Type': 'multipart/form-data' },
                    responseType: 'json'
                })

                if (!(response.status >= 200 && response.status < 300)) {
                    throw new Error(`HTTP error ${response.status} uploading chunk ${chunkIndex}`)
                }
            } catch (chunkError: any) {
                console.error('Chunk upload failed:', chunkError)
                throw new Error(`Failed to upload chunk ${chunkIndex + 1}: ${chunkError?.message}`) // Re-throw for the outer catch to handle
            }
        }

        try {
            const createResponse = await axios.post(
                apiUrlCreate,
                {
                    Name: file.name,
                    Type: file.type,
                    UniqueFileName: uniqueFileName
                },
                { responseType: 'json' }
            )

            if (createResponse.status >= 200 && createResponse.status < 300) {
                return createResponse.data
            } else {
                throw new Error(`HTTP error ${createResponse.status} creating file`)
            }
        } catch (createError: any) {
            console.error('Create file failed:', createError)
            throw new Error(`Failed to create file: ${createError?.message}`)
        }
    } catch (error: any) {
        console.error('Upload failed:', error)
        // Handle the error appropriately, maybe display a message to the user
        // Consider re-throwing the error to let the calling component handle it:
        throw error
    }
}
