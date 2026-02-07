module.exports = {
  id: "lover-c127",
  name: "Lover",
  deck: "occupationC",
  number: 127,
  type: "occupation",
  players: "1+",
  text: "When you play this card, immediately pay an amount of food equal to the number of complete rounds left to play to take a \"Family Growth Even without Room\" action.",
  onPlay(game, player) {
    const roundsLeft = 14 - game.state.round
    if (player.food >= roundsLeft) {
      player.removeResource('food', roundsLeft)
      game.actions.familyGrowthWithoutRoom(player)
      game.log.add({
        template: '{player} pays {amount} food for Family Growth via Lover',
        args: { player, amount: roundsLeft },
      })
    }
  },
}
