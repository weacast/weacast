#!/bin/bash
if [[ $TRAVIS_COMMIT_MESSAGE == *"[skip test]"* ]] || [[ -n "$TRAVIS_TAG" ]]
then
	echo "Skipping test stage"
else
	source .travis.env.sh

	# We don't run tests now otherwise Travis build is too much long, we prefer to keep time for the Docker build
	# We should actually run the test through the docker image
	#git clone https://github.com/weacast/weacast-core.git -b master --single-branch && cd weacast-core && yarn install && yarn link && cd ..
	#git clone https://github.com/weacast/weacast-probe.git -b master --single-branch && cd weacast-probe && yarn install && yarn link weacast-core && yarn link && cd ..
	#git clone https://github.com/weacast/weacast-alert.git -b master --single-branch && cd weacast-alert && yarn install && yarn link weacast-core && yarn link weacast-probe && yarn link && cd ..
	#git clone https://github.com/weacast/weacast-arpege.git -b master --single-branch && cd weacast-arpege && yarn install && yarn link weacast-core && yarn link && cd ..
	#git clone https://github.com/weacast/weacast-arome.git -b master --single-branch && cd weacast-arome && yarn install && yarn link weacast-arpege && yarn link weacast-core && yarn link && cd ..
	#git clone https://github.com/weacast/weacast-gfs.git -b master --single-branch && cd weacast-gfs && yarn install && yarn link weacast-core && yarn link && cd ..
	
	#yarn install
	#yarn link weacast-core
	#yarn link weacast-probe
	#yarn link weacast-alert
	#yarn link weacast-arpege
	#yarn link weacast-arome
	#yarn link weacast-gfs
	npm run compile
fi