import type { Game } from './GameProxy.js'
import { BasePlayer } from './BasePlayer.js'
import { GameProxy } from './GameProxy.js'
import util from '../util.js'

interface PlayerData {
  _id: string
  name: string
  team?: string
  [key: string]: unknown
}

interface LogManager {
  add(entry: { template: string; args?: Record<string, unknown> }): void
}

interface BasePlayerInterface {
  id: string
  name: string
  team: string
  index: number | undefined
  seatNumber: number | undefined
  eliminated: boolean
}

type PlayerConstructor = new (game: Game, data: PlayerData) => BasePlayerInterface

interface PlayerManagerOptions {
  firstPlayerId?: string | null
  shuffleSeats?: boolean
  playerClass?: PlayerConstructor
}

class PlayerList extends Array<BasePlayerInterface> {
  constructor(...args: BasePlayerInterface[]) {
    super(...args)
  }

  active(): PlayerList {
    return new PlayerList(...this.filter(player => !player.eliminated))
  }
}


class BasePlayerManager<TGame extends Game = Game> {
  game: TGame
  protected _users: PlayerData[]
  protected _players: BasePlayerInterface[]
  protected _currentPlayer: BasePlayerInterface | null
  protected _opts: Required<PlayerManagerOptions>

  // Proxied property from game
  declare log: LogManager

  constructor(game: TGame, users: PlayerData[], opts: PlayerManagerOptions = {}) {
    this.game = game
    this._users = [...users]

    this._players = []

    // The player who is currently supposed to take an action.
    this._currentPlayer = null

    this._opts = Object.assign({
      firstPlayerId: null,
      shuffleSeats: true,
      playerClass: BasePlayer,
    }, opts)

    const proxy = GameProxy.create(this)

    this.reset.call(proxy)

    return proxy
  }

  reset(): void {
    this._players = this._users.map(user => new this._opts.playerClass(this.game, user))

    if (this._opts.shuffleSeats) {
      util.array.shuffle(this._players, this.game.random)
      this.log.add({ template: 'Players assigned to random seats' })
    }

    if (this._opts.firstPlayerId) {
      while (this._players[0].id !== this._opts.firstPlayerId) {
        this._players.push(this._players.shift()!)
      }
      this.log.add({
        template: '{player} moved to first seat',
        args: { player: this._players[0] }
      })
    }

    this._players.forEach((player, index) => {
      player.index = index  // deprecated
      player.seatNumber = index
    })

    this._currentPlayer = this._players[0]
  }

  ////////////////////////////////////////////////////////////////////////////////
  // Actions

  advancePlayer(): void {
    this._currentPlayer = this.next()
  }

  passToPlayer(player: BasePlayerInterface): void {
    this._currentPlayer = player
  }

  ////////////////////////////////////////////////////////////////////////////////
  // Get multiple players

  active(): PlayerList {
    return new PlayerList(...this.all().filter(player => player.eliminated === false))
  }

  all(): PlayerList {
    return new PlayerList(...this._players)
  }

  endingWith(player: BasePlayerInterface): PlayerList {
    const players = this.startingWith(player)
    players.push(players.shift()!)
    return players
  }

  opponents(player: BasePlayerInterface): PlayerList {
    return new PlayerList(...this.all().filter(other => other.team !== player.team))
  }

  other(player: BasePlayerInterface): PlayerList {
    return new PlayerList(...this.all().filter(other => other.id !== player.id))
  }

  startingWith(player: BasePlayerInterface): PlayerList {
    const players = this.all()
    while (players[0].id !== player.id) {
      players.push(players.shift()!)
    }
    return players
  }

  startingWithCurrent(): PlayerList {
    return this.startingWith(this.current())
  }

  teamOf(player: BasePlayerInterface): PlayerList {
    return new PlayerList(...this.all().filter(other => other.team === player.team))
  }

  ////////////////////////////////////////////////////////////////////////////////
  // Get single players

  byId(id: string): BasePlayerInterface | undefined {
    return this.all().find(p => p.id === id)
  }

  byName(name: string): BasePlayerInterface | undefined {
    return this.all().find(p => p.name === name)
  }

  byOwner(obj: { owner: BasePlayerInterface }): BasePlayerInterface {
    return obj.owner
  }

  bySeat(index: number): BasePlayerInterface {
    return this.all()[index]
  }

  byZone(zone: { owner(): BasePlayerInterface | null }): BasePlayerInterface | null {
    // TODO: deprecate this, since the player can be taken straight off the zone
    return zone.owner()
  }

  current(): BasePlayerInterface {
    return this._currentPlayer!
  }

  first(): BasePlayerInterface {
    return this.all()[0]
  }

  following(player: BasePlayerInterface): BasePlayerInterface {
    return this.endingWith(player).active()[0]
  }

  leftOf(player: BasePlayerInterface): BasePlayerInterface {
    return this.following(player)
  }

  next(): BasePlayerInterface {
    return this.following(this.current())
  }

  preceding(player: BasePlayerInterface): BasePlayerInterface {
    return this.startingWith(player).active().slice(-1)[0]
  }

  rightOf(player: BasePlayerInterface): BasePlayerInterface {
    return this.preceding(player)
  }
}

export { BasePlayerManager, PlayerList, PlayerManagerOptions }
