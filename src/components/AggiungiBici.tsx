import '../styles/aggiungi-modificaBici.css'
import '../styles/afterLogin.css'
import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { createBicicletta } from '../service/api'
import { parseBikeForm, validateBikeForm } from '../utils/bikeForm'

/**
 * Componente AggiungiBici
 * 
 * Pagina con form per aggiungere una nuova bicicletta al catalogo.
 * 
 * Funzionalità principali:
 * - Form con tutti i campi necessari per creare una bicicletta
 * - Validazione dei campi obbligatori
 * - Gestione stati di invio per evitare duplicazioni
 * - Mostra messaggi di errore di validazione o server
 * - Reindirizzamento automatico alla lista dopo il salvataggio
 */
export const AggiungiBici = () => {

    const navigate = useNavigate()

    // Stato per bloccare invii multipli durante il salvataggio
    const [isSubmitting, setIsSubmitting] = useState(false)

    // Messaggi di errore da mostrare all'utente (validazione o errori server)
    const [errorMessage, setErrorMessage] = useState<string | null>(null)

    // Preview URL dell'immagine
    const [imageUrl, setImageUrl] = useState<string>('')

    /**
     * Gestisce l'invio del form di aggiunta bicicletta
     * 
     * 1. Previene il comportamento di default del form
     * 2. Blocca invii multipli controllando isSubmitting
     * 3. Estrae i valori dal FormData
     * 4. Normalizza e valida i campi usando parseBikeForm e validateBikeForm
     * 5. Se valido, effettua la chiamata API createBicicletta
     * 6. In caso di successo, reindirizza alla lista biciclette
     * 7. In caso di errore, mostra il messaggio all'utente
     */
    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()

        // Evita invii duplicati se già in corso
        if (isSubmitting) return

        // Reset errori precedenti e avvia stato di invio
        setErrorMessage(null)
        setIsSubmitting(true)

        // Estrae e valida i dati del form
        const formData = new FormData(event.currentTarget)
        const parsed = parseBikeForm(formData)
        const validationError = validateBikeForm(parsed)

        // Se la validazione fallisce, mostra l'errore e termina
        if (validationError) {
            setErrorMessage(validationError)
            setIsSubmitting(false)
            return
        }

        // Chiamata API per creare la nuova bicicletta
        try {
            await createBicicletta({
                name: parsed.name,
                category: parsed.category,
                description: parsed.description || undefined,
                price: parsed.price,
                cost: parsed.cost,
                stock_quantity: parsed.stockQuantity,
                image_url: parsed.imageUrl,
                is_active: parsed.isActive
            })

            // Successo: reindirizza alla lista delle biciclette
            navigate('/listaBici')
        } catch (error: any) {
            // Gestione errori server
            setErrorMessage(error?.message || 'Errore durante il salvataggio.')
        } finally {
            // Rimuove lo stato di invio in entrambi i casi (successo/errore)
            setIsSubmitting(false)
        }
    }

    return (
        <div className='pagina'>
            <div className='header'>
                <h1>Aggiungi Nuova Bicicletta</h1>
            </div>
            <div className='body'>
                <div className='body__container'>
                    <div className='aggiungiBici'>
                        
                        <p>Compila il form per aggiungere una nuova bicicletta al catalogo.</p>
                        
                        <form className='aggiungiBici__form' onSubmit={handleSubmit} noValidate>
                            {/* Messaggio di errore validazione o server */}
                            {errorMessage && (
                                <div className='aggiungiBici__form-error'>
                                    {errorMessage}
                                </div>
                            )}
                            {/* Nome - Obbligatorio */}
                            <div className='aggiungiBici__form-group'>
                                <label htmlFor='name'>
                                    Nome <span className='required'>*</span>
                                </label>
                                <input 
                                    type='text' 
                                    id='name' 
                                    name='name' 
                                    placeholder='Inserisci il nome della bicicletta'
                                    required 
                                />
                            </div>

                            {/* Categoria - Obbligatorio */}
                            <div className='aggiungiBici__form-group'>
                                <label htmlFor='category'>
                                    Categoria <span className='required'>*</span>
                                </label>
                                <select id='category' name='category' required>
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
                                />
                            </div>

                            {/* Prezzo e Costo */}
                            <div className='aggiungiBici__form-row'>
                                <div className='aggiungiBici__form-group'>
                                    <label htmlFor='price'>
                                        Prezzo (€) <span className='required'>*</span>
                                    </label>
                                    <input 
                                        type='number' 
                                        id='price' 
                                        name='price' 
                                        placeholder='0.00'
                                        min='0'
                                        step='0.01'
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
                                    />
                                    <span className='aggiungiBici__form-help'>Costo di acquisto</span>
                                </div>
                            </div>

                            {/* Stock Quantity - Obbligatorio */}
                            <div className='aggiungiBici__form-group'>
                                <label htmlFor='stock_quantity'>
                                    Quantità in Stock <span className='required'>*</span>
                                </label>
                                <input 
                                    type='number' 
                                    id='stock_quantity' 
                                    name='stock_quantity' 
                                    placeholder='0'
                                    min='0'
                                    step='1'
                                    required 
                                />
                                <span className='aggiungiBici__form-help'>Numero di unità disponibili</span>
                            </div>

                            {/* Image URL - Opzionale */}
                            <div className='aggiungiBici__form-group'>
                                <label htmlFor='image_url'>URL Immagine</label>
                                <div className='aggiungiBici__image-wrapper'>
                                    <div className='aggiungiBici__image-input-column'>
                                        <input 
                                            type='url' 
                                            id='image_url' 
                                            name='image_url' 
                                            placeholder='https://esempio.com/immagine.jpg'
                                            onChange={(e) => setImageUrl(e.target.value)}
                                        />
                                        <span className='aggiungiBici__form-help'>Link all'immagine della bicicletta</span>
                                    </div>
                                    {imageUrl && (
                                        <div className='aggiungiBici__image-preview-column'>
                                            <img 
                                                src={imageUrl} 
                                                alt='Preview' 
                                                className='aggiungiBici__image-preview'
                                                onError={(e) => {
                                                    (e.target as HTMLImageElement).style.display = 'none'
                                                }}
                                            />
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Is Active - Boolean */}
                            <div className='aggiungiBici__form-checkbox'>
                                <input 
                                    type='checkbox' 
                                    id='is_active' 
                                    name='is_active' 
                                    defaultChecked 
                                />
                                <label htmlFor='is_active'>Bicicletta attiva e visibile nel catalogo</label>
                            </div>

                            {/* Pulsanti di azione: annulla e salva */}
                            <div className='aggiungiBici__form-actions'>
                                <button type='button' className='aggiungiBici__btn aggiungiBici__btn--secondary'
                                    onClick={() => navigate('/listaBici')}
                                >
                                    Annulla
                                </button>
                                <button type='submit' className='aggiungiBici__btn aggiungiBici__btn--primary' disabled={isSubmitting}>
                                    {isSubmitting ? 'Salvataggio...' : 'Salva Bicicletta'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}