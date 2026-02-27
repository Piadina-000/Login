import type { FetchDataParams, Bicicletta, ApiResponse } from '../types'

// URL base dell'API mock usata dall'app
const API_BASE_URL = 'https://shiftcaller.it/api/mockup-bike'

/**
 * Normalizza un oggetto bicicletta proveniente dall'API
 * 
 * Gestisce:
 * - Campi con nomi multipli (es. name/nome, category/categoria)
 * - Valori opzionali (cost, description)
 * - Conversioni di tipo (Number, String, Boolean)
 * - Valori di fallback per campi mancanti
 * 
 * @param item - Oggetto raw proveniente dall'API
 * @returns Oggetto Bicicletta normalizzato e type-safe
 */
const normalizeBike = (item: any): Bicicletta => {
  // Gestisce il campo costo che potrebbe essere chiamato 'cost' o 'costo'
  const rawCost = item?.cost ?? item?.costo

  return {
    // ID: gestisce id, id_mockup_bike o fallback a 0
    id: Number(item?.id ?? item?.id_mockup_bike ?? 0),
    // Nome: gestisce name o nome
    name: String(item?.name ?? item?.nome ?? ''),
    // Categoria: gestisce category o categoria
    category: String(item?.category ?? item?.categoria ?? ''),
    // Prezzo: gestisce price o prezzo
    price: Number(item?.price ?? item?.prezzo ?? 0),
    // Costo: campo opzionale, undefined se non presente
    cost: rawCost === undefined || rawCost === null ? undefined : Number(rawCost),
    // Quantità in stock: gestisce stock_quantity, stock o quantita
    stock_quantity: Number(item?.stock_quantity ?? item?.stock ?? item?.quantita ?? 0),
    // Flag attivo: gestisce is_active, attiva o visibile
    is_active: Boolean(item?.is_active ?? item?.attiva ?? item?.visibile ?? false),
    // URL immagine: gestisce image_url o immagine
    image_url: String(item?.image_url ?? item?.immagine ?? ''),
    // Descrizione: campo opzionale, undefined se non presente
    description: item?.description ?? item?.descrizione ?? undefined
  }
}

/**
 * Recupera una lista paginata di biciclette dall'API
 * 
 * Funzionalità:
 * - Supporta paginazione con page
 * - Normalizza i dati di tutte le biciclette ricevute
 * - Gestisce diverse strutture di risposta dell'API
 * - Calcola automaticamente se ci sono altre pagine disponibili
 * - Gestisce errori di rete e del server
 * 
 * @param params - Parametri di paginazione (page, size)
 * @returns Promise con array di biciclette normalizzate e flag hasMore
 * @throws Error se la richiesta fallisce o il server restituisce un errore
 */
export const fetchBiciclette = async ({ page, size }: FetchDataParams): Promise<ApiResponse<Bicicletta>> => {
  try {
    const response = await fetch(`${API_BASE_URL}?page=${page}&per_page=${size}`)

    if (!response.ok) {
      throw new Error(`Errore server: ${response.status}`)
    }

    const result: any = await response.json()

    // Estrae l'array di dati gestendo diverse strutture di risposta
    // Può essere in result.data o result.data.data
    const rawData = Array.isArray(result?.data)
      ? result.data
      : Array.isArray(result?.data?.data)
        ? result.data.data
        : []

    // Normalizza ogni bicicletta ricevuta
    const data = rawData.map(normalizeBike)

    // Estrae informazioni di paginazione per calcolare hasMore
    const currentPage = Number(result?.current_page ?? result?.data?.current_page ?? page)
    const lastPage = Number(result?.last_page ?? result?.data?.last_page ?? currentPage)
    const hasMore = currentPage < lastPage

    return {
      data,
      hasMore
    }
  } catch (err: any) {
    console.error('fetchBiciclette error', err)
    throw err
  }
}

/**
 * Crea una nuova bicicletta nel catalogo
 * 
 * Invia una richiesta POST all'API con i dati della nuova bicicletta.
 * L'ID viene generato automaticamente dal server.
 * 
 * @param payload - Dati della bicicletta da creare (senza ID)
 * @returns Promise con la bicicletta creata (incluso l'ID assegnato dal server)
 * @throws Error se la richiesta fallisce, con messaggio dal server o generico
 */
export const createBicicletta = async (payload: Omit<Bicicletta, 'id'>): Promise<Bicicletta> => {
  try {
    const response = await fetch(API_BASE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    })

    // Prova a parsare la risposta JSON, fallback a null se non è JSON valido
    const result: any = await response.json().catch(() => null)

    // Se la risposta non è OK, estrae il messaggio di errore e lancia un'eccezione
    if (!response.ok) {
      const message = result?.message || result?.error || `Errore server: ${response.status}`
      throw new Error(message)
    }

    // Estrae i dati della bicicletta creata
    const bikeData = result?.data || result

    return normalizeBike(bikeData)
  } catch (err: any) {
    console.error('createBicicletta error', err)
    throw err
  }
}

