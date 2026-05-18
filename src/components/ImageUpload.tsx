import { useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Image, X } from '@phosphor-icons/react'
import { imageToBase64 } from '@/lib/notebook-utils'
import { toast } from 'sonner'

interface ImageUploadProps {
  onImageAdd: (base64: string) => void
  className?: string
}

export const ImageUpload = ({ onImageAdd, className = '' }: ImageUploadProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isDragging, setIsDragging] = useState(false)

  const handleFileSelect = async (files: FileList | null) => {
    if (!files || files.length === 0) return

    const file = files[0]
    if (!file.type.startsWith('image/')) {
      toast.error('Veuillez sélectionner un fichier image')
      return
    }

    try {
      const base64 = await imageToBase64(file)
      onImageAdd(base64)
      toast.success('Image ajoutée')
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Échec de l\'ajout de l\'image')
    }
  }

  const handlePaste = async (e: React.ClipboardEvent) => {
    const items = e.clipboardData?.items
    if (!items) return

    for (let i = 0; i < items.length; i++) {
      if (items[i].type.startsWith('image/')) {
        e.preventDefault()
        const file = items[i].getAsFile()
        if (file) {
          try {
            const base64 = await imageToBase64(file)
            onImageAdd(base64)
            toast.success('Image collée')
          } catch (error) {
            toast.error(error instanceof Error ? error.message : 'Échec du collage de l\'image')
          }
        }
        break
      }
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    handleFileSelect(e.dataTransfer.files)
  }

  return (
    <div
      className={className}
      onPaste={handlePaste}
      onDragOver={(e) => {
        e.preventDefault()
        setIsDragging(true)
      }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={handleDrop}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={(e) => handleFileSelect(e.target.files)}
        className="hidden"
      />
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => fileInputRef.current?.click()}
        className={isDragging ? 'border-primary' : ''}
      >
        <Image className="mr-1.5" weight="duotone" />
        Ajouter Image
      </Button>
    </div>
  )
}

interface ImagePreviewProps {
  src: string
  onRemove: () => void
  className?: string
}

export const ImagePreview = ({ src, onRemove, className = '' }: ImagePreviewProps) => {
  return (
    <div className={`relative inline-block group ${className}`}>
      <img
        src={src}
        alt="Embedded"
        className="max-w-full h-auto rounded border border-border"
        style={{ maxHeight: '200px' }}
      />
      <Button
        type="button"
        size="sm"
        variant="destructive"
        className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity h-7 w-7 p-0"
        onClick={onRemove}
      >
        <X weight="bold" />
      </Button>
    </div>
  )
}
