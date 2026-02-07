module.exports = {
  id: "uncaring-parents-e099",
  name: "Uncaring Parents",
  deck: "occupationE",
  number: 99,
  type: "occupation",
  players: "1+",
  text: "At the end of each harvest, if you live in a stone house, you get 1 bonus point.",
  onHarvestEnd(game, player) {
    if (player.roomType === 'stone') {
      player.bonusPoints = (player.bonusPoints || 0) + 1
      game.log.add({
        template: '{player} gets 1 bonus point from Uncaring Parents',
        args: { player },
      })
    }
  },
}
