#!/bin/bash

node index.js
npx mjml --config.validationLevel=strict -r ./templates/default.mjml -o testlol.html
