#
FROM ump/alpine-jdk
 
#MAINTAINER Fox Chan
 
#
#RUN mkdir -p /opt
 
#install tomcat
ADD tomcat.tar.gz /opt
 
# Set environment
ENV TOMCAT_HOME /opt/tomcat
ENV PATH ${PATH}:${TOMCAT_HOME}/bin
ENTRYPOINT ["/opt/tomcat/bin/catalina.sh", "run"]
