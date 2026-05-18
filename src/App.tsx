import { useState, useRef } from 'react'
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
import { Plus, DownloadSimple, UploadSimple, FloppyDisk } from '@phosphor-icons/react'
import { toast, Toaster } from 'sonner'
import { TestItemCard } from '@/components/TestItemCard'
import { RequirementCard } from '@/components/RequirementCard'
import { PrerequisitesSection } from '@/components/PrerequisitesSection'
import { exportNotebook, importNotebook, generateId } from '@/lib/notebook-utils'
import type { TestItem, TestRequirement, Prerequisite } from '@/lib/types'

function App() {
  const [testItems, setTestItems] = useKV<TestItem[]>('test-items', [])
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null)
  const [newItemName, setNewItemName] = useState('')
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const items = Array.isArray(testItems) ? testItems : []
  const selectedItem = items.find((item) => item.id === selectedItemId)

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

  const handleExport = () => {
    exportNotebook(items)
    toast.success('Cahier d\'essais exporté')
  }

  const handleImportClick = () => {
    fileInputRef.current?.click()
  }

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      const notebook = await importNotebook(file)
      setTestItems(notebook.items)
      setSelectedItemId(null)
      toast.success('Cahier d\'essais importé avec succès')
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Échec de l\'importation')
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/30 to-background">
      <Toaster position="top-right" richColors />
      
      <div className="container mx-auto p-4 md:p-6 max-w-7xl">
        <header className="mb-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-1">
                Cahier d'Essais
              </h1>
              <p className="text-muted-foreground">
                Documentation QA Logiciel & Suivi des Tests
              </p>
            </div>
            <div className="flex gap-2">
              <input
                ref={fileInputRef}
                type="file"
                accept=".json"
                onChange={handleImport}
                className="hidden"
              />
              <Button variant="outline" onClick={handleImportClick}>
                <UploadSimple className="mr-1.5" weight="duotone" />
                Importer
              </Button>
              <Button variant="outline" onClick={handleExport} disabled={items.length === 0}>
                <DownloadSimple className="mr-1.5" weight="duotone" />
                Exporter
              </Button>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Articles de Test</h2>
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

            <ScrollArea className="h-[calc(100vh-280px)] pr-4">
              {items.length === 0 ? (
                <div className="text-center py-12 px-4 border-2 border-dashed border-border rounded-lg">
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
                <div className="space-y-3">
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
                <div className="mb-4">
                  <h2 className="text-xl font-semibold mb-1">{selectedItem.name}</h2>
                  <p className="text-sm text-muted-foreground">
                    {selectedItem.prerequisites.length}{' '}
                    {selectedItem.prerequisites.length === 1 ? 'pré-requis' : 'pré-requis'} •{' '}
                    {selectedItem.requirements.length}{' '}
                    {selectedItem.requirements.length === 1 ? 'exigence' : 'exigences'}
                  </p>
                </div>

                <Tabs defaultValue="prerequisites" className="w-full">
                  <TabsList className="grid w-full grid-cols-2 mb-4">
                    <TabsTrigger value="prerequisites">Pré-requis</TabsTrigger>
                    <TabsTrigger value="requirements">Exigences</TabsTrigger>
                  </TabsList>

                  <TabsContent value="prerequisites" className="mt-0">
                    <ScrollArea className="h-[calc(100vh-340px)]">
                      <div className="pr-4">
                        <PrerequisitesSection
                          prerequisites={selectedItem.prerequisites}
                          onUpdate={handleUpdatePrerequisites}
                        />
                      </div>
                    </ScrollArea>
                  </TabsContent>

                  <TabsContent value="requirements" className="mt-0">
                    <div className="flex items-center justify-between mb-4">
                      <p className="text-sm text-muted-foreground">
                        {selectedItem.requirements.length}{' '}
                        {selectedItem.requirements.length === 1 ? 'exigence' : 'exigences'}
                      </p>
                      <Button onClick={handleAddRequirement}>
                        <Plus weight="bold" className="mr-1.5" />
                        Ajouter Exigence
                      </Button>
                    </div>

                    <Separator className="mb-4" />

                    <ScrollArea className="h-[calc(100vh-360px)]">
                      {selectedItem.requirements.length === 0 ? (
                        <div className="text-center py-12 px-4 border-2 border-dashed border-border rounded-lg">
                          <p className="text-sm text-muted-foreground mb-4">
                            Aucune exigence. Ajoutez votre première exigence pour commencer les tests.
                          </p>
                          <Button size="sm" onClick={handleAddRequirement}>
                            <Plus weight="bold" className="mr-1.5" />
                            Ajouter la Première Exigence
                          </Button>
                        </div>
                      ) : (
                        <div className="space-y-4 pr-4">
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
              <div className="flex items-center justify-center h-[calc(100vh-280px)] border-2 border-dashed border-border rounded-lg">
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