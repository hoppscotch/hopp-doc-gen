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
  .description('Generate API Documentation')
  .action(generateAPIDoc)

program.parse(process.argv)

if (program.rawArgs.length < 3) {
  program.outputHelp()
  process.exit(1)
}
