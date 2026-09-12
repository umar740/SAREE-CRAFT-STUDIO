import { useRef, useState } from 'react'
import { validateImageFile } from '../lib/utils'
import { useToast } from '../contexts/ToastContext'

export interface PendingImage {
  id: string
  file: File
  previewUrl: string
}

export default function ImageUploader({
  images,
  onChange,
  label = 'Click to upload photos',
  hint = 'JPG, JPEG, PNG or WebP — up to 8MB each.',
  multiple = true,
}: {
  images: PendingImage[]
  onChange: (images: PendingImage[]) => void
  label?: string
  hint?: string
  multiple?: boolean
}) {
  const inputRef = useRef<HTMLInputElement>(null)
  const { showToast } = useToast()
  const [dragOver, setDragOver] = useState(false)

  function addFiles(fileList: FileList | null) {
    if (!fileList) return
    const next = [...images]
    Array.from(fileList).forEach((file) => {
      const err = validateImageFile(file)
      if (err) {
        showToast(err, 'error')
        return
      }
      next.push({ id: `${Date.now()}-${Math.random().toString(36).slice(2)}`, file, previewUrl: URL.createObjectURL(file) })
    })
    onChange(next)
  }

  function remove(id: string) {
    onChange(images.filter((i) => i.id !== id))
  }

  return (
    <div>
      <div
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault()
          setDragOver(true)
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault()
          setDragOver(false)
          addFiles(e.dataTransfer.files)
        }}
        className={`border-2 border-dashed rounded-xl2 p-7 text-center bg-ivorydeep cursor-pointer transition-colors ${
          dragOver ? 'border-gold' : 'border-line hover:border-gold'
        }`}
      >
        <div className="text-2xl">📷</div>
        <p className="mt-1.5 font-bold text-wine">{label}</p>
        <p className="text-xs text-inksoft mt-1">{hint}</p>
        <input
          ref={inputRef}
          type="file"
          accept=".jpg,.jpeg,.png,.webp"
          multiple={multiple}
          className="hidden"
          onChange={(e) => addFiles(e.target.files)}
        />
      </div>
      {images.length > 0 && (
        <div className="flex flex-wrap gap-2.5 mt-3.5">
          {images.map((img) => (
            <div key={img.id} className="relative w-20 h-20 rounded-lg overflow-hidden">
              <img src={img.previewUrl} className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={() => remove(img.id)}
                className="absolute top-1 right-1 w-5 h-5 rounded-full bg-black/60 text-white text-xs flex items-center justify-center"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
