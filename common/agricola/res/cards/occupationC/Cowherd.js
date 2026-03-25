module.exports = {
  id: "cowherd-c147",
  name: "Cowherd",
  deck: "occupationC",
  number: 147,
  type: "occupation",
  players: "3+",
  text: "Each time you use the \"Cattle Market\" accumulation space (introduced in round 10 or 11), you get 1 additional cattle.",
  matches_onAction(game, player, actionId) {
    return actionId === 'take-cattle'
  },
  onAction(game, player, _actionId) {
    if (player.canPlaceAnimals('cattle', 1)) {
      game.actions.handleAnimalPlacement(player, { cattle: 1 })
      game.log.add({
        template: '{player} gets 1 additional cattle',
        args: { player },
      })
    }
  },
}
