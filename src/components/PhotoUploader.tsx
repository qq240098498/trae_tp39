import { useRef, useState } from 'react'
import { Camera, X, Upload, Image as ImageIcon } from 'lucide-react'
import type { PhotoProof } from '@/types'
import { generateId, formatDate } from '@/utils/date'
import { cn } from '@/lib/utils'

interface PhotoUploaderProps {
  photos: PhotoProof[]
  onChange: (photos: PhotoProof[]) => void
  maxPhotos?: number
}

export function PhotoUploader({ photos, onChange, maxPhotos = 5 }: PhotoUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isDragging, setIsDragging] = useState(false)

  const compressImage = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = (e) => {
        const img = new Image()
        img.onload = () => {
          const canvas = document.createElement('canvas')
          let { width, height } = img

          const maxDim = 1200
          if (width > maxDim || height > maxDim) {
            if (width > height) {
              height = (height / width) * maxDim
              width = maxDim
            } else {
              width = (width / height) * maxDim
              height = maxDim
            }
          }

          canvas.width = width
          canvas.height = height

          const ctx = canvas.getContext('2d')
          if (!ctx) {
            resolve(e.target?.result as string)
            return
          }

          ctx.drawImage(img, 0, 0, width, height)
          resolve(canvas.toDataURL('image/jpeg', 0.8))
        }
        img.onerror = reject
        img.src = e.target?.result as string
      }
      reader.onerror = reject
      reader.readAsDataURL(file)
    })
  }

  const handleFiles = async (files: FileList) => {
    const newPhotos: PhotoProof[] = []

    for (let i = 0; i < files.length && photos.length + newPhotos.length < maxPhotos; i++) {
      const file = files[i]
      if (!file.type.startsWith('image/')) continue

      try {
        const dataUrl = await compressImage(file)
        newPhotos.push({
          id: generateId(),
          dataUrl,
          name: file.name,
          size: file.size,
          uploadedAt: formatDate(new Date()),
        })
      } catch (error) {
        console.error('Failed to process image:', error)
      }
    }

    onChange([...photos, ...newPhotos])
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files) {
      handleFiles(files)
    }
    e.target.value = ''
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const files = e.dataTransfer.files
    if (files) {
      handleFiles(files)
    }
  }

  const handleRemove = (id: string) => {
    onChange(photos.filter((p) => p.id !== id))
  }

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B'
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-zinc-200">
          <div className="flex items-center gap-2">
            <Camera className="h-4 w-4 text-orange-400" />
            上传保养照片（完成凭证）
          </div>
        </label>
        <span className="text-xs text-zinc-500">
          {photos.length}/{maxPhotos}
        </span>
      </div>

      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={cn(
          'cursor-pointer rounded-xl border-2 border-dashed p-6 text-center transition-all duration-200',
          isDragging
            ? 'border-orange-400 bg-orange-500/10'
            : 'border-zinc-700 bg-zinc-800/30 hover:border-zinc-600 hover:bg-zinc-800/50'
        )}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileChange}
          className="hidden"
        />
        <div className="flex flex-col items-center gap-2">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-zinc-800">
            <Upload className="h-6 w-6 text-zinc-400" />
          </div>
          <p className="text-sm font-medium text-zinc-300">点击或拖拽上传照片</p>
          <p className="text-xs text-zinc-500">支持 JPG、PNG 格式，最多 {maxPhotos} 张</p>
        </div>
      </div>

      {photos.length > 0 && (
        <div className="grid grid-cols-3 gap-3">
          {photos.map((photo) => (
            <div
              key={photo.id}
              className="group relative aspect-square overflow-hidden rounded-lg border border-zinc-700 bg-zinc-800"
            >
              <img
                src={photo.dataUrl}
                alt={photo.name}
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-black/0 transition-colors group-hover:bg-black/40">
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    handleRemove(photo.id)
                  }}
                  className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-white opacity-0 transition-opacity group-hover:opacity-100"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              <div className="absolute bottom-0 left-0 right-0 bg-black/60 px-2 py-1 opacity-0 transition-opacity group-hover:opacity-100">
                <p className="truncate text-xs text-white">{photo.name}</p>
                <p className="text-xs text-zinc-400">{formatSize(photo.size)}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {photos.length === 0 && (
        <div className="flex items-center gap-2 rounded-lg border border-zinc-700/50 bg-zinc-800/20 px-4 py-3">
          <ImageIcon className="h-4 w-4 text-zinc-500" />
          <p className="text-xs text-zinc-500">上传保养完成后的照片，作为完成凭证，下次保养时可快速回顾</p>
        </div>
      )}
    </div>
  )
}
