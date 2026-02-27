import { useState } from 'react'
import { restoreBicicletta } from '../service/api'

/**
 * Opzioni configurabili per l'hook useRestoreBicicletta
 */
type RestoreOptions = {
  /** Messaggio personalizzato per la conferma del ripristino */
  confirmMessage?: string
  /** Callback eseguito dopo un ripristino con successo */
  onSuccess?: (id: number) => void
  /** Callback eseguito in caso di errore durante il ripristino */
  onError?: (message: string) => void
}

/**
 * Hook personalizzato per gestire il ripristino di una bicicletta disattivata
 * 
 * Funzionalità principali:
 * - Riattiva biciclette precedentemente disattivate (soft delete)
 * - Richiede conferma all'utente prima di procedere
 * - Gestisce lo stato di caricamento durante l'operazione
 * - Gestisce gli errori e fornisce messaggi descrittivi
 * - Previene ripristini multipli simultanei
 * - Supporta callback personalizzati per successo/errore
 * 
 * @param options - Opzioni di configurazione dell'hook
 * @returns Oggetto con stato ed handler per il ripristino
 */
export const useRestoreBicicletta = (options?: RestoreOptions) => {
  // Stato per memorizzare eventuali errori durante il ripristino
  const [restoreError, setRestoreError] = useState<string | null>(null)
  
  // ID della bicicletta attualmente in fase di ripristino
  const [restoringId, setRestoringId] = useState<number | null>(null)

  /**
   * Handler per ripristinare una bicicletta disattivata
   * 
   * 1. Verifica che non ci sia già un ripristino in corso
   * 2. Richiede conferma all'utente tramite dialog nativo
   * 3. Se confermato, esegue la richiesta PUT al server per impostare is_active = true
   * 4. Gestisce successo/errore ed esegue i callback appropriati
   * 
   * @param id - ID della bicicletta da ripristinare
   */
  const handleRestore = async (id: number) => {
    // Previene ripristini multipli simultanei
    if (restoringId !== null) return

    // Richiede conferma all'utente
    const confirmed = confirm(options?.confirmMessage ?? 'Vuoi ripristinare questa bicicletta?')
    if (!confirmed) return

    // Reset errori precedenti e imposta stato di loading
    setRestoreError(null)
    setRestoringId(id)

    try {
      // Chiamata API per ripristino (imposta is_active = true)
      await restoreBicicletta(id)
      // Esegue callback di successo se fornito
      options?.onSuccess?.(id)
    } catch (err: any) {
      // Gestione errore: salva messaggio e esegue callback di errore
      const message = err?.message || 'Errore durante il ripristino.'
      setRestoreError(message)
      options?.onError?.(message)
    } finally {
      // Rimuove lo stato di loading in ogni caso
      setRestoringId(null)
    }
  }

  /**
   * Ritorna:
   * - restoreError: messaggio di errore se presente
   * - restoringId: ID dell'elemento in fase di ripristino
   * - isRestoring: flag booleano che indica se un'operazione è in corso
   * - handleRestore: funzione per avviare il ripristino
   */
  return {
    restoreError,
    restoringId,
    isRestoring: restoringId !== null,
    handleRestore
  }
}
