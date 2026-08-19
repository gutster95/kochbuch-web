# Die Gestaltung der Startseite

Beschreibt, was in `start.css` und `home.html` **tatsächlich gebaut** ist — nicht, was
einmal geplant war. Für die Rechtsseiten gilt weiterhin `stil.css`; die beiden Welten
teilen sich nur die Tokens.

## Die Idee dahinter

**Die Seite zeigt die Verwandlung, statt sie zu behaupten.** Links die geteilte Caption
mit Emojis, Hashtags und Mengen mitten im Satz, rechts das fertige Rezept mit Gruppen,
Mengenspalte und nummerierten Schritten. Das ist der einzige Teil des Produkts, den keine
andere App so hat, und er ist in einem Blick zu erfassen.

**Und die Seite führt zum Holen.** Sie hatte bis zum 17.08.2026 genau eine Handlung, und
die stand ganz oben im ersten Bild: Wer weiterlas, konnte danach nirgends mehr etwas tun.
Jetzt trägt der Kopf auf jeder Scrollhöhe denselben Knopf, das erste Bild nennt den Preis,
und die letzte Bahn ist der Holen-Block — Angebot und Preis in einer Fläche.

**Die Bahn „Datenschutz und Rechtliches" ist dafür ersatzlos entfallen.** Sie stand
zwischen Preis und Fuß und nahm den Platz ein, an dem der Besucher die App holen sollte.
Die vier Seiten stehen weiterhin im Fuß jeder Seite, Kontolöschung eingeschlossen; Play
verlangt eine öffentlich erreichbare URL, keine prominente.

Der Aufbau ist damit: erstes Bild → **die vier Gründe** → **Preis** → die Verwandlung →
drei Funktionen mit Gerät → **Stimmen**.

**Der Preis steht an dritter Stelle, nicht am Ende.** Er stand zuerst ganz unten, und das
war die falsche Reihenfolge: Wer wissen will, was etwas kostet, sucht es zuerst — und wer
es erst nach fünf Bahnen Begeisterung findet, liest es als das, was verschwiegen werden
sollte. Die Ausführlichkeit (Verwandlung, Funktionen) kommt danach; sie ist für die, die
nach dem Preis noch da sind.

Was bewusst **nicht** gebaut ist: die Wand aus sechs gleich großen Kacheln aus Symbol,
Überschrift und zwei Zeilen Text. Sie ist der Normalfall dieser Kategorie (auch bei der
Vorlage, an der wir uns orientiert haben), und sie gewichtet alles gleich — also nichts.
Die Funktionen stehen stattdessen als drei ungleiche Züge mit je einem Gerät.

**Die vier Gründe sind die eine Ausnahme davon, und sie ist bewusst gesetzt.** Sie standen
vorher als Vierzeiler ganz unten in der Funktionsbahn — 20px-Symbol, eine Zeile Text — und
wurden dort überblättert. Zwei davon waren ohnehin keine Gründe: Kategorien und Favoriten
hat jede Rezept-App, sechs Sprachen merkt nur, wer eine davon spricht. An ihre Stelle sind
die beiden getreten, die sonst niemand hat: der geteilte Wochenplan und das **verknüpfte
Kochbuch**. Vier gleiche Spalten, zentriert, ohne Karte, ohne Rahmen, ohne Ordnungsziffer —
ein erster Anlauf hatte Kacheln mit Füllfarbe, Kreis hinter dem Symbol und einer großen
„01" daneben und sah aus wie vier Behauptungen, die um Aufmerksamkeit rangen. Das Gewicht
des wichtigsten Punktes kommt aus der **Reihenfolge**: Er steht vorn, und sein Beleg mit
Bildschirmfoto folgt direkt darunter als erster Zug.

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

**Sekundärtext auf farbigem Grund ist nie grau**, sondern aus dem Ton der Fläche gezogen.

