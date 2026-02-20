import type { FetchDataParams, Bicicletta, ApiResponse } from '../types'

const API_BASE_URL = 'https://shiftcaller.it/api/mockup-bike'

const normalizeBike = (item: any): Bicicletta => ({
  id: Number(item?.id ?? item?.id_mockup_bike ?? 0),
  name: String(item?.name ?? item?.nome ?? ''),
  category: String(item?.category ?? item?.categoria ?? ''),
  price: Number(item?.price ?? item?.prezzo ?? 0),
  stock_quantity: Number(item?.stock_quantity ?? item?.stock ?? item?.quantita ?? 0),
  is_active: Boolean(item?.is_active ?? item?.attiva ?? item?.visibile ?? false),
  image_url: String(item?.image_url ?? item?.immagine ?? '')
})

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
