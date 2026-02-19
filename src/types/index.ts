// Tipi TypeScript usati nell'applicazione per garantire type safety

/**
 * Dati inviati dal form di login
 */
export interface PostData {
    email: string;      // Email o username inserito dall'utente
    password: string;   // Password inserita dall'utente
}

/**
 * Risposta ricevuta dopo il login (salvata nel localStorage)
 */
export interface LoginResponse {
    token?: string;  
    user?: {            // Dati completi dell'utente autenticato
        email?: string;
        nome?: string;
        cognome?: string;
        indirizzo?: string;
        usrname?: string;
        ruolo?: string;
        displayName?: string; // Nome completo per la visualizzazione
    };
    message?: string;   // Messaggio di successo o info
    error?: string;     // Messaggio di errore
}

/**
 * Struttura di un utente nel file user.json
 */
export interface AuthUser {
	nome: string        // Nome dell'utente
	cognome: string     // Cognome dell'utente
	indirizzo: string   // Indirizzo dell'utente
	email: string       // Email dell'utente (usata anche come ID)
	usrname: string     // Username alternativo per il login
	password: string    // Password dell'utente (in chiaro per questo mock)
	ruolo: string       // Ruolo dell'utente (Amministratore, Supervisore, Operatore)
}

/**
 * Risultato della funzione di autenticazione
 */
export interface AuthResult {
	ok: boolean             // true se autenticazione riuscita, false altrimenti
	response?: LoginResponse // Dati di risposta se ok=true
	error?: string           // Messaggio di errore se ok=false
}