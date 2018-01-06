#!/bin/sh

( cd ../high-redux; yarn build; yarn bify )

./scripts/getCodeForDocs.js

node scripts/injectCodeIntoMarkdown.js --write

