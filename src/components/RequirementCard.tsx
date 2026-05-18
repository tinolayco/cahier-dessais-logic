import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import { Separator } from '@/components/ui/separator'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { Trash, Plus, CaretDown, CaretRight } from '@phosphor-icons/react'
import { ImageUpload, ImagePreview } from './ImageUpload'
import type { TestRequirement, TestCriterion } from '@/lib/types'
import { useState } from 'react'

interface RequirementCardProps {
  requirement: TestRequirement
  onUpdate: (updated: TestRequirement) => void
  onDelete: () => void
}

export const RequirementCard = ({ requirement, onUpdate, onDelete }: RequirementCardProps) => {
  const [newCriterionText, setNewCriterionText] = useState('')
  const [expandedCriteria, setExpandedCriteria] = useState<Set<string>>(new Set())

  const criteria = Array.isArray(requirement.criteria) ? requirement.criteria : []
  const images = Array.isArray(requirement.images) ? requirement.images : []

  const handleAddCriterion = () => {
    if (!newCriterionText.trim()) return

    onUpdate({
      ...requirement,
      criteria: [
        ...criteria,
        {
          id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          text: newCriterionText,
          checked: false,
          images: []
        }
      ]
    })
    setNewCriterionText('')
  }

  const handleToggleCriterion = (criterionId: string) => {
    onUpdate({
      ...requirement,
      criteria: criteria.map((c) =>
        c.id === criterionId ? { ...c, checked: !c.checked } : c
      )
    })
  }

  const handleDeleteCriterion = (criterionId: string) => {
    onUpdate({
      ...requirement,
      criteria: criteria.filter((c) => c.id !== criterionId)
    })
  }

  const handleAddImage = (base64: string) => {
    onUpdate({
      ...requirement,
      images: [...images, base64]
    })
  }

  const handleRemoveImage = (index: number) => {
    onUpdate({
      ...requirement,
      images: images.filter((_, i) => i !== index)
    })
  }

  const handleAddCriterionImage = (criterionId: string, base64: string) => {
    onUpdate({
      ...requirement,
      criteria: criteria.map((c) =>
        c.id === criterionId
          ? { ...c, images: [...(c.images || []), base64] }
          : c
      )
    })
  }

  const handleRemoveCriterionImage = (criterionId: string, imageIndex: number) => {
    onUpdate({
      ...requirement,
      criteria: criteria.map((c) =>
        c.id === criterionId
          ? { ...c, images: (c.images || []).filter((_, i) => i !== imageIndex) }
          : c
      )
    })
  }

  const toggleCriterionExpanded = (criterionId: string) => {
    setExpandedCriteria(prev => {
      const next = new Set(prev)
      if (next.has(criterionId)) {
        next.delete(criterionId)
      } else {
        next.add(criterionId)
      }
      return next
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
          <div className="mb-2">
            <ImageUpload onImageAdd={handleAddImage} />
            <p className="text-xs text-muted-foreground mt-1.5">
              Sélectionnez un fichier ou cliquez sur la zone de collage et faites Ctrl+V pour coller une image (max 2Mo)
            </p>
          </div>
          {images.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {images.map((img, index) => (
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
            {criteria.map((criterion) => {
              const isExpanded = expandedCriteria.has(criterion.id)
              const criterionImages = criterion.images || []
              
              return (
                <Collapsible
                  key={criterion.id}
                  open={isExpanded}
                  onOpenChange={() => toggleCriterionExpanded(criterion.id)}
                >
                  <div className="rounded border border-border bg-card">
                    <div className="flex items-center gap-2 p-2 hover:bg-muted/50 transition-colors group">
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
                      <CollapsibleTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0"
                          type="button"
                        >
                          {isExpanded ? (
                            <CaretDown size={16} weight="bold" />
                          ) : (
                            <CaretRight size={16} weight="bold" />
                          )}
                        </Button>
                      </CollapsibleTrigger>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => handleDeleteCriterion(criterion.id)}
                        type="button"
                      >
                        <Trash size={14} />
                      </Button>
                    </div>
                    
                    <CollapsibleContent>
                      <div className="p-3 border-t border-border bg-muted/30">
                        <p className="text-xs font-medium text-muted-foreground mb-2">
                          Images de résultat pour ce critère
                        </p>
                        <ImageUpload
                          onImageAdd={(base64) => handleAddCriterionImage(criterion.id, base64)}
                        />
                        {criterionImages.length > 0 && (
                          <div className="flex flex-wrap gap-2 mt-2">
                            {criterionImages.map((img, imgIndex) => (
                              <ImagePreview
                                key={imgIndex}
                                src={img}
                                onRemove={() => handleRemoveCriterionImage(criterion.id, imgIndex)}
                              />
                            ))}
                          </div>
                        )}
                      </div>
                    </CollapsibleContent>
                  </div>
                </Collapsible>
              )
            })}
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
              type="button"
            >
              <Plus weight="bold" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
