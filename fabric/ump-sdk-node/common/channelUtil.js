'use strict';
/**
*
*/
var commonUtil = require('./commonUtil');
var logger = commonUtil.logger('channel');
var Client = require('fabric-client');
var createChannel = function(request) {
    logger.debug('======createChannel begin======');
    var errorMsg = null;
    if(!request){
       errorMsg = 'Missing request object for this create channel';
    }
    if(errorMsg) {
        logger.error('createChannel error %s',errorMsg);
        return Promise.reject(new Error(errorMsg));
    }

    var channelName = 'mychannel';
    var org = 'org1';
    var channelConfigPath = '../config/channel/channel-artifacts/channel.tx';
    var client = commonUtil.getClientForOrg(org);
    var channel = commonUtil.getChannelForOrg(org,channelName);
    logger.debug('client=%s',client);
    logger.debug('channel=%s',channel);
    logger.debug('======createChannel end======');
    let envelope_bytes = fs.readFileSync(path.join(__dirname,channelConfigPath));
    let channelConfig = client.extractChannelConfig(envelope_bytes);


    let signature = client.signChannelConfig(channelConfig);
    signatures.push(signature);

    var url = '192.168.56.11:7050';
    var opts = {};
    var orderer = client.newOrderer(url,opts);
    let tx_id = client.newTransactionID();

    request = {
        config: channelConfig, //the binary config
        signatures : signatures, // the collected signatures
        name : 'mychannel', // the channel name
        orderer : orderer, //the orderer from above
        txId  : tx_id //the generated transaction id
    };
    client.createChannel(request);
    return Promise.resolve('ok');
}
module.exports.createChannel = createChannel;



