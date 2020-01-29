#! /usr/bin/env node

'use strict'

const program = require('commander')

const { description, version } = require('../package')
const generateAPIDoc = require('./commands/generate')

program.description(description).version(version).usage('<command> [options]')

if (!program._args.length) {
  program.outputHelp()
  process.exit(1)
}
