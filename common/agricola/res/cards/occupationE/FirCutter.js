module.exports = {
  id: "fir-cutter-e116",
  name: "Fir Cutter",
  deck: "occupationE",
  number: 116,
  type: "occupation",
  players: "1+",
  text: "When you play this card, you immediately get 1 food. Each time after you use an animal accumulation space with your 1st/2nd/3rd/4th/5th person, you get 1/1/2/2/3 wood.",
  onPlay(game, player) {
    player.addResource('food', 1)
    game.log.add({
      template: '{player} gets 1 food from Fir Cutter',
      args: { player },
    })
  },
  onAction(game, player, actionId) {
    if (game.isAnimalAccumulationSpace(actionId)) {
      const personNumber = player.getPersonPlacedThisRound()
      const woodAmounts = { 1: 1, 2: 1, 3: 2, 4: 2, 5: 3 }
      const wood = woodAmounts[personNumber] || 0
      if (wood > 0) {
        player.addResource('wood', wood)
        game.log.add({
          template: '{player} gets {amount} wood from Fir Cutter',
          args: { player, amount: wood },
        })
      }
    }
  },
}
