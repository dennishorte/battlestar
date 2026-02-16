module.exports = {
  id: "miller-e095",
  name: "Miller",
  deck: "occupationE",
  number: 95,
  type: "occupation",
  players: "1+",
  text: "You can immediately build a baking improvement by paying its cost. Each time another player uses the \"Grain Seeds\" action space, you can take a \"Bake Bread\" action.",
  onPlay(game, player) {
    // Offer to build a baking improvement (fireplace, cooking hearth, oven)
    const available = game.getAvailableMajorImprovements()
    const bakingImprovements = available.filter(id => {
      const imp = game.cards.byId(id)
      return imp && imp.abilities && imp.abilities.canBake
    })
    if (bakingImprovements.length > 0) {
      game.actions.buyMajorImprovement(player, bakingImprovements)
    }
  },
  onAnyAction(game, actingPlayer, actionId, cardOwner) {
    if (actionId === 'take-grain' && actingPlayer.name !== cardOwner.name) {
      // Offer bake bread
      if (cardOwner.hasBakingAbility() && cardOwner.grain >= 1) {
        game.actions.bakeBread(cardOwner)
      }
    }
  },
}
