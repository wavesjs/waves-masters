#!/bin/bash

echo "> project name (lowercase):"
read projectName

echo "cloning boilerplate into $projectName"
git clone git@github.com:ircam-jstools/es-next-prototyping-client.git "$projectName"

cd "$projectName"

echo "> deleting .git project"
rm -Rf .git
rm README.md

echo "> install"
npm install
npm install --save @ircam/basic-controllers

rm package-lock.json

echo "> link waves-masters"
npm link waves-masters

echo "> copy assets"
cp ../assets/common.css ./css/common.css

mkdir js
cp ../assets/insert-code.js ./js/insert-code.js
cp ../assets/prism.js ./js/prism.js
cp ../assets/prism.css ./css/prism.css
