module.exports = {
  id: "illusionist-b146",
  name: "Illusionist",
  deck: "occupationB",
  number: 146,
  type: "occupation",
  players: "3+",
  text: "Each time you use a building resource accumulation space, you can discard exactly 1 card from your hand to get 1 additional building resource of the accumulating type.",
  onAction(game, player, actionId) {
    if (game.isBuildingResourceAccumulationSpace(actionId) && player.hand.length > 0) {
      const resourceType = game.getAccumulationSpaceGoodType(actionId)
      if (!resourceType) {
        return
      }

      const choices = ['Discard 1 card for 1 ' + resourceType, 'Skip']
      const selection = game.actions.choose(player, choices, {
        title: 'Illusionist: Discard 1 card for bonus resource?',
        min: 1,
        max: 1,
      })
      if (selection[0] !== 'Skip') {
        // Discard a card from hand
        const cardChoices = player.hand.slice()
        const cardSelection = game.actions.choose(player, cardChoices, {
          title: 'Illusionist: Choose card to discard',
          min: 1,
          max: 1,
        })
        const cardObj = game.cards.byId(cardSelection[0])
        if (cardObj) {
          cardObj.moveTo(game.zones.byId('common.supply'))
        }
        player.addResource(resourceType, 1)
        game.log.add({
          template: '{player} discards a card for 1 {resource} from {card}',
          args: { player, resource: resourceType , card: this},
        })
      }
    }
  },
}
