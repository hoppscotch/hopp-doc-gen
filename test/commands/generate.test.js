const execa = require('execa')
const fs = require('fs')
const path = require('path')
const test = require('ava')

const run = require('../helpers')

const configFilePath = path.join(
  __dirname,
  '..',
  'fixtures',
  'hoppscotch-collection.json'
)
const genPath = path.join(__dirname, 'generate-cmd')

test.before('create temp directory', () => {
  fs.mkdirSync(genPath)
})

test.after('cleanup', () => {
  fs.rmdirSync(genPath, { recursive: true })
})

test('generates API Doc', t => {
  run(['generate', configFilePath], { cwd: genPath })
  const readmeContent = fs.readFileSync(path.join(genPath, 'docs', 'README.md'))
  t.snapshot(readmeContent)
})
