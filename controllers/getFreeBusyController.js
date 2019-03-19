'use strict';
const logger = require('../utils/logger.js');
const get_free_busy = require('./getFreeBusyControllerService');

module.exports.getfreebusy = function (req, res, next) {
    logger.info("Selecting getFreeBusy controllers");
    get_free_busy.getfreebusy(req, res, next);
}