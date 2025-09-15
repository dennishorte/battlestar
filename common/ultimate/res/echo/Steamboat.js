module.exports = {
  name: `Steamboat`,
  color: `green`,
  age: 6,
  expansion: `echo`,
  biscuits: `h6cc`,
  dogmaBiscuit: `c`,
  echo: ``,
  dogma: [
    `I demand you draw and reveal a {6}! If it is blue or yellow, transfer it and all cards in your hand to my hand! If it is red or green, keep it and transfer two cards from your score pile to mine!`
  ],
  dogmaImpl: [
    (game, player, { leader, self }) => {
      const card = game.actions.drawAndReveal(player, game.getEffectAge(self, 6))
      if (card) {
        if (card.color === 'blue' || card.color === 'yellow') {
          game.actions.transferMany(player, game.cards.byPlayer(player, 'hand'), game.zones.byPlayer(leader, 'hand'))
        }

        else if (card.color === 'red' || card.color === 'green') {
          game.actions.chooseAndTransfer(player, game.cards.byPlayer(player, 'score'), game.zones.byPlayer(leader, 'score'), { count: 2 })
        }

        else {
          game.log.add({
            template: 'Card was purple. No effect.'
          })
        }
      }
    }
  ],
  echoImpl: [],
}
