const { BaseLogManager } = require('../lib/game/index.js')

import type { UltimatePlayer } from './UltimatePlayer.js'

interface Card {
  name: string
  isSpecialAchievement?: boolean
  isDecree?: boolean
  expansion?: string
  visibleAge?: number
  visibility: UltimatePlayer[]
  getAge(): number
  getHiddenName(name: string): string
}

interface UltimateUtils {
  biscuitIconToName(icon: string): string
}

interface Game {
  util: UltimateUtils
}

interface LogEntry {
  template: string
  args?: Record<string, unknown>
}

interface HandlerResult {
  value: string
  classes: string[]
  card?: Card
}

class UltimateLogManager extends BaseLogManager {
  _viewerName!: string
  _name!: string
  _game!: Game

  constructor(game: Game, chat: unknown, viewerName: string) {
    super(game, chat, viewerName)
    this._registerUltimateHandlers()
  }

  _registerUltimateHandlers(): void {
    // Override the default card handler with Ultimate-specific logic
    this.registerHandler('card*', (card: Card): HandlerResult => {
      let name: string
      if (card.isSpecialAchievement || card.isDecree) {
        name = card.name
      }
      else {
        const viewerCanSee = Boolean(card.visibility.find((player: UltimatePlayer) => player.name === this._viewerName))
        name = viewerCanSee ? card.name : card.getHiddenName(this._name)
      }

      const classes = ['card']
      if (!card.isSpecialAchievement && card.getAge()) {
        classes.push(`card-age-${card.visibleAge || card.getAge()}`)
      }
      if (card.expansion) {
        classes.push(`card-exp-${card.expansion}`)
      }
      if (name === 'hidden') {
        classes.push('card-hidden')
      }

      return {
        value: name,
        classes,
        card,
      }
    })

    this.registerHandler('biscuit*', (biscuit: string): HandlerResult => {
      if (biscuit.length === 1) {
        return {
          value: this._game.util.biscuitIconToName(biscuit),
          classes: ['biscuit'],
        }
      }
      else {
        return {
          value: biscuit,
          classes: ['biscuit'],
        }
      }
    })
  }

  _postEnrichArgs(entry: LogEntry): boolean {
    // Attempt to combine this entry with the previous entry.

    if (this.getLog().length === 0) {
      return false
    }

    const prev = this.getLog().slice(-1)[0] as LogEntry & { args?: { player?: { value: string }, card?: { card: Card } } }

    if (!prev.args) {
      return false
    }

    const combinable = ['foreshadows', 'melds', 'returns', 'tucks', 'reveals', 'scores', 'junks']
    const entryAction = entry.template.split(' ')[1]

    const entryIsCombinable = combinable.includes(entryAction)
    const prevWasDraw = (
      prev.template === '{player} draws {card}'
      || prev.template === '{player} draws and reveals {card}'
    )

    if (entryIsCombinable && prevWasDraw) {
      const entryArgs = entry.args as { player?: { value: string }, card?: { card: Card } }
      const argsMatch = (
        prev.args.player?.value === entryArgs.player?.value
        && prev.args.card?.card === entryArgs.card?.card
      )

      if (argsMatch) {
        prev.template = prev.template.slice(0, -6) + 'and ' + entryAction + ' {card}'
        prev.args.card = entryArgs.card
        return true
      }
    }

    return false
  }

  addForeseen(wasForeseen: boolean, card: Card): void {
    if (wasForeseen) {
      this.add({
        template: '{card} was foreseen',
        args: { card }
      })
    }
    else {
      this.add({
        template: '{card} was NOT foreseen',
        args: { card }
      })
    }
  }
}

module.exports = { UltimateLogManager }

export { UltimateLogManager }
