'use strict'

const bannerInfo = require('node-banner')
const kleur = require('kleur')

const showBanner = async () => {
  await bannerInfo(
    'Postwoman CLI',
    'A CLI solution for Postwoman',
    'green',
    'white'
  )
  console.log('')
}

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
