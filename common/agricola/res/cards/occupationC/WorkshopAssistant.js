module.exports = {
  id: "workshop-assistant-c146",
  name: "Workshop Assistant",
  deck: "occupationC",
  number: 146,
  type: "occupation",
  players: "3+",
  text: "Place a unique pair of different building resources on each of your improvements. Each time another player renovates, you may move one such pair to your supply.",
  onPlay(game, player) {
    const s = game.cardState(this.id)
    s.resourcePairs = []
    const improvements = player.getAllImprovements()
    for (const imp of improvements) {
      s.resourcePairs.push({ improvement: imp.id, resources: game.actions.chooseBuildingResourcePair(player) })
    }
  },
  onAnyRenovate(game, actingPlayer, cardOwner) {
    const s = game.cardState(this.id)
    if (actingPlayer.name !== cardOwner.name && s.resourcePairs && s.resourcePairs.length > 0) {
      game.actions.offerWorkshopAssistantClaim(cardOwner, this)
    }
  },
}
