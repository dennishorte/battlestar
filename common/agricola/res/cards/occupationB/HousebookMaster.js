module.exports = {
  id: "housebook-master-b134",
  name: "Housebook Master",
  deck: "occupationB",
  number: 134,
  type: "occupation",
  players: "1+",
  text: "After playing this card, if you renovate to stone in round 13/12/11 or before, you immediately get 1/2/3 food and 1/2/3 bonus points.",
  onRenovate(game, player, fromType, toType) {
    if (toType === 'stone') {
      let bonus = 0
      if (game.state.round <= 11) {
        bonus = 3
      }
      else if (game.state.round <= 12) {
        bonus = 2
      }
      else if (game.state.round <= 13) {
        bonus = 1
      }
      if (bonus > 0) {
        player.addResource('food', bonus)
        player.bonusPoints = (player.bonusPoints || 0) + bonus
        game.log.add({
          template: '{player} gets {amount} food and {amount} bonus points from Housebook Master',
          args: { player, amount: bonus },
        })
      }
    }
  },
}
