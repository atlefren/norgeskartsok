var gp = window.gp || {};

(function (ns, undefined) {
    "use strict";

    var SearchResult = Backbone.Model.extend({

        initialize: function (attributes, options) {
            var hasPosition = (
                attributes.LONGITUDE &&
                attributes.LATITUDE &&
                attributes.EPSGKODE
            );
            if (hasPosition) {
                var lon = parseFloat(attributes.LONGITUDE.replace(",", "."));
                var lat = parseFloat(attributes.LATITUDE.replace(",", "."));
                var fromCRS = "EPSG:" + attributes.EPSGKODE;
                var point = proj4(fromCRS, "EPSG:4326", [lon, lat]);
                this.set("marker", L.marker([point[1], point[0]]));
            }
        }

    });

    ns.SearchCollection = Backbone.Collection.extend({

        url: "http://eiendom.statkart.no/Search.ashx",

        source: ["sted", "matreiendom", "matrbygning", "matradresse"],

        model: SearchResult,

        getSource: function () {

            if (this.source.length) {
                return this.source.join(",");
            }
            return "";
        },

        search: function (term, municipalityNr, countyNr) {
            this.fetch({
                data: {
                    filter: "KILDE:" + this.getSource(),
                    term: term
                },
                dataType: "jsonp",
                reset: true
            });
        }
    });

}(gp));