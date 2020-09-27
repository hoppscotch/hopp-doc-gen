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

// temporary directory path
const genPath = path.join(__dirname, 'generate-cmd')
const defaultTestPath = path.join(genPath, 'default')
const outputTestPath = path.join(genPath, 'output-path-flag')
const skipInstallTestPath = path.join(genPath, 'skip-install-flag')
const requestButtonsPath = path.join(genPath, 'request-button-flag')

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
  // Create default directory
  fs.mkdirSync(defaultTestPath)

  // Run shell command
  run(['generate', configFilePath], { cwd: defaultTestPath })

  // A docs directory is created
  const docsDirPath = path.join(defaultTestPath, 'docs')
  t.true(fs.existsSync(docsDirPath))

  // README.md content
  const readmeContent = fs.readFileSync(path.join(docsDirPath, 'README.md'))
  t.snapshot(readmeContent)

  // Assert for new npm run scripts
  const pkgJsonPath = path.join(defaultTestPath, 'package.json')
  const pkgJson = JSON.parse(fs.readFileSync(pkgJsonPath))
  t.truthy(pkgJson.scripts['docs:build'])
  t.true(pkgJson.scripts['docs:build'] === 'vuepress build docs')
  t.truthy(pkgJson.scripts['docs:dev'])
  t.true(pkgJson.scripts['docs:dev'] === 'vuepress dev docs')
})

test('shows an appropriate warning if docs directory already exist in path', t => {
  const { stdout } = run(['generate', configFilePath], {
    cwd: defaultTestPath
  })
  t.true(stdout.includes('A docs directory already exist'))
})

test('generates API Doc in the specified output path', t => {
  // Create output-path-flag directory
  fs.mkdirSync(outputTestPath)

  // Run shell command
  run(['generate', configFilePath, '--output-path', 'api-doc'], {
    cwd: outputTestPath
  })

  // An api-doc directory is created
  const docsDirPath = path.join(outputTestPath, 'api-doc')
  t.true(fs.existsSync(docsDirPath))

  // README.md content
  const readmeContent = fs.readFileSync(path.join(docsDirPath, 'README.md'))
  t.snapshot(readmeContent)

  // Assert for new npm run scripts
  const pkgJsonPath = path.join(outputTestPath, 'package.json')
  const pkgJson = JSON.parse(fs.readFileSync(pkgJsonPath))
  t.truthy(pkgJson.scripts['docs:build'])
  t.true(pkgJson.scripts['docs:build'] === 'vuepress build docs')
  t.truthy(pkgJson.scripts['docs:dev'])
  t.true(pkgJson.scripts['docs:dev'] === 'vuepress dev docs')
})

test('skips vuepress installation if --skip-install flag was supplied', t => {
  // Create skip-install-flag directory
  fs.mkdirSync(skipInstallTestPath)

  // Run shell command
  run(['generate', configFilePath, '--skip-install', '-o', 'api-doc-test'], {
    cwd: skipInstallTestPath
  })

  // An api-doc-test directory is created
  const docsDirPath = path.join(skipInstallTestPath, 'api-doc-test')
  t.true(fs.existsSync(docsDirPath))

  // It shouldn't create new npm run scripts
  const pkgJsonPath = path.join(skipInstallTestPath, 'package.json')
  const pkgJson = JSON.parse(fs.readFileSync(pkgJsonPath))
  t.falsy(pkgJson.scripts['docs:build'])
  t.falsy(pkgJson.scripts['docs:dev'])

  // vuepress isn't installed
  t.false(fs.existsSync(path.join(docsDirPath, 'node_modules')))
})

test('check if request buttons was created if --request-buttons flag was supplied', t => {
  fs.mkdirSync(requestButtonsPath)

  run(['generate', configFilePath, , '--request-buttons', '--skip-install'], {
    cwd: requestButtonsPath
  })

  const readmeContent = fs.readFileSync(
    path.join(requestButtonsPath, 'docs/README.md')
  )

  // snapshot assertion
  t.snapshot(readmeContent)

  // vue component exists in the vuepress components path
  t.true(
    fs.existsSync(
      path.join(
        requestButtonsPath,
        '/docs/.vuepress/components/HoppRequest.vue'
      )
    )
  )
})
