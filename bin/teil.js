#!/usr/bin/env node

const { join } = require('path')
const zargs = require('yargs')
const server = require('../lib/server')

const getConfigFilePath = argv => {
  let configFile

  if (argv['config-file']) {
    configFile = join(process.cwd(), argv['config-file'])
  }

  return configFile
}

const app = zargs
  .usage('$0 <cmd> [args]')
  .command(['dev', '$0'], 'Start development server', yargs => {}, argv => {
    const configFile = getConfigFilePath(argv)
    server.start(configFile)
  })
  .command('start', 'Start the production server', yargs => {}, argv => {
    process.env.NODE_ENV = 'production'

    const configFile = getConfigFilePath(argv)
    server.start(configFile)
  })
  .option('config-file', { alias: 'c' })
  .help()

/* eslint-disable */
app.argv
/* eslint-enable */
