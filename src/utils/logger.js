'use strict'

const { cyan, green, red } = require('kleur')

module.exports = {
  error: msg => console.error(red(msg)),
  info: msg => console.info(cyan(msg)),
  success: msg => console.log(green(msg))
}
