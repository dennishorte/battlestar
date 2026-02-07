module.exports = {
  id: "profiteering-e082",
  name: "Profiteering",
  deck: "minorE",
  number: 82,
  type: "minor",
  cost: {},
  text: "When you play this card, you immediately get 1 food. Each time after you use the \"Day Laborer\" action space, you can exchange 1 building resource for another building resource.",
  onPlay(game, player) {
    player.addResource('food', 1)
    game.log.add({
      template: '{player} gets 1 food from Profiteering',
      args: { player },
    })
  },
  onAction(game, player, actionId) {
    if (actionId === 'day-laborer') {
      game.actions.offerResourceExchange(player, this, 'building', 'building', 1)
    }
  },
}
