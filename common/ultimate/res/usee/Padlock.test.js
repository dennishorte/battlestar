Error.stackTraceLimit = 100
const t = require('../../testutil.js')
describe('Padlock', () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'usee'] })
    t.setBoard(game, {
      dennis: {
        red: ['Padlock'],
        hand: ['Tools', 'Myth', 'Construction', 'Optics'],
      },
      micah: {
        safe: ['Domestication'],
      },
      achievements: [],
    })

    let request
    request = game.run()
    request = t.choose(game, 'Dogma.Padlock')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        red: ['Padlock'],
        hand: ['Tools', 'Myth', 'Construction', 'Optics'],
      },
      micah: {
        safe: [],
      },
    })

    expect(game.zones.byId('achievements').cardlist().map(c => c.name)).toContain('Domestication')
  })

  test('dogma: no secrets', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'usee'] })
    t.setBoard(game, {
      dennis: {
        red: ['Padlock'],
        hand: ['Tools', 'Myth', 'Construction', 'Optics'],
      },
    })

    let request
    request = game.run()

    const numberOfAchievements = game.zones.byId('achievements').cardlist().length

    request = t.choose(game, 'Dogma.Padlock')
    request = t.choose(game, 'Tools', 'Myth')  // Choose invalid items on purpose.
    request = t.choose(game, 'Tools', 'Construction', 'Optics')
    request = t.choose(game, 'auto')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        red: ['Padlock'],
        hand: ['Myth'],
        score: ['Tools', 'Construction', 'Optics'],
      },
      micah: {
        safe: [],
      },
    })

    expect(game.zones.byId('achievements').cardlist().length).toBe(numberOfAchievements)
  })

})
