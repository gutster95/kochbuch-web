# Die Gestaltung der Startseite

Beschreibt, was in `start.css` und `home.html` **tatsächlich gebaut** ist — nicht, was
einmal geplant war. Für die Rechtsseiten gilt weiterhin `stil.css`; die beiden Welten
teilen sich nur die Tokens.

## Die Idee dahinter

**Die Seite zeigt die Verwandlung, statt sie zu behaupten.** Links die geteilte Caption
mit Emojis, Hashtags und Mengen mitten im Satz, rechts das fertige Rezept mit Gruppen,
Mengenspalte und nummerierten Schritten. Das ist der einzige Teil des Produkts, den keine
andere App so hat, und er ist in einem Blick zu erfassen.

Was bewusst **nicht** gebaut ist: die Wand aus sechs gleich großen Kacheln aus Symbol,
Überschrift und zwei Zeilen Text. Sie ist der Normalfall dieser Kategorie (auch bei der
Vorlage, an der wir uns orientiert haben), und sie gewichtet alles gleich — also nichts.
Die Funktionen stehen stattdessen als drei ungleiche Züge mit je einem Gerät, und die vier
kleineren Wahrheiten als eine einzige Zeile darunter.

## Farbe

Die Palette ist die der App (`ui/theme/Color.kt`), aber **nicht in ihrer leisesten
Lesart**: Eine Seite, die durchgehend auf Sand steht und Terracotta nur in Knöpfen zeigt,
sähe aus wie ein Rechtstext mit Bildern. Deshalb tragen zwei Bahnen die volle Sättigung:

| Bahn | Fläche | Text darauf |
|---|---|---|
| Held, Funktionen, Schluss | `--sand-50`, im Held zwei sehr weiche Farbkreise aus `--clay-100` und `--sage-100` | `--ink-900` / `--ink-700` |
| Die Verwandlung | `--ink-900`, ganzflächig | `#F3EBE2`, sekundär `#C4B2A4` |
| Der Preis | Verlauf `--clay-600` → `#8E3A1E` → `#6F2712` | `--sand-50`, sekundär `#FADFCF` |
| Fuß | `--ink-900` | wie die Verwandlungsbahn |

**Sekundärtext auf farbigem Grund ist nie grau**, sondern aus dem Ton der Fläche gezogen —
dieselbe Begründung wie bei `ShadowTint` in `Color.kt`.

**Knöpfe stehen in `--clay-600`, nicht in `--clay-500`.** Weiß auf Clay500 kommt auf
4,4 : 1 und liegt damit unter der Schwelle für Text dieser Größe; Clay600 hält 6,3 : 1.
Aus demselben Grund läuft der Preisverlauf ins Dunkle statt ins Warme: Auf dem hellen Ende
wären die Fließtextzeilen darunter nicht mehr sicher lesbar.

## Schrift

Fraunces trägt **ausschließlich** Überschriften, Rezepttitel, Marke und Preise — genau wie
in der App (`ui/theme/Type.kt`). Fließtext, Label und Zahlen stehen im System-Sans. Vier
Größen reichen auch hier: `h1` bis 4,25rem (`clamp`), `h2` bis 2,85rem, `h3` 1,3rem,
Fließtext 1rem mit einem größeren Vorspann bei 1,2rem.

## Bauteile

- **`.bahn`** — 74rem statt der 42rem der Rechtsseiten. Dort wird gelesen, hier geschaut,
  und ein Gerät neben einer Textspalte braucht Platz.
- **`.telefon` / `.schirm-bild`** — im Rahmen stehen **echte Screenshots** vom Pixel 9
  (`bilder/app-*.webp`, 1080×2424). Vorher war der Bildschirminhalt HTML in der Gestaltung
  der App: rund hundert Zeilen Nachbau je Screen, die bei jeder Änderung an der echten App
  still veralteten — und niemand hätte es gemerkt, weil die Seite ja weiterhin hübsch aussah.

  **Abgebildet ist ein eigens angelegtes Demo-Kochbuch, nicht das echte.** Im echten stehen
  fremde Instagram-Bilder samt `@handle`; die auf eine Werbeseite zu stellen wäre eine
  öffentliche Zugänglichmachung fremder Werke (§ 19a UrhG) — genau das, wogegen Migration 013
  die Buckets privat gemacht hat. Die Fotos der Demo-Rezepte kommen von Pexels (kostenlos,
  kommerziell nutzbar, ohne Namensnennung).

  Zwei Stellen im vierten Bild sind **nachträglich ersetzt**: der Einladungscode (der echte
  war sieben Tage gültig — ein gültiger Code auf einer öffentlichen Seite ist ein Zugang zum
  eigenen Kochbuch) und Bild wie Name des verknüpften Kontos (eine reale Person, die dem
  nicht zugestimmt hat). Wer die Bilder neu erzeugt, muss beides wieder ersetzen.
