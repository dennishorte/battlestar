module.exports = {
  id: "material-hub-c081",
  name: "Material Hub",
  deck: "minorC",
  number: 81,
  type: "minor",
  cost: { wood: 1, clay: 1 },
  prereqs: { reed: 1, stone: 1 },
  category: "Building Resource Provider",
  text: "Immediately place 2 of each building resource on this card. Each time any player (including you) takes at least 5 wood, 4 clay, 3 reed, or 3 stone, you get 1 of that building resource from this card.",
  onPlay(game, player) {
    player.materialHubResources = { wood: 2, clay: 2, reed: 2, stone: 2 }
    game.log.add({
      template: '{player} places resources on {card}',
      args: { player , card: this},
    })
  },
  onAnyAction(game, actingPlayer, actionId, cardOwner, resources) {
    if (!cardOwner.materialHubResources) {
      return
    }
    const thresholds = { wood: 5, clay: 4, reed: 3, stone: 3 }
    for (const [resource, threshold] of Object.entries(thresholds)) {
      if (resources && (resources[resource] || 0) >= threshold && cardOwner.materialHubResources[resource] > 0) {
        cardOwner.materialHubResources[resource]--
        cardOwner.addResource(resource, 1)
        game.log.add({
          template: '{player} gets 1 {resource} from {card}',
          args: { player: cardOwner, resource , card: this},
        })
      }
    }
  },
}
