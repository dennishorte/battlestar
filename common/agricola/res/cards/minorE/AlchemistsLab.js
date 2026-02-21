module.exports = {
  id: "alchemists-lab-e081",
  name: "Alchemist's Lab",
  deck: "minorE",
  number: 81,
  type: "minor",
  cost: {},
  vps: 1,
  prereqs: { occupations: 3 },
  text: "This card is an action space for all. A player who uses it gets 1 building resource of each type they already have. If another player uses it, they must first pay you 1 food.",
  providesActionSpace: true,
  actionSpaceId: "alchemists-lab",

  canUseActionSpace(game, actingPlayer, cardOwner) {
    if (actingPlayer.name !== cardOwner.name) {
      return actingPlayer.food >= 1
    }
    return true
  },

  onActionSpaceUsed(game, actingPlayer, cardOwner) {
    if (actingPlayer.name !== cardOwner.name) {
      actingPlayer.payCost({ food: 1 })
      cardOwner.addResource('food', 1)
      game.log.add({
        template: '{actingPlayer} pays 1 food to {owner} to use {card}',
        args: { actingPlayer, owner: cardOwner, card: this },
      })
    }
    const resources = ['wood', 'clay', 'stone', 'reed']
    const gained = []
    for (const res of resources) {
      if ((actingPlayer[res] || 0) > 0) {
        actingPlayer.addResource(res, 1)
        gained.push(res)
      }
    }
    if (gained.length > 0) {
      game.log.add({
        template: '{player} gets 1 each of {resources} from {card}',
        args: { player: actingPlayer, resources: gained.join(', '), card: this },
      })
    }
  },
}
