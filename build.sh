#!/bin/bash

#show commands
set -x

#require uglify js: [sudo]npm install uglify-js
node src/minifier js/jquery.bootstrap.js js/jquery.bootstrap.min.tmp.js
cat src/copyright.js js/jquery.bootstrap.min.tmp.js > js/jquery.bootstrap.min.js
rm js/jquery.bootstrap.min.tmp.js
