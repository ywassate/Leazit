// functions/index.js
const { setGlobalOptions } = require("firebase-functions/v2/options");
const { onRequest } = require("firebase-functions/v2/https");
const admin = require("firebase-admin");

admin.initializeApp();

// Options globales (v2) : région + contrôle de coût/perf
setGlobalOptions({
  region: "europe-west1",
  maxInstances: 10,
  memory: "256MiB", // optionnel
  timeoutSeconds: 60, // optionnel
});

// ---- App Express (si tu en as une) ----
let app;
try {
  // Adapte le chemin selon ton projet : ./src/app, ./app, etc.
  app = require("./src/app");
} catch (e) {
  // Fallback minimal si pas d’Express : répond OK
  app = (req, res) => res.json({ ok: true, msg: "API up (fallback)" });
}

// Exporte ta fonction HTTP v2 (compatible Express)
exports.api = onRequest(app);
