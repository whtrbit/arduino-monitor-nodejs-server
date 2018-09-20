const request = require('request');
const five = require('johnny-five');

const SETUP_ALARM = true;

const listenOnData = function () {
    const ping = new five.Ping({
        pin: 7,
        freq: 3000
    });
    const getDistanceInMeters = function (distance) {
        return (distance / 100).toFixed(2);
    };
    /**
     * [
     *     initialDistance,
     *     currentDistance,
     *     previousDistance
     * ]
     */
    let distanceArr = [
        null, null, null
    ];

    ping.on('change', function () {
        if (this.cm <= 3) {
            console.log('Proximity sensor too close to object.');
        } else if (this.cm >= 2200) {
            console.log('Proximity sensor too far from object.');
        } else {
            if (SETUP_ALARM) {
                distanceArr[0] = distanceArr[1] === null ? this.cm : distanceArr[0];
                distanceArr[1] = this.cm;
                distanceArr[2] = distanceArr[1];

                if (Math.abs(distanceArr[1] - distanceArr[0]) > 20) { // if object got closer 20 cm
                    saveProximityOnDatabse(getDistanceInMeters(this.cm));
                }
            }
            console.log('Proximity: ' + getDistanceInMeters(this.cm) + 'm');
        }
    });
};

/**
 * @param {{distance: number}} data - float number in cm
 */
const saveProximityOnDatabse = function (data) {
    console.log('@TODO: add scheduler');
    return;

    request({
        url: 'https://us-central1-arduino-monitor-7a5c5.cloudfunctions.net/saveProximityAlarm',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            distance: data.distance,
            date: new Date()
        })
    }, function (err, res) {
        if (err) {
            console.log(err);
            return undefined;
        } else if (res.statusCode === 201) {
            console.log('Proximity alarm saved:\n', res.body);
        }
    });
};

module.exports.listenOnData = listenOnData;
