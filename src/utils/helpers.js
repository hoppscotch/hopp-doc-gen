'use strict'

const bannerInfo = require('node-banner')
const kleur = require('kleur')

const showBanner = () =>
  bannerInfo('Hopp Doc Gen', 'An API Doc Generator CLI', 'green', 'white')

const logError = msg => {
  console.error(kleur.red(msg))
  process.exit(1)
}

const logInfo = msg => {
  console.info(kleur.cyan(msg))
}

module.exports = {
  logError,
  logInfo,
  showBanner
}
