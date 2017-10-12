const { join } = require('path')
const glob = require('glob')
const modelBuilder = require('./model-builder')

const modelsGlob = join(process.cwd(), 'models/*.js')

module.exports = async () => {
  const promises = glob.sync(modelsGlob).map(modelPath => {
    return modelBuilder(modelPath)
  })
  const modelObjs = await Promise.all(promises)
  const models = {}

  modelObjs.forEach(model => {
    models[model.modelName] = model
  })

  return models
}
