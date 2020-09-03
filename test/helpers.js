const execa = require('execa')
const path = require('path')

const CLI_PATH = path.join(__dirname, '..', 'index.js')

/**
 * Execute shell commands
 * @param {String[]} args args to be supplied
 * @param {Object} options execa options
 * @returns {Object}
 */
const run = (args, options = {}) => execa.sync(CLI_PATH, args, options)

module.exports = run
