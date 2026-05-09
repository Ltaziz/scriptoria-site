import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAnalytics, isSupported } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-analytics.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-storage.js";

const firebaseConfig = {
  apiKey: "AIzaSyC7a7WsjUh_if-RYzi7bqrPctWq1Egty6I",
  authDomain: "scriptoria-iq.firebaseapp.com",
  projectId: "scriptoria-iq",
  storageBucket: "scriptoria-iq.firebasestorage.app",
  messagingSenderId: "456863421299",
  appId: "1:456863421299:web:7977cca5d83eff1510eb06",
  measurementId: "G-E6FFBH2EYT",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app, `gs://${firebaseConfig.storageBucket}`);

// Analytics may not initialize on unsupported/local environments.
let analytics = null;

isSupported()
  .then((supported) => {
    if (supported) {
      analytics = getAnalytics(app);
      window.scriptoriaFirebase.analytics = analytics;
    }
  })
  .catch((error) => {
    console.warn("Firebase Analytics is not available in this environment.", error);
  });

window.scriptoriaFirebase = {
  app,
  analytics,
  db,
  storage,
  config: firebaseConfig,
};

export { app, analytics, db, storage, firebaseConfig };
