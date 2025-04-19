const methods = {
  card: require('./card.proxy'),
  cube: require('./cube.proxy'),
  deck: require('./deck.proxy'),
}

function createProxy(data, methodsConstructor) {
  const coreMethods = new methodsConstructor()

  // Merge the data into the coreMethods object
  Object.assign(coreMethods, data)

  return new Proxy(coreMethods, {
    has(target, prop) {
      return prop in target
    },
    get(target, prop) {
      if (prop === 'toPlainObject') {
        return function() {
          // Return a plain object without methods
          const result = {}
          Object.keys(data).forEach(key => {
            result[key] = target[key]
          })
          return result
        }
      }
      return target[prop]
    }
  })
}

module.exports = {
  createProxy,
  card: (data) => createProxy(data, methods.card),
  cube: (data) => createProxy(data, methods.cube),
  deck: (data) => createProxy(data, methods.deck),
}
