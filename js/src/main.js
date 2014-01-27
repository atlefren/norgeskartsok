(function () {
    "use strict";

    proj4.defs(
        "EPSG:25833",
        "+proj=utm +zone=33 +ellps=GRS80 +units=m +no_defs"
    );


    proj4.defs(
        "EPSG:25832",
        "+proj=utm +zone=32 +ellps=GRS80 +units=m +no_defs"
    );

    var searchCollection = new nks.SearchCollection();
    var map = new nks.MapView({
        el: $("#map"),
        collection: searchCollection
    }).render();

    map.$el.append(
        new nks.SearchView({collection: searchCollection}).render().$el
    );

}());