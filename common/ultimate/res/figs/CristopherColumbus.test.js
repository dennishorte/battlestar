Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe('Cristopher Columbus', () => {

  test('inspire', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
    t.setBoard(game, {
      dennis: {
        green: ['Cristopher Columbus']
      },
      decks: {
        base: {
          4: ['Perspective', 'Invention'],
        }
      }
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Inspire.green')

    t.testBoard(game, {
      dennis: {
        green: ['Cristopher Columbus'],
        hand: ['Perspective', 'Invention']
      },
    })
  })

  test('karma: decree', () => {
    t.testDecreeForTwo('Cristopher Columbus', 'Trade')
  })

  test('karma: biscuits', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
    t.setBoard(game, {
      dennis: {
        purple: ['Code of Laws'],
        green: ['Cristopher Columbus'],
        red: ['Coal']
      },
    })

    let request
    request = game.run()

    const biscuits = game.getBiscuitsByPlayer(t.dennis(game))
    expect(biscuits).toEqual({
      l: 2,
      f: 3,
      c: 8,
      k: 0,
      i: 0,
      s: 0,
    })
  })
})
