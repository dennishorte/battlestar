Error.stackTraceLimit = 100

const t = require('../../../testutil.js')

test('Advancement', () => {
  const game = t.fixtureDecrees()
  game.testSetBreakpoint('before-first-player', (game) => {
    t.setColor(game, 'dennis', 'red', ['Industrialization'])
    t.setColor(game, 'dennis', 'purple', ['Monotheism'])
    t.setDeckTop(game, 'base', 8, ['Flight'])
  })

  game.run()
  t.choose(game, 'Decree.Advancement')

  t.testIsSecondPlayer(game)
  t.testBoard(game, {
    dennis: {
      red: ['Industrialization'],
      purple: ['Monotheism'],
      hand: ['Flight'], // Drew Flight from age 8 (highest top card age 6 + 2)
      achievements: ['Advancement'], // Decree claimed as achievement
    },
  })
})
