#!/bin/sh

( cd ..; yarn build; yarn bify )

./scripts/getCodeForDocs.js

node scripts/injectCodeIntoMarkdown.js --write
