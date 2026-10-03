/* ====================================================================
   KATEGORIJE — fiksna taksonomija, retko se menja pa ostaje ovde.
   Sami recepti žive u Firestore-u (kolekcija "recipes"), učitavaju se
   preko src/firebase.js. Dodavanje/izmena recepata ide preko Claude-a
   (desktop skript ili Cloudflare Worker MCP alat), ne direktno ovde.
==================================================================== */

export const CATEGORIES = ["Doručak", "Užina", "Dezert", "Glavni obrok"];
