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

type PlayerConstructor<T extends BasePlayerInterface = BasePlayerInterface> = new (game: Game, data: PlayerData) => T

interface PlayerManagerOptions<T extends BasePlayerInterface = BasePlayerInterface> {
  firstPlayerId?: string | null
  shuffleSeats?: boolean
  playerClass?: PlayerConstructor<T>
}

class PlayerList<T extends BasePlayerInterface = BasePlayerInterface> extends Array<T> {
  constructor(...args: T[]) {
    super(...args)
  }

  active(): PlayerList<T> {
    return new PlayerList<T>(...this.filter(player => !player.eliminated))
  }
}


class BasePlayerManager<
  TGame extends Game = Game,
  TPlayer extends BasePlayerInterface = BasePlayerInterface
> {
  game: TGame
  protected _users: PlayerData[]
  protected _players: TPlayer[]
  protected _currentPlayer: TPlayer | null
  protected _opts: Required<PlayerManagerOptions<TPlayer>>

  // Proxied property from game
  declare log: LogManager

  constructor(game: TGame, users: PlayerData[], opts: PlayerManagerOptions<TPlayer> = {}) {
    this.game = game
    this._users = [...users]

    this._players = []

    // The player who is currently supposed to take an action.
    this._currentPlayer = null

    this._opts = Object.assign({
      firstPlayerId: null,
      shuffleSeats: true,
      playerClass: BasePlayer as PlayerConstructor<TPlayer>,
    }, opts) as Required<PlayerManagerOptions<TPlayer>>

    const proxy = GameProxy.create(this)

    this.reset.call(proxy)

    return proxy
  }

  reset(): void {
    this._players = this._users.map(user => new this._opts.playerClass(this.game, user)) as TPlayer[]

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

  passToPlayer(player: TPlayer): void {
    this._currentPlayer = player
  }

  ////////////////////////////////////////////////////////////////////////////////
  // Get multiple players

  active(): PlayerList<TPlayer> {
    return new PlayerList<TPlayer>(...this.all().filter(player => player.eliminated === false))
  }

  all(): PlayerList<TPlayer> {
    return new PlayerList<TPlayer>(...this._players)
  }

  endingWith(player: TPlayer): PlayerList<TPlayer> {
    const players = this.startingWith(player)
    players.push(players.shift()!)
    return players
  }

  opponents(player: TPlayer): PlayerList<TPlayer> {
    return new PlayerList<TPlayer>(...this.all().filter(other => other.team !== player.team))
  }

  other(player: TPlayer): PlayerList<TPlayer> {
    return new PlayerList<TPlayer>(...this.all().filter(other => other.id !== player.id))
  }

  startingWith(player: TPlayer): PlayerList<TPlayer> {
    const players = this.all()
    while (players[0].id !== player.id) {
      players.push(players.shift()!)
    }
    return players
  }

  startingWithCurrent(): PlayerList<TPlayer> {
    return this.startingWith(this.current())
  }

  teamOf(player: TPlayer): PlayerList<TPlayer> {
    return new PlayerList<TPlayer>(...this.all().filter(other => other.team === player.team))
  }

  ////////////////////////////////////////////////////////////////////////////////
  // Get single players

  byId(id: string): TPlayer | undefined {
    return this.all().find(p => p.id === id)
  }

  byName(name: string): TPlayer | undefined {
    return this.all().find(p => p.name === name)
  }

  byOwner(obj: { owner: TPlayer }): TPlayer {
    return obj.owner
  }

  bySeat(index: number): TPlayer {
    return this.all()[index]
  }

  byZone(zone: { owner(): TPlayer | null }): TPlayer | null {
    // TODO: deprecate this, since the player can be taken straight off the zone
    return zone.owner()
  }

  current(): TPlayer {
    return this._currentPlayer!
  }

  first(): TPlayer {
    return this.all()[0]
  }

  following(player: TPlayer): TPlayer {
    return this.endingWith(player).active()[0]
  }

  leftOf(player: TPlayer): TPlayer {
    return this.following(player)
  }

  next(): TPlayer {
    return this.following(this.current())
  }

  preceding(player: TPlayer): TPlayer {
    return this.startingWith(player).active().slice(-1)[0]
  }

  rightOf(player: TPlayer): TPlayer {
    return this.preceding(player)
  }
}

export { BasePlayerManager, BasePlayerInterface, PlayerList, PlayerManagerOptions }
