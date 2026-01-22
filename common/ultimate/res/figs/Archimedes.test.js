Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe('Archimedes', () => {
  test('karma: decree', () => {
    t.testDecreeForTwo('Archimedes', 'Advancement')
  })

  test('karma: effect age', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
    t.setBoard(game, {
      dennis: {
        blue: ['Archimedes'],
        green: ['The Wheel'],
        hand: [],
      },
      decks: {
        base: {
          2: ['Calendar', 'Construction'], // The Wheel draws {1}, karma increases to {2}, so draws these
        }
      }
    })
    let request
    request = game.run()
    request = t.choose(game, 'Dogma.The Wheel')

    expect(t.cards(game, 'hand').sort()).toStrictEqual(['Calendar', 'Construction'])
  })

  test('karma: effect age only triggers at start of action', () => {
    // The effect age only triggers at start of action, so if Archimedes is uncovered mid-action,
    // it doesn't change anything during the action.
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs', 'arti'] })
    t.setBoard(game, {
      dennis: {
        blue: ['Translation', 'Archimedes'], // Archimedes is on board but not a top card choice
        hand: ['Lighting'], // Lighting is age 7, sum = 10 - only one hand card so auto-selects
        artifact: ['Kilogram of the Archives'],
      },
      decks: {
        base: {
          10: ['Databases'],
        }
      }
    })

    let request
    request = game.run()
    request = t.choose(game, 'dogma') // Choose to activate artifact dogma
    // Kilogram's dogma asks to return cards - when there's only one option in each category, it auto-selects
    // Sum is 10 (Engineering age 3 + Lighting age 7), so draws and scores a {10} (Databases)
    // Since karma only triggers at START of action (not during), the {10} stays {10}, not {11}

    t.testBoard(game, {
      dennis: {
        blue: ['Archimedes'],
        score: ['Databases'],
        museum: ['Kilogram of the Archives', 'Museum 1'],
      },
    })
  })
})
