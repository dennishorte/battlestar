import type { Game } from './GameProxy.js'
import { GameProxy } from './GameProxy.js'

interface PlayerData {
  _id: string
  name: string
  team?: string
  [key: string]: unknown
}

interface LogEntry {
  template: string
  args: Record<string, unknown>
  classes?: string[]
}

interface LogManager {
  add(entry: LogEntry): void
}

interface PlayerManager {
  current(): BasePlayer
}

interface CounterOptions {
  silent?: boolean
}

class BasePlayer<TGame extends Game = Game> {
  game: TGame

  _id: string
  id: string
  name: string
  team: string

  index: number | undefined  // deprecated version of seatNumber
  seatNumber: number | undefined

  eliminated: boolean

  counters: Record<string, number>

  // Proxied properties from game
  declare log: LogManager
  declare players: PlayerManager

  constructor(game: TGame, data: PlayerData) {
    this.game = game

    this._id = data._id
    this.id = data.name
    this.name = data.name
    this.team = data.team || data.name

    this.index = undefined // deprecated version of seatNumber
    this.seatNumber = undefined

    this.eliminated = false

    this.counters = {}

    return GameProxy.create(this)
  }

  addCounter(name: string, count: number = 0): void {
    this.counters[name] = count
  }

  decrementCounter(name: string, count: number = 1): void {
    this.incrementCounter(name, -count)
  }

  getCounter(name: string): number {
    return this.counters[name] || 0
  }

  incrementCounter(name: string, count: number = 1, opts: CounterOptions = {}): void {
    if (!opts.silent) {
      this.log.add({
        template: "{player} '{counter}': {initial} {sign} {amount} = {final}",
        args: {
          player: this,
          counter: name,
          initial: this.counters[name],
          sign: count >= 0 ? '+' : '-',
          amount: Math.abs(count),
          final: this.counters[name] + count,
        },
        classes: ['player-counter-change'],
      })
    }

    this.counters[name] += count
  }

  isCurrentPlayer(): boolean {
    return this.players.current().id === this.id
  }

  isOpponent(other: BasePlayer): boolean {
    return this.team !== other.team
  }

  setCounter(name: string, value: number, opts: CounterOptions = {}): void {
    if (!opts.silent) {
      this.log.add({
        template: "{player} '{counter}': set from {initial} to {final}",
        args: {
          player: this,
          counter: name,
          initial: this.counters[name],
          final: value,
        },
        classes: ['player-counter-change'],
      })
    }

    this.counters[name] = value
  }

  static isActive(player: BasePlayer): boolean {
    return !player.eliminated
  }
}

export { BasePlayer, PlayerData, CounterOptions }
