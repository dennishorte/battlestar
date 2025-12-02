Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe('Amina Sukhera', () => {

  describe('If you would dogma a card as your second action, first score a figure from an opponent\'s hand.', () => {
    test('karma: dogma as second action, score figure from opponent hand', () => {
      const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
      t.setBoard(game, {
        dennis: {
          hand: ['Peter the Great'], // Peter the Great is a figure
        },
        micah: {
          red: ['Amina Sukhera'],
          blue: ['Writing'],
        },
        decks: {
          base: {
            1: ['Tools'],
            2: ['Calendar', 'Mapmaking'], // For Writing dogma effect (Writing draws a {2})
          },
        },
      })

      let request
      request = game.run()
      // First action of first round: Draw (first round only has one action)
      request = t.choose(game, request, 'Draw.draw a card')  // Tools
      request = t.choose(game, request, 'Dogma.Writing')
      request = t.choose(game, request, 'Dogma.Writing')

      t.testBoard(game, {
        dennis: {
          hand: ['Tools'],
        },
        micah: {
          red: ['Amina Sukhera'],
          blue: ['Writing'],
          hand: ['Calendar', 'Mapmaking'],
          score: ['Peter the Great'],
        },
      })
    })

    test('karma: no figures in opponent hands, dogma proceeds normally', () => {
      const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
      t.setBoard(game, {
        dennis: {},
        micah: {
          red: ['Amina Sukhera'],
          blue: ['Writing'],
        },
        decks: {
          base: {
            1: ['Tools'],
            2: ['Calendar', 'Mapmaking'], // For Writing dogma effect (Writing draws a {2})
          },
        },
      })

      let request
      request = game.run()
      // First action of first round: Draw (first round only has one action)
      request = t.choose(game, request, 'Draw.draw a card')  // Tools
      request = t.choose(game, request, 'Dogma.Writing')
      request = t.choose(game, request, 'Dogma.Writing')

      t.testBoard(game, {
        dennis: {
          hand: ['Tools'],
        },
        micah: {
          red: ['Amina Sukhera'],
          blue: ['Writing'],
          hand: ['Calendar', 'Mapmaking'],
        },
      })
    })
  })

  test('karma: list-achievements', () => {
    const game = t.fixtureTopCard('Amina Sukhera', { expansions: ['base', 'figs'] })
    game.testSetBreakpoint('before-first-player', (game) => {
      t.setAvailableAchievements(game, ['Code of Laws'])
      t.setColor(game, 'dennis', 'green', ['The Wheel'])
      t.setColor(game, 'dennis', 'yellow', ['Fermenting'])
      t.setScore(game, 'dennis', ['Statistics'])
    })
    let request
    request = game.run()

    t.testActionChoices(request, 'Achieve', ['*base-1*', 'The Wheel'])
  })
})
