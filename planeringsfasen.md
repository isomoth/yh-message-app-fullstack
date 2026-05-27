# Inlämning 1 - Planeringsfasen

## Systemskiss - Motivering

_(För mer information och detaljerade motiveringar se sliden i filen "YH - Message app - DEMO-Maj27.pdf" som ligger i rooten av den här repositoryn)._

Vi har valt att behålla det förenklade dataflödesdiagrammet på global nivå, då applikationens arkitektur inte kräver en komplex design. Browser och frontend visas i skissen som klientdelen utanför tillitszonen, medan backend/API och databas ligger inom vårt system. Backend och API hålls ihop eftersom API-endpoints och routing är en del av Express-backendens logik, inte en separat gateway eller tjänst.

![image info](systemskiss-hotmodellering.png)

## Hotmodellering (STRIDE)

Vi har utgått från den förenklade Rapid Threat Modeling-modellen där komponenter först klassas utifrån om de tillhör vårt system och hur skyddsvärda de är:

- **Browser och frontend har värde 0 eftersom de ligger utanför vår tillitszon.** Större påverkan på systemet vid kompromettering/driftstörning eftersom backend hanterar logik, API-routing, behörighet och bearbetningen av lagrad data. Darför gav vi backenden ett initialt högt värde (3). Men eftersom den utgör ingångspunkt till tillitszonen, innebär det enligt modellen att backend/API får värde 1. Det betyder inte att den inte kräver striktare säkerhetsåtgärder, utan att den här aspekten inte fångas fullt ut av de förenklade reglerna i den här skissen.

- **Dataflödet mellan komponenter med olika skysddsvärde**

### Databas (MongoDB)

#### Hot: Kontoövertagande efter exponering (Information Disclosure, Spoofing)

**Påverkan:**
Skanningar från antagonister kan hitta en exponerad databas och försöka logga in, får åtkomst till funktioner, data eller användares information.

**Orsak:**
Öppna portar som exponerar databasen mot offentliga nätverk.

#### Hot: Dataläckage eller dataförlust (Information Disclosure):

**Påverkan:**
Komprometterad data kanutnyttjas till ransomware-attacker med double-extorsion eller säljas på darkweb.

**Orsak:**
Default-inställningarna på MongoDB kräver inte autentisering från användarna.

## Säkerhetskrav

Varje säkerhetskrav har tilldelats ett unikt **SR-ID** (Security Requirement) för att skapa spårbarhet (traceability) genom hela utvecklingsprocessen. Metoden underlättar sammankopplingen av säkerhetskrav, identifierade hot, STRIDE-kategorier samt implementering och kodgranskning under projektets gång. Vi har också formulerat kraven som **User Stories** för att underlätta kommunikationen med utvecklarna, enligt best practice inom IT-branschen.

Vi har listat flertalet säkerhetsåtgärder/kravspecifikationer som är relevanta för webbapplikationen, men fokuserar på fem stycken vi bedömt som mest kritiska inför presentationen i planeringsfasen.

![image info](säkerhetskrav.png)

### Frontend

| SR   | SÄKERHETSKRAV                                                                    | STRIDE |
| ---- | -------------------------------------------------------------------------------- | ------ |
| SR-1 | Användaren ska bara kunna skriva max. X tecken på respektive inmatningsfält      | T      |
| SR-2 | Användaren ska bara kunna skapa ett användarnamn på max. X tecken                | T      |
| SR-3 | Användaren ska bara kunna skriva godkända datatyper på respektive inmatningsfält | T & D  |
| SR-4 | Användaren ska bara kunna skriva tillåtna tecken                                 | T      |
| SR-5 | Användaren ska inte kunna se känslig information via felmeddelanden              | I      |
| SR-6 | Användaren behöver logga in för att skapa, redigera och ta bort meddelanden      | S & R  |

### Backend

| SR   | SÄKERHETSKRAV                                                        | STRIDE  |
| ---- | -------------------------------------------------------------------- | ------- |
| SR-7 | Användare ska inte kunna skicka för många anrop från samma IP-adress | D       |
| SR-8 | Användaren ska inte kunna försöka logga in för många gånger          | S & D   |
| SR-9 | Användaren ska kontrolleras för behörighet vid varje request         | S, E, R |

## Databas

| SR    | SÄKERHETSKRAV                                                                      | STRIDE   |
| ----- | ---------------------------------------------------------------------------------- | -------- |
| SR-10 | Användaren ska inte kunna se lösenord i klartext                                   | I & S    |
| SR-11 | Användaren ska inte ha direkt klientåtkomst till databasen                         | E, R & I |
| SR-12 | Det ska finnas en säkerhetskopia av databasen ifall användaren förstör/raderar den | I & T    |
