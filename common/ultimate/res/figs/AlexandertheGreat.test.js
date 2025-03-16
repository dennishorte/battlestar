Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe('Alexander the Great', () => {

  test('karma: meld-this', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
    game.testSetBreakpoint('before-first-player', (game) => {
      t.setHand(game, 'dennis', ['Alexander the Great'])
      t.setColor(game, 'micah', 'green', ['Hatshepsut'])
      t.setColor(game, 'micah', 'purple', ['Al-Kindi'])
      t.setColor(game, 'micah', 'yellow', ['Cai Lun'])
    })
    let request
    request = game.run()
    request = t.choose(game, request, 'Meld.Alexander the Great')
    request = t.choose(game, request, 'auto')

    t.testZone(game, 'score', ['Hatshepsut', 'Cai Lun'], { sort: true })
  })

  test('karma: featured-biscuit (test 1)', () => {
    const game = t.fixtureTopCard('Alexander the Great', { expansions: ['base', 'figs'] })
    game.testSetBreakpoint('before-first-player', (game) => {
      t.setColor(game, 'dennis', 'blue', ['Atomic Theory'])
      t.setColor(game, 'micah', 'purple', ['Education'])

      t.setScore(game, 'dennis', ['Tools'])

      t.setDeckTop(game, 'base', 7, ['Electricity', 'Bicycle'])
    })
    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Atomic Theory')

    t.testZone(game, 'green', ['Electricity'])
    t.testZone(game, 'green', [], { player: 'micah' })
  })

  test('karma: featured-biscuit (test 2)', () => {
    const game = t.fixtureTopCard('Alexander the Great', { expansions: ['base', 'figs'] })
    game.testSetBreakpoint('before-first-player', (game) => {
      t.setColor(game, 'dennis', 'blue', ['Atomic Theory'])
      t.setColor(game, 'micah', 'purple', ['Education'])

      t.setScore(game, 'micah', ['Calendar'])

      t.setDeckTop(game, 'base', 7, ['Electricity', 'Bicycle'])
    })
    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Atomic Theory')

    t.testZone(game, 'green', ['Bicycle'])
    t.testZone(game, 'green', ['Electricity'], { player: 'micah' })
  })
})
