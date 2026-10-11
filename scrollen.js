/*
  Weiches Scrollen mit dem Mausrad - fuer den ganzen Auftritt, nicht nur die
  Startseite. Ohne Bibliothek und ohne Anfrage nach draussen: Die Seiten sind
  statisch, und eine Scroll-Bibliothek waere die erste Abhaengigkeit ueberhaupt.

  Was es tut: Ein Radschritt setzt nicht die Scrollposition, sondern ein ZIEL.
  Jedes Bild danach legt die Seite einen Anteil des Restwegs zurueck - schnell,
  solange viel fehlt, langsamer zum Schluss. Mehrere Schritte hintereinander
  addieren sich auf dasselbe Ziel, statt sich zu ueberholen.

  DIE EINE REGEL, aus der alles andere folgt: Es darf NIE zugleich nativ und
  per Skript gescrollt werden. Genau daran ist die erste Fassung gestorben, und
  zwar sichtbar auf dem Mac - die Seite sprang beim Auslaufen hoch und runter,
  bevor sie zum Stehen kam. Der Grund steckte in der Trackpad-Erkennung: Sie
  entschied JE EREIGNIS am Betrag. Ein Wisch auf dem Mac liefert aber innerhalb
  EINER Geste Betraege auf beiden Seiten der Schwelle - erst anschwellend, dann
  als auslaufende Traegheit. Die grossen wurden abgefangen und auf ein Ziel
  gelegt, die kleinen liefen ungebremst durch und scrollten die Seite nativ
  weiter. Die noch laufende Animation sah die Seite daraufhin HINTER ihrem Ziel
  und zog sie zurueck. Zwei Scroller, ein Dokument.

  FUENF RIEGEL, und jeder steht fuer einen Fall, in dem Uebernehmen falsch waere:

  1. `prefers-reduced-motion` - wer Bewegung abbestellt hat, scrollt nativ. Das
     Rad ist die Eingabe, mit der man am haeufigsten navigiert; sie umzubauen
     ist genau die Art Bewegung, gegen die die Einstellung steht.
  2. AUF macOS BLEIBT ALLES NATIV. Dort legt schon das System jeder Eingabe -
     Trackpad, Magic Mouse und auch dem schlichten Rad - seine eigene Traegheit
     bei; diese hier kaeme obendrauf. Das ist derselbe Gedanke wie Riegel 3,
     nur dass er auf dem Mac fuer jedes Zeigegeraet gilt und nicht nur fuers
     Trackpad. Was die Seite hier gewinnen koennte, hat sie schon.
  3. TRACKPADS bleiben unberuehrt - sie bringen ihre eigene Traegheit mit.
     Erkannt am Betrag: Ein Mausrad meldet in Pixeln rund 100 je Rastung, ein
     Trackpad einstellige Werte. Entschieden wird das aber EINMAL JE GESTE, am
     ersten Ereignis, und die Entscheidung haelt bis zur naechsten Pause. Je
     Ereignis zu entscheiden war der Fehler oben.
  4. Eigene Scrollbereiche im Dokument behalten ihr Rad. Ein `preventDefault`
     auf dem Fenster nimmt es sonst jedem Kasten mit `overflow: auto` weg - der
     waere danach mit der Maus nicht mehr zu bedienen.
  5. Wer anders scrollt - Tastatur, Sprungmarke, Scrollbalken - uebernimmt
     sofort. Ohne das zoege das laufende Ziel die Seite gegen die Tastatur
     zurueck. Dazu die GEGENPROBE in jedem Bild: Steht die Seite nicht da, wo
     die Animation sie zuletzt hingesetzt hat, hat jemand anders sie bewegt -
     und dann gehoert sie ihm. Das faengt auch, was keine dieser Eingaben ist:
     das Gummiband am Rand, eine Sprungmarke, ein nachgeladenes Bild.

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

    Das steht VOR allen Riegeln: Es ist keine Bewegung, sondern eine Position,
    und es gilt auch fuer alle, die unten aussteigen.
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

  /*
    Riegel 2. Geprueft wird die PLATTFORM, nicht der Browsername - Safari,
    Chrome und Firefox verhalten sich auf dem Mac gleich, weil die Traegheit
    vom System kommt und nicht von der Maschine. `userAgentData` kennen nur
    Chromium-Browser, `platform` ist veraltet, aber ueberall da; zusammen
    decken sie jeden Fall ab. iPadOS meldet sich ebenfalls als "Mac" - das ist
    hier folgenlos, ein Finger loest kein `wheel` aus.
  */
  var plattform =
    (navigator.userAgentData && navigator.userAgentData.platform) ||
    navigator.platform || '';
  if (/mac/i.test(plattform)) return;

  /* Anteil des Restwegs je 1/60 Sekunde - rund eine halbe Sekunde Auslauf. */
  var ANTEIL = 0.14;
  /* Darunter ist der Rest kein sichtbarer Weg mehr, sondern nur noch Rechnen. */
  var NAEHE = 0.5;
  /* Firefox meldet Zeilen statt Pixel; drei Zeilen je Rastung sind dort ueblich. */
  var ZEILE = 40;
  /* Ab hier ist es ein Rad und kein Trackpad (Pixel je Rastung). */
  var RASTUNG = 40;
  /* So lange ohne Radereignis, und der naechste Schritt ist eine neue Geste. */
  var GESTE_PAUSE = 150;
  /*
    Toleranz der Gegenprobe. Nicht 0: Auf HiDPI-Schirmen rundet der Browser die
    Scrollposition auf ganze Geraetepixel, und die Seite steht dann um einen
    Bruchteil neben dem gesetzten Wert, ohne dass jemand sie bewegt haette.
  */
  var ABWEICHUNG = 2;

  var ziel = null;
  var laeuft = false;
  var gemerktesVerhalten = null;
  var letztesBild = 0;
  var erwartet = null;
  var letzteGeste = 0;
  var gesteIstRad = false;

  function grenze() {
    return Math.max(
      0,
      document.documentElement.scrollHeight - window.innerHeight
    );
  }

  function anhalten() {
    ziel = null;
    laeuft = false;
    letztesBild = 0;
    erwartet = null;
    if (gemerktesVerhalten !== null) {
      document.documentElement.style.scrollBehavior = gemerktesVerhalten;
      gemerktesVerhalten = null;
    }
  }

  function schritt(jetzt) {
    if (!laeuft) return;

    /* Riegel 5: Steht die Seite woanders, als wir sie hingesetzt haben? */
    if (erwartet !== null && Math.abs(window.scrollY - erwartet) > ABWEICHUNG) {
      anhalten();
      return;
    }

    /*
      Der Anteil haengt an der VERSTRICHENEN ZEIT, nicht an der Zahl der Bilder.
      Fest 0.14 je Bild waere auf einem 120-Hz-Schirm der doppelte Weg je
      Sekunde - derselbe Code liefe dort doppelt so schnell aus wie auf 60 Hz,
      und die halbe Sekunde oben waere nur auf der Haelfte der Geraete wahr.
      Der Deckel von 50 ms faengt den Sprung nach einem verschluckten Bild.
    */
    var bild = 1000 / 60;
    var dt = letztesBild ? Math.min(jetzt - letztesBild, 50) : bild;
    letztesBild = jetzt;

    var rest = ziel - window.scrollY;
    if (Math.abs(rest) < NAEHE) {
      window.scrollTo(0, ziel);
      anhalten();
      return;
    }

    var anteil = 1 - Math.pow(1 - ANTEIL, dt / bild);
    window.scrollTo(0, window.scrollY + rest * anteil);
    /* Zurueckgelesen, nicht gerechnet: am Rand klemmt der Browser den Wert. */
    erwartet = window.scrollY;
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

    /*
      Riegel 3: Die Art der Geste steht am ersten Ereignis fest und gilt bis
      zur naechsten Pause. Zeilen und Seiten (`deltaMode` 1 und 2) meldet nur
      ein Rad - ein Trackpad liefert immer Pixel.
    */
    var jetzt = e.timeStamp || Date.now();
    if (jetzt - letzteGeste > GESTE_PAUSE) {
      gesteIstRad = e.deltaMode !== 0 || Math.abs(e.deltaY) >= RASTUNG;
    }
    letzteGeste = jetzt;

    /*
      Alles, was wir nicht abfangen, scrollt der Browser selbst - und dann darf
      hier nichts mehr laufen. Das ist die eine Regel aus dem Kopf der Datei.
    */
    if (!gesteIstRad || inEigenemBereich(e.target)) {
      anhalten();
      return;
    }

    var weg = e.deltaY;
    if (e.deltaMode === 1) weg *= ZEILE;
    else if (e.deltaMode === 2) weg *= window.innerHeight;

    e.preventDefault();
    var von = ziel === null ? window.scrollY : ziel;
    ziel = Math.min(grenze(), Math.max(0, von + weg));

    /* Das naechste Bild darf nicht gegen eine Zahl von vorhin pruefen. */
    erwartet = null;

    if (!laeuft) {
      laeuft = true;
      letztesBild = 0;
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
