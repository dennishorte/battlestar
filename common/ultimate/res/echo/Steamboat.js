module.exports = {
  name: `Steamboat`,
  color: `green`,
  age: 6,
  expansion: `echo`,
  biscuits: `h6cc`,
  dogmaBiscuit: `c`,
  echo: ``,
  dogma: [
    `I demand you draw and reveal a {6}! If it is blue or yellow, transfer it and all cards in your hand to my hand! If it is red or green, keep it and transfer two cards from your score pile to mine! If it is purple, keep it!`
  ],
  dogmaImpl: [
    (game, player, { leader }) => {
      const card = game.aDrawAndReveal(player, game.getEffectAge(this, 6))
      if (card) {
        if (card.color === 'blue' || card.color === 'yellow') {
          game.aTransferMany(player, game.getCardsByZone(player, 'hand'), game.getZoneByPlayer(leader, 'hand'))
        }

        else if (card.color === 'red' || card.color === 'green') {
          game.aChooseAndTransfer(player, game.getCardsByZone(player, 'score'), game.getZoneByPlayer(leader, 'score'), { count: 2 })
        }

        else {
          game.mLog({
            template: 'Card was purple. No effect.'
          })
        }
      }
    }
  ],
  echoImpl: [],
}
