'use strict'

const test = require('ava')

const run = require('./helpers')

test('shows up an appropriate warning on supplying an unknown command', t => {
  const { stderr } = run(['init'], { reject: false })
  t.true(stderr.includes(`error: unknown command 'init'.`))
})
