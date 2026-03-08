Error.stackTraceLimit = 100
const t = require('../../testutil.js')
describe('Hitchhiking', () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'usee'] })
    t.setBoard(game, {
      dennis: {
        green: ['Hitchhiking'],
        hand: ['Coal', 'Astronomy'],
      },
      micah: {
        hand: ['Domestication'],
      },
      decks: {
        usee: {
          1: ['Myth'],
        },
      }
    })

    let request
    request = game.run()
    request = t.choose(game, 'Dogma.Hitchhiking')

    // Domestication self-executes: "Meld the lowest card from your hand"
    // Coal and Astronomy are tied at age 5, so there's a choice.
    // Micah (decision maker) should be the actor, not Dennis.
    expect(game.waiting.selectors[0].actor).toBe('micah')
    request = t.choose(game, 'Coal')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        red: ['Coal'],
        green: ['Hitchhiking'],
        yellow: ['Domestication'],
        hand: ['Astronomy', 'Myth'],
      },
    })
  })

  test('dogma - decision maker with Measurement', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'usee'] })
    t.setBoard(game, {
      dennis: {
        green: ['Hitchhiking'],
        hand: ['Coal', 'Astronomy'],
      },
      micah: {
        hand: ['Measurement'],
      },
    })

    let request
    request = game.run()
    request = t.choose(game, 'Dogma.Hitchhiking')

    // Measurement self-executes: "You may reveal and return a card from your hand"
    // Micah should be the actor for this optional chooseCard
    expect(game.waiting.selectors[0].actor).toBe('micah')
  })

  test('dogma - decision maker with Tools', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'usee'] })
    t.setBoard(game, {
      dennis: {
        green: ['Hitchhiking'],
        hand: ['Coal', 'Astronomy', 'Gunpowder'],
      },
      micah: {
        hand: ['Tools'],
      },
    })

    let request
    request = game.run()
    request = t.choose(game, 'Dogma.Hitchhiking')

    // Tools self-executes: "You may return three cards from your hand..."
    // The chooseYesNo should go to Micah
    expect(game.waiting.selectors[0].actor).toBe('micah')
    // Micah decides yes
    request = t.choose(game, 'yes')
    // The chooseAndReturn should also go to Micah
    expect(game.waiting.selectors[0].actor).toBe('micah')
  })

})
