import { useState } from 'react'
import { restoreBicicletta } from '../service/api'

type RestoreOptions = {
  confirmMessage?: string
  onSuccess?: (id: number) => void
  onError?: (message: string) => void
}

export const useRestoreBicicletta = (options?: RestoreOptions) => {
  const [restoreError, setRestoreError] = useState<string | null>(null)
  const [restoringId, setRestoringId] = useState<number | null>(null)

  const handleRestore = async (id: number) => {
    if (restoringId !== null) return

    const confirmed = confirm(options?.confirmMessage ?? 'Vuoi ripristinare questa bicicletta?')
    if (!confirmed) return

    setRestoreError(null)
    setRestoringId(id)

    try {
      await restoreBicicletta(id)
      options?.onSuccess?.(id)
    } catch (err: any) {
      const message = err?.message || 'Errore durante il ripristino.'
      setRestoreError(message)
      options?.onError?.(message)
    } finally {
      setRestoringId(null)
    }
  }

  return {
    restoreError,
    restoringId,
    isRestoring: restoringId !== null,
    handleRestore
  }
}
