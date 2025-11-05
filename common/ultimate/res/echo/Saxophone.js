
module.exports = {
  name: `Saxophone`,
  color: `purple`,
  age: 7,
  expansion: `echo`,
  biscuits: `7cm7`,
  dogmaBiscuit: `c`,
  echo: ``,
  dogma: [
    `You may splay your purple cards up.`,
    `If the {m} for Bell, Flute, Piano, and Saxophone are visible anywhere, you win. Otherwise, draw a {7} for each {m} that is visible.`
  ],
  dogmaImpl: [
    (game, player) => {
      game.actions.chooseAndSplay(player, ['purple'], 'up')
    },

    (game, player, { self }) => {
      let count = 0

      for (const player of game.players.all()) {
        for (const color of game.util.colors()) {
          const zone = game.zones.byPlayer(player, color)
          const cards = zone.cardlist()

          // Top card
          if (cards[0] && cards[0].checkHasBiscuit('m')) {
            count += 1
          }

          // Everything else
          count += cards
            .slice(1)
            .filter(card => card.checkHasBiscuit('m'))
            .length
        }
      }

      if (count === 4) {
        game.youWin(player, self.name)
      }
      else {
        for (let i = 0; i < count; i++) {
          game.actions.draw(player, { age: game.getEffectAge(self, 7) })
        }
      }
    },
  ],
  echoImpl: [],
}
