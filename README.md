Norgeskartsøk
=============

Lite script for å sette opp et kart som bruker apiet fra http://eiendom.statkart.no/ til å søke i norske adresser/stedsnavn/eiendommer/bygninger


NB: APIet fra http://eiendom.statkart.no/ er ikke åpent for offentligheten, ref https://twitter.com/kartverket/status/428468594037362688
~~Bruksvilkårene for http://eiendom.statkart.no/ er ukjente, men håper å provosere frem noe ;)~~

Issues
------
* Noen resultater returnerer ikke EPSG-kode, antar EPSG:25832 for disse
* Enn så lenge ingen mulighet for å begrense på type
* Enn så lenge ingen mulighet for å begrense på fylke/kommune
* ??

Demo
----
https://rawgithub.com/atlefren/norgeskartsok/master/index.html

Lisens
------
MIT

Bibliotek brukt
---------------
The usual suspects:
* jQuery
* Backbone
* Underscore
* Bootstrap
* Leaflet
