#!/bin/bash

mkdir -p ./build
mkdir -p ./build/client
mkdir -p ./build/client/css
mkdir -p ./build/client/js
mkdir -p ./build/server

# Static files
(./node_modules/onchange/cli.js ./package.json -v -- cp package.json ./build) &
(./node_modules/onchange/cli.js './static/**/*' -v -- cp -r ./static/* ./build/client) &

# CSS
(./node_modules/onchange/cli.js './client/css/**/*.css' -v -- ./scripts/build-css.sh) &

# Vendor JS
(./node_modules/onchange/cli.js './client/vendor/**/*.js' -v -- ./scripts/build-vendor-js.sh) &

# Server JS
(./node_modules/onchange/cli.js './server/**/*.js' -v -- ./scripts/build-server.sh) &

# Client JS
node_modules/watchify/bin/cmd.js ./client/main.js -v -t [ babelify --optional runtime] -o ./build/client/js/main.js
