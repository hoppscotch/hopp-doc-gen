'use strict'

const bannerInfo = require('node-banner')
const { cyan, green, red } = require('kleur')

const showBanner = () =>
  bannerInfo('Hopp Doc Gen', 'An API Doc Generator CLI', 'green', 'white')

const logError = msg => {
  console.error(red(msg))
  process.exit(1)
}

const logInfo = msg => {
  console.info(cyan(msg))
  process.exit(0)
}

const logSuccess = msg => {
  console.info(green(msg))
  process.exit(0)
}

module.exports = {
  logError,
  logInfo,
  logSuccess,
  showBanner
}
