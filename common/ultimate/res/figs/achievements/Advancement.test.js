Error.stackTraceLimit = 100

const t = require('../../../testutil.js')

describe('Advancement', () => {

  test('basic', () => {
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

  test('get an age 12 card', () => {
    const game = t.fixtureDecrees()
    game.testSetBreakpoint('before-first-player', (game) => {
      t.setColor(game, 'dennis', 'red', ['Astrogeology'])
      t.setScore(game, 'dennis', ['Canning'])
    })

    game.run()
    const request = t.choose(game, 'Decree.Advancement')

    t.testGameOver(request, 'dennis', 'high draw')
  })
})
