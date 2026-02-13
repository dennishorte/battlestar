module.exports = {
  id: "pen-builder-e086",
  name: "Pen Builder",
  deck: "occupationE",
  number: 86,
  type: "occupation",
  players: "1+",
  text: "At any time, you can place wood from your supply on this card, irretrievably. You can keep twice as many animals of any type on this card as there is wood on it.",
  allowsAnytimeAction: true,
  mixedAnimals: true,
  holdsAnimals: { any: true },
  onPlay(game, _player) {
    game.cardState(this.id).wood = 0
  },
  canPlaceWood(player) {
    return player.wood >= 1
  },
  getAnytimeActions(game, player) {
    if (!this.canPlaceWood(player)) {
      return []
    }
    const woodOnCard = game.cardState(this.id).wood || 0
    return [{
      type: 'card-custom',
      cardId: this.id,
      cardName: this.name,
      actionKey: 'activatePlaceWood',
      description: `${this.name}: Place wood (${woodOnCard} wood → ${woodOnCard * 2} capacity)`,
    }]
  },
  activatePlaceWood(game, player) {
    const maxWood = player.wood
    let amount = 1

    if (maxWood > 1) {
      const choices = []
      for (let i = 1; i <= Math.min(maxWood, 10); i++) {
        choices.push(`Place ${i} wood`)
      }
      const selection = game.actions.choose(player, choices, {
        title: 'Pen Builder: How much wood to place?',
        min: 1,
        max: 1,
      })
      const sel = Array.isArray(selection) ? selection[0] : selection
      amount = parseInt(sel.match(/\d+/)[0])
    }

    this.placeWood(game, player, amount)
  },
  placeWood(game, player, amount) {
    player.payCost({ wood: amount })
    const s = game.cardState(this.id)
    s.wood = (s.wood || 0) + amount
    game.log.add({
      template: '{player} places {amount} wood on Pen Builder',
      args: { player, amount },
    })
  },
  getAnimalCapacity(game) {
    return (game.cardState(this.id).wood || 0) * 2
  },
}
