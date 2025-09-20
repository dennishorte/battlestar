module.exports = {
  name: `X-Ray`,
  color: `blue`,
  age: 8,
  expansion: `echo`,
  biscuits: `hl&8`,
  dogmaBiscuit: `l`,
  echo: `Draw and tuck an {8}.`,
  dogma: [
    `Choose a value. For every color on your board with {l}, draw a card of that value. Foreshadow any number of them.`,
    `Return all cards from your hand.`,
    `You may splay your yellow cards up.`,
  ],
  dogmaImpl: [
    (game, player) => {
      const age = game.actions.chooseAge(player)
      const count = game.zones.stacksWithBiscuit(player, 'l').length

      const drawn = []
      for (let i = 0; i < count; i++) {
        const card = game.actions.draw(player, { age })
        drawn.push(card)
      }

      game.actions.chooseAndForeshadow(player, drawn, { min: 0, max: drawn.length })
    },

    (game, player) => {
      game.actions.returnMany(player, game.cards.byPlayer(player, 'hand'))
    },

    (game, player) => {
      game.actions.chooseAndSplay(player, ['yellow'], 'up')
    }
  ],
  echoImpl: (game, player, { self }) => {
    game.actions.drawAndTuck(player, game.getEffectAge(self, 8))
  },
}
