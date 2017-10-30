#!/usr/bin/env node

const commander = require('commander')
const pkg = require('../package.json')

commander.version(pkg.version)

commander
  .command('dev', 'Start the development server', { isDefault: true })
  .command('start', 'Start the production server')

commander.parse(process.argv)
