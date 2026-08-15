# Die Website

Statische Seiten, kein Build-Schritt, veröffentlicht über GitHub Pages unter
`gutster95.github.io/kochbuch-web`. Sie hat drei Aufgaben, und nur die erste ist alt:

1. **Die Landung nach dem Aktivierungslink** (`confirmed/`) — Supabases Site URL zeigt
   darauf. Sie darf **nicht** auf `*.supabase.co` liegen: Functions und Storage erzwingen
   dort `text/plain` plus `CSP: default-src 'none'; sandbox`, der Browser zeigte dem Nutzer
   den Quelltext.
2. **Die Rechtstexte** — Datenschutzerklärung, Impressum und Nutzungsbedingungen. Ohne eine
   öffentlich erreichbare Datenschutz-URL gibt es keinen Play-Store-Eintrag.
3. **Der Löschweg ohne App** (`konto-loeschen/`) — Google Play verlangt das seit 2023 für
   jede App, in der sich ein Konto anlegen lässt.

## Vor der Veröffentlichung: die Platzhalter füllen

Alles, was noch fehlt, ist im Quelltext als `<span class="todo">` markiert und wird auf der
Seite **rot** dargestellt. Das ist Absicht — ein dezenter Platzhalter im Impressum überlebt
jede Durchsicht. Zu finden mit:

```powershell
Select-String -Path web\*\index.html, web\*\*\index.html -Pattern 'class="todo"'
```

Es geht um Anschrift, Kontakt, Registereintrag, USt-IdNr., die zuständige Aufsichtsbehörde
und das Datum. Die Supabase-Region ist bereits eingetragen (`eu-west-1`, Irland — also
**kein** Drittlandtransfer, gegen die Projektliste geprüft).

**Solange Platzhalter drinstehen, tragen alle Seiten `<meta name="robots" content="noindex">`.**
Ein unvollständiges Impressum ist abmahnfähig, und wer es nicht findet, mahnt es nicht ab;
Play und die App rufen die Seiten direkt auf und brauchen keine Indexierung. Die Zeile fliegt
raus, sobald die Angaben stehen. **Die Seiten sind Entwürfe** und gehören vor dem Launch
anwaltlich gegengelesen; inhaltlich sind sie aus dem Quelltext abgeleitet, nicht aus einem
Generator.

## Aufbau

```
index.html              Bestätigungsseite  <- die Wurzel, siehe unten
confirmed/              dieselbe Seite noch einmal
home.html               Startseite (de)         en/home.html
datenschutz/            Datenschutzerklärung    en/privacy/
agb/                    Nutzungsbedingungen     en/terms/
impressum/              Impressum               en/legal-notice/
konto-loeschen/         Löschweg ohne App       en/delete-account/
stil.css                Tokens, Schrift und die Rechtsseiten
start.css               nur die Startseite
DESIGN.md               was auf der Startseite warum so gebaut ist
schrift/fraunces.ttf    die Schrift der App
bilder/logo.svg         das App-Logo, zugleich Favicon
bilder/logo-180.png     dasselbe fuer den iOS-Homescreen
bilder/app-*.webp       die vier Screenshots der Startseite
```

**Das Logo ist eine Datei fuer alles** (`bilder/logo.svg`): Marke im Kopf und Fuss jeder
Seite und zugleich `rel="icon"`. Seine Geometrie ist woertlich aus
`app/src/main/res/drawable/ic_launcher_foreground.xml` uebernommen — Ring um (54,52),
Spiegel um (54,54), derselbe Terracotta-Verlauf. Wer das App-Icon aendert, aendert diese
Datei mit, sonst tragen Store-Eintrag, Website und App drei verschiedene Zeichen. Bewusst
eine gemeinsame Quelle statt eines zweiten, inline gezeichneten Logos: Zwei Fassungen
laufen auseinander, und beim Icon faellt genau das nicht auf.

**Zwei Stylesheets, und das ist Absicht.** `stil.css` trägt die Tokens, `@font-face` und
die Gestaltung der vier Rechtstexte — eine Spalte Fließtext auf 42rem. Die Startseite ist
seit dem Umbau eine eigene Welt und steht in `start.css`; sie lädt beide Dateien, in
dieser Reihenfolge. Hätte die Startseite in `stil.css` mitgemischt, änderte jeder
Handgriff an ihr zugleich Datenschutzerklärung, Impressum, AGB und Löschweg — an denselben
Klassennamen, ohne dass es jemandem auffällt.

Die Gestaltungsentscheidungen der Startseite stehen in `DESIGN.md`, nicht hier: Kopf,
Bahnen, Gerätedarstellung, die eine Bewegung und die Stellen, an denen sie still
kaputtgeht.

