Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe("Toilet", () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'echo'] })
    t.setBoard(game,  {
      dennis: {
        purple: ['Toilet'],
        red: ['Plumbing'],
        blue: ['Perfume'],
        hand: ['Machinery'],
      },
      micah: {
        score: ['Sailing', 'Masonry', 'Calendar', 'Translation'],
      },
      decks: {
        echo: {
          3: ['Liquid Fire'],
          4: ['Shuriken'],
        }
      }
    })

    let request
    request = game.run()
    request = t.choose(game, 'Dogma.Toilet')
    request = t.choose(game, 'Masonry')
    request = t.choose(game, 'Machinery')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        purple: ['Toilet'],
        red: ['Plumbing', 'Shuriken'],
        blue: ['Perfume'],
        hand: ['Liquid Fire'],
      },
      micah: {
        score: ['Sailing', 'Translation'],
      },
    })
  })

  test('dogma: no matching bonus leaves the score pile unrevealed', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'echo'] })
    t.setBoard(game,  {
      dennis: {
        purple: ['Toilet'],
        red: ['Plumbing'],
      },
      micah: {
        score: ['Sailing', 'Translation'],
      },
      decks: {
        echo: {
          4: ['Shuriken'],
        }
      }
    })

    let request
    request = game.run()
    request = t.choose(game, 'Dogma.Toilet')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        purple: ['Toilet'],
        red: ['Plumbing', 'Shuriken'],
      },
      micah: {
        score: ['Sailing', 'Translation'],
      },
    })

    const micah = game.players.byName('micah')
    const score = game.cards.byPlayer(micah, 'score')
    expect(score.every(card => !card.revealed())).toBe(true)

    const proofs = game.log.getLog().filter(e =>
      e.template && (
        e.template.includes('shows the backs')
        || e.template.includes('no valid card')
      )
    )
    expect(proofs).toEqual([])
  })
})
