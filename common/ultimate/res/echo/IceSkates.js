module.exports = {
  name: `Ice Skates`,
  color: `green`,
  age: 1,
  expansion: `echo`,
  biscuits: `kchc`,
  dogmaBiscuit: `c`,
  echo: [],
  dogma: [
    `If Ice Skates was foreseen, junk all cards in the 1 deck and 2 deck.`,
    `Return up to two cards from your hand. For each card returned, either draw and meld a {2}, or draw and foreshadow a {3}. Return your highest top card.`
  ],
  dogmaImpl: [
    (game, player, { foreseen, self }) => {
      if (foreseen) {
        game.mLogWasForeseen(self)
        game.aJunkDeck(player, 1)
        game.aJunkDeck(player, 2)
      }
      else {
        game.log.addNoEffect()
      }
    },
    (game, player) => {
      const returned = game.actions.chooseAndReturn(player, game.cards.byPlayer(player, 'hand'), { min: 0, max: 2 })

      if (returned) {
        for (let i = 0; i < returned.length; i++) {
          const choice = game.actions.choose(player, [
            'draw and meld a {2}',
            'draw and foreshadow a {3}',
          ])[0]

          if (choice.includes('meld')) {
            game.actions.drawAndMeld(player, game.getEffectAge(this, 2))
          }
          else {
            game.actions.drawAndForeshadow(player, game.getEffectAge(this, 3))
          }
        }
      }

      const choices = game.utilHighestCards(game.cards.tops(player))
      game.actions.chooseAndReturn(player, choices)
    }
  ],
  echoImpl: [],
}
