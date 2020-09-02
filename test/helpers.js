const execa = require('execa')
const path = require('path')

const CLI_PATH = path.join(__dirname, '..', 'index.js')

const run = (args, options = {}) => execa.sync(CLI_PATH, args, options)

module.exports = run
