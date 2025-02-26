Error.stackTraceLimit = 100

const t = require('../../../testutil.js')

describe('Wonder Achievement', () => {
  test('achieved', () => {
    const game = t.fixtureFirstPlayer()
    game.testSetBreakpoint('before-first-player', (game) => {
      t.setColor(game, 'dennis', 'red', ['Flight', 'Archery'])
      t.setColor(game, 'dennis', 'yellow', ['Skyscrapers', 'Masonry'])
      t.setColor(game, 'dennis', 'green', ['Corporations', 'Sailing',])
      t.setColor(game, 'dennis', 'blue', ['Rocketry', 'Writing',])
      t.setColor(game, 'dennis', 'purple', ['Mysticism', 'Empiricism'])

      t.setSplay(game, 'dennis', 'yellow', 'right')
      t.setSplay(game, 'dennis', 'green', 'right')
      t.setSplay(game, 'dennis', 'blue', 'up')
      t.setSplay(game, 'dennis', 'purple', 'right')
    })
    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Dogma.Flight')
    const request3 = t.choose(game, request2, 'red')

    expect(t.cards(game, 'achievements')).toStrictEqual(['Wonder'])
  })
})
