/*
  Weiches Scrollen mit dem Mausrad - fuer den ganzen Auftritt, nicht nur die
  Startseite. Ohne Bibliothek und ohne Anfrage nach draussen: Die Seiten sind
  statisch, und eine Scroll-Bibliothek waere die erste Abhaengigkeit ueberhaupt.

  Was es tut: Ein Radschritt setzt nicht die Scrollposition, sondern ein ZIEL.
  Jedes Bild danach legt die Seite einen Anteil des Restwegs zurueck - schnell,
  solange viel fehlt, langsamer zum Schluss. Mehrere Schritte hintereinander
  addieren sich auf dasselbe Ziel, statt sich zu ueberholen.

  VIER RIEGEL, und jeder steht fuer einen Fall, in dem Uebernehmen falsch waere:

  1. `prefers-reduced-motion` - wer Bewegung abbestellt hat, scrollt nativ. Das
     Rad ist die Eingabe, mit der man am haeufigsten navigiert; sie umzubauen
     ist genau die Art Bewegung, gegen die die Einstellung steht.
  2. TRACKPADS bleiben unberuehrt. Sie liefern viele kleine Schritte und
     bringen ihre eigene Traegheit mit; beides uebereinander fuehlt sich
     schwammig an. Erkannt am Betrag: Ein Mausrad meldet in Pixeln rund 100 je
     Rastung, ein Trackpad einstellige Werte.
  3. Eigene Scrollbereiche im Dokument behalten ihr Rad. Ein `preventDefault`
     auf dem Fenster nimmt es sonst jedem Kasten mit `overflow: auto` weg - der
     waere danach mit der Maus nicht mehr zu bedienen.
  4. Wer anders scrollt - Tastatur, Sprungmarke, Scrollbalken - uebernimmt
     sofort. Ohne das zoege das laufende Ziel die Seite gegen die Tastatur
     zurueck.

  Die Sprungmarken der Seite laufen NICHT hierueber, sondern weiter ueber
  `scroll-behavior: smooth` in stil.css. Genau das ist aber im Weg, solange
  diese Fahrt laeuft: Der Browser legte seine eigene weiche Fahrt ueber jedes
  einzelne Bild dieser hier, und die Seite bliebe kleben. Deshalb schaltet der
  Lauf `scroll-behavior` am Wurzelelement fuer seine Dauer auf `auto` und gibt
  es danach zurueck - und nicht ueber `behavior: 'instant'` im Aufruf: Das ist
  ein junger Wert, und ein Browser, der ihn nicht kennt, wirft bei diesem
  Aufruf einen TypeError, statt ihn zu ueberlesen.
*/
(function () {
  'use strict';

  /*
    NEU LADEN FAENGT WIEDER OBEN AN. Browser merken sich die Scrollposition und
    stellen sie beim Neuladen wieder her; auf einer Startseite ist das falsch -
    wer neu laedt, will den Anfang sehen und nicht die Mitte der Preisbahn.

    Zwei Einschraenkungen, und beide sind Absicht:

    - Nur beim RELOAD (`navigation.type`), nicht beim Zurueck-Knopf. Wer von der
      Datenschutzerklaerung zurueckkommt, soll wieder dort stehen, wo er weg ist;
      `scrollRestoration = 'manual'` pauschal zu setzen naehme ihm das.
    - Nur ohne Sprungziel in der Adresse. Steht dort `#holen`, ist die Position
      gewollt, und der Browser springt selbst dorthin.

    Beides zusammen: das Wiederherstellen abschalten UND einmal aktiv nach oben.
    Die Datei laedt mit `defer`, laeuft also nach dem Parsen - der Browser kann
    zu dem Zeitpunkt schon gescrollt haben.
  */
  var lauf = performance.getEntriesByType
    ? performance.getEntriesByType('navigation')[0]
    : null;

  if ((!lauf || lauf.type === 'reload') && !location.hash) {
    if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
    window.scrollTo(0, 0);
    /*
      Und noch einmal nach `load`: Manche Browser stellen die alte Position
      erst her, wenn die Bilder da sind und die Seite ihre volle Hoehe hat -
      also nach diesem Skript. Ein zweiter Griff kostet nichts.
    */
    addEventListener('load', function () { window.scrollTo(0, 0); });
  }

  var ruhig = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (ruhig.matches) return;

  /* Wie viel des Restwegs je Bild - 0.14 ist rund eine halbe Sekunde Auslauf. */
  var ANTEIL = 0.14;
  /* Darunter ist der Rest kein sichtbarer Weg mehr, sondern nur noch Rechnen. */
  var NAEHE = 0.5;
  /* Firefox meldet Zeilen statt Pixel; drei Zeilen je Rastung sind dort ueblich. */
  var ZEILE = 40;
  /* Ab hier ist es ein Rad und kein Trackpad (Pixel je Rastung). */
  var RASTUNG = 40;

  var ziel = null;
  var laeuft = false;
  var gemerktesVerhalten = null;

  function grenze() {
    return Math.max(
      0,
      document.documentElement.scrollHeight - window.innerHeight
    );
  }

  function anhalten() {
    ziel = null;
    laeuft = false;
    if (gemerktesVerhalten !== null) {
      document.documentElement.style.scrollBehavior = gemerktesVerhalten;
      gemerktesVerhalten = null;
    }
  }

  function schritt() {
    if (!laeuft) return;
    var rest = ziel - window.scrollY;
    if (Math.abs(rest) < NAEHE) {
      window.scrollTo(0, ziel);
      anhalten();
      return;
    }
    window.scrollTo(0, window.scrollY + rest * ANTEIL);
    requestAnimationFrame(schritt);
  }

  /*
    Sucht nach oben einen Kasten, der selbst scrollen kann. Nur dann darf das
    Rad nicht ans Fenster gehen.
  */
  function inEigenemBereich(el) {
    while (el && el !== document.body && el !== document.documentElement) {
      if (el.scrollHeight > el.clientHeight) {
        var fluss = getComputedStyle(el).overflowY;
        if (fluss === 'auto' || fluss === 'scroll') return true;
      }
      el = el.parentElement;
    }
    return false;
  }

  addEventListener('wheel', function (e) {
    /* Strg+Rad ist Zoom, nicht Scrollen. */
    if (e.ctrlKey || e.metaKey || e.defaultPrevented || !e.deltaY) return;
    if (e.deltaMode === 0 && Math.abs(e.deltaY) < RASTUNG) return;
    if (inEigenemBereich(e.target)) return;

    var weg = e.deltaY;
    if (e.deltaMode === 1) weg *= ZEILE;
    else if (e.deltaMode === 2) weg *= window.innerHeight;

    e.preventDefault();
    var von = ziel === null ? window.scrollY : ziel;
    ziel = Math.min(grenze(), Math.max(0, von + weg));

    if (!laeuft) {
      laeuft = true;
      gemerktesVerhalten = document.documentElement.style.scrollBehavior;
      document.documentElement.style.scrollBehavior = 'auto';
      requestAnimationFrame(schritt);
    }
  }, { passive: false });

  /* Tastatur, Sprungmarke, Scrollbalken, Zeigegeraet: Der Nutzer uebernimmt. */
  addEventListener('keydown', anhalten, { passive: true });
  addEventListener('pointerdown', anhalten, { passive: true });
  addEventListener('touchstart', anhalten, { passive: true });
})();
