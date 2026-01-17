const { BaseLogManager } = require('../lib/game/index.js')

import type { BaseLogManager as BaseLogManagerType } from '../lib/game/index.js'
import type { Player } from './TyrantsBaseCard.js'

interface LogEntry {
  args: Record<string, unknown>
}

interface Card {
  id: string
}

interface Zone {
  name(): string
}

interface LogValue {
  value: string
  classes?: string[]
}

interface TyrantsLogManager extends BaseLogManagerType {
  _enrichLogArgs(entry: LogEntry): void
}

class TyrantsLogManager extends BaseLogManager {
  _enrichLogArgs(entry: LogEntry): void {
    for (const key of Object.keys(entry.args)) {
      if (key === 'players') {
        const players = entry.args[key] as (Player | string)[]
        entry.args[key] = {
          value: players.map(p => (p as Player).name || p).join(', '),
          classes: ['player-names'],
        } as LogValue
      }
      else if (key.startsWith('player')) {
        const player = entry.args[key] as Player | string
        entry.args[key] = {
          value: (player as Player).name || player,
          classes: ['player-name']
        } as LogValue
      }
      else if (key.startsWith('card')) {
        const card = entry.args[key] as Card
        entry.args[key] = {
          value: card.id,
          classes: ['card-id'],
        } as LogValue
      }
      else if (key.startsWith('zone')) {
        const zone = entry.args[key] as Zone
        entry.args[key] = {
          value: zone.name(),
          classes: ['zone-name']
        } as LogValue
      }
      else if (key.startsWith('loc')) {
        const loc = entry.args[key] as Zone
        entry.args[key] = {
          value: loc.name(),
          classes: ['location-name']
        } as LogValue
      }
      // Convert string args to a dict
      else if (typeof entry.args[key] !== 'object') {
        entry.args[key] = {
          value: entry.args[key],
        } as LogValue
      }
    }
  }
}

module.exports = { TyrantsLogManager }

export { TyrantsLogManager }
