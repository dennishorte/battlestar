module.exports = {
  id: "usufructuary-e157",
  name: "Usufructuary",
  deck: "occupationE",
  number: 157,
  type: "occupation",
  players: "1+",
  text: "When you play this card as your first occupation, you immediately get 1 food for every other occupation in play (by any player), up to a maximum of 7 food.",
  onPlay(game, player) {
    if (player.getOccupationCount() === 1) {
      const otherOccupations = game.getTotalOccupationsInPlay() - 1
      const food = Math.min(7, otherOccupations)
      if (food > 0) {
        player.addResource('food', food)
        game.log.add({
          template: '{player} gets {amount} food from {card}',
          args: { player, amount: food , card: this},
        })
      }
    }
  },
}
