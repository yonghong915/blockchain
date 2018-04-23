/**
*
*/
var express = require('express');
var app = express();
var bodyParser = require("body-parser");
var commonUtil = require('./common/commonUtil.js');
var logger = commonUtil.logger('index');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(__dirname + '/public'));

var channelRouter=require('./routes/channelRouter.js');
var chaincodeRouter=require('./routes/chaincodeRouter.js');

var config = require('./config/config.json');
var host = process.env.HOST || config.host;
var port = process.env.PORT || config.port;


var chaincodeUtil = require('./common/chaincodeUtil.js');
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

//var server = app.listen(port, function () {
//	  logger.info("application WebApp,access address is http://%s:%s", host, port);
//});

/**
*
*/
app.use("*", function(request, response, next) {
    response.writeHead(200, { "Content-Type": "application/json;charset=utf-8" });
    next();
});


//路由
app.use('/ump/channel',channelRouter);
app.use('/ump/chaincode',chaincodeRouter);




//注册异常处理器
process.on('unhandledRejection', function (err) {
    console.error(err.stack);
});

process.on(`uncaughtException`, console.error);

module.exports = app;