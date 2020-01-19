const execa = require('execa')
const { existsSync, readFileSync, writeFileSync } = require('fs')
const ora = require('ora')

const { logError } = require('../utils/helpers')

const generateAPIDoc = async args => {
  if (!args[1]) {
    logError('Please specify the path to postwoman-collections.json')
  }

  if (!existsSync(args[1])) {
    logError(
      'Make sure that postwoman-collections.json exists within the given path'
    )
  }

  if (!existsSync('package.json')) {
    logError('package.json not found!')
  }

  if (existsSync('doc')) {
    logError('There is already a doc directory present within the current path')
  }

  const pkg = require(`${process.cwd()}/package.json`)

  if (existsSync('docs')) {
    logError('docs directory already exists within the current path')
  }

  // const data = JSON.parse(readFileSync(args[1]))

  execa.commandSync('mkdir docs')

  let spinner = ora('Installing dependencies').start()
  try {
    await execa('sudo', ['npm', 'install', '--save-dev', 'vuepress'])
  } catch (err) {
    spinner.fail('something went wrong')
    throw err
  }
  spinner.stop()

  pkg.scripts['docs:build'] = 'vuepress build docs'
  pkg.scripts['docs:dev'] = 'vuepress dev docs'

  writeFileSync('package.json', JSON.stringify(pkg, null, 2))

  writeFileSync('docs/README.md', '## API Documentation')

  spinner = ora('Starting local server').start()
  try {
    await execa('npm', ['run', 'docs:dev'])
  } catch (err) {
    spinner.fail('something went wrong')
    throw err
  }

  spinner.succeed('Available on http://localhost:8081')
}

module.exports = generateAPIDoc