**Der Auftritt wirft keine Schatten.** Es lagen sieben `box-shadow`-Regeln auf den Seiten —
unter beiden Knopfarten, zweifach unter dem Telefonrahmen, unter der Rezeptkarte, unter der
Premium-Karte und unter den Karten der Rechtsseiten. Sie ließen die Bauteile über dem Grund
schweben, statt die Seite als Fläche zu lesen; auf warmem Sand wird ein weicher schwarzer
Schatten überdies grau, nicht dunkler. Getrennt wird jetzt über **Rand und Flächenton**, und
das trug ohnehin schon: helle Karte auf dunkler Bahn, hellere Karte neben blasserer, Rand um
die Rechtsseiten-Kästen. Geblieben ist eine einzige Regel, und sie ist kein Schatten — die
Lichtkante **innen** an der Oberkante des Telefonrahmens (`inset`); ohne sie ist der Rahmen
ein schwarzes Rechteck. `--shadow` (aus `ShadowTint` in `Color.kt`) trug danach nichts mehr
und ist mitgegangen.

**Knöpfe stehen in `--clay-600`, nicht in `--clay-500`.** Weiß auf Clay500 kommt auf
4,4 : 1 und liegt damit unter der Schwelle für Text dieser Größe; Clay600 hält 6,3 : 1.
Aus demselben Grund läuft der Preisverlauf ins Dunkle statt ins Warme: Auf dem hellen Ende
wären die Fließtextzeilen darunter nicht mehr sicher lesbar.

## Schrift

Domine trägt **ausschließlich** Überschriften, Rezepttitel, Marke und Preise — genau wie
in der App (`ui/theme/Type.kt`). Bis zum 15.08.2026 stand hier Fraunces; gewechselt wurde
in der App, und die Website zieht mit, weil sonst Store-Eintrag, Website und App nach drei
Produkten aussehen. Domine deckt die wght-Achse nur von 400 bis 700 ab — die Serife steht
überall auf 600, das reicht. Fließtext, Label und Zahlen stehen im System-Sans. Vier
Größen reichen auch hier: `h1` bis 5,25rem (`clamp`), `h2` bis 2,5rem, `h3` 1,2rem,
Fließtext 1rem mit einem größeren Vorspann bei 1,2rem.

**Der Abstand zwischen den Ebenen war zu klein.** Bis zum 17.08.2026 standen sie auf
68/45,6/20,8px, also 3,3 : 2,1 : 1. Eine `h2` auf zwei Dritteln der `h1` liest sich nicht
als nächste Ebene, sondern als zweite Hauptzeile — die Seite hatte damit sechs gleich laute
Überschriften und keine Spitze. Jetzt 84/40/19,2px, also **4,4 : 2,1 : 1**.

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
- **`.blatt-roh` / `.blatt-rezept`** — die zwei Seiten der Verwandlung, gleich hoch
  (`align-items: stretch`) und mit derselben Kopfzeile aus Marke und Haarstrich
  (`.blatt-kopf`). Vorher war links ein grauer Textblock und rechts eine gebaute Karte: zwei
  Dinge, die nichts miteinander zu tun zu haben schienen. Der Bahnenkopf darüber steht
  **zentriert** — er war der einzige linksbündige der Seite und zog eine symmetrische Bahn
  nach links.
- **`.pfeil`** — dazwischen, mit je einem Haarstrich nach links und rechts, damit er nicht
  zwischen den Blättern schwebt, sondern das eine ins andere führt. Er zeigt in **eine**
  Richtung: Hier stand ein Doppelpfeil, und der behauptete, die Verwandlung liefe auch
  rückwärts — aus dem Rezept wieder eine Caption. Hochkant dreht er samt Strichen um 90°.

  Weil beide Blätter verschieden hoch sind, saß der Pfeil vorher in der Mitte des
  **höheren**: Er zeigte auf halber Rezepthöhe los, während das linke Blatt darüber schon zu
  Ende war. Gleich hohe Blätter lösen das, ohne dass der Pfeil einen gerechneten Abstand
  braucht.
