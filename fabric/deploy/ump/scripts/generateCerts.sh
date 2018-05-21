#!/bin/bash
#
#Copyright fangyh All Rights Reserved
#
#


CHANNEL_NAME=$1
: ${CHANNEL_NAME:="mychannel"}

echo $CHANNEL_NAME
export PRO_ROOT_PATH=$PWD
export CRYPTO_CFG_PATH=$PRO_ROOT_PATH/config
###FABRIC_CFG_PATH-configtx.yaml folder####
export FABRIC_CFG_PATH=$PRO_ROOT_PATH/config
DOCKER_COMPOSE_FILE_TEMPLATE=$PRO_ROOT_PATH/config/docker-compose-kafka-template.yaml
DOCKER_COMPOSE_FILE=$PRO_ROOT_PATH/docker-compose-kafka.yaml

## Generates Org certs using cryptogen tool
function generateCerts (){
	CRYPTOGEN=${PRO_ROOT_PATH}/build/bin/cryptogen

	if [ -f "$CRYPTOGEN" ]; then
            echo "Using cryptogen -> $CRYPTOGEN"
	else
	    # echo "Building cryptogen"
	    # make -C $FABRIC_ROOT release
	    echo "cryptogen tool not found.exiting..."
	    exit 1
	fi

	echo
	echo "##########################################################"
	echo "##### Generate certificates using cryptogen tool #########"
	echo "##########################################################"

    if [ -d "crypto-config" ];then
        rm -Rf crypto-config
    fi
    
    set -x
	$CRYPTOGEN generate --config=$CRYPTO_CFG_PATH/crypto-config.yaml --output $CRYPTO_CFG_PATH/crypto-config
	res=$?
	set +x
	if [ $res -ne 0 ]; then
        echo "Failed to generate certificates..."
        exit 1
    fi
	echo
}

## Generate orderer genesis block , channel configuration transaction and anchor peer update transactions
function generateChannelArtifacts() {
	#create channel dirPath
    #createChanlPath

	CONFIGTXGEN=${PRO_ROOT_PATH}/build/bin/configtxgen
	if [ -f "$CONFIGTXGEN" ]; then
        echo "Using configtxgen -> $CONFIGTXGEN"
	else
	   //echo "Building configtxgen"
	    //make -C $FABRIC_ROOT release
	    echo "configtxgen not found.exiting..."
	fi

	echo "##########################################################"
	echo "#########  Generating Orderer Genesis block ##############"
	echo "##########################################################"
	# Note: For some unknown reason (at least for now) the block file can't be
	# named orderer.genesis.block or the orderer will fail to launch!
	set -x
	$CONFIGTXGEN -profile MultiOrgsOrdererGenesis -outputBlock $CRYPTO_CFG_PATH/channel/channel-artifacts/orderer.genesis.block
    res=$?
    set +x
    if [ $res -ne 0 ]; then
        echo "Failed to generate orderer genesis block..."
        exit 1
    fi
	echo
	echo "#################################################################"
	echo "### Generating channel configuration transaction 'channel.tx' ###"
	echo "#################################################################"
	set +x
	$CONFIGTXGEN -profile MultiOrgsChannel -outputCreateChannelTx $CRYPTO_CFG_PATH/channel/channel-artifacts/channel.tx -channelID $CHANNEL_NAME
    res=$?
    set +x
    if [ $res -ne 0 ]; then
        echo "Failed to generate channel configuration transaction..."
        exit 1
    fi
	echo
	echo "#################################################################"
	echo "#######    Generating anchor peer update for Org1MSP   ##########"
	echo "#################################################################"
	set +x
	$CONFIGTXGEN -profile MultiOrgsChannel -outputAnchorPeersUpdate $CRYPTO_CFG_PATH/channel/channel-artifacts/Org1MSPanchors.tx -channelID $CHANNEL_NAME -asOrg Org1MSP
    set +x
    if [ $res -ne 0 ]; then
        echo "Failed to generate anchor peer update for Org1MSP..."
        exit 1
    fi
	echo
	echo "#################################################################"
	echo "#######    Generating anchor peer update for Org2MSP   ##########"
	echo "#################################################################"
	set +x
	$CONFIGTXGEN -profile MultiOrgsChannel -outputAnchorPeersUpdate $CRYPTO_CFG_PATH/channel/channel-artifacts/Org2MSPanchors.tx -channelID $CHANNEL_NAME -asOrg Org2MSP
	set +x
    if [ $res -ne 0 ]; then
        echo "Failed to generate anchor peer update for Org2MSP..."
        exit 1
    fi
	echo
}


## Using docker-compose template replace private key file names with constants
function replacePrivateKey () {
	echo 
	echo "##########################################################"
	echo "replace private key docker-compose file"
	echo "##########################################################"
	OPTS="-i"
	
	cp $DOCKER_COMPOSE_FILE_TEMPLATE $DOCKER_COMPOSE_FILE

    CURRENT_DIR=$PWD
    cd $CRYPTO_CFG_PATH/crypto-config/peerOrganizations/org1.fyh.com/ca/
    PRIV_KEY=$(ls *_sk)
    cd $CURRENT_DIR
    sed $OPTS "s/CA1_PRIVATE_KEY/${PRIV_KEY}/g" $DOCKER_COMPOSE_FILE
    cd $CRYPTO_CFG_PATH/crypto-config/peerOrganizations/org2.fyh.com/ca/
    PRIV_KEY=$(ls *_sk)
    cd $CURRENT_DIR
    sed $OPTS "s/CA2_PRIVATE_KEY/${PRIV_KEY}/g" $DOCKER_COMPOSE_FILE
}

generateCerts
replacePrivateKey
generateChannelArtifacts