Routes = new Mongo.Collection('routes');

Meteor.publish('routes', function() {
    return Routes.find({}); // Todo test if it is being called
});