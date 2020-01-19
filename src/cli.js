#! /usr/bin/env node

'use strict'

const {
  showHelpInformation,
  showVersionInformation,
  showUnknownOptionInformation,
} = require('./utils/helpers')

const generateAPIDoc = require('./commands/generate')

// parse args
const [, , ...args] = process.argv

if (!args.length) {
  ;(async () => {
    await showHelpInformation()
  })()
} else if (['--help', '-h'].includes(args[0])) {
  showHelpInformation()
} else if (['--version', '-v'].includes(args[0])) {
  showVersionInformation()
} else if (args[0] === 'generate') {
  generateAPIDoc(args)
} else {
  showUnknownOptionInformation(args[0])
}
