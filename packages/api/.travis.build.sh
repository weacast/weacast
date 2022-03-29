#!/bin/bash
source .travis.env.sh

# Build docker with version number only on release
if [[ -z "$TRAVIS_TAG" ]]
then
	docker build -f dockerfile.dev -t weacast/weacast-api:dev .
	docker login -u="$DOCKER_USER" -p="$DOCKER_PASSWORD"
	docker push weacast/weacast-api:dev
else
	docker build -f dockerfile -t weacast/weacast-api .
	docker login -u="$DOCKER_USER" -p="$DOCKER_PASSWORD"
	docker push weacast/weacast-api
	docker tag weacast/weacast-api weacast/weacast-api:$VERSION
	docker push weacast/weacast-api:$VERSION
fi



