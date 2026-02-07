module.exports = {
  id: "mountain-plowman-e164",
  name: "Mountain Plowman",
  deck: "occupationE",
  number: 164,
  type: "occupation",
  players: "1+",
  text: "Each time you plow at least 1 field tile, you get 1 sheep for each field tile that you just plowed.",
  onPlow(game, player, fieldCount) {
    if (fieldCount >= 1 && player.canPlaceAnimals('sheep', fieldCount)) {
      player.addAnimals('sheep', fieldCount)
      game.log.add({
        template: '{player} gets {count} sheep from Mountain Plowman',
        args: { player, count: fieldCount },
      })
    }
  },
}