- **`.zug`** — ein Funktionsabschnitt, jeder zweite gedreht (`.zug-gedreht`).
- **`.staerke`** — eine der vier Spalten der Gründe-Bahn: 44px-Symbol in Clay, Überschrift,
  zwei Sätze, alles zentriert. Kein Hintergrund, kein Rand.
- **`.knopf-kopf`** — der Holen-Knopf im Kopf. Er braucht **zwei** Klassen im Selektor
  (`.kopf-nav .knopf-kopf`): `.kopf-nav a` in `stil.css` ist mit Element-Selektor
  spezifischer als `.knopf-voll` und gewinnt trotz später geladener Datei. Mit einer Klasse
  allein bekam der Knopf Farbe und Polsterung der Kopfzeilen-Anker (`4px 0`), und die
  Schrift stand links und rechts über die Pille hinaus.
- **`.plan` / `.plan-voll`** — die zwei Tarife nebeneinander: links kostenlos, rechts
  Premium. Die **bezahlte** Karte ist die **hellere**; auf einer Clay-Bahn ist Nähe zum
  Sand der Seite das Signal „das hier ist gemeint“. Sie trägt als einzige einen vollen Rand.

  Ersetzt hat das Paar zwei Dinge, die dieselbe Frage zweimal und keines davon vergleichend
  beantworteten: drei Preiszeilen untereinander (`.tarif`) und einen Kasten „Was ohne Abo
  bleibt“ (`.bleibt`).
