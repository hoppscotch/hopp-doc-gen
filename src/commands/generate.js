const execa = require('execa')
const { existsSync, readFileSync, writeFileSync } = require('fs')
const ora = require('ora')

const { logError, logInfo, showBanner } = require('../utils/helpers')

const generateAPIDoc = async path => {
  await showBanner()

  if (!existsSync(path)) {
    logError(
      '\n Make sure that postwoman-collection.json exists within the given path'
    )
  }

  if (!existsSync('package.json')) {
    logError('\n package.json not found!')
  }

  if (existsSync('doc')) {
    logError(
      '\n There is already a doc directory present within the current path'
    )
  }

  const pkg = require(`${process.cwd()}/package.json`)

  if (existsSync('docs')) {
    logError('docs directory already exists within the current path')
  }

  const data = JSON.parse(readFileSync(path))

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

  writeFileSync('package.json', JSON.stringify(pkg, null, 2))

  execa.commandSync('mkdir docs')

  writeFileSync('docs/README.md', '# API Documentation')

  const apiDoc = readFileSync('docs/README.md')
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

  writeFileSync('docs/README.md', apiDoc.join('\n'))

  logInfo('\n All set. Please run npm run docs:dev from the root directory')
}

module.exports = generateAPIDoc
