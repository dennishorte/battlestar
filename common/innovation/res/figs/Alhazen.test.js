Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe('Alhazen', () => {
  test('echo (test 1)', () => {
    const game = t.fixtureTopCard('Alhazen', { expansions: ['base', 'figs'] })
    game.testSetBreakpoint('before-first-player', (game) => {
      t.setColor(game, 'dennis', 'green', ['The Wheel'])
      t.setColor(game, 'micah', 'red', ['Archery'])
    })
    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Dogma.Alhazen')

    t.testChoices(request2, ['The Wheel', 'Archery'])

    const request3 = t.choose(game, request2, 'The Wheel')

    t.testZone(game, 'green', ['The Wheel'])
  })

  test('echo (test 2)', () => {
    const game = t.fixtureTopCard('Alhazen', { expansions: ['base', 'figs'] })
    game.testSetBreakpoint('before-first-player', (game) => {
      t.setColor(game, 'dennis', 'green', ['The Wheel'])
      t.setColor(game, 'micah', 'red', ['Archery'])
    })
    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Dogma.Alhazen')

    t.testChoices(request2, ['The Wheel', 'Archery'])

    const request3 = t.choose(game, request2, 'Archery')

    t.testZone(game, 'red', ['Archery'])
  })

  test('karma: draw', () => {
    const game = t.fixtureTopCard('Alhazen', { expansions: ['base', 'figs'] })
    game.testSetBreakpoint('before-first-player', (game) => {
      t.setColor(game, 'dennis', 'red', ['Metalworking', 'Archery', 'Oars'])
      t.setSplay(game, 'dennis', 'red', 'right')
      t.setDeckTop(game, 'base', 5, ['Chemistry'])
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Draw.draw a card')

    t.testZone(game, 'hand', ['Chemistry'])
  })

  test('karma: draw (not splayed)', () => {
    const game = t.fixtureTopCard('Alhazen', { expansions: ['base', 'figs'] })
    game.testSetBreakpoint('before-first-player', (game) => {
      t.setColor(game, 'dennis', 'purple', ['Enterprise'])
      t.setColor(game, 'dennis', 'red', ['Metalworking', 'Archery', 'Oars'])
      t.setDeckTop(game, 'base', 4, ['Experimentation'])
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Draw.draw a card')

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

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Inspire.yellow')

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

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Inspire.yellow')

    t.testZone(game, 'hand', ['Machinery'])
  })
})
