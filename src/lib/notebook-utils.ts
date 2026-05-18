import type { TestNotebook, TestItem } from './types'

export const saveNotebookWithDialog = async (items: TestItem[], currentFileName?: string): Promise<string | null> => {
  try {
    const notebook: TestNotebook = {
      version: '1.0',
      items,
      exportedAt: Date.now()
    }

    const dataStr = JSON.stringify(notebook, null, 2)
    
    JSON.parse(dataStr)

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
  } catch (error) {
    console.error('Erreur lors de la sauvegarde:', error)
    throw new Error('Impossible de créer un fichier JSON valide. Vérifiez vos données.')
  }
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
        
        if (!content.trim()) {
          reject(new Error('Le fichier est vide'))
          return
        }

        let notebook: TestNotebook
        try {
          notebook = JSON.parse(content)
        } catch (parseError) {
          console.error('Erreur de parsing JSON:', parseError)
          reject(new Error('Format JSON invalide. Le fichier est corrompu ou mal formé.'))
          return
        }

        if (!notebook.version || !Array.isArray(notebook.items)) {
          reject(new Error('Format de document invalide. Le fichier ne contient pas les données attendues.'))
          return
        }

        notebook.items.forEach(item => {
          if (!Array.isArray(item.prerequisites)) item.prerequisites = []
          if (!Array.isArray(item.requirements)) item.requirements = []
          
          item.requirements.forEach(req => {
            if (!Array.isArray(req.images)) req.images = []
            if (!Array.isArray(req.criteria)) req.criteria = []
          })
          
          item.prerequisites.forEach(prereq => {
            if (!Array.isArray(prereq.images)) prereq.images = []
          })
        })

        resolve({ notebook, fileName: file.name })
      } catch (error) {
        console.error('Erreur lors du chargement:', error)
        reject(new Error(error instanceof Error ? error.message : 'Échec de la lecture du fichier'))
      }
    }

    input.oncancel = () => {
      resolve(null)
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
    
    if (!file.type.startsWith('image/')) {
      reject(new Error('Le fichier doit être une image'))
      return
    }
    
    const reader = new FileReader()
    reader.onload = (e) => {
      const result = e.target?.result as string
      if (result && result.startsWith('data:image/')) {
        resolve(result)
      } else {
        reject(new Error('Format d\'image invalide'))
      }
    }
    reader.onerror = () => reject(new Error('Échec de la lecture de l\'image'))
    reader.readAsDataURL(file)
  })
}

export const generateId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}
