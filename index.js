const five = require('johnny-five');
const board = new five.Board();

const led = require('./src/modules/led/led');
const button = require('./src/modules/button/button');
const thermometer = require('./src/modules/thermometer/thermometer');

board.on('ready', () => {
    led.blink();
    button.addListeners();
    thermometer.listenOnTemperatureChange();
});
