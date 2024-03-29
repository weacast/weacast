#!/bin/bash

# Build docker with version number only on release
if [[ -z "$TRAVIS_TAG" ]]
then
	export VERSION=latest
else
	export VERSION=$(node -p -e "require('./packages/api/package.json').version")
fi
