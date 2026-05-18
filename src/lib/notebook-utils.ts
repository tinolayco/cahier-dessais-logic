import type { TestNotebook, TestItem } from './types'

export const exportNotebook = (items: TestItem[]): void => {
  const notebook: TestNotebook = {
    version: '1.0',
    items,
    exportedAt: Date.now()
  }

  const dataStr = JSON.stringify(notebook, null, 2)
  const dataBlob = new Blob([dataStr], { type: 'application/json' })
  const url = URL.createObjectURL(dataBlob)
  const link = document.createElement('a')
  link.href = url
  link.download = `test-notebook-${new Date().toISOString().split('T')[0]}.json`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

export const importNotebook = (file: File): Promise<TestNotebook> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string
        const notebook = JSON.parse(content) as TestNotebook
        
        if (!notebook.version || !Array.isArray(notebook.items)) {
          reject(new Error('Invalid notebook format'))
          return
        }
        
        resolve(notebook)
      } catch (error) {
        reject(new Error('Failed to parse JSON file'))
      }
    }
    reader.onerror = () => reject(new Error('Failed to read file'))
    reader.readAsText(file)
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
