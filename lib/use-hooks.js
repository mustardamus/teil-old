const { basename } = require('path')
const glob = require('glob')
const importFresh = require('import-fresh')
const { isArray, isFunction, camelCase } = require('lodash')

const validHooks = {
  onRequest: 3, // hookName: argumentsCount
  preHandler: 3,
  onSend: 4,
  onResponse: 2,
  onClose: 2
}

module.exports = (app, options = {}) => {
  const hooksPaths = glob.sync(options.hooksGlob)
  const hooksNames = []

  hooksPaths.forEach(hookPath => {
    let hooks = importFresh(hookPath)

    if (isFunction(hooks)) {
      hooks = [hooks]
    } else if (!isArray(hooks)) {
      throw new Error(`Hook '${hookPath}' must export a single function or an array of functions`)
    }

    hooks.forEach(hook => {
      const fullName = basename(hookPath, '.js')
      const splitName = fullName.split('-')
      const hookNameKebab = `${splitName[0]}-${splitName[1]}`
      const hookName = camelCase(hookNameKebab)

      if (!validHooks[hookName]) {
        throw new Error(`Hook '${hookPath}' has an unknown hook name prefix. Allowed hook names: ${Object.keys(validHooks).join(', ')}`)
      }

      if (!isFunction(hook)) {
        throw new Error(`Hook '${hookPath}' must export an array of functions`)
      }

      if (hook.length !== validHooks[hookName]) {
        throw new Error(`Hook '${hookPath}' must have ${validHooks[hookName]} arguments`)
      }

      app.addHook(hookName, hook)

      hooksNames.push({
        hookName,
        name: fullName.replace(`${hookNameKebab}-`, '')
      })
    })
  })

  return hooksNames
}
