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
    logError(` package.json was not found in ${process.cwd()}!`)
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
   * Template for the docs/README.md for the json parser
   */
  const tp = {
    /**
     * Check if a json value is empty
     * @param { JSON } ct The hdg spec-collection.json value
     */
    isEmpty: ct => ct.length === 0 || Object.keys(ct).length === 0,
    /**
     * Return a prettier string for json values
     * @param { String } key The hdg spec-collection.json key
     * @param { String } ct The hdg spec-collection.json value
     */
    prettyJson: (key, ct) => {
      return (
        ` - ${key}:` + '\n```json\n' + JSON.stringify(ct, null, 2) + '\n```'
      )
    },
    /**
     * Return a prettier string for javascript values
     * @param { String } key The hdg spec-collection.json key
     * @param { String } ct The hdg spec-collection.json value
     */
    prettyJs: (key, ct) => ` - ${key}:` + '\n```javascript\n' + ct + '\n```',
    url: (key, ct) => ` - ${key}: ${ct}`,
    path: (key, ct) => ` - ${key}: ${ct}`,
    method: (key, ct) => ` - ${key}: ${ct}`,
    auth: (key, ct) => (ct === 'None' ? '' : ` - ${key}: ${ct}`),
    httpUser: (key, ct) => ` - ${key}: ${ct}`,
    httpPassword: (key, ct) => ` - ${key}: ${ct}`,
    passwordFieldType: (key, ct) => ` - ${key}: ${ct}`,
    bearerToken: (key, ct) => ` - ${key}: ${ct}`,
    contentType: (key, ct) => ` - ${key}: ${ct}`,
    requestType: (key, ct) => ` - ${key}: ${ct}`,
    rawParams: (key, ct) => {
      const parsed = JSON.parse(ct)
      return tp.isEmpty(parsed) ? '' : tp.prettyJson(key, parsed)
    },
    headers: (key, ct) => (tp.isEmpty(ct) ? '' : tp.prettyJson(key, ct)),
    params: (key, ct) => (tp.isEmpty(ct) ? '' : tp.prettyJson(key, ct)),
    bodyParams: (key, ct) => (tp.isEmpty(ct) ? '' : tp.prettyJson(key, ct)),
    preRequestScript: (key, ct) => tp.prettyJs(key, ct),
    testScript: (key, ct) => tp.prettyJs(key, ct)
  }

  data.forEach(item => {
    idx++
    apiDoc[idx] = `## ${item.name}`
    item.requests.forEach(request => {
      idx++
      apiDoc[idx] = `### ${request.name}`
      Object.keys(request)
        .filter(key => tp[key] && request[key])
        .forEach(key => {
          try {
            idx++
            apiDoc[idx] = tp[key](key, request[key])
          } catch (err) {
            logError(
              `\n Check key: ${key}. Make sure that postwoman-collection.json schema is correct`
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
