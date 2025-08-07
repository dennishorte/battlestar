Error.stackTraceLimit = 100
const t = require('../../testutil.js')
describe('Camouflage', () => {

  test('dogma: draw for special achievements', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'usee'] })
    t.setBoard(game, {
      dennis: {
        red: ['Camouflage'],
        achievements: ['Monument', 'Zen'],
      },
      decks: {
        base: {
          7: ['Lighting'],
        },
        usee: {
          7: ['Black Market'],
        },
      },
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Camouflage')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        red: ['Camouflage'],
        hand: ['Lighting', 'Black Market'],
        achievements: ['Monument', 'Zen'],
      },
    })
  })

  test('dogma: Score secrets', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'usee'] })
    t.setBoard(game, {
      dennis: {
        red: ['Camouflage'],
        safe: ['Archery', 'Tools', 'Masonry', 'Construction'],
      },
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Camouflage')
    request = t.choose(game, request, 'Score secrets')

    t.testChoices(request, ['Archery', 'Tools', 'Masonry'])

    request = t.choose(game, request, 'Tools', 'Masonry')
    request = t.choose(game, request, 'auto')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        red: ['Camouflage'],
        safe: ['Archery', 'Construction'],
        score: ['Tools', 'Masonry'],
      },
    })
  })

  test('dogma: Junk and safeguard', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'usee'] })
    t.setBoard(game, {
      dennis: {
        red: ['Camouflage'],
        purple: ['Lighting'],
        green: ['Paper'],
      },
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Camouflage')
    request = t.choose(game, request, 'Junk and safeguard')
    request = t.choose(game, request, 'auto')
    request = t.choose(game, request, 'auto')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        green: ['Paper'],
        safe: ['Camouflage', 'Lighting'],
      },
    })
  })

})
