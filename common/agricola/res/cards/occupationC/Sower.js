module.exports = {
  id: "sower-c115",
  name: "Sower",
  deck: "occupationC",
  number: 115,
  type: "occupation",
  players: "1+",
  text: "Each time you build a major improvement, place 1 reed from the general supply on that card. At any time, you can move the reed to your supply or exchange it for a \"Sow\" action.",
  allowsAnytimeAction: true,

  onPlay(game) {
    game.cardState(this.id).reed = 0
  },

  onBuildMajor(game, player) {
    const s = game.cardState(this.id)
    s.reed = (s.reed || 0) + 1
    game.log.add({
      template: '{player} places 1 reed on Sower ({total} total)',
      args: { player, total: s.reed },
    })
  },

  getAnytimeActions(game, player) {
    const s = game.cardState(this.id)
    if (!s.reed || s.reed <= 0) {
      return []
    }
    const actions = [
      {
        type: 'card-custom',
        cardId: this.id,
        cardName: this.name,
        actionKey: 'takeReed',
        description: `Sower: Take ${s.reed} reed`,
      },
    ]
    if (player.canSowAnything()) {
      actions.push({
        type: 'card-custom',
        cardId: this.id,
        cardName: this.name,
        actionKey: 'exchangeForSow',
        description: 'Sower: Exchange reed for Sow action',
      })
    }
    return actions
  },

  takeReed(game, player) {
    const s = game.cardState(this.id)
    const amount = s.reed
    s.reed = 0
    player.addResource('reed', amount)
    game.log.add({
      template: '{player} takes {amount} reed from Sower',
      args: { player, amount },
    })
  },

  exchangeForSow(game, player) {
    const s = game.cardState(this.id)
    s.reed = 0
    game.log.add({
      template: '{player} exchanges Sower reed for a Sow action',
      args: { player },
    })
    game.actions.sow(player)
  },
}
