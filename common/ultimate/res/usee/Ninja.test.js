Error.stackTraceLimit = 100
const t = require('../../testutil.js')
describe('Ninja', () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'usee'] })
    t.setBoard(game, {
      dennis: {
        red: ['Ninja', 'Metalworking'],
      },
      micah: {
        blue: ['Mathematics'],
        red: ['Optics'],
        hand: ['Tools', 'Domestication']
      },
    })

    let request
    request = game.run()
    request = t.choose(game, 'Dogma.Ninja')
    request = t.choose(game, 'blue')
    request = t.choose(game, 'red')

    const colorChoices = game.log.getLog().filter(entry => entry.template === '{player} chooses {color}')
    expect(colorChoices).toHaveLength(1)
    expect(colorChoices[0].args.color.value).toBe('blue')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        red: {
          cards: ['Ninja', 'Metalworking'],
          splay: 'right',
        },
        blue: ['Mathematics'],
      },
      micah: {
        red: ['Optics'],
        hand: ['Domestication'],
      },
    })
  })

  test('dogma: opponent reveals hand when they have no card of the chosen color', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'usee'] })
    t.setBoard(game, {
      dennis: {
        red: ['Ninja'],
      },
      micah: {
        hand: ['Tools', 'Domestication'],
      },
    })

    let request
    request = game.run()
    request = t.choose(game, 'Dogma.Ninja')
    request = t.choose(game, 'red')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        red: ['Ninja'],
      },
      micah: {
        hand: ['Tools', 'Domestication'],
      },
    })

    const micah = game.players.byName('micah')
    const hand = game.cards.byPlayer(micah, 'hand')
    expect(hand.every(card => card.revealed())).toBe(true)

    const colorChoices = game.log.getLog().filter(entry => entry.template === '{player} chooses {color}')
    expect(colorChoices).toHaveLength(1)
    expect(colorChoices[0].args.color.value).toBe('red')
  })

})
