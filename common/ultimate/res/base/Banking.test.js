Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe('Banking', () => {
  test('card with a factory', () => {
    const game = t.fixtureFirstPlayer()
    t.setBoard(game, {
      dennis: {
        green: ['Banking'],
      },
      micah: {
        red: ['Industrialization'],
        blue: ['Chemistry'],
      },
      decks: {
        base: {
          5: ['Statistics'],
        },
      },
    })
    game.run()
    const result2 = t.choose(game, 'Dogma.Banking')

    expect(result2.selectors[0]).toEqual(expect.objectContaining({
      actor: 'micah',
      choices: expect.arrayContaining(['Industrialization', 'Chemistry'])
    }))

    t.choose(game, 'Chemistry')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        green: ['Banking'],
        blue: ['Chemistry'],
      },
      micah: {
        red: ['Industrialization'],
        score: ['Statistics'],
      },
    })
  })

  test('no draw and score if no card', () => {
    const game = t.fixtureFirstPlayer()
    t.setBoard(game, {
      dennis: {
        green: ['Banking'],
      },
    })
    game.run()
    t.choose(game, 'Dogma.Banking')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        green: ['Banking'],
      },
    })
  })

  test('splay', () => {
    const game = t.fixtureFirstPlayer()
    t.setBoard(game, {
      dennis: {
        green: ['Banking', 'The Wheel', 'Mapmaking'],
      },
    })
    game.run()
    const result2 = t.choose(game, 'Dogma.Banking')

    expect(result2.selectors[0].choices).toEqual(['green'])
    expect(result2.selectors[0].min).toBe(0)
  })
})
