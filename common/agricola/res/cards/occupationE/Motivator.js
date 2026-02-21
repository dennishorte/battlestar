module.exports = {
  id: "motivator-e093",
  name: "Motivator",
  deck: "occupationE",
  number: 93,
  type: "occupation",
  players: "1+",
  text: "On your first turn each round, if you have no unused farmyard spaces, you can place a person from your supply.",
  onWorkPhaseStart(game, player) {
    if (player.getUnusedSpaceCount() === 0 && player.hasPersonInSupply()) {
      const selection = game.actions.choose(player, ['Place person', 'Skip'], {
        title: 'Motivator: Place a person from your supply?',
        min: 1,
        max: 1,
      })
      if (selection[0] === 'Place person') {
        game.log.add({
          template: '{player} places an extra person from {card}',
          args: { player , card: this},
        })
        game.playerTurn(player, { skipUseWorker: true, isBonusTurn: true })
      }
    }
  },
}
