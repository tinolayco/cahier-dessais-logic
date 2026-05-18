import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import { Separator } from '@/components/ui/separator'
import { Trash, Plus } from '@phosphor-icons/react'
import { ImageUpload, ImagePreview } from './ImageUpload'
import type { TestRequirement } from '@/lib/types'
import { useState } from 'react'

interface RequirementCardProps {
  requirement: TestRequirement
  onUpdate: (updated: TestRequirement) => void
  onDelete: () => void
}

export const RequirementCard = ({ requirement, onUpdate, onDelete }: RequirementCardProps) => {
  const [newCriterionText, setNewCriterionText] = useState('')

  const handleAddCriterion = () => {
    if (!newCriterionText.trim()) return

    onUpdate({
      ...requirement,
      criteria: [
        ...requirement.criteria,
        {
          id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          text: newCriterionText,
          checked: false
        }
      ]
    })
    setNewCriterionText('')
  }

  const handleToggleCriterion = (criterionId: string) => {
    onUpdate({
      ...requirement,
      criteria: requirement.criteria.map((c) =>
        c.id === criterionId ? { ...c, checked: !c.checked } : c
      )
    })
  }

  const handleDeleteCriterion = (criterionId: string) => {
    onUpdate({
      ...requirement,
      criteria: requirement.criteria.filter((c) => c.id !== criterionId)
    })
  }

  const handleAddImage = (base64: string) => {
    onUpdate({
      ...requirement,
      images: [...requirement.images, base64]
    })
  }

  const handleRemoveImage = (index: number) => {
    onUpdate({
      ...requirement,
      images: requirement.images.filter((_, i) => i !== index)
    })
  }

  return (
    <Card className="border-l-4 border-l-primary">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1">
            <Textarea
              value={requirement.content}
              onChange={(e) =>
                onUpdate({ ...requirement, content: e.target.value })
              }
              placeholder="Décrivez l'exigence de test (ex: Appuyez sur le bouton <image> et vérifiez...)"
              className="min-h-[80px] text-sm resize-none"
            />
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 text-destructive hover:text-destructive hover:bg-destructive/10 flex-shrink-0"
            onClick={onDelete}
          >
            <Trash weight="bold" />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <ImageUpload onImageAdd={handleAddImage} />
            <span className="text-xs text-muted-foreground">
              Télécharger, coller ou glisser des images (max 2Mo)
            </span>
          </div>
          {requirement.images.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {requirement.images.map((img, index) => (
                <ImagePreview
                  key={index}
                  src={img}
                  onRemove={() => handleRemoveImage(index)}
                />
              ))}
            </div>
          )}
        </div>

        <Separator />

        <div>
          <h4 className="text-sm font-semibold mb-2">Critères de Réussite/Échec</h4>
          <div className="space-y-2">
            {requirement.criteria.map((criterion) => (
              <div
                key={criterion.id}
                className="flex items-center gap-2 p-2 rounded hover:bg-muted/50 transition-colors group"
              >
                <Checkbox
                  id={criterion.id}
                  checked={criterion.checked}
                  onCheckedChange={() => handleToggleCriterion(criterion.id)}
                  className="flex-shrink-0"
                />
                <label
                  htmlFor={criterion.id}
                  className={`flex-1 text-sm cursor-pointer ${
                    criterion.checked ? 'line-through text-muted-foreground' : ''
                  }`}
                >
                  {criterion.text}
                </label>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => handleDeleteCriterion(criterion.id)}
                >
                  <Trash size={14} />
                </Button>
              </div>
            ))}
          </div>

          <div className="flex gap-2 mt-3">
            <Input
              value={newCriterionText}
              onChange={(e) => setNewCriterionText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault()
                  handleAddCriterion()
                }
              }}
              placeholder="Ajouter un critère de réussite/échec..."
              className="flex-1 text-sm"
            />
            <Button
              onClick={handleAddCriterion}
              size="sm"
              disabled={!newCriterionText.trim()}
            >
              <Plus weight="bold" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
