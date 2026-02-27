import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import '../styles/listaBici.css'
import '../styles/afterLogin.css'
import { fetchBiciclette } from '../service/api.ts'
import type { Bicicletta } from '../types'
import { useSoftDeleteBicicletta } from '../hooks/useSoftDeleteBicicletta'

/**
 * Componente ListaBici
 * 
 * Pagina che mostra l'elenco completo delle biciclette con paginazione infinita.
 * 
 * Funzionalità principali:
 * - Infinite scroll con Intersection Observer per caricamento progressivo
 * - Visualizzazione in tabella con informazioni chiave (immagine, nome, categoria, prezzo, stock)
 * - Soft delete delle biciclette (disattivazione)
 * - Badge di stato per biciclette attive/inattive/esaurite
 * - Navigazione a dettaglio e modifica
 */
export const ListaBici = () => {
    const navigate = useNavigate()
    
    // Stato per la pagina corrente (paginazione infinita)
    const [page, setPage] = useState(1)
    const [allBiciclette, setAllBiciclette] = useState<Bicicletta[]>([])
    
    // Flag per indicare se ci sono altre pagine da caricare
    const [hasMore, setHasMore] = useState(true)
    
    // Numero di elementi per pagina
    const pageSize = 20
    
    const observerTarget = useRef<HTMLDivElement>(null)

    /**
     * Hook per gestire il soft delete (disattivazione) di una bicicletta
     * Al successo, aggiorna localmente lo stato is_active senza ricaricare la lista
     */
    const { deleteError, deletingId, handleDelete } = useSoftDeleteBicicletta({
        onSuccess: (id) => {
            setAllBiciclette(prev => prev.map(item => (
                item.id === id ? { ...item, is_active: false } : item
            )))
        }
    })

    /**
     * Query per recuperare una pagina di biciclette
     * Utilizza React Query per caching e gestione automatica degli stati
     */
    const { data, isLoading } = useQuery({
        queryKey: ['biciclette', page],
        queryFn: () => fetchBiciclette({ page, size: pageSize })
    })

    /**
     * Effetto per accumulare i dati delle pagine caricate
     * Reset completo quando si torna alla pagina 1
     * Aggiunge i nuovi dati alle biciclette esistenti per le pagine successive
     */
    useEffect(() => {
        if (data?.data) {
            setAllBiciclette(prev => (page === 1 ? data.data : [...prev, ...data.data]))
            setHasMore(data.hasMore)
        }
    }, [data, page])

    /**
     * Effetto per implementare l'infinite scroll
     */
    useEffect(() => {
        const observer = new IntersectionObserver(entries => {
            // Se l'elemento è visibile, ci sono più dati e non stiamo già caricando
            if (entries[0].isIntersecting && hasMore && !isLoading) {
                setPage(prev => prev + 1)
            }
        })

        if (observerTarget.current) {
            observer.observe(observerTarget.current)
        }

        return () => observer.disconnect()
    }, [hasMore, isLoading])

    /**
     * Handler per l'eliminazione di una bicicletta
     * Wrapper che chiama l'hook di eliminazione con gli ID necessari
     */
    const handleDeleteClick = (bike: Bicicletta) => {
        handleDelete(bike.id, bike.is_active)
    }
    
    return (
        <div className='pagina'>
            <div className='header'>
                <h1>Catalogo Biciclette</h1>
            </div>
            <div className='body'>
                <div className='body__container'>
                    <div className='listaBici'>
                        {/* Messaggio quando la lista è vuota */}
                        {allBiciclette.length === 0 && !isLoading && <p>Gestisci tutte le biciclette disponibili nel sistema.</p>}

                        {/* Errore di eliminazione */}
                        {deleteError && (
                            <p style={{ color: '#b42318', marginTop: '12px' }}>{deleteError}</p>
                        )}
                        
                        {/* Header con titolo e pulsante per aggiungere */}
                        <div className='listaBici__header'>
                            <h2 className='listaBici__header-title'>Elenco Biciclette</h2>
                            <button className='listaBici__btn-add' onClick={() => navigate('/aggiungiBici')}>+ Aggiungi Bicicletta</button>
                        </div>

                        {/* Tabella con l'elenco delle biciclette */}
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
                                            {/* Visualizzazione per biciclette attive */}
                                            {bici.is_active ? (
                                                <>
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
                                                        {bici.stock_quantity === 0 ? (
                                                            <span className='listaBici__badge listaBici__badge--esaurito'>
                                                                Esaurito
                                                            </span>
                                                        ) : (
                                                            <span className={`listaBici__stock ${
                                                                bici.stock_quantity < 5 ? 'listaBici__stock--low' : ''
                                                            }`}>
                                                                {bici.stock_quantity}
                                                            </span>
                                                        )}
                                                    </td>
                                                    <td>
                                                        <span className='listaBici__badge listaBici__badge--active'>
                                                            Attiva
                                                        </span>
                                                    </td>
                                                    <td>
                                                        <div className='listaBici__actions'>
                                                            <button 
                                                                className='listaBici__action-btn listaBici__action-btn--view'
                                                                onClick={() => navigate(`/dettagli/${bici.id}`)}
                                                            >
                                                                Visualizza
                                                            </button>
                                                            <button className='listaBici__action-btn listaBici__action-btn--edit'
                                                                onClick={() => navigate(`/modificaBici/${bici.id}`)}
                                                            >
                                                                Modifica
                                                            </button>
                                                            <button className='listaBici__action-btn listaBici__action-btn--delete'
                                                                disabled={deletingId === bici.id}
                                                                onClick={() => handleDeleteClick(bici)}
                                                            >
                                                                {deletingId === bici.id ? 'Eliminazione...' : 'Elimina'}
                                                            </button>
                                                        </div>
                                                    </td>
                                                </>
                                            ) : (
                                                <>
                                                    {/* Visualizzazione ridotta per biciclette disattivate */}
                                                    <td>
                                                        <div className='listaBici__img-placeholder'>No img</div>
                                                    </td>
                                                    <td>{bici.name}</td>
                                                    <td colSpan={3}></td>
                                                    <td>
                                                        <span className='listaBici__badge listaBici__badge--inactive'>
                                                            Non visibile
                                                        </span>
                                                    </td>
                                                    <td>
                                                        <div className='listaBici__actions'>
                                                            <button 
                                                                className='listaBici__action-btn listaBici__action-btn--view'
                                                                onClick={() => navigate(`/dettagli/${bici.id}`)}
                                                            >
                                                                Visualizza
                                                            </button>
                                                        </div>
                                                    </td>
                                                </>
                                            )}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <div ref={observerTarget} style={{ height: '20px', margin: '20px 0' }} />
                        
                        {/* Indicatore di caricamento per le pagine successive */}
                        {isLoading && page > 1 && (
                            <p style={{ textAlign: 'center', color: '#666' }}>Caricamento biciclette...</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}