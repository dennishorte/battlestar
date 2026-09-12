module.exports = {
  id: "piggy-bank-e027",
  name: "Piggy Bank",
  deck: "minorE",
  number: 27,
  type: "minor",
  cost: {},
  text: "At the end of each work phase, you can place 1 food on this card, irretrievably. At any time, you can discard 6 food from this card to build a major improvement at no cost.",
  storedResource: "food",
  allowsAnytimeAction: true,
  onWorkPhaseEnd(game, player) {
    if (player.food >= 1) {
      const selection = game.actions.choose(player, [
        game.actions.option({ id: 'store', title: 'Store 1 food on Piggy Bank' }),
        game.actions.option({ id: 'skip', title: 'Skip' }),
      ], {
        title: 'Piggy Bank',
        min: 1,
        max: 1,
      })
      if (selection[0].id !== 'skip') {
        player.payCost({ food: 1 })
        const s = game.cardState(this.id)
        s.stored = (s.stored || 0) + 1
        game.log.add({
          template: '{player} stores 1 food on {card} ({amount} total)',
          args: { player, card: this, amount: s.stored },
        })
      }
    }
  },

  getAnytimeActions(game, _player) {
    const stored = game.cardState(this.id).stored || 0
    if (stored < 6) {
      return []
    }
    if (game.getAvailableMajorImprovements().length === 0) {
      return []
    }
    return [{
      type: 'card-custom',
      cardId: this.id,
      cardName: this.name,
      actionKey: 'buildFreeMajor',
      description: `${this.name}: Discard 6 food to build a major improvement`,
    }]
  },

  buildFreeMajor(game, player) {
    const s = game.cardState(this.id)
    if ((s.stored || 0) < 6) {
      return
    }
    const available = game.getAvailableMajorImprovements()
    if (available.length === 0) {
      return
    }

    // Spend first so this action is not offered again during the nested choose.
    s.stored -= 6

    const choices = available.map(id => {
      const imp = game.cards.byId(id)
      return game.actions.option({ id, title: `${imp.name} (${id})`, kind: 'major-improvement' })
    })
    const selection = game.actions.choose(player, choices, {
      title: 'Piggy Bank: Build a major improvement',
      min: 1,
      max: 1,
    })

    game.actions._completeMajorPurchase(player, selection[0].id, {
      customCost: {},
      logTemplate: '{player} uses {cardSource} to build {card}',
      logArgs: { cardSource: this },
    })
  },
}
