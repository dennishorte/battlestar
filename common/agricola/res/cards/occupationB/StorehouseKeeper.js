module.exports = {
  id: "storehouse-keeper-b156",
  name: "Storehouse Keeper",
  deck: "occupationB",
  number: 156,
  type: "occupation",
  players: "4+",
  text: "Each time you use the \"Resource Market\" action space, you also get your choice of 1 clay or 1 grain.",
  matches_onAction(game, player, actionId) {
    return actionId === 'resource-market'
  },
  onAction(game, player, _actionId) {
    game.actions.offerResourceChoice(player, this, ['clay', 'grain'])
  },
}
