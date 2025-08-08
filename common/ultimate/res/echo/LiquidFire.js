module.exports = {
  name: `Liquid Fire`,
  color: `red`,
  age: 3,
  expansion: `echo`,
  biscuits: `hsss`,
  dogmaBiscuit: `s`,
  echo: ``,
  dogma: [
    `I demand you draw and reveal a card of value equal to the highest bonus on your board! Transfer it to my forecast! If it is red, transfer all cards from your hand to my score pile.`
  ],
  dogmaImpl: [
    (game, player, { leader }) => {
      const age = Math.max(...game.getBonuses(player))
      if (age && age > 0) {
        const card = game.aDrawAndReveal(player, age)
        if (card) {
          game.aTransfer(player, card, game.getZoneByPlayer(leader, 'forecast'))

          if (card.color === 'red') {
            game.aTransferMany(player, game.getCardsByZone(player, 'hand'), game.getZoneByPlayer(leader, 'score'))
          }
        }
      }
      else {
        game.mLog({
          template: '{player} has no bonuses',
          args: { player }
        })
      }
    }
  ],
  echoImpl: [],
}
