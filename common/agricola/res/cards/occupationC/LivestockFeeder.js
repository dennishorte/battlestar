module.exports = {
  id: "livestock-feeder-c086",
  name: "Livestock Feeder",
  deck: "occupationC",
  number: 86,
  type: "occupation",
  players: "1+",
  text: "When you play this card, you immediately get 1 grain. Each grain in your supply can hold 1 animal of any type.",
  mixedAnimals: true,
  holdsAnimals: { any: true },
  onPlay(game, player) {
    player.addResource('grain', 1)
    game.log.add({
      template: '{player} gets 1 grain from {card}',
      args: { player , card: this},
    })
  },
  getAnimalCapacity(_game, player) {
    return player.grain
  },
  matches_onLoseResource(_game, player, resource) {
    return resource === 'grain' && player.getCardAnimalTotal(this.id) > player.grain
  },
  onLoseResource(game, player) {
    const capacity = this.getAnimalCapacity(game, player)
    const animals = player.getCardAnimals(this.id)
    let excess = player.getCardAnimalTotal(this.id) - capacity
    if (excess <= 0) {
      return
    }

    // Evict cheapest animals first so more valuable ones keep their spots.
    // Leftovers are placed elsewhere (or cooked/released) via the usual flow.
    const incoming = {}
    for (const type of ['sheep', 'boar', 'cattle']) {
      const take = Math.min(excess, animals[type] || 0)
      if (take > 0) {
        player.removeCardAnimal(this.id, type, take)
        incoming[type] = take
        excess -= take
      }
    }
    game.actions.handleAnimalPlacement(player, incoming)
  },
}
