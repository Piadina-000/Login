import type { FetchDataParams, Bicicletta, ApiResponse } from '../types'

const API_BASE_URL = 'https://shiftcaller.it/api/mockup-bike'

const normalizeBike = (item: any): Bicicletta => {
  const rawCost = item?.cost ?? item?.costo

  return {
    id: Number(item?.id ?? item?.id_mockup_bike ?? 0),
    name: String(item?.name ?? item?.nome ?? ''),
    category: String(item?.category ?? item?.categoria ?? ''),
    price: Number(item?.price ?? item?.prezzo ?? 0),
    cost: rawCost === undefined || rawCost === null ? undefined : Number(rawCost),
    stock_quantity: Number(item?.stock_quantity ?? item?.stock ?? item?.quantita ?? 0),
    is_active: Boolean(item?.is_active ?? item?.attiva ?? item?.visibile ?? false),
    image_url: String(item?.image_url ?? item?.immagine ?? ''),
    description: item?.description ?? item?.descrizione ?? undefined
  }
}

export const fetchBiciclette = async ({ page, size }: FetchDataParams): Promise<ApiResponse<Bicicletta>> => {
  try {
    const response = await fetch(`${API_BASE_URL}?page=${page}&per_page=${size}`)

    if (!response.ok) {
      throw new Error(`Errore server: ${response.status}`)
    }

    const result: any = await response.json()

    const rawData = Array.isArray(result?.data)
      ? result.data
      : Array.isArray(result?.data?.data)
        ? result.data.data
        : []

    const data = rawData.map(normalizeBike)

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
 * creazioene di una nuova bicicletta con i dati forniti
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

    const result: any = await response.json().catch(() => null)

    if (!response.ok) {
      const message = result?.message || result?.error || `Errore server: ${response.status}`
      throw new Error(message)
    }

    const bikeData = result?.data || result

    return normalizeBike(bikeData)
  } catch (err: any) {
    console.error('createBicicletta error', err)
    throw err
  }
}

/**
 * Recupera i dettagli di una singola bicicletta secondo l'ID
 */
export const fetchBiciclettaById = async (id: number): Promise<Bicicletta> => {
  try {
    const response = await fetch(`${API_BASE_URL}/${id}`)

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
 * Modifica di una bicicletta esistente con i dati forniti
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



