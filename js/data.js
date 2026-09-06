/* ====================================================================
   KATEGORIJE — fiksna taksonomija, retko se menja pa ostaje ovde.
   Sami recepti žive u Firestore-u (kolekcija "recipes"),
   učitavaju se u js/firebase-data.js i pune globalni `recipes` niz.
   Dodavanje/izmena recepata ide preko Claude-a (desktop skript ili
   Cloudflare Worker MCP alat), ne direktno u ovom fajlu.
==================================================================== */

const CATEGORIES = ["Doručak", "Užina", "Dezert", "Glavni obrok"];
