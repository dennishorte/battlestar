Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe('Hedy Lamar', () => {

  test('echo', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
    t.setBoard(game, {
      dennis: {
        red: {
          cards: ['Coal', 'Archery'],
          splay: 'left'
        },
        blue: ['Mathematics', 'Tools'],
        green: ['Hedy Lamar'],
      },
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Hedy Lamar')

    t.testChoices(request, ['red', 'blue'])

    request = t.choose(game, request, 'blue')

    t.testBoard(game, {
      dennis: {
        red: {
          cards: ['Coal', 'Archery'],
          splay: 'left'
        },
        blue: {
          cards: ['Mathematics', 'Tools'],
          splay: 'up'
        },
        green: ['Hedy Lamar'],
      },
    })
  })

  test('karma: decree', () => {
    t.testDecreeForTwo('Hedy Lamar', 'Trade')
  })

  describe('karma: achievements', () => {

    test('Empire', () => {
      const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
      t.setBoard(game, {
        dennis: {
          red: {
            cards: ['Mobility', 'Road Building', 'Coal'],
            splay: 'left'
          },  // ffikk
          yellow: {
            cards: ['Skyscrapers', 'Agriculture'],
            splay: 'right'
          }, // ccfl
          blue: ['Experimentation'], // sss
          purple: ['Code of Laws'], // ccl
          hand: ['Hedy Lamar'], // ii
        },
      })

      let request
    request = game.run()
      request = t.choose(game, request, 'Meld.Hedy Lamar')

      t.testBoard(game, {
        dennis: {
          red: {
            cards: ['Mobility', 'Road Building', 'Coal'],
            splay: 'left'
          },  // ffikk
          yellow: {
            cards: ['Skyscrapers', 'Agriculture'],
            splay: 'right'
          }, // ccfl
          green: ['Hedy Lamar'], // ii
          blue: ['Experimentation'], // sss
          purple: ['Code of Laws'], // ccl
          achievements: ['Empire'],
        },
      })
    })

    test('Empire, one less kind of biscuit (f)', () => {
      const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
      t.setBoard(game, {
        dennis: {
          red: {
            cards: ['Road Building', 'Mobility'],
            splay: 'left'
          },  // fkkk
          yellow: {
            cards: ['Skyscrapers', 'Agriculture'],
            splay: 'right'
          }, // ccfl
          blue: ['Experimentation'], // sss
          purple: ['Code of Laws'], // ccl
          hand: ['Hedy Lamar'], // ii
        },
      })

      let request
    request = game.run()
      request = t.choose(game, request, 'Meld.Hedy Lamar')

      t.testBoard(game, {
        dennis: {
          red: {
            cards: ['Road Building', 'Mobility'],
            splay: 'left'
          },  // fkkk
          yellow: {
            cards: ['Skyscrapers', 'Agriculture'],
            splay: 'right'
          }, // ccfl
          green: ['Hedy Lamar'], // ii
          blue: ['Experimentation'], // sss
          purple: ['Code of Laws'], // ccl
          achievements: ['Empire'],
        },
      })
    })

    test.skip('other achievements', () => {

    })

  })
})
