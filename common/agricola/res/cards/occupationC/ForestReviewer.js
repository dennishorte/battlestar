module.exports = {
  id: "forest-reviewer-c145",
  name: "Forest Reviewer",
  deck: "occupationC",
  number: 145,
  type: "occupation",
  players: "3+",
  text: "Each time after any player (including you) uses the unoccupied \"Grove\" or \"Forest\" accumulation space while the other of the two is occupied, you get 1 reed.",
  onAnyAction(game, actingPlayer, actionId, cardOwner) {
    if ((actionId === 'grove' || actionId === 'grove-5' || actionId === 'grove-6') && game.isActionOccupied('take-wood')) {
      cardOwner.addResource('reed', 1)
      game.log.add({
        template: '{player} gets 1 reed from Forest Reviewer',
        args: { player: cardOwner },
      })
    }
    else if (actionId === 'take-wood' && (game.isActionOccupied('grove') || game.isActionOccupied('grove-5') || game.isActionOccupied('grove-6'))) {
      cardOwner.addResource('reed', 1)
      game.log.add({
        template: '{player} gets 1 reed from Forest Reviewer',
        args: { player: cardOwner },
      })
    }
  },
}
