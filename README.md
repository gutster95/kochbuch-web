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

**Dazu kommen die beiden Store-Adressen.** Der Holen-Block der Startseite (`#holen`) trägt
die **offiziellen Abzeichen** von Google und Apple, aber bewusst **keine Links** — es gibt
weder einen Play-Eintrag noch einen im App Store. Neben jedem Abzeichen steht deshalb ein
Statuswort („in Kürze" / „in Arbeit"): Beide Markenrichtlinien setzen voraus, dass das
Abzeichen auf den Store-Eintrag **zeigt**, und ohne diesen Zusatz behauptet es
Verfügbarkeit. Sobald die Einträge stehen, wird aus jedem `<div class="store-badge">` ein
`<a href="…">` und das Statuswort fällt weg. In **beiden** Sprachfassungen
(`home.html`, `en/home.html`). Zu finden mit:

```powershell
Select-String -Path web\home.html, web\en\home.html -Pattern 'store-badge'
```

**Woher die Abzeichen kommen und was an ihnen nicht verändert werden darf:**

| Datei | Quelle |
|---|---|
| `bilder/badge-google-play-de.png`, `-en.png` | `play.google.com/intl/<sprache>/badges/static/images/badges/<sprache>_badge_web_generic.png` |
| `bilder/badge-app-store-de.svg`, `-en.svg` | `toolbox.marketingtools.apple.com/api/v2/badges/download-on-the-app-store/black/<de-de\|en-us>` |

Beide sind **Marken ihrer Anbieter**, nicht unsere Gestaltung: nicht einfärben, nicht
verzerren, nicht nachzeichnen, nicht in eigene Rahmen setzen. Verändert wurde nur der
**transparente Rand** der beiden Play-Dateien — sie trugen unterschiedlich viel davon (die
deutsche nur oben und unten, die englische ringsum) und hätten bei gleicher CSS-Höhe
verschieden groß gestanden. Der von Google verlangte Freiraum kommt jetzt aus dem Layout
(Steg 16px bei 44px Abzeichenhöhe, also mehr als das geforderte Viertel; Apple verlangt ein
Zehntel).

Bis dahin hat der Block **keine** Handlung, und das ist Absicht: Ein Vormerken-Knopf stand
dort kurz und ist wieder raus — er sammelte Adressen für einen Verteiler, den es nicht gibt.

**Und die Stimmen auf der Startseite sind erfunden.** Die Bahn `#stimmen` trägt drei
Zitate, die es so nie gegeben hat; sie stehen als Beispiel, bis es echte gibt. Über ihnen lag
derselbe rote Hinweis wie im Impressum — er ist auf Wunsch entfernt worden, **die Pflicht
dahinter nicht**: Erfundene Bewertungen sind irreführende Werbung (§ 5b Abs. 3 UWG, seit
2022 ausdrücklich geregelt). Entweder echte Stimmen einsetzen — mit der Zustimmung der
Leute, deren Namen darunter stehen — oder die ganze Bahn entfernen. Seit der Hinweis weg
ist, steht das nur noch hier und als Kommentar im HTML; **`class="todo"` findet diese Stelle
nicht mehr.**

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
scrollen.js             weiches Scrollen mit dem Mausrad, auf jeder Seite
DESIGN.md               was auf der Startseite warum so gebaut ist
schrift/domine.ttf      die Schrift der App
schrift/OFL.txt         ihre Lizenz (SIL Open Font License 1.1)
bilder/logo.svg         das App-Logo, zugleich Favicon
bilder/logo-180.png     dasselbe fuer den iOS-Homescreen
bilder/app-*.webp       die vier Screenshots der Startseite
bilder/badge-*.png/svg  die offiziellen Store-Abzeichen (Marken von Google und Apple)
```

**`scrollen.js` ist die einzige Datei, die alle Seiten teilen und keine braucht.** Sie
laesst das Mausrad weich auslaufen; ohne sie scrollt die Seite wie jede andere. Eingebunden
ist sie auf den zehn Inhaltsseiten, **nicht** auf den beiden Bestaetigungsseiten: Die sind
zwei Saetze lang, es gibt dort nichts zu scrollen — und sie sind die Landung nach dem
Aktivierungslink, die so wenig wie moeglich laden soll. Was sie im Einzelnen tut und welche
vier Faelle sie ausnimmt, steht in ihrem Kopf und in `DESIGN.md`.

**Das Logo ist eine Datei fuer alles** (`bilder/logo.svg`): Marke im Kopf und Fuss jeder
Seite und zugleich `rel="icon"`. Seine Geometrie ist woertlich aus
`app/src/main/res/drawable/ic_launcher_foreground.xml` uebernommen — Ring um (54,52),
Spiegel um (54,54), derselbe Terracotta-Verlauf. Wer das App-Icon aendert, aendert diese
Datei mit, sonst tragen Store-Eintrag, Website und App drei verschiedene Zeichen. Bewusst
eine gemeinsame Quelle statt eines zweiten, inline gezeichneten Logos: Zwei Fassungen
laufen auseinander, und beim Icon faellt genau das nicht auf.

**Zwei Stylesheets, und das ist Absicht.** `stil.css` trägt die Tokens, `@font-face`,
**alles Gemeinsame** (Kopf, Marke, Sprachumschalter, Fokusring, Sprungmarke, Fuß) und die
Gestaltung der vier Rechtstexte — eine Spalte Fließtext auf 42rem. Die Startseite ist
seit dem Umbau eine eigene Welt und steht in `start.css`; sie lädt beide Dateien, in
dieser Reihenfolge. Hätte die Startseite in `stil.css` mitgemischt, änderte jeder
Handgriff an ihr zugleich Datenschutzerklärung, Impressum, AGB und Löschweg — an denselben
Klassennamen, ohne dass es jemandem auffällt.

**Die Rechtsseiten tragen dieselbe Gestaltung wie die Startseite** (seit 15.08.2026).
Vorher hatten sie einen eigenen, älteren Auftritt: die Marke in gesperrten
Terracotta-Versalien, einen unbeweglichen Kopf und darunter eine blasse Linkzeile als Fuß.
Wer aus der App auf die Datenschutzerklärung tippte, landete auf einer Seite, die mit der
Startseite nur die Schrift gemein hatte. Geblieben ist der Unterschied, der einen Grund
hat: **die Lesespalte auf 42rem.** Ein Rechtstext wird gelesen, keine Bahn ist breiter als
nötig.

Was dabei aus `start.css` nach `stil.css` gewandert ist und dort für **alle** Seiten gilt:
`:focus-visible`, `::selection`, `.sprung`, `.marke`, `.sprachen` und der komplette Fuß
(`.seitenfuss`). Wer eines davon ändert, ändert es überall — das ist der Zweck.

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

Die Bestätigungsseite lud die Schrift früher über `fonts.googleapis.com`. Damit ging die
IP-Adresse jedes Besuchers ohne Einwilligung an Google — der Fall, den das LG München I 2022
entschieden hat (Az. 3 O 17493/20) und der seitdem massenhaft abgemahnt wird. Auf einer
**Datenschutzerklärung** wäre das besonders schlecht.

Die Schriftdatei ist deshalb eine Kopie aus der App
(`shared/src/commonMain/composeResources/font/domine_variable.ttf`) und liegt unter
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
  `fonts.googleapis.com` oder `fonts.gstatic.com` stehen. Die Schrift muss von `localhost`
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
