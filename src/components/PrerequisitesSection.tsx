import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Separator } from '@/components/ui/separator'
import { Trash, Plus, ListChecks } from '@phosphor-icons/react'
import { ImageUpload, ImagePreview } from './ImageUpload'
import type { Prerequisite } from '@/lib/types'

interface PrerequisitesSectionProps {
  prerequisites: Prerequisite[]
  onUpdate: (prerequisites: Prerequisite[]) => void
}

export const PrerequisitesSection = ({ prerequisites, onUpdate }: PrerequisitesSectionProps) => {
  const prereqs = Array.isArray(prerequisites) ? prerequisites : []

  const handleAddPrerequisite = () => {
    const newPrerequisite: Prerequisite = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      description: '',
      images: [],
      createdAt: Date.now()
    }
    onUpdate([...prereqs, newPrerequisite])
  }

  const handleUpdatePrerequisite = (id: string, updated: Prerequisite) => {
    onUpdate(prereqs.map((p) => (p.id === id ? updated : p)))
  }

  const handleDeletePrerequisite = (id: string) => {
    onUpdate(prereqs.filter((p) => p.id !== id))
  }

  const handleAddImage = (prerequisiteId: string, base64: string) => {
    onUpdate(
      prereqs.map((p) =>
        p.id === prerequisiteId ? { ...p, images: [...(Array.isArray(p.images) ? p.images : []), base64] } : p
      )
    )
  }

  const handleRemoveImage = (prerequisiteId: string, imageIndex: number) => {
    onUpdate(
      prereqs.map((p) =>
        p.id === prerequisiteId
          ? { ...p, images: (Array.isArray(p.images) ? p.images : []).filter((_, i) => i !== imageIndex) }
          : p
      )
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ListChecks weight="duotone" className="text-primary" size={24} />
          <h3 className="text-lg font-semibold">Pré-requis</h3>
        </div>
        <Button onClick={handleAddPrerequisite} size="sm">
          <Plus weight="bold" className="mr-1.5" />
          Ajouter Pré-requis
        </Button>
      </div>

      {prereqs.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="py-8 text-center">
            <p className="text-sm text-muted-foreground mb-3">
              Aucun pré-requis. Ajoutez les conditions préalables pour effectuer ce test.
            </p>
            <Button size="sm" variant="outline" onClick={handleAddPrerequisite}>
              <Plus weight="bold" className="mr-1.5" />
              Ajouter le Premier Pré-requis
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {prereqs.map((prereq) => (
            <Card key={prereq.id} className="border-l-4 border-l-accent">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <Textarea
                      value={prereq.description}
                      onChange={(e) =>
                        handleUpdatePrerequisite(prereq.id, {
                          ...prereq,
                          description: e.target.value
                        })
                      }
                      placeholder="Décrivez le pré-requis (ex: L'utilisateur doit être connecté, la base de données doit contenir...)"
                      className="min-h-[60px] text-sm resize-none"
                    />
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 text-destructive hover:text-destructive hover:bg-destructive/10 flex-shrink-0"
                    onClick={() => handleDeletePrerequisite(prereq.id)}
                  >
                    <Trash weight="bold" />
                  </Button>
                </div>
              </CardHeader>

              <CardContent>
                <Separator className="mb-3" />
                <div>
                  <div className="mb-2">
                    <ImageUpload onImageAdd={(img) => handleAddImage(prereq.id, img)} />
                    <p className="text-xs text-muted-foreground mt-1.5">
                      Sélectionnez un fichier ou cliquez sur la zone de collage et faites Ctrl+V pour coller une image (max 2Mo)
                    </p>
                  </div>
                  {Array.isArray(prereq.images) && prereq.images.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {prereq.images.map((img, index) => (
                        <ImagePreview
                          key={index}
                          src={img}
                          onRemove={() => handleRemoveImage(prereq.id, index)}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
