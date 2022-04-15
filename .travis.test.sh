#!/bin/bash
if [[ $TRAVIS_COMMIT_MESSAGE == *"[skip test]"* ]] || [[ -n "$TRAVIS_TAG" ]]
then
	echo "Skipping test stage"
else
	source .travis.env.sh
	yarn install
	yarn test
fi