const { join } = require('path')
const { existsSync } = require('fs')
const { rm, mkdir } = require('shelljs')
const fileWatcher = require('../lib/file-watcher')

const tempDir = '/tmp'//, join(__dirname, '../temp')
const controllersDir = join(tempDir, 'controllers')
const modelsDir = join(tempDir, 'models')
let watcher = null

const clean = () => {
  if (existsSync(controllersDir)) {
    rm('-rf', controllersDir)
  }

  if (existsSync(modelsDir)) {
    rm('-rf', modelsDir)
  }
}

beforeAll(() => {
  clean()
  mkdir('-p', controllersDir)
  mkdir('-p', modelsDir)
})

afterAll(() => {
  watcher.close()
  // clean()
})

describe('File Watcher', () => {
  it('should export a function', () => {
    expect(typeof fileWatcher).toBe('function')
  })

  it('should watch files in multiple locations and execute the callbacks', () => {
    /* const locations = [
      { glob: join(controllersDir, '*.js'), cb: jest.fn() },
      { glob: join(modelsDir, '*.js'), cb: jest.fn() }
    ]

    watcher = fileWatcher(locations)

    touch(join(controllersDir, 'posts.js'))

    setTimeout(() => {
      expect(locations[0].cb.mock.calls.length).toBe(1)
      done()
    }, 200) */
  })
})
