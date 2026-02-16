module.exports = {
  id: "mountain-plowman-e164",
  name: "Mountain Plowman",
  deck: "occupationE",
  number: 164,
  type: "occupation",
  players: "1+",
  text: "Each time you plow at least 1 field tile, you get 1 sheep for each field tile that you just plowed.",
  onPlowField(game, player) {
    if (player.canPlaceAnimals('sheep', 1)) {
      player.addAnimals('sheep', 1)
      game.log.add({
        template: '{player} gets 1 sheep from Mountain Plowman',
        args: { player },
      })
    }
  },
}
