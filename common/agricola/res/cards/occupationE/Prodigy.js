module.exports = {
  id: "prodigy-e098",
  name: "Prodigy",
  deck: "occupationE",
  number: 98,
  type: "occupation",
  players: "1+",
  text: "If this is your 1st occupation, you immediately get 1 bonus point for each improvement you have. (This will not apply to improvements played after this card.)",
  onPlay(game, player) {
    if (player.getOccupationCount() === 1) {
      const improvementCount = player.getAllImprovements().length
      player.addBonusPoints(improvementCount)
      game.log.add({
        template: '{player} gets {amount} bonus points from Prodigy',
        args: { player, amount: improvementCount },
      })
    }
  },
}
