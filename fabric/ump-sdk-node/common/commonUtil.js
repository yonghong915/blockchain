'use strict';
/**
*
*/
var log4js = require('./log4js');
var logger = log4js.getLogger('common');
var path = require('path');
var fs = require('fs-extra');
var Client = require('fabric-client');
var FabricCAService = require('fabric-ca-client');
var config = require('../config/config.json');
var clients = {};
var channels = {};
var caClients = {};
var peerTargets = [];
var eventHubs = [];
var ORGS;

initalize();
function initalize(){
	initOrg();
	initNodesCfg();
	logger.debug('clients=%s',clients);
}

function initOrg() {
	logger.debug('init loading Org Info from network-config.json.');
	if (!ORGS) {
		Client.addConfigFile(path.join(__dirname, '../config/network-config.json'));
		ORGS = Client.getConfigSetting('network-config');
	}
	return ORGS;
}

function initNodesCfg(){
	logger.debug('init loading nodes config info.');
	initPeers();
	//logger.info('channels=%s',JSON.stringify(channels));
}

function initPeers(){
	logger.debug('ORGS=%s',JSON.stringify(ORGS));
    for(let key in ORGS.peer){
        logger.info('ORGS.key=%s',JSON.stringify(key));
        if (key.indexOf('org') === 0) {
            let client = new Client();

            channels[key] = {};
            for (let index in config.channelsList) {
                let channelName = config.channelsList[index];
	            let channel = client.newChannel(channelName);
	            clients[key] = client;
                channels[key][channelName] = channel;
                setupPeers(channel, key, client);
                logger.info('channel=%s',channel);
            }
        }
    }
}


function setupPeers(channel, org, client) {
	for (let key in ORGS.peer[org]) {
		if (key.indexOf('peer') === 0) {
			logger.info('key=%s',key);
            let peer;
            let data = fs.readFileSync(path.join(__dirname, ORGS.peer[org][key]['tls_cacerts']));
			if(config.enableTls){
                peer = client.newPeer(
                    ORGS.peer[org][key].requests,
                    {
                        pem: Buffer.from(data).toString(),
                        'ssl-target-name-override': ORGS.peer[org][key]['server-hostname']
                    }
                );
			}else{
				peer = client.newPeer(
					ORGS.peer[org][key].requests
				);
			}
            peerTargets.push(peer);
			channel.addPeer(peer);
            
            let ehObj = {};
            // let data = fs.readFileSync(path.join(__dirname, ORGS.peer[orgName][key]['tls_cacerts']));
            ehObj.peerAddr = {};
            ehObj.peerAddr.eventUrl = ORGS.peer[org][key].events;
            ehObj.peerAddr.opts = {
                        pem: Buffer.from(data).toString(),
                        'ssl-target-name-override': ORGS.peer[org][key]['server-hostname']
                    };
            logger.info('ehObj=%s',JSON.stringify(ehObj));
            eventHubs.push(ehObj);
            logger.info('eventHubs=%s',eventHubs);
		}
	}
}


var getClientForOrg = function(org) {
	return clients[org];
};

var getChannelForOrg = function(org, channelName) {
    if (isEmpty(channelName) ) {
        
    }
    return channels[org][channelName];
};

function isEmpty(obj) {
	if(obj == undefined || obj == null || obj == '') {
		return true;
	}
	return false;
}
exports.logger = function(name){
  var logger = log4js.getLogger(name);
  return logger;
}
module.exports.getChannelForOrg = getChannelForOrg;
module.exports.getClientForOrg = getClientForOrg;