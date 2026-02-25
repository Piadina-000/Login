import '../styles/aggiungi-modificaBici.css'
import '../styles/afterLogin.css'
import { useNavigate } from 'react-router'

/**
 * Componente ModificaBici
 * Pagina per modificare i dettagli di una bicicletta.
 */
export const ModificaBici = () => {

    const navigate = useNavigate()

    return (
        <div className='pagina'>
            <div className='header'>
                <h1>Modifica Bicicletta</h1>
            </div>
            <div className='body'>
                <div className='body__container'>
                    <div className='aggiungiBici'>
                        
                        <p>Modifica il form per modificare la bicicletta del catalogo.</p>
                        
                        <form className='aggiungiBici__form'>
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
                                    required 
                                />
                            </div>

                            {/* Categoria - Obbligatorio */}
                            <div className='aggiungiBici__form-group'>
                                <label htmlFor='category'>
                                    Categoria 
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
                                        Prezzo (€) 
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
                                    Quantità in Stock 
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
                                <input 
                                    type='url' 
                                    id='image_url' 
                                    name='image_url' 
                                    placeholder='https://esempio.com/immagine.jpg'
                                />
                                <span className='aggiungiBici__form-help'>Link all'immagine della bicicletta</span>
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
                    </div>
                </div>
            </div>
        </div>
    )
}