Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe('Collaboration', () => {
  test('demand', () => {
    const game = t.fixtureFirstPlayer()
    t.setBoard(game, {
      dennis: {
        green: ['Collaboration'],
      },
      decks: {
        base: {
          9: ['Computers', 'Services'],
        },
      },
    })
    const result1 = game.run()
    const result2 = t.choose(game, 'Dogma.Collaboration')
    const result3 = t.choose(game, 'Computers')

    expect(t.cards(game, 'blue')).toEqual(['Computers'])
    expect(t.cards(game, 'purple', 'micah')).toEqual(['Services'])
  })

  test('win condition (10)', () => {
    const game = t.fixtureFirstPlayer()
    t.setBoard(game, {
      dennis: {
        green: ['Collaboration', 'Mapmaking', 'Banking', 'Navigation', 'Databases', 'Sailing', 'Paper', 'Satellites', 'Clothing', 'Currency'],
      },
      decks: {
        base: {
          9: ['Computers', 'Services'],
        },
      },
    })
    const result1 = game.run()
    const result2 = t.choose(game, 'Dogma.Collaboration')
    const result3 = t.choose(game, 'Computers')

    t.testGameOver(result3, 'dennis', 'Collaboration')
  })
})
