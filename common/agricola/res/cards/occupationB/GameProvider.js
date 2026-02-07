module.exports = {
  id: "game-provider-b165",
  name: "Game Provider",
  deck: "occupationB",
  number: 165,
  type: "occupation",
  players: "4+",
  text: "Immediately before each harvest, you can discard 1/3/4 grain from different fields to receive 1/2/3 wild boars.",
  onBeforeHarvest(game, player) {
    game.actions.offerGameProviderExchange(player, this)
  },
}
