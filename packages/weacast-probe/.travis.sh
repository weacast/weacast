#!/bin/bash
npm install -g codeclimate-test-reporter

git clone https://github.com/weacast/weacast-core.git
cd weacast-core
yarn install
yarn link
cd ..
yarn link weacast-core

git clone https://github.com/weacast/weacast-arpege.git
cd weacast-arpege
yarn install
yarn link
yarn link weacast-core
cd ..
yarn link weacast-arpege
