const five = require('johnny-five');
const fs = require('fs');
const path = require('path');
const request = require('request');
const dateUtilities = require('../utilities/date');

const thermometer = new five.Thermometer({
    controller: 'DS18B20',
    pin: 2
});
const logsPath = path.resolve(__dirname + '/logs.json');
const logs = JSON.parse(fs.readFileSync(logsPath, 'utf8')).logs;
let isChecked = logs.length > 0 && !dateUtilities.isOlderLeastADay(logs[0].date);

const listenOnTemperatureChange = function () {
    thermometer.on('change', function () {
        setInterval(function () {
            console.log('Temperature = ' + this.celsius + '°C');

            if (!isChecked) {
                saveTemperatureOnDatabse(Number.round(this.celsius));
            }
        }, 3600000); // ev 1h
    });
};

const saveTemperatureOnDatabse = function (celsius) {
    if (isChecked) {
        console.log('Already saved today.');
        return undefined;
    }

    request({
        url: 'https://us-central1-arduino-monitor-7a5c5.cloudfunctions.net/saveTemperature',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            celsius: celsius,
            date: new Date()
        })
    }, function (err, res) {
        if (err) {
            console.log(err);
            return undefined;
        } else if (res.statusCode === 201) {
            console.log('Temperature saved:\n', res.body);
            logs.splice(0, 0, JSON.parse(res.body));

            fs.writeFile(logsPath, JSON.stringify({logs: logs}, null, 4), function (err) {
                if (err) throw err;
                console.log('Temperature saved in logs.');
            });
        }
    });
};

module.exports.listenOnTemperatureChange = listenOnTemperatureChange;
module.exports.saveTemperatureOnDatabse = saveTemperatureOnDatabse;
