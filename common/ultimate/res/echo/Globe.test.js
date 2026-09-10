Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe("Globe", () => {

  test('dogma: do not return', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'echo'] })
    t.setBoard(game,  {
      dennis: {
        green: ['Globe', 'Sailing'],
        hand: ['Candles', 'Paper', 'Mathematics', 'Agriculture'],
      },
    })

    let request
    request = game.run()
    request = t.choose(game, 'Dogma.Globe')
    request = t.choose(game, 'no')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        green: ['Globe', 'Sailing'],
        hand: ['Candles', 'Paper', 'Mathematics', 'Agriculture'],
      },
    })
  })

  test('dogma: return all', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'echo'] })
    t.setBoard(game,  {
      dennis: {
        green: ['Globe', 'Sailing'],
        hand: ['Candles', 'Paper', 'Mathematics', 'Agriculture', 'Perspective'],
      },
      decks: {
        echo: {
          6: ['Steamboat'],
          7: ['Rubber'],
          8: ['Bandage'],
        },
      },
    })

    let request
    request = game.run()
    request = t.choose(game, 'Dogma.Globe')
    request = t.choose(game, 'yes')
    request = t.choose(game, 'Paper', 'Mathematics', 'Agriculture')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        green: {
          cards: ['Globe', 'Sailing'],
          splay: 'right',
        },
        forecast: ['Bandage', 'Rubber', 'Steamboat'],
      },
    })
  })

  test('dogma: return but missing colors', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'echo'] })
    t.setBoard(game,  {
      dennis: {
        green: ['Globe', 'Sailing'],
        hand: ['Candles', 'Paper', 'Agriculture', 'Perspective'],
      },
      decks: {
        echo: {
          6: ['Steamboat'],
          7: ['Rubber'],
          8: ['Bandage'],
        },
      },
    })

    let request
    request = game.run()
    request = t.choose(game, 'Dogma.Globe')
    request = t.choose(game, 'yes')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        green: ['Globe', 'Sailing'],
      },
    })
  })

  test('dogma: foreshadowed board card is named in the log for other players', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'echo'], viewerName: 'micah' })
    t.setBoard(game,  {
      dennis: {
        green: ['Sailing'],
        hand: ['Perspective', 'Paper', 'Mathematics', 'Agriculture'],
        forecast: ['Globe'],
      },
    })

    game.run()
    t.choose(game, 'Meld.Perspective')
    t.choose(game, 'no')
    t.choose(game, 'Perspective')

    const foreshadowed = game
      .log
      .getLog()
      .filter(e => e.template === '{player} foreshadows {card} from {zone}')
      .map(e => e.args.card.value)

    expect(foreshadowed).toEqual(expect.arrayContaining(['Perspective']))
  })

  test('dogma: was foreseen', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'echo'] })
    t.setBoard(game,  {
      dennis: {
        green: ['Sailing'],
        hand: ['Perspective', 'Paper', 'Mathematics', 'Agriculture'],
        forecast: ['Globe'],
      },
    })

    let request
    request = game.run()
    request = t.choose(game, 'Meld.Perspective')
    request = t.choose(game, 'no')
    request = t.choose(game, 'Perspective')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        forecast: ['Perspective'],
        green: ['Globe', 'Sailing'],
        hand: ['Paper', 'Mathematics', 'Agriculture'],
      },
    })
  })

})
