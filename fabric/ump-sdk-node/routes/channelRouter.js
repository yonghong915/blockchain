/**
*
*
*/
var commonUtil = require('../common/commonUtil.js');
var logger = commonUtil.logger('channel');
var express = require('express');
var router = express.Router();
var channelUtil = require('../common/channelUtil.js');

router.use(function(req, res, next) {
    logger.info('=================================');
    logger.info(`${req.method}, ${req.url}`);
    logger.info('=================================');
    next()
});

/**
*http://192.168.56.11:8088/ump/channel/createChannel
******************createChannel**************************
{
    "type":"channel",
    "method":"create",
    "params":{
                "systemParams":{
                                "channelName":"mychannel",
                                "org":"org1",
                                "channelConfigPath":""
                            },
                "businessParams":{
                                "function":"",
                                "args":[]
                            }
            } 
}
*********************************************************
*/
router.post('/createChannel', function(req, res) {
    if (!req.body) {
    	logger.error('params body is empty.');
		return res.sendStatus(400);
	}

	//if(!systemParams || !businessParams){
     //   logger.error('systemParams or businessParams could not be empty.');
     //   return;
	//}
    
    let retData = {
    	status : '000000',
        msg :'成功'
    };
    var request = {};
    channelUtil.createChannel(request).then((result) => {
    	res.end(JSON.stringify(retData));
    },(err) => {
    	logger.error(err.stack ? err.stack : err);
    	retData.msg = err.message;
    	res.end(JSON.stringify(retData));
    }).catch((err) => {
		logger.error(err.stack ? err.stack : err);
		retData.msg = err.message;
    	res.end(JSON.stringify(retData));
	});	
});


router.get('/', function(req, res) {
  res.send('首页');
});

router.get('/about', function(req, res) {
	let retData = {
    	status : '000000',
        msg :'成功'
    };
    logger.info('/channel/about');
    res.end(JSON.stringify(retData));
});

router.get('/channels/:channelName/blocks/:blockId', function(req, res) {


});




module.exports = router;