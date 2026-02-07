module.exports = {
  id: "cordmaker-a142",
  name: "Cordmaker",
  deck: "occupationA",
  number: 142,
  type: "occupation",
  players: "3+",
  text: "Each time any player (including you) takes at least 2 reed from the \"Reed Bank\" accumulation space, you can choose to take 1 grain or buy 1 vegetable for 2 food.",
  onAnyAction(game, actingPlayer, actionId, cardOwner, resources) {
    if (actionId === 'take-reed' && resources && resources.reed >= 2) {
      game.actions.offerCordmakerChoice(cardOwner, this)
    }
  },
}
