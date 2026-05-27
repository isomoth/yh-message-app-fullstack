# Inlämning 1 - Planeringsfasen

## Systemskiss - Motivering

Vi har valt att behålla det förenklade dataflödesdiagrammet på global nivå, då applikationens arkitektur inte kräver en komplex design. Browser och frontend visas i skissen som klientdelen utanför tillitszonen, medan backend/API och databas ligger inom vårt system. Backend och API hålls ihop eftersom API-endpoints och routing är en del av Express-backendens logik, inte en separat gateway eller tjänst.

![image info](systemskiss-hotmodellering.png)

## Hotmodellering (STRIDE)

Vi har utgått från den förenklade Rapid Threat Modeling-modellen där komponenter först klassas utifrån om de tillhör vårt system och hur skyddsvärda de är:

- **Browser och frontend har värde 0 eftersom de ligger utanför vår tillitszon.** Större påverkan på systemet vid kompromettering/driftstörning eftersom backend hanterar logik, API-routing, behörighet och bearbetningen av lagrad data. Darför gav vi backenden ett initialt högt värde (3). Men eftersom den utgör ingångspunkt till tillitszonen, innebär det enligt modellen att backend/API får värde 1. Det betyder inte att den inte kräver striktare säkerhetsåtgärder, utan att den här aspekten inte fångas fullt ut av de förenklade reglerna i den här skissen.

- Utifrån mallen har vi främst kunnat placera **Tampering och Information Disclosure på dataflöden mellan komponenter med olika skyddsvärde**, samt identifierat den högsta risknivån vid **databasen, som fått värde 5**.

- Vi har placerat **Spoofing och Denial of Service enligt mallens zonregler**. Vid backend/API förekommer **ESRD**: Exempelvis skulle loginförsök eller överbelastning mot den här delen av systemet kunna vara realistiska hot.

- Vi har också diskuterat att både request- och responseflöden kan vara utsatta för manipulation. Därför kan **Tampering vara relevant både när data skickas in till systemet och när data returneras**, (särskilt om svaret påverkar vad användaren ser och gör), men detta fångades inte enligt modelleringens regler. Vi kompletterade därför med ett fördjupat säkerhetsresonemang kring abuse cases och hot mot systemets olika komponenter.

- Sammanfattningsvis har vi använt mallen som stöd för en första prioritering, men kompletterar med manuellt resonemang kring faktiska hot som modellen inte fångar perfekt. **Mallen hjälper oss prioritera, men den ersätter inte manuellt säkerhetsresonemang.**

## Abuse case-flöden kopplat till systemkomponeter

För att konkretisera hotmodelleringen bröts systemet ner i abuse cases kopplade till respektive systemkomponent. Fokus låg på de delar av applikationen som utvecklas och kan säkerhetskravställas – frontend, backend/API och databas – medan browsern och klientmiljön betraktades som delar utanför systemets tillitszon (trust boundary).
Tabellen visar hur funktioner, risker/hotscenarier, STRIDE-kategorier och säkerhetskrav hänger ihop genom systemets olika delar. Detta skapade sedan grunden för att identifiera och prioritera de mest kritiska säkerhetsriskerna och potentiella hoten mot systemet.

![image info](abuse-case-flöden.png)

## Potentiella hot utifrån kritiska säkerhetsrisker

![image info](potentiella-hot.png)

## Potentiella hot - Detaljerad beskrivning

### Backend/API

#### Hot: Dataintrång eller obehörig åtkomst (Elevation of Privilege och Repudiation)

- Påverkan:
  - Manipulation av hur koden styrs från serversidan
  - Lateral movement för att komma åt databasen.
  - Svårt att ta reda på vem som gjort det om inte loggar finns (repudiation).
- Orsak:
  - Bristfällig åtkomstkonfiguration (antal inloggningsförsök och API-anrop, JWT Token).
  - Ingen konfiguration för loggar.

### Databas (MongoDB)

#### Hot: Kontoövertagande efter exponering (Information Disclosure, Spoofing)

- **Påverkan:**
  Skanningar från antagonister kan hitta en exponerad databas och försöka logga in, får åtkomst till funktioner, data eller användares information.

- **Orsak:**
  Öppna portar som exponerar databasen mot offentliga nätverk.

#### Hot: Dataläckage eller dataförlust (Information Disclosure):

- **Påverkan:**
  Komprometterad data kanutnyttjas till ransomware-attacker med double-extorsion eller säljas på darkweb.

- **Orsak:**
  Default-inställningarna på MongoDB kräver inte autentisering från användarna.

## Säkerhetskrav

Varje säkerhetskrav har tilldelats ett unikt **SR-ID** (Security Requirement) för att skapa spårbarhet (traceability) genom hela utvecklingsprocessen. Metoden underlättar sammankopplingen av säkerhetskrav, identifierade hot, STRIDE-kategorier samt implementering och kodgranskning under projektets gång. Vi har också formulerat kraven som **User Stories** för att underlätta kommunikationen med utvecklarna, enligt best practice inom IT-branschen.

Vi har listat flertalet säkerhetsåtgärder/kravspecifikationer som är relevanta för webbapplikationen (se tabellerna längre ner), men fokuserar på fem stycken vi bedömt som mest kritiska inför presentationen i planeringsfasen.

![image info](säkerhetskrav.png)

### Detaljerad lista - Säkerhetskrav

#### Frontend

| SR   | SÄKERHETSKRAV                                                                    | STRIDE |
| ---- | -------------------------------------------------------------------------------- | ------ |
| SR-1 | Användaren ska bara kunna skriva max. X tecken på respektive inmatningsfält      | T      |
| SR-2 | Användaren ska bara kunna skapa ett användarnamn på max. X tecken                | T      |
| SR-3 | Användaren ska bara kunna skriva godkända datatyper på respektive inmatningsfält | T & D  |
| SR-4 | Användaren ska bara kunna skriva tillåtna tecken                                 | T      |
| SR-5 | Användaren ska inte kunna se känslig information via felmeddelanden              | I      |
| SR-6 | Användaren behöver logga in för att skapa, redigera och ta bort meddelanden      | S & R  |

#### Backend

| SR   | SÄKERHETSKRAV                                                        | STRIDE  |
| ---- | -------------------------------------------------------------------- | ------- |
| SR-7 | Användare ska inte kunna skicka för många anrop från samma IP-adress | D       |
| SR-8 | Användaren ska inte kunna försöka logga in för många gånger          | S & D   |
| SR-9 | Användaren ska kontrolleras för behörighet vid varje request         | S, E, R |

#### Databas

| SR    | SÄKERHETSKRAV                                                                      | STRIDE   |
| ----- | ---------------------------------------------------------------------------------- | -------- |
| SR-10 | Användaren ska inte kunna se lösenord i klartext                                   | I & S    |
| SR-11 | Användaren ska inte ha direkt klientåtkomst till databasen                         | E, R & I |
| SR-12 | Det ska finnas en säkerhetskopia av databasen ifall användaren förstör/raderar den | I & T    |
