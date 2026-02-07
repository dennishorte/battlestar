module.exports = {
  id: "riparian-builder-a128",
  name: "Riparian Builder",
  deck: "occupationA",
  number: 128,
  type: "occupation",
  players: "1+",
  text: "Each time another player uses the \"Reed Bank\" accumulation space, you can build a room: if you build a clay/stone room, you get a discount of 1 clay/2 stone.",
  onAnyAction(game, actingPlayer, actionId, cardOwner) {
    if (actionId === 'take-reed' && actingPlayer.name !== cardOwner.name) {
      game.actions.offerRiparianBuilderRoom(cardOwner, this)
    }
  },
}
