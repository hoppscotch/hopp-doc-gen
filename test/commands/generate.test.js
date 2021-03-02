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

test.before('create temp directory', () => {
  if (fs.existsSync(genPath)) {
    fs.rmdirSync(genPath, { recursive: true })
  }
  fs.mkdirSync(genPath)
})

test.after('cleanup', () => {
  fs.rmdirSync(genPath, { recursive: true })
})

test('shows an appropriate warning on supplying an invalid config file path', t => {
  const { stderr } = run(
    ['generate', path.join(genPath, 'hoppscotch-collection.json')],
    { cwd: genPath, reject: false }
  )
  t.true(stderr.includes('Make sure that hoppscotch-collection.json exist'))
})

test('generates API Doc', t => {
  // Run shell command
  run(['generate', configFilePath], { cwd: genPath })

  // A docs directory is created
  const docsDirPath = path.join(genPath, 'docs')
  t.true(fs.existsSync(docsDirPath))

  // README.md content
  const readmeContent = fs.readFileSync(path.join(docsDirPath, 'README.md'))
  t.snapshot(readmeContent)

  // Assert for new npm run scripts
  const pkgJsonPath = path.join(genPath, 'package.json')
  const pkgJson = JSON.parse(fs.readFileSync(pkgJsonPath))
  t.truthy(pkgJson.scripts['docs:build'])
  t.true(pkgJson.scripts['docs:build'] === 'vuepress build docs')
  t.truthy(pkgJson.scripts['docs:dev'])
  t.true(pkgJson.scripts['docs:dev'] === 'vuepress dev docs')
})

test('shows an appropriate warning if the docs directory already exist', t => {
  const { stdout } = run(['generate', configFilePath], {
    cwd: genPath
  })
  t.true(stdout.includes('A non-empty docs directory already exist'))
})

test('generates API Doc in the specified output path', t => {
  // Run shell command
  run(['generate', configFilePath, '--output-path', 'output-path-test'], {
    cwd: genPath
  })

  // An output-path-test directory is created
  const docsDirPath = path.join(genPath, 'output-path-test')
  t.true(fs.existsSync(docsDirPath))

  // README.md content
  const readmeContent = fs.readFileSync(path.join(docsDirPath, 'README.md'))
  t.snapshot(readmeContent)

  // Assert for new npm run scripts
  const pkgJsonPath = path.join(docsDirPath, 'package.json')
  const pkgJson = JSON.parse(fs.readFileSync(pkgJsonPath))
  t.truthy(pkgJson.scripts['docs:build'])
  t.true(pkgJson.scripts['docs:build'] === 'vuepress build docs')
  t.truthy(pkgJson.scripts['docs:dev'])
  t.true(pkgJson.scripts['docs:dev'] === 'vuepress dev docs')
})

test('skips vuepress installation on supplying the --skip-install flag', t => {
  // Run shell command
  run(
    ['generate', configFilePath, '--skip-install', '-o', 'skip-install-test'],
    {
      cwd: genPath
    }
  )

  // A skip-install-test directory is created
  const docsDirPath = path.join(genPath, 'skip-install-test')
  t.true(fs.existsSync(docsDirPath))

  // It shouldn't create new npm run scripts
  const pkgJsonPath = path.join(docsDirPath, 'package.json')
  const pkgJson = JSON.parse(fs.readFileSync(pkgJsonPath))
  t.falsy(pkgJson.scripts['docs:build'])
  t.falsy(pkgJson.scripts['docs:dev'])

  // vuepress isn't installed
  t.false(fs.existsSync(path.join(docsDirPath, 'node_modules')))
})

test('creates request buttons on supplying the --request-buttons flag', t => {
  run(
    [
      'generate',
      configFilePath,
      ,
      '--request-buttons',
      '--skip-install',
      '-o',
      'request-buttons-test'
    ],
    {
      cwd: genPath
    }
  )

  // A request-buttons-test directory is created
  const docsDirPath = path.join(genPath, 'request-buttons-test')
  t.true(fs.existsSync(docsDirPath))

  const readmeContent = fs.readFileSync(path.join(docsDirPath, 'README.md'))

  // snapshot assertion
  t.snapshot(readmeContent)

  // vue component exists in the vuepress components path
  t.true(
    fs.existsSync(
      path.join(docsDirPath, '.vuepress', 'components', 'HoppRequest.vue')
    )
  )
})

test('shows an appropriate warning if the current directory is not empty', t => {
  const { stdout } = run(['generate', configFilePath, '--output-path', '.'], {
    cwd: path.join(genPath, 'docs')
  })
  t.true(stdout.includes('The current directory is not empty'))
})
