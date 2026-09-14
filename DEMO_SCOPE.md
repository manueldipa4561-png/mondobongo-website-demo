# Demo Crescita — €700

Questa repository rappresenta il livello **Crescita** di Punto Due Studio: il pacchetto consigliato per la maggior parte delle attività, con più struttura, più valore percepito e integrazioni semplici ma controllate.

## Incluso
- 3 pagine: `index.html`, `menu.html`, `contatti.html`.
- Design completo e struttura contenuti condivisa tra le pagine.
- CTA, telefono, Google Maps, Instagram e Facebook.
- Form client-side per preparare una richiesta WhatsApp senza inviare o salvare dati automaticamente.
- QR brandizzato locale e scaricabile che apre `menu.html`.
- Integrazione calendario semplice: link Google Calendar e file `.ics`, entrambi marcati come promemoria DA CONFERMARE.
- SEO base distinto per pagina: title, description, H1 e canonical/noindex coerenti con la natura di demo.

## Flusso richiesta
Il form prepara un messaggio WhatsApp e un promemoria personale. Non esiste un calendario disponibilità condiviso e non viene confermato alcun tavolo. Solo l'utente può aprire WhatsApp e inviare il messaggio. Non c'è backend, destinatario email o raccolta dati lato server.

## Acceptance criteria / QA
- Rifiuta date e orari già trascorsi.
- Gestisce correttamente richieste da 1 a 8 persone.
- Invalida il risultato se l'utente modifica i campi.
- Genera testo WhatsApp coerente con i dati inseriti.
- Genera un evento Google Calendar e un file `.ics` tentativo di 2 ore, senza presentarlo come prenotazione confermata.
- Il QR apre il menu della demo.
- Le categorie del menu restano accessibili anche senza JavaScript; con JavaScript supportano frecce, Home ed End.
- QA previsto su mobile, tablet e desktop.

## Delivery prevista
Due giri di revisione con feedback consolidato. Nuove pagine, automazioni o integrazioni più complesse sono extra o richiedono Evoluzione.
