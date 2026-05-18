import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Trash, ClipboardText } from '@phosphor-icons/react'
import type { TestItem as TestItemType } from '@/lib/types'

interface TestItemCardProps {
  item: TestItemType
  isSelected: boolean
  onClick: () => void
  onDelete: () => void
}

export const TestItemCard = ({ item, isSelected, onClick, onDelete }: TestItemCardProps) => {
  const requirements = Array.isArray(item.requirements) ? item.requirements : []
  const requirementCount = requirements.length
  const totalCriteria = requirements.reduce((acc, req) => {
    const criteria = Array.isArray(req.criteria) ? req.criteria : []
    return acc + criteria.length
  }, 0)
  const passedCriteria = requirements.reduce(
    (acc, req) => {
      const criteria = Array.isArray(req.criteria) ? req.criteria : []
      return acc + criteria.filter((c) => c.checked).length
    },
    0
  )

  return (
    <Card
      className={`cursor-pointer transition-all hover:shadow-md ${
        isSelected ? 'ring-2 ring-primary shadow-md' : ''
      }`}
      onClick={onClick}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <ClipboardText weight="duotone" className="text-primary flex-shrink-0" size={20} />
            <CardTitle className="text-lg truncate">{item.name}</CardTitle>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 text-destructive hover:text-destructive hover:bg-destructive/10 flex-shrink-0"
            onClick={(e) => {
              e.stopPropagation()
              onDelete()
            }}
          >
            <Trash weight="bold" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="pb-4">
        <div className="flex gap-2 flex-wrap">
          <Badge variant="secondary" className="text-xs">
            {requirementCount} {requirementCount === 1 ? 'exigence' : 'exigences'}
          </Badge>
          {totalCriteria > 0 && (
            <Badge
              variant={passedCriteria === totalCriteria ? 'default' : 'outline'}
              className={
                passedCriteria === totalCriteria
                  ? 'bg-accent text-accent-foreground'
                  : ''
              }
            >
              {passedCriteria}/{totalCriteria} réussi
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
