'use strict'

const bannerInfo = require('node-banner')
const kleur = require('kleur')

// root command
const scriptName = 'postwoman-cli'

const showBanner = async () => {
  await bannerInfo(
    'Postwoman CLI',
    'A CLI solution for Postwoman',
    'green',
    'white'
  )
  console.log('')
}

const showHelpInformation = async () => {
  // Help text
  const helpInformation = ` Usage: $ ${scriptName} <command> [options]

        Commands
        generate [path]: Generates API Documentation

        Options
        -h | --help: Shows up help information
        -V | --version: Shows up verison information
    `
  console.log()
  await showBanner()
  console.log()
  console.log(helpInformation)
}

const usageInfo = async () => {
  await showBanner()
  console.log()
  console.log(` See ${scriptName} --help for the list for more information.`)
}

const showVersionInformation = async () => {
  const { version } = require('../../package.json')
  await showBanner()
  console.log()
  console.log(' ' + version)
}

const showUnknownOptionInformation = async arg => {
  await showBanner()
  console.log()
  console.log(` Unknown option ${arg}`)
  console.log()
  usageInfo()
}

const logError = (msg) => {
  console.error(kleur.red(msg))
  process.exit(1)
};

module.exports = {
  showHelpInformation,
  showVersionInformation,
  showUnknownOptionInformation,
  logError
}
