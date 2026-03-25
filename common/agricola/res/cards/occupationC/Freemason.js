module.exports = {
  id: "freemason-c123",
  name: "Freemason",
  deck: "occupationC",
  number: 123,
  type: "occupation",
  players: "1+",
  text: "As long as you live in a clay/stone house with exactly 2 rooms, at the start of each work phase, you get 2 clay/stone.",
  matches_onWorkPhaseStart(_game, player) {
    return player.getRoomCount() === 2 && (player.roomType === 'clay' || player.roomType === 'stone')
  },
  onWorkPhaseStart(game, player) {
    if (player.roomType === 'clay') {
      player.addResource('clay', 2)
      game.log.add({
        template: '{player} gets 2 clay',
        args: { player },
      })
    }
    else if (player.roomType === 'stone') {
      player.addResource('stone', 2)
      game.log.add({
        template: '{player} gets 2 stone',
        args: { player },
      })
    }
  },
}
