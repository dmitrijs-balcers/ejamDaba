// http://www.gpsvisualizer.com/convert_input
// set comma separator

Meteor.startup(function () {
    GoogleMaps.load();
    Meteor.subscribe('routes');
});

Template.map.onCreated(function () {
    GoogleMaps.ready('map', function (map) {
        console.log("I'm ready!");

        var marker = new google.maps.Marker({
            position: map.options.center,
            map: map.instance
        });

        Routes.find().observeChanges({
            added: function (id, route) {
                var flightPath = new google.maps.Polyline({
                    path: route.route,
                    geodesic: true,
                    strokeColor: '#FF0000',
                    strokeOpacity: 1.0,
                    strokeWeight: 2,
                    map: map.instance
                });
            }
        })
    });
});

Template.map.helpers({
    mapOptions: function () {
        if (GoogleMaps.loaded()) {
            return {
                center: new google.maps.LatLng(56.94, 24.1),
                zoom: 8,
                mapTypeId: google.maps.MapTypeId.TERRAIN
            };
        }
    }
});

AddRoute = BlazeComponent.extendComponent({
    onCreated: function () {
        this.points = new ReactiveVar([]);
        this.done = new ReactiveVar(false);
    },
    isDone: function () {
        return this.done.get();
    },
    events: function () {
        return [{
            'change #attachment': function (e) {

                var self = this, points = [];

                Papa.parse(this.find('#attachment').files[0], {
                    header: true,
                    skipEmptyLines: true,
                    dynamicTyping: true,
                    step: function (row) {
                        points.push({lat: row.data[0].latitude, lng: row.data[0].longitude});
                    },
                    complete: function () {
                        console.log('imported');
                        self.points.set(points);
                    }
                });
            },

            'submit .add-csv': function (e) {
                e.preventDefault();

                var self = this,
                    points = this.points.get();

                if (points) {
                    Meteor.call('importRoute', this.points.get(), function(err) {
                        if (err) {
                            console.log(err);
                        }
                        self.points.set(false);
                        self.done.set(true);
                    });
                }
            }
        }];
    }
}).register('addRoute');