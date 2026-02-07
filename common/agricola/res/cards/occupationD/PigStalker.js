module.exports = {
  id: "pig-stalker-d165",
  name: "Pig Stalker",
  deck: "occupationD",
  number: 165,
  type: "occupation",
  players: "1+",
  text: "Each time you use an animal accumulation space, if you occupy either the action space immediately above or below that accumulation space, you also get 1 wild boar.",
  onAction(game, player, actionId) {
    if (game.isAnimalAccumulationSpace(actionId)) {
      const adjacentSpaces = game.getVerticallyAdjacentActionSpaces(actionId)
      if (adjacentSpaces.some(space => player.occupiesActionSpace(space)) && player.canPlaceAnimals('boar', 1)) {
        player.addAnimals('boar', 1)
        game.log.add({
          template: '{player} gets 1 wild boar from Pig Stalker',
          args: { player },
        })
      }
    }
  },
}
