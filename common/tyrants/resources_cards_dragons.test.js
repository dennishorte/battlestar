Error.stackTraceLimit = 100

const {
  GameOverEvent,
  InputRequestEvent,
} = require('../lib/game.js')

const t = require('./testutil.js')


describe('Dragons Expansion Cards', () => {

  describe('Dragon Cultist', () => {
    test('Choose power', () => {
      const game = t.gameFixture({
        dennis: {
          hand: ['Dragon Cultist'],
        }
      })

      const request1 = game.run()
      const request2 = t.choose(game, request1, 'Play Card.Dragon Cultist')
      const request3 = t.choose(game, request2, '+2 power')

      t.testBoard(game, {
        dennis: {
          hand: [],
          played: ['Dragon Cultist'],
          power: 2,
        }
      })
    })

    test('Choose influence', () => {
      const game = t.gameFixture({
        dennis: {
          hand: ['Dragon Cultist'],
        }
      })

      const request1 = game.run()
      const request2 = t.choose(game, request1, 'Play Card.Dragon Cultist')
      const request3 = t.choose(game, request2, '+2 influence')

      t.testBoard(game, {
        dennis: {
          hand: [],
          played: ['Dragon Cultist'],
          influence: 2,
        }
      })
    })
  })

  describe('Red Wyrmling', () => {
    test('power and influence', () => {
      const game = t.gameFixture({
        dennis: {
          hand: ['Red Wyrmling'],
        }
      })

      const request1 = game.run()
      const request2 = t.choose(game, request1, 'Play Card.Red Wyrmling')

      t.testBoard(game, {
        dennis: {
          hand: [],
          played: ['Red Wyrmling'],
          power: 2,
          influence: 2,
        }
      })
    })
  })

  describe('Dragonclaw', () => {
    test('Assassinate a troop', () => {
      const game = t.gameFixture({
        dennis: {
          hand: ['Dragonclaw'],
        }
      })

      const request1 = game.run()
      const request2 = t.choose(game, request1, 'Play Card.Dragonclaw')

      t.testBoard(game, {
        dennis: {
          discard: ['Dragonclaw'],
          trophyHall: ['neutral'],
        },
        'araum-ched': {
          troops: [],
        },
      })
    })

    test('If you have 4 or fewer troops, do not gain any power', () => {
      const game = t.gameFixture({
        dennis: {
          hand: ['Dragonclaw'],
          trophyHall: ['micah', 'micah', 'micah']
        }
      })

      const request1 = game.run()
      const request2 = t.choose(game, request1, 'Play Card.Dragonclaw')

      t.testBoard(game, {
        dennis: {
          discard: ['Dragonclaw'],
          trophyHall: ['troop-micah', 'troop-micah', 'troop-micah', 'neutral'],
        },
        'araum-ched': {
          troops: [],
        },
      })
    })

    test('If you have 5 or more troops in your trophy hall, gain +2 power', () => {
      const game = t.gameFixture({
        dennis: {
          hand: ['Dragonclaw'],
          trophyHall: ['micah', 'micah', 'micah', 'micah']
        }
      })

      const request1 = game.run()
      const request2 = t.choose(game, request1, 'Play Card.Dragonclaw')

      t.testBoard(game, {
        dennis: {
          hand: [],
          played: ['Dragonclaw'],
          trophyHall: ['troop-micah', 'troop-micah', 'troop-micah', 'troop-micah', 'neutral'],
          power: 2,
        },
        'araum-ched': {
          troops: [],
        },
      })
    })
  })

  describe('Severin Silrajin', () => {
    test('power', () => {
      const game = t.gameFixture({
        dennis: {
          hand: ['Severin Silrajin'],
        }
      })

      const request1 = game.run()
      const request2 = t.choose(game, request1, 'Play Card.Severin Silrajin')

      t.testBoard(game, {
        dennis: {
          hand: [],
          played: ['Severin Silrajin'],
          power: 5,
        }
      })
    })
  })

  describe('Red Dragon', () => {
    test('supplant a troop', () => {
      const game = t.gameFixture({
        dennis: {
          hand: ['Red Dragon'],
        }
      })

      const request1 = game.run()
      const request2 = t.choose(game, request1, 'Play Card.Red Dragon')

      t.testBoard(game, {
        dennis: {
          discard: ['Red Dragon'],
          trophyHall: ['neutral'],
        },
        'araum-ched': {
          troops: ['dennis'],
          spies: []
        }
      })
    })

    test('return an enemy spy', () => {
      const game = t.gameFixture({
        dennis: {
          hand: ['Red Dragon'],
        },
        'Araumycos': {
          spies: ['micah']
        }
      })

      const request1 = game.run()
      const request2 = t.choose(game, request1, 'Play Card.Red Dragon')

      t.testBoard(game, {
        dennis: {
          discard: ['Red Dragon'],
          trophyHall: ['neutral'],
        },
        'araum-ched': {
          troops: ['dennis'],
          spies: []
        },
        'Araumycos': {
          troops: ['neutral', 'neutral', 'neutral', 'neutral'],
          spies: []
        },
      })
    })

    test('gain a VP for each site under your total control', () => {
      const game = t.gameFixture({
        dennis: {
          hand: ['Red Dragon'],
        },
        'Araumycos': {
          spies: ['micah', 'micah']
        },
        'Llacerellyn': {
          troops: ['dennis', 'dennis'],
        },
        'Chasmleap Bridge': {
          troops: ['dennis'],
        },
      })

      const request1 = game.run()
      const request2 = t.choose(game, request1, 'Play Card.Red Dragon')
      const request3 = t.choose(game, request2, 'araum-ched, neutral')

      t.testBoard(game, {
        dennis: {
          discard: ['Red Dragon'],
          trophyHall: ['neutral'],
          points: 2,
        },
        'araum-ched': {
          troops: ['dennis'],
          spies: []
        },
        'Araumycos': {
          troops: ['neutral', 'neutral', 'neutral', 'neutral'],
          spies: []
        },
        'Chasmleap Bridge': {
          troops: ['dennis'],
        },
        'Llacerellyn': {
          troops: ['dennis', 'dennis'],
        },
      })
    })
  })

})
