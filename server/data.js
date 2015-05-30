var fs = Npm.require('fs');

// Move to the client

Meteor.methods({
    test: function () {

        Future = Npm.require('fibers/future');


        var testFuture = new Future();
        console.log('test');
        var points = [];

        fs.readFile(process.env.PWD + '/data.csv', 'utf8', function (err, data) {
                if (err) {
                    console.error(err);
                    testFuture.throw(err);
                    return;
                }


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
                            testFuture.return(points);
                        }
                    })
            });

        console.log("Going to wait");

        return testFuture.wait();
    }
});


function loadData() {
    var basepath = "";

    csv().from.stream(
        fs.createReadStream(basepath + 'server/data/enron_data.csv'),
        {'escape': '\\'})
        .on('record', Meteor.bindEnvironment(function (row, index) {
                Emails.insert({
                    'sender_id': row[0]
                    // etc.
                })
            }, function (error) {
                console.log('Error in bindEnvironment:', error);
            }
        ))
        .on('error', function (err) {
            console.log('Error reading CSV:', err);
        })
        .on('end', function (count) {
            console.log(count, 'records read');
        });

}