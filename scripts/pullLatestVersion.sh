#!/usr/bin/env bash

echo "Pulling latest source"

rm -rf .tmp
mkdir .tmp
cd .tmp
echo '{"name": "tmp", "version": "1.0.0", "description": "", "main": "index.js", "scripts": {"test": "echo \"Error: no test specified\" && exit 1"}, "author": "", "license": "ISC"}' >> package.json
npm --quiet --no-progress i gatsby-source-drupal
cp -r node_modules/gatsby-source-drupal/ ../
cd ../
rm -rf .tmp
