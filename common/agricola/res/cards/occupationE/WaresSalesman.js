module.exports = {
  id: "wares-salesman-e144",
  name: "Wares Salesman",
  deck: "occupationE",
  number: 144,
  type: "occupation",
  players: "1+",
  text: "Each time any player (including you) plays or builds a card that lets them turn building resources into food, you get exactly 1 corresponding building resource and 1 reed.",
  onAnyPlayImprovement(game, _actingPlayer, cardOwner, improvement) {
    const craftMap = {
      'joinery': 'wood',
      'pottery': 'clay',
      'basketmakers-workshop': 'reed',
    }
    const impId = improvement.definition?.id || improvement.id
    const resource = craftMap[impId]
    if (resource) {
      cardOwner.addResource(resource, 1)
      cardOwner.addResource('reed', 1)
      game.log.add({
        template: '{player} gets 1 {resource} and 1 reed from {card}',
        args: { player: cardOwner, resource , card: this},
      })
    }
  },
}
