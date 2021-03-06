var nks = window.nks || {};

(function (ns, undefined) {
    "use strict";

    var SearchResult = Backbone.Model.extend({

        initialize: function (attributes, options) {

            _.bindAll(this, "selected");

            var hasPosition = (
                attributes.LONGITUDE &&
                attributes.LATITUDE
            );
            if (hasPosition) {
                var lon = parseFloat(attributes.LONGITUDE.replace(",", "."));
                var lat = parseFloat(attributes.LATITUDE.replace(",", "."));

                var fromCRS = "EPSG:25832"; //assume this when no EPSG-code in result
                if (attributes.EPSGKODE) {
                    fromCRS = "EPSG:" + attributes.EPSGKODE;
                }
                var point = proj4(fromCRS, "EPSG:4326", [lon, lat]);
                this.set(
                    "marker",
                    L.marker(
                        [point[1], point[0]],
                        {title: attributes.NAVN}
                    )
                );

                this.get("marker").on('click', this.selected);
            }
        },

        selected: function () {
            this.collection.trigger("selected", this);
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

}(nks));