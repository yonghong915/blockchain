#!/bin/bash
#
#Copyright fangyh All Rights Reserved
#
#
set -e
cmdname=$(basename $0)
currtime=$(date '+%Y-%m-%d %H:%M:%S,%N')
export FABRIC_CFG_PATH=${PWD}
export PATH=${PWD}/../bin:${PWD}:$PATH
echo $currtime
echo $cmdname
starttime=$(date +%s)
#Print the usage message
usage(){
   echo "Usage: "
   echo " $cmdname -m up|down|restart|generate [-p <project name>] [-c <channel name>] [-t <timeout>] [-d <delay>] [-f <docker-compose-file>] [-s <dbtype>]"
   echo "    $cmdname -h|--help (print this message)"
   echo "      -m <mode> - one of 'up', 'down', 'restart' or 'generate'"
   echo "        - 'up' - bring up the network with docker-compose up"
   echo "        - 'down' - clear the network with docker-compose down"
   echo "        - 'restart' - restart the network"
   echo "        - 'generate' - generate required certificates and genesis block"
   echo "      -p <project name> - project name for compose"
   echo "      -c <channel name> - channel name to use (defaults to \"mychannel\")"
   echo "      -t <timeout> - CLI timeout duration in microseconds (defaults to 10000)"
   echo "      -d <delay> - delay duration in seconds (defaults to 3)"
   echo "      -f <docker-compose-file> - specify which docker-compose file use (defaults to docker-compose-cli.yaml)"
   echo "      -s <dbtype> - the database backend to use: goleveldb (default) or couchdb"
   echo ""
   echo ""
   echo "eg.    bash main.sh -p ump -m up -f docker-compose-kafka.yaml"
}



CLI_TIMEOUT=10000
#default for delay
CLI_DELAY=3
# channel name defaults to "mychannel"
CHANNEL_NAME="mychannel"
# use this as the default docker-compose yaml definition
COMPOSE_FILE=docker-compose-kafka.yaml
#
COMPOSE_FILE_COUCH=docker-compose-couch.yaml

PROJECT_NAME="ump"

#Parse commandline args
while getopts "h?p:m:c:t:d:f:s:" opt; do
   case "$opt" in
    h|\?)
      usage
      exit 0
    ;;
    p)  PROJECT_NAME=$OPTARG
    ;;
	m)  MODE=$OPTARG
    ;;
    c)  CHANNEL_NAME=$OPTARG
    ;;
    t)  CLI_TIMEOUT=$OPTARG
    ;;
    d)  CLI_DELAY=$OPTARG
    ;;
    f)  COMPOSE_FILE=$OPTARG
    ;;
    s)  IF_COUCHDB=$OPTARG
    ;;
  esac
done

echo $MODE $PROJECT_NAME $CHANNEL_NAME $CLI_TIMEOUT $CLI_DELAY $COMPOSE_FILE $IF_COUCHDB


##
##
##
if [ "${MODE}" == "generate" ];then
  source ./scripts/generateCerts.sh $CHANNEL_NAME 
elif [ "${MODE}" == "start" ]; then
  source ./scripts/startContainers.sh
else
  usage
  exit 1
fi
sleep 1
printf "\nTotal execution time : $(($(date +%s) - starttime)) secs ...\n\n"
