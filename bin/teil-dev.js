#!/usr/bin/env node

const { join } = require('path')
const commander = require('commander')
const server = require('../lib/server')

const cwd = process.cwd()
let configFilePath

commander
  .option('--config-file <path>')
  .parse(process.argv)

if (commander.configFile) {
  configFilePath = join(cwd, commander.configFile)
}

server.start(configFilePath)
