module.exports = {
  id: "oyster-eater-d134",
  name: "Oyster Eater",
  deck: "occupationD",
  number: 134,
  type: "occupation",
  players: "1+",
  text: "Each time the \"Fishing\" accumulation space is used, you get 1 bonus point and must skip placing your next person that round. (You can place the person on a later turn.)",
  onAnyAction(game, actingPlayer, actionId, cardOwner) {
    if (actionId === 'fishing') {
      cardOwner.bonusPoints = (cardOwner.bonusPoints || 0) + 1
      cardOwner.skipNextPersonPlacement = true
      game.log.add({
        template: '{player} gets 1 bonus point and must skip next placement from Oyster Eater',
        args: { player: cardOwner },
      })
    }
  },
}
