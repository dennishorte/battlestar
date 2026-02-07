module.exports = {
  id: "pioneer-e105",
  name: "Pioneer",
  deck: "occupationE",
  number: 105,
  type: "occupation",
  players: "1+",
  text: "When you play this card and each time before you use the most recent action space card, you get 1 building resource of your choice and 1 food.",
  onPlay(game, player) {
    game.actions.offerBuildingResourceChoice(player, this)
    player.addResource('food', 1)
    game.log.add({
      template: '{player} gets 1 food from Pioneer',
      args: { player },
    })
  },
  onBeforeAction(game, player, actionId) {
    if (game.getActionSpaceRound(actionId) === game.getMostRecentlyRevealedRound()) {
      game.actions.offerBuildingResourceChoice(player, this)
      player.addResource('food', 1)
      game.log.add({
        template: '{player} gets 1 food from Pioneer',
        args: { player },
      })
    }
  },
}
