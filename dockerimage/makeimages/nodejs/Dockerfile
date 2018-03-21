#
FROM frolvlad/alpine-glibc
 
#MAINTAINER Fox Chan
 
#
#RUN mkdir -p /opt
 
#install nodejs
ADD node.tar.gz /opt
 # Install base packages and set timezone ShangHai
RUN apk update && apk add --no-cache curl make gcc bash tzdata \
    && cp -r -f /usr/share/zoneinfo/Asia/Shanghai /etc/localtime
# Set environment
ENV PATH ${PATH}:/opt/node/bin
