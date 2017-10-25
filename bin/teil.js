#!/usr/bin/env node

const zargs = require('yargs')
const server = require('../lib/server')

const app = zargs
  .usage('$0 <cmd> [args]')
  .command(['dev', '$0'], 'Start development server', yargs => {
    server.start()
  })
  .command('start', 'Start the production server', yargs => {
    process.env.NODE_ENV = 'production'
    server.start()
  })
  .help()

/* eslint-disable */
app.argv
/* eslint-enable */
