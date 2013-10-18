#!/bin/bash

#show commands
set -x

#combine source files into one
cd src
cat string.format.js jquery.dialog.js > ../js/jquery.bootstrap.js
cd ..
#wait for 3 seconds
sleep 1


#require uglify js: [sudo]npm install uglify-js -g
uglifyjs js/jquery.bootstrap.js -o js/jquery.bootstrap.min.js
sleep 10