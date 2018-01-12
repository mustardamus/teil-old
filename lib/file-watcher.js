const chokidar = require('chokidar')
const anymatch = require('anymatch')

module.exports = locations => {
  const globs = locations.map(l => l.glob)
  const opts = { ignoreInitial: true }
  const watcher = chokidar.watch(globs, opts)

  watcher.on('all', (eventName, filePath) => {
    locations.forEach(location => {
      if (anymatch(location.glob, filePath)) {
        location = locations.find(l => l.glob === location.glob)

        if (location && typeof location.cb === 'function') {
          location.eventName = eventName
          location.filePath = filePath

          location.cb(location)
        }
      }
    })
  })

  return watcher
}
