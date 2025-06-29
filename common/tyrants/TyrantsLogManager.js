const { BaseLogManager } = require('../lib/game')


class TyrantsLogManager extends BaseLogManager {
  _enrichLogArgs(entry) {
    for (const key of Object.keys(entry.args)) {
      if (key === 'players') {
        const players = entry.args[key]
        entry.args[key] = {
          value: players.map(p => p.name || p).join(', '),
          classes: ['player-names'],
        }
      }
      else if (key.startsWith('player')) {
        const player = entry.args[key]
        entry.args[key] = {
          value: player.name || player,
          classes: ['player-name']
        }
      }
      else if (key.startsWith('card')) {
        const card = entry.args[key]
        entry.args[key] = {
          value: card.id,
          classes: ['card-id'],
        }
      }
      else if (key.startsWith('zone')) {
        const zone = entry.args[key]
        entry.args[key] = {
          value: zone.name,
          classes: ['zone-name']
        }
      }
      else if (key.startsWith('loc')) {
        const loc = entry.args[key]
        entry.args[key] = {
          value: loc.name,
          classes: ['location-name']
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

module.exports = { TyrantsLogManager }
