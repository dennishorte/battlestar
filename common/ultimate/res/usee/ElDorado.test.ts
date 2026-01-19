Error.stackTraceLimit = 100
import t from '../../testutil.js'
describe('El Dorado', () => {

  test('dogma: 3 with crowns', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'usee'] })
    t.setBoard(game, {
      dennis: {
        green: ['El Dorado'],
      },
      decks: {
        base: {
          1: ['Oars'],
          2: ['Mapmaking'],
          5: [
            "Astronomy",
            "Banking",
            "Chemistry",
            "Coal",
            "Measurement",
            "Physics",
            "Societies",
            "Steam Engine",
            "The Pirate Code",
          ],
        },
        usee: {
          3: ['Smuggling'],
        },
      },
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.El Dorado')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        red: ['Oars'],
        green: {
          cards: ['Mapmaking', 'Smuggling', 'El Dorado'],
          splay: 'right',
        },
        score: [
          "Astronomy",
          "Banking",
          "Chemistry",
          "Coal",
          "Measurement",
          "Physics",
          "Societies",
          "Statistics",
          "Steam Engine",
          "The Pirate Code",
        ],
      },
    })
  })

  test('dogma: 2 with crowns', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'usee'] })
    t.setBoard(game, {
      dennis: {
        green: ['El Dorado'],
      },
      decks: {
        base: {
          1: ['Oars'],
          2: ['Mapmaking'],
        },
        usee: {
          3: ['Cliffhanger'],
        },
      },
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.El Dorado')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        red: ['Oars'],
        green: {
          cards: ['Mapmaking', 'Cliffhanger', 'El Dorado'],
          splay: 'right',
        },
      },
    })
  })

  test('dogma: 1 with crowns', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'usee'] })
    t.setBoard(game, {
      dennis: {
        green: ['El Dorado'],
      },
      decks: {
        base: {
          1: ['Archery'],
          2: ['Mapmaking'],
        },
        usee: {
          3: ['Cliffhanger'],
        },
      },
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.El Dorado')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        red: ['Archery'],
        green: ['Mapmaking', 'Cliffhanger', 'El Dorado'],
      },
    })
  })

})
