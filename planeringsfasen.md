# Inlämning 1 - Planeringsfasen

## Systemskiss - Motivering

_(För mer information och detaljerade motiveringar se sliden i filen "YH - Message app - DEMO-Maj27.pdf" som ligger i rooten av den här repositoryn)._

Vi har valt att behålla det förenklade dataflödesdiagrammet på global nivå, då applikationens arkitektur inte kräver en komplex design. Browser och frontend visas i skissen som klientdelen utanför tillitszonen, medan backend/API och databas ligger inom vårt system. Backend och API hålls ihop eftersom API-endpoints och routing är en del av Express-backendens logik, inte en separat gateway eller tjänst.

![image info](systemskiss-hotmodellering.png)

## Hotmodellering (STRIDE)

Vi har utgått från den förenklade Rapid Threat Modeling-modellen där komponenter först klassas utifrån om de tillhör vårt system och hur skyddsvärda de är:

- **Browser och frontend har värde 0 eftersom de ligger utanför vår tillitszon.** Större påverkan på systemet vid kompromettering/driftstörning eftersom backend hanterar logik, API-routing, behörighet och bearbetningen av lagrad data. Darför gav vi backenden ett initialt högt värde (3). Men eftersom den utgör ingångspunkt till tillitszonen, innebär det enligt modellen att backend/API får värde 1. Det betyder inte att den inte kräver striktare säkerhetsåtgärder, utan att den här aspekten inte fångas fullt ut av de förenklade reglerna i den här skissen.

- **Dataflödet mellan komponenter med olika skysddsvärde**
