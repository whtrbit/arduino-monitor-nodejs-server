const five = require('johnny-five');
const board = new five.Board();

const led = require('./src/modules/led/led');

board.on('ready', () => {
    led.blink();
});
