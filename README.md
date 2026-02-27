# Gestionale Biciclette

Applicazione web per la gestione di un catalogo biciclette, sviluppata con React, TypeScript e Vite.

## Descrizione

Sistema di amministrazione per la gestione di un negozio di biciclette che include autenticazione, CRUD completo e interfaccia intuitiva per la gestione del catalogo prodotti.

## Caratteristiche Principali

### Autenticazione
- Form di login con validazione credenziali
- Gestione sessione utente
- Protezione delle rotte amministrative

### Gestione Biciclette
- **Lista Biciclette**: Visualizzazione completa del catalogo con filtri e ricerca
- **Aggiungi Bicicletta**: Form completo per inserimento nuovi prodotti
- **Modifica Bicicletta**: Aggiornamento dettagli prodotti esistenti
- **Dettagli Bicicletta**: Visualizzazione completa delle informazioni prodotto
- **Soft Delete**: Eliminazione logica con possibilità di ripristino
- **Restore**: Recupero biciclette eliminate

### Validazione e UX
- Validazione form
- Messaggi di errore informativi
- Gestione stati di caricamento
- Interfaccia responsive e moderna

## Tech Stack

- **Frontend Framework**: React 18
- **Linguaggio**: TypeScript
- **Build Tool**: Vite
- **Routing**: React Router DOM
- **State Management**: React Query / TanStack Query
- **Styling**: CSS Modules
- **Form Handling**: FormData API + validazione custom

## Struttura del Progetto

```
src/
├── components/                   # Componenti React
│   ├── Login.tsx                 # Pagina di login
│   ├── AdminLayout.tsx           # Layout amministrazione
│   ├── Sidebar.tsx               # Navigazione laterale
│   ├── Amministrazione.tsx
│   ├── ListaBici.tsx             # Lista catalogo
│   ├── AggiungiBici.tsx          # Form creazione
│   └── azioni/
│       ├── ModificaBici.tsx      # Form modifica
│       └── DettaglioBici.tsx     # Dettaglio prodotto
├── hooks/                        # Custom hooks
│   ├── useSoftDeleteBicicletta.ts
│   ├── useDeleteBicicletta.ts
│   └── useRestoreBicicletta.ts
├── service/                      # API e servizi
│   ├── api.ts                    # Chiamate API biciclette
│   └── users.ts                  # Gestione utenti
├── types/                        # Definizioni TypeScript
│   └── index.ts                  # Tipo Bicicletta e altri
├── utils/                        # Utility functions
│   └── bikeForm.ts               # Validazione e parsing form
├── styles/                       # File CSS modulari
│   ├── login.css
│   ├── sidebar.css
│   ├── listaBici.css
│   ├── aggiungi-modificaBici.css
│   ├── dettaglioBici.css
│   └── amministrazione.css
└── json/                         # Dati mock
    └── user.json

```

## Prerequisiti

- **Node.js** >= 16.x
- **npm** >= 8.x

## Installazione

1. Clona il repository
```bash
git clone <repository-url>
cd login
```

2. Installa le dipendenze
```bash
npm install
```

## Avvio in Sviluppo

```bash
npm run dev
```

L'applicazione sarà disponibile su `http://localhost:5173`

## Build per Produzione

```bash
npm run build
```

## Anteprima della Build

```bash
npm run preview
```

## Credenziali di Accesso

Le credenziali sono gestite tramite il file `src/json/user.json`

## API Endpoints

L'applicazione comunica con un backend che espone i seguenti endpoint:

- `GET /biciclette` - Lista tutte le biciclette
- `GET /biciclette/:id` - Dettagli bicicletta
- `POST /biciclette` - Crea nuova bicicletta
- `PATCH /biciclette/:id` - Aggiorna bicicletta
- `DELETE /biciclette/:id` - Soft delete bicicletta
- `DELETE /biciclette/:id/hard` - Eliminazione permanente
- `POST /biciclette/:id/restore` - Ripristina bicicletta

## Licenza

Questo progetto è di esempio per scopi didattici.

