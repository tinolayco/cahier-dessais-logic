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
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { Plus, DownloadSimple, UploadSimple, FloppyDisk } from '@phosphor-icons/react'
import { toast, Toaster } from 'sonner'
import { TestItemCard } from '@/components/TestItemCard'
import { RequirementCard } from '@/components/RequirementCard'
import { exportNotebook, importNotebook, generateId } from '@/lib/notebook-utils'
import type { TestItem, TestRequirement } from '@/lib/types'

function App() {
  const [testItems, setTestItems] = useKV<TestItem[]>('test-items', [])
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null)
  const [newItemName, setNewItemName] = useState('')
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const items = testItems ?? []
  const selectedItem = items.find((item) => item.id === selectedItemId)

  const handleAddTestItem = () => {
    if (!newItemName.trim()) {
      toast.error('Please enter a test item name')
      return
    }

    const newItem: TestItem = {
      id: generateId(),
      name: newItemName,
      requirements: [],
      createdAt: Date.now()
    }

    setTestItems((current) => [...(current ?? []), newItem])
    setSelectedItemId(newItem.id)
    setNewItemName('')
    setIsAddDialogOpen(false)
    toast.success('Test item created')
  }

  const handleDeleteTestItem = (itemId: string) => {
    setTestItems((current) => (current ?? []).filter((item) => item.id !== itemId))
    if (selectedItemId === itemId) {
      setSelectedItemId(null)
    }
    toast.success('Test item deleted')
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

    setTestItems((current) =>
      (current ?? []).map((item) =>
        item.id === selectedItemId
          ? { ...item, requirements: [...item.requirements, newRequirement] }
          : item
      )
    )
    toast.success('Requirement added')
  }

  const handleUpdateRequirement = (requirementId: string, updated: TestRequirement) => {
    if (!selectedItemId) return

    setTestItems((current) =>
      (current ?? []).map((item) =>
        item.id === selectedItemId
          ? {
              ...item,
              requirements: item.requirements.map((req) =>
                req.id === requirementId ? updated : req
              )
            }
          : item
      )
    )
  }

  const handleDeleteRequirement = (requirementId: string) => {
    if (!selectedItemId) return

    setTestItems((current) =>
      (current ?? []).map((item) =>
        item.id === selectedItemId
          ? {
              ...item,
              requirements: item.requirements.filter((req) => req.id !== requirementId)
            }
          : item
      )
    )
    toast.success('Requirement deleted')
  }

  const handleExport = () => {
    exportNotebook(items)
    toast.success('Test notebook exported')
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
      toast.success('Test notebook imported successfully')
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to import')
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
                Test Notebook
              </h1>
              <p className="text-muted-foreground">
                Software QA Documentation & Test Tracking
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
                Import
              </Button>
              <Button variant="outline" onClick={handleExport} disabled={items.length === 0}>
                <DownloadSimple className="mr-1.5" weight="duotone" />
                Export
              </Button>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Test Items</h2>
              <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogTrigger asChild>
                  <Button size="sm">
                    <Plus weight="bold" className="mr-1.5" />
                    Add Item
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add Test Item</DialogTitle>
                    <DialogDescription>
                      Create a new test item (end item) to organize your test requirements.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="py-4">
                    <Input
                      placeholder="e.g., Login Module, Navigation Bar, Checkout Flow"
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
                    <Button onClick={handleAddTestItem}>Create</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>

            <ScrollArea className="h-[calc(100vh-280px)] pr-4">
              {items.length === 0 ? (
                <div className="text-center py-12 px-4 border-2 border-dashed border-border rounded-lg">
                  <FloppyDisk size={48} className="mx-auto mb-3 text-muted-foreground" weight="duotone" />
                  <p className="text-sm text-muted-foreground mb-4">
                    No test items yet. Create your first test item to begin documenting.
                  </p>
                  <Button size="sm" onClick={() => setIsAddDialogOpen(true)}>
                    <Plus weight="bold" className="mr-1.5" />
                    Create First Item
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
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-xl font-semibold">{selectedItem.name}</h2>
                    <p className="text-sm text-muted-foreground">
                      {selectedItem.requirements.length}{' '}
                      {selectedItem.requirements.length === 1 ? 'requirement' : 'requirements'}
                    </p>
                  </div>
                  <Button onClick={handleAddRequirement}>
                    <Plus weight="bold" className="mr-1.5" />
                    Add Requirement
                  </Button>
                </div>

                <Separator className="mb-4" />

                <ScrollArea className="h-[calc(100vh-280px)]">
                  {selectedItem.requirements.length === 0 ? (
                    <div className="text-center py-12 px-4 border-2 border-dashed border-border rounded-lg">
                      <p className="text-sm text-muted-foreground mb-4">
                        No requirements yet. Add your first requirement to start testing.
                      </p>
                      <Button size="sm" onClick={handleAddRequirement}>
                        <Plus weight="bold" className="mr-1.5" />
                        Add First Requirement
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
              </>
            ) : (
              <div className="flex items-center justify-center h-[calc(100vh-280px)] border-2 border-dashed border-border rounded-lg">
                <div className="text-center px-4">
                  <p className="text-muted-foreground mb-2">
                    Select a test item to view and manage its requirements
                  </p>
                  <p className="text-sm text-muted-foreground">
                    or create a new test item to get started
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