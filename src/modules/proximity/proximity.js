const five = require('johnny-five');

const listenOnData = function () {
    const ping = new five.Ping(7);

    ping.on("change", function () {
        if (this.cm <= 3) {
            console.log('Proximity sensor too close to object.');
        } else if (this.cm >= 2200) {
            console.log('Proximity sensor too far from object.');
        } else {
            console.log('Proximity: ' + (this.cm / 100).toFixed(2) + 'm');
        }
    });
};

module.exports.listenOnData = listenOnData;
