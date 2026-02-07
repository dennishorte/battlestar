module.exports = {
  id: "wares-salesman-e144",
  name: "Wares Salesman",
  deck: "occupationE",
  number: 144,
  type: "occupation",
  players: "1+",
  text: "Each time any player (including you) plays or builds a card that lets them turn building resources into food, you get exactly 1 corresponding building resource and 1 reed.",
  onAnyPlayCard(game, actingPlayer, cardOwner, card) {
    if (card.convertsBuildingResourcesToFood) {
      const resourceType = card.buildingResourceType || 'wood'
      cardOwner.addResource(resourceType, 1)
      cardOwner.addResource('reed', 1)
      game.log.add({
        template: '{player} gets 1 {resource} and 1 reed from Wares Salesman',
        args: { player: cardOwner, resource: resourceType },
      })
    }
  },
}
