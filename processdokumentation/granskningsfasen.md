# Inlämning 3 - Granskningsfasen

För en utförligare genomgång av granskningsfasen och allmänna slutsatser kring projektet hänvisar vi till presentationen "Fase 3 - Granskning och Bedömning" i [processdokumentationsmappen](processdokumentation).

## Skanningsresultat

Verktygen identifierade ett antal säkerhetsrelaterade findings som behövde analyseras vidare.

Vid första anblick såg antalet fynd relativt högt ut, men flera av larmen visade sig vara variationer av samma underliggande problem. Därför valde vi att gå vidare med en manuell analys för att prioritera resultaten utifrån faktisk risk i applikationens kontext.

## Kategorisering utifrån identifierade mönster

Efter den manuella genomgången kunde fynden grupperas i fem huvudsakliga riskområden.

De tre första kategorierna identifierades via **Dependabot** och handlade om sårbara tredjepartsbibliotek, autentisering och tokenhantering samt bristande validering av indata. Och de två sista identifierades via **CodeQL** och rörde skydd mot automatiserade anrop samt säkerhetskonfiguration.

Genom att gruppera fynden på det här sättet kunde vi fokusera på de bakomliggande problemen istället för att hantera varje enskild varning isolerat.

## Slutlig bedömning

Den slutliga bedömningen utgår från de fyra säkerhetsprinciper som väglett arbetet:

- Genom **Defense in Depth** har vi byggt flera kompletterande säkerhetslager.
- Genom **Shift-Left** har säkerhetskontroller och åtgärder genomförts tidigt i utvecklingsprocessen.
- **Four-Eye Principle** har stärkt kvaliteten genom gemensam granskning och bedömning, medan Least Privilege har begränsat åtkomst och behörigheter till det som faktiskt krävs.

Sammantaget bedömer vi därför att applikationen uppfyller projektets vägledande säkerhetsprinciper och är tillräckligt säker i sin nuvarande kontext, där identifierade risker hanteras på en acceptabel nivå.

Det innebär inte att applikationen är helt fri från risker, men att de identifierade riskerna har analyserats, prioriterats och hanterats på ett strukturerat sätt.
