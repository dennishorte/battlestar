module.exports = {
  id: "roof-examiner-d145",
  name: "Roof Examiner",
  deck: "occupationD",
  number: 145,
  type: "occupation",
  players: "1+",
  text: "When you play this card, if you have 1/2/3/4 major improvements, you immediately get 2/3/4/5 reed.",
  onPlay(game, player) {
    const majorCount = player.getMajorImprovementCount()
    const reed = majorCount > 0 ? majorCount + 1 : 0
    if (reed > 0) {
      player.addResource('reed', reed)
      game.log.add({
        template: '{player} gets {amount} reed from Roof Examiner',
        args: { player, amount: reed },
      })
    }
  },
}
