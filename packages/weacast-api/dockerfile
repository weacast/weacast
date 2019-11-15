FROM  node:8-buster AS Build

WORKDIR /opt/weacast-api
COPY . /opt/weacast-api

RUN yarn install
RUN npm run compile

FROM  node:8-buster-slim

LABEL maintainer="Kalisio <contact@kalisio.xyz>"

COPY --from=Build /opt/weacast-api /opt/weacast-api

# Install Java
RUN apt-get update -y
# See http://debian.2.n7.nabble.com/Bug-863199-error-creating-symbolic-link-usr-share-man-man1-rmid-1-gz-dpkg-tmp-td4120571.html#a4283276
RUN mkdir -p /usr/share/man/man1
RUN apt install -y openjdk-11-jre-headless
RUN apt-get clean
ENV JAVA_HOME /usr/lib/jvm/java-11-openjdk-amd64
RUN $JAVA_HOME/bin/java -version

# Install GDAL
RUN apt-get update && apt-get -y install gdal-bin

EXPOSE 8081

CMD [ "npm", "run", "prod" ]
