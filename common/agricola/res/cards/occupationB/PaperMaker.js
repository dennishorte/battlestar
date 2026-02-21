module.exports = {
  id: "paper-maker-b109",
  name: "Paper Maker",
  deck: "occupationB",
  number: 109,
  type: "occupation",
  players: "1+",
  text: "Immediately before playing each occupation after this one, you can pay 1 wood total to get 1 food for each occupation you have in front of you.",
  onBeforePlayOccupation(game, player) {
    if (player.wood >= 1) {
      const occCount = player.playedOccupations.length
      if (occCount === 0) {
        return
      }

      const choices = [
        `Pay 1 wood for ${occCount} food`,
        'Skip',
      ]
      const selection = game.actions.choose(player, choices, {
        title: 'Paper Maker: Pay 1 wood for food?',
        min: 1,
        max: 1,
      })

      if (selection[0] !== 'Skip') {
        player.payCost({ wood: 1 })
        player.addResource('food', occCount)
        game.log.add({
          template: '{player} pays 1 wood for {amount} food from {card}',
          args: { player, amount: occCount , card: this},
        })
      }
    }
  },
}
