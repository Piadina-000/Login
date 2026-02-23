import { useState, useEffect, useRef } from 'react'
import { useQuery } from '@tanstack/react-query'
import '../styles/listaBici.css'
import '../styles/afterLogin.css'
import { fetchBiciclette } from '../service/api.ts'
import type { Bicicletta } from '../types'

export const ListaBici = () => {
    const [page, setPage] = useState(1)
    const [allBiciclette, setAllBiciclette] = useState<Bicicletta[]>([])
    const [hasMore, setHasMore] = useState(true)
    const pageSize = 20
    const observerTarget = useRef<HTMLDivElement>(null)

    const { data, isLoading } = useQuery({
        queryKey: ['biciclette', page],
        queryFn: () => fetchBiciclette({ page, size: pageSize })
    })

    // Accumula i dati dalle varie pagine
    useEffect(() => {
        if (data?.data) {
            setAllBiciclette(prev => (page === 1 ? data.data : [...prev, ...data.data]))
            setHasMore(data.hasMore)
        }
    }, [data, page])

    // infinite scroll
    useEffect(() => {
        const observer = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && hasMore && !isLoading) {
                setPage(prev => prev + 1)
            }
        })

        if (observerTarget.current) {
            observer.observe(observerTarget.current)
        }

        return () => observer.disconnect()
    }, [hasMore, isLoading])
    
    return (
        <div className='pagina'>
            <div className='header'>
                <h1>Catalogo Biciclette</h1>
            </div>
            <div className='body'>
                <div className='body__container'>
                    <div className='listaBici'>
                        {allBiciclette.length === 0 && !isLoading && <p>Gestisci tutte le biciclette disponibili nel sistema.</p>}
                        
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
                                    {allBiciclette.map((bici) => (
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

                        <div ref={observerTarget} style={{ height: '20px', margin: '20px 0' }} />
                        
                        {isLoading && page > 1 && (
                            <p style={{ textAlign: 'center', color: '#666' }}>Caricamento biciclette...</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}