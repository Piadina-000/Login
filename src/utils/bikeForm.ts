import type { ParsedBikeForm } from '../types'

// Elenco delle categorie
const allowedBikeCategories = ['MTB', 'Corsa', 'E-Bike', 'City', 'Gravel'] as const

type BikeCategory = (typeof allowedBikeCategories)[number]

// Converte il FormData in una struttura normalizzata per aggiunta e modifica.
export const parseBikeForm = (formData: FormData): ParsedBikeForm => {
    const name = String(formData.get('name') ?? '').trim()
    const category = String(formData.get('category') ?? '').trim()
    const description = String(formData.get('description') ?? '').trim()
    const priceValue = String(formData.get('price') ?? '').trim()
    const costValue = String(formData.get('cost') ?? '').trim()
    const stockValue = String(formData.get('stock_quantity') ?? '').trim()
    const imageUrl = String(formData.get('image_url') ?? '').trim()
    const isActive = formData.get('is_active') === 'on'

    // Converte i campi numerici mantenendo distinguibili i vuoti.
    const price = priceValue === '' ? Number.NaN : Number(priceValue)
    const cost = costValue === '' ? undefined : Number(costValue)
    const stockQuantity = stockValue === '' ? Number.NaN : Number(stockValue)

    return {
        name,
        category,
        description,
        priceValue,
        costValue,
        stockValue,
        imageUrl,
        isActive,
        price,
        cost,
        stockQuantity
    }
}

// Ritorna il primo errore di validazione, oppure null se tutto ok.
export const validateBikeForm = (values: ParsedBikeForm): string | null => {
    if (values.name === '') {
        return 'Il nome e obbligatorio.'
    }

    if (values.category === '') {
        return 'La categoria e obbligatoria.'
    }

    if (!allowedBikeCategories.includes(values.category as BikeCategory)) {
        return 'La categoria selezionata non e valida.'
    }

    if (values.priceValue === '') {
        return 'Il prezzo e obbligatorio.'
    }

    if (Number.isNaN(values.price) || values.price <= 0) {
        return 'Il prezzo deve essere un numero maggiore di 0.'
    }

    if (values.cost !== undefined && (Number.isNaN(values.cost) || values.cost < 0)) {
        return 'Il costo deve essere un numero maggiore o uguale a 0.'
    }

    if (values.stockValue === '') {
        return 'La quantita in stock e obbligatoria.'
    }

    if (!Number.isInteger(values.stockQuantity) || values.stockQuantity < 0) {
        return 'La quantita in stock deve essere un intero maggiore o uguale a 0.'
    }

    // Valida il formato URL solo se il campo e presente.
    if (values.imageUrl) {
        try {
            new URL(values.imageUrl)
        } catch {
            return 'Inserisci un URL valido per l\'immagine.'
        }
    }

    return null
}

export { allowedBikeCategories }
