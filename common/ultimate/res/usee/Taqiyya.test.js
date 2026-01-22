Error.stackTraceLimit = 100
const t = require('../../testutil.js')
describe('Taqiyya', () => {

  test('dogma: draw is not bottom', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'usee'] })
    t.setBoard(game, {
      dennis: {
        purple: ['Taqiyya'],
        blue: ['Experimentation', 'Tools'],
      },
      decks: {
        usee: {
          3: ['Masquerade'],
        },
      },
    })

    let request
    request = game.run()
    request = t.choose(game, 'Dogma.Taqiyya')
    request = t.choose(game, 'blue')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        purple: ['Masquerade', 'Taqiyya'],
        hand: ['Experimentation', 'Tools'],
      },
    })
  })

  test('dogma: Melded card is bottom', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'usee'] })
    t.setBoard(game, {
      dennis: {
        purple: ['Taqiyya'],
        blue: ['Experimentation', 'Tools'],
        hand: ['Optics'],
      },
      decks: {
        usee: {
          3: ['Knights Templar'],
        },
      },
    })

    let request
    request = game.run()
    request = t.choose(game, 'Dogma.Taqiyya')
    request = t.choose(game, 'blue')
    request = t.choose(game, 'Optics')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        purple: ['Taqiyya'],
        hand: ['Experimentation', 'Tools'],
        score: ['Knights Templar', 'Optics'],
      },
    })
  })

})
