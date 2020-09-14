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
    '-s, --skip-install',
    'skip installation of vuepress and just create the markdown file'
  )
  .option('-o, --output-path <path>', 'specify an output path', 'docs')
  .option('-r, --request-buttons', 'add a request button for each GET request')
  .action(generateAPIDoc)

program.parse(process.argv)
