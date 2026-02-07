module.exports = {
  id: "german-heath-keeper-c164",
  name: "German Heath Keeper",
  deck: "occupationC",
  number: 164,
  type: "occupation",
  players: "4+",
  text: "Each time any player (including you) uses the \"Pig Market\" accumulation space, you get 1 sheep from the general supply.",
  onAnyAction(game, actingPlayer, actionId, cardOwner) {
    if (actionId === 'take-boar' && cardOwner.canPlaceAnimals('sheep', 1)) {
      cardOwner.addAnimals('sheep', 1)
      game.log.add({
        template: '{player} gets 1 sheep from German Heath Keeper',
        args: { player: cardOwner },
      })
    }
  },
}
