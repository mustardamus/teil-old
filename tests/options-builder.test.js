const { join } = require('path')
const optionsBuilder = require('../lib/options-builder')

describe('Options Builder', () => {
  it('should return the default options', () => {
    const opt = optionsBuilder()

    expect(opt.controllersGlob.includes('controllers/**/*!(.test|.spec|.draft).js')).toBe(true)
    expect(opt.modelsGlob.includes('models/**/*!(.test|.spec|.draft).js')).toBe(true)
  })

  it('should overwrite the default options with a config file', () => {
    const configPath = join(__dirname, '../example/teil.config.js')
    const opt = optionsBuilder(configPath)

    expect(opt.controllersGlob.includes('example/controllers/*.js')).toBe(true)
    expect(opt.modelsGlob.includes('example/models/*.js')).toBe(true)
  })

  it('should overwrite the default and config options with passed in custom options', () => {
    const configPath = join(__dirname, '../example/teil.config.js')
    const opt = optionsBuilder(configPath, { modelsGlob: '*.js' })

    expect(opt.modelsGlob).toBe('*.js')
  })
})
