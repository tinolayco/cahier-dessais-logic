import type { TestNotebook, TestItem } from './types'

export const saveNotebookWithDialog = async (items: TestItem[], currentFileName?: string): Promise<string | null> => {
  const notebook: TestNotebook = {
    version: '1.0',
    items,
    exportedAt: Date.now()
  }

  const dataStr = JSON.stringify(notebook, null, 2)

  const blob = new Blob([dataStr], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = currentFileName || `cahier-essais-${new Date().toISOString().split('T')[0]}.json`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
  
  return link.download
}

export const loadNotebookWithDialog = async (): Promise<{ notebook: TestNotebook; fileName: string } | null> => {
  return new Promise((resolve, reject) => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = '.json,application/json'
    
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (!file) {
        resolve(null)
        return
      }

      try {
        const content = await file.text()
        const notebook = JSON.parse(content) as TestNotebook

        if (!notebook.version || !Array.isArray(notebook.items)) {
          reject(new Error('Format de document invalide'))
          return
        }

        resolve({ notebook, fileName: file.name })
      } catch (error) {
        reject(new Error('Échec de la lecture du fichier JSON'))
      }
    }

    input.click()
  })
}

export const imageToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    if (file.size > 2 * 1024 * 1024) {
      reject(new Error('La taille de l\'image dépasse la limite de 2Mo'))
      return
    }
    
    const reader = new FileReader()
    reader.onload = (e) => {
      resolve(e.target?.result as string)
    }
    reader.onerror = () => reject(new Error('Échec de la lecture de l\'image'))
    reader.readAsDataURL(file)
  })
}

export const generateId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}
