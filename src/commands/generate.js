const execa = require('execa')
const { existsSync, readFileSync, writeFileSync } = require('fs')
const ora = require('ora')

const { logError, logInfo } = require('../utils/helpers')

const generateAPIDoc = async args => {
  if (!args[1]) {
    logError('\n Please specify the path to postwoman-collections.json')
  }

  if (!existsSync(args[1])) {
    logError(
      '\n Make sure that postwoman-collections.json exists within the given path'
    )
  }

  if (!existsSync('package.json')) {
    logError('\n package.json not found!')
  }

  if (existsSync('doc')) {
    logError('\n There is already a doc directory present within the current path')
  }

  const pkg = require(`${process.cwd()}/package.json`)

  if (existsSync('docs')) {
    logError('docs directory already exists within the current path')
  }

  const data = JSON.parse(readFileSync(args[1]))

  execa.commandSync('mkdir docs')

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

  writeFileSync('docs/README.md', '## API Documentation')

  const apiDoc = readFileSync('docs/README.md').toString().split('\n')

  let idx = 1

  data.forEach(item => {
    idx++
    apiDoc[idx] = `### Collection: ${item.name}`
    item.requests.forEach(request => {
      Object.keys(request).forEach(key => {
        if (request[key]) {
          idx++
          apiDoc[idx] = `- ${key}: ${request[key]}`
        }
      })
    })
  })

  writeFileSync('docs/README.md', apiDoc.join('\n'))

  logInfo('\n All set. Please run npm run docs:dev from the root directory')
}

module.exports = generateAPIDoc
