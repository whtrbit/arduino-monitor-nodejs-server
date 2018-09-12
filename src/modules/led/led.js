const five = require('johnny-five');

const blink = () => {
    const led = new five.Led(13);

    led.blink(500);
}

module.exports.blink = blink;
