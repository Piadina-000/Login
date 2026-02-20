import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import '../styles/listaBici.css'
import '../styles/afterLogin.css'
import { fetchBiciclette } from '../service/api.ts'

export const ListaBici = () => {
    const [page, setPage] = useState(1)
    const pageSize = 20

    const { data, isLoading, error } = useQuery({
        queryKey: ['biciclette', page],
        queryFn: () => fetchBiciclette({ page, size: pageSize })
    })

    const biciclette = data?.data || []
    
    return (
        <div className='pagina'>
            <div className='header'>
                <h1>Catalogo Biciclette</h1>
            </div>
            <div className='body'>
                <div className='body__container'>
                    <div className='listaBici'>
                        {isLoading && <p>Caricamento...</p>}
                        {error && <p style={{ color: 'red' }}>Errore nel caricamento dei dati</p>}
                        {!isLoading && !error && <p>Gestisci tutte le biciclette disponibili nel sistema.</p>}
                        
                        <div className='listaBici__header'>
                            <h2 className='listaBici__header-title'>Elenco Biciclette</h2>
                            <button className='listaBici__btn-add' onClick={() => window.location.href = '/aggiungiBici'}>+ Aggiungi Bicicletta</button>
                        </div>

                        <div className='listaBici__table-wrapper'>
                            <table className='listaBici__table'>
                                <thead>
                                    <tr>
                                        <th>Immagine</th>
                                        <th>Nome</th>
                                        <th>Categoria</th>
                                        <th>Prezzo</th>
                                        <th>Stock</th>
                                        <th>Stato</th>
                                        <th>Azioni</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {biciclette.map((bici) => (
                                        <tr key={bici.id}>
                                            <td>
                                                {bici.image_url ? (
                                                    <img 
                                                        src={bici.image_url} 
                                                        alt={bici.name} 
                                                        className='listaBici__img'
                                                    />
                                                ) : (
                                                    <div className='listaBici__img-placeholder'>No img</div>
                                                )}
                                            </td>
                                            <td>{bici.name}</td>
                                            <td>{bici.category}</td>
                                            <td className='listaBici__price'>€ {bici.price.toFixed(2)}</td>
                                            <td>
                                                <span className={`listaBici__stock ${
                                                    bici.stock_quantity === 0 ? 'listaBici__stock--out' :
                                                    bici.stock_quantity < 5 ? 'listaBici__stock--low' : ''
                                                }`}>
                                                    {bici.stock_quantity}
                                                </span>
                                                {bici.stock_quantity === 0 && (
                                                    <span className='listaBici__badge listaBici__badge--esaurito'>
                                                        Esaurito
                                                    </span>
                                                )}
                                            </td>
                                            <td>
                                                <span className={`listaBici__badge ${
                                                    bici.is_active ? 'listaBici__badge--active' : 'listaBici__badge--inactive'
                                                }`}>
                                                    {bici.is_active ? 'Attiva' : 'Non visibile'}
                                                </span>
                                            </td>
                                            <td>
                                                <div className='listaBici__actions'>
                                                    <button className='listaBici__action-btn listaBici__action-btn--view'>
                                                        Visualizza
                                                    </button>
                                                    <button className='listaBici__action-btn listaBici__action-btn--edit'>
                                                        Modifica
                                                    </button>
                                                    <button className='listaBici__action-btn listaBici__action-btn--delete'>
                                                        Elimina
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}