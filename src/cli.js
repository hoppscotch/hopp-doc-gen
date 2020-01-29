#! /usr/bin/env node

'use strict'

const program = require('commander')

const { description, version } = require('../package')
const generateAPIDoc = require('./commands/generate')

program
  .description(description)
  .version(version)
  .usage('<command> [options]')

program
  .command('generate')
  .action(generateAPIDoc)

program.parse(process.argv)

if (!program._args.length) {
  program.outputHelp()
  process.exit(1)
}
