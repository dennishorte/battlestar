module.exports = {
  id: "pet-grower-d164",
  name: "Pet Grower",
  deck: "occupationD",
  number: 164,
  type: "occupation",
  players: "1+",
  text: "Each time you use an animal accumulation space, if afterward you have no animal in your house, you also get 1 sheep.",
  forceManualAnimalPlacement: true,
  onAction(game, player, actionId) {
    if (game.isAnimalAccumulationSpace(actionId)) {
      if (player.getAnimalsInHouse() === 0 && player.canPlaceAnimals('sheep', 1)) {
        game.actions.handleAnimalPlacement(player, { sheep: 1 })
        game.log.add({
          template: '{player} gets 1 sheep from {card}',
          args: { player , card: this},
        })
      }
    }
  },
}
