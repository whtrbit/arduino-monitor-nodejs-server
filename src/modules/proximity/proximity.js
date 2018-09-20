const request = require('request');
const five = require('johnny-five');

const SETUP_ALARM = false;

const listenOnData = function () {
    const ping = new five.Ping(7);

    ping.on('change', function () {
        if (this.cm <= 3) {
            console.log('Proximity sensor too close to object.');
        } else if (this.cm >= 2200) {
            console.log('Proximity sensor too far from object.');
        } else {
            if (SETUP_ALARM) {
                setupAlarm(this.cm);
            }
            console.log('Proximity: ' + (this.cm / 100).toFixed(2) + 'm');
        }
    });
};

/**
 * @param {{distance: number}} data - float number in cm
 */
const setupAlarm = function (data) {
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
