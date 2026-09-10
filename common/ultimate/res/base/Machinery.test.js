Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe('Machinery', () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer()
    t.setBoard(game, {
      dennis: {
        yellow: ['Machinery'],
        red: ['Archery', 'Oars'],
        hand: ['Tools', 'The Wheel', 'Fermenting', 'Engineering'],
      },
      micah: {
        hand: ['Sailing', 'Calendar', 'Paper'],
      },
    })

    let request
    request = game.run()
    request = t.choose(game, 'Dogma.Machinery')
    request = t.choose(game, 'The Wheel')
    request = t.choose(game, 'red')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        yellow: ['Machinery'],
        red: {
          cards: ['Archery', 'Oars'],
          splay: 'left'
        },
        hand: ['Tools', 'Fermenting', 'Sailing', 'Calendar', 'Paper'],
        score: ['The Wheel'],
      },
      micah: {
        hand: ['Engineering'],
      },
    })
  })

  test('dogma: log names the exchanged cards', () => {
    const game = t.fixtureFirstPlayer()
    t.setBoard(game, {
      dennis: {
        yellow: ['Machinery'],
        hand: ['Writing', 'Engineering'],
      },
      micah: {
        hand: ['Sailing', 'Calendar'],
      },
    })

    game.run()
    t.choose(game, 'Dogma.Machinery')

    const entry = game
      .log
      .getLog()
      .find(e => e.template === '{player} exchanges {cards} from {from1} for {cards2} from {from2}')

    expect(entry).toBeTruthy()
    expect(entry.args.from1.value).toBe("micah's hand")
    expect(entry.args.from2.value).toBe("dennis's hand")
    expect(entry.args.cards.value).toBe('card(Sailing), card(Calendar)')
    expect(entry.args.cards2.value).toBe('card(Engineering)')
    expect(entry.redacted).toBe('{player} exchanges {count1} cards from {from1} for {count2} cards from {from2}')
    expect(entry.visibility).toEqual(['micah', 'dennis'])
  })
})
