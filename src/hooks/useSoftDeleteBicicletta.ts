import { useState } from 'react'
import { softDeleteBicicletta } from '../service/api'

/**
 * Opzioni configurabili per l'hook useSoftDeleteBicicletta
 */
type SoftDeleteOptions = {
  /** Messaggio personalizzato per la conferma dell'eliminazione */
  confirmMessage?: string
  /** Callback eseguito dopo un'eliminazione con successo */
  onSuccess?: (id: number) => void
  /** Callback eseguito in caso di errore durante l'eliminazione */
  onError?: (message: string) => void
}

/**
 * Hook personalizzato per gestire l'eliminazione soft (disattivazione) di una bicicletta
 * 
 * Il soft delete non rimuove permanentemente la bicicletta dal database,
 * ma la disattiva impostando is_active = false, rendendola non visibile nel catalogo.
 * La bicicletta può essere successivamente ripristinata.
 * 
 * Funzionalità principali:
 * - Disattiva biciclette senza eliminarle definitivamente
 * - Richiede conferma all'utente prima di procedere
 * - Verifica che la bicicletta sia attiva prima di procedere
 * - Gestisce lo stato di caricamento durante l'operazione
 * - Gestisce gli errori e fornisce messaggi descrittivi
 * - Previene eliminazioni multiple simultanee
 * - Supporta callback personalizzati per successo/errore
 * 
 * @param options - Opzioni di configurazione dell'hook
 * @returns Oggetto con stato ed handler per l'eliminazione soft
 */
export const useSoftDeleteBicicletta = (options?: SoftDeleteOptions) => {
  // Stato per memorizzare eventuali errori durante l'eliminazione
  const [deleteError, setDeleteError] = useState<string | null>(null)
  
  // ID della bicicletta attualmente in fase di eliminazione
  const [deletingId, setDeletingId] = useState<number | null>(null)

  /**
   * Handler per disattivare (soft delete) una bicicletta
   * 
   * 1. Verifica che la bicicletta sia attiva e non ci sia già un'eliminazione in corso
   * 2. Richiede conferma all'utente tramite dialog nativo
   * 3. Se confermato, esegue la richiesta PUT al server per impostare is_active = false
   * 4. Gestisce successo/errore ed esegue i callback appropriati
   * 
   * @param id - ID della bicicletta da disattivare
   * @param isActive - Flag che indica se la bicicletta è attualmente attiva (default: true)
   */
  const handleDelete = async (id: number, isActive = true) => {
    // Previene eliminazioni di biciclette già disattivate o eliminazioni multiple simultanee
    if (!isActive || deletingId !== null) return

    // Richiede conferma all'utente
    const confirmed = confirm(options?.confirmMessage ?? 'Sei sicuro di voler eliminare questa bicicletta?')
    if (!confirmed) return

    // Reset errori precedenti e imposta stato di loading
    setDeleteError(null)
    setDeletingId(id)

    try {
      // Chiamata API per soft delete (imposta is_active = false)
      await softDeleteBicicletta(id)
      // Esegue callback di successo se fornito
      options?.onSuccess?.(id)
    } catch (err: any) {
      // Gestione errore: salva messaggio e esegue callback di errore
      const message = err?.message || 'Errore durante l\'eliminazione.'
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
   * - handleDelete: funzione per avviare l'eliminazione soft
   */
  return {
    deleteError,
    deletingId,
    isDeleting: deletingId !== null,
    handleDelete
  }
}
