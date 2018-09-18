const five = require('johnny-five');
const board = new five.Board();

// const led = require('./src/modules/led/led');
// const button = require('./src/modules/button/button');
// const thermometer = require('./src/modules/thermometer/thermometer');

board.on('ready', function () {
    // led.blink();
    // button.addListeners();
    // thermometer.listenOnTemperatureChange();

    const firmata = this.io;
    const pin = 2;

    firmata.sendOneWireConfig(pin, true);
    firmata.sendOneWireSearch(pin, function(error, devices) {
        if(error) {
            console.error(error);
            return;
        }

        // only interested in the first device
        var device = devices[0];

        var readTemperature = function () {
            // start transmission
            firmata.sendOneWireReset(pin);

            // a 1-wire select is done by ConfigurableFirmata
            firmata.sendOneWireWrite(pin, device, 0x44);

            // the delay gives the sensor time to do the calculation
            firmata.sendOneWireDelay(pin, 1000);

            // start transmission
            firmata.sendOneWireReset(pin);

            // tell the sensor we want the result and read it from the scratchpad
            firmata.sendOneWireWriteAndRead(pin, device, 0xBE, 9, function(error, data) {
                if(error) {
                    console.error(error);
                    return;
                }
                var raw = (data[1] << 8) | data[0];
                var celsius = raw / 16.0;
                var fahrenheit = celsius * 1.8 + 32.0;

                console.info("celsius", celsius);
                console.info("fahrenheit", fahrenheit);
            });
        };
        // read the temperature now
        readTemperature();
        // and every five seconds
        setInterval(readTemperature, 5000);
    });
});