- **`.blatt-roh` / `.blatt-rezept`** — die zwei Seiten der Verwandlung.
- **`.zug`** — ein Funktionsabschnitt, jeder zweite gedreht (`.zug-gedreht`).
- **`.rechts-zeile`** — die Pflichtlinks als Liste statt als Kachelwand.

## Symbole

Alle Icons sind **selbst gezeichnete SVG** in einer Strichstärke (1,6) und liegen als
`<g id="i-…">` in einem versteckten `<svg>` am Anfang des Dokuments, referenziert über
`<use href="#i-…">`. **Keine Emoji als Symbol** — die App benutzt sie für Kategorien, auf
einer Website sind sie Systemschrift und sehen auf jedem Gerät anders aus.

## Bewegung

**Ein orchestrierter Moment, nicht Effekte an jedem Abschnitt:** Beim ersten
Sichtbarwerden läuft das fertige Rezept Zeile für Zeile ein, in derselben Reihenfolge, in
der die App es erzeugt (`--i` je Stufe, 65 ms Versatz, `cubic-bezier(0.16, 1, 0.3, 1)`).

Der Grundzustand ist **sichtbar**. Die Klasse `.laeuft`, die den Inhalt erst ausblendet,
setzt das Skript selbst — ohne JavaScript, ohne `IntersectionObserver` und bei
abbestellter Bewegung steht alles einfach da. Was ein fehlgeschlagenes Skript ausblendet,
sieht niemand wieder.

Dazu kommt genau eine zweite Regung: Der Kopf bekommt seinen Rand erst, wenn wirklich
etwas darunter durchläuft.

## Der Ton der Texte

**Kein Satz endet mit einer Pointe, nur weil er sonst zu Ende wäre.** Die erste Fassung
trug in 685 Wörtern **13 Gedankenstrich-Einschübe** — fast jeder Absatz war nach demselben
Muster gebaut: Aussage, Gedankenstrich, Zuspitzung. Einzeln liest sich das gut, dreizehnmal
hintereinander klingt es nach einer Maschine, die gelernt hat, wie Cleverness aussieht.
Jetzt sind es zwei, und beide sitzen dort, wo ein Gedankenstrich hingehört (Seitentitel und
Preisangabe).

Drei Regeln, die daraus folgen und beim Weiterschreiben gelten:

- **Kein Dreiklang als Schluss.** „Kein Abtippen, kein Zurückspulen, kein
  Screenshot-Friedhof" nennt zwei echte Vorteile und ein Wortspiel. Geblieben sind die
  zwei echten.
- **Keine Überschrift, die erst entschlüsselt werden will.** „Das Kleingedruckte, groß
  genug" heißt jetzt „Datenschutz und Rechtliches". Wer diese Zeile sucht, sucht das Wort,
  nicht den Einfall.
- **Konkret schlägt allgemein.** „übersetzt, was fremdsprachig ist" → „übersetzt, was auf
  Englisch oder Italienisch dasteht". „wenn niemand entscheiden will" → „wenn ihr euch
  nicht einigen könnt".

