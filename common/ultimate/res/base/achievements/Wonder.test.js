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
    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Flight')
    request = t.choose(game, request, 'red')

    expect(t.cards(game, 'achievements')).toEqual(['Wonder'])
  })
})
