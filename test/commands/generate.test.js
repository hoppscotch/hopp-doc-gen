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

test('shows an appropriate warning if an invalid config file path is provided', t => {
  const { stderr } = run(
    ['generate', path.join(genPath, 'hoppscotch-collection.json')],
    { cwd: genPath, reject: false }
  )
  t.true(stderr.includes('Make sure that hoppscotch-collection.json exist'))
})

test('generates API Doc', t => {
  const pkgJsonPath = path.join(genPath, 'package.json')

  // Snapshot testing
  run(['generate', configFilePath], { cwd: genPath })
  const readmeContent = fs.readFileSync(path.join(genPath, 'docs', 'README.md'))
  t.snapshot(readmeContent)

  // Assert for new npm run scripts
  const pkgJson = JSON.parse(fs.readFileSync(pkgJsonPath))
  t.truthy(pkgJson.scripts['docs:build'])
  t.true(pkgJson.scripts['docs:build'] === 'vuepress build docs')
  t.truthy(pkgJson.scripts['docs:dev'] === 'vuepress dev docs')
  t.true(pkgJson.scripts['docs:dev'] === 'vuepress dev docs')
})

test('shows an appropriate warning if docs directory already exist in path', t => {
  const { stderr } = run(['generate', configFilePath], {
    cwd: genPath,
    reject: false
  })
  t.true(stderr.includes('docs directory already exist'))
})
