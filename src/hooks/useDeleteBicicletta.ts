import { useState } from 'react'
import { fetchBiciclettaDelete } from '../service/api'

/**
 * Opzioni configurabili per l'hook useHardDeleteBicicletta
 */
type HardDeleteOptions = {
  /** Messaggio personalizzato per la conferma dell'eliminazione */
  confirmMessage?: string
  /** Callback eseguito dopo un'eliminazione con successo */
  onSuccess?: (id: number) => void
  /** Callback eseguito in caso di errore durante l'eliminazione */
  onError?: (message: string) => void
}

/**
 * Hook personalizzato per gestire l'eliminazione definitiva (hard delete) di una bicicletta
 * 
 * Funzionalità principali:
 * - Richiede conferma all'utente prima di procedere
 * - Gestisce lo stato di caricamento durante l'operazione
 * - Gestisce gli errori e fornisce messaggi
 * - Previene eliminazioni multiple simultanee
 * - Supporta callback personalizzati per successo/errore
 * 
 * @param options - Opzioni di configurazione dell'hook
 * @returns Oggetto con stato ed handler per l'eliminazione
 */
export const useHardDeleteBicicletta = (options?: HardDeleteOptions) => {
  // Stato per memorizzare eventuali errori durante l'eliminazione
  const [deleteError, setDeleteError] = useState<string | null>(null)
  
  // ID della bicicletta attualmente in fase di eliminazione 
  const [deletingId, setDeletingId] = useState<number | null>(null)

  /**
   * Handler per eliminare definitivamente una bicicletta
   * 
   * 1. Verifica che non ci sia già un'eliminazione in corso
   * 2. Richiede conferma all'utente tramite dialog nativo
   * 3. Se confermato, esegue la richiesta DELETE al server
   * 4. Gestisce successo/errore ed esegue i callback appropriati
   * 
   * @param id - ID della bicicletta da eliminare definitivamente
   */
  const handleDelete = async (id: number) => {
    // Previene eliminazioni multiple simultanee
    if (deletingId !== null) return

    // Richiede conferma all'utente
    const confirmed = confirm(options?.confirmMessage ?? 'Vuoi eliminare definitivamente questa bicicletta?')
    if (!confirmed) return

    // Reset errori precedenti e imposta stato di loading
    setDeleteError(null)
    setDeletingId(id)

    try {
      // Chiamata API per eliminazione definitiva
      await fetchBiciclettaDelete(id)
      // Esegue callback di successo se fornito
      options?.onSuccess?.(id)
    } catch (err: any) {
      // Gestione errore: salva messaggio e esegue callback di errore
      const message = err?.message || "Errore durante l'eliminazione definitiva."
      setDeleteError(message)
      options?.onError?.(message)
    } finally {
      // Rimuove lo stato di loading in ogni caso
      setDeletingId(null)
    }
  }

  /**
   * Ritorna:
   * - deleteError: messaggio di errore se presente
   * - deletingId: ID dell'elemento in fase di eliminazione
   * - isDeleting: flag booleano che indica se un'operazione è in corso
   * - handleDelete: funzione per avviare l'eliminazione
   */
  return {
    deleteError,
    deletingId,
    isDeleting: deletingId !== null,
    handleDelete
  }
}
