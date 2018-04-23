'use strict';
/**
*
*/
var commonUtil = require('./commonUtil');
var logger = commonUtil.logger('channel');
var util = require('util');
var Client = require('fabric-client');
var fs = require('fs-extra');
var path = require('path');
var queryChaincode = function(request, channelName, chaincodeName, args, fcn, username, org_name) {
    Client.setConfigSetting('request-timeout', 60000);
    var channel_name = 'mychannel';
    var client = new Client();

   var orgName = 'org1';
  var cryptoSuite = Client.newCryptoSuite();
  cryptoSuite.setCryptoKeyStore(Client.newCryptoKeyStore({path: 'ksv_org1'}));
  client.setCryptoSuite(cryptoSuite);


    var channel = client.newChannel(channel_name);
    let data = fs.readFileSync(path.join(__dirname, '../config/channel/crypto-config/peerOrganizations/org1.fyh.com/peers/peer0.org1.fyh.com/msp/tlscacerts/tlsca.org1.fyh.com-cert.pem'));
    let peer = client.newPeer(
          'grpcs://192.168.56.11:7051',
          {
            pem: Buffer.from(data).toString(),
            'ssl-target-name-override': 'peer0.org1.fyh.com'
          });
        channel.addPeer(peer);
        var chaincodeId = 'mycc';
        var request = {
      chaincodeId : chaincodeId,
      fcn: 'query',
      args: ['b']
    };

    logger.debug('peer=%s',peer);

    return channel.queryByChaincode(request)
    
  //(err) => {
    //t.fail('Failed to get submitter \'admin\'. Error: ' + err.stack ? err.stack : err );
   // throw new Error('Failed to get submitter');
  .then((response_payloads) => {
    if (response_payloads) {
      for(let i = 0; i < response_payloads.length; i++) {
        if (transientMap) {
          //t.equal(
           // response_payloads[i].toString(),
           // transientMap[Object.keys(transientMap)[0]].toString(),
           // 'Checking the result has the transientMap value returned by the chaincode');
        } else {
         // t.equal(
          //  response_payloads[i].toString('utf8'),
          //  value,
           // 'checking query results are correct that user b has '+ value + ' now after the move');
        }
      }
      return true;
    } else {
     // t.fail('response_payloads is null');
      throw new Error('Failed to get response on query');
    }
  },
  (err) => {
   // t.fail('Failed to send query due to error: ' + err.stack ? err.stack : err);
    throw new Error('Failed, got error on query');
  });
}



exports.queryChaincode = queryChaincode;