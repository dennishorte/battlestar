module.exports = {
  id: "pet-lover-d138",
  name: "Pet Lover",
  deck: "occupationD",
  number: 138,
  type: "occupation",
  players: "1+",
  text: "Each time you use an accumulation space providing exactly 1 animal, you can leave it on the space and get one from the general supply instead, as well as 3 food and 1 grain.",
  onAction(game, player, actionId) {
    const animalCount = game.getAccumulatedAnimalCount(actionId)
    if (animalCount === 1) {
      game.actions.offerPetLoverChoice(player, this, actionId)
    }
  },
}
