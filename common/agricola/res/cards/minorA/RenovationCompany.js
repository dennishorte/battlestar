module.exports = {
  id: "renovation-company-a013",
  name: "Renovation Company",
  deck: "minorA",
  number: 13,
  type: "minor",
  cost: { wood: 4 },
  prereqs: { roomCount: 2, roomCountExact: true, houseType: "wood" },
  category: "Farm Planner",
  text: "When you play this card, you immediately get 3 clay. Immediately after, you can renovate without paying any building resources.",
  onPlay(game, player) {
    player.addResource('clay', 3)
    game.log.add({
      template: '{player} gets 3 clay from {card}',
      args: { player , card: this},
    })

    const card = this
    const fromType = player.roomType
    const toType = fromType === 'wood' ? 'clay' : (fromType === 'clay' ? 'stone' : null)
    if (!toType) {
      return
    }

    const choices = [
      `Renovate from ${fromType} to ${toType} for free`,
      'Skip',
    ]
    const selection = game.actions.choose(player, choices, {
      title: `${card.name}: Renovate for free?`,
      min: 1,
      max: 1,
    })

    if (selection[0] !== 'Skip') {
      game.actions._completeRenovation(player, toType, {
        logTemplate: '{player} renovates from {old} to {new} for free using {card}',
        logArgs: { card },
      })
    }
  },
}
