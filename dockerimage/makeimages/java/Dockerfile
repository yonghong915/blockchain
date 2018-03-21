#Alpine Linux with a glibc-2.21 and Oracle Java 7
FROM jeanblanchard/alpine-glibc
 
#MAINTAINER Fox Chan
 
#install java
ADD jdk.tar.gz /opt/java/
 
# Set environment
ENV JAVA_HOME /opt/java/jdk
ENV PATH ${PATH}:${JAVA_HOME}/bin