**Die Wurzel ist die Bestätigungsseite und nicht die Startseite** — das sieht falsch aus,
ist aber Absicht: Supabases Site URL zeigt auf `https://gutster95.github.io/kochbuch-web/`,
und ein Aktivierungslink, der auf einer Werbeseite landet, ist für den Nutzer ein Fehler.
Die Startseite liegt deshalb unter `home.html`.

**So wird daraus die übliche Ordnung:** Site URL im Supabase-Dashboard (Authentication →
URL Configuration) auf `…/kochbuch-web/confirmed/` umstellen — die Seite liegt dort bereits
—, danach `home.html` nach `index.html` verschieben und die `../home.html`-Verweise in den
Rechtsseiten auf `../index.html` zurückdrehen. Erst umstellen, dann verschieben, sonst
klafft dazwischen ein Loch.

**Deutsch und Englisch, nicht alle sechs Sprachen der App.** Bei Rechtstexten wäre das
unverhältnismäßig, und die deutsche Fassung ist die verbindliche, solange der Anbieter in
Deutschland sitzt — jede englische Seite sagt das am Fuß.

Die Bestätigungsseite kann dagegen alle sechs, weil dort nur zwei Sätze stehen; sie schaltet
per `navigator.languages` um, mit Englisch als Rückfall (dieselbe Regel wie `values/` in der
App).

## Google Fonts sind bewusst draußen

Die Bestätigungsseite lud Fraunces früher über `fonts.googleapis.com`. Damit ging die
IP-Adresse jedes Besuchers ohne Einwilligung an Google — der Fall, den das LG München I 2022
entschieden hat (Az. 3 O 17493/20) und der seitdem massenhaft abgemahnt wird. Auf einer
**Datenschutzerklärung** wäre das besonders schlecht.

Die Schriftdatei ist deshalb eine Kopie aus der App
(`shared/src/commonMain/composeResources/font/fraunces_variable.ttf`) und liegt unter
`schrift/`. Wer die Schrift der App wechselt, kopiert sie hier mit. Ein `woff2`-Subset wäre
kleiner (die Variable-TTF ist 360 KB), braucht aber `fonttools` samt `brotli` — eine
Optimierung, keine Voraussetzung.

## Die Gestaltung kommt aus der App

`stil.css` trägt die Tokens wortgleich aus `ui/theme/Color.kt` und `ui/theme/Dimens.kt`.
Wer dort etwas ändert, ändert es hier mit — sonst sehen Store-Eintrag, Website und App nach
drei verschiedenen Produkten aus.

## Alle Pfade sind relativ

Die Seiten liegen unter `/kochbuch-web/`, nicht auf einer eigenen Domain. Ein absoluter Pfad
wie `/stil.css` zeigt dort ins Leere. Beim Ergänzen einer Seite also `../stil.css` bzw.
`../../stil.css`.

## Prüfen

```powershell
cd web
python -m http.server 8000
```

Dann `http://localhost:8000/` öffnen. Zwei Dinge, die man wirklich anschauen muss:

- **Netzwerk-Reiter der Entwicklerwerkzeuge:** Es darf **keine** Anfrage an
  `fonts.googleapis.com` oder `fonts.gstatic.com` stehen. Fraunces muss von `localhost`
  kommen.
- **Handybreite** (Gerätesimulation, ~360 px): Die Tabellen in der Datenschutzerklärung
  scrollen in ihrem `.tabelle`-Kasten, die Seite selbst darf nicht seitlich scrollen.
  Auf der Startseite dasselbe: Sie ist bei 390 px auf `scrollWidth == Viewport` geprüft.

Screenshots ohne Browser-Werkzeug gehen auch mit dem installierten Chrome:

```powershell
& "C:\Program Files\Google\Chrome\Application\chrome.exe" --headless=new --disable-gpu `
  --hide-scrollbars --virtual-time-budget=5000 --window-size=1440,3200 `
  --screenshot=desktop.png "http://localhost:8000/home.html"
```

**Für die Handybreite taugt `--window-size=390,…` nicht** — das Fenster hat unter Windows
eine Mindestbreite, und der Screenshot beschneidet dann eine breiter gerenderte Seite. Das
sieht wie ein Überlauf aus, der keiner ist. Verlässlich ist eine Hilfsseite, die
`home.html` in einem `<iframe width=390>` lädt, und ein Screenshot davon.

Interne Links lassen sich ohne Server prüfen — das Skript dafür steht in der
Commit-Historie zu diesem Ordner.

## Eintragen nach dem Ausrollen

| Wo | Was |
|---|---|
| Supabase → Auth → Site URL | bleibt `…/kochbuch-web/` (dort liegt die Bestätigungsseite) |
| Play Console → Store-Eintrag | `…/kochbuch-web/datenschutz/` |
| Play Console → Datenlöschung | `…/kochbuch-web/konto-loeschen/` |
| App → `LegalLinks.kt` | dieselben URLs, dort liegen sie als Konstanten |
