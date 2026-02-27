import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { fetchBiciclettaById } from '../../service/api'
import { useSoftDeleteBicicletta } from '../../hooks/useSoftDeleteBicicletta'
import { useHardDeleteBicicletta } from '../../hooks/useDeleteBicicletta'
import { useRestoreBicicletta } from '../../hooks/useRestoreBicicletta'
import type { ApiResponse, Bicicletta } from '../../types'
import '../../styles/dettaglioBici.css'
import '../../styles/afterLogin.css'

/**
 * Componente DettaglioBici
 * Mostra i dettagli di una singola bicicletta:
 * - Recupera i dati via `fetchBiciclettaById` usando React Query
 */
export const DettaglioBici = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [notFound, setNotFound] = useState(false)

  const updateListCache = (bikeId: number, isActive: boolean) => {
    queryClient.setQueriesData<ApiResponse<Bicicletta>>(
      { queryKey: ['biciclette'] },
      (oldData) => {
        if (!oldData?.data) return oldData

        return {
          ...oldData,
          data: oldData.data.map((item) =>
            item.id === bikeId ? { ...item, is_active: isActive } : item
          )
        }
      }
    )
  }

  const { data: bicicletta, isLoading, error } = useQuery({
    queryKey: ['bicicletta', id],
    queryFn: () => {
      if (!id) throw new Error('ID non valido')
      return fetchBiciclettaById(Number(id))
    },
    enabled: !!id,
    retry: false
  })

  // Gestire l'errore 404
  useEffect(() => {
    if (error) {
      const errorMessage = error instanceof Error ? error.message : String(error)
      if (errorMessage.includes('non trovata') || errorMessage.includes('404')) {
        setNotFound(true)
      }
    }
  }, [error])

  const { deleteError, isDeleting, handleDelete } = useSoftDeleteBicicletta({
    onSuccess: () => {
      const bikeId = Number(id)
      updateListCache(bikeId, false)
      queryClient.invalidateQueries({ queryKey: ['bicicletta', id] })
      queryClient.invalidateQueries({ queryKey: ['biciclette'] })
    }
  })

  const {
    deleteError: hardDeleteError,
    isDeleting: isHardDeleting,
    handleDelete: handleHardDelete
  } = useHardDeleteBicicletta({
    onSuccess: () => navigate('/listaBici')
  })

  const {
    restoreError,
    isRestoring,
    handleRestore
  } = useRestoreBicicletta({
    onSuccess: () => {
      const bikeId = Number(id)
      updateListCache(bikeId, true)
      queryClient.invalidateQueries({ queryKey: ['bicicletta', id] })
      queryClient.invalidateQueries({ queryKey: ['biciclette'] })
    }
  })

  return (
    <div className='pagina'>
      <div className='header'>
        <h1>Dettagli Bicicletta</h1>
      </div>

      <div className='body'>
        <div className='body__container'>
          {/* Bottone Indietro */}
          <button className='dettagli__btn-back' onClick={() => navigate('/listaBici')}>
            ← Indietro
          </button>

          {/* Loading */}
          {isLoading && (
            <div className='dettagli__loading'>
              <p>Caricamento dettagli...</p>
            </div>
          )}

          {/* 404 Not Found */}
          {notFound && (
            <div className='dettagli__error dettagli__error--404'>
              <h2>Bicicletta Non Trovata</h2>
              <p>La bicicletta con ID {id} non esiste nel sistema.</p>
            </div>
          )}

          {/* Generic Error */}
          {error && !notFound && (
            <div className='dettagli__error'>
              <h2>Errore nel Caricamento</h2>
              <p>{error instanceof Error ? error.message : 'Errore sconosciuto'}</p>
              <button className='dettagli__btn-retry' onClick={() => navigate(0)}>
                Riprova
              </button>
            </div>
          )}

          {deleteError && (
            <div className='dettagli__error'>
              <h2>Errore Eliminazione</h2>
              <p>{deleteError}</p>
            </div>
          )}

          {hardDeleteError && (
            <div className='dettagli__error'>
              <h2>Errore Eliminazione Definitiva</h2>
              <p>{hardDeleteError}</p>
            </div>
          )}

          {restoreError && (
            <div className='dettagli__error'>
              <h2>Errore Ripristino</h2>
              <p>{restoreError}</p>
            </div>
          )}

          {/* Bicicletta non visibile */}
          {bicicletta && !isLoading && !error && !bicicletta.is_active && (
            <div className='dettagli__error dettagli__error--404'>
              <h2>Bicicletta Non Visibile</h2>
              <p>Questa bicicletta è stata rimossa dal catalogo e non è più accessibile.</p>
              <div className='dettagli__actions'>
                <button 
                  className='dettagli__btn dettagli__btn--restore'
                  disabled={isRestoring}
                  onClick={() => handleRestore(Number(id))}
                >
                  {isRestoring ? 'Ripristino...' : 'Ripristina'}
                </button>
                <button 
                  className='dettagli__btn dettagli__btn--delete'
                  disabled={isHardDeleting}
                  onClick={() => handleHardDelete(Number(id))}
                >
                  {isHardDeleting ? 'Eliminazione definitiva...' : 'Elimina definitivamente'}
                </button>
              </div>
            </div>
          )}

          {/* Details */}
          {bicicletta && !isLoading && !error && bicicletta.is_active && (
            <div className='dettagli__container'>
              <div className='dettagli__row'>
                {/* Img */}
                <div className='dettagli__col dettagli__col--image'>
                  {bicicletta.image_url ? (
                    <img
                      src={bicicletta.image_url}
                      alt={bicicletta.name}
                      className='dettagli__image'
                    />
                  ) : (
                    <div className='dettagli__image-placeholder'>Immagine non disponibile</div>
                  )}
                </div>

                {/* Details */}
                <div className='dettagli__col dettagli__col--info'>
                  <div className='dettagli__header'>
                    <h2 className='dettagli__title'>{bicicletta.name}</h2>
                    <span className={`dettagli__badge ${
                      bicicletta.is_active ? 'dettagli__badge--active' : 'dettagli__badge--inactive'
                    }`}>
                      {bicicletta.is_active ? '✓ Attiva' : '✗ Non visibile'}
                    </span>
                  </div>

                  {/* Description */}
                  {bicicletta.description && (
                    <div className='dettagli__description'>
                      <label className='dettagli__label'>Descrizione</label>
                      <p className='dettagli__description-text'>{bicicletta.description}</p>
                    </div>
                  )}

                  <div className='dettagli__info-grid'>
                    {/* ID */}
                    <div className='dettagli__field'>
                      <label className='dettagli__label'>ID</label>
                      <p className='dettagli__value'>{bicicletta.id}</p>
                    </div>

                    {/* Category */}
                    <div className='dettagli__field'>
                      <label className='dettagli__label'>Categoria</label>
                      <p className='dettagli__value'>{bicicletta.category}</p>
                    </div>

                    {/* Price */}
                    <div className='dettagli__field'>
                      <label className='dettagli__label'>Prezzo</label>
                      <p className='dettagli__value dettagli__price'>€ {bicicletta.price.toFixed(2)}</p>
                    </div>

                    {/* Stock */}
                    <div className='dettagli__field'>
                      <label className='dettagli__label'>Disponibilità in Stock</label>
                      {bicicletta.stock_quantity === 0 ? (
                        <span className='dettagli__warning'>Prodotto esaurito</span>
                      ) : (
                        <>
                          <p className={`dettagli__value dettagli__stock ${
                            bicicletta.stock_quantity < 5 ? 'dettagli__stock--low' : ''
                          }`}>
                            {bicicletta.stock_quantity} unità
                          </p>
                          {bicicletta.stock_quantity < 5 && (
                            <span className='dettagli__warning'>Scorte in esaurimento</span>
                          )}
                        </>
                      )}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className='dettagli__actions'>
                    <button 
                      className='dettagli__btn dettagli__btn--edit'
                      onClick={() => navigate(`/modificaBici/${id}`)}
                    >
                      Modifica
                    </button>
                    <button 
                      className='dettagli__btn dettagli__btn--delete'
                      disabled={isDeleting || isHardDeleting || !bicicletta.is_active}
                      onClick={() => handleDelete(Number(id), bicicletta.is_active)}
                    >
                      {isDeleting ? 'Eliminazione...' : 'Elimina'}
                    </button>
                    <button 
                      className='dettagli__btn dettagli__btn--delete'
                      disabled={isDeleting || isHardDeleting}
                      onClick={() => handleHardDelete(Number(id))}
                    >
                      {isHardDeleting ? 'Eliminazione definitiva...' : 'Elimina definitivamente'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
