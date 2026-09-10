Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe('Bicycle', () => {
  test('yes', () => {
    const game = t.fixtureFirstPlayer()
    t.setBoard(game, {
      dennis: {
        green: ['Bicycle'],
        hand: ['Industrialization', 'Tools'],
        score: ['Chemistry'],
      },
    })
    game.run()
    t.choose(game, 'Dogma.Bicycle')
    t.choose(game, 'yes')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        green: ['Bicycle'],
        hand: ['Chemistry'],
        score: ['Industrialization', 'Tools'],
      },
    })

    const entry = game
      .log
      .getLog()
      .find(e => e.template === '{player} exchanges {cards} from {from1} for {cards2} from {from2}')

    expect(entry).toBeTruthy()
    expect(entry.args.from1.value).toBe("dennis's hand")
    expect(entry.args.from2.value).toBe("dennis's score")
    expect(entry.args.cards.value).toBe('card(Industrialization), card(Tools)')
    expect(entry.args.cards2.value).toBe('card(Chemistry)')
  })

  test('no', () => {
    const game = t.fixtureFirstPlayer()
    t.setBoard(game, {
      dennis: {
        green: ['Bicycle'],
        hand: ['Industrialization', 'Tools'],
        score: ['Chemistry'],
      },
    })
    game.run()
    t.choose(game, 'Dogma.Bicycle')
    t.choose(game, 'no')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        green: ['Bicycle'],
        hand: ['Industrialization', 'Tools'],
        score: ['Chemistry'],
      },
    })
  })
})
