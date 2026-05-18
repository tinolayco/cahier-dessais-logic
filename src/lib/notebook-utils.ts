import type { TestNotebook, TestItem } from './types'

export const saveNotebookWithDialog = async (items: TestItem[], currentFileName?: string): Promise<string | null> => {
  const notebook: TestNotebook = {
    version: '1.0',
    items,
    exportedAt: Date.now()
  }

  const dataStr = JSON.stringify(notebook, null, 2)

  try {
    if ('showSaveFilePicker' in window) {
      const options = {
        types: [
          {
            description: 'Fichier Cahier d\'Essais',
            accept: {
              'application/json': ['.json']
            }
          }
        ],
        suggestedName: currentFileName || `cahier-essais-${new Date().toISOString().split('T')[0]}.json`
      }

      const handle = await (window as any).showSaveFilePicker(options)
      const writable = await handle.createWritable()
      await writable.write(dataStr)
      await writable.close()
      
      return handle.name
    } else {
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
  } catch (error) {
    if ((error as any).name === 'AbortError') {
      return null
    }
    throw error
  }
}

export const loadNotebookWithDialog = async (): Promise<{ notebook: TestNotebook; fileName: string } | null> => {
  try {
    if ('showOpenFilePicker' in window) {
      const options = {
        types: [
          {
            description: 'Fichier Cahier d\'Essais',
            accept: {
              'application/json': ['.json']
            }
          }
        ],
        multiple: false
      }

      const [handle] = await (window as any).showOpenFilePicker(options)
      const file = await handle.getFile()
      const content = await file.text()
      const notebook = JSON.parse(content) as TestNotebook

      if (!notebook.version || !Array.isArray(notebook.items)) {
        throw new Error('Format de document invalide')
      }

      return { notebook, fileName: file.name }
    } else {
      return new Promise((resolve, reject) => {
        const input = document.createElement('input')
        input.type = 'file'
        input.accept = '.json'
        
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

        input.oncancel = () => resolve(null)
        input.click()
      })
    }
  } catch (error) {
    if ((error as any).name === 'AbortError') {
      return null
    }
    throw error
  }
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
