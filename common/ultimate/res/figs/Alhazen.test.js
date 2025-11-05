Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe('Alhazen', () => {
  test('echo (test 1)', () => {
    const game = t.fixtureTopCard('Alhazen', { expansions: ['base', 'figs'] })
    game.testSetBreakpoint('before-first-player', (game) => {
      t.setColor(game, 'dennis', 'green', ['The Wheel'])
      t.setColor(game, 'micah', 'red', ['Archery'])
    })
    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Alhazen')

    t.testChoices(request, ['The Wheel', 'Archery'])

    request = t.choose(game, request, 'The Wheel')

    t.testZone(game, 'green', ['The Wheel'])
  })

  test('echo (test 2)', () => {
    const game = t.fixtureTopCard('Alhazen', { expansions: ['base', 'figs'] })
    game.testSetBreakpoint('before-first-player', (game) => {
      t.setColor(game, 'dennis', 'green', ['The Wheel'])
      t.setColor(game, 'micah', 'red', ['Archery'])
    })
    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Alhazen')

    t.testChoices(request, ['The Wheel', 'Archery'])

    request = t.choose(game, request, 'Archery')

    t.testZone(game, 'red', ['Archery'])
  })

  test('karma: draw', () => {
    const game = t.fixtureTopCard('Alhazen', { expansions: ['base', 'figs'] })
    game.testSetBreakpoint('before-first-player', (game) => {
      t.setColor(game, 'dennis', 'red', ['Metalworking', 'Archery', 'Oars'])
      t.setSplay(game, 'dennis', 'red', 'right')
      t.setDeckTop(game, 'base', 5, ['Chemistry'])
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Draw.draw a card')

    t.testZone(game, 'hand', ['Chemistry'])
  })

  test('karma: draw (not splayed)', () => {
    const game = t.fixtureTopCard('Alhazen', { expansions: ['base', 'figs'] })
    game.testSetBreakpoint('before-first-player', (game) => {
      t.setColor(game, 'dennis', 'purple', ['Enterprise'])
      t.setColor(game, 'dennis', 'red', ['Metalworking', 'Archery', 'Oars'])
      t.setDeckTop(game, 'base', 4, ['Experimentation'])
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Draw.draw a card')

    t.testZone(game, 'hand', ['Experimentation'])
  })

  test('karma: inspire', () => {
    const game = t.fixtureTopCard('Alhazen', { expansions: ['base', 'figs'] })
    game.testSetBreakpoint('before-first-player', (game) => {
      t.setColor(game, 'dennis', 'yellow', ['Avicenna', 'Agriculture'])
      t.setSplay(game, 'dennis', 'yellow', 'left')
      t.setColor(game, 'dennis', 'red', ['Metalworking', 'Archery', 'Oars'])
      t.setSplay(game, 'dennis', 'red', 'right')
      t.setDeckTop(game, 'base', 1, ['Domestication'])
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Inspire.yellow')

    t.testZone(game, 'hand', ['Domestication'])
  })

  test('karma: inspire (not splayed)', () => {
    const game = t.fixtureTopCard('Alhazen', { expansions: ['base', 'figs'] })
    game.testSetBreakpoint('before-first-player', (game) => {
      t.setColor(game, 'dennis', 'yellow', ['Avicenna', 'Agriculture'])
      t.setColor(game, 'dennis', 'red', ['Metalworking', 'Archery', 'Oars'])
      t.setSplay(game, 'dennis', 'red', 'right')
      t.setDeckTop(game, 'base', 3, ['Engineering', 'Machinery'])
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Inspire.yellow')

    t.testZone(game, 'hand', ['Machinery'])
  })
})
