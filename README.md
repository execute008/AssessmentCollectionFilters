# Assessment Collection Filters

Wir freuen uns, dass die diese kurze Testaufgabe lösen möchtest. Das Ziel ist es, einzuschätzen, wo deine Fähigkeiten liegen und ob die Stelle eines Webentwicklers bei VitaMoment das Richtige für dich ist.

In diesem Repository findest du alle Infos, die du dafür brauchst. Die Aufgabe zielt auf einen Aufwand von maximal 2 Stunden ab. Dein Ziel ist keinesfalls, in der kurzen Zeit eine vollumfängliche und einsatzbereite Lösung für das Problem zu entwickeln, sondern es gilt eine technische Basis zu entwerfen, welche potenziell auch von einem anderen Teammitglied weiterentwickelt werden kann. Produzierter Code und Text sollten dafür gut strukturiert und verständlich sein, wobei neben der Verwendung sinnvoller Namen für Funktionen/Variablen auch Code-Kommentare helfen können.

## Problembeschreibung

In unserem Shop unter [vitamoment.de](vitamoment.de) soll eine neue Filter-Funktion für Collection-Pages entworfen und umgesetzt werden.

<img src="./Screen_Collection_Page.png" alt="Screenshot unserer Collection Page" width="320"/>

Aktuell existiert bereits eine simple Filterung nach Produkteigenschaften in unserem Shop. Die Filter sollen allerdings einmal komplett neu gedacht werden. Du hast deshalb in der Umsetzung alle Freiheiten. Es ist zum Beispiel auch dir überlassen, ob du die Filterauswahl in einer Sidebar, einem Modal, einem Popover, einem Collapsible etc. öffnest.

Folgende Filtermöglichkeiten soll es geben:
- Preis (0-20€, >20€-30€, >30€-40€, >40€)
- Verfügbarkeit (Auf Lager, Ausverkauft)
- Einnahmeform (Kapseln, Pulver, Tropfen, Spray, Sonstiges)

Zusätzliche Anforderungen:
- Bei Preis und Verfügbarkeit sollen immer alle Werte angezeigt werden, falls in der aktuellen Kategorie kein Produkt für einen Filterwert existiert, sollte dieser allerdings nicht auswählbar sein.
- Bei der Einnahmeform sollen nur die Werte angezeigt werden, für die es in der aktuellen Collection gibt.

## Ausgangslage

Beim Datenschema sollst du dich an dem orientieren, was Shopify vorgibt. Siehe auch unten die hilfreichen Links. Dir stehen außerdem in `example-collection.json` Beispieldaten für unsere Bestseller-Collection zur Verfügung, auf welche du während der Implementation zurückgreifen kannst. Das dortige Datenschema entspricht dem Shopify-Datenschema für Liquid, wurde allerdings stark reduziert, indem einige nicht notwendige Daten weggelassen wurden.

Im `src` Ordner findest du eine stark vereinfachte Collection Page, welche du als Basis deiner Implementation nutzen kannst. Hier sind bereits die Produkte entsprechend den Daten in `example-collection.json` dargestellt. Ergänze den Code ganz wie es erforderlich ist, z.B. mit zusätzlichen data-Attributen für die Filterfunktion (oder welche Anpassungen auch immer dafür notwendig sind).

## Aufgabe

Es soll in mehreren Schritten eine Lösung für die neuen Collection-Filter entwickelt werden. Die einzelnen Arbeitsergebnisse müssen nicht im Detail ausgearbeitet werden. Wenn bestimmte Anforderungen aus Zeitgründen nicht implementiert werden können, reicht es durch Kommentare an den entsprechenden Stellen zu skizzieren, was hier noch passieren/implementiert werden müsste.

In Klammern findest du Empfehlungen für die Verteilung des Aufwands auf die einzelnen Schritte.

1. Klone dieses Repository um lokal daran arbeiten zu können.
1. Erstelle ein simples Mockup für die Filterauswahl. Der Fokus soll hier klar auf einem groben Layout liegen, genaue Abstände, Farbwerte, Schriftgrößen und sonstige visuelle Feinheiten spielen keine große Rolle. (10min)
2. Prüfe für jede neue Filteroption, welche Produktdaten hierfür benötigt werden. Sollten die entsprechenden Daten nicht durch die Standard-Shopify-Produktdaten abgebildet sein, mache einen Vorschlag wie man die Daten in Shopify konkret modellieren und speichern könnte. (20min)
3. Implementiere das Interface und die Funktionalität der Collection Filter mit HTML, CSS und JavaScript. Hierbei soll der Einfachheit halber nicht die Liquid-Template-Language verwendet werden, sondern Daten dürfen explizit in das erstellte HTML hardgecodet werden. Das JavaScript soll allerdings keine hardgecodeten Werte enthalten. Das CSS soll sich so wie das Mockup auf das grobe Layout begrenzen. (90min)

## Hilfreiche Links
- [Shopify Produkt-Daten in Liquid](https://shopify.dev/docs/api/liquid/objects/product)
- [Shopify Collection-Daten in Liquid](https://shopify.dev/docs/api/liquid/objects/collection)
- [Beispiel Collection in unserem Shop](https://vitamoment.de/collections/bestseller)