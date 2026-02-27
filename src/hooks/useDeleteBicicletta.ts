import { useState } from 'react'
import { fetchBiciclettaDelete } from '../service/api'

type HardDeleteOptions = {
  confirmMessage?: string
  onSuccess?: (id: number) => void
  onError?: (message: string) => void
}

export const useHardDeleteBicicletta = (options?: HardDeleteOptions) => {
  const [deleteError, setDeleteError] = useState<string | null>(null)
  const [deletingId, setDeletingId] = useState<number | null>(null)

  const handleDelete = async (id: number) => {
    if (deletingId !== null) return

    const confirmed = confirm(options?.confirmMessage ?? 'Vuoi eliminare definitivamente questa bicicletta?')
    if (!confirmed) return

    setDeleteError(null)
    setDeletingId(id)

    try {
      await fetchBiciclettaDelete(id)
      options?.onSuccess?.(id)
    } catch (err: any) {
      const message = err?.message || "Errore durante l'eliminazione definitiva."
      setDeleteError(message)
      options?.onError?.(message)
    } finally {
      setDeletingId(null)
    }
  }

  return {
    deleteError,
    deletingId,
    isDeleting: deletingId !== null,
    handleDelete
  }
}
