# WebApp Mattia - Progetto SAW UniPi
Questa webapp è un diario personale per monitorare misure corporee, allenamenti e abitudini giornaliere.

## Link applicazione

Applicazione deployata con Firebase Hosting:

```txt
https://progetto-saw-5f45b.web.app
```

## Credenziali account demo

Account dimostrativo per la correzione:

```txt
Email: demo@mazza.it
Password: Demo671860
```

L'account demo contiene dati già inseriti per testare dashboard, misurazioni, grafici, checklist e allenamenti.

## Funzioni principali 
- Registrazione e accesso con Firebase Authentication (email/password o Google)
- Dashboard profilo con possibilità di modifica dei dati personali
- Inserimento peso e misurazioni corporee, con conseguente calcolo di massa grassa e massa magra tramite formula US Navy e visualizzazione nel grafico
- Inserimento allenamenti manuali tra corsa e pesi oppure tramite collegamento e sincronizzazione a Strava tramite OAuth2 e API REST
- Checklist giornaliera delle abitudini con streak consecutiva
- Notifiche locali del browser, con promemoria giornaliero mentre l'app è aperta
- Supporto PWA e persistenza offline Firestore per i dati già caricati (in base al supporto del browser)

## Tecnologie utilizzate
- React
- Vite
- TypeScript
- shadcn/ui
- Firebase Authentication
- Strava API
- Recharts
- Firebase Hosting
- Vite PWA Plugin

## Overview webapp
Quando un nuovo utente apre per la prima volta la webapp può decidere di registrarsi o con email e password o tramite Google, in entrambi i casi prima di poter accedere all'app verrà reindirizzato in un'apposita sezione dove completare il profilo. Una volta completati questi passaggi può accedere effettivamente ai vari moduli dell'app.

### Modulo profilo e dashboard

La dashboard mostra i dati principali dell'utente:

- nome;
- email;
- foto profilo (solo se si registra tramite Google);
- altezza;
- sesso;
- data di nascita;
- orario promemoria;
- stato notifiche.

L'utente puo modificare i dati direttamente dalla dashboard.

### Modulo antropometrico

Il modulo misurazioni permette l'inserimento di:

- peso;
- circonferenza collo;
- circonferenza vita;
- circonferenza fianchi;
- data della misurazione.

L'app calcola:

- percentuale di massa grassa;
- massa grassa in kg;
- massa magra in kg.

Il calcolo usa la formula US Navy, differenziata in base al sesso dell'utente.  
I dati vengono salvati su Firestore e visualizzati tramite tabella e grafici Recharts.

### Modulo allenamenti

Il modulo allenamenti permette:

- inserimento manuale di allenamenti di corsa;
- inserimento manuale di allenamenti con pesi;
- visualizzazione in tabella;
- visualizzazione tramite grafici;
- eliminazione allenamenti;
- aggiunta manuale del volume per allenamenti importati da Strava.

### Integrazione Strava

L'integrazione Strava usa OAuth2.

Il flusso implementato è:

1. l'utente preme il bottone di collegamento;
2. viene reindirizzato alla pagina di autorizzazione Strava;
3. Strava restituisce un authorization code alla callback dell'app;
4. l'app scambia il code con access token e refresh token;
5. i token vengono salvati in Firestore;
6. l'utente può sincronizzare fino a 60 attività dell'ultimo mese; quelle già salvate non vengono importate di nuovo.

Il progetto salva anche `refresh_token` ed `expires_at`, cosi da poter aggiornare il token senza richiedere ogni volta una nuova autorizzazione.

### Modulo abitudini

Il modulo checklist permette di:

- creare una nuova abitudine;
- segnare un'abitudine come completata;
- calcolare la streak consecutiva;
- modificare una abitudine;
- eliminare una abitudine.

Ogni habit salva la data dell'ultimo completamento tramite `lastCompletedDate`.  
In questo modo la checkbox risulta selezionata solo se l'abitudine e stata completata nella data corrente.

### Notifiche

L'utente può abilitare le notifiche dalla dashboard e impostare un orario giornaliero. Il promemoria è programmato con un timer nel browser e viene inviato mentre l'app è aperta; non è una notifica push in background.

Se le notifiche sono abilitate, viene programmata una notifica locale all'orario scelto.

## Requisiti

Per avviare il progetto in locale sono necessari:

- Node.js
- npm
- un file `.env` configurato nella root del progetto

## Variabili ambiente

Il progetto richiede un file `.env` nella root:

```env
VITE_FIREBASE_API_KEY=...
VITE_STRAVA_CLIENT_ID=...
VITE_STRAVA_CLIENT_SECRET=...
```

Le variabili `VITE_*` vengono incluse nel bundle frontend: in particolare, il `VITE_STRAVA_CLIENT_SECRET` non è segreto e non va usato in un deployment pubblico. L'implementazione attuale effettua lo scambio e il rinnovo dei token Strava nel client; per un uso pubblico, sposta queste operazioni in un backend protetto. Configura inoltre Firebase Authentication (email/password e Google), Firestore e l'URL di callback Strava `/strava/callback` negli ambienti locali e di produzione.
## PWA e offline

L'app è configurata come PWA tramite `vite-plugin-pwa` ed è installabile dai browser compatibili. Firestore abilita la persistenza locale dei dati già caricati; la disponibilità offline dipende dal supporto del browser e non sostituisce la configurazione delle regole di sicurezza Firestore.

## Installazione e avvio locale

Clonare il repository:

```bash
git clone https://github.com/MattiaMazza05/Progetto-SAW-UniPi.git
cd Progetto-SAW-UniPi
```

Installare le dipendenze:

```bash
npm install
```

Avviare il server di sviluppo:

```bash
npm run dev
```

A questo punto l'app sarà disponibile localmente su:

```txt
http://localhost:5173
```
## Build e deploy

Per generare la build:

```bash
npm run build
```
Per testare la build:
```bash
npm run preview
```
Per effettuare il deploy:
```bash
npm run build
firebase deploy
```
## Autore

Nome: Mattia  
Cognome: Mazza  
Matricola: 671860

## License

Copyright © 2026 Mattia Mazza.

This repository is publicly available for viewing and educational,
academic, and portfolio purposes.

The source code may not be copied, modified, redistributed,
sublicensed, or incorporated into other projects without prior
written permission.

Third-party libraries and dependencies remain subject to their
respective licenses.
