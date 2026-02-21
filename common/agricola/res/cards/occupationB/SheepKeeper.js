module.exports = {
  id: "sheep-keeper-b154",
  name: "Sheep Keeper",
  deck: "occupationB",
  number: 154,
  type: "occupation",
  players: "3+",
  text: "You can only play this card if you have less than 7 sheep. Once this game, when you have 7 sheep in your farmyard, you immediately get 3 bonus points and 2 food.",
  canPlay(player) {
    return player.getTotalAnimals('sheep') < 7
  },
  checkTrigger(game, player) {
    if (!player.sheepKeeperTriggered && player.getTotalAnimals('sheep') >= 7) {
      player.sheepKeeperTriggered = true
      player.addBonusPoints(3)
      player.addResource('food', 2)
      game.log.add({
        template: '{player} gets 3 bonus points and 2 food from {card}',
        args: { player , card: this},
      })
    }
  },
}
