'use strict';
const logger = require('../../utils/logger.js');

const get_free_busy = require('../../controllers/getFreeBusyController');
/**
 * Reports specific from Project will be generated from here.
 */
module.exports = {
    getFreeBusyController: function getProject(req, res) {
        logger.info("Selecting getFreeBusy controllers");
        get_free_busy.free_busy_controller(req, res);
    }
};
