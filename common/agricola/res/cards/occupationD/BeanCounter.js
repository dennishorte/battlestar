module.exports = {
  id: "bean-counter-d158",
  name: "Bean Counter",
  deck: "occupationD",
  number: 158,
  type: "occupation",
  players: "1+",
  text: "Each time you use an action space on round spaces 1 to 8, place 1 food on this card. Each time this card has 3 food on it, move the food to your supply.",
  onPlay(_game, _player) {
    this.food = 0
  },
  onAction(game, player, actionId) {
    const actionRound = game.getActionSpaceRound(actionId)
    if (actionRound >= 1 && actionRound <= 8) {
      this.food = (this.food || 0) + 1
      if (this.food >= 3) {
        player.addResource('food', 3)
        this.food = 0
        game.log.add({
          template: '{player} gets 3 food from Bean Counter',
          args: { player },
        })
      }
    }
  },
}
