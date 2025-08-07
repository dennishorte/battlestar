const { BaseLogManager } = require('../lib/game/index.js')


class MagicLogManager extends BaseLogManager {
  addStackPush(player, card) {
    this.add({
      template: '{player} puts {card} on the stack',
      args: { player, card },
      classes: ['stack-push']
    })
  }

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
        const isHidden = !card.visibility.find(p => p.name === this._game.viewerName)

        if (isHidden) {
          entry.args[key] = {
            value: card.g.morph ? 'a morph' : 'a card',
            classes: ['card-hidden'],
          }
        }
        else {
          entry.args[key] = {
            value: card.name(),
            cardId: card.g.id,  // Important in some UI situations.
            classes: ['card-name'],
          }
        }
      }
      else if (key.startsWith('zone')) {
        const zone = entry.args[key]
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


module.exports = { MagicLogManager }
