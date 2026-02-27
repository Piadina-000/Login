import { useState } from 'react'
import { softDeleteBicicletta } from '../service/api'

type SoftDeleteOptions = {
  confirmMessage?: string
  onSuccess?: (id: number) => void
  onError?: (message: string) => void
}

export const useSoftDeleteBicicletta = (options?: SoftDeleteOptions) => {
  const [deleteError, setDeleteError] = useState<string | null>(null)
  const [deletingId, setDeletingId] = useState<number | null>(null)

  const handleDelete = async (id: number, isActive = true) => {
    if (!isActive || deletingId !== null) return

    const confirmed = confirm(options?.confirmMessage ?? 'Sei sicuro di voler eliminare questa bicicletta?')
    if (!confirmed) return

    setDeleteError(null)
    setDeletingId(id)

    try {
      await softDeleteBicicletta(id)
      options?.onSuccess?.(id)
    } catch (err: any) {
      const message = err?.message || 'Errore durante l\'eliminazione.'
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
