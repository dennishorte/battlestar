Error.stackTraceLimit = 100
const t = require('../../testutil.js')
describe('Enigma Machine', () => {

  test('dogma: safeguard all', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'usee'] })
    t.setBoard(game, {
      dennis: {
        red: ['Enigma Machine'],
        safe: ['Mathematics', 'Coal'],
        hand: ['Monotheism', 'Canning'],
      },
      achievements: ['Tools', 'Optics'],
    })

    let request
    request = game.run()
    request = t.choose(game, 'Dogma.Enigma Machine')
    request = t.choose(game, 'Safeguard all available standard achievements')
    request = t.choose(game, 'auto')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        red: ['Enigma Machine'],
        safe: ['Mathematics', 'Coal', 'Tools', 'Optics'],
        hand: ['Monotheism', 'Canning'],
      },
    })
  })

  test('dogma: transfer secrets', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'usee'] })
    t.setBoard(game, {
      dennis: {
        red: ['Enigma Machine'],
        safe: ['Mathematics', 'Coal'],
        hand: ['Monotheism', 'Canning'],
      },
      achievements: ['Tools', 'Optics'],
    })

    let request
    request = game.run()
    request = t.choose(game, 'Dogma.Enigma Machine')
    request = t.choose(game, 'Transfer all your secrets to your hand')
    request = t.choose(game, 'auto')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        red: ['Enigma Machine'],
        hand: ['Monotheism', 'Canning', 'Mathematics', 'Coal'],
      },
    })
  })

  test('dogma: transfer hand to achievements', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'usee'] })
    t.setBoard(game, {
      dennis: {
        red: ['Enigma Machine'],
        safe: ['Mathematics', 'Coal'],
        hand: ['Monotheism', 'Canning'],
      },
      achievements: ['Tools', 'Optics'],
    })

    let request
    request = game.run()
    request = t.choose(game, 'Dogma.Enigma Machine')
    request = t.choose(game, 'Transfer all cards in your hand to the available achievements')
    request = t.choose(game, 'auto')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        red: ['Enigma Machine'],
        safe: ['Mathematics', 'Coal'],
      },
      standardAchievements: ['Monotheism', 'Canning', 'Tools', 'Optics'],
    })
  })

})
