const t = require('../../testutil.js')
const {
  GameOverEvent,
  InputRequestEvent,
} = require('../../../lib/game.js')


describe('Globalization', () => {
  test('demand', () => {
    const game = t.fixtureTopCard('Globalization')
    game.testSetBreakpoint('before-first-player', (game) => {
      t.setColor(game, 'dennis', 'yellow', ['Globalization', 'Stem Cells', 'Fermenting'])
      t.setSplay(game, 'dennis', 'yellow', 'up')
      t.setColor(game, 'micah', 'yellow', ['Agriculture', 'Statistics'])
      t.setSplay(game, 'micah', 'yellow', 'left')
    })
    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Dogma.Globalization')

    expect(t.cards(game, 'yellow', 'micah')).toStrictEqual(['Statistics'])
  })

  test('draw and score', () => {
    const game = t.fixtureTopCard('Globalization')
    game.testSetBreakpoint('before-first-player', (game) => {
      t.setColor(game, 'dennis', 'yellow', ['Globalization', 'Stem Cells', 'Fermenting'])
      t.setSplay(game, 'dennis', 'yellow', 'up')
      t.setDeckTop(game, 'base', 6, ['Atomic Theory'])
    })
    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Dogma.Globalization')

    expect(t.cards(game, 'score')).toStrictEqual(['Atomic Theory'])
  })

  test.only('win condition (yes)', () => {
    const game = t.fixtureTopCard('Globalization')
    game.testSetBreakpoint('before-first-player', (game) => {
      t.setColor(game, 'dennis', 'yellow', ['Globalization'])
      t.setSplay(game, 'dennis', 'yellow', 'up')
    })
    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Dogma.Globalization')

    expect(request2).toEqual(expect.any(GameOverEvent))
  })

  test('win condition (no)', () => {
    const game = t.fixtureTopCard('Globalization')
    game.testSetBreakpoint('before-first-player', (game) => {
      t.setColor(game, 'dennis', 'yellow', ['Globalization', 'Stem Cells', 'Fermenting'])
      t.setSplay(game, 'dennis', 'yellow', 'up')
      t.setColor(game, 'micah', 'yellow', ['Agriculture', 'Statistics'])
      t.setSplay(game, 'micah', 'yellow', 'left')
    })
    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Dogma.Globalization')

    expect(request2).toEqual(expect.any(InputRequestEvent))
  })
})
