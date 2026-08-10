# kochbuch-web

Die Bestätigungsseite der Kochbuch-App: Hier landet, wer in seiner Registrierungsmail
auf den Aktivierungslink tippt (Supabase → Authentication → URL Configuration → Site URL).

Eine einzelne statische Datei, kein Build-Schritt. Sie liegt **nur deshalb** in einem
eigenen öffentlichen Repo, weil `*.supabase.co` kein HTML ausliefert — weder Edge
Functions noch Storage: Beide erzwingen `Content-Type: text/plain` und
`Content-Security-Policy: default-src 'none'; sandbox`.

Die Quelle liegt im Hauptprojekt unter `web/confirmed/index.html`; Änderungen gehören
dorthin und werden hierher kopiert.
