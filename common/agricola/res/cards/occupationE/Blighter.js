module.exports = {
  id: "blighter-e101",
  name: "Blighter",
  deck: "occupationE",
  number: 101,
  type: "occupation",
  players: "1+",
  text: "When you play this card, you get 1 bonus point for each complete stage left to play. You may not play any more occupations.",
  onPlay(game, player) {
    const stagesLeft = game.getCompleteStagesLeft()
    player.addBonusPoints(stagesLeft)
    player.cannotPlayOccupations = true
    game.log.add({
      template: '{player} gets {amount} bonus points from Blighter (no more occupations allowed)',
      args: { player, amount: stagesLeft },
    })
  },
}
