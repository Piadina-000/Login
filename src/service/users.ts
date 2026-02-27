import users from '../json/user.json'
import type { LoginResponse, PostData, AuthUser, AuthResult } from '../types'

/**
 * Chiave utilizzata per salvare/recuperare i dati di autenticazione dal localStorage
 * Utilizzata da tutte le funzioni di gestione sessione
 */
const STORAGE_KEY = 'response'

/**
 * Autentica un utente confrontando i dati inseriti con quelli nel file user.json
 * 
 * Funzionalità:
 * - Supporta login con email o username
 * - Normalizza i dati (lowercase, trim) per confronto case-insensitive
 * - Verifica corrispondenza password esatta
 * - Genera token locale e costruisce oggetto user completo
 * - Crea un displayName combinando nome e cognome
 * 
 * @param data - Oggetto che contiene email/username e password inseriti dall'utente
 * @returns AuthResult con ok: true e LoginResponse se credenziali corrette,
 *          ok: false ed error se credenziali errate
 */
export const authenticateLocalUser = (data: PostData): AuthResult => {
	// Normalizza l'email/username: rimuove spazi e converte in minuscolo per confronto case-insensitive
	const emailOrUsername = data.email.trim().toLowerCase()
	const password = data.password

	/**
	 * Cerca un utente corrispondente nel file JSON
	 * Confronta:
	 * 1. Email normalizzata con email dell'utente
	 * 2. Username normalizzato con username dell'utente
	 * 3. Password (confronto esatto, case-sensitive)
	 */
	const match = (users as AuthUser[]).find((user) => {
		const email = user.email.trim().toLowerCase()
		const usrname = user.usrname.trim().toLowerCase()
		return (email === emailOrUsername || usrname === emailOrUsername) && user.password === password
	})

	// Se non trova corrispondenza, ritorna errore di autenticazione
	if (!match) {
		return { ok: false, error: 'Invalid credentials' }
	}

	/**
	 * Se l'autenticazione ha successo, costruisce la LoginResponse con:
	 * - token locale mock (in produzione sarebbe un JWT reale)
	 * - oggetto user con tutti i dati dell'utente autenticato
	 * - displayName generato automaticamente da nome + cognome
	 */
	return {
		ok: true,
		response: {
			token: 'local-token',
			user: {
				email: match.email,
				nome: match.nome,
				cognome: match.cognome,
				indirizzo: match.indirizzo,
				usrname: match.usrname,
				ruolo: match.ruolo,
				displayName: `${match.nome} ${match.cognome}`,
			},
		},
	}
}

/**
 * Salva la risposta di autenticazione nel localStorage del browser
 * 
 * Utilizzata dopo un login riuscito per mantenere la sessione utente.
 * Il salvataggio nel localStorage permette di persistere la sessione
 * anche dopo il refresh della pagina o la chiusura del browser.
 * 
 * Se response è null, rimuove i dati dal localStorage (comportamento di logout).
 * 
 * @param response - LoginResponse da salvare, o null per rimuovere i dati
 */
export const saveAuthResponse = (response: LoginResponse | null) => {
	if (response) {
		// Converte l'oggetto JavaScript in stringa JSON e lo salva nel localStorage
		localStorage.setItem(STORAGE_KEY, JSON.stringify(response))
	} else {
		// Se response è null, rimuove completamente i dati (logout)
		localStorage.removeItem(STORAGE_KEY)
	}
}

/**
 * Recupera la risposta di autenticazione salvata nel localStorage
 * 
 * Utilizzata all'avvio dell'applicazione o al caricamento di componenti
 * protetti per verificare se l'utente ha una sessione attiva.
 * 
 * @returns LoginResponse se esiste una sessione salvata, null altrimenti
 */
export const getAuthResponse = (): LoginResponse | null => {
	const saved = localStorage.getItem(STORAGE_KEY)
	// Se esiste un valore salvato, lo converte da stringa JSON a oggetto JavaScript
	return saved ? (JSON.parse(saved) as LoginResponse) : null
}

/**
 * Cancella completamente i dati di autenticazione dal localStorage
 * 
 * Utilizzata durante il logout per terminare la sessione utente.
 * Dopo questa operazione, l'utente dovrà autenticarsi nuovamente.
 */
export const clearAuthResponse = () => {
	localStorage.removeItem(STORAGE_KEY)
}
