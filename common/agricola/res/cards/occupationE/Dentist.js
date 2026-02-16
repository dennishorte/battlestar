module.exports = {
  id: "dentist-e110",
  name: "Dentist",
  deck: "occupationE",
  number: 110,
  type: "occupation",
  players: "1+",
  text: "At the start of each harvest, you can place 1 wood from your supply on this card, irretrievably. In each feeding phase, you get 1 food for each wood on this card.",
  onPlay(game, _player) {
    game.cardState(this.id).wood = 0
  },
  onHarvestStart(game, player) {
    if (player.wood >= 1) {
      const selection = game.actions.choose(player, ['Place 1 wood', 'Skip'], {
        title: 'Dentist: Place 1 wood on card?',
        min: 1,
        max: 1,
      })
      if (selection[0] === 'Place 1 wood') {
        player.removeResource('wood', 1)
        game.cardState(this.id).wood = (game.cardState(this.id).wood || 0) + 1
        game.log.add({
          template: '{player} places 1 wood on Dentist ({total} total)',
          args: { player, total: game.cardState(this.id).wood },
        })
      }
    }
  },
  onFeedingPhase(game, player) {
    const food = game.cardState(this.id).wood || 0
    if (food > 0) {
      player.addResource('food', food)
      game.log.add({
        template: '{player} gets {amount} food from Dentist',
        args: { player, amount: food },
      })
    }
  },
}
