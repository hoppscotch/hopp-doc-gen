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
  .option(
    '-o, --output-path <type>',
    'the documentation markdown file output path',
    'docs'
  )
  .action((path, { install, outputPath }) =>
    generateAPIDoc(path, { install, outputPath })
  )

program.parse(process.argv)

if (program.rawArgs.length < 3) {
  program.outputHelp()
  process.exit(1)
}
