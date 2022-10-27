Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe('Bartholomew Roberts', () => {
  test('inspire', () => {
    const game = t.fixtureTopCard('Bartholomew Roberts', { expansions: ['base', 'figs'] })
    game.testSetBreakpoint('before-first-player', (game) => {
      t.setColor(game, 'dennis', 'red', ['Oars'])
      t.setColor(game, 'micah', 'green', ['Sailing'])
    })
    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Inspire.green')

    t.testChoices(request2, ['Oars', 'Sailing', 'Bartholomew Roberts'])

    const request3 = t.choose(game, request2, 'Sailing')

    t.testZone(game, 'score', ['Sailing'])
  })

  test('karma (success)', () => {
    const game = t.fixtureTopCard('Bartholomew Roberts', { expansions: ['base', 'figs'] })
    game.testSetBreakpoint('before-first-player', (game) => {
      t.setColor(game, 'dennis', 'red', ['Machine Tools'])
      t.setScore(game, 'dennis', ['Canning', 'Atomic Theory', 'Metric System', 'Encyclopedia', 'Industrialization'])
      t.setDeckTop(game, 'base', 6, ['Vaccination'])
      t.setAvailableAchievements(game, ['Societies', 'Classification', 'Lighting'])
    })
    const request1 = game.run()

    const request2 = t.choose(game, request1, 'Dogma.Machine Tools')

    t.testZone(game, 'score', ['Canning', 'Atomic Theory', 'Metric System', 'Encyclopedia', 'Industrialization', 'Vaccination'])
    t.testZone(game, 'achievements', ['Classification'])
  })

  test('karma (point restriction)', () => {
    const game = t.fixtureTopCard('Bartholomew Roberts', { expansions: ['base', 'figs'] })
    game.testSetBreakpoint('before-first-player', (game) => {
      t.setColor(game, 'dennis', 'red', ['Machine Tools'])
      t.setScore(game, 'dennis', ['Canning', 'Atomic Theory', 'Encyclopedia'])
      t.setDeckTop(game, 'base', 6, ['Vaccination'])
      t.setAvailableAchievements(game, ['Societies', 'Classification', 'Lighting'])
    })
    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Dogma.Machine Tools')

    t.testZone(game, 'score', ['Canning', 'Atomic Theory', 'Encyclopedia', 'Vaccination'])
    t.testZone(game, 'achievements', [])
  })

  test('karma (ignore age restriction)', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
    t.setBoard(game,  {
      dennis: {
        green: ['Bartholomew Roberts'],
        score: ['Software', 'Robotics', 'Databases', 'Bioengineering'],
      },
      micah: {
        yellow: ['Skyscrapers'],
      },
      decks: {
        base: {
          5: ['Measurement'],
        }
      },
      achievements: ['Mobility'],
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Inspire.green')
    const request3 = t.choose(game, request2, 'Skyscrapers')

    t.testIsSecondPlayer(request3)
    t.testBoard(game, {
      dennis: {
        green: ['Bartholomew Roberts'],
        score: ['Software', 'Robotics', 'Databases', 'Bioengineering', 'Skyscrapers'],
        hand: ['Measurement'],
        achievements: ['Mobility'],
      },
      micah: {
        yellow: [],
      },
    })

  })
})
