# Changelog

Alla ändringar i CjS kommer antecknas i denna fil.

Nuvarande version är 5.3.0.

## Version 5.3.0 - 2024-05-22

### Added

- Autogenerera ärende-knapp i OP5 som autogenererar ett ärende och ackar larmet, förutsatt att informationen i CMDB är rätt upplagd.

### Changed

- Sök i CMDB-knapparna för Qradar, Cisco AMP och Qualys leder nu till en global sökning i SDP istället för till CMDB.

### Fixed

- Fixade Skapa ärende-knappen i OP5 som slutat fungera efter SDP 14.5.
- Fixade Autogenerera ärende-knappen i Qradar som slutat fungera efter SDP 14.5.
- Fixade så att Sök CI-knapp dyker upp i Qradar även om det står inom parentes.

## Version 5.2.0 - 2024-03-06

### Added

- Autogenerera ärende i Qradar som med hjälp av SDP-API:et skapar ett automatiskt ärende i SDP samt lägger till en kommentar i Qradar.

### Fixed

- Fixade buggen som gjorde att Skapa ärende-knappen genererade ett felaktigt kommentarfält för Qradar.

## Version 5.1.1 - 2024-01-05

### Fixed

- Fixade buggen som gjorde att knapparna i OP5-listvyn inte alltid lades till.

## Version 5.1.0 - 2024-01-05

### Added

- Lade till Sök i CMDB-knapp i Qualys.
- Lade till Sök i Netbox-knapp i Qualys.

### Fixed

- Fixade buggen som gjorde att det inte gick att klicka till andra sidor i ärendelistan i SDP.
- Fixade buggen som gjorde att om vissa felmeddelanden kom upp i OP5 klickades de bort direkt.
- Fixade buggen som gjorde att tillgång inte associerades automatiskt om tillgången inte hade något kopplat system.

## Version 5.0.3 - 2023-12-07

### Added

- Om det är december visas en jultomte istället för ett fyrverkeri när det inte finns några larm.

### Changed

- Flyttade filerna från LKL9829 till LKL9649.


## Version 5.0.2 - 2023-11-21

### Added

- Lade till så att OP5-funktionerna också är tillgänliga i OP5 Test. 


## Version 5.0.1 - 2023-11-16

### Fixed

- Fixade problem som gjorde att cookiehämtning för Log4CjS inte alltid fungerade.


## Version 5.0.0 - 2023-11-15

### Added