/**
 * Recupera i dettagli completi di una singola bicicletta
 * 
 * Esegue una richiesta GET all'endpoint specifico della bicicletta.
 * Utile per visualizzare i dettagli o caricare dati per la modifica.
 * 
 * @param id - ID univoco della bicicletta da recuperare
 * @returns Promise con i dati completi della bicicletta normalizzati
 * @throws Error se la bicicletta non esiste (404) o si verifica un errore del server
 */
export const fetchBiciclettaById = async (id: number): Promise<Bicicletta> => {
  try {
    const response = await fetch(`${API_BASE_URL}/${id}`)

    // Gestione specifica dell'errore 404
    if (response.status === 404) {
      throw new Error('Bicicletta non trovata')
    }

    if (!response.ok) {
      throw new Error(`Errore server: ${response.status}`)
    }

    const result: any = await response.json()

    const bikeData = result?.data || result

    return normalizeBike(bikeData)
  } catch (err: any) {
    console.error('fetchBiciclettaById error', err)
    throw err
  }
}

/**
 * Aggiorna i dati di una bicicletta esistente
 * 
 * Invia una richiesta PUT con i campi da modificare.
 * Solo i campi presenti in updatedData verranno aggiornati.
 * 
 * @param id - ID della bicicletta da aggiornare
 * @param updatedData - Oggetto parziale con solo i campi da modificare
 * @returns Promise con i dati completi della bicicletta aggiornata
 * @throws Error se la bicicletta non esiste (404) o si verifica un errore del server
 */
export const fetchBiciclettaUpdate = async (id: number, updatedData: Partial<Bicicletta>): Promise<Bicicletta> => {
  try {
    const response = await fetch(`${API_BASE_URL}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(updatedData)
    })

    if (response.status === 404) {
      throw new Error('Bicicletta non trovata')
    }

    if (!response.ok) {
      throw new Error(`Errore server: ${response.status}`)
    }

    const result: any = await response.json()

    const bikeData = result?.data || result

    return normalizeBike(bikeData)
  } catch (err: any) {
    console.error('fetchBiciclettaUpdate error', err)
    throw err
  }
}

/**
 * Esegue un soft delete di una bicicletta
 * 
 * Il soft delete non rimuove la bicicletta dal database, ma la rende
 * non visibile nel catalogo impostando is_active = false.
 * La bicicletta può essere successivamente ripristinata.
 * 
 * Internamente usa fetchBiciclettaUpdate per modificare solo il campo is_active.
 * 
 * @param id - ID della bicicletta da disattivare
 * @returns Promise con i dati della bicicletta disattivata
 * @throws Error se la bicicletta non esiste o si verifica un errore del server
 */
export const softDeleteBicicletta = async (id: number): Promise<Bicicletta> => {
  try {
    return await fetchBiciclettaUpdate(id, { is_active: false })
  } catch (err: any) {
    console.error('softDeleteBicicletta error', err)
    throw err
  }
}

/**
 * Ripristina una bicicletta precedentemente disattivata
 * 
 * Riattiva una bicicletta che era stata sottoposta a soft delete,
 * impostando is_active = true e rendendola nuovamente visibile nel catalogo.
 * 
 * @param id - ID della bicicletta da ripristinare
 * @returns Promise con i dati della bicicletta ripristinata
 * @throws Error se la bicicletta non esiste o si verifica un errore del server
 */
export const restoreBicicletta = async (id: number): Promise<Bicicletta> => {
  try {
    return await fetchBiciclettaUpdate(id, { is_active: true })
  } catch (err: any) {
    console.error('restoreBicicletta error', err)
    throw err
  }
}


/**
 * Elimina definitivamente una bicicletta dal database
 * 
 * Esegue un hard delete che rimuove permanentemente la bicicletta.
 * Questa operazione NON può essere annullata.
 * 
 * @param id - ID della bicicletta da eliminare definitivamente
 * @returns Promise<void> - Non restituisce dati, solo conferma dell'operazione
 * @throws Error se la bicicletta non esiste (404) o si verifica un errore del server
 */
export const fetchBiciclettaDelete = async (id: number): Promise<void> => {
  try {
    const response = await fetch(`${API_BASE_URL}/${id}`, {
      method: 'DELETE'
    })

    if (response.status === 404) {
      throw new Error('Bicicletta non trovata')
    }

    if (!response.ok) {
      throw new Error(`Errore server: ${response.status}`)
    }
  } catch (err: any) {
    console.error('fetchBiciclettaDelete error', err)
    throw err
  }
}



