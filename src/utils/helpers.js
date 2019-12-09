'use strict'

// root command
const scriptName = 'cli'

const showHelpInformation = () => {
  // Help text
  const helpInformation = ` Usage: $ ${scriptName} [options]

        Options
        -h | --help: Shows up help information
        -V | --version: Shows up verison information
    `
  console.log()
  console.log(helpInformation)
}

const usageInfo = () => {
  console.log(` See ${scriptName} --help for the list of available options.`)
}

const showInvalidArgsInformation = () => {
  console.log(' Invalid arguments provided')
  console.log()
  usageInfo()
}

const showVersionInformation = () => {
  const { version } = require('../../package.json')
  console.log(' ' + version)
}

const showUnknownOptionInformation = arg => {
  console.log(` Unknown option ${arg}`)
  console.log()
  usageInfo()
}

module.exports = {
  showHelpInformation,
  showInvalidArgsInformation,
  showVersionInformation,
  showUnknownOptionInformation
}
