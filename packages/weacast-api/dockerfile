FROM  node:8-stretch

MAINTAINER Luc Claustres <luc.claustres@orange.fr>

# We need Java for the GFS plugin
RUN apt-get update -y
RUN apt install -y openjdk-8-jre-headless ca-certificates-java
RUN apt-get clean
ENV JAVA_HOME /usr/lib/jvm/java-8-openjdk-amd64
RUN $JAVA_HOME/bin/java -version

WORKDIR /opt/weacast-api
COPY . /opt/weacast-api

RUN yarn install
RUN npm run compile

EXPOSE 8081

CMD [ "npm", "run", "prod" ]
