const enquirer = require('enquirer')
const execa = require('execa')
const fs = require('fs')
const ora = require('ora')
const path = require('path')

const logger = require('../utils/logger')
const renderUtils = require('../utils/helpers')
const showBanner = require('../utils/banner')

const generateAPIDoc = async (filePath, opts) => {
  await showBanner()

  // optional flags for generate command
  const { skipInstall, outputPath, requestButtons } = opts

  if (!fs.existsSync(filePath)) {
    logger.error(
      `\n Make sure that hoppscotch-collection.json exist in ${process.cwd()}`
    )
    process.exit(1)
  }

  const pkgJsonPath = path.resolve('package.json')
  if (!fs.existsSync(pkgJsonPath)) {
    // Create package.json if it doesn't exist
    execa.sync('npm', ['init', '-y'])
  }

  const pkgJson = require(pkgJsonPath)

  if (fs.existsSync(outputPath)) {
    const { overwritePath } = await enquirer.prompt({
      name: 'overwritePath',
      type: 'confirm',
      message: ` A ${path.basename(
        outputPath
      )} directory already exist in ${process.cwd()}, would you like to overwrite it?`
    })

    // Exit if the user doesn't wish to overwrite
    if (!overwritePath) {
      logger.info(' Run hdg generate --help to see the available options.')
      process.exit(1)
    }

    // Delete the directory
    fs.rmdirSync(outputPath, { recursive: true })
  }

  const data = JSON.parse(fs.readFileSync(filePath, 'utf8'))

  if (!skipInstall) {
    const spinner = ora('Installing vuepress').start()
    try {
      await execa('npm', ['install', '--save-dev', 'vuepress'])
    } catch (err) {
      spinner.fail('something went wrong')
      throw err
    }
    spinner.stop()

    pkgJson.scripts['docs:build'] = 'vuepress build docs'
    pkgJson.scripts['docs:dev'] = 'vuepress dev docs'

    fs.writeFileSync(pkgJsonPath, JSON.stringify(pkgJson, null, 2))
  }

  fs.mkdirSync(outputPath)

  if (requestButtons) {
    // Create a global component at .vuepress/components/HoppRequest.vue from src/templates/components/HoppRequest.vue
    const vuepressComponentsDirPath = path.join(
      outputPath,
      '.vuepress',
      'components'
    )

    try {
      fs.mkdirSync(vuepressComponentsDirPath, { recursive: true })
      fs.copyFileSync(
        path.join(
          __dirname,
          '..',
          'templates',
          'components',
          'HoppRequest.vue'
        ),
        path.join(vuepressComponentsDirPath, 'HoppRequest.vue')
      )
    } catch (e) {
      logger.error(e)
      process.exit(1)
    }
  }

  const readmePath = path.join(outputPath, 'README.md')
  fs.writeFileSync(readmePath, '# API Documentation')

  const apiDoc = fs
    .readFileSync(readmePath)
    .toString()
    .split('\n')

  let line = 1

  const validKeys = [
    'url',
    'path',
    'method',
    'httpUser',
    'httpPassword',
    'passwordFieldType',
    'bearerToken',
    'contentType',
    'requestType',
    'rawParams',
    'headers',
    'params',
    'bodyParams',
    'preRequestScript',
    'testScript'
  ]

  // Keys with text content
  const textualKeys = validKeys.slice(0, 9)

  data.forEach(collection => {
    line++
    // Render the collection Name
    apiDoc[line] = `## ${collection.name}`
    collection.requests.forEach(request => {
      line++
      // Render the request name
      apiDoc[line] = `### ${request.name}`
      Object.keys(request)
        // Filter out valid keys
        .filter(key => request[key] && validKeys.includes(key))
        .forEach(key => {
          try {
            line++
            apiDoc[line] = textualKeys.includes(key)
              ? renderUtils.formatKey(key, request[key])
              : renderUtils[key](key, request[key]) // Invoke the corresponding helper
          } catch (err) {
            logger.error(
              `\n Check key: ${key}. Make sure that hoppscotch-collection.json schema is valid`
            )
            process.exit(1)
          }
        })

      // Render HoppRequest component
      if (requestButtons && request.method === 'GET') {
        apiDoc[line] = renderUtils.requestButton(request)
        return
      }
      line++
      apiDoc[line] = '---'
    })

    // Empty line
    line++
    apiDoc[line] = ''

    // Render line break
    line++
    apiDoc[line] = '<br/>'

    // Empty line
    line++
    apiDoc[line] = ''
  })

  fs.writeFileSync(readmePath, apiDoc.join('\n'))

  const successMsg = skipInstall
    ? ` Successfully generated README.md in ${outputPath}`
    : ' All set. Please run npm run docs:dev'
  logger.success(successMsg)
}

module.exports = generateAPIDoc
