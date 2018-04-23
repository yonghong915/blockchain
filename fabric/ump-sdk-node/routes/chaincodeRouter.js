/**
*
*
*/
var commonUtil = require('../common/commonUtil.js');
var logger = commonUtil.logger('channel');
var express = require('express');
var router = express.Router();
var chaincodeUtil = require('../common/chaincodeUtil.js');
router.use(function(req, res, next) {
    logger.info('=================================');
    logger.info(`${req.method}, ${req.url}`);
    logger.info('=================================');
    next()
});


/**
*http://192.168.56.11:8088/ump/channel/createChannel
******************queryChaincode**************************
{
    "type":"chaincode",
    "method":"query",
    "params":{
                "systemParams":{
                                "channelName":"mychannel",
                                "org":"org1",
                                "chaincodeName":""
                            },
                "businessParams":{
                                "function":"",
                                "args":[]
                            }
            } 
}
*********************************************************
*/
router.post('/queryChaincode', function(req, res) {
    if (!req.body) {
    	logger.error('params body is empty.');
		return res.sendStatus(400);
	}
    
    let retData = {
    	status : '000000',
        msg :'成功'
    };
    var request = {
    	chaincodeId : 'mycc'
    };
    chaincodeUtil.queryChaincode(request).then((result) => {
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


module.exports = router;