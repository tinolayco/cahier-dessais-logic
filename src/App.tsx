import { useState } from 'react'
import { useKV } from '@github/spark/hooks'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { Plus, FloppyDisk, FolderOpen, File } from '@phosphor-icons/react'
import { toast, Toaster } from 'sonner'
import { TestItemCard } from '@/components/TestItemCard'
import { RequirementCard } from '@/components/RequirementCard'
import { PrerequisitesSection } from '@/components/PrerequisitesSection'
import { saveNotebookWithDialog, loadNotebookWithDialog, generateId } from '@/lib/notebook-utils'
import type { TestItem, TestRequirement, Prerequisite } from '@/lib/types'

function App() {
  const [testItems, setTestItems] = useKV<TestItem[]>('test-items', [])
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null)
  const [newItemName, setNewItemName] = useState('')
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [currentFileName, setCurrentFileName] = useState<string | null>(null)

  const items = Array.isArray(testItems) ? testItems : []
  const selectedItem = items.find((item) => item.id === selectedItemId) || null

  const handleAddTestItem = () => {
    if (!newItemName.trim()) {
      toast.error('Veuillez entrer un nom d\'article de test')
      return
    }

    const newItem: TestItem = {
      id: generateId(),
      name: newItemName,
      prerequisites: [],
      requirements: [],
      createdAt: Date.now()
    }

    setTestItems((current) => {
      const currentItems = Array.isArray(current) ? current : []
      return [...currentItems, newItem]
    })
    setSelectedItemId(newItem.id)
    setNewItemName('')
    setIsAddDialogOpen(false)
    toast.success('Article de test créé')
  }

  const handleDeleteTestItem = (itemId: string) => {
    setTestItems((current) => {
      const currentItems = Array.isArray(current) ? current : []
      return currentItems.filter((item) => item.id !== itemId)
    })
    if (selectedItemId === itemId) {
      setSelectedItemId(null)
    }
    toast.success('Article de test supprimé')
  }

  const handleAddRequirement = () => {
    if (!selectedItemId) return

    const newRequirement: TestRequirement = {
      id: generateId(),
      content: '',
      images: [],
      criteria: [],
      createdAt: Date.now()
    }

    setTestItems((current) => {
      const currentItems = Array.isArray(current) ? current : []
      return currentItems.map((item) =>
        item.id === selectedItemId
          ? { ...item, requirements: [...item.requirements, newRequirement] }
          : item
      )
    })
    toast.success('Exigence ajoutée')
  }

  const handleUpdateRequirement = (requirementId: string, updated: TestRequirement) => {
    if (!selectedItemId) return

    setTestItems((current) => {
      const currentItems = Array.isArray(current) ? current : []
      return currentItems.map((item) =>
        item.id === selectedItemId
          ? {
              ...item,
              requirements: item.requirements.map((req) =>
                req.id === requirementId ? updated : req
              )
            }
          : item
      )
    })
  }

  const handleUpdatePrerequisites = (prerequisites: Prerequisite[]) => {
    if (!selectedItemId) return

    setTestItems((current) => {
      const currentItems = Array.isArray(current) ? current : []
      return currentItems.map((item) =>
        item.id === selectedItemId ? { ...item, prerequisites } : item
      )
    })
  }

  const handleDeleteRequirement = (requirementId: string) => {
    if (!selectedItemId) return

    setTestItems((current) => {
      const currentItems = Array.isArray(current) ? current : []
      return currentItems.map((item) =>
        item.id === selectedItemId
          ? {
              ...item,
              requirements: item.requirements.filter((req) => req.id !== requirementId)
            }
          : item
      )
    })
    toast.success('Exigence supprimée')
  }

  const handleSave = async () => {
    try {
      const fileName = await saveNotebookWithDialog(items, currentFileName || undefined)
      if (fileName) {
        setCurrentFileName(fileName)
        toast.success('Document sauvegardé avec succès')
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Échec de la sauvegarde')
    }
  }

  const handleLoad = async () => {
    try {
      const result = await loadNotebookWithDialog()
      if (result) {
        setTestItems(result.notebook.items)
        setCurrentFileName(result.fileName)
        setSelectedItemId(null)
        toast.success('Document chargé avec succès')
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Échec du chargement')
    }
  }

  const handleNewDocument = () => {
    if (items.length > 0) {
      const confirmed = window.confirm(
        'Voulez-vous créer un nouveau document? Les modifications non sauvegardées seront perdues.'
      )
      if (!confirmed) return
    }
    setTestItems([])
    setCurrentFileName(null)
    setSelectedItemId(null)
    toast.success('Nouveau document créé')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/30 to-background">
      <Toaster position="top-right" richColors />
      
      <div className="container mx-auto p-2 md:p-3 max-w-[1800px]">
        <header className="mb-4">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="relative">
              <div className="absolute -left-2 top-0 bg-accent text-accent-foreground px-2 py-0.5 rounded text-xs font-mono font-semibold">
                v1.0.0
              </div>
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-1">
                Cahier d'Essais
              </h1>
              <p className="text-muted-foreground">
                Documentation QA Logiciel & Suivi des Tests
              </p>
              {currentFileName && (
                <p className="text-sm text-primary font-mono mt-1 flex items-center gap-1.5">
                  <File size={14} weight="fill" />
                  {currentFileName}
                </p>
              )}
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={handleNewDocument}>
                <File className="mr-1.5" weight="duotone" />
                Nouveau
              </Button>
              <Button variant="outline" onClick={handleLoad}>
                <FolderOpen className="mr-1.5" weight="duotone" />
                Charger
              </Button>
              <Button variant="outline" onClick={handleSave} disabled={items.length === 0}>
                <FloppyDisk className="mr-1.5" weight="duotone" />
                Sauvegarder
              </Button>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-1">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-semibold">Articles de Test</h2>
              <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogTrigger asChild>
                  <Button size="sm">
                    <Plus weight="bold" className="mr-1.5" />
                    Ajouter
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Ajouter un Article de Test</DialogTitle>
                    <DialogDescription>
                      Créez un nouvel article de test (end item) pour organiser vos exigences de test.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="py-4">
                    <Input
                      placeholder="ex: Module de Connexion, Barre de Navigation, Processus de Paiement"
                      value={newItemName}
                      onChange={(e) => setNewItemName(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          handleAddTestItem()
                        }
                      }}
                    />
                  </div>
                  <DialogFooter>
                    <Button onClick={handleAddTestItem}>Créer</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>

            <ScrollArea className="h-[calc(100vh-240px)] pr-3">
              {items.length === 0 ? (
                <div className="text-center py-8 px-3 border-2 border-dashed border-border rounded-lg">
                  <FloppyDisk size={48} className="mx-auto mb-3 text-muted-foreground" weight="duotone" />
                  <p className="text-sm text-muted-foreground mb-4">
                    Aucun article de test. Créez votre premier article pour commencer la documentation.
                  </p>
                  <Button size="sm" onClick={() => setIsAddDialogOpen(true)}>
                    <Plus weight="bold" className="mr-1.5" />
                    Créer le Premier Article
                  </Button>
                </div>
              ) : (
                <div className="space-y-2">
                  {items.map((item) => (
                    <TestItemCard
                      key={item.id}
                      item={item}
                      isSelected={selectedItemId === item.id}
                      onClick={() => setSelectedItemId(item.id)}
                      onDelete={() => handleDeleteTestItem(item.id)}
                    />
                  ))}
                </div>
              )}
            </ScrollArea>
          </div>

          <div className="lg:col-span-2">
            {selectedItem ? (
              <>
                <div className="mb-3">
                  <h2 className="text-lg font-semibold mb-1">{selectedItem.name}</h2>
                  <p className="text-sm text-muted-foreground">
                    {selectedItem.prerequisites.length}{' '}
                    {selectedItem.prerequisites.length === 1 ? 'pré-requis' : 'pré-requis'} •{' '}
                    {selectedItem.requirements.length}{' '}
                    {selectedItem.requirements.length === 1 ? 'exigence' : 'exigences'}
                  </p>
                </div>

                <Tabs defaultValue="prerequisites" className="w-full">
                  <TabsList className="grid w-full grid-cols-2 mb-3">
                    <TabsTrigger value="prerequisites">Pré-requis</TabsTrigger>
                    <TabsTrigger value="requirements">Exigences</TabsTrigger>
                  </TabsList>

                  <TabsContent value="prerequisites" className="mt-0">
                    <ScrollArea className="h-[calc(100vh-300px)]">
                      <div className="pr-3">
                        <PrerequisitesSection
                          prerequisites={selectedItem.prerequisites}
                          onUpdate={handleUpdatePrerequisites}
                        />
                      </div>
                    </ScrollArea>
                  </TabsContent>

                  <TabsContent value="requirements" className="mt-0">
                    <div className="flex items-center justify-between mb-3">
                      <p className="text-sm text-muted-foreground">
                        {selectedItem.requirements.length}{' '}
                        {selectedItem.requirements.length === 1 ? 'exigence' : 'exigences'}
                      </p>
                      <Button onClick={handleAddRequirement}>
                        <Plus weight="bold" className="mr-1.5" />
                        Ajouter Exigence
                      </Button>
                    </div>

                    <Separator className="mb-3" />

                    <ScrollArea className="h-[calc(100vh-320px)]">
                      {selectedItem.requirements.length === 0 ? (
                        <div className="text-center py-8 px-3 border-2 border-dashed border-border rounded-lg">
                          <p className="text-sm text-muted-foreground mb-4">
                            Aucune exigence. Ajoutez votre première exigence pour commencer les tests.
                          </p>
                          <Button size="sm" onClick={handleAddRequirement}>
                            <Plus weight="bold" className="mr-1.5" />
                            Ajouter la Première Exigence
                          </Button>
                        </div>
                      ) : (
                        <div className="space-y-3 pr-3">
                          {selectedItem.requirements.map((requirement) => (
                            <RequirementCard
                              key={requirement.id}
                              requirement={requirement}
                              onUpdate={(updated) => handleUpdateRequirement(requirement.id, updated)}
                              onDelete={() => handleDeleteRequirement(requirement.id)}
                            />
                          ))}
                        </div>
                      )}
                    </ScrollArea>
                  </TabsContent>
                </Tabs>
              </>
            ) : (
              <div className="flex items-center justify-center h-[calc(100vh-240px)] border-2 border-dashed border-border rounded-lg">
                <div className="text-center px-4">
                  <p className="text-muted-foreground mb-2">
                    Sélectionnez un article de test pour voir et gérer ses pré-requis et exigences
                  </p>
                  <p className="text-sm text-muted-foreground">
                    ou créez un nouvel article de test pour commencer
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default App