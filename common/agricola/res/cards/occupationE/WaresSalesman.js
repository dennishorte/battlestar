function resourcesTurnedIntoFood(improvement) {
  const raw = improvement.buildingResourceToFood
  if (raw == null || raw === '') {
    return []
  }
  return Array.isArray(raw) ? raw : [raw]
}

module.exports = {
  id: "wares-salesman-e144",
  name: "Wares Salesman",
  deck: "occupationE",
  number: 144,
  type: "occupation",
  players: "3+",
  text: "Each time any player (including you) plays or builds a card that lets them turn building resources into food, you get exactly 1 corresponding building resource and 1 reed.",
  onAnyPlayImprovement(game, _actingPlayer, cardOwner, improvement) {
    // Reads buildingResourceToFood on the improvement that was just built.
    // Set that field on any improvement that turns wood, clay, reed, or stone into food.
    const resources = resourcesTurnedIntoFood(improvement)
    if (resources.length === 0) {
      return
    }

    let resource = resources[0]
    if (resources.length > 1) {
      const choices = resources.map(r => game.actions.option({
        id: r,
        title: `1 ${r}`,
      }))
      const selection = game.actions.choose(cardOwner, choices, {
        title: `${this.name}: which building resource?`,
        min: 1,
        max: 1,
      })
      resource = selection[0].id
    }

    cardOwner.addResource(resource, 1)
    cardOwner.addResource('reed', 1)
    game.log.add({
      template: '{player} gets 1 {resource} and 1 reed from {card}',
      args: { player: cardOwner, resource, card: this },
    })
  },
}
