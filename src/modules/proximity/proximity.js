const five = require('johnny-five');
const fs = require('fs');
const path = require('path');
const request = require('request');
const dateUtilities = require('../../utilities/date');

const SETUP_ALARM = false;
const logsPath = path.resolve(__dirname + '/logs.json');
const logs = JSON.parse(fs.readFileSync(logsPath, 'utf8')).logs;
let isChecked = logs.length > 0 && !dateUtilities.isOlderLeastAnHour(logs[0].date);

const listenOnData = function () {
    const ping = new five.Ping({
        pin: 7,
        freq: 3000
    });

    console.log('Proximity sensor ready' + SETUP_ALARM ? ' with alarm watcher.' : '.');

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
            console.log(dateUtilities.isOlderLeastAnHour(logs[0].date));

            if (SETUP_ALARM) {
                distanceArr[0] = distanceArr[1] === null ? this.cm : distanceArr[0];
                distanceArr[1] = this.cm;
                distanceArr[2] = distanceArr[1];

                if (Math.abs(distanceArr[1] - distanceArr[0]) > 20) { // if object got closer 20 cm
                    saveProximityOnDatabase(getDistanceInMeters(this.cm));
                }
            }
            console.log('Proximity: ' + getDistanceInMeters(this.cm) + 'm');
        }
    });
};

/**
 * @param {number} distance - float in meters
 */
const saveProximityOnDatabase = function (distance) {
    if (isChecked) {
        console.log('Alarm already set at least an hour ago.');
        return undefined;
    }

    request({
        url: 'https://us-central1-arduino-monitor-7a5c5.cloudfunctions.net/saveProximityAlarm',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            distance: distance,
            date: dateUtilities.convertToTimestamp(new Date())
        })
    }, function (err, res) {
        if (err) {
            console.log(err);
            return undefined;
        } else if (res.statusCode === 201) {
            console.log('Proximity alarm saved:\n', res.body);

            logs.splice(0, 0, JSON.parse(res.body));
            fs.writeFile(logsPath, JSON.stringify({logs: logs}, null, 4), function (err) {
                if (err) throw err;
                console.log('Alarm saved in logs.');
            });
        }
    });

    console.log('\n\n');
};

module.exports.listenOnData = listenOnData;
