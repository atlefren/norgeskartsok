(function () {
    "use strict";

    proj4.defs(
        "EPSG:25833",
        "+proj=utm +zone=33 +ellps=GRS80 +units=m +no_defs"
    );

    var searchCollection = new gp.SearchCollection();
    var map = new gp.MapView({
        el: $("#map"),
        collection: searchCollection
    }).render();

    map.$el.append(
        new gp.SearchView({collection: searchCollection}).render().$el
    );

}());