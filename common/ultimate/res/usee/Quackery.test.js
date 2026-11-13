Error.stackTraceLimit = 100
const t = require('../../testutil.js')
describe('Quackery', () => {

  test('dogma: score', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'usee'] })
    t.setBoard(game, {
      dennis: {
        blue: ['Quackery'],
        hand: ['Tools', 'Optics'],
      },
    })

    let request
    request = game.run()
    request = t.choose(game, 'Dogma.Quackery')

    const scoreChoice = request.selectors[0].choices.find(c => c.id === 'score')
    expect(scoreChoice.max).toBe(1)

    request = t.choose(game, 'Score.Tools')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        blue: ['Quackery'],
        hand: ['Optics'],
        score: ['Tools']
      },
    })
  })

  test('dogma: cannot score more than one card', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'usee'] })
    t.setBoard(game, {
      dennis: {
        blue: ['Quackery'],
        hand: ['Tools', 'Optics'],
      },
    })

    game.run()
    t.choose(game, 'Dogma.Quackery')

    expect(() => {
      t.choose(game, {
        title: 'Score',
        id: 'score',
        selection: ['Tools', 'Optics'],
      })
    }).toThrow(/Invalid selection/)
  })

  test('dogma: draw', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'usee'] })
    t.setBoard(game, {
      dennis: {
        blue: ['Quackery'],
        hand: ['Tools'],
      },
      decks: {
        base: {
          3: ['Optics'],
        },
        usee: {
          4: ['Blackmail'],
        }
      }
    })

    let request
    request = game.run()
    request = t.choose(game, 'Dogma.Quackery')
    request = t.choose(game, 'Draw a 4')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        blue: ['Quackery'],
        hand: ['Optics']
      },
    })
  })

})
