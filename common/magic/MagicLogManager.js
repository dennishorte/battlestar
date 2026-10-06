const { BaseLogManager } = require('../lib/game/index.js')


class MagicLogManager extends BaseLogManager {
  add(msg) {
    const player = msg.args?.player

    // The player holding priority is the implied actor, so their name is
    // dropped from log entries. It stays when someone acts without
    // priority (e.g. an anytime action on another player's turn).
    // `players` may be undefined when entries are logged while the player
    // manager is still being constructed.
    if (player) {
      const current = this._game.players?.current()
      if (current && (player.name || player) === current.name) {
        msg = {
          ...msg,
          template: msg.template.replace(/ ?by \{player\}$/, ''),
        }
      }
    }

    super.add(msg)
  }

  addStackPush(player, card) {
    this.add({
      template: '{card} put on the stack by {player}',
      args: { player, card },
      event: 'stack-push',
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
