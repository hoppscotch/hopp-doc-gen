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

  data.forEach(item => {
    idx++
    apiDoc[idx] = `## ${item.name}`
    item.requests.forEach(request => {
      idx++
      apiDoc[idx] = `### ${request.name}`
      Object.keys(request)
        .filter(key => key !== 'name')
        .forEach(key => {
          if (request[key]) {
            idx++
            apiDoc[idx] = `- ${key}: ${request[key]}`
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
