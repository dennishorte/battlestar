Error.stackTraceLimit = 100
import t from '../../testutil.js'
describe('Dance', () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'usee'] })
    t.setBoard(game, {
      dennis: {
        yellow: ['Domestication'],
        green: ['Dance'],
      },
      micah: {
        green: ['Navigation'],
        red: ['Gunpowder'],
        blue: ['Atomic Theory'],
      },
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Dance')

    t.testChoices(request, ['Gunpowder', 'Navigation'])

    request = t.choose(game, request, 'Gunpowder')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        red: ['Gunpowder'],
        green: ['Dance'],
      },
      micah: {
        yellow: ['Domestication'],
        green: ['Navigation'],
        blue: ['Atomic Theory'],
      },
    })
  })

  test('dogma: nothing to swap', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'usee'] })
    t.setBoard(game, {
      dennis: {
        yellow: ['Skyscrapers'],
        green: ['Dance'],
      },
      micah: {
        green: ['Navigation'],
        red: ['Gunpowder'],
        blue: ['Atomic Theory'],
      },
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Dance')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        yellow: ['Skyscrapers'],
        green: ['Dance'],
      },
      micah: {
        red: ['Gunpowder'],
        green: ['Navigation'],
        blue: ['Atomic Theory'],
      },
    })
  })

})
