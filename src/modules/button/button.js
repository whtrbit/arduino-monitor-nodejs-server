const five = require('johnny-five');

const listeners = function () {
    const button = new five.Button(2);

    button.on('hold', function () {
        console.log('Button held.');
    });
    button.on('press', function () {
        console.log('Button pressed.');
    });
    button.on('release', function () {
        console.log('Button released.');
    });
};

module.exports.addListeners = listeners;
