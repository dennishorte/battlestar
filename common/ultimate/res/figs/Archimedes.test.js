Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe('Archimedes', () => {
  test('echo (plus karma on echo)', () => {
    const game = t.fixtureTopCard('Archimedes', { expansions: ['base', 'figs'] })
    game.testSetBreakpoint('before-first-player', (game) => {
      t.setDeckTop(game, 'base', 3, ['Machinery']) // Affected by his own karma.
    })
    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Archimedes')
    expect(t.cards(game, 'hand').sort()).toStrictEqual(['Machinery'])
  })

  test('karma: decree', () => {
    t.testDecreeForTwo('Archimedes', 'Advancement')
  })

  test('karma: effect age', () => {
    const game = t.fixtureTopCard('Archimedes', { expansions: ['base', 'figs'] })
    game.testSetBreakpoint('before-first-player', (game) => {
      t.setColor(game, 'dennis', 'green', ['The Wheel'])
      t.setDeckTop(game, 'base', 2, ['Calendar', 'Construction'])
    })
    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.The Wheel')

    expect(t.cards(game, 'hand').sort()).toStrictEqual(['Calendar', 'Construction'])
  })

  test('karma: effect age only triggers at start of action', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs', 'arti'] })
    t.setBoard(game, {
      dennis: {
        blue: ['Charter of Liberties', 'Archimedes'],
        hand: ['Evolution'],
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
    request = t.choose(game, request, 'dogma')

    t.testBoard(game, {
      dennis: {
        blue: ['Archimedes'],
        score: ['Databases'],
      },
    })
  })
})
