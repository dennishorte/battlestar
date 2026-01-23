Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe('Queen Victoria', () => {

  test('karma: decree', () => {
    t.testDecreeForTwo('Queen Victoria', 'Rivalry')
  })

  describe('If you would score a card, first choose a figure in any score pile. Choose to either score it or transfer it to the available achievements.', () => {
    test('karma: score card, choose figure from own score pile and score it', () => {
      const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
      t.setBoard(game, {
        dennis: {
          purple: ['Queen Victoria'],
          yellow: ['Agriculture'], // Card with score effect
          hand: ['Tools'], // Card to return
          score: ['Carl Friedrich Gauss', 'Archimedes'], // Figures in score pile
        },
        decks: {
          base: {
            2: ['Mathematics'], // Card drawn and scored after returning Tools
          },
        },
      })

      let request
      request = game.run()
      request = t.choose(game, 'Dogma.Agriculture')
      request = t.choose(game, 'Tools') // Return Tools
      // Karma triggers: choose figure from score pile (before scoring Mathematics)
      request = t.choose(game, 'Carl Friedrich Gauss')
      request = t.choose(game, 'score it')
      // Now Mathematics is scored (from Agriculture effect)

      t.testIsSecondPlayer(game)
      t.testBoard(game, {
        dennis: {
          purple: ['Queen Victoria'],
          yellow: ['Agriculture'],
          score: ['Carl Friedrich Gauss', 'Mathematics', 'Archimedes'], // Carl Friedrich Gauss scored, Mathematics drawn and scored
          hand: [],
        },
      })
    })

    test('karma: score card, choose figure from opponent score pile and score it', () => {
      const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
      t.setBoard(game, {
        dennis: {
          purple: ['Queen Victoria'],
          yellow: ['Agriculture'], // Card with score effect
          hand: ['Tools'], // Card to return
          score: ['Archimedes'], // Figure in own score pile (to force selection)
        },
        micah: {
          score: ['Carl Friedrich Gauss'], // Figure in opponent's score pile
        },
        decks: {
          base: {
            2: ['Mathematics'], // Card drawn and scored after returning Tools
          },
        },
      })

      let request
      request = game.run()
      request = t.choose(game, 'Dogma.Agriculture')
      request = t.choose(game, 'Tools') // Return Tools
      // Karma triggers: choose figure from any score pile (both dennis and micah have figures)
      // Opponent's figure is shown as "**figs-6* (micah)" where 6 is the age
      request = t.choose(game, '**figs-6* (micah)')
      request = t.choose(game, 'score it')
      // Now Mathematics is scored (from Agriculture effect)

      t.testIsSecondPlayer(game)
      t.testBoard(game, {
        dennis: {
          purple: ['Queen Victoria'],
          yellow: ['Agriculture'],
          score: ['Carl Friedrich Gauss', 'Mathematics', 'Archimedes'], // Carl Friedrich Gauss scored from opponent, Mathematics drawn and scored
          hand: [],
        },
        micah: {
          score: [], // Carl Friedrich Gauss transferred to dennis
        },
      })
    })

    test('karma: score card, no figures in score piles, proceeds normally', () => {
      const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
      t.setBoard(game, {
        dennis: {
          purple: ['Queen Victoria'],
          yellow: ['Agriculture'], // Card with score effect
          hand: ['Tools'], // Card to return
          score: ['The Wheel'], // No figures, just regular card
        },
        micah: {
          score: ['Construction'], // No figures, just regular card
        },
        decks: {
          base: {
            2: ['Mathematics'], // Card drawn and scored after returning Tools
          },
        },
      })

      let request
      request = game.run()
      request = t.choose(game, 'Dogma.Agriculture')
      request = t.choose(game, 'Tools') // Return Tools
      // Karma triggers but no figures available, so proceeds normally
      // Mathematics is scored (from Agriculture effect)

      t.testIsSecondPlayer(game)
      t.testBoard(game, {
        dennis: {
          purple: ['Queen Victoria'],
          yellow: ['Agriculture'],
          score: ['The Wheel', 'Mathematics'], // Mathematics drawn and scored normally
          hand: [],
        },
        micah: {
          score: ['Construction'],
        },
      })
    })

  })

})
