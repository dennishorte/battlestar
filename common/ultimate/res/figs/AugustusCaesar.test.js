Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe('Augustus Caesar', () => {

  test('karma (foreshadow)', () => {
    const game = t.fixtureTopCard('Augustus Caesar', { expansions: ['base', 'figs'] })
    game.testSetBreakpoint('before-first-player', (game) => {
      t.setDeckTop(game, 'base', 3, ['Engineering'])
      t.setColor(game, 'dennis', 'red', ['Archery'])
      t.setForecast(game, 'dennis', ['Construction', 'Tools'])
    })
    let request
    request = game.run()
    request = t.choose(game, request, 'Inspire.green')
    request = t.choose(game, request, 'auto')

    t.testIsSecondPlayer(game)
    t.testZone(game, 'red', ['Engineering', 'Archery', 'Construction'])
    t.testZone(game, 'blue', ['Tools'])
    t.testZone(game, 'forecast', [])
  })

  test('karma (no color match)', () => {
    const game = t.fixtureTopCard('Augustus Caesar', { expansions: ['base', 'figs'] })
    game.testSetBreakpoint('before-first-player', (game) => {
      t.setDeckTop(game, 'base', 3, ['Machinery'])
      t.setColor(game, 'dennis', 'red', ['Archery'])
      t.setForecast(game, 'dennis', ['Tools'])
    })
    let request
    request = game.run()
    request = t.choose(game, request, 'Inspire.green')

    t.testZone(game, 'red', ['Archery'])
    t.testZone(game, 'forecast', ['Machinery', 'Tools'], { sort: true })
  })

  test('karma (no biscuit match)', () => {
    const game = t.fixtureTopCard('Augustus Caesar', { expansions: ['base', 'figs'] })
    game.testSetBreakpoint('before-first-player', (game) => {
      t.setDeckTop(game, 'base', 3, ['Optics'])
      t.setColor(game, 'dennis', 'red', ['Archery'])
      t.setForecast(game, 'dennis', ['Tools'])
    })
    let request
    request = game.run()
    request = t.choose(game, request, 'Inspire.green')

    t.testZone(game, 'red', ['Archery'])
    t.testZone(game, 'forecast', ['Optics', 'Tools'], { sort: true })
  })

  test('karma (other player, using meld)', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
    game.testSetBreakpoint('before-first-player', (game) => {
      t.setColor(game, 'micah', 'red', ['Archery'])
      t.setColor(game, 'micah', 'green', ['Augustus Caesar'])
      t.setForecast(game, 'micah', ['Construction', 'Tools'])
      t.setHand(game, 'dennis', ['The Wheel'])
    })
    let request
    request = game.run()
    request = t.choose(game, request, 'Meld.The Wheel')
    request = t.choose(game, request, 'auto')

    t.testZone(game, 'red', ['Archery', 'Construction'], { player: 'micah' })
    t.testZone(game, 'blue', ['Tools'], { player: 'micah' })
    t.testZone(game, 'green', ['The Wheel', 'Augustus Caesar'], { player: 'micah' })
    t.testZone(game, 'forecast', [], { player: 'micah' })
  })

  test('karma: 3 players', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'], numPlayers: 3 })
    t.setBoard(game, {
      dennis: {
        hand: ['The Wheel'],
      },
      micah: {
        red: ['Archery'],
      },
      scott: {
        green: ['Augustus Caesar'],
      },
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Meld.The Wheel')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      micah: {
        red: ['Archery'],
      },
      scott: {
        green: ['The Wheel', 'Augustus Caesar'],
      },
    })
  })
})
