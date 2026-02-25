import '../../styles/aggiungi-modificaBici.css'
import '../../styles/afterLogin.css'
import { useState, type FormEvent } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { fetchBiciclettaById, fetchBiciclettaUpdate } from '../../service/api'
import type { Bicicletta } from '../../types'
import { parseBikeForm, validateBikeForm } from '../../utils/bikeForm'

/**
 * Componente ModificaBici
 * Pagina per modificare i dettagli di una bicicletta.
 */
export const ModificaBici = () => {
    const { id } = useParams<{ id: string }>()
    const navigate = useNavigate()

    const [isSubmitting, setIsSubmitting] = useState(false)
    const [errorMessage, setErrorMessage] = useState<string | null>(null)

    // Carica i dati correnti della bicicletta da modificare.
    const { data: bicicletta, isLoading, error } = useQuery({
        queryKey: ['bicicletta', id],
        queryFn: () => {
            if (!id) throw new Error('ID non valido')
            return fetchBiciclettaById(Number(id))
        },
        enabled: !!id,
        retry: false
    })

    // Costruisce un payload solo con i campi realmente cambiati.
    const buildUpdatePayload = (parsed: ReturnType<typeof parseBikeForm>, current: Bicicletta): Partial<Bicicletta> => {
        const payload: Partial<Bicicletta> = {}

        if (parsed.name !== current.name) {
            payload.name = parsed.name
        }

        if (parsed.category !== current.category) {
            payload.category = parsed.category
        }

        const currentDescription = current.description ?? ''
        if (parsed.description !== currentDescription) {
            payload.description = parsed.description === '' ? undefined : parsed.description
        }

        if (!Number.isNaN(parsed.price) && parsed.price !== current.price) {
            payload.price = parsed.price
        }

        const currentCost = current.cost ?? undefined
        if (parsed.cost !== currentCost) {
            payload.cost = parsed.cost
        }

        if (!Number.isNaN(parsed.stockQuantity) && parsed.stockQuantity !== current.stock_quantity) {
            payload.stock_quantity = parsed.stockQuantity
        }

        if (parsed.imageUrl !== current.image_url) {
            payload.image_url = parsed.imageUrl
        }

        if (parsed.isActive !== current.is_active) {
            payload.is_active = parsed.isActive
        }

        return payload
    }

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()

        if (isSubmitting || !bicicletta || !id) return

        setErrorMessage(null)
        setIsSubmitting(true)

        // Validazione condivise con il form di aggiunta.
        const formData = new FormData(event.currentTarget)
        const parsed = parseBikeForm(formData)
        const validationError = validateBikeForm(parsed)

        if (validationError) {
            setErrorMessage(validationError)
            setIsSubmitting(false)
            return
        }

        const payload = buildUpdatePayload(parsed, bicicletta)

        if (Object.keys(payload).length === 0) {
            setErrorMessage('Nessuna modifica da salvare.')
            setIsSubmitting(false)
            return
        }

        try {
            await fetchBiciclettaUpdate(Number(id), payload)
            navigate('/listaBici')
        } catch (err: any) {
            setErrorMessage(err?.message || 'Errore durante il salvataggio.')
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className='pagina'>
            <div className='header'>
                <h1>Modifica Bicicletta</h1>
            </div>
            <div className='body'>
                <div className='body__container'>
                    <div className='aggiungiBici'>
                        
                        <p>Modifica il form per modificare la bicicletta del catalogo.</p>

                        {isLoading && (
                            <div className='aggiungiBici__form-info'>Caricamento dati bicicletta...</div>
                        )}

                        {error && (
                            <div className='aggiungiBici__form-error'>
                                {error instanceof Error ? error.message : 'Errore nel caricamento.'}
                            </div>
                        )}

                        {bicicletta && (
                        <form className='aggiungiBici__form' onSubmit={handleSubmit} noValidate>
                            {errorMessage && (
                                <div className='aggiungiBici__form-error'>
                                    {errorMessage}
                                </div>
                            )}
                            {/* Nome - Obbligatorio */}
                            <div className='aggiungiBici__form-group'>
                                <label htmlFor='name'>
                                    Nome 
                                </label>
                                <input 
                                    type='text' 
                                    id='name' 
                                    name='name' 
                                    placeholder='Inserisci il nome della bicicletta'
                                    defaultValue={bicicletta.name}
                                    required 
                                />
                            </div>

                            {/* Categoria - Obbligatorio */}
                            <div className='aggiungiBici__form-group'>
                                <label htmlFor='category'>
                                    Categoria 
                                </label>
                                <select id='category' name='category' defaultValue={bicicletta.category} required>
                                    <option value=''>Seleziona una categoria</option>
                                    <option value='MTB'>MTB</option>
                                    <option value='Corsa'>Corsa</option>
                                    <option value='E-Bike'>E-Bike</option>
                                    <option value='City'>City</option>
                                    <option value='Gravel'>Gravel</option>
                                </select>
                            </div>

                            {/* Descrizione - Opzionale */}
                            <div className='aggiungiBici__form-group'>
                                <label htmlFor='description'>Descrizione</label>
                                <textarea 
                                    id='description' 
                                    name='description' 
                                    placeholder='Inserisci una descrizione dettagliata della bicicletta'
                                    defaultValue={bicicletta.description ?? ''}
                                />
                            </div>

                            {/* Prezzo e Costo */}
                            <div className='aggiungiBici__form-row'>
                                <div className='aggiungiBici__form-group'>
                                    <label htmlFor='price'>
                                        Prezzo (€) 
                                    </label>
                                    <input 
                                        type='number' 
                                        id='price' 
                                        name='price' 
                                        placeholder='0.00'
                                        min='0'
                                        step='0.01'
                                        defaultValue={bicicletta.price}
                                        required 
                                    />
                                    <span className='aggiungiBici__form-help'>Prezzo di vendita al pubblico</span>
                                </div>

                                <div className='aggiungiBici__form-group'>
                                    <label htmlFor='cost'>Costo (€)</label>
                                    <input 
                                        type='number' 
                                        id='cost' 
                                        name='cost' 
                                        placeholder='0.00'
                                        min='0'
                                        step='0.01'
                                        defaultValue={bicicletta.cost ?? ''}
                                    />
                                    <span className='aggiungiBici__form-help'>Costo di acquisto</span>
                                </div>
                            </div>

                            {/* Stock Quantity - Obbligatorio */}
                            <div className='aggiungiBici__form-group'>
                                <label htmlFor='stock_quantity'>
                                    Quantità in Stock 
                                </label>
                                <input 
                                    type='number' 
                                    id='stock_quantity' 
                                    name='stock_quantity' 
                                    placeholder='0'
                                    min='0'
                                    step='1'
                                    defaultValue={bicicletta.stock_quantity}
                                    required 
                                />
                                <span className='aggiungiBici__form-help'>Numero di unità disponibili</span>
                            </div>

                            {/* Image URL - Opzionale */}
                            <div className='aggiungiBici__form-group'>
                                <label htmlFor='image_url'>URL Immagine</label>
                                <input 
                                    type='url' 
                                    id='image_url' 
                                    name='image_url' 
                                    placeholder='https://esempio.com/immagine.jpg'
                                    defaultValue={bicicletta.image_url}
                                />
                                <span className='aggiungiBici__form-help'>Link all'immagine della bicicletta</span>
                            </div>

                            {/* Is Active - Boolean */}
                            <div className='aggiungiBici__form-checkbox'>
                                <input 
                                    type='checkbox' 
                                    id='is_active' 
                                    name='is_active' 
                                    defaultChecked={bicicletta.is_active}
                                />
                                <label htmlFor='is_active'>Bicicletta attiva e visibile nel catalogo</label>
                            </div>

                            {/* Azioni */}
                            <div className='aggiungiBici__form-actions'>
                                <button type='button' className='aggiungiBici__btn aggiungiBici__btn--secondary'
                                    onClick={() => navigate('/listaBici')}
                                >
                                    Annulla
                                </button>
                                <button type='submit' className='aggiungiBici__btn aggiungiBici__btn--primary'>
                                    Salva modifiche
                                </button>
                            </div>
                        </form>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}