Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe('Flight', () => {
  test('red is not splayed up', () => {
    const game = t.fixtureFirstPlayer()
    t.setBoard(game, {
      dennis: {
        red: ['Flight', 'Archery'],
        blue: ['Experimentation', 'Writing'],
      },
    })
    let request
    request = game.run()
    request = t.choose(game, 'Dogma.Flight')
    t.choose(game, 'red')

    const red = game.zones.byPlayer(t.dennis(game), 'red')
    expect(red.splay).toBe('up')
  })

  test('red is splayed up', () => {
    const game = t.fixtureFirstPlayer()
    t.setBoard(game, {
      dennis: {
        red: {
          cards: ['Flight', 'Archery'],
          splay: 'up',
        },
        blue: ['Experimentation', 'Writing'],
      },
    })
    let request
    request = game.run()
    request = t.choose(game, 'Dogma.Flight')
    t.choose(game, 'blue')

    const blue = game.zones.byPlayer(t.dennis(game), 'blue')
    expect(blue.splay).toBe('up')
  })
})
