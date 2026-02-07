module.exports = {
  id: "hollow-warden-a139",
  name: "Hollow Warden",
  deck: "occupationA",
  number: 139,
  type: "occupation",
  players: "3+",
  text: "When you play this card, you immediately get a \"Major Improvement\" action to build a Fireplace. Each time you use the \"Hollow\" accumulation space, you also get 1 food.",
  onPlay(game, player) {
    game.actions.offerBuildFireplace(player, this)
  },
  onAction(game, player, actionId) {
    if (actionId === 'take-clay-2') {
      player.addResource('food', 1)
      game.log.add({
        template: '{player} gets 1 food from Hollow Warden',
        args: { player },
      })
    }
  },
}
