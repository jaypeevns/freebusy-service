'use strict';
const logger = require('../../utils/logger.js');
const _ = require('underscore');

const get_free_busy = require('../../controller/free_busy_controller');
/**
 * Reports specific from Project will be generated from here.
 */
module.exports = {
    getFreeBusy: function getProject(req, res) {
        logger.info("Selecting getFreeBusy controller");
        get_free_busy.free_busy_controller(req, res);
    }
};
