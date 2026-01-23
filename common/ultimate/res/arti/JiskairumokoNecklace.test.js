Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe("Jiskairumoko Necklace", () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'arti'] })
    t.setBoard(game,  {
      dennis: {
        artifact: ["Jiskairumoko Necklace"],
      },
      micah: {
        red: ['Metalworking'],
        score: ['Tools'],
        achievements: ['Sailing', 'Construction'],
      },
      achievements: [],
    })

    let request
    request = game.run()
    request = t.choose(game, 'dogma')

    t.testIsFirstAction(request)
    t.testBoard(game, {
      dennis: {
        achievements: ['Sailing'],
        museum: ['Museum 1', 'Jiskairumoko Necklace'],
      },
      micah: {
        red: ['Metalworking'],
        achievements: ['Construction'],
      },
      junk: [
        "Agriculture",
        "Archery",
        "City States",
        "Clothing",
        "Code of Laws",
        "Domestication",
        "Masonry",
        "Mysticism",
        "Oars",
        "Pottery",
        "The Wheel",
        "Tools",
        "Writing",
      ],
    })
  })

  test('dogma: nothing to return', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'arti'] })
    t.setBoard(game,  {
      dennis: {
        artifact: ["Jiskairumoko Necklace"],
      },
      micah: {
        red: ['Metalworking'],
        achievements: ['Sailing', 'Construction'],
      },
    })

    let request
    request = game.run()
    request = t.choose(game, 'dogma')

    t.testIsFirstAction(request)
    t.testBoard(game, {
      dennis: {
        museum: ['Museum 1', 'Jiskairumoko Necklace'],
      },
      micah: {
        red: ['Metalworking'],
        achievements: ['Sailing', 'Construction'],
      },
    })
  })

  test('dogma: no matching achievements', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'arti'] })
    t.setBoard(game,  {
      dennis: {
        artifact: ["Jiskairumoko Necklace"],
      },
      micah: {
        red: ['Metalworking'],
        score: ['Coal'],
        achievements: ['Sailing', 'Construction'],
      },
    })

    let request
    request = game.run()
    request = t.choose(game, 'dogma')

    t.testIsFirstAction(request)
    t.testBoard(game, {
      dennis: {
        museum: ['Museum 1', 'Jiskairumoko Necklace'],
      },
      micah: {
        red: ['Metalworking'],
        achievements: ['Sailing', 'Construction'],
      },
    })
  })

})
