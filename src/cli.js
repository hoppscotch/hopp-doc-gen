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
  .command('generate <path>')
  .description('Generate API Documentation')
  .option(
    '-n, --no-install',
    'skip npm install and create only the markdown file'
  )
  .action((path, { install }) => generateAPIDoc(path, { install }))

program.parse(process.argv)

if (program.rawArgs.length < 3) {
  program.outputHelp()
  process.exit(1)
}
