var gp = window.gp || {};

(function (ns, undefined) {
    "use strict";

    var leafletUtils = window.leafletUtils || {};
    leafletUtils.SkTiles = function (options) {
        return L.tileLayer(
            'http://opencache.statkart.no/gatekeeper/gk/gk.open_gmaps?layers=' + options.layers + '&zoom={z}&x={x}&y={y}',
            {
                attribution: "&copy; <a href='http://statkart.no'>Kartverket</a>"
            }
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

            marker.addTo(this.map)
                .bindPopup(model.get("NAVN"))
                .openPopup();

            this.map.panTo(model.get("marker").getLatLng()).setZoom(12);
        }
    });

}(gp));