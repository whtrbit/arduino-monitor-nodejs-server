const moment = require('moment');

/**
 * @param {number} timestamp
 * @return {boolean}
 */
const isOlderLeastADay = function (timestamp) {
    const now = new Date();

    return moment(timestamp).isBefore(now, 'day');
};

/**
 * @param {number} timestamp
 * @return {boolean}
 */
const isOlderLeastAnHour = function (timestamp) {
    const now = new Date();

    return moment(timestamp).isBefore(now, 'hour');
};

/**
 * @param {Date} date
 * @return {number}
 */
const convertToTimestamp = function (date) {
    return Number(moment(date).format('x'));
};

module.exports.isOlderLeastADay = isOlderLeastADay;
module.exports.isOlderLeastAnHour = isOlderLeastAnHour;
module.exports.convertToTimestamp = convertToTimestamp;