- Loggningsfunktion som loggar användning av funktioner till [Log4CjS](https://gitlab.ltkalmar.se/oc/log4cjs).
- eslint-konfiguration som säkerställer korrekt formatering om man använder eslint.
- qradar.js: Vid varje hostnamn på sidan läggs nu en Sök i CMDB-knapp till som söker i CMDB i en popup-ruta.

### Changed

- Kommentarer i koden är nu inte bara versaler.
- Funktionen för att kopiera text, som var föråldrad, är utbytt mot en mer modern metod.
- Formatering hanteras nu i en separat CSS-fil för ökad underhållbarhet.
- op5.js: Ta bort fyrverkerier-knappen är utbytt mot en Stäng av loggning-knapp, som används för att inaktivera loggning för testsyfte.
- sdp.js: När man skapar ett ärende från OP5 är SDP-delen nu optimerad vilket gör att det går fortare.
- sdp.js: Om flera sökresultat finns på ett system vid automatisk CMDB-sökning så väljer den nu automatiskt rätt istället för att man behöver välja manuellt.

### Fixed

- sdp.js: Det långvariga problemet med att Kopiera ärendelänk-knappen inte dyker upp om man kommer från ärendelistan är nu löst.
- sdp.js: Går man in på mallen för larmärende kommer den inte längre försöka autofylla, vilket kunde orsaka oväntade resultat.

<br><br><br>
------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
Ovanför denna linje används ett versionsnummer för hela projektet istället för separata versionsnummer per skript.

<br><br><br>

## [op5.js 4.5.2]

### Added

- Knapp för Visa eventlogg som ligger bredvid "VISA I CHANGELOG". (Issue #12)

## [op5.js 4.5.1]

### Fixed

- Fixade buggen som gjorde att Kopiera larminfo och Skapa ärende från listvyn-knapparna inte dök upp när man kom från vissa andra listor i OP5.

## [op5.js 4.5.0]

### Added

- Sök-knapp som gör att man kan söka i CMDB från listvyn.
- Skapa ärende-knapp som gör att man kan skapa ärende med ackning från listvyn.
- README som beskriver alla funktioner som CjS har.

### Changed

- Skapa ärende med ackning-knappen heter nu bara Skapa ärende.
- Släckte oviktiga felmeddelanden för att förbättra prestandan.

### Removed

- Skapa ärende med kommentar-knappen, eftersom den används sällan och inte fyller ett stort syfte.

### Fixed

- Fixade buggen som gjorde att unknown Cisco AMP-larm inte tog med outputen när man skapade ärende.

## [op5.js 4.4.0]

### Added

- Kopiera larminfo-knapp, som gör att man kan kopiera larminfo från listvyn och utan att behöva gå in i ett ärende. (Issue #7)
- Alla ändringar i pending changes öppnas nu automatiskt för bättre överblick.

### Changed

- Bilder och liknande förvaras nu i en resources-mapp.
- Gett koden bättre läsbarhet och enhetlighet genom att byta ut .setAttribute() mot de specifika attributen.

## [sdp.js 4.2.1]

### Changed
- Gett koden bättre läsbarhet och enhetlighet genom att byta ut .setAttribute() mot de specifika attributen.

## [qradar.js 1.0.3]

### Changed
- Gett koden bättre läsbarhet och enhetlighet genom att byta ut .setAttribute() mot de specifika attributen.

## [amp.js 1.0.3]

### Changed
- Gett koden bättre läsbarhet och enhetlighet genom att byta ut .setAttribute() mot de specifika attributen.

## [qradar.js 1.0.2]

### Added

- Kopiera länk-knapp som kopierar länken utan att öppna något ärende.

### Changed

- Skapa ärende-knappen ändrar inte längre text efter att man klickat på den.

## [op5.js 4.3.1]

### Added

- När man Checkat now på en check klickas det på OK automatiskt så att man kommer tillbaka till listan.

## [sdp.js 4.2.0]

### Added

- System associeras nu automatiskt via API-anrop när man skapar ett ärende via knapparna.
- En text med vilken grupp systemet supportas av dyker nu upp ovanför grupprutan när man skapar ett ärende via knapparna.

### Fixed

- Fixade buggen som gjorde att Visa i OP5-knappen på CI:s inte alltid dök upp.

## [amp.js 1.0.2]

### Added

- Sök i CMDB-knapp på hostar. (Issue #4)

## [op5.js 4.3.0]

### Added

- Checka alla-knapp i listvyn. (Issue #1)
- En överraskning som visas om det inte finns några larm i någon av larmlistorna. (Issue #3)

### Changed

- Knapparna på larmsidor minimeras nu om man visar sidan på en liten skärm för att undvika att delar av OP5 hamnar utanför skärmen. (Issue #5)

## [sdp.js 4.1.4]

### Fixed

- Fixade buggen som gjorde att information inte alltid infogades i ärenden efter flytten till LKL9829.

## [basskript.js 1.1.0]

### Changed 

- Anpassad beskrivning efter flytt till LKL9829.

## [amp.js 1.0.1]

### Changed 

- Anpassad beskrivning efter flytt till LKL9829.

## [sdp.js 4.1.3]

### Changed 

- Anpassad beskrivning efter flytt till LKL9829.

## [qradar.js 1.0.1]

### Changed 

- Anpassad beskrivning efter flytt till LKL9829.

## [op5.js 4.2.3]

### Changed 

- Anpassad beskrivning efter flytt till LKL9829.

## [op5.js 4.2.2]

### Fixed

- Fixade Sök CI-knappen efter SDP-uppgradering genom att göra så att hostnamnet transporteras via cookies när man söker efter CI.

## [sdp.js 4.1.4]

### Fixed

- Fixade Sök CI-funktionen genom att SDP läser cookies från OP5 för att få hostnamnet.

## [sdp.js 4.1.3]

### Added

- Lade till Visa i OP5-knapp på CI:s.

## [basskript.js 1.0.0]

### Added

- Lade till basskript.js som gör att man med hjälp av ett regex i CjS kan lägga till skript till alla sidor på domänen utan att behöva lägga till dem på sidorna.

### Removed

- Tog bort basskript_sdp.js eftersom basskript.js ersätter det.

### Changed

- Ändrade encoding på samtliga skript till UTF-8 with BOM vilket gör att ÅÄÖ kan visas i webbläsaren.

## [sdp.js 4.1.2]

### Changed

- Ändrade så att kopiera ärendelänk-knappen ändras till "Ärendelänk kopierad!" när man klickar på knappen.

### Removed

- Tog bort att ämnesrad fylls i automatiskt när man skapar ärende eftersom denna inte följde med när man lade ärendet.

## [amp.js 1.0.0]

### Added

- Lade till amp.js
- amp.js 1.0.0 inkluderar en knapp vid hostar som pingar hosten i ett nytt fönster.

## [sdp.js 4.2.1]

### Fixed

- Fixade så att ärendetiteln blir rätt istället för att innehålla en länk om man skapar ett ärende direkt på en host.

## [basskript_sdp.js 2.0.0]

### Added

- Lade till basskript för SDP eftersom det krävs för att SDP-koden ska fungera.

## [sdp.js 4.2.0]

### Added

- Ärendetexten på ärende skapat från OP5 fylls nu i automatiskt baserat på cookies som genereras av op5.js.
- Beställare fylls även i automatiskt som Operations Center.
- Tillgångar fylls i automatiskt som den host som ärendet skapades från.

### Changed

- Kopiera ärendelänk-knappen är flyttad och har ändrad stil.

## [op5.js 4.2.1]

### Changed

- Informationen som samlas in när man väljer Skapa ärende med ackning/kommentar lagras nu som cookies för bättre integration med sdp.js 4.2.0 istället för att kopieras till clipboarden.

## [qradar.js 1.0.0]

### Added

- Lade till qradar.js
- qradar.js 1.0.0 inkluderar en knapp på offenses som skapar ärende och genererar en länk till offenset.

## [op5.js 4.2.0]

### Added 

- Netbox-knapp som söker efter aktuell host i Netbox.
- Sök CI-knappen och Netbox-knappen tar bort .ltkalmar.se i sökningen om hostnamnet slutar med detta.
- Sök CI-knappen och Netbox-knappen tar bort PC och PCX i sökningen om hostnamnet börjar med detta.
- Last Change innehåller nu även information om hur länge sedan statusen förändrades, och inte bara datum.
- Visa i changelog-knapp som öppnar hosten i changeloggen.

### Changed

- Sättet som Skapa ärende-knapparna hämtar information har förändrats så att informationsinhämtningen blir mer dynamisk och oberoende av sidans struktur.
- Visa i Grafana-knappen skiljer nu på servrar och nätverksutrustning, och visar anpassade dashboards utifrån detta.

### Fixed

- Fixade buggen som gjorde att Skapa ärende med kommentar-knappen inte fungerade i OP5 v9.3.
- I och med ändringen av hur knapparna hämtar information fixades buggen som gjorde att Skapa ärende med ackning ibland inte funkade på switchar som låg nere.