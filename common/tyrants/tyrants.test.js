Error.stackTraceLimit = 100

const {
  GameOverEvent,
  InputRequestEvent,
} = require('../lib/game.js')

const t = require('./testutil.js')


describe('Tyrants', () => {

  test('game initializes', () => {
    const game = t.fixture()
    const request1 = game.run()
  })

  describe('deploy troops', () => {

    test('deploy a troop', () => {
      const game = t.gameFixture({
        dennis: {
          hand: ['Spellspinner'],
          power: 1,
        }
      })
      const request1 = game.run()
      const request2 = t.choose(game, request1, 'Use Power.Deploy a Troop')
      const request3 = t.choose(game, request2, 'ched-llace a')

      t.testBoard(game, {
        dennis: {
          hand: ['Spellspinner'],
          power: 0,
        },
      })

      t.testTroops(game, 'ched-llace a', ['dennis'])
    })

    test('unable to deploy when location is full', () => {
      const game = t.gameFixture({
        dennis: {
          power: 1,
        },
        'Ched Nasad': {
          troops: ['neutral', 'neutral', 'neutral']
        },
      })

      const request1 = game.run()
      const request2 = t.choose(game, request1, 'Use Power.Deploy a Troop')

      expect(request2.selectors[0].choices).toStrictEqual([
        "ched-halls a",
        "ched-llace a"
      ])
    })

    test('option not available if no troops', () => {
      const game = t.gameFixture({
        dennis: {
          hand: ['Spellspinner'],
          power: 1,
          troops: 0,
        },
      })

      const request1 = game.run()

      expect(request1.selectors[0].choices).toStrictEqual([
        {
          "title": "Play Card",
          "choices": [
            "Spellspinner"
          ],
          "min": 0,
          "max": 1
        },
        "Pass"
      ])

    })
  })

  test('assassinate a troop with power', () => {
    const game = t.gameFixture({
      dennis: {
        hand: ['Spellspinner'],
        power: 3,
      },
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Use Power.Assassinate a Troop')

    t.testBoard(game, {
      dennis: {
        hand: ['Spellspinner'],
        power: 0,
        trophyHall: ['neutral'],
      },
      'araum-ched': {
        troops: []
      },
    })
  })

  test('return a spy with power', () => {
    const game = t.gameFixture({
      dennis: {
        hand: ['Spellspinner'],
        power: 3,
      },
      'Ched Nasad': {
        spies: ['micah'],
      },
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Use Power.Return an Enemy Spy')
    const request3 = t.choose(game, request2, 'spy.Ched Nasad, micah')

    t.testBoard(game, {
      dennis: {
        hand: ['Spellspinner'],
        power: 0,
      },
      'Ched Nasad': {
        troops: ['dennis'],
        spies: [],
      },
    })

  })

  test('option not available if no valid locations', () => {
    const game = t.gameFixture({
      dennis: {
        hand: ['Spellspinner'],
        power: 1,
      },
      'Ched Nasad': {
        troops: ['neutral', 'neutral', 'neutral'],
      },
      'ched-llace a': {
        troops: ['neutral'],
      },
      'ched-halls a': {
        troops: ['neutral'],
      },
    })

    const request1 = game.run()

    expect(request1.selectors[0].choices).toStrictEqual([
      {
        "title": "Play Card",
        "choices": [
          "Spellspinner"
        ],
        "min": 0,
        "max": 1
      },
      "Pass"
    ])

  })

})

test('recruit a minion', () => {
  const game = t.gameFixture({
    dennis: {
      hand: [],
      influence: 5,
    }
  })

  const request1 = game.run()
  const request2 = t.choose(game, request1, 'Recruit.Spellspinner')

  t.testBoard(game, {
    dennis: {
      hand: [],
      discard: ['Spellspinner'],
      influence: 2,
    },
  })
})

describe('control tokens', () => {
  test('gain influence at start of turn', () => {
    const game = t.gameFixture({
      Menzoberranzan: {
        troops: ['dennis', 'dennis', 'dennis', 'dennis']
      }
    })

    const request1 = game.run()

    t.testBoard(game, {
      dennis: {
        hand: ['Noble', 'Noble', 'Noble', 'Noble', 'Noble'],
        influence: 1,
      },
    })
  })

  test('gain influence when claimed', () => {
    const game = t.gameFixture({
      dennis: {
        power: 1,
      },
      Menzoberranzan: {
        troops: [],
        spies: ['dennis'],
      }
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Use Power.Deploy a Troop')
    const request3 = t.choose(game, request2, 'Menzoberranzan')

    t.testBoard(game, {
      dennis: {
        hand: ['Noble', 'Noble', 'Noble', 'Noble', 'Noble'],
        influence: 1,
      },
    })
  })

  test('gain points if total control', () => {
    const game = t.gameFixture({
      dennis: {
        hand: [],
      },
      Menzoberranzan: {
        troops: ['dennis', 'dennis', 'dennis', 'dennis', 'dennis', 'dennis']
      }
    })

    const request1 = game.run()

    t.testBoard(game, {
      dennis: {
        points: 2,
      },
    })
  })

  test('do not gain points without total control', () => {
    const game = t.gameFixture({
      dennis: {
        hand: [],
      },
      Menzoberranzan: {
        troops: ['dennis', 'dennis', 'dennis', 'dennis', 'dennis']
      }
    })

    const request1 = game.run()

    t.testBoard(game, {
      dennis: {
        points: 0,
      },
    })
  })

  test.skip('ownership is lost if control is lost', () => {
    // Not sure how to test this meaningfully.
  })
})
