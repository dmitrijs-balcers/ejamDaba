// http://papaparse.com/docs
var fs = Npm.require('fs'),
    Future = Npm.require('fibers/future');

// Move to the client

Meteor.methods({
    importRoute: function(route) {
        console.log('importRoute'); // TODO: use simulation

        Routes.insert({
            route: route
        });
    }
});