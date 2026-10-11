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

## Der App Link für geteilte Rezepte

Seit Migration 026 gibt es `r/index.html` — die Landung eines geteilten Rezept-Links
(`https://reelgusto.de/r/?c=<code>`). Sie sieht nur, **wer die App nicht hat**: Auf einem
Android-Gerät mit installierter App fängt der App Link den Tipp ab.

Dazu gehören zwei Dateien, die leicht übersehen werden, weil sie mit einem Punkt beginnen:

- **`.well-known/assetlinks.json`** — Android holt sie beim Installieren und sucht darin
  die Signatur der App. Sie muss die SHA-**256**-Fingerabdrücke **aller** Signaturen
  tragen: Debug je Entwicklungsrechner, Upload-Key und Googles App signing key. Fehlt
  einer, landet der Link auf dieser Seite statt in der App — **ohne Fehlermeldung**. Das
  Feld ist ein Array, mehrere Einträge nebeneinander sind der Normalfall. (In
  `docs/google-login-einrichten.md` stehen nur SHA-**1**-Werte; die braucht der
  Google-Login, hier helfen sie nicht.)

  Stand 21.09.2026 stehen fünf Einträge drin: `45:2B…` ist Googles App signing key (vom
  Pixel 9 mit der Store-Fassung abgelesen — **der** Eintrag, ohne den ein Store-Nutzer
  nie in der App landet), `76:71…` der Upload-Key aus dem Windows-Keystore, `4B:BF…`
  der Debug-Schlüssel des Windows-Rechners, `C6:68…` und `88:6E…` kamen vom Mac.

  Eigener Debug-Schlüssel:

  ```
  keytool -list -v -keystore ~/.android/debug.keystore -storepass android | grep SHA256
  ```

  **Die Store-Signatur steht in der Play Console — der Menüpfad dorthin ist aber ein
  bewegliches Ziel.** „Release → Setup → App Integrity" stimmt seit dem Umbau 2026 nicht
  mehr; gesucht wird heute eher unter *Protected with Play → Play Store protection →
  Manage Play app signing* (Stand 21.09.2026, aus einer Fremdquelle — Googles eigene
  Hilfe nennt noch den alten Pfad). Dort stehen **zwei** Blöcke: *App signing key
  certificate* (Googles Schlüssel — der zählt für eine Installation aus dem Store) und
  *Upload key certificate* (für eine direkt per `adb` installierte Release-APK).

  **Verlässlicher als jede Console-Navigation ist das Gerät selbst.** Die Zeile
  `Signatures:` aus

  ```
  adb shell pm get-app-links de.reelgusto.app
  ```

  nennt genau den Fingerabdruck, den Android für die dort installierte Fassung erwartet -
  unabhängig davon, wie die Play Console ihre Menüs gerade nennt. Dieselbe Ausgabe zeigt
  darunter, ob die Zuordnung greift (`verified`).

  **Ohne Gerät prüft man die Datei bei Google selbst:**

  ```
  curl "https://digitalassetlinks.googleapis.com/v1/statements:list?source.web.site=https%3A%2F%2Freelgusto.de&relation=delegate_permission%2Fcommon.handle_all_urls"
  ```

  Das ist derselbe Dienst, den Android benutzt. Kommen die Fingerabdrücke sauber zurück,
  sind Syntax und Auslieferung in Ordnung (geprüft 21.09.2026). Er antwortet mit
  `maxAge: 3600s` — **eine Änderung an der Datei sieht ein Gerät also bis zu eine Stunde
  lang nicht**, was eine Fehlersuche leicht in die falsche Richtung schickt.

  **Und das Gerät merkt sich ein Scheitern noch hartnäckiger:** Nachdem die Datei bei
  Google schon alle Fingerabdrücke zeigte, blieb das Pixel 9 auch nach mehrfachem
  `pm verify-app-links --re-verify` bei `1024` (= fehlgeschlagen), ohne eine Zeile im
  Logcat. Für das Testgerät hilft nur die Freigabe von Hand — dasselbe, was der Nutzer
  unter „Standardmäßig öffnen“ tut:

  ```
  adb shell pm set-app-links --package de.reelgusto.app 2 reelgusto.de
  ```

  Neue Installationen prüfen frisch und kommen mit der korrigierten Datei durch
  (21.09.2026).

- **`.well-known/apple-app-site-association`** — dasselbe für iOS, **ohne Dateiendung**
  (Apple verlangt genau diesen Namen). Enthält die AppID
  `395XMN7656.de.reelgustoapp.app` und beschränkt sich auf den Pfad `/r/*`: Startseite,
  Rechtstexte und die Bestätigungsseite gehören weiterhin in den Browser.

  **GitHub Pages liefert sie als `application/octet-stream` aus**, obwohl Apples Doku
  `application/json` verlangt — und es funktioniert trotzdem: iOS holt die Datei nicht
  selbst, sondern über Apples CDN, und das ist beim Content-Type nicht streng. Geprüft
  am 21.09.2026 mit

  ```
  curl https://app-site-association.cdn-apple.com/a/v1/reelgusto.de
  ```

  Das ist auch der Weg, um eine Änderung zu kontrollieren: Das CDN cached, die eigene
  Datei kann also längst neu sein, während iOS noch die alte sieht.

- **`.nojekyll`** — **Pflicht.** GitHub Pages fährt Jekyll, und Jekyll unterschlägt jeden
  Ordner mit führendem Punkt. Ohne diese Datei liefert `/.well-known/assetlinks.json`
  einen 404 und die Verifikation scheitert lautlos.

Nach dem Rollout prüfen: `https://reelgusto.de/.well-known/assetlinks.json` muss im
Browser JSON liefern, und auf dem Gerät muss
`adb shell pm get-app-links de.reelgusto.app` „verified" zeigen.

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
(`index.html`, `en/index.html`). Zu finden mit:

```powershell
Select-String -Path web\index.html, web\en\index.html -Pattern 'store-badge'
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
index.html              Startseite (de)         en/index.html
datenschutz/            Datenschutzerklärung    en/privacy/
agb/                    Nutzungsbedingungen     en/terms/
impressum/              Impressum               en/legal-notice/
konto-loeschen/         Löschweg ohne App       en/delete-account/
stil.css                Tokens, Schrift und die Rechtsseiten
start.css               nur die Startseite
scrollen.js             weiches Scrollen mit dem Mausrad, auf jeder Seite
DESIGN.md               was auf der Startseite warum so gebaut ist
schrift/nunito.woff2    Ueberschriften und Titel, Subset aus der App
schrift/inter.woff2     Fliesstext, Labels und Zahlen, Subset aus der App
schrift/OFL.txt         ihre Lizenz (SIL Open Font License 1.1, fuer beide)
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
fuenf Faelle sie ausnimmt, steht in ihrem Kopf und in `DESIGN.md`. **Auf macOS haelt sie sich
ganz heraus** — dort smootht schon das System jede Eingabe, und beides uebereinander liess die
Seite beim Auslaufen hoch und runter springen.

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

**Die Wurzel ist die Startseite** (`index.html`, `en/index.html`) — seit dem 11.09.2026,
mit der eigenen Domain. Vorher lag dort die Bestätigungsseite, weil Supabases Site URL auf
die Wurzel zeigte und ein Aktivierungslink nicht auf einer Werbeseite landen darf. Jetzt
zeigt die Site URL auf `https://reelgusto.de/confirmed/`; die Bestätigungsseite liegt nur
noch dort. Die Seiten verweisen aufeinander als Verzeichnis (`../`, `../en/`), nicht als
Datei — so bleibt der Aufbau auch, wenn eine Seite einmal umzieht.

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

Unter `schrift/` liegen deshalb **woff2-Subsets der beiden Variable Fonts aus der App**
(`nunito.woff2`, `inter.woff2`) — Nunito trägt Überschriften und Titel, Inter den
Fließtext, genau wie `ui/theme/Type.kt`. Erzeugt von `tools/web_schrift_subset.py`, das
Ergebnis ist eingecheckt; das Skript läuft nur, wenn die Schrift der App wechselt.

Bis zum 10.10.2026 lag hier **Domine** als nackte 360-KB-TTF, und darunter trug die Seite
schlicht die System-Sans des Geräts — also weder dieselbe Überschriftenschrift wie die App
noch überhaupt eine entschiedene für den Text. Die Subsets wiegen zusammen **120 KB** und
tragen trotzdem zwei Schriften statt einer; die damalige Notiz („ein woff2-Subset wäre
kleiner, ist aber eine Optimierung, keine Voraussetzung") gilt nicht mehr: Zwei volle
Variable-TTFs wären 1,1 MB gewesen.

**Zwei Dinge müssen beim Wechsel zusammenpassen**, und keines davon meldet sich von selbst:

- **Die `font-weight`-Spanne in `stil.css` und der Achsenbeschnitt im Skript.** Das Skript
  schneidet Nunito auf 500–700 und Inter auf 400–600. Eine weiter angegebene Achse lässt
  den Browser Gewichte versprechen, die die Datei nicht mehr hat; eine enger angegebene
  lässt ihn selbst fälschen.
- **Kein Gewicht über 600 im Fließtext.** Vier kleine Labels der Startseite standen auf 700
  (`.schritte .nr`, `.store-status`, `.plan-liste b`, `.takt-sparen`) und stehen jetzt auf
  600 — die Rolle, die die App dafür hat (`labelLarge`). Über 600 geht nur Nunito.

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
  --screenshot=desktop.png "http://localhost:8000/"
```

**Für die Handybreite taugt `--window-size=390,…` nicht** — das Fenster hat unter Windows
eine Mindestbreite, und der Screenshot beschneidet dann eine breiter gerenderte Seite. Das
sieht wie ein Überlauf aus, der keiner ist. Verlässlich ist eine Hilfsseite, die
`index.html` in einem `<iframe width=390>` lädt, und ein Screenshot davon.

Interne Links lassen sich ohne Server prüfen — das Skript dafür steht in der
Commit-Historie zu diesem Ordner.

## Eintragen nach dem Ausrollen

| Wo | Was |
|---|---|
| Supabase → Auth → Site URL | bleibt `…/kochbuch-web/` (dort liegt die Bestätigungsseite) |
| Play Console → Store-Eintrag | `…/kochbuch-web/datenschutz/` |
| Play Console → Datenlöschung | `…/kochbuch-web/konto-loeschen/` |
| App → `LegalLinks.kt` | dieselben URLs, dort liegen sie als Konstanten |
