Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe('Bartholomew Roberts', () => {
  test('inspire', () => {
    const game = t.fixtureTopCard('Bartholomew Roberts', { expansions: ['base', 'figs'] })
    game.testSetBreakpoint('before-first-player', (game) => {
      t.setColor(game, 'dennis', 'red', ['Oars'])
      t.setColor(game, 'micah', 'green', ['Sailing'])
    })
    let request
    request = game.run()
    request = t.choose(game, request, 'Inspire.green')

    t.testChoices(request, ['Oars', 'Sailing', 'Bartholomew Roberts'])

    request = t.choose(game, request, 'Sailing')

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
    let request
    request = game.run()

    request = t.choose(game, request, 'Dogma.Machine Tools')

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
    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Machine Tools')

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

    let request
    request = game.run()
    request = t.choose(game, request, 'Inspire.green')
    request = t.choose(game, request, 'Skyscrapers')

    t.testIsSecondPlayer(game)
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
