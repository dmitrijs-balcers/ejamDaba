// http://papaparse.com/docs
var fs = Npm.require('fs'),
    Future = Npm.require('fibers/future');

// Move to the client

Meteor.methods({
    test: function () {

        var fut = new Future(), points = [];

        fs.readFile(process.env.PWD + '/data.csv', 'utf8', function (err, data) {
                if (err) {
                    fut.throw(err);
                    return;
                }

                // Try to use headers as property keys
                Papa.parse(data,
                    {
                        dynamicTyping: true,
                        step: function (row) {
                            points.push({
                                    lat: row.data[0][2],
                                    lng: row.data[0][3]
                                }
                            );
                        },
                        complete: function () {
                            // Why this is being executed two times?
                            fut.return(points);
                        }
                    })
            });

        return fut.wait();
    }
});