import type { ParsedBikeForm } from '../types'

/**
 * Elenco delle categorie di biciclette valide
 * Utilizzato sia per la lista di opzioni nel form che per la validazione
 */
const allowedBikeCategories = ['MTB', 'Corsa', 'E-Bike', 'City', 'Gravel'] as const

type BikeCategory = (typeof allowedBikeCategories)[number]

/**
 * Converte i dati del FormData in una struttura normalizzata per validazione e creazione/modifica
 * 
 * Funzionalità:
 * - Estrae i dati dal FormData HTML
 * - Normalizza i valori (trim degli spazi bianchi)
 * - Converte i campi numerici mantenendo distinzione tra vuoti e invalidi
 * - Gestisce campi opzionali (cost, description)
 * - Separa il valore string dai dati numerici convertiti per errori di validazione
 * 
 * Gestione:
 * - Campi numerici restituiscono NaN se vuoti (per differenziare da 0)
 * - Il campo cost restituisce undefined se vuoto (è opzionale)
 * - Il checkbox is_active restituisce true/false in base alla sua presenza
 * 
 * @param formData - FormData estratto da un elemento form HTML
 * @returns Oggetto ParsedBikeForm con campi normalizzati e validabili
 */
export const parseBikeForm = (formData: FormData): ParsedBikeForm => {
    // Estrae i valori string dal FormData e normalizza (trim, lowercase per categoria)
    const name = String(formData.get('name') ?? '').trim()
    const category = String(formData.get('category') ?? '').trim()
    const description = String(formData.get('description') ?? '').trim()
    const priceValue = String(formData.get('price') ?? '').trim()
    const costValue = String(formData.get('cost') ?? '').trim()
    const stockValue = String(formData.get('stock_quantity') ?? '').trim()
    const imageUrl = String(formData.get('image_url') ?? '').trim()
    
    // Converte il checkbox: presente (on) = true, assente = false
    const isActive = formData.get('is_active') === 'on'

    /**
     * Conversione campi numerici:
     * - price: NaN se vuoto (obbligatorio), altrimenti numero
     * - cost: undefined se vuoto (opzionale), altrimenti numero
     * - stockQuantity: NaN se vuoto (obbligatorio), altrimenti numero
     */
    const price = priceValue === '' ? Number.NaN : Number(priceValue)
    const cost = costValue === '' ? undefined : Number(costValue)
    const stockQuantity = stockValue === '' ? Number.NaN : Number(stockValue)

    /**
     * Restituisce un oggetto con sia i valori string che i valori convertiti
     * Questo permette di:
     * - Validare basandosi sui valori convertiti
     * - Mostrare all'utente i dati originali se c'è un errore
     * - Inviare al server solo i dati validati e convertiti
     */
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

/**
 * Valida la struttura ParsedBikeForm estratta dal form
 * 
 * Validazioni implementate:
 * - Campi obbligatori: name, category, price, stock_quantity
 * - Categoria: deve essere una delle categorie consentite
 * - Numeri positivi: price > 0, stock_quantity >= 0
 * - Numeri interi: stock_quantity deve essere intero
 * - Cost (opzionale): se presente, >= 0
 * - Image URL: validazione URL format (solo se presente)
 * 
 * @param values - Oggetto ParsedBikeForm da validare
 * @returns Messaggio di errore string se validazione fallisce, null se tutto ok
 */
export const validateBikeForm = (values: ParsedBikeForm): string | null => {
    // Validazione nome: obbligatorio
    if (values.name === '') {
        return 'Il nome e obbligatorio.'
    }

    // Validazione categoria: obbligatorio
    if (values.category === '') {
        return 'La categoria e obbligatoria.'
    }

    // Validazione categoria: deve essere una delle categorie consentite
    if (!allowedBikeCategories.includes(values.category as BikeCategory)) {
        return 'La categoria selezionata non e valida.'
    }

    // Validazione prezzo: obbligatorio
    if (values.priceValue === '') {
        return 'Il prezzo e obbligatorio.'
    }

    // Validazione prezzo: deve essere numero valido e positivo
    if (Number.isNaN(values.price) || values.price <= 0) {
        return 'Il prezzo deve essere un numero maggiore di 0.'
    }

    // Validazione costo (opzionale): se presente, deve essere numero valido e non negativo
    if (values.cost !== undefined && (Number.isNaN(values.cost) || values.cost < 0)) {
        return 'Il costo deve essere un numero maggiore o uguale a 0.'
    }

    // Validazione quantità stock: obbligatorio
    if (values.stockValue === '') {
        return 'La quantita in stock e obbligatoria.'
    }

    // Validazione quantità stock: deve essere intero non negativo
    if (!Number.isInteger(values.stockQuantity) || values.stockQuantity < 0) {
        return 'La quantita in stock deve essere un intero maggiore o uguale a 0.'
    }

    /**
     * Validazione URL immagine (opzionale)
     * Se il campo è presente, valida il formato URL
     */
    if (values.imageUrl) {
        try {
            new URL(values.imageUrl)
        } catch {
            return 'Inserisci un URL valido per l\'immagine.'
        }
    }

    // Se tutte le validazioni passano, ritorna null
    return null
}

/**
 * Esporta l'array di categorie consentite
 * Usato nel form per popolare le opzioni del select
 */
export { allowedBikeCategories }
