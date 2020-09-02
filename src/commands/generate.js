const execa = require('execa')
const { existsSync, mkdirSync, readFileSync, writeFileSync } = require('fs')
const ora = require('ora')
const { resolve } = require('path')

const { logError, logInfo, showBanner } = require('../utils/helpers')

const generateAPIDoc = async filePath => {
  await showBanner()

  const absFilePath = resolve(filePath)

  if (!existsSync(absFilePath)) {
    logError(
      ` Make sure that hoppscotch-collection.json exists in ${process.cwd()}`
    )
  }

  const pkgJsonPath = resolve('package.json')
  if (!existsSync(pkgJsonPath)) {
    // Create package.json if it doesn't exist
    execa.sync('npm', ['init', '-y'])
  }

  const pkg = require(pkgJsonPath)

  const docsDirPath = resolve('docs')
  if (existsSync(docsDirPath)) {
    logError(` docs directory already exists in ${process.cwd()}`)
  }

  const data = JSON.parse(readFileSync(absFilePath))

  const spinner = ora('Installing dependencies').start()
  try {
    await execa('npm', ['install', '--save-dev', 'vuepress'])
  } catch (err) {
    spinner.fail('something went wrong')
    throw err
  }
  spinner.stop()

  pkg.scripts['docs:build'] = 'vuepress build docs'
  pkg.scripts['docs:dev'] = 'vuepress dev docs'

  writeFileSync(pkgJsonPath, JSON.stringify(pkg, null, 2))

  mkdirSync(docsDirPath)

  const readmePath = resolve('docs', 'README.md')
  writeFileSync(readmePath, '# API Documentation')

  const apiDoc = readFileSync(readmePath)
    .toString()
    .split('\n')

  let idx = 1

  /**
   * Helper methods to apply proper syntax highlighting
   */
  const utils = {
    /**
     * Check if an entry is empty
     * @param {Object} content The respective content
     * @return {Boolean}
     */
    isEmpty: content =>
      content.length === 0 || Object.keys(content).length === 0,
    /**
     * Adds syntax highlighting to JSON codeblock
     * @param {String} key The hoppscotch-collection.json key
     * @param {String} content The codeblock
     * @returns {String}
     */
    prettifyJSON: (key, content) => {
      return (
        ` - ${key}:` +
        '\n```json\n' +
        JSON.stringify(content, null, 2) +
        '\n```'
      )
    },
    /**
     * Adds syntax highlighting to JS codeblock
     * @param {String} key The hoppscotch-collection.json key
     * @param {String} content The codeblock
     * @returns {String}
     */
    prettifyJs: (key, content) =>
      ` - ${key}:` + '\n```javascript\n' + content + '\n```',
    /**
     * Adds syntax highlighting to JSON codeblock
     * @param {String} key The hoppscotch-collection.json key
     * @param {String} content The codeblock
     * @returns {String}
     */
    prettifyJSONWithCheck: (key, content) =>
      utils.isEmpty(content) ? '' : utils.prettifyJSON(key, content),
    /**
     * Adds syntax highlighting to raw-params
     * @param {String} key The hoppscotch-collection.json key
     * @param {String} content The codeblock
     * @returns {String}
     */
    rawParams: (key, content) => {
      const parsed = JSON.parse(content)
      return utils.isEmpty(parsed) ? '' : utils.prettifyJSON(key, parsed)
    },
    /**
     * Format text content
     * @param {String} key The hoppscotch-collection.json key
     * @param {String} content The content
     * @returns {String}
     */
    formatKey: (key, content) => ` - ${key}: ${content}`,
    auth: (key, content) =>
      content === 'None' ? '' : utils.formatKey(key, content),
    headers: (key, content) => utils.prettifyJSONWithCheck(key, content),
    params: (key, content) => utils.prettifyJSONWithCheck(key, content),
    bodyParams: (key, content) => utils.prettifyJSONWithCheck(key, content),
    preRequestScript: (key, content) => utils.prettifyJs(key, content),
    testScript: (key, content) => utils.prettifyJs(key, content)
  }

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

  // keys with text content
  const textualKeys = validKeys.slice(0, 9)

  data.forEach(collection => {
    idx++
    apiDoc[idx] = `## ${collection.name}`
    collection.requests.forEach(request => {
      idx++
      apiDoc[idx] = `### ${request.name}`
      Object.keys(request)
        .filter(key => request[key] && validKeys.includes(key)) // Filter out valid keys
        .forEach(key => {
          try {
            idx++
            console.log(textualKeys.includes(key) + key)
            apiDoc[idx] = textualKeys.includes(key)
              ? utils.formatKey(key, request[key])
              : utils[key](key, request[key]) // Invoke the corresponding helper
          } catch (err) {
            logError(
              `\n Check key: ${key}. Make sure that hoppscotch-collection.json schema is valid`
            )
          }
        })
      idx++
      apiDoc[idx] = '---'
    })
    idx++
    apiDoc[idx] = ''
    idx++
    apiDoc[idx] = '<br/>'
    idx++
    apiDoc[idx] = ''
  })

  writeFileSync(readmePath, apiDoc.join('\n'))

  logInfo('\n All set. Please run npm run docs:dev')
}

module.exports = generateAPIDoc
