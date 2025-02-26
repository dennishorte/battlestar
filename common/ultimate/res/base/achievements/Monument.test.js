Error.stackTraceLimit = 100

const t = require('../../../testutil.js')

describe('Monument achievement', () => {

  test('tuck five', () => {
    const game = t.fixtureFirstPlayer()
    game.testSetBreakpoint('before-first-player', (game) => {
      t.setColor(game, 'dennis', 'blue', ['Pottery', 'Calendar'])  // 5
      t.setSplay(game, 'dennis', 'blue', 'up')

      t.setColor(game, 'dennis', 'purple', ['Reformation']) // 3
      t.setSplay(game, 'dennis', 'purple', 'up')

      t.setColor(game, 'dennis', 'yellow', ['Agriculture']) // 3

      t.setHand(game, 'dennis', [
        'Bioengineering',
        'Software',
        'Self Service',
        'Databases',
        'Globalization',
      ])
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Dogma.Reformation')
    const request3 = t.choose(game, request2, 'yes')
    const request4 = t.choose(game, request3, 'auto')

    expect(t.cards(game, 'achievements')).toStrictEqual([])
  })

  test('tuck six', () => {
    const game = t.fixtureFirstPlayer()
    game.testSetBreakpoint('before-first-player', (game) => {
      t.setColor(game, 'dennis', 'blue', ['Pottery', 'Calendar'])  // 5
      t.setSplay(game, 'dennis', 'blue', 'up')

      t.setColor(game, 'dennis', 'purple', ['Reformation', 'Lighting']) // 5
      t.setSplay(game, 'dennis', 'purple', 'up')

      t.setColor(game, 'dennis', 'yellow', ['Agriculture']) // 3

      t.setHand(game, 'dennis', [
        'Bioengineering',
        'Software',
        'Self Service',
        'Databases',
        'Globalization',
        'Stem Cells',
      ])
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Dogma.Reformation')
    const request3 = t.choose(game, request2, 'yes')
    const request4 = t.choose(game, request3, 'auto')

    expect(t.cards(game, 'achievements')).toStrictEqual(['Monument'])
  })

  test('score five', () => {
    const game = t.fixtureTopCard('Metalworking')
    game.testSetBreakpoint('before-first-player', (game) => {
      t.setDeckTop(game, 'base', 1, [
        'Archery',
        'Oars',
        'Tools',
        'The Wheel',
        'City States',
        'Code of Laws',
      ])
    })
    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Dogma.Metalworking')

    expect(t.cards(game, 'achievements')).toStrictEqual([])
  })

  test('score six', () => {
    const game = t.fixtureTopCard('Metalworking')
    game.testSetBreakpoint('before-first-player', (game) => {
      t.setDeckTop(game, 'base', 1, [
        'Archery',
        'Oars',
        'Tools',
        'The Wheel',
        'City States',
        'Mysticism',
        'Code of Laws',
      ])
    })
    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Dogma.Metalworking')

    expect(t.cards(game, 'achievements')).toStrictEqual(['Monument'])
  })
})
