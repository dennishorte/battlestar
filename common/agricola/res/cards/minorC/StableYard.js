module.exports = {
  id: "stable-yard-c050",
  name: "Stable Yard",
  deck: "minorC",
  number: 50,
  type: "minor",
  cost: {},
  vps: 1,
  prereqs: { stables: 3, pastures: 3 },
  category: "Food Provider",
  text: "When you play this card, you immediately get 1 food for each completed round left to play. At any time, you can exchange 1 sheep plus 1 wild boar for 1 cattle.",
  allowsAnytimeExchange: true,
  exchangeOptions: [
    { from: { sheep: 1, boar: 1 }, to: { cattle: 1 } },
  ],
  onPlay(game, player) {
    const roundsLeft = 14 - game.state.round
    if (roundsLeft > 0) {
      player.addResource('food', roundsLeft)
      game.log.add({
        template: '{player} gets {amount} food from {card}',
        args: { player, amount: roundsLeft , card: this},
      })
    }
  },
}