- **Der Preis trägt „inkl. MwSt." in seiner eigenen Zeile.** Darunter stand ein Absatz
  Kleingedrucktes (`.preis-klein`: Steuer, automatische Verlängerung, Kündigung, „der
  endgültige Preis steht im Kaufdialog"); er ist auf Wunsch entfallen. Die PAngV verlangt
  bei Werbung mit Preisen gegenüber Verbrauchern den **Gesamtpreis einschließlich
  Umsatzsteuer** — deshalb steht die Angabe jetzt direkt an der Zahl und nicht weiter unten.
  Der Vertrag kommt ohnehin nicht hier zustande, sondern im Store; die Angaben zu Laufzeit
  und Kündigung macht der Kaufdialog.
- **`.takt-schalter`** — monatlich oder jährlich, ein Paar Radio-Knöpfe plus `:has()` und
  **kein JavaScript**. Beide Preise stehen im HTML, einer wird ausgeblendet. Ein Preis, den
  erst ein Skript einsetzt, ist bei abgeschaltetem JavaScript ein leeres Feld.

  Der Grundzustand zeigt den **Monatspreis**, also den höheren: Wo `:has()` fehlt, bleibt er
  stehen. Eine Anzeige, die zu niedrig fällt, wäre die falsche Richtung (PAngV). Die
  Eingaben sind nur optisch verborgen (`opacity: 0`, **nicht** `display: none`) — Letzteres
  nähme sie aus der Tabreihenfolge, und der Umschalter wäre mit der Tastatur nicht mehr zu
  bedienen.
- **`.store-badge`** — die beiden **offiziellen Abzeichen** von Google und Apple im
  Holen-Block, unverändert aus deren Markenportalen (Herkunft in `web/README.md`). Vorher
  standen hier selbst gezeichnete Zeilen aus Symbol, Wort und Statuswort; richtig, solange es
  die Einträge nicht gibt, aber ein Eigenbau bleibt ein Eigenbau.

  Sie sind weiterhin **keine Links**, und deshalb steht neben jedem, woran es gerade ist
  („in Kürze", „in Arbeit"): Beide Richtlinien setzen voraus, dass das Abzeichen auf den
  Store-Eintrag zeigt — ohne Statuswort behauptet es Verfügbarkeit. Beim Start wird aus
  jedem `<div>` ein `<a href="…">`, und die Statuswörter fallen weg.

  **44px Höhe für beide, und das ist gerechnet.** Die beiden Play-Dateien sind auf ihre
  sichtbare Fläche zugeschnitten — die deutsche trug nur oben und unten Rand, die englische
  ringsum, bei gleicher CSS-Höhe wären die Sprachfassungen verschieden groß gewesen. Der von
  Google verlangte Freiraum (ein Viertel der Abzeichenhöhe, bei Apple ein Zehntel) ist damit
  Aufgabe des Layouts und steckt im Steg von 16px.
- **`.stimme`** — drei Bewertungen als letzte Bahn vor dem Fuß, auf `--sand-100` statt auf
  dem Sand50 der Seite: Zwei helle Bahnen hintereinander (Funktionen, Stimmen) wären sonst
  eine einzige lange Fläche. Die Sterne sind **gefüllt** (`i-stern-voll`), nicht die offene
  Kontur — ein Umriss-Stern liest sich als „nicht vergeben“.

  **Die Sätze darin sind erfunden.** Über ihnen stand dafür derselbe rote Hinweis wie bei
  den offenen Angaben im Impressum; er ist auf Wunsch entfallen, die Sache dahinter nicht:
  Erfundene Bewertungen sind irreführende Werbung (§ 5b Abs. 3 UWG). Vor der
  Veröffentlichung durch echte Stimmen ersetzen oder die Bahn entfernen — was daran hängt,
  steht jetzt nur noch als Kommentar im HTML und in `web/README.md`.
- Die frühere **`.rechts-zeile`** (Pflichtlinks als Liste) ist mit der Rechtsbahn entfallen.
- Die frühere **`.leiste-details`** ist es auch: vier, zuletzt drei Kleinzeilen unter den
  Funktionen — sechs Sprachen, Kategorien und Favoriten, Suche über alles. Das sind
  Selbstverständlichkeiten, die jede Rezept-App hat, und die Bildschirmfotos darüber zeigen
  sie ohnehin.
- **`.knopf-weiss`** — der zweite Knopf im ersten Bild. Er war ein Umriss auf durchsichtigem
  Grund; auf dem alten Sandverlauf ging das, auf der Holzplatte des Fotos nicht: Die
  Maserung lief mitten durch die Schrift, und der Knopf sah aus wie ein Rahmen um nichts.
- Der **Vormerken-Knopf** (`mailto:`) unter den Store-Zeilen ist ebenfalls raus. Er sammelte
  Adressen für einen Verteiler, den es nicht gibt und nicht geben soll — und eine
  E-Mail-Adresse einzusammeln, ohne zu wissen, was man damit tut, ist der Anfang jedes
  Einwilligungsproblems.

## Symbole

Alle Icons sind **selbst gezeichnete SVG** in einer Strichstärke (1,6) und liegen als
`<g id="i-…">` in einem versteckten `<svg>` am Anfang des Dokuments, referenziert über
`<use href="#i-…">`. **Keine Emoji als Symbol** — die App benutzt sie für Kategorien, auf
einer Website sind sie Systemschrift und sehen auf jedem Gerät anders aus.

## Bewegung

**Vier Regungen, und jede hat einen Anlass im Inhalt.** Die Seite stand bis zum
19.08.2026 fast still — genau eine Animation (das einlaufende Rezept) und ein Rand am Kopf.
Das war die richtige Haltung gegen Effekte an jedem Abschnitt, aber es war eine zu wenig:
Zwischen zwei Bahnen passierte gar nichts, und die Seite las sich wie ein PDF, durch das man
scrollt.

| Regung | Wo | Was |
|---|---|---|
| Auftakt | erstes Bild | Zeile, Vorspann, Knöpfe steigen 20px auf (1,2 s; **200 / 650 / 850 ms**) |
| Auftritt | jede Bahn | 24px aufsteigen und einblenden (1,0/1,1 s), ausgelöst je **Gruppe** |
| Verwandlung | die dunkle Bahn | Caption (0 ms) → Pfeil (200 ms) → Rezeptzeilen (ab 420 ms, 95 ms je Zeile) |
| Der Pfeil im Knopf | „Kochbuch holen" | schiebt bei Hover und Fokus 3px nach rechts |

**Es bewegen sich ausschließlich `opacity` und `transform`.** Beide kann der Browser ohne
neues Layout auf die Grafikkarte legen; eine Animation auf `height`, `top` oder `width`
lässt die Seite bei jedem einzelnen Bild neu rechnen, und genau daran ruckelt eine
Startseite auf einem mittleren Telefon.

**Zwei Kurven, und der Unterschied ist der Grund für die zweite.** `--kurve` (expo) hat nach
einem Sechstel der Zeit schon die halbe Strecke hinter sich. Für einen Knopf unter dem Zeiger
ist das richtig — er soll auf den Griff sofort antworten. Ein ganzer Absatz, der so
hereinkommt, ist im selben Moment fast da und danach nur noch am Auslaufen: Er schnappt,
statt zu gleiten. Alles, was von selbst hereinkommt, läuft deshalb auf `--kurve-auftritt`
(ease-out-cubic) und rund eine Sekunde statt einer halben. Die Länge allein macht es nicht —
ein kurzer Weg über eine lange Zeit sieht nicht ruhig aus, sondern zäh; deshalb sind die Wege
mitgewachsen (24px statt 18).

**Das Headerfoto bewegt sich nicht.** Hier lag eine Kamerafahrt (`scale(1.06)` auf 1 über
1,6 s), und sie ist wieder raus: Das Foto **ist** das erste Bild, nicht seine Verzierung — ein
Grund, der sich beim Laden noch zurechtrückt, macht aus dem ruhigen Aufmacher eine Diashow.
Mit ihr ging das `overflow: hidden`, das nur sie gebraucht hat.

**`will-change` steht dauerhaft, und das ist der Unterschied zwischen sauber und ruckelnd.**
Solange eine Verschiebung oder eine Deckkraft läuft, zeichnet der Browser das Stück auf einer
eigenen Ebene: Text bekommt dort Graustufen-Glättung und darf um Bruchteile eines Pixels
versetzt liegen. Ist die Animation vorbei, fällt die Ebene weg — der Text wird noch einmal neu
gerastert, auf ganze Gerätepixel und mit der Subpixel-Glättung des normalen Textes. Das ist
der **Ruck am Ende jeder Bewegung**, und er trifft alle Texte; bei den großen Überschriften
fällt er nur am meisten auf. Die Bahnen stehen überdies auf krummen Positionen (gemessen:
894,31px), weil Höhen und Abstände aus `clamp()` und `vw` kommen — es geht also nicht nur um
Glättung, sondern auch um Rundung.

Drei Dinge daran sind leicht falsch zu machen:

- **Es gehört in den Grundzustand, nicht in die `.ist-da`-Regel.** Wer es erst zum Auftritt
  setzt, baut die Ebene mitten in der Bewegung auf und hat den Ruck an den Anfang verschoben.
- **`translate3d(0, 0, 0)` als Endwert tut es nicht.** Chrome rechnet die Matrix zu einer
  2D-Matrix zurück (nachgemessen: `matrix(1, 0, …)`), und die Ebene entfällt wieder. Die
  `translate3d`-Schreibweise steht trotzdem überall — sie schadet nicht und sagt, was gemeint
  ist.
- **Beide Eigenschaften brauchen dieselbe Dauer.** Standen sie auf 1 s und 1,1 s, lief die
  Verschiebung noch ein Zehntel weiter, nachdem der Text schon voll dastand: die letzten
  Bruchteile eines Pixels, also genau das, was man als Nachzucken sieht.

Der Preis ist Grafikspeicher, je Element eine Ebene. Bei den rund zwanzig Textblöcken dieser
Seite ist das vertretbar; bei `prefers-reduced-motion: reduce` wird es auf `auto`
zurückgenommen — ohne Bewegung verhindert es keinen Ruck, den es gar nicht gibt.

**Zwei Sicherungen, und beide sind wichtiger als der Effekt selbst:**

- **Was JavaScript ausblendet, blendet auch JavaScript wieder ein.** Die Klasse
  `.auftritt-an` steht auf `<html>` und wird vom Skript gesetzt, erst nachdem feststeht,
  dass es animieren darf. Ohne JS, ohne `IntersectionObserver` und bei abbestellter Bewegung
  steht die ganze Seite einfach da — was ein fehlgeschlagenes Skript ausblendet, sieht
  niemand wieder.
- **Was CSS ausblendet, steht in `prefers-reduced-motion: no-preference`** und läuft über
  `animation … backwards` statt über einen gesetzten Grundzustand. Der Auftakt im ersten Bild
  braucht deshalb kein Skript: Er ist beim Laden ohnehin sichtbar, ein Beobachter hätte dort
  nichts zu beobachten.

**Der Auftakt beginnt bei 200 ms, und die Zeile bekommt den Vortritt.** Bei 0 läuft er in
den Bildaufbau hinein und ist halb vorbei, bevor jemand hinsieht. Danach steht die Zeile
450 ms **allein**, ehe der Vorspann nachkommt; die Knöpfe folgen ihm nach 200 ms, denn sie
gehören zu ihm und nicht zur Zeile. Bei 150 ms Versatz lief alles praktisch gemeinsam — und
ein Auftakt, bei dem alles gleichzeitig kommt, ist keiner.

**Ein Mechanismus für alle Bahnen, kein Sondereffekt je Abschnitt.** Im HTML steht
`data-auftritt-gruppe` am Container und `data-auftritt` an dem, was sich bewegt; im CSS zwei
Regeln, im Skript ein Beobachter. Wer eine Bahn ergänzt, hängt die Attribute daran und ist
fertig; wer einen eigenen Effekt dafür schreibt, hat den zweiten Stil auf derselben Seite.

**Ausgelöst wird die Gruppe, nicht das Einzelteil.** Vorher hing jedes Teil an einem eigenen
Beobachter, und damit entschied seine Höhe im Fenster über den Zeitpunkt: Der Kopf einer Bahn
stand fertig da, während die Spalten darunter noch gar nicht angefangen hatten — die Bahn
zerfiel in zwei Ereignisse. Daraus folgt die Regel für `--i`:

- **Kopf über Inhalt** (Gründe, Stimmen): zeitgleich, also überall `--i:0`. Eine Überschrift,
  die vor ihrem Block kommt, liest sich als eigene Bahn.
- **Spalten nebeneinander** (Text | Gerät, Angebot | Tarife): ein Takt Versatz. Sie stehen
  ohnehin zusammen im Blick, und der Versatz sagt, was zuerst gelesen werden will. Die Geräte
  (`.zug-bild`) kommen zusätzlich aus `scale(0.96)`, weil Text und Beleg sonst als eine
  hochrutschende Fläche lesen.

**Was beim Laden schon angeschnitten ist, gehört zum Auftakt** (`.im-ersten-bild`, gesetzt
vom Skript). Unter dem Foto steht auf jedem Fenster ein Stück der nächsten Bahn im Bild;
wartete es auf den Beobachter, wäre es ein **leerer Streifen**, bis man ein gutes Stück
gescrollt hat. Es läuft deshalb im ersten Bild mit — und zwar zuletzt, bei 1000 ms, hinter
den Knöpfen (850 ms): Die Reihenfolge auf dem Schirm ist damit auch die der Bewegung.

Gemessen wird mit **einem Drittel Fensterhöhe Vorlauf**, und das ist nicht großzügig,
sondern nötig: Was man vom nächsten Block zuerst sieht, ist seine Polsterung — auf 900px
Fensterhöhe fängt sein Inhalt erst rund 30px **unter** der Kante an. Ohne Vorlauf zählte er
als „nicht im Bild", und der erste Zentimeter Scrollen zeigte wieder einen leeren Block.

Zwei Dinge daran gehen leicht kaputt:

- **`.ist-da` fällt erst zwei Bilder später.** Im selben Bild gesetzt, in dem `.auftritt-an`
  den ausgeblendeten Grundzustand überhaupt erst einführt, sieht der Browser keinen Wechsel
  und überspringt den Übergang — das Stück stünde hart da, statt mitzulaufen.
- **Daneben steht ein Timer (120 ms), und der ist keine Zierde.** In einem Hintergrund-Tab
  zeichnet der Browser keine Bilder, `requestAnimationFrame` kommt also nie — der
  angeschnittene Block bliebe unsichtbar, bis der Tab nach vorn geholt wird.

**Die Verwandlung bleibt die Ausnahme**: Ihr Kopf und ihr Block lösen einzeln aus. Der Block
ist auf dem Telefon höher als das Fenster, und mit dem Kopf ausgelöst wäre seine Choreografie
abgelaufen, bevor man das erste Blatt sieht.

**Der Beobachter arbeitet mit `rootMargin`, nicht mit `threshold`.** Ein Schwellwert in
Prozent wartet bei einer Bahn, die höher ist als das Fenster, auf etwas, das nie eintritt;
`0px 0px -12% 0px` löst aus, sobald ein Stück im Bild steht — unabhängig von der Höhe. (Der
frühere `threshold: 0.25` galt nur dem Verwandlungsblock und ging deshalb gerade noch gut.)

**Die Verwandlung ist der orchestrierte Moment und behält ihre eigene Reihenfolge.** Die
220 ms Vorlauf vor der ersten Rezeptzeile sind der Punkt: Ohne sie liefen Pfeil und Rezept
gleichzeitig, und die Bahn sagte „hier sind zwei Blätter" statt „aus dem einen wird das
andere".

**Der Pfeil selbst bekommt kein `transform`** — unter 62rem trägt er `rotate(90deg)`, und ein
zweiter Wert an derselben Eigenschaft löscht die Drehung. Bewegt wird das SVG darin; hochkant
zeigt sein Vorschub dadurch von selbst nach unten. Die beiden Haarstriche wachsen über
`scaleX` **zum** Pfeil hin (`transform-origin` außen), nicht von ihm weg.

**Weiches Scrollen mit dem Mausrad, auf jeder Seite** (`web/scrollen.js`, eingebunden auf
allen zehn Inhaltsseiten). Ein Radschritt setzt nicht die Position, sondern ein **Ziel**; jedes
Bild danach legt die Seite 14 % des Restwegs zurück, und mehrere Schritte addieren sich auf
dasselbe Ziel, statt sich zu überholen. Ohne Bibliothek — eine Scroll-Bibliothek wäre die
erste Abhängigkeit des Auftritts überhaupt.

Vier Riegel, und jeder steht für einen Fall, in dem Übernehmen falsch wäre:

- **`prefers-reduced-motion`** — das Rad ist die Eingabe, mit der am häufigsten navigiert
  wird; sie umzubauen ist genau die Art Bewegung, gegen die die Einstellung steht.
- **Trackpads bleiben unberührt.** Sie liefern viele kleine Schritte und bringen ihre eigene
  Trägheit mit; beides übereinander fühlt sich schwammig an. Erkannt am Betrag (ab 40 px je
  Rastung ist es ein Rad).
- **Eigene Scrollbereiche behalten ihr Rad.** Ein `preventDefault` am Fenster nimmt es sonst
  jedem Kasten mit `overflow: auto` weg.
- **Tastatur, Sprungmarke, Scrollbalken übernehmen sofort** — sonst zöge das laufende Ziel die
  Seite gegen die Tastatur zurück.

Für die Dauer der Fahrt steht `scroll-behavior` am Wurzelelement auf `auto` und danach wieder
auf seinem alten Wert: Das `smooth` aus `stil.css` legte sonst seine eigene weiche Fahrt über
jedes einzelne Bild dieser hier, und die Seite bliebe kleben. Bewusst **nicht** über
`behavior: 'instant'` im Aufruf — ein Browser, der diesen jungen Wert nicht kennt, wirft dort
einen `TypeError`, statt ihn zu überlesen. Die **Sprungmarken** laufen weiterhin über das CSS.

**Nichts, was nicht anklickbar ist, reagiert auf den Zeiger.** Die einzige Hover-Regung sitzt
am Pfeil im Holen-Knopf. Dieselbe Begründung wie bei den Store-Abzeichen: Was sich unter dem Zeiger
bewegt, sieht aus, als könne man es anklicken — und die Store-Zeilen, die Tarifkarten und die
Stimmen kann man nicht.

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
Auftritt — Kopf samt Navigation, Marke, Sprachumschalter, Fokusring, Sprungmarke und Fuß
stehen deshalb in `stil.css` und nicht mehr hier.

**Die Kopfzeile trägt überall dieselben drei Anker** („Wie es geht", „Funktionen",
„Preis"); auf den Rechtsseiten zeigen sie auf die Startseite. Vorher stand dort nur die
Marke und DE/EN — beim Wechsel von der Startseite ins Impressum verschwand die halbe
Navigation, und das sah nach zwei Websites aus.

**Kopf und Fuß laufen auf 74rem, der Fließtext auf 42rem.** Beides zusammen ist der Grund,
warum `.kopf-inhalt` und `.fuss-inhalt` nicht mehr dieselbe Breitenregel haben wie
`.inhalt`: Sie sind Seitenelemente, kein Lesetext. Auf 42rem rückten Marke und Navigation
auf jeder Rechtsseite weiter nach innen als auf der Startseite, und der Kopf sprang beim
Seitenwechsel sichtbar. Die Lesespalte bleibt dagegen schmal — ein Rechtstext wird
gelesen, keine Bahn ist breiter als nötig.

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

**`main { padding: 32px 0 48px }` steht in `stil.css` und gilt dem Fließtext der
Rechtsseiten.** Auf der Startseite trug es zwei sandfarbene Balken ein, die wie ein Fehler
aussahen und einer waren: einen 32px hohen zwischen Kopfzeile und dem Verlauf des ersten
Bildes, einen 48px hohen zwischen der Clay-Bahn und dem dunklen Fuß. `start.css` setzt die
Polsterung deshalb mit `.start main { padding: 0 }` zurück — hier bringt jede Bahn ihre
eigene mit. Wer eine neue Vollflächen-Bahn baut, sieht den Balken sofort wieder, wenn die
Regel verschwindet.

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
  Das gilt seit dem 19.08.2026 auch für `data-auftritt` und `--i`: Eine Bahn, die nur in
  einer Fassung das Attribut trägt, steht in der anderen ohne Auftritt da — und eine, die es
  in beiden **nicht** trägt, fällt gar nicht auf.
- **Eine Klasse für alles, was eintritt: `.ist-da`.** Sie hieß `.sichtbar` und galt nur dem
  Verwandlungsblock. Der Beobachter setzt jetzt überall dieselbe; wer eine zweite einführt,
  hat zwei Wege, die dasselbe tun, und beim nächsten Umbau bleibt einer davon liegen.
- **Zwei Tarifkarten, ein Umschalter.** `.plan` / `.plan-voll` haben die frühere
  `.tarif`-Zeile abgelöst. Unter 34rem stehen sie untereinander: nebeneinander blieben je
  150 px, und der Preis brach dort zweizeilig um („2,99" über „€").
- **`stil.css` zuerst, `start.css` danach.** Tokens, `@font-face` und der Reset stehen in
  der ersten Datei; die zweite baut darauf auf und überschreibt `.marke`. Dreht man die
  Reihenfolge um, steht die Marke wieder in Versalien und Terracotta.
