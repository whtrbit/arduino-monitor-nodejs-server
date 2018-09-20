const moment = require('moment');

const isOlderLeastADay = function (timestamp) {
    const now = new Date();

    return moment(timestamp).isBefore(now, 'day');
};

module.exports.isOlderLeastADay = isOlderLeastADay;
