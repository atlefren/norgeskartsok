var gp = window.gp || {};

(function (ns, undefined) {
    "use strict";

    var SearchField = Backbone.View.extend({

        tagName: "input",

        className: "form-control",

        events: {
            "keyup": "search"
        },

        initialize: function () {
            _.bindAll(this, "search");
            this.collection.on("selected", this.showResult, this);
        },

        render: function () {
            this.$el.attr("type", "text");
            this.$el.attr("placeholder", "Søk");
            return this;
        },

        showResult: function (model) {
            this.$el.val(model.get("NAVN"));
        },

        search: function () {
            var term = this.$el.val();
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
            this.model.collection.trigger("selected", this.model);
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
}(gp));