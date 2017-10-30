#!/usr/bin/env node

const { join } = require('path')
const commander = require('commander')
const server = require('../lib/server')

process.env.NODE_ENV = 'production'

const cwd = process.cwd()
let configFilePath

commander
  .option('--config-file <path>')
  .parse(process.argv)

const { configFile } = commander

if (configFile) {
  if (configFile.charAt(0) === '/') {
    configFilePath = configFile
  } else {
    configFilePath = join(cwd, configFile)
  }
}

server.start(configFilePath)
