import { BaseLogManager, IPlayer } from '../lib/game/index.js'
import type { Game as BaseGame } from '../lib/game/GameProxy.js'

import type { MagicCard } from './MagicCard.js'
import type { MagicZone } from './MagicZone.js'

// Use IPlayer for the Player type - has name property
type Player = IPlayer

// Use MagicCard for the Card type
type Card = MagicCard

// MagicZone has name() and owner() methods from BaseZone
type Zone = MagicZone

interface LogEntry {
  template: string
  args: Record<string, LogArg | Player | Player[] | Card | Zone | string | number>
  classes?: string[]
}

interface LogArg {
  value: unknown
  cardId?: string
  classes?: string[]
}

interface MagicLogGame extends BaseGame {
  viewerName: string
}

class MagicLogManager extends BaseLogManager<MagicLogGame> {

  addStackPush(player: Player, card: Card): void {
    this.add({
      template: '{player} puts {card} on the stack',
      args: { player, card },
      classes: ['stack-push']
    })
  }

  _enrichLogArgs(entry: LogEntry): void {
    for (const key of Object.keys(entry.args)) {
      if (key === 'players') {
        const players = entry.args[key] as Player[]
        entry.args[key] = {
          value: players.map(p => p.name || p).join(', '),
          classes: ['player-names'],
        }
      }
      else if (key.startsWith('player')) {
        const player = entry.args[key] as Player
        entry.args[key] = {
          value: player.name || player,
          classes: ['player-name']
        }
      }
      else if (key.startsWith('card')) {
        const card = entry.args[key] as Card
        const isHidden = !card.visibility.find(p => p.name === this._game.viewerName)

        if (isHidden) {
          entry.args[key] = {
            value: card.morph ? 'a morph' : 'a card',
            classes: ['card-hidden'],
          }
        }
        else {
          entry.args[key] = {
            value: card.name(),
            cardId: card.id,  // Important in some UI situations.
            classes: ['card-name'],
          }
        }
      }
      else if (key.startsWith('zone')) {
        const zone = entry.args[key] as Zone
        const owner = zone.owner()

        const value = owner ? `${owner.name}'s ${zone.name()}` : zone.name()

        entry.args[key] = {
          value,
          classes: ['zone-name']
        }
      }
      // Convert string args to a dict
      else if (typeof entry.args[key] !== 'object') {
        entry.args[key] = {
          value: entry.args[key],
        }
      }
    }
  }
}


export { MagicLogManager }
export type { LogEntry, LogArg }
