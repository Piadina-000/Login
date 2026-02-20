import { useLocation, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import '../styles/sidebar.css'
import type { LoginResponse } from '../types'
import { clearAuthResponse, getAuthResponse } from '../service/users'

/**
 * Componente Sidebar Amministrativa
 * Navigazione per il pannello admin
 */
export const Sidebar = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const [auth, setAuth] = useState<LoginResponse | null>(() => getAuthResponse())
  const [isCollapsed, setIsCollapsed] = useState(true)
  const [showBiciMenu, setShowBiciMenu] = useState(false)

  // Verifica autenticazione
  useEffect(() => {
    const saved = getAuthResponse()
    if (!saved) {
      navigate('/')
    } else {
      setAuth(saved)
    }
  }, [navigate])

  /**
   * Determina se una rotta è attiva
   */
  const isActive = (path: string): boolean => {
    return location.pathname === path
  }

  /**
   * Determina se la sezione Biciclette è attiva
   */
  const isBiciActive = (): boolean => {
    return location.pathname === '/listaBici' || location.pathname === '/aggiungiBici'
  }

  /**
   * Gestisce il logout
   */
  const handleLogout = () => {
    clearAuthResponse()
    navigate('/')
  }

  /**
   * Gestisce la navigazione verso un percorso
   */
  const handleNavigate = (path: string) => {
    navigate(path)
    if (isCollapsed) {
      setIsCollapsed(false)
    }
  }

  return (
    <>
      {!isCollapsed && (
        <div
          className="sidebar__backdrop sidebar__backdrop--open"
          onClick={() => setIsCollapsed(true)}
          aria-hidden="true"
        />
      )}
      <aside className={`sidebar ${isCollapsed ? 'sidebar--collapsed' : ''}`} aria-hidden={isCollapsed}>
        {/* Header Sidebar */}
        <div className="sidebar__header">
          <div className="sidebar__logo">
            {!isCollapsed && <span className="sidebar__logo-text">Admin Panel</span>}
          </div>
          <button
            className="sidebar__toggle"
            onClick={() => setIsCollapsed(!isCollapsed)}
            title={isCollapsed ? 'Apri menu' : 'Chiudi'}
            aria-label={isCollapsed ? 'Apri menu' : 'Chiudi'}
          >
            ☰
          </button>
        </div>

      {/* Navigazione principale */}
      <nav className="sidebar__nav">
        {/* Dashboard */}
        <div className="sidebar__section">
          <button
            className={`sidebar__item ${isActive('/admin') ? 'sidebar__item--active' : ''}`}
            onClick={() => handleNavigate('/admin')}
            title="Dashboard"
          >
            {!isCollapsed && <span className="sidebar__item-label">Dashboard</span>}
          </button>
        </div>

        {/* Biciclette */}
        <div className="sidebar__section">
          <button
            className={`sidebar__item sidebar__item--parent ${isBiciActive() ? 'sidebar__item--active' : ''}`}
            onClick={() => setShowBiciMenu(!showBiciMenu)}
            title="Biciclette"
          >
            {!isCollapsed && (
              <>
                <span className="sidebar__item-label">Biciclette</span>
                <span className={`sidebar__item-arrow ${showBiciMenu ? 'sidebar__item-arrow--open' : ''}`}>
                  ▼
                </span>
              </>
            )}
          </button>

          {/* Sottomenu Biciclette */}
          {!isCollapsed && (
            <div className={`sidebar__submenu ${showBiciMenu ? 'sidebar__submenu--open' : ''}`}>
              <button
                className={`sidebar__subitem ${isActive('/listaBici') ? 'sidebar__subitem--active' : ''}`}
                onClick={() => handleNavigate('/listaBici')}
                title="Lista biciclette"
              >
                {!isCollapsed && <span className="sidebar__subitem-label">Lista biciclette</span>}
              </button>

              <button
                className={`sidebar__subitem ${isActive('/aggiungiBici') ? 'sidebar__subitem--active' : ''}`}
                onClick={() => handleNavigate('/aggiungiBici')}
                title="Aggiungi bicicletta"
              >
                {!isCollapsed && <span className="sidebar__subitem-label">Aggiungi bicicletta</span>}
              </button>
            </div>
          )}
        </div>
      </nav>

      {/* Footer Sidebar - Profilo e Logout */}
      <div className="sidebar__footer">
        {!isCollapsed && auth && (
          <div className="sidebar__profile">
            <div className="sidebar__profile-avatar">
              {auth.user?.displayName?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div className="sidebar__profile-info">
              <p className="sidebar__profile-name">{auth.user?.displayName || 'Utente'}</p>
              <p className="sidebar__profile-role">{auth.user?.ruolo || 'Utente'}</p>
            </div>
          </div>
        )}

        <button
          className="sidebar__logout"
          onClick={handleLogout}
          title="Logout"
        >
          {!isCollapsed && <span className="sidebar__logout-label">Logout</span>}
        </button>
      </div>
      </aside>
    </>
  )
}
