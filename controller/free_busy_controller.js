
const free_busy_service = require('../services/get_free_busy');
const logger = require('../utils/logger');
const _ = require('underscore');

exports.free_busy_controller = async (req, res) => {
    let data_check = {};
    data_check.calendarID = req.query.calendarID;
    let startDate = new Date(req.query.startDate);
    let date_time_after = new Date(new Date(req.query.startDate).setMinutes(startDate.getMinutes()+30));
    data_check.startDate = startDate;
    data_check.endDate = date_time_after;
    try {
        await free_busy_service.free_busy_service(data_check);
        let freeOrBusy = data_check.result.calendars[data_check.calendarID].busy;
        let errors = data_check.result.calendars[data_check.calendarID].errors;
        if(!_.isUndefined(errors)){
            res.send({
                statusMessage:"We are not able to get free or busy time. Please check if user share his calendar with you.",
                freeOrBusy: "Un processable"
            });
        } else {
            if(freeOrBusy.length===0){
                res.send({
                    statusMessage:"Person is free, You can book appointment at given time.",
                    freeOrBusy: "Free"
                });
            } else if(freeOrBusy.length>0){
                res.send({
                    statusMessage:"Person is not free, He is busy in below time. Please choose any other time.",
                    freeOrBusy: "Busy"
                });
            }
        }
    } catch (error){
        logger.error("Getting Error:--- "+error);
        res.send("Getting Error:---"+error);
    }
}