var nks = window.nks || {};

(function (ns, undefined) {
    "use strict";

    var leafletUtils = window.leafletUtils || {};
    leafletUtils.SkTiles = function (options) {
        return L.tileLayer(
            'http://opencache.statkart.no/gatekeeper/gk/gk.open_gmaps?layers=' + options.layers + '&zoom={z}&x={x}&y={y}'
        );
    };

    ns.MapView = Backbone.View.extend({

        initialize: function () {
            this.collection.on("reset", this.showMarkers, this);
            this.collection.on("selected", this.showMarker, this);
        },

        render: function () {
            this.map = L.map(this.$el[0]).setView([65.5, 15], 5);
            leafletUtils.SkTiles({layers: "topo2"}).addTo(this.map);
            return this;
        },

        showMarkers: function (event, options) {
            this.map.setView([65.5, 15], 5);
            _.each(options.previousModels, function (model) {
                if (model.has("marker")) {
                    this.map.removeLayer(model.get("marker"));
                }
            }, this);

            this.collection.each(function (model) {
                if (model.has("marker")) {
                    this.map.addLayer(model.get("marker"));
                }
            }, this);
        },

        showMarker: function (model) {
            this.collection.each(function (model) {
                if (model.has("marker")) {
                    this.map.removeLayer(model.get("marker"));
                }
            }, this);

            var marker = model.get("marker");
            marker.addTo(this.map);
            this.map.panTo(model.get("marker").getLatLng()).setZoom(12);
        }
    });

}(nks));
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
var nks = window.nks || {};

(function (ns, undefined) {
    "use strict";

    var SearchField = Backbone.View.extend({

        //tagName: "input",

        className: "input-group",

        events: {
            "keyup input": "search"
        },

        template: $("#search_form_template").html(),

        initialize: function () {
            _.bindAll(this, "search");
            this.collection.on("selected", this.showResult, this);
        },

        render: function () {
            this.$el.html(this.template);
            return this;
        },

        showResult: function (model) {
            this.$("input").val(model.get("NAVN"));
        },

        search: function () {
            var term = this.$("input").val();
            if (term === "") {
                this.collection.reset([]);
            } else {
                this.collection.search(term);
            }
        }
    });

    var ResultView = Backbone.View.extend({

        tagName: "a",

        className: "list-group-item",

        events: {
            "click": "selected"
        },

        template: "<%= NAVN %> (<%= KILDE %>)",

        initialize: function () {
            _.bindAll(this, "selected");
        },

        render: function () {
            this.$el.attr("href", "#");
            this.$el.html(_.template(this.template, this.model.toJSON()));
            return this;
        },

        selected: function (evt) {
            evt.preventDefault();
            this.model.selected();
        }

    });

    var ResultsView = Backbone.View.extend({

        className: "list-group",

        initialize: function () {
            this.collection.on("reset", this.render, this);
            this.collection.on("selected", this.emptyResults, this);
        },

        render: function () {

            var results = this.collection.filter(function (model) {
                return model.has("marker");
            });

            if (results.length) {
                this.$el.html(_.map(results, function (model) {
                    return new ResultView({model: model}).render().$el;
                }));
                this.$el.removeClass("hidden");
            } else {
                this.emptyResults();
            }
            return this;
        },

        emptyResults: function () {
            this.$el.html();
            this.$el.addClass("hidden");
        }

    });

    ns.SearchView = Backbone.View.extend({

        className: "search-control",

        initialize: function () {
            this.searchField = new SearchField({collection: this.collection});
            this.resultsView = new ResultsView({collection: this.collection});
        },

        render: function () {
            this.$el.append(this.searchField.render().$el);
            this.$el.append(this.resultsView.render().$el);
            return this;
        }

    });
}(nks));
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