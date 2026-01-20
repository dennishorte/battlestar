import type {
  ILogManager,
  IActionManager,
  ICardManager,
  IPlayerManager,
  IZoneManager,
} from './interfaces.js'

const PROXY_ITEMS = [
  'log',
  'actions',
  'cards',
  'players',
  'state',
  'util',
  'zones',
] as const

type ProxyItem = typeof PROXY_ITEMS[number]

// Interface for objects that have a game reference
interface GameHolder<TGame extends Game = Game> {
  game: TGame
}

// Interface for the Game object that holds the proxied properties
interface Game {
  log: ILogManager
  actions: IActionManager
  cards: ICardManager
  players: IPlayerManager
  state: Record<string, unknown>
  util: Record<string, unknown>
  zones: IZoneManager
  random: () => number
  requestInputSingle: (...args: unknown[]) => unknown[]
  [key: string]: unknown
}

class GameProxy {
  static create<T extends GameHolder<Game>>(target: T): T {
    return new Proxy(target, {
      get(target, prop: string | symbol) {
        if (typeof prop === 'string' && PROXY_ITEMS.includes(prop as ProxyItem)) {
          return target.game[prop]
        }
        else {
          return (target as Record<string | symbol, unknown>)[prop]
        }
      },

      set(target, prop: string | symbol, value: unknown) {
        if (typeof prop === 'string' && PROXY_ITEMS.includes(prop as ProxyItem)) {
          throw new Error(`Cannot directly set '${prop}'. This property is redirected to game.${prop}`)
        }
        else {
          (target as Record<string | symbol, unknown>)[prop] = value
          return true
        }
      },
    }) as T
  }
}


export { GameProxy, Game, GameHolder, PROXY_ITEMS }
