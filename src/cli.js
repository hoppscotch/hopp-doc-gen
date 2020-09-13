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
  .action(generateAPIDoc)

program.parse(process.argv)
