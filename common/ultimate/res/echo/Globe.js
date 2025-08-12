module.exports = {
  name: `Globe`,
  color: `green`,
  age: 4,
  expansion: `echo`,
  biscuits: `f4fh`,
  dogmaBiscuit: `f`,
  echo: [],
  dogma: [
    `You may return all cards in your hand. If you return blue, green, and yellow cards, draw and foreshadow a {6}, {7}, and {8}, then splay any color on your board right.`,
    `If Globe was foreseen, foreshadow a top card from any board.`,
  ],
  dogmaImpl: [
    (game, player, { self }) => {
      const colorCheck = (cards) => {
        const tests = [
          cards.some(c => c.color === 'blue'),
          cards.some(c => c.color === 'green'),
          cards.some(c => c.color === 'yellow'),
        ]
        return tests.every(x => x)
      }

      const returnAll = game.actions.chooseYesNo(player, 'Return all cards in your hand?')
      if (returnAll) {
        const returned = game.actions.returnMany(player, game.cards.byPlayer(player, 'hand'))
        if (colorCheck(returned)) {
          // Prove that all three colors were returned.
          const toProve = returned.filter(x => x.color === 'yellow' || x.color === 'green' || x.color === 'blue')
          const toReveal = game.actions.chooseCards(player, toProve, {
            title: 'Choose a blue, green, and yellow card to reveal',
            count: 3,
            guard: (cards) => colorCheck(cards),
          })
          game.actions.revealMany(player, toReveal, { ordered: true })

          game.actions.drawAndForeshadow(player, game.getEffectAge(self, 6))
          game.actions.drawAndForeshadow(player, game.getEffectAge(self, 7))
          game.actions.drawAndForeshadow(player, game.getEffectAge(self, 8))

          game.actions.chooseAndSplay(player, game.util.colors(), 'right', { count: 1 })
        }
      }
    },

    (game, player, { foreseen, self }) => {
      if (foreseen) {
        game.log.addForeseen(self)
        const cards = game
          .players.all()
          .flatMap(p => game.cards.tops(p))
        game.actions.chooseAndForeshadow(player, cards, { count: 1 })
      }
    },
  ],
  echoImpl: [],
}
