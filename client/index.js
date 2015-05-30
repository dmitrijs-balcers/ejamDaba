Meteor.startup(function () {
    GoogleMaps.load();
});

Template.map.onCreated(function () {
    GoogleMaps.ready('map', function (map) {
        console.log("I'm ready!");

        var marker = new google.maps.Marker({
            position: map.options.center,
            map: map.instance
        });

        Meteor.call('test', function (err, route) {

            var flightPlanCoordinates = [];

            _.each(route, function (point) {
                flightPlanCoordinates.push(new google.maps.LatLng(point.lat, point.lng));
            });

            var flightPath = new google.maps.Polyline({
                path: flightPlanCoordinates,
                geodesic: true,
                strokeColor: '#FF0000',
                strokeOpacity: 1.0,
                strokeWeight: 2,
                map: map.instance
            });
        });


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

Template.addRoute.events({
    'submit .add-csv': function (e) {
        e.preventDefault();
        console.log('test');
        return false;
    }
});