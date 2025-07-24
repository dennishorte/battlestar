const PROXY_ITEMS = [
  'log',
  'actions',
  'cards',
  'players',
  'state',
  'zones',
]


class GameProxy {
  static create(target) {

    return new Proxy(target, {
      get(target, prop) {
        if (PROXY_ITEMS.includes(prop)) {
          return target.game[prop]
        }
        else {
          return target[prop]
        }
      },

      set(target, prop, value) {
        if (PROXY_ITEMS.includes(prop)) {
          throw new Error(`Cannot directly set '${prop}'. This property is redirected to game.${prop}`)
        }
        else {
          target[prop] = value
          return true
        }
      },
    })
  }
}


module.exports = {
  GameProxy,
}
