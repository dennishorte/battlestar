module.exports = {
  id: "dentist-e110",
  name: "Dentist",
  deck: "occupationE",
  number: 110,
  type: "occupation",
  players: "1+",
  text: "At the start of each harvest, you can place 1 wood from your supply on this card, irretrievably. In each feeding phase, you get 1 food for each wood on this card.",
  onPlay(_game, _player) {
    this.wood = 0
  },
  onHarvestStart(game, player) {
    if (player.wood >= 1) {
      game.actions.offerDentistPlaceWood(player, this)
    }
  },
  onFeedingPhaseStart(game, player) {
    const food = this.wood || 0
    if (food > 0) {
      player.addResource('food', food)
      game.log.add({
        template: '{player} gets {amount} food from Dentist',
        args: { player, amount: food },
      })
    }
  },
}
