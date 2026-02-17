module.exports = {
  id: "begging-student-d097",
  name: "Begging Student",
  deck: "occupationD",
  number: 97,
  type: "occupation",
  players: "1+",
  text: "When you play this card, you must immediately take 1 begging marker. At the start of each harvest, you can play 1 occupation without paying an occupation cost.",
  onPlay(game, player) {
    player.addResource('beggingCards', 1)
    game.log.add({
      template: '{player} takes a begging card from Begging Student',
      args: { player },
    })
  },
  onHarvestStart(game, player) {
    game.actions.offerFreeOccupations(player, this, 1)
  },
}
