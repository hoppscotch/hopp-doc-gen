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

test.before('delete temp directory', () => {
  if (fs.existsSync(genPath)) {
    fs.rmdirSync(genPath, { recursive: true })
  }
})

test.beforeEach('create temp directory before each test', () => {
  fs.mkdirSync(genPath)
})

test.afterEach('cleanup after each test', () => {
  fs.rmdirSync(genPath, { recursive: true })
})

test.serial(
  'shows an appropriate warning on supplying an invalid config file path',
  t => {
    const { stderr } = run(
      ['generate', path.join(genPath, 'hoppscotch-collection.json')],
      { cwd: genPath, reject: false }
    )
    t.true(stderr.includes('Make sure that hoppscotch-collection.json exist'))
  }
)

test.serial('generates API Doc', t => {
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

test.serial(
  'shows an appropriate warning if the docs directory already exist',
  t => {
    // Create a non-empty docs directory
    fs.mkdirSync(path.join(genPath, 'docs', '.git'), { recursive: true })

    const { stdout } = run(['generate', configFilePath], {
      cwd: genPath
    })
    t.true(stdout.includes('A non-empty docs directory already exist'))
  }
)

test.serial('generates API Doc in the specified output path', t => {
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
  const pkgJsonPath = path.join(genPath, 'package.json')
  const pkgJson = JSON.parse(fs.readFileSync(pkgJsonPath))
  t.truthy(pkgJson.scripts['docs:build'])
  t.true(pkgJson.scripts['docs:build'] === `vuepress build output-path-test`)
  t.truthy(pkgJson.scripts['docs:dev'])
  t.true(pkgJson.scripts['docs:dev'] === `vuepress dev output-path-test`)
})

test.serial(
  'skips vuepress installation on supplying the --skip-install flag',
  t => {
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
    const pkgJsonPath = path.join(genPath, 'package.json')
    const pkgJson = JSON.parse(fs.readFileSync(pkgJsonPath))
    t.falsy(pkgJson.scripts['docs:build'])
    t.falsy(pkgJson.scripts['docs:dev'])

    // vuepress isn't installed
    t.false(fs.existsSync(path.join(docsDirPath, 'node_modules')))
  }
)

test.serial(
  'creates request buttons on supplying the --request-buttons flag',
  t => {
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
  }
)

test.serial(
  'shows an appropriate warning if the current directory is not empty',
  t => {
    // Create a non-empty docs directory
    fs.mkdirSync(path.join(genPath, 'docs', '.git'), { recursive: true })

    const { stdout } = run(['generate', configFilePath, '--output-path', '.'], {
      cwd: path.join(genPath, 'docs')
    })
    t.true(stdout.includes('The current directory is not empty'))
  }
)
