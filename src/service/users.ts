import users from '../json/user.json'
import type { LoginResponse, PostData, AuthUser, AuthResult } from '../types'

// Chiave utilizzata per salvare/recuperare i dati di autenticazione dal localStorage
const STORAGE_KEY = 'response'

/**
 * Autentica un utente confrontando i dati inseriti con quelli presenti in user.json
 * @param data - Oggetto che contiene email/username e password inseriti dall'utente
 * @returns AuthResult - Risultato dell'autenticazione (ok: true/false, response o error)
 */
export const authenticateLocalUser = (data: PostData): AuthResult => {
	// Normalizza l'email/username: rimuove spazi e converte in minuscolo
	const emailOrUsername = data.email.trim().toLowerCase()
	const password = data.password

	// Cerca un utente corrispondente nel file JSON
	// Confronta sia email che username e la password
	const match = (users as AuthUser[]).find((user) => {
		const email = user.email.trim().toLowerCase()
		const usrname = user.usrname.trim().toLowerCase()
		return (email === emailOrUsername || usrname === emailOrUsername) && user.password === password
	})

	// Se non trova corrispondenza, ritorna errore
	if (!match) {
		return { ok: false, error: 'Invalid credentials' }
	}

	// Se l'autenticazione ha successo, crea la response con tutti i dati dell'utente
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
 * Salva la response di autenticazione nel localStorage
 * Se response è null, rimuove i dati dal localStorage (logout)
 * @param response - Risposta del login da salvare o null per rimuovere
 */
export const saveAuthResponse = (response: LoginResponse | null) => {
	if (response) {
		// Converte l'oggetto in stringa JSON e lo salva
		localStorage.setItem(STORAGE_KEY, JSON.stringify(response))
	} else {
		// Rimuove i dati di autenticazione
		localStorage.removeItem(STORAGE_KEY)
	}
}

/**
 * Recupera la response di autenticazione salvata nel localStorage
 * @returns LoginResponse se presente, altrimenti null
 */
export const getAuthResponse = (): LoginResponse | null => {
	const saved = localStorage.getItem(STORAGE_KEY)
	// Se esiste un valore salvato, lo converte da JSON a oggetto
	return saved ? (JSON.parse(saved) as LoginResponse) : null
}

/**
 * Cancella completamente i dati di autenticazione dal localStorage
 * Utilizzato durante il logout
 */
export const clearAuthResponse = () => {
	localStorage.removeItem(STORAGE_KEY)
}