Was **nicht** geändert wurde: die Überschriften, die schon eine Sache beim Namen nennen
(„Aus einem Reel wird ein Rezept", „Beim Kochen bleibt der Bildschirm an", „Die ersten 15
Rezepte gehen aufs Haus"). Sie sind konkret, nicht klug.

## Barrierefreiheit

Durchgerechnet, nicht geschätzt — alle Text-auf-Fläche-Paare der Seite gegen WCAG AA:

| Stelle | Vorher | Jetzt |
|---|---|---|
| Hashtags im Rohtext (`#8C7C6E`) | 3,97 : 1 | `#9C8C7E`, 4,91 : 1 |
| Fokusring in Fuß und dunkler Bahn | 2,74 : 1 | `--clay-warm`, 8,0 : 1 |
| Fokusring auf der Preisfläche | 1,2 : 1 | `--sand-50`, 5,0 : 1 |

Der Fokusring ist der Punkt, den man am leichtesten übersieht: Er wird einmal global
gesetzt und dann nie wieder angeschaut — auf zwei von fünf Bahnen war er praktisch
unsichtbar, und die Fußzeile ist die linkreichste Stelle der Seite.

Dazu drei Dinge, die kein Kontrastwert meldet:

- **Die Sprungmarke** (`.sprung`) steht vor der Kopfzeile. Ohne sie tabbt man durch Marke,
  drei Anker und zwei Sprachen, bevor der erste Satz kommt — auf jeder Unterseite erneut.
- **Tippflächen**: Der Sprachumschalter war rund 20 px hoch, die Fußzeilen-Links 26 px.
  Beide sitzen jetzt auf mindestens 40 px, und auf dem Telefon sind die Fußzeilen-Links die
  **einzigen** sichtbaren Navigationslinks — die Kopfzeile blendet ihre unter 60rem aus.
- **`scroll-behavior: smooth`** gilt nur noch bei `prefers-reduced-motion: no-preference`.
  Ein Sprung über die halbe Startseite ist genau die Bewegung, die bei vestibulären
  Beschwerden Übelkeit auslöst.

**Die Überschriftenstufen im Rezeptblatt sind `h3`, nicht `h4`** — vorher sprang die
Gliederung von `h2` direkt auf `h4`. Sie brauchen deshalb eine eigene Regel: Das Blatt ist
hell, liegt aber **innerhalb** der dunklen Bahn, und `.band-dunkel h3` färbte die beiden
Zeilen sonst hell auf Sand. Als `h4` entgingen sie dieser Regel zufällig.

## Was die Rechtsseiten davon übernehmen

Seit dem 15.08.2026 tragen Datenschutzerklärung, AGB, Impressum und der Löschweg denselben
Auftritt — Kopf, Marke, Sprachumschalter, Fokusring, Sprungmarke und Fuß stehen deshalb in
`stil.css` und nicht mehr hier. Was **nicht** übernommen wurde, ist die Breite: Ein
Rechtstext bleibt auf 42rem, die Startseite auf 74rem. Ein Gerät neben einer Textspalte
braucht Platz, ein Absatz Fließtext nicht.

Drei Dinge waren dabei mehr als Kosmetik:

- **Jeder Link in den Rechtstexten stand auf `--clay-500`** und damit auf 4,25 : 1, in
  einer Karte sogar auf 3,94 : 1. Das betraf ausgerechnet die Seiten, die im
  Play-Eintrag verlinkt sind. Sie stehen jetzt auf `--clay-600` (6,05 : 1).
- **Einen Fokusring hatten sie gar nicht.** Er war nur in `start.css` definiert; die
  Rechtsseiten erbten den des Browsers, der auf hellem Sand kaum zu sehen ist.
- **Der Kopf klebt jetzt.** Die Datenschutzerklärung ist knapp 400 Zeilen lang, und der Weg
  zurück zur Startseite war vorher nur ganz oben erreichbar. Dafür musste
  `scroll-margin-top` an den Überschriften von 24 px auf 84 px — sonst verschwindet das
  Sprungziel aus dem Inhaltsverzeichnis unter dem Kopf.

## Was leicht kaputtgeht

- **`.tarif span` gegen `.tarif-sparen`.** Der Sparen-Chip ist ein `span` in `.tarif`, und
  `.tarif span { color: … }` ist spezifischer als eine Klasse allein — der Chip stand
  einmal in der Fließtextfarbe auf seiner weißen Fläche. Deshalb `.tarif .tarif-sparen`.
- **Die Höhe der Geräte.** Das Seitenverhältnis bringt seit dem Umstieg auf Screenshots
  das Bild selbst mit (`width`/`height` am `<img>`, dazu `aspect-ratio: 1080 / 2424`); der
  Rahmen richtet sich danach. Ein `aspect-ratio` am `.telefon` wäre falsch: Das Polster von
  10 px zählt mit, das Bild säße dann leicht verzerrt darin. Screenshots von einem Gerät mit
  anderem Verhältnis brauchen deshalb auch eine neue Regel in `.schirm-bild`.
- **Zwei Sprachfassungen.** `home.html` und `en/home.html` tragen denselben Aufbau
  wörtlich. Wer eine Sektion ändert, ändert beide — ein Skript prüft das nicht.
- **Die Tarifzeile bricht schmal um.** `.tarif` ist ein Grid aus drei Spalten (Preis,
  Erläuterung, Sparen-Chip). Unter 34rem wandert die Erläuterung in eine zweite Zeile,
  sonst stand der Chip mitten im Satz: „im Jahr, also 2,39 € im **[−20 %]** Monat".
- **`stil.css` zuerst, `start.css` danach.** Tokens, `@font-face` und der Reset stehen in
  der ersten Datei; die zweite baut darauf auf und überschreibt `.marke`. Dreht man die
  Reihenfolge um, steht die Marke wieder in Versalien und Terracotta.
